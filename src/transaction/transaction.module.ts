import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Transaction } from './entities/transaction.entity';
import { User } from '../users/entities/user.entity';
import { OrderDelivery } from '../order_delivery/entities/order_delivery.entity';

@Module({
  imports: [SequelizeModule.forFeature([Transaction, User, OrderDelivery])],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
