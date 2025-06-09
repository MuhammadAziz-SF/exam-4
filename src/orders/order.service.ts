import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from './entities/order.entity';
import { Cart } from '../cart/entities/cart.entity';
import { successRes } from 'src/utils/success-response';
import { Request } from 'express';
import { decodeJwt } from 'src/services/getIdByJwt';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order) private orderModel: typeof Order,
    @InjectModel(Cart) private cartModel: typeof Cart,
  ) {}

  async createOrderFromCart(req: Request) {
    try {
      const decoded = await decodeJwt(req)
      const buyer_id = decoded.id
      const cart = await this.cartModel.findOne({
        where: { buyer_id },
      });

      if (!cart || !cart.products || cart.products.length === 0) {
        throw new BadRequestException('Cart is empty or not found');
      }

      const order = await this.orderModel.create({
        buyer_id,
        products: cart.products,
        total_amount: cart.total_amount,
      });

      await cart.destroy();

      return successRes(order, 201);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to create order: ' + error.message);
    }
  }

  async findAll() {
    try {
      const orders = await this.orderModel.findAll({
        include: ['user'],
      });
      return successRes(orders, 200);
    } catch (error) {
      throw new BadRequestException('Failed to fetch orders');
    }
  }

  async findByBuyer(buyer_id: string) {
    try {
      const orders = await this.orderModel.findAll({
        where: { buyer_id },
        include: ['user'],
      });
      return successRes(orders, 200);
    } catch (error) {
      throw new BadRequestException('Failed to fetch buyer orders');
    }
  }

  async findOne(id: string) {
    try {
      const order = await this.orderModel.findByPk(id, {
        include: ['user'],
      });
      if (!order) {
        throw new NotFoundException(`Order not found with id ${id}`);
      }
      return successRes(order, 200);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch order');
    }
  }

  async remove(id: string) {
    try {
      const order = await this.orderModel.findByPk(id);
      if (!order) {
        throw new NotFoundException(`Order not found with id ${id}`);
      }
      await order.destroy();
      return successRes(null, 200);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete order');
    }
  }
}
