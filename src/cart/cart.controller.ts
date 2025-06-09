import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  UseGuards,
  Req
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Roles as UserRoles } from '../enum';
import { SelfGuard } from 'src/guards/self.guard';
import { Request } from 'express';

@Controller('cart')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  @Roles(UserRoles.BUYER)
  @HttpCode(HttpStatus.CREATED)
  addToCart(@Body() createCartDto: CreateCartDto, @Req() req: Request ) {
    return this.cartService.addToCart(createCartDto, req);
  }

  @Get('my-cart')
  @Roles(UserRoles.BUYER)
  @HttpCode(HttpStatus.OK)
  getCurrentUserCart(@Req() req: Request) {
    return this.cartService.getCurrentUserCart(req);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.BUYER, UserRoles.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.cartService.findAll();
  }

  @Get('buyer/:buyer_id')
  @Roles(UserRoles.BUYER, UserRoles.ADMIN, UserRoles.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  findByBuyer(@Param('buyer_id') buyer_id: string) {
    return this.cartService.findByBuyer(buyer_id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.BUYER, UserRoles.ADMIN, UserRoles.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, SelfGuard)
  @Roles(UserRoles.BUYER)
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.update(id, updateCartDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.cartService.remove(id);
  }

  @Delete('buyer/:buyer_id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.BUYER)
  @HttpCode(HttpStatus.OK)
  clearCart(@Param('buyer_id') buyer_id: string) {
    return this.cartService.clearCart(buyer_id);
  }
}
