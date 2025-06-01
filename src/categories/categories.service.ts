import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from './entities/category.entity';
import { catchError } from 'src/utils/catch-error';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category)private model:typeof Category
  ){ }
  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const category = await this.model.findOne({ where: { name: createCategoryDto.name } });

    if (category) {
      return {
        statusCode: 400,
        message: "Category already exists",
      };
    }
    const newCategory=await this.model.create({...createCategoryDto});

      return {
      statusCode:201,
      message:'success',
      data:newCategory
    }
    } catch (error) {
    return catchError(error)
    }}

  async findAll() {
    try {
      const categories=await this.model.findAll();
     return {
      statusCode:200,
      message:'success',
      data:categories
    }
    } catch (error) {
      return catchError(error)    
    }}

  async findOne(id: number) {
    try {
      const categories=await this.model.findByPk(id)
      if(!categories){
        throw new NotFoundException("categories not found")
      }
     return {
      statusCode:200,
      message:'success',
      data:categories
    }
    } catch (error) {
      return catchError(error)
    }}

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      const [updatedCount,updatedRows]=await this.model.update(updateCategoryDto,{where :{id},returning:true,})
      if(updatedCount===0){
        throw new NotFoundException()
      }
      return {
        statusCode:200,
        message:'success',
        data:updatedRows[0]
      }    } catch (error) {
      return catchError(error)
    }}

  async remove(id: number) {
    try {
      const deletedCount=await this.model.destroy({where:{id}})
      if(deletedCount===0){
          throw new NotFoundException()
      }
      await this.model.destroy({where:{id}});
      return {
        statusCode:200,
        message:'success',
        data:{}
      }    } catch (error) {
      return catchError(error)
      }}
}
