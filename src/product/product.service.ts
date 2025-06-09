import { ConflictException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './models/product.model';
import { InjectModel } from '@nestjs/sequelize';
import { catchError } from 'src/utils/catch-error';
import { Category } from 'src/categories/entities/category.entity';
import { decodeJwt } from 'src/services/getIdByJwt';
import { Request } from 'express';
import { Admin } from 'src/admin/models/admin.model';
import { successRes } from 'src/utils/success-response';

@Injectable()
export class ProductService {
  constructor(@InjectModel(Product) private model: typeof Product) {}

  async create(createProductDto: CreateProductDto, req: Request) {
    try {
      const decoded = await decodeJwt(req);
      const {
        name,
        price,
        description,
        quantity,
        pictures,
        seller_id,
        status,
        category_id,
      } = createProductDto;
      const existsName = await this.model.findOne({ where: { name } });
      if (existsName) {
        throw new ConflictException('Product name already exists');
      }
      const category = await Category.findByPk(category_id);
      if (!category) {
        throw new ConflictException('Category not found');
      }

      const user = await Admin.findByPk(decoded.id);
      if (!user) {
        throw new ConflictException('User not found');
      }

      const newProduct = await this.model.create({
        name,
        price,
        description,
        quantity,
        pictures,
        status,
        seller_id,
        category_id,
      });
      return successRes(newProduct, 201);
    } catch (error) {
      return catchError(error);
    }
  }

  async findAll() {
    try {
      const products = await this.model.findAll();
      return successRes(products, 200);
    } catch (error) {
      return catchError(error);
    }
  }

  async findOne(id: string) {
    try {
      const product = await this.model.findByPk(id);
      if (!product) {
        throw new ConflictException('Product not found');
      }
      return successRes(product, 200);
    } catch (error) {
      return catchError(error);
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const product = await this.model.findByPk(id);
      if (!product) {
        throw new ConflictException('Product not found');
      }

      const { name } = updateProductDto;
      if (name && name !== product.name) {
        const existsName = await this.model.findOne({ where: { name } });
        if (existsName) {
          throw new ConflictException('Product not exists!');
        }
      }

      await product.update(updateProductDto);
      return successRes(product, 200);
    } catch (error) {
      return catchError(error);
    }
  }

  async remove(id: string) {
    try {
      const product = await this.model.findByPk(id);
      if (!product) {
        throw new ConflictException('Product not found');
      }
      await product.destroy();
      return successRes(null, 200);
    } catch (error) {
      return catchError(error);
    }
  }
}
