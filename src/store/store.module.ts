import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Store } from './model/store.model';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [SequelizeModule.forFeature([Store, User])],
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoreModule {}
