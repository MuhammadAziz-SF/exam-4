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
        message: 'Store created successfully',
        data: store,
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to create store');
    }
  }

  async findAll() {
    try {
      const stores = await this.model.findAll();
      return {
        statusCode: 200,
        message: 'Stores retrieved successfully',
        data: stores,
      };
    } catch (error) {
      throw new NotFoundException('Failed to retrieve stores');
    }
  }

  async findOne(id: number) {
    try {
      const store = await this.model.findByPk(id);
      if (!store) {
        throw new NotFoundException(`Store not found with id ${id}`);
      }
      return {
        statusCode: 200,
        message: 'Store retrieved successfully',
        data: store,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(`Failed to retrieve store with id ${id}`);
    }
  }

  async update(id: number, updateStoreDto: UpdateStoreDto) {
    try {
      const store = await this.model.findByPk(id);
      if (!store) {
        throw new NotFoundException(`Store not found with id ${id}`);
      }

      const [affectedCount, affectedRows] = await this.model.update(
        updateStoreDto,
        { where: { id }, returning: true }
      );

      if (affectedCount === 0) {
        throw new BadRequestException('No changes were made');
      }

      return {
        statusCode: 200,
        message: 'Store updated successfully',
        data: affectedRows[0],
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to update store');
    }
  }

  async remove(id: number) {
    try {
      const store = await this.model.findByPk(id);
      if (!store) {
        throw new NotFoundException(`Store not found with id ${id}`);
      }

      await this.model.destroy({ where: { id } });
      return {
        statusCode: 200,
        message: 'Store deleted successfully',
        data: {},
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete store');
    }
  }
}
