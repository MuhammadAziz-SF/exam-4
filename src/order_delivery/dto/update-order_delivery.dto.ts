import { PartialType } from '@nestjs/swagger';
import { CreateOrderDeliveryDto } from './create-order_delivery.dto';
import { IsOptional } from 'class-validator';

export class UpdateOrderDeliveryDto extends PartialType(CreateOrderDeliveryDto) {
    @IsOptional()
    status?:string
}
