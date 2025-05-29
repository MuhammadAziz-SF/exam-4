import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DeliversService } from './delivers.service';
import { CreateDeliverDto } from './dto/create-deliver.dto';
import { UpdateDeliverDto } from './dto/update-deliver.dto';

@Controller('delivers')
export class DeliversController {
  constructor(private readonly deliversService: DeliversService) {}

  @Post()
  create(@Body() createDeliverDto: CreateDeliverDto) {
    return this.deliversService.create(createDeliverDto);
  }

  @Get()
  findAll() {
    return this.deliversService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deliversService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDeliverDto: UpdateDeliverDto) {
    return this.deliversService.update(+id, updateDeliverDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deliversService.remove(+id);
  }
}
