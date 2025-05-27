import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { JwtModule } from '@nestjs/jwt';
import config from 'src/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Admin } from './models/admin.model';

@Module({
  imports: [
    JwtModule.register({
      secret:   config.JWT_ACCESS_K,
      signOptions: {expiresIn: config.JWT_ACCESS_T}
    }),
    SequelizeModule.forFeature([Admin])
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
