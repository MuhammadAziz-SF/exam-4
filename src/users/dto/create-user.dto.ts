import { IsEnum, IsString, IsEmail } from 'class-validator';
import { Roles } from 'src/enum';

export class CreateUserDto {
  @IsString()
  phone_number: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsEnum(Roles)
  role: Roles;
}
