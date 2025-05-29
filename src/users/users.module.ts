import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entity/user.entitiy';
import { Store } from 'src/store/model/store.model';

@Module({
  imports: [SequelizeModule.forFeature([User, Store])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
