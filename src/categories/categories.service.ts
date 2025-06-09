import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from './entities/category.entity';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { successRes } from 'src/utils/success-response';

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category) private model: typeof Category) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const newCategory = await this.model.create({ ...createCategoryDto });
      return successRes(newCategory, 200);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll() {
    try {
      const categories = await this.model.findAll();
      return successRes(categories, 200);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: string) {
    try {
      const categories = await this.model.findByPk(id);
      if (!categories) {
        throw new Error('category not found');
      }
      return successRes(categories, 200);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      const [affectedCount, affectedRows] = await this.model.update(
        updateCategoryDto,
        { where: { id }, returning: true },
      );
      if (affectedCount === 0) {
        throw new NotFoundException(
          `ID ${id} boyicha yangilash amalga oshmadi`,
        );
      }
      return successRes(affectedRows[0], 200);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: string) {
    try {
      await this.model.destroy({ where: { id } });
      return successRes(null, 200);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
