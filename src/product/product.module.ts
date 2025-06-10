import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from './models/product.model';
import { ImagesOfProduct } from './models/images_of_product.model';
import { MulterModule } from '@nestjs/platform-express';
import { FileModule } from 'src/file/file.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Product, ImagesOfProduct]),
    MulterModule.register({
      dest: './uploads',
    }),
    FileModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
