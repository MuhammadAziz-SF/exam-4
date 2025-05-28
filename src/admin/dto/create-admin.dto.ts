import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Roles } from '../../enum';

export class CreateAdminDto {
  @ApiProperty({
    description: 'Full name of the admin',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty({
    description: 'Email address of the admin',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Phone number of the admin',
    example: '+1234567890',
  })
  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @ApiProperty({
    description: 'Password for the admin account',
    example: 'StrongP@ss123',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: 'Role of the admin',
    enum: Roles,
    example: Roles.ADMIN,
  })
  @IsEnum(Roles)
  @IsNotEmpty()
  role: Roles;
}
