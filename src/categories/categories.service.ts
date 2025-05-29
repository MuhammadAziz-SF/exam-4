import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from './entities/category.entity';
import { InternalServerErrorException } from '@nestjs/common';
@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category)private model:typeof Category
  ){ }
  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const newCategory=await this.model.create({...createCategoryDto})
    return newCategory
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }}

  async findAll() {
    try {
      const categories=await this.model.findAll();
    return categories;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }}

  async findOne(id: number) {
    try {
      const categories=await this.model.findByPk(id)
    return categories;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }}

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      const categories=await this.model.update(updateCategoryDto,{where:{id},returning:true});
    return categories[1][0]
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }}

  async remove(id: number) {
    try {
      await this.model.destroy({where:{id}});
    return{data:{}}
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }}
}
