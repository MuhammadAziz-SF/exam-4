import { Injectable,NotFoundException } from '@nestjs/common';
import { CreateOrderDeliveryDto } from './dto/create-order_delivery.dto';
import { UpdateOrderDeliveryDto } from './dto/update-order_delivery.dto';
import { InjectModel } from '@nestjs/sequelize';
import { OrderDelivery } from './entities/order_delivery.entity';
import { catchError } from 'src/utils/catch-error';
@Injectable()
export class OrderDeliveryService {
  constructor(
    @InjectModel(OrderDelivery)private model:typeof OrderDelivery 
  ){ }
  async create(createOrderDeliveryDto: CreateOrderDeliveryDto) {
  try {

    const order=await this.model.findOne({where:{}})
    const newOrderDelivery=await this.model.create({...createOrderDeliveryDto})
    return {
      statusCode:201,
      message:'success',
      data:newOrderDelivery
    }  } catch (error) {
    return catchError(error)
  }}


  async findAll() {
    try {
      const order_delivery=await this.model.findAll();
      if(!order_delivery){
        throw new NotFoundException()
      }
      return {
        statusCode:200,
        message:'success',
        data:order_delivery
      }    } catch (error) {
      return catchError(error)
      }}

  async findOne(id: number) {
    try {
      const order_delivery=await this.model.findByPk(id)
      return {
        statusCode:200,
        message:'success',
        data:order_delivery
      }    } catch (error) {
      return catchError(error)
      }}

  async update(id: number, updateOrderDeliveryDto: UpdateOrderDeliveryDto) {
    try {
      const [updatedCount,updatedRows]=await this.model.update(updateOrderDeliveryDto,{where :{id},returning:true,})
      if(updatedCount===0){
        throw new NotFoundException()
      }
      return {
        statusCode:200,
        message:'success',
        data:updatedRows[1][0]
      }    } catch (error) {
      return catchError(error)
      }}

  async remove(id: number) {
    try {
      const deletedCount=await this.model.destroy({where:{id}})
      if(deletedCount===0){
          throw new NotFoundException()
      }
      return {
        statusCode:200,
        message:'success',
        data:{}
      }    } catch (error) {
      return catchError(error)
    }}
}
