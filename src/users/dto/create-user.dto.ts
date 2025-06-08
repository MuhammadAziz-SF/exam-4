import { IsString, IsEmail, IsPhoneNumber, IsDateString, MinLength, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  full_name: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phone_number: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsDateString()
  date_of_birth: string;

  @IsString()
  address: string;

  @IsString()
  @IsOptional()
  role?: string;
}
