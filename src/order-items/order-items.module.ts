import { Module } from '@nestjs/common';
import { OrderItemsService } from './order-items.service';
import { OrderItemsController } from './order-items.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrderItem } from './entities/order-item.entity';

@Module({
  imports: [SequelizeModule.forFeature([OrderItem])],
  controllers: [OrderItemsController],
  providers: [OrderItemsService],
})
export class OrderItemsModule {}
