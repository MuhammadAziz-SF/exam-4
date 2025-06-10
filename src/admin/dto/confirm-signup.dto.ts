import { IsNotEmpty, IsEmail } from 'class-validator';

export class ConfirmSignUpAdminDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  otp: string;
}
