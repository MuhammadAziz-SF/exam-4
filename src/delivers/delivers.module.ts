import { Module } from '@nestjs/common';
import { DeliversService } from './delivers.service';
import { DeliversController } from './delivers.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Delivers } from './model/delivery.model';

@Module({
  imports: [SequelizeModule.forFeature([Delivers])],
  controllers: [DeliversController],
  providers: [DeliversService],
})
export class DeliversModule {}
