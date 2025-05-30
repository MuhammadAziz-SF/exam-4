import { IsNotEmpty, IsEmail } from 'class-validator';

export class ConfirmSignInAdminDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  otp: string;
}