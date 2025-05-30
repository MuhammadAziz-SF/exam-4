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
} from 'class-validator';

export enum StoreStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  MAINTENANCE = 'MAINTENANCE',
  PAUSED = 'PAUSED',
  INACTIVE = 'INACTIVE'
}

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
