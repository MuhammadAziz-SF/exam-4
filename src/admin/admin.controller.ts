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
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Roles } from '../enum';
import { RolesGuard } from '../guards/roles.guard';
import { RolesDecorator } from '../decorators/roles.decorator';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({ summary: 'Register new admin' })
  @ApiResponse({ status: 201, description: 'Admin registered successfully' })
  @Post('register')
  register(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.createAdmin(createAdminDto);
  }

  @ApiOperation({ summary: 'Verify admin registration' })
  @ApiResponse({ status: 200, description: 'Admin registration verified' })
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

  @ApiOperation({ summary: 'Admin login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.adminService.login(loginDto);
  }

  @ApiOperation({ summary: 'Verify admin login' })
  @ApiResponse({ status: 200, description: 'Login verified' })
  @Post('verify-login')
  verifyLogin(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.adminService.verifyAndLogin(
      verifyOtpDto.email,
      verifyOtpDto.otp,
    );
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new admin (Super Admin only)' })
  @ApiResponse({ status: 201, description: 'Admin created successfully' })
  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Roles.SUPER_ADMIN)
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.createAdmin(createAdminDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all admins' })
  @ApiResponse({ status: 200, description: 'Return all admins' })
  @Get('getAll')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
  findAll() {
    return this.adminService.findAll();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get admin by ID' })
  @ApiResponse({ status: 200, description: 'Return admin by ID' })
  @Get('getById/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update admin (Super Admin only)' })
  @ApiResponse({ status: 200, description: 'Admin updated successfully' })
  @Patch('update/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Roles.SUPER_ADMIN)
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(id, updateAdminDto);
  }
}
