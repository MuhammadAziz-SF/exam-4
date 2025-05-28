import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Response } from 'express';
import { Admin } from './models/admin.model';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { decrypt, encrypt } from '../utils/bcrypt-encrypt';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { Roles, Status } from '../enum';
import { TokenService } from '../services/jwt-gen';
import config from '../config';
import { writeToCookie, clearCookie } from '../utils/cookie';
import { catchError } from 'src/utils/catch-error';
import { Op } from 'sequelize';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin)
    private readonly adminModel: typeof Admin,
    private readonly tokenService: TokenService,
  ) {}

  async onModuleInit(): Promise<void> {
    try {
      const isSuperAdmin = await this.adminModel.findOne({
        where: { role: Roles.SUPER_ADMIN },
      });
      if (!isSuperAdmin) {
        const hashedPassword = await encrypt(config.ADMIN_PASSWORD);
        await this.adminModel.create({
          full_name: config.ADMIN_FULL_NAME,
          email: config.ADMIN_EMAIL,
          phone_number: config.ADMIN_PHONE,
          hashed_password: hashedPassword,
          role: Roles.SUPER_ADMIN,
          status: Status.ACTIVE,
        });
      }
    } catch (error) {
      return catchError(error);
    }
  }

  async createAdmin(createAdminDto: CreateAdminDto) {
    try {
      const { email, phone_number, password } = createAdminDto;

      const existingAdmin = await this.adminModel.findOne({
        where: {
          [Op.or]: [{ email }, { phone_number }],
        },
      });

      if (existingAdmin) {
        throw new ConflictException(
          existingAdmin.email === email
            ? 'Email already exists'
            : 'Phone number already exists',
        );
      }

      const hashedPassword = await encrypt(password);
      const admin = await this.adminModel.create({
        ...createAdminDto,
        hashed_password: hashedPassword,
        status: Status.ACTIVE,
      });

      const { hashed_password, ...result } = admin.toJSON();
      return {
        statusCode: 201,
        message: 'Admin created successfully',
        data: result,
      };
    } catch (error) {
      return catchError(error);
    }
  }

  async login(loginDto: LoginDto, res: Response) {
    try {
      const { email, password } = loginDto;
      const admin = await this.adminModel.findOne({ where: { email } });

      if (!admin) {
        throw new BadRequestException('Invalid credentials');
      }

      if (admin.status === Status.INACTIVE) {
        throw new UnauthorizedException('Account is inactive');
      }

      const isPasswordValid = await decrypt(password, admin.hashed_password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload: JwtPayload = {
        id: admin.id,
        email: admin.email,
        status: admin.status,
        role: admin.role,
      };

      const accessToken = await this.tokenService.generateAccessToken(payload);
      const refreshToken = await this.tokenService.generateRefreshToken(payload);

      writeToCookie(res, 'refreshToken', refreshToken);

      return {
        statusCode: 200,
        message: 'Login successful',
        data: {
          accessToken,
          admin: {
            id: admin.id,
            full_name: admin.full_name,
            email: admin.email,
            role: admin.role,
          },
        },
      };
    } catch (error) {
      return catchError(error);
    }
  }

  async logout(res: Response) {
    try {
      clearCookie(res, 'refreshToken');
      return {
        statusCode: 200,
        message: 'Logout successful',
      };
    } catch (error) {
      return catchError(error);
    }
  }

  async findAll() {
    try {
      const admins = await this.adminModel.findAll({
        attributes: { exclude: ['hashed_password'] },
      });
      return {
        statusCode: 200,
        message: 'Success',
        data: admins,
      };
    } catch (error) {
      return catchError(error);
    }
  }

  async findOne(id: string) {
    try {
      const admin = await this.adminModel.findByPk(id, {
        attributes: { exclude: ['hashed_password'] },
      });
      if (!admin) {
        throw new NotFoundException('Admin not found');
      }
      return {
        statusCode: 200,
        message: 'Success',
        data: admin,
      };
    } catch (error) {
      return catchError(error);
    }
  }

  async update(id: string, updateAdminDto: UpdateAdminDto) {
    try {
      const admin = await this.adminModel.findByPk(id);
      if (!admin) {
        throw new NotFoundException('Admin not found');
      }

      if (updateAdminDto.password) {
        updateAdminDto.password = await encrypt(updateAdminDto.password);
        delete updateAdminDto.password;
      }

      await admin.update(updateAdminDto);
      const { hashed_password, ...result } = admin.toJSON();

      return {
        statusCode: 200,
        message: 'Admin updated successfully',
        data: result,
      };
    } catch (error) {
      return catchError(error);
    }
  }

  async remove(id: string) {
    try {
      const admin = await this.adminModel.findByPk(id);
      if (!admin) {
        throw new NotFoundException('Admin not found');
      }

      await admin.destroy();
      return {
        statusCode: 200,
        message: 'Admin deleted successfully',
      };
    } catch (error) {
      return catchError(error);
    }
  }
}
