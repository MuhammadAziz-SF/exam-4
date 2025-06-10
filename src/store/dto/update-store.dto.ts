import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateStoreDto } from './create-store.dto';
import {
  IsOptional,
  IsString,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsUrl,
  Length,
  Max,
  Min,
  Matches,
  IsPhoneNumber,
} from 'class-validator';
import { StoreStatus } from 'src/enum';

export class UpdateStoreDto extends PartialType(
  OmitType(CreateStoreDto, ['seller_id'] as const),
) {
  @IsOptional()
  @IsString()
  @Length(2, 50)
  store_type?: string;

  @IsOptional()
  @IsString()
  @Length(10, 1000)
  description?: string;

  @IsOptional()
  @IsString()
  @IsPhoneNumber()
  contacts?: string;

  @IsOptional()
  @IsString()
  @Length(3, 100)
  @Matches(/^[a-zA-Z0-9\s\-&]+$/)
  store_name?: string;

  @IsOptional()
  @IsString()
  @Length(5, 200)
  location?: string;

  @IsOptional()
  @IsEnum(StoreStatus)
  store_status?: StoreStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsBoolean()
  is_open?: boolean;

  @IsOptional()
  @IsString()
  @IsUrl()
  logo_url?: string;
}
