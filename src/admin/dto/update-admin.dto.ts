import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { Roles, Status } from '../../enum';

export class UpdateAdminDto {
  @ApiProperty({
    description: 'Full name of the admin',
    example: 'John Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  full_name?: string;

  @ApiProperty({
    description: 'Email address of the admin',
    example: 'john.doe@example.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Phone number of the admin',
    example: '+1234567890',
    required: false,
  })
  @IsString()
  @IsOptional()
  phone_number?: string;

  @ApiProperty({
    description: 'Password for the admin account',
    example: 'StrongP@ss123',
    minLength: 8,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(8)
  password?: string;

  @ApiProperty({
    description: 'Role of the admin',
    enum: Roles,
    example: Roles.ADMIN,
    required: false,
  })
  @IsEnum(Roles)
  @IsOptional()
  role?: Roles;

  @ApiProperty({
    description: 'Status of the admin account',
    enum: Status,
    example: Status.ACTIVE,
    required: false,
  })
  @IsEnum(Status)
  @IsOptional()
  status?: Status;
}
