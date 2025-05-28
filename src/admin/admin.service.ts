import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { Admin } from './models/admin.model';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { decrypt, encrypt } from '../utils/bcrypt-encrypt';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { Roles } from '../enum';
import { EmailService } from './services/email.service';

@Injectable()
export class AdminService {
  private otpMap = new Map<string,{ otp: number; expiresAt: Date; isVerified: boolean }>();

  constructor(
    @InjectModel(Admin)
    private readonly adminModel: typeof Admin,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  private generateOTP(): number {
    try {
      return Math.floor(100000 + Math.random() * 900000);
    } catch (error) {
      throw new InternalServerErrorException('Error generating OTP');
    }
  }

  async sendOTP(email: string) {
    try {
      const otp = this.generateOTP();
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 5); // OTP expires in 5 minutes

      this.otpMap.set(email, { otp, expiresAt, isVerified: false });

      const emailSent = await this.emailService.sendOTP(email, otp);
      if (!emailSent) {
        throw new InternalServerErrorException('Failed to send OTP email');
      }

      return {
        statusCode: 200,
        message: 'OTP sent successfully',
      };
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException('Error sending OTP');
    }
  }

  async verifyOTP(email: string, otp: number) {
    try {
      const otpData = this.otpMap.get(email);
      if (!otpData) {
        throw new UnauthorizedException('OTP not found or expired');
      }

      if (otpData.otp !== otp) {
        throw new UnauthorizedException('Invalid OTP');
      }

      if (new Date() > otpData.expiresAt) {
        this.otpMap.delete(email);
        throw new UnauthorizedException('OTP expired');
      }

      otpData.isVerified = true;
      return {
        statusCode: 200,
        message: 'OTP verified successfully',
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Error verifying OTP');
    }
  }

  async createAdmin(createAdminDto: CreateAdminDto) {
    try {
      const { email, phone_number } = createAdminDto;

      const existingEmail = await this.adminModel.findOne({ where: { email } });
      if (existingEmail) {
        throw new ConflictException('Email already exists');
      }

      const existingPhone = await this.adminModel.findOne({
        where: { phone_number },
      });
      if (existingPhone) {
        throw new ConflictException('Phone number already exists');
      }

      await this.sendOTP(email);

      return {
        statusCode: 200,
        message:
          'OTP sent to your email. Please verify to complete registration.',
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Error in registration process');
    }
  }

  async verifyAndCreateAdmin(createAdminDto: CreateAdminDto, otp: number) {
    try {
      const { email } = createAdminDto;
      const otpData = this.otpMap.get(email);

      if (!otpData || !otpData.isVerified || otpData.otp !== otp) {
        throw new UnauthorizedException('Please verify your email first');
      }

      const hashed_password = await encrypt(createAdminDto.password);
      const admin = await this.adminModel.create({
        ...createAdminDto,
        hashed_password,
        role: Roles.ADMIN,
      });

      this.otpMap.delete(email);

      const payload: JwtPayload = {
        id: admin.id,
        role: admin.role,
        email: admin.email,
      };

      const token = this.jwtService.sign(payload);

      return {
        statusCode: 201,
        message: 'Admin created successfully',
        data: {
          token,
          admin: {
            id: admin.id,
            email: admin.email,
            full_name: admin.full_name,
            role: admin.role,
          },
        },
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Error completing registration');
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const { email, password } = loginDto;
      const admin = await this.adminModel.findOne({ where: { email } });

      if (!admin) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await decrypt(password, admin.hashed_password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Send OTP for login verification
      await this.sendOTP(email);

      return {
        statusCode: 200,
        message: 'OTP sent to your email. Please verify to complete login.',
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Error in login process');
    }
  }

  async verifyAndLogin(email: string, otp: number) {
    try {
      const admin = await this.adminModel.findOne({ where: { email } });
      if (!admin) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const otpData = this.otpMap.get(email);
      if (!otpData || !otpData.isVerified || otpData.otp !== otp) {
        throw new UnauthorizedException('Please verify your email first');
      }

      const payload: JwtPayload = {
        id: admin.id,
        role: admin.role,
        email: admin.email,
      };

      const token = this.jwtService.sign(payload);
      this.otpMap.delete(email);

      return {
        statusCode: 200,
        message: 'Login successful',
        data: {
          token,
          admin: {
            id: admin.id,
            email: admin.email,
            full_name: admin.full_name,
            role: admin.role,
          },
        },
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Error completing login');
    }
  }

  async findAll() {
    try {
      const admins = await this.adminModel.findAll();
      return {
        statusCode: 200,
        message: 'Success',
        data: admins,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error fetching admins');
    }
  }

  async findOne(id: string) {
    try {
      const admin = await this.adminModel.findByPk(id);
      if (!admin) {
        throw new ConflictException('Admin not found');
      }
      return {
        statusCode: 200,
        message: 'Success',
        data: admin,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Error fetching admin');
    }
  }

  async update(id: string, updateAdminDto: UpdateAdminDto) {
    try {
      const admin = await this.adminModel.findByPk(id);
      if (!admin) {
        throw new ConflictException('Admin not found');
      }

      await admin.update(updateAdminDto);
      return {
        statusCode: 200,
        message: 'Admin updated successfully',
        data: admin,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Error updating admin');
    }
  }
}
