import { IsString, IsUUID } from 'class-validator';

export class CreateReplyDto {
  @IsUUID()
  @IsString()
  user_id: string;

  @IsUUID()
  @IsString()
  product_id: string;

  @IsUUID()
  @IsString()
  parent_id: string;

  @IsString()
  comment: string;
}
