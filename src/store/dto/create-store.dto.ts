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
} from 'class-validator';

export enum StoreStatus{
    OPEN = 'open',
    CLOSED = 'closed',
    MAINTENANCE = 'maintenance',
    PAUSED = 'paused',
    INACTIVE = 'inactive'
}
export class CreateStoreDto {
  @IsString()
  store_type: string;

  @IsString()
  @IsNotEmpty()
  @Length(5, 255)
  description: string;

  @IsString()
  contacts: string;

  @IsString()
  @IsNotEmpty()
  store_name: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsEnum(StoreStatus)
  store_status: StoreStatus;

  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @IsBoolean()
  is_open: boolean;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  logo_url: string;

  @IsInt()
  @IsNotEmpty()
  seller_id: number;
}
