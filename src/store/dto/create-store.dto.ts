import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsUrl,
  Length,
  Max,
  Min,
  IsInt,
  Matches,
  IsPhoneNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { StoreStatus } from 'src/enum';

export class CreateStoreDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  store_type: string;

  @IsString()
  @IsNotEmpty()
  @Length(10, 1000)
  description: string;

  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  contacts: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  @Matches(/^[a-zA-Z0-9\s\-&]+$/)
  store_name: string;

  @IsString()
  @IsNotEmpty()
  @Length(5, 200)
  location: string;

  @IsOptional()
  @IsEnum(StoreStatus)
  store_status?: StoreStatus;

  @IsNumber()
  @Min(0)
  @Max(5)
  @IsOptional()
  rating?: number;

  @IsString()
  @IsOptional()
  @IsUrl()
  logo_url?: string;

  @IsUUID()
  @IsNotEmpty()
  seller_id: string;
}
