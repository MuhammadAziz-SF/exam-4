import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cart } from './entities/cart.entity';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { successRes } from 'src/utils/success-response';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart) private cartModel: typeof Cart) {}

  async addToCart(createCartDto: CreateCartDto) {
    try {
      let cart = await this.cartModel.findOne({
        where: { buyer_id: createCartDto.buyer_id },
      });

      if (cart) {
        const updatedProducts = [...cart.products, ...createCartDto.products];
        const totalAmount = updatedProducts.reduce(
          (sum, product) => sum + product.price * product.quantity,
          0,
        );
        

        await cart.update({
          products: updatedProducts,
          total_amount: totalAmount,
          item_count: updatedProducts.length,
        });

        return successRes(cart, 200);
      }

      const totalAmount = createCartDto.products.reduce(
        (sum, product) => sum + product.price * product.quantity,
        0,
      );

      cart = await this.cartModel.create({
        buyer_id: createCartDto.buyer_id,
        products: createCartDto.products,
        total_amount: totalAmount,
        item_count: createCartDto.products.length,
      });

      return successRes(cart, 201);
    } catch (error) {
      throw new BadRequestException('Failed to add to  cart: ' + error.message);
    }
  }

  async findAll() {
    try {
      const carts = await this.cartModel.findAll({
        include: ['user'],
      });
      return successRes(carts, 200);
    } catch (error) {
      throw new BadRequestException('Failed to fetch carts');
    }
  }

  async findOne(id: string) {
    try {
      const cart = await this.cartModel.findByPk(id, {
        include: ['user'],
      });
      if (!cart) {
        throw new NotFoundException(`Cart not found with id ${id}`);
      }
      return successRes(cart, 200);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch cart');
    }
  }

  async findByBuyer(buyer_id: string) {
    try {
      const cart = await this.cartModel.findOne({
        where: { buyer_id },
        include: ['user'],
      });

      if (!cart) {
        return successRes(
          {
            buyer_id,
            products: [],
            total_amount: 0,
            item_count: 0,
          },
          200,
        );
      }

      return successRes(cart, 200);
    } catch (error) {
      throw new BadRequestException('Failed to fetch buyer cart');
    }
  }

  async update(id: string, updateCartDto: UpdateCartDto) {
    try {
      const cart = await this.cartModel.findByPk(id);
      if (!cart) {
        throw new NotFoundException(`Cart not found with id ${id}`);
      }

      if (updateCartDto.products) {
        const totalAmount = updateCartDto.products.reduce(
          (sum, product) => sum + product.price * product.quantity,
          0,
        );

        updateCartDto['total_amount'] = totalAmount;
        updateCartDto['item_count'] = updateCartDto.products.length;
      }

      await cart.update(updateCartDto);
      return successRes(cart, 200);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update cart');
    }
  }

  async remove(id: string) {
    try {
      const cart = await this.cartModel.findByPk(id);
      if (!cart) {
        throw new NotFoundException(`Cart not found with id ${id}`);
      }
      await cart.destroy();
      return successRes(null, 200);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete cart');
    }
  }

  async clearCart(buyer_id: string) {
    try {
      const cart = await this.cartModel.findOne({
        where: { buyer_id },
      });

      if (cart) {
        await cart.destroy();
      }

      return successRes(null, 200);
    } catch (error) {
      throw new BadRequestException('Failed to clear cart');
    }
  }
}
