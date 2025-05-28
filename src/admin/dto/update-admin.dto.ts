import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminDto } from './create-admin.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { Status } from 'src/enum';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {
  @IsOptional()
  @IsEnum([Status.ACTIVE, Status.INACTIVE])
  status?: string;
}
