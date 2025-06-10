import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cart } from './entities/cart.entity';
import { CreateCartDto } from './dto/create-cart.dto';
// import { UpdateCartDto } from './dto/update-cart.dto';
import { successRes } from 'src/utils/success-response';
import { decodeJwt } from 'src/services/getIdByJwt';
import { Request } from 'express';
import { Product } from 'src/product/models/product.model';
import { Op } from 'sequelize';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart) private cartModel: typeof Cart) {}

  async addToCart(createCartDto: CreateCartDto, req: Request) {
  try {
    const decoded = await decodeJwt(req);
    const buyer_id = decoded.id;

    let cart = await this.cartModel.findOne({ where: { buyer_id } });
    
    const productIds = createCartDto.products.map(id => String(id));
    const products = await Product.findAll({
      where: { id: { [Op.in]: productIds } }
    });
    
    const newProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: product.quantity
    }));
    
    const totalAmount = newProducts.reduce(
      (sum, product) => sum + product.price * product.quantity, 0);
  
    if (cart) {
      
      const updatedProducts = [...cart.products, ...newProducts];
      const updatedTotal = updatedProducts.reduce(
        (sum, product) => sum + product.price * product.quantity,
        0
      );

      await cart.update({
        products: updatedProducts,
        total_amount: updatedTotal,
        item_count: updatedProducts.length,
      });

      return successRes(cart, 200);
    }

    cart = await this.cartModel.create({
      buyer_id,
      products: newProducts,
      total_amount: totalAmount,
      item_count: newProducts.length,
    });

    return successRes(cart, 201);
  } catch (error) {
    throw new BadRequestException('Failed to add to cart: ' + error.message);
  }
}


  async findAll() {
    try {
      const carts = await this.cartModel.findAll({
        attributes: { exclude: ['user'] }
      });
      return successRes(carts, 200);
    } catch (error) {
      throw new BadRequestException('Failed to fetch carts');
    }
  }

  async findOne(id: string) {
    try {
      const cart = await this.cartModel.findByPk(id, {
        attributes: { exclude: ['user'] }
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
        attributes: { exclude: ['user'] }
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

      const { product_id, quantity } = updateCartDto;
      
      const productIndex = cart.products.findIndex(p => p.id === product_id);
      if (productIndex === -1) {
        throw new NotFoundException(`Product not found in cart`);
      }
      
      cart.products[productIndex].quantity = quantity;
      
      const totalAmount = cart.products.reduce(
        (sum, product) => sum + product.price * product.quantity,
        0
      );

      await cart.update({
        products: cart.products,
        total_amount: totalAmount
      });
      
      return successRes(cart, 200);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update cart quantity');
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

  async getCurrentUserCart(req: Request) {
    try {
      const decoded = await decodeJwt(req);
      const buyer_id = decoded.id;
      
      const cart = await this.cartModel.findOne({
        where: { buyer_id },
        raw: false,
        attributes: { 
          exclude: ['user']
        }
      });
      
      if (!cart) {
        return successRes({
          products: [],
          total_amount: 0,
          item_count: 0
        }, 200);
      }
      
      return successRes({
        products: cart.dataValues.products || [],
        total_amount: cart.dataValues.total_amount || 0,
        item_count: cart.dataValues.item_count || 0
      }, 200);
    } catch (error) {
      throw new BadRequestException('Failed to fetch cart: ' + error.message);
    }
  }
}
