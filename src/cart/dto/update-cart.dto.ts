
import { PartialType } from '@nestjs/mapped-types';
import { CreateCartDto } from './create-cart.dto';
import { IsArray, IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateCartDto extends PartialType(CreateCartDto) {
  @IsOptional()
  @IsArray()
  products?: string[];

  @IsOptional()
  @IsString()
  product_id?: string;

  @IsOptional()
  @IsNumber()
  quantity?: number;
}
