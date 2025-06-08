import { Module } from '@nestjs/common';
import { CartItemsService } from './cart-items.service';
import { CartItemsController } from './cart-items.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { CartItem } from './entities/cart-item.entity';
import { Cart } from '../cart/entities/cart.entity';
import { Product } from '../product/models/product.model';

@Module({
  imports: [SequelizeModule.forFeature([CartItem, Cart, Product])],
  controllers: [CartItemsController],
  providers: [CartItemsService],
})
export class CartItemsModule {}
