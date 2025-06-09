import { Module } from '@nestjs/common';
import { MailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import config from 'src/config';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: config.MAIL_HOST,
        secure: false,
        auth: {
          user: config.MAIL_USER,
          pass: config.MAIL_PASS,
        },
      },
      defaults: {
        from: config.MAIL_USER,
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
