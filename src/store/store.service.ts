import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Store } from './model/store.model';

@Injectable()
export class StoreService {
  constructor(@InjectModel(Store) private model: typeof Store) {}

  async create(createStoreDto: CreateStoreDto) {
    try {
      const store = await this.model.create({ ...createStoreDto });
      return {
        statusCode: 201,
        message: 'success',
        data: store,
      };
    } catch (error) {
      throw new BadRequestException('Failed to create store');
    }
  }

  async findAll() {
    try {
      const store = await this.model.findAll();
      return {
        statusCode: 200,
        message: 'success',
        data: store,
      };
    } catch (error) {
      throw new NotFoundException('Stores not found');
    }
  }

  async findOne(id: number) {
    try {
      const store = await this.model.findByPk(id);
      return {
        statusCode: 200,
        message: 'success',
        data: store,
      };
    } catch (error) {
      throw new NotFoundException(`Store not found by ${id}`);
    }
  }

  async update(id: number, updateStoreDto: UpdateStoreDto) {
    try {
      const store = await this.model.update(updateStoreDto, { where: { id }, returning: true});
      return {
        statusCode: 200,
        message: 'success',
        data: store[1][0]
      };
    } catch (error) {
      throw new NotFoundException(`Not found by id ${id}`);
    }
  }

  async remove(id: number) {
    try {
      await this.model.destroy({ where: { id } });
      return {
        data: {},
      };
    } catch (error) {
      throw new NotFoundException(`Not found by id${id}`);
    }
  }
}
