import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Roles } from 'src/enum';

export class CreateAdminDto {
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  phone_number: string;

  @IsEnum(Roles)
  @IsNotEmpty()
  role: Roles;
}
