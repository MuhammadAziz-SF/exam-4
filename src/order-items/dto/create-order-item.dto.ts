import { IsNotEmpty, IsNumber, IsPositive, IsUUID } from 'class-validator';

export class CreateOrderItemDto {
  @IsUUID()
  @IsNotEmpty()
  product_id: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  price: number;

  @IsPositive()
  @IsNotEmpty()
  quantity: bigint;

  @IsPositive()
  @IsNotEmpty()
  total_price: bigint;
}
