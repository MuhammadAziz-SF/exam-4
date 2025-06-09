import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Store } from './model/store.model';
import { successRes } from 'src/utils/success-response';
import { Product } from '../product/models/product.model';
import { User } from '../users/entities/user.entity';

@Injectable()
export class StoreService {
  constructor(
    @InjectModel(Store) private model: typeof Store,
    @InjectModel(Product) private productModel: typeof Product,
  ) {}

  async create(createStoreDto: CreateStoreDto) {
    try {
      const store = await this.model.create({ ...createStoreDto });
      return successRes(store, 201);
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to create store');
    }
  }

  async findAll() {
    try {
      const stores = await this.model.findAll({
        include: [
          {
            model: User,
            attributes: ['id', 'full_name', 'email'],
          },
        ],
      });

      // For each store, find and include related products
      const storesWithProducts = await Promise.all(
        stores.map(async (store) => {
          const products = await this.productModel.findAll({
            where: { seller_id: store.seller_id },
          });

          return {
            ...store.toJSON(),
            products,
          };
        }),
      );

      return successRes(storesWithProducts, 200);
    } catch (error) {
      throw new NotFoundException('Failed to retrieve stores');
    }
  }

  async findOne(id: number) {
    try {
      const store = await this.model.findByPk(id, {
        include: [
          {
            model: User,
            attributes: ['id', 'full_name', 'email'],
          },
        ],
      });

      if (!store) {
        throw new NotFoundException(`Store not found with id ${id}`);
      }

      // Find products related to this store by seller_id
      const products = await this.productModel.findAll({
        where: { seller_id: store.seller_id },
      });

      // Combine store data with products
      const storeWithProducts = {
        ...store.toJSON(),
        products,
      };

      return successRes(storeWithProducts, 200);
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
        { where: { id }, returning: true },
      );

      if (affectedCount === 0) {
        throw new BadRequestException('No changes were made');
      }

      return successRes(affectedRows[0], 200);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
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
      return successRes(null, 200);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete store');
    }
  }
}
