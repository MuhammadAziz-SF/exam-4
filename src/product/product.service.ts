import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './models/product.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class ProductService {
  constructor(@InjectModel(Product) private model: typeof Product) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const {
        name,
        price,
        description,
        quantity,
        pictures,
        seller_id,
        status,
        category_type,
      } = createProductDto;
      const existsName = await this.model.findOne({ where: { name } });
      if (existsName) {
        throw new ConflictException('Product name already exists');
      }
      const newProduct = await this.model.create({
        name,
        price,
        description,
        quantity,
        pictures,
        status,
        seller_id,
        category_type,
      });
      return newProduct;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll() {
    try {
      const products = await this.model.findAll();
      return products;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: number) {
    const product = await this.model.findByPk(id);
    if (!product) {
      throw new ConflictException('Product not found');
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      const product = await this.model.findByPk(id);
      if (!product) {
        throw new ConflictException('Product not found');
      }

      const { name } = updateProductDto;
      if (name && name !== product.name) {
        const existsName = await this.model.findOne({ where: { name } });
        if (existsName) {
          throw new ConflictException('Bu nomdagi mahsulot allaqachon mavjud!');
        }
      }

      await product.update(updateProductDto);
      return product;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number) {
    try {
      const product = await this.model.findByPk(id);
      if (!product) {
        throw new ConflictException('Product not found');
      }
      await product.destroy();
      return {};
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
