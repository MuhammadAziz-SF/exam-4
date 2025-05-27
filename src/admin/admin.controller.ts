import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('create')
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.createAdmin(createAdminDto);
  }

  @Get('getAll')
  findAll() {
    return this.adminService.findAll();
  }

  @Get('getById/:id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(id, updateAdminDto);
  }

  
}
