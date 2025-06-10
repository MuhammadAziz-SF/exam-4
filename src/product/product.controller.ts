import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFiles,
  Body,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Roles as UserRoles } from 'src/enum';
import { Request } from 'express';
import { RolesGuard } from 'src/guards/roles.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ImageValidationPipe } from 'src/pipes/image-validaton.pipe';

@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('pictures')) 
  @Roles(UserRoles.ADMIN, UserRoles.SUPER_ADMIN, UserRoles.SELLER)
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles(new ImageValidationPipe()) files: Express.Multer.File[],
    @Req() req: Request,
  ) {
    return this.productService.create(createProductDto, req, files);
  }

  @Get()
  @Roles(UserRoles.ADMIN, UserRoles.SUPER_ADMIN, UserRoles.SELLER)
  async findAll() {
    return await this.productService.findAll();
  }

  @Get(':id')
  @Roles(UserRoles.ADMIN, UserRoles.SUPER_ADMIN, UserRoles.SELLER)
  async findOne(@Param('id') id: string) {
    return await this.productService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('pictures'))
  @Roles(UserRoles.ADMIN, UserRoles.SUPER_ADMIN, UserRoles.SELLER)
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: Request, 
  ) {
    return this.productService.update(id, updateProductDto, req, files);
  }

  @Delete(':id')
  @Roles(UserRoles.ADMIN, UserRoles.SUPER_ADMIN, UserRoles.SELLER)
  async remove(@Param('id') id: string) {
    return await this.productService.remove(id);
  }
}
