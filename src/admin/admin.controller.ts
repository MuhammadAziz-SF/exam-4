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
import { Roles } from '../decorators/roles.decorator';
import { Roles as RoleEnum } from '../enum';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiHeader,
  ApiCookieAuth,
} from '@nestjs/swagger';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({ summary: 'Super admin login' })
  @ApiResponse({ status: 200, description: 'Super admin login successful' })
  @Post('super-admin/login')
  superAdminLogin(@Body() loginDto: LoginDto, @Res() res: Response) {
    return this.adminService.superAdminLogin(loginDto, res);
  }

  @ApiOperation({ summary: 'Admin login' })
  @ApiResponse({ status: 200, description: 'OTP sent successfully' })
  @Post('login')
  login(@Body() loginDto: LoginDto, @Res() res: Response) {
    return this.adminService.login(loginDto, res);
  }

  @ApiOperation({ summary: 'Confirm admin login' })
  @ApiResponse({ status: 200, description: 'Login confirmed successfully' })
  @Post('confirm-login')
  confirmLogin(@Body() confirmSignInAdminDto: ConfirmSignInAdminDto, @Res() res: Response) {
    return this.adminService.confirmLogin(confirmSignInAdminDto, res);
  }

  @ApiOperation({ summary: 'Admin logout' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  @Post('logout')
  logout(@Res() res: Response) {
    return this.adminService.logout(res);
  }

  @ApiOperation({ summary: 'Create new admin' })
  @ApiResponse({ status: 201, description: 'Admin created successfully' })
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.SUPER_ADMIN)
  create(@Body() createAdminDto: CreateAdminDto, @Res() res: Response) {
    return this.adminService.createAdmin(createAdminDto, res);
  }

  @ApiOperation({ summary: 'Get all admins' })
  @ApiResponse({ status: 200, description: 'Return all admins' })
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.SUPER_ADMIN)
  findAll(@Res() res: Response) {
    return this.adminService.findAll(res);
  }

  @ApiOperation({ summary: 'Get admin by ID' })
  @ApiResponse({ status: 200, description: 'Return admin by ID' })
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.SUPER_ADMIN)
  findOne(@Param('id') id: string, @Res() res: Response) {
    return this.adminService.findOne(id, res);
  }

  @ApiOperation({ summary: 'Update admin' })
  @ApiResponse({ status: 200, description: 'Admin updated successfully' })
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.SUPER_ADMIN)
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto, @Res() res: Response) {
    return this.adminService.update(id, updateAdminDto, res);
  }

  @ApiOperation({ summary: 'Delete admin' })
  @ApiResponse({ status: 200, description: 'Admin deleted successfully' })
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.SUPER_ADMIN)
  remove(@Param('id') id: string, @Res() res: Response) {
    return this.adminService.remove(id, res);
  }
}
