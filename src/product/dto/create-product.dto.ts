import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

import { ProductStatus } from 'src/enum';

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

  @IsEnum(ProductStatus)
  @IsNotEmpty()
  status: ProductStatus;

  @IsUUID()
  @IsNotEmpty()
  seller_id: string;

  @IsUUID()
  @IsNotEmpty()
  category_id: string;
}
