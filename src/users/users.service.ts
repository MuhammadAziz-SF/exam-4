import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { encrypt, decrypt } from 'src/utils/bcrypt-encrypt';
import { generateOTP } from 'src/utils/otp-gen';
import { LogInDto } from './dto/login.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { catchError } from 'src/utils/catch-error';
import { Cache } from '@nestjs/cache-manager';
import { ConfirmLoginDto } from './dto/confirm-login.dto';
import { writeToCookie, clearCookie } from 'src/utils/cookie';
import { Response } from 'express';
import { Op } from 'sequelize';
import { MailService } from 'src/mail/email.service';
import { TokenService } from 'src/services/jwt-gen';
import { Product } from '../product/models/product.model';
import { successRes } from 'src/utils/success-response';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private model: typeof User,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly mailService: MailService,
    private readonly tokenService: TokenService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { email, password, phone_number } = createUserDto;

      const existingUser = await this.model.findOne({
        where: {
          [Op.or]: [{ email }, { phone_number }],
        },
      });

      if (existingUser) {
        throw new ConflictException(
          existingUser.email === email
            ? 'Email already exists'
            : 'Phone number already exists',
        );
      }

      const hashedPassword = await encrypt(password);
      const newUser = await this.model.create({
        ...createUserDto,
        hashed_password: hashedPassword,
      });

      const { hashed_password, ...result } = newUser.toJSON();
      return {
        statusCode: 201,
        message: 'User created successfully',
        data: result,
      };
    } catch (error) {
      return catchError(error);
    }
  }

  async SignInUser(logInDto: LogInDto) {
    try {
      const { email, password } = logInDto;

      const user = await this.model.findOne({ where: { email } });
      if (!user) {
        throw new BadRequestException('Password or email incorrect');
      }

      const isPasswordValid = await decrypt(password, user.hashed_password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const otp = generateOTP();
      await this.mailService.sendOtp(user.email, String(otp));
      await this.cacheManager.set(email, otp, 900000);

      return {
        statusCode: 200,
        message: 'success',
        data: email,
      };
    } catch (error) {
      return catchError(error);
    }
  }

  async confirmLogin(
    confirmLoginDto: ConfirmLoginDto,
    res: Response,
  ): Promise<Response> {
    try {
      const { email, otp } = confirmLoginDto;

      const cachedOtp = await this.cacheManager.get(email);

      if (!cachedOtp || cachedOtp != otp) {
        throw new BadRequestException('OTP expired or invalid');
      }

      const user = await this.model.findOne({ where: { email } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const { id, role } = user.dataValues;
      const payload = { id, role };
      const accessToken = await this.tokenService.generateAccessToken(payload);
      const refreshToken =
        await this.tokenService.generateRefreshToken(payload);
      writeToCookie(res, 'refreshTokenUser', refreshToken);

      return res.status(200).json({
        statusCode: 200,
        message: 'success',
        data: accessToken,
      });
    } catch (error) {
      return catchError(error);
    }
  }

  async logOut(res: Response) {
    try {
      clearCookie(res, 'refreshTokenUser');
      return {
        statusCode: 200,
        message: 'Logout successfully',
      };
    } catch (error) {
      return catchError(error);
    }
  }

  async findAll() {
    try {
      // Get all users without products
      const users = await this.model.findAll({
        attributes: { exclude: ['hashed_password'] },
      });

      // Process each user to check if they have products
      const usersWithConditionalProducts = await Promise.all(
        users.map(async (user) => {
          // Check if user has products
          const products = await Product.findAll({
            where: { seller_id: user.id },
          });

          // If products exist, get user with products included
          if (products && products.length > 0) {
            return await this.model.findByPk(user.id, {
              attributes: { exclude: ['hashed_password'] },
              include: [
                {
                  model: Product,
                  as: 'products',
                },
              ],
            });
          }

          // If no products, return just the user
          return user;
        }),
      );

      return successRes(usersWithConditionalProducts, 200);
    } catch (error) {
      return catchError(error);
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.model.findByPk(id, {
        attributes: { exclude: ['hashed_password'] },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const products = await Product.findAll({
        where: { seller_id: id },
      });

      if (products && products.length > 0) {
        const userWithProducts = await this.model.findByPk(id, {
          attributes: { exclude: ['hashed_password'] },
          include: [
            {
              model: Product,
              as: 'products',
            },
          ],
        });
        return successRes(userWithProducts, 200);
      }

      return successRes(user, 200);
    } catch (error) {
      return catchError(error);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.model.findByPk(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (updateUserDto.password) {
        const hashedPassword = await encrypt(updateUserDto.password);
        await user.update({
          ...updateUserDto,
          hashed_password: hashedPassword,
        });
      } else {
        await user.update(updateUserDto);
      }

      const updatedUser = await this.model.findByPk(id, {
        attributes: { exclude: ['hashed_password'] },
      });

      return {
        statusCode: 200,
        message: 'User updated successfully',
        data: updatedUser,
      };
    } catch (error) {
      return catchError(error);
    }
  }

  async remove(id: string) {
    try {
      const user = await this.model.findByPk(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      await user.destroy();
      return {
        statusCode: 200,
        message: 'User deleted successfully',
      };
    } catch (error) {
      return catchError(error);
    }
  }
}
