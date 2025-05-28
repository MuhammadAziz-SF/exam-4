import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category)private model:typeof Category
  ){ }
  async create(createCategoryDto: CreateCategoryDto) {
    const newCategory=await this.model.create({...createCategoryDto})
    return newCategory
  }

  async findAll() {
    const categories=await this.model.findAll();
    return categories;
  }

  async findOne(id: number) {
    const categories=await this.model.findByPk(id)
    return categories;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const categories=await this.model.update(updateCategoryDto,{where:{id},returning:true});
    return categories[1][0]
  }

  async remove(id: number) {
    await this.model.destroy({where:{id}});
    return{data:{}}
  }
}
