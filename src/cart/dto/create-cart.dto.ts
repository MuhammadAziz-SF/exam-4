import { IsArray, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateCartDto {
  @IsNotEmpty()
  @IsArray()
  products: string[];
}
