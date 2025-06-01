import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { InjectModel } from '@nestjs/sequelize';
import { OrderItem } from './entities/order-item.entity';
import { catchError } from 'src/utils/catch-error';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';

@Injectable()
export class OrderItemsService {
  constructor(@InjectModel(OrderItem) private model: typeof OrderItem) {}
  async create(createOrderItemDto: CreateOrderItemDto) {
    try {
      const { product_id, price, quantity, total_price } = createOrderItemDto;
      const expectedTotal = Math.round(Number(price) * Number(quantity));
      if (Number(total_price) !== expectedTotal) {
        throw new Error(
          `Umumiy narx  (${price}) *  (${quantity}) = ${expectedTotal} ga teng bo'lishi kerak`,
        );
      }
      const newOrderItem = await this.model.create({
        product_id,
        price,
        quantity,
        total_price,
      });
      return {
        statusCode: 201,
        message: 'order created',
        data: newOrderItem,
      };
    } catch (error) {
      return catchError(error);
    }
  }

  async findAll() {
    try {
      const orderItems = await this.model.findAll();
      return {
        statusCode: 200,
        message: 'success',
        data: orderItems,
      };
    } catch (error) {
      return catchError(error);
    }
  }

  async findOne(id: number) {
    try {
      const orderItem = this.model.findByPk(id);
      if (!orderItem) {
        throw new NotFoundException(`ID ${id} li order item topilmadi`);
      }
      return {
        statusCode: 200,
        message: 'success',
        data: orderItem,
      };
    } catch (error) {
      return catchError(error);
    }
  }

  async update(id: number, updateOrderItemDto: UpdateOrderItemDto) {
    const orderItem = await this.model.findByPk(id);
    if (!orderItem) {
      throw new NotFoundException(`ID ${id} bilan order item topilmadi`);
    }
    const { product_id, price, quantity, total_price } = updateOrderItemDto;

    const expectedTotal = Math.round(Number(price) * Number(quantity));
    if (Number(total_price) !== expectedTotal) {
      throw new Error(
        `Umumiy narx  (${price}) *  (${quantity}) = ${expectedTotal} ga teng bolishi kerak`,
      );
    }
    const updateOrderItem = await this.model.update(
      {
        product_id,
        price,
        quantity,
        total_price,
      },
      { where: { id }, returning: true },
    );
    return {
      statusCode: 200,
      message: 'success',
      data: updateOrderItem,
    };
  }

  async remove(id: number) {
    try {
      const orderItem = await this.model.findByPk(id);
      if (!orderItem) {
        throw new ConflictException('orderItem not found');
      }
      await orderItem.destroy();
      return {
        statusCode: 200,
        message: 'orderItem deleted successfully',
        data: {},
      };
    } catch (error) {
      return catchError(error);
    }
  }
}
