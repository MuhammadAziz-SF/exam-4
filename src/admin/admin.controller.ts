import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Roles } from '../enum';
import { RolesGuard } from './guards/roles.guard';
import { RolesDecorator } from './decorators/roles.decorator';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('register')
  register(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.createAdmin(createAdminDto);
  }

  @Post('verify-register')
  verifyRegister(
    @Body() verifyOtpDto: VerifyOtpDto,
    @Body() createAdminDto: CreateAdminDto,
  ) {
    return this.adminService.verifyAndCreateAdmin(
      createAdminDto,
      verifyOtpDto.otp,
    );
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.adminService.login(loginDto);
  }

  @Post('verify-login')
  verifyLogin(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.adminService.verifyAndLogin(
      verifyOtpDto.email,
      verifyOtpDto.otp,
    );
  }

  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Roles.SUPER_ADMIN)
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.createAdmin(createAdminDto);
  }

  @Get('getAll')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
  findAll() {
    return this.adminService.findAll();
  }

  @Get('getById/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(id);
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Roles.SUPER_ADMIN)
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(id, updateAdminDto);
  }
}
