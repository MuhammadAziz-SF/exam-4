import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import config from '../config';

@Injectable()
export class EmailService implements OnModuleInit {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async onModuleInit() {
    try {
      await this.mailerService.sendMail({
        to: config.MAIL_FROM,
        from: config.MAIL_FROM,
        subject: 'Test Email',
        text: 'This is a test email to verify the mail transporter.',
      });
      this.logger.log('Mail transporter is ready');
    } catch (error) {
      this.logger.error('Mail transporter verification failed:', error.message);
    }
  }

  async sendOTP(email: string, otp: number) {
    try {
      this.logger.log(`Attempting to send OTP to ${email}`);
      
      await this.mailerService.sendMail({
        to: email,
        from: config.MAIL_FROM,
        subject: 'Your OTP Code',
        html: `
          <h3>Your OTP Code</h3>
          <p>Your OTP code is: <strong>${otp}</strong></p>
          <p>This code will expire in 5 minutes.</p>
        `,
      });

      this.logger.log(`OTP email sent successfully to ${email}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send OTP email to ${email}:`, error.message);
      return false;
    }
  }
}
