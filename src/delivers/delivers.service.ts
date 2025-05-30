import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateDeliverDto } from './dto/create-deliver.dto';
import { UpdateDeliverDto } from './dto/update-deliver.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Delivers } from './model/delivery.model';

@Injectable()
export class DeliversService {
  constructor(@InjectModel(Delivers) private model: typeof Delivers) {}
  async create(createDeliverDto: CreateDeliverDto) {
    try {
      const deliverData = {
        full_name: createDeliverDto.full_name,
        phone_number: createDeliverDto.phone_number,
        date_of_birth: new Date(createDeliverDto.date_of_birth),
      };
      const deliver = await this.model.create(deliverData as any);
      return deliver;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll() {
    try {
      return this.model.findAll();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: number) {
    try {
      const deliver = await this.model.findByPk(id);
      if (!deliver) {
        throw new NotFoundException(`ID ${id} deliver not found`);
      }
      return deliver;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: number, updateDeliverDto: UpdateDeliverDto) {
    try {
      const deliver = await this.findOne(id);
      const updateData = {
        full_name: updateDeliverDto.full_name,
        phone_number: updateDeliverDto.phone_number,
        date_of_birth: updateDeliverDto.date_of_birth
          ? new Date(updateDeliverDto.date_of_birth)
          : undefined,
      };
      await deliver.update(updateData as any);
      return deliver;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number) {
    try {
      const deliver = await this.findOne(id);
      await deliver.destroy();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
