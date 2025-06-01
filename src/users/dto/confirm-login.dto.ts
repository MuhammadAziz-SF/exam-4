import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ConfirmLoginDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    otp: string;
}