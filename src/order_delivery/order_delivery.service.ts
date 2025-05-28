import { Injectable } from '@nestjs/common';
import { CreateOrderDeliveryDto } from './dto/create-order_delivery.dto';
import { UpdateOrderDeliveryDto } from './dto/update-order_delivery.dto';
import { InjectModel } from '@nestjs/sequelize';
import { OrderDelivery } from './entities/order_delivery.entity';

@Injectable()
export class OrderDeliveryService {
  constructor(
    @InjectModel(OrderDelivery)private model:typeof OrderDelivery 
  ){ }
  async create(createOrderDeliveryDto: CreateOrderDeliveryDto) {
    const newOrderDelivery=await this.model.create({...createOrderDeliveryDto})
    return newOrderDelivery
  }

  async findAll() {
    const order_delivery=await this.model.findAll();
    return order_delivery;
  }

  async findOne(id: number) {
    const order_delivery=await this.model.findByPk(id)
    return order_delivery;
  }

  async update(id: number, updateOrderDeliveryDto: UpdateOrderDeliveryDto) {
    const order_delivery=await this.model.update(updateOrderDeliveryDto,{where:{id},returning:true});
    return order_delivery
  }

  async remove(id: number) {
    await this.model.destroy({where:{id}})
    return {data:{}}
  }
}
