import {
  IsDateString,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Matches,
} from 'class-validator';
export class CreateDeliverDto {
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  @Matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, {
    message: 'Phone number must be a valid format (e.g., +998901234567)',
  })
  phone_number: string;

  @IsDateString()
  @IsNotEmpty()
  date_of_birth: string;
}
