import { ConflictException, Injectable, UploadedFiles } from '@nestjs/common';
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
import { ImagesOfProduct } from './models/images_of_product.model';
import { Sequelize } from 'sequelize-typescript';
import { FileService } from 'src/file/file.service';
import {Multer} from 'multer'

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product) private model: typeof Product,
    @InjectModel(ImagesOfProduct) private imageModel: typeof ImagesOfProduct,
    private readonly sequelize: Sequelize,
    private readonly fileService: FileService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    req: Request,
    @UploadedFiles() files?: Express.Multer.File[],
  ): Promise<any> {
    const transaction = await this.sequelize.transaction();
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

      const existsName = await this.model.findOne({
        where: { name },
        transaction,
      });
      if (existsName) {
        throw new ConflictException('Product name already exists');
      }

      const category = await Category.findByPk(category_id, { transaction });
      if (!category) {
        throw new ConflictException('Category not found');
      }

      const newProduct = await this.model.create(
        {
          name,
          price,
          description,
          quantity,
          pictures,
          status,
          seller_id,
          category_id,
        },
        { transaction },
      );

      const imagesUrl: string[] = [];
      if (files && files.length > 0) {
        for (let file of files) {
          imagesUrl.push(await this.fileService.createFile(file));
        }
        const images = imagesUrl.map((image: string) => ({
          image_url: image,
          product_id: newProduct.dataValues.id,
        }));
        await this.imageModel.bulkCreate(images, { transaction });
      }

      await transaction.commit();
      return successRes(newProduct, 201);
    } catch (error) {
      await transaction.rollback();
      return catchError(error);
    }
  }

  async findAll() {
    try {
      const products = await this.model.findAll({ include: [ImagesOfProduct] });
      return successRes(products, 200);
    } catch (error) {
      return catchError(error);
    }
  }

  async findOne(id: string) {
    try {
      const product = await this.model.findByPk(id, {
        include: [ImagesOfProduct],
      });
      if (!product) {
        throw new ConflictException('Product not found');
      }
      return successRes(product, 200);
    } catch (error) {
      return catchError(error);
    }
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    req: Request,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const transaction = await this.sequelize.transaction();
    try {
      const product = await this.model.findByPk(id, { transaction });
      if (!product) {
        throw new ConflictException('Product not found');
      }

      const { name } = updateProductDto;
      if (name && name !== product.name) {
        const existsName = await this.model.findOne({
          where: { name },
          transaction,
        });
        if (existsName) {
          throw new ConflictException('Product name already exists');
        }
      }

      const imagesUrl: string[] = [];
      if (files && files.length > 0) {
        for (const file of files) {
          const imageUrl = await this.fileService.createFile(file);
          imagesUrl.push(imageUrl);
        }
        const images = imagesUrl.map((image: string) => ({
          image_url: image,
          product_id: product.id,
        }));
        await this.imageModel.bulkCreate(images, { transaction });
      }

      await product.update(updateProductDto, { transaction });
      await transaction.commit();
      return successRes(product, 200);
    } catch (error) {
      await transaction.rollback();
      return catchError(error);
    }
  }

  async remove(id: string) {
    const transaction = await this.sequelize.transaction();
    try {
      const product = await this.model.findByPk(id, { transaction });
      if (!product) {
        throw new ConflictException('Product not found');
      }
      await this.imageModel.destroy({ where: { product_id: id }, transaction });
      await product.destroy({ transaction });
      await transaction.commit();
      return successRes(null, 200);
    } catch (error) {
      await transaction.rollback();
      return catchError(error);
    }
  }
}
