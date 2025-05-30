import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  UnauthorizedException
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { encrypt, decrypt } from 'src/utils/bcrypt-encrypt';
import { Roles } from 'src/enum';
import { generateOTP } from 'src/utils/otp-gen';
import { LogInDto } from './dto/login.dto';
import { STRING } from 'sequelize';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { catchError } from 'src/utils/catch-error';
import { Cache } from 'cache-manager';
import { ConfirmLoginDto } from './dto/confirm-login.dto';
import { writeToCookie, clearCookie } from 'src/utils/cookie';
import { Response } from 'express';

@Injectable()
export class UsersService {
  mailService: any;
  cacheManager: any;
  tokenService: any;
  constructor(@InjectModel(User) private model: typeof User) {}

  async SignInUser(logInDto: LogInDto){
    try {
      const{email, password} = logInDto;

      const user = await this.model.findOne({where: {email}});

      if(!user){
        throw new BadRequestException('Password or email incorrect')
      }
      const isPasswordValid = await decrypt(password, user.hashed_password);

      if(!isPasswordValid){
        throw new UnauthorizedException(Error)
      }

      const otp = generateOTP();
      await this.mailService.sentOtp(user.email, STRING(otp));
      await this.cacheManager.set(email, otp, 300);
      return {
        statusCode: 200,
        message: 'success',
        data: email,
      }
    } catch (error) {
      return catchError(error);
    }
  }

  async confirmLogin(confirmLoginDto: ConfirmLoginDto, res: Response): Promise<object> {
    try {
      const {email, otp} = confirmLoginDto;
      const hasUser = await this.cacheManager.get(email);
      if(!hasUser || hasUser != otp){
        throw new BadRequestException('Otp expired');
      }
      const user = await this.model.findOne({where: {email}});
      const {id, role} = user?.dataValues;
      const payload = {id, role};
      const accessToken = await this.tokenService.generateAccessToken(payload);
      const refreshToken = await this.tokenService.generateRefreshToken(payload);
      writeToCookie(res, 'refreshTokenUser', refreshToken);
      return{
        statusCode: 200,
        message: 'success',
        data: accessToken
      }
    } catch (error) {
      return catchError(error);
    }
  }

  async logOut(res: Response){
    try {
      clearCookie(res, 'refreshTokenUser');
      return{
        statusCode: 200,
        message: 'Logout successfully',
      };
    } catch (error) {
      return catchError(error)
    }
  }

  async findAll() {
    const users = await this.model.findAll();
    return {
      statusCode: 200,
      message: 'success',
      data: users,
    };
  }

  async findOne(id: number) {
    const user = await this.model.findByPk(id);
    if (!user) {
      return {
        statusCode: 404,
        message: 'Not found',
      };
    }
    return {
      statusCode: 200,
      message: 'success',
      data: user,
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const updateUser = await this.model.update(updateUserDto, {
      where: { id },
      returning: true,
    });
    if (updateUser[0] === 0) {
      return {
        statusCode: 404,
        message: 'Not found',
      };
    }
    return updateUser[1][0];
  }

  async remove(id: number) {
    await this.model.destroy({ where: { id } });
    return {};
  }
}
