import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Cart } from './model/cart.model';
import { catchError } from 'rxjs';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart) private model: typeof Cart) {}

  async create(createCartDto: CreateCartDto) {
    try {
      const cart = await this.model.create({ ...createCartDto });
      return {
        statusCode: 201,
        message: 'success',
        data: cart,
      };
    } catch (error) {
      catchError(error);
    }
  }

  async findAll() {
    try {
      const carts = await this.model.findAll();
      return {
        statusCode: 200,
        message: 'success',
        data: carts,
      };
    } catch (error) {
      catchError(error);
    }
  }

  async findOne(id: number) {
    try {
      const cart = await this.model.findByPk(id);
      if (!cart) {
        return {
          statusCode: 404,
          message: 'Not found',
        };
      }
      return {
        statusCode: 200,
        message: 'success',
        data: cart,
      };
    } catch (error) {
      catchError(error);
    }
  }

  async update(id: number, updateCartDto: UpdateCartDto) {
    try {
      const cart = await this.model.update(updateCartDto, {
        where: { id },
        returning: true,
      });
      return {
        statusCode: 200,
        message: 'success',
        data: cart[1][0],
      };
    } catch (error) {
      catchError(error);
    }
  }

  async remove(id: number) {
    try {
      const cart = await this.model.destroy({ where: { id } });
      return {
        statusCode: 200,
        message: 'success',
        data: {},
      };
    } catch (error) {
      catchError(error);
    }
  }
}
