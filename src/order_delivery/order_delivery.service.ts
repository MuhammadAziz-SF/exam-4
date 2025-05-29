import { Injectable } from '@nestjs/common';
import { CreateOrderDeliveryDto } from './dto/create-order_delivery.dto';
import { UpdateOrderDeliveryDto } from './dto/update-order_delivery.dto';
import { InjectModel } from '@nestjs/sequelize';
import { OrderDelivery } from './entities/order_delivery.entity';
import { InternalServerErrorException } from '@nestjs/common';
@Injectable()
export class OrderDeliveryService {
  constructor(
    @InjectModel(OrderDelivery)private model:typeof OrderDelivery 
  ){ }
  async create(createOrderDeliveryDto: CreateOrderDeliveryDto) {
  try {
    const newOrderDelivery=await this.model.create({...createOrderDeliveryDto})
    return newOrderDelivery
  } catch (error) {
    throw new InternalServerErrorException(error.message);
  } }


  async findAll() {
    try {
      const order_delivery=await this.model.findAll();
      return order_delivery;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }}

  async findOne(id: number) {
    try {
      const order_delivery=await this.model.findByPk(id)
    return order_delivery;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }}

  async update(id: number, updateOrderDeliveryDto: UpdateOrderDeliveryDto) {
    try {
      const order_delivery=await this.model.update(updateOrderDeliveryDto,{where:{id},returning:true});
    return order_delivery
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }}

  async remove(id: number) {
    try {
      await this.model.destroy({where:{id}})
    return {data:{}}
    } catch (error) {
      throw new InternalServerErrorException(error.message);

    }}
}
