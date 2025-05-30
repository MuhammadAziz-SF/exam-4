mport { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LogInDto {
    @IsString()
    phone_number: string;
    

  @ApiProperty({
    description: 'Email address of the admin',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Password for the admin account',
    example: 'StrongP@ss123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum()
  role: string;

  @IsString()
  full_name: string;

  @IsDate()
  date_of_birth: Date;

  @IsString()
  addres: string;

}
