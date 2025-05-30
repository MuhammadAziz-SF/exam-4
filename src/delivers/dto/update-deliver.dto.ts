import { PartialType } from '@nestjs/mapped-types';
import { CreateDeliverDto } from './create-deliver.dto';

export class UpdateDeliverDto extends PartialType(CreateDeliverDto) {}
