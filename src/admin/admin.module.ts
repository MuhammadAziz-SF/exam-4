import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import config from '../config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Admin } from './models/admin.model';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { RolesGuard } from '../guards/roles.guard';
import { AdminService } from './admin.service';
import { join } from 'path';
import { TokenService } from '../services/jwt-gen';
import { CacheModule } from '@nestjs/cache-manager';
import { MailModule } from 'src/mail/email.module';
import { MailService } from 'src/mail/email.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: config.JWT_ACCESS_K,
      signOptions: { expiresIn: config.JWT_ACCESS_T }
    }),
    SequelizeModule.forFeature([Admin]),
    CacheModule.register(),
    MailModule,
    
  ],
  controllers: [AdminController],
  providers: [AdminService, JwtStrategy, RolesGuard, TokenService, MailService],
  exports: [JwtStrategy, PassportModule, RolesGuard, TokenService]
})
export class AdminModule {}
