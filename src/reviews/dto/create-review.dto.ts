import {
  IsString,
  IsUUID,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateReviewDto {
  @IsUUID()
  @IsString()
  user_id: string;

  @IsUUID()
  @IsString()
  product_id: string;

  @IsString()
  comment: string;

  @IsOptional()
  @IsUUID()
  parent_id?: string;

  @IsOptional()
  @IsBoolean()
  is_reply?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;
}
