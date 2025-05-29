
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailService: MailerService) {}

  async sendOtp(email: string, otp: string) {
    await this.mailService.sendMail({
      to: email,
      subject: 'Assalomu alaykum. Avto ijara saytiga xush kelibsiz!',
      text: otp,
    });
  }
}
