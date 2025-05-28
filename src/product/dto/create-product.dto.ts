import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

import { Status } from 'src/enum';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  pictures: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  quantity: bigint;

  @IsEnum(Status)
  @IsNotEmpty()
  status: string;

  @IsUUID()
  @IsNotEmpty()
  seller_id: string;

  @IsString()
  @IsNotEmpty()
  category_type: string;
}
