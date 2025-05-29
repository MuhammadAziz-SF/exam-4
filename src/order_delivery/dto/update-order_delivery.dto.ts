import { PartialType } from '@nestjs/swagger';
import { CreateOrderDeliveryDto } from './create-order_delivery.dto';
export class UpdateOrderDeliveryDto extends PartialType(CreateOrderDeliveryDto) {}
