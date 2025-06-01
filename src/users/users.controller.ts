import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LogInDto } from './dto/login.dto';
import { ConfirmLoginDto } from './dto/confirm-login.dto';
import { Response } from 'express';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/enum';
import { Roles as RolesDecorator } from 'src/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { AdminGuard } from 'src/guards/admin.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @UseGuards(JwtAuthGuard, AdminGuard)
  @RolesDecorator(Roles.ADMIN, Roles.SUPER_ADMIN)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginDto: LogInDto) {
    return this.usersService.SignInUser(loginDto);
  }

  @Post('confirm-login')
  confirmLogin(@Body() confirmLoginDto: ConfirmLoginDto, @Res() res: Response) {
    return this.usersService.confirmLogin(confirmLoginDto, res);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Res() res: Response) {
    return this.usersService.logOut(res);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all users' })
  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @RolesDecorator(Roles.ADMIN, Roles.SUPER_ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'Return user by ID' })
  @Get(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @RolesDecorator(Roles.ADMIN, Roles.SUPER_ADMIN)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @RolesDecorator(Roles.ADMIN, Roles.SUPER_ADMIN)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @RolesDecorator(Roles.ADMIN, Roles.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
