import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { Store } from 'src/store/model/store.model';
import { TokenService } from 'src/services/jwt-gen';
import { MailService } from 'src/mail/email.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import config from '../config';
import { CacheModule } from '@nestjs/cache-manager';
import { MailModule } from 'src/mail/email.module';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Store]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: config.JWT_ACCESS_K,
      signOptions: { expiresIn: config.JWT_ACCESS_T }
    }),
    CacheModule.register(),
    MailModule
  ],
  controllers: [UsersController],
  providers: [UsersService, TokenService, MailService],
  exports: [TokenService, MailService]
})
export class UsersModule {}
