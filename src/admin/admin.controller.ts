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
import { Response } from 'express';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { LoginDto } from './dto/login.dto';
import { ConfirmSignInAdminDto } from './dto/confirm-signin.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { RolesDecorator } from '../decorators/roles.decorator';
import { Roles as RoleEnum } from '../enum';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(RoleEnum.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new admin' })
  @ApiBody({ type: CreateAdminDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Admin created successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - Insufficient permissions',
  })
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.createAdmin(createAdminDto);
  }

  @Post('/login')
  @ApiOperation({ summary: 'Admin login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login successful',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid credentials',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  login(@Body() loginDto: LoginDto, res: Response) {
    return this.adminService.login(loginDto, res);
  }

  @Post('/confirm-login')
  @ApiOperation({ summary: 'Confirm admin login with OTP' })
  @ApiBody({ type: ConfirmSignInAdminDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login confirmed successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid OTP or OTP expired',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  confirmLogin(@Body() confirmSignInAdminDto: ConfirmSignInAdminDto, @Res() res: Response) {
    return this.adminService.confirmLogin(confirmSignInAdminDto, res);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin logout' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Logout successful',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  logout(@Res() res: Response) {
    return this.adminService.logout(res);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(RoleEnum.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all admins' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all admins',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - Insufficient permissions',
  })
  findAll() {
    return this.adminService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(RoleEnum.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get admin by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Admin details',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Admin not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - Insufficient permissions',
  })
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(RoleEnum.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update admin' })
  @ApiBody({ type: UpdateAdminDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Admin updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Admin not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - Insufficient permissions',
  })
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(id, updateAdminDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(RoleEnum.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete admin' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Admin deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Admin not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - Insufficient permissions',
  })
  remove(@Param('id') id: string) {
    return this.adminService.remove(id);
  }
}
