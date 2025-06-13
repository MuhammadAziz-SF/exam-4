import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
  HttpException,
  Inject,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Response } from 'express';
import { Admin } from './models/admin.model';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { decrypt, encrypt } from '../utils/bcrypt-encrypt';
import { LoginDto } from './dto/login.dto';
import { Roles, Status } from '../enum';
import { TokenService } from '../services/jwt-gen';
import config from '../config';
import { writeToCookie, clearCookie } from '../utils/cookie';
import { generateOTP } from '../utils/otp-gen';
import { catchError } from 'src/utils/catch-error';
import { Op } from 'sequelize';
import { MailService } from 'src/mail/email.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfirmSignInAdminDto } from './dto/confirm-signin.dto';
import { ConfirmSignUpAdminDto } from './dto/confirm-signup.dto';
import { successRes } from 'src/utils/success-response';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin)
    private readonly adminModel: typeof Admin,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService,
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

  async superAdminLogin(loginDto: LoginDto, res: Response) {
    try {
      const { email, password } = loginDto;

      const admin = await this.adminModel.findOne({ where: { email } });

      if (!admin) {
        throw new BadRequestException('Invalid credentials');
      }

      if (admin.status === Status.INACTIVE) {
        throw new UnauthorizedException('Account is inactive');
      }

      if (admin.role !== Roles.SUPER_ADMIN) {
        throw new UnauthorizedException(
          'Access denied. Super admin access required.',
        );
      }

      const isPasswordValid = await decrypt(password, admin.hashed_password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const { id, role, status } = admin.dataValues;
      const payload = { id, role, status };
      const accessToken = await this.tokenService.generateAccessToken(payload);
      const refreshToken =
        await this.tokenService.generateRefreshToken(payload);
      writeToCookie(res, 'refreshTokenAdmin', refreshToken);

      return res.status(200).json(successRes({ accessToken }, 200));
    } catch (error) {
      return catchError(error);
    }
  }

  async createAdmin(
    createAdminDto: CreateAdminDto,
    res: Response,
  ): Promise<object> {
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
      const newAdmin = await this.adminModel.create({
        ...createAdminDto,
        hashed_password: hashedPassword,
        status: Status.INACTIVE, // Set status to INACTIVE until confirmed
      });

      const otp = generateOTP();
      await this.mailService.sendOtp(email, String(otp));
      await this.cacheManager.set(`signup_${email}`, otp, 300000);

      return res.status(201).json(successRes({ email }, 201));
    } catch (error) {
      return catchError(error);
    }
  }

  async confirmSignUp(
    confirmSignUpAdminDto: ConfirmSignUpAdminDto,
    res: Response,
  ): Promise<object> {
    try {
      const { email, otp } = confirmSignUpAdminDto;

      const cachedOtp = await this.cacheManager.get(`signup_${email}`);
      if (!cachedOtp || cachedOtp != otp) {
        throw new BadRequestException('Invalid or expired OTP');
      }

      const admin = await this.adminModel.findOne({ where: { email } });
      if (!admin) {
        throw new NotFoundException('Admin not found');
      }

      await admin.update({ status: Status.ACTIVE });

      await this.cacheManager.del(`signup_${email}`);

      const { id, role, status } = admin.dataValues;
      const payload = { id, role, status };
      const accessToken = await this.tokenService.generateAccessToken(payload);
      const refreshToken =
        await this.tokenService.generateRefreshToken(payload);

      writeToCookie(res, 'refreshTokenAdmin', refreshToken);

      return res.status(200).json(successRes({ accessToken }, 200));
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

      const otp = generateOTP();
      await this.mailService.sendOtp(admin.email, String(otp));
      await this.cacheManager.set(email, otp, 300000);
      return res.status(200).json(successRes(email, 200));
    } catch (error) {
      return catchError(error);
    }
  }

  async confirmLogin(
    confirmSignInAdminDto: ConfirmSignInAdminDto,
    res: Response,
  ): Promise<object> {
    try {
      const { email, otp } = confirmSignInAdminDto;
      const hasUser = await this.cacheManager.get(email);
      if (!hasUser || hasUser != otp) {
        throw new BadRequestException('OTP expired');
      }
      const admin = await this.adminModel.findOne({ where: { email } });
      const { id, role, status } = admin?.dataValues;
      const payload = { id, role, status };
      const accessToken = await this.tokenService.generateAccessToken(payload);
      const refreshToken =
        await this.tokenService.generateRefreshToken(payload);
      writeToCookie(res, 'refreshTokenAdmin', refreshToken);
      return res.status(200).json(successRes({ accessToken }, 200));
    } catch (error) {
      return catchError(error);
    }
  }

  async logout(res: Response) {
    try {
      clearCookie(res, 'refreshTokenAdmin');
      return res.status(200).json(successRes(null, 200));
    } catch (error) {
      return catchError(error);
    }
  }

  async findAll(res: Response) {
    try {
      const admins = await this.adminModel.findAll({
        attributes: { exclude: ['hashed_password'] },
      });
      return res.status(200).json(successRes(admins, 200));
    } catch (error) {
      return catchError(error);
    }
  }

  async findOne(id: string, res: Response) {
    try {
      const admin = await this.adminModel.findByPk(id, {
        attributes: { exclude: ['hashed_password'] },
      });
      if (!admin) {
        throw new NotFoundException('Admin not found');
      }
      return res.status(200).json(successRes(admin, 200));
    } catch (error) {
      return catchError(error);
    }
  }

  async update(id: string, updateAdminDto: UpdateAdminDto, res: Response) {
    try {
      const admin = await this.adminModel.findByPk(id);
      if (!admin) {
        throw new NotFoundException('Admin not found');
      }

      if (updateAdminDto.email || updateAdminDto.phone_number) {
        const existingAdmin = await this.adminModel.findOne({
          where: {
            [Op.and]: [
              {
                [Op.or]: [
                  updateAdminDto.email ? { email: updateAdminDto.email } : {},
                  updateAdminDto.phone_number
                    ? { phone_number: updateAdminDto.phone_number }
                    : {},
                ],
              },
              { id: { [Op.ne]: id } },
            ],
          },
        });

        if (existingAdmin) {
          throw new ConflictException(
            existingAdmin.email === updateAdminDto.email
              ? 'Email already exists'
              : 'Phone number already exists',
          );
        }
      }

      if (updateAdminDto.password) {
        const hashedPassword = await encrypt(updateAdminDto.password);
        await admin.update({
          ...updateAdminDto,
          hashed_password: hashedPassword,
        });
      } else {
        await admin.update(updateAdminDto);
      }

      const updatedAdmin = await this.adminModel.findByPk(id, {
        attributes: { exclude: ['hashed_password'] },
      });

      return res.status(200).json(successRes(updatedAdmin, 200));
    } catch (error) {
      return catchError(error);
    }
  }

  async remove(id: string, res: Response) {
    try {
      const admin = await this.adminModel.findByPk(id);
      if (!admin) {
        throw new NotFoundException('Admin not found');
      }

      await admin.destroy();
      return res.status(200).json(successRes(null, 200));
    } catch (error) {
      return catchError(error);
    }
  }
}
