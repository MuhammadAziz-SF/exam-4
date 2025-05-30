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

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.SUPER_ADMIN)
  @ApiOperation({ 
    summary: 'Create a new admin',
    description: 'Creates a new admin user. Only super admin can create new admins.'
  })
  @ApiBody({ 
    type: CreateAdminDto,
    description: 'Admin creation data'
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Admin created successfully',
    type: CreateAdminDto
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Invalid or missing token'
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - Insufficient permissions'
  })
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.createAdmin(createAdminDto);
  }

  @Post('/login')
  @ApiOperation({ 
    summary: 'Admin login',
    description: 'Authenticates an admin user and returns a JWT token'
  })
  @ApiBody({ 
    type: LoginDto,
    description: 'Admin login credentials'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login successful - Returns JWT token',
    type: LoginDto
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid credentials'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Invalid credentials'
  })
  login(@Body() loginDto: LoginDto) {
    return this.adminService.login(loginDto);
  }

  @Post('/confirm-login')
  @ApiOperation({ 
    summary: 'Confirm admin login with OTP',
    description: 'Confirms admin login using OTP sent to email'
  })
  @ApiBody({ 
    type: ConfirmSignInAdminDto,
    description: 'OTP confirmation data'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login confirmed successfully',
    type: ConfirmSignInAdminDto
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid OTP or OTP expired'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Invalid OTP'
  })
  confirmLogin(@Body() confirmSignInAdminDto: ConfirmSignInAdminDto, @Res() res: Response) {
    return this.adminService.confirmLogin(confirmSignInAdminDto, res);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Admin logout',
    description: 'Logs out the current admin user and invalidates the session'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Logout successful'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Invalid or missing token'
  })
  logout(@Res() res: Response) {
    return this.adminService.logout(res);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.SUPER_ADMIN)
  @ApiOperation({ 
    summary: 'Get all admins',
    description: 'Retrieves a list of all admin users. Only super admin can access this endpoint.'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all admins',
    type: [CreateAdminDto]
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Invalid or missing token'
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - Insufficient permissions'
  })
  findAll() {
    return this.adminService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.SUPER_ADMIN)
  @ApiOperation({ 
    summary: 'Get admin by ID',
    description: 'Retrieves a specific admin user by their ID. Only super admin can access this endpoint.'
  })
  @ApiParam({
    name: 'id',
    description: 'Admin ID',
    type: 'string',
    example: '1'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Admin details',
    type: CreateAdminDto
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Admin not found'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Invalid or missing token'
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - Insufficient permissions'
  })
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.SUPER_ADMIN)
  @ApiOperation({ 
    summary: 'Update admin',
    description: 'Updates a specific admin user. Only super admin can update admin details.'
  })
  @ApiParam({
    name: 'id',
    description: 'Admin ID',
    type: 'string',
    example: '1'
  })
  @ApiBody({ 
    type: UpdateAdminDto,
    description: 'Admin update data'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Admin updated successfully',
    type: UpdateAdminDto
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Admin not found'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Invalid or missing token'
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - Insufficient permissions'
  })
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(id, updateAdminDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.SUPER_ADMIN)
  @ApiOperation({ 
    summary: 'Delete admin',
    description: 'Deletes a specific admin user. Only super admin can delete admin users.'
  })
  @ApiParam({
    name: 'id',
    description: 'Admin ID',
    type: 'string',
    example: '1'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Admin deleted successfully'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Admin not found'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Invalid or missing token'
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - Insufficient permissions'
  })
  remove(@Param('id') id: string) {
    return this.adminService.remove(id);
  }
}
