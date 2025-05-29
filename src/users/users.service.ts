import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entity/user.entitiy';
import { encrypt } from 'src/utils/bcrypt-encrypt';
import { Roles } from 'src/enum';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private model: typeof User) {}

  async createUser(createUserDto: CreateUserDto): Promise<object> {
    try {
      const { phone_number, email, password } = createUserDto;
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
      const hashed_password = await encrypt(password);
      const user = await this.model.create({
        ...createUserDto,
        hashed_password,
        role: Roles.BUYER,
      });
      return {
        statusCode: 201,
        message: 'success',
        data: user,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
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
    const user = await this.model.destroy({ where: { id } });
    return {};
  }
}
