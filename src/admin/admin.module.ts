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
import { EmailService } from '../services/email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { TokenService } from '../services/jwt-gen';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: config.JWT_ACCESS_K,
      signOptions: { expiresIn: config.JWT_ACCESS_T }
    }),
    SequelizeModule.forFeature([Admin]),
    MailerModule.forRoot({
      transport: {
        host: config.MAIL_HOST,
        port: config.MAIL_PORT,
        secure: false,
        auth: {
          user: config.MAIL_USER,
          pass: config.MAIL_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
        logger: false
      },
      defaults: {
        from: config.MAIL_FROM,
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService, JwtStrategy, RolesGuard, EmailService, TokenService],
  exports: [JwtStrategy, PassportModule, RolesGuard, TokenService]
})
export class AdminModule {}
