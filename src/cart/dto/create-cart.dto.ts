import { IsArray, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateCartDto {
  @IsNotEmpty()
  @IsUUID()
  @IsString()
  buyer_id: string;

  @IsNotEmpty()
  @IsArray()
  products: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
}
