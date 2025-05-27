import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  ForbiddenException,
  NotFoundException
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Admin } from './models/admin.model';
import { encrypt } from 'src/utils/bcrypt-encrypt';
import { Roles } from 'src/enum';

@Injectable()
export class AdminService {
  constructor(@InjectModel(Admin) private model: typeof Admin) {}

  async createAdmin(createAdminDto: CreateAdminDto): Promise<object> {
    try {
      const { email, phone_number, password } = createAdminDto;
      const existsEmail = await this.model.findOne({ where: { email } });
      if (existsEmail) {
        throw new ConflictException('Email already exists');
      }
      const existsPhoneNumber = await this.model.findOne({
        where: { phone_number },
      });
      if (existsPhoneNumber) {
        throw new ConflictException('Phone number already exists');
      }
      if ('role' in createAdminDto && createAdminDto.role === Roles.SUPER_ADMIN) {
        throw new ConflictException('You are not allowed to create a SuperAdmin');
      }

      const hashed_password = await encrypt(password);
      const admin = await this.model.create({
        ...createAdminDto,
        hashed_password,
        role: Roles.ADMIN,
      });
      return {
        statusCode: 201,
        message: 'success',
        data: admin,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll() {
      return {
        statusCode: 200,
        message: 'success',
        data: await this.model.findAll()
      }
    }
  
  async findOne(id: number) {
    try {
      const admin = await this.model.findByPk(id)
      if(!admin) {
        throw new ConflictException('Admin not exists')
      }

      return {
        statusCode: 201,
        message: 'success',
        data: admin,
      };

    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
    }
  
    async update(id: string, updateAdminDto: UpdateAdminDto) {
  try {
    const admin = await this.model.findByPk(id);
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    if (
      'role' in updateAdminDto &&
      updateAdminDto.role === Roles.SUPER_ADMIN ||'role' in updateAdminDto && updateAdminDto.role === Roles.ADMIN
    ) {
      throw new ForbiddenException('Cannot set role to SuperAdmin');
    }
    
    await admin.update(updateAdminDto);

    return {
      statusCode: 200,
      message: 'Admin updated successfully',
      data: admin,
    };
  } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
   

