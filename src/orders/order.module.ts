import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from './entities/order.entity';
import { User } from '../users/entities/user.entity';
import { Cart } from '../cart/entities/cart.entity';

@Module({
  imports: [SequelizeModule.forFeature([Order, User, Cart])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
