import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Request } from 'express';
import { Roles as UserRoles } from '../enum';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Roles(UserRoles.BUYER, UserRoles.SUPER_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  createOrderFromCart(@Req() req: Request) {
    return this.orderService.createOrderFromCart(req);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.orderService.findAll();
  }

  @Get('buyer/:buyer_id')
  @Roles(UserRoles.BUYER, UserRoles.ADMIN, UserRoles.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  findByBuyer(@Param('buyer_id') buyer_id: string) {
    return this.orderService.findByBuyer(buyer_id);
  }

  @Get(':id')
  @Roles(UserRoles.BUYER, UserRoles.ADMIN, UserRoles.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Delete(':id')
  @Roles(UserRoles.ADMIN, UserRoles.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}
