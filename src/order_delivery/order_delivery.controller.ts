import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderDeliveryService } from './order_delivery.service';
import { CreateOrderDeliveryDto } from './dto/create-order_delivery.dto';
import { UpdateOrderDeliveryDto } from './dto/update-order_delivery.dto';

@Controller('order-delivery')
export class OrderDeliveryController {
  constructor(private readonly orderDeliveryService: OrderDeliveryService) {}

  @Post()
  create(@Body() createOrderDeliveryDto: CreateOrderDeliveryDto) {
    return this.orderDeliveryService.create(createOrderDeliveryDto);
  }

  @Get()
  findAll() {
    return this.orderDeliveryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderDeliveryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDeliveryDto: UpdateOrderDeliveryDto) {
    return this.orderDeliveryService.update(+id, updateOrderDeliveryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderDeliveryService.remove(+id);
  }
}
