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
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { LoginDto } from './dto/login.dto';
import { ConfirmSignInAdminDto } from './dto/confirm-signin.dto';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { SuperAdminGuard } from 'src/guards/super-admin.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('super-admin-login')
  superAdminLogin(@Body() loginDto: LoginDto, @Res() res: Response) {
    return this.adminService.superAdminLogin(loginDto, res);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto, @Res() res: Response) {
    return this.adminService.login(loginDto, res);
  }

  @Post('confirm-login')
  confirmLogin(
    @Body() confirmSignInAdminDto: ConfirmSignInAdminDto,
    @Res() res: Response,
  ) {
    return this.adminService.confirmLogin(confirmSignInAdminDto, res);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Res() res: Response) {
    return this.adminService.logout(res);
  }

  @Post('super-admin-login')
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  create(@Body() createAdminDto: CreateAdminDto, @Res() res: Response) {
    return this.adminService.createAdmin(createAdminDto, res);
  }

  @Get()
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  findAll(@Res() res: Response) {
    return this.adminService.findAll(res);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  findOne(@Param('id') id: string, @Res() res: Response) {
    return this.adminService.findOne(id, res);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  update(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
    @Res() res: Response,
  ) {
    return this.adminService.update(id, updateAdminDto, res);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  remove(@Param('id') id: string, @Res() res: Response) {
    return this.adminService.remove(id, res);
  }
}
