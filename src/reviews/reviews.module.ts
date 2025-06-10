import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Review } from './entities/review.entity';
import { User } from '../users/entities/user.entity';
import { Product } from '../product/models/product.model';

@Module({
  imports: [SequelizeModule.forFeature([Review, User, Product])],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
