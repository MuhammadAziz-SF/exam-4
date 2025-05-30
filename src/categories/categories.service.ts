import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from './entities/category.entity';
import { InternalServerErrorException,NotFoundException } from '@nestjs/common';
@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category)private model:typeof Category
  ){ }
  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const newCategory=await this.model.create({...createCategoryDto})

    return {
      status:200,
      message:'success',
      data:newCategory
    }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }}

  async findAll() {
    try {
      const categories=await this.model.findAll();
    
      return {
        status:200,
        message:"success",
        data:categories,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }}

  async findOne(id: number) {
    try {
      const categories=await this.model.findByPk(id)
      if(!categories){
        throw new Error("category not found");
      }
      return{
        status:200,
        message:'success',
        data: categories
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }}

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      const categories=await this.model.update(updateCategoryDto,{where:{id},returning:true});
      if (categories === 0) {
        throw new NotFoundException(`ID ${id} boyicha yangilash amalga oshmadi`);
      }
    return {
      status:200,
      message:'success',
      data:categories[1][0]
    }
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
