import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { CreateReplyDto } from './dto/create-reply.dto';
import { User } from '../users/entities/user.entity';
import { Product } from '../product/models/product.model';
import { Roles } from 'src/enum';
import { successRes } from 'src/utils/success-response';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review) private reviewModel: typeof Review,
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Product) private productModel: typeof Product,
    private sequelize: Sequelize,
  ) {}

  async create(createReviewDto: CreateReviewDto) {
    try {
      // Validate if user exists
      const user = await this.userModel.findByPk(createReviewDto.user_id);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Validate if product exists
      const product = await this.productModel.findByPk(
        createReviewDto.product_id,
      );
      if (!product) {
        throw new NotFoundException('Product not found');
      }

      // Check if user role is buyer or admin/super_admin
      if (
        user.role !== Roles.BUYER &&
        user.role !== Roles.ADMIN &&
        user.role !== Roles.SUPER_ADMIN
      ) {
        throw new ForbiddenException(
          'Only buyers and admins can create reviews',
        );
      }

      // Create the review
      const review = await this.reviewModel.create({
        ...createReviewDto,
        is_reply: false,
      });

      // Calculate average rating for product and update it
      await this.updateProductRating(createReviewDto.product_id);

      return successRes(review, 201);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new BadRequestException(
        'Failed to create review: ' + error.message,
      );
    }
  }

  async createReply(createReplyDto: CreateReplyDto) {
    try {
      const user = await this.userModel.findByPk(createReplyDto.user_id);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const parentReview = await this.reviewModel.findByPk(
        createReplyDto.parent_id,
      );
      if (!parentReview) {
        throw new NotFoundException('Parent review not found');
      }

      const product = await this.productModel.findByPk(
        createReplyDto.product_id,
      );
      if (!product) {
        throw new NotFoundException('Product not found');
      }

      if (
        user.role !== Roles.BUYER &&
        user.role !== Roles.SELLER &&
        user.role !== Roles.ADMIN &&
        user.role !== Roles.SUPER_ADMIN
      ) {
        throw new ForbiddenException(
          'Only buyers, sellers, and admins can reply to reviews',
        );
      }

      if (user.role === Roles.SELLER && product.seller_id !== user.id) {
        throw new ForbiddenException(
          'Sellers can only reply to reviews for their own products',
        );
      }

      const reply = await this.reviewModel.create({
        user_id: createReplyDto.user_id,
        product_id: createReplyDto.product_id,
        parent_id: createReplyDto.parent_id,
        comment: createReplyDto.comment,
        is_reply: true,
      });

      return successRes(reply, 201);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to create reply: ' + error.message);
    }
  }

  async findAll() {
    try {
      const reviews = await this.reviewModel.findAll({
        where: { is_reply: false },
        include: [
          {
            model: User,
            attributes: ['id', 'full_name', 'email', 'role'],
          },
          {
            model: Product,
            attributes: ['id', 'name', 'price'],
          },
          {
            model: Review,
            as: 'replies',
            include: [
              {
                model: User,
                attributes: ['id', 'full_name', 'email', 'role'],
              },
            ],
          },
        ],
      });
      return successRes(reviews, 200);
    } catch (error) {
      throw new BadRequestException('Failed to fetch reviews');
    }
  }

  async findByProduct(product_id: string) {
    try {
      const reviews = await this.reviewModel.findAll({
        where: { product_id, is_reply: false },
        include: [
          {
            model: User,
            attributes: ['id', 'full_name', 'email', 'role'],
          },
          {
            model: Review,
            as: 'replies',
            include: [
              {
                model: User,
                attributes: ['id', 'full_name', 'email', 'role'],
              },
            ],
          },
        ],
      });
      return successRes(reviews, 200);
    } catch (error) {
      throw new BadRequestException('Failed to fetch product reviews');
    }
  }

  async findOne(id: string) {
    try {
      const review = await this.reviewModel.findByPk(id, {
        include: [
          {
            model: User,
            attributes: ['id', 'full_name', 'email', 'role'],
          },
          {
            model: Product,
            attributes: ['id', 'name', 'price'],
          },
          {
            model: Review,
            as: 'replies',
            include: [
              {
                model: User,
                attributes: ['id', 'full_name', 'email', 'role'],
              },
            ],
          },
        ],
      });

      if (!review) {
        throw new NotFoundException(`Review not found with id ${id}`);
      }

      return successRes(review, 200);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch review');
    }
  }

  async update(id: string, updateReviewDto: UpdateReviewDto, user_id: string) {
    try {
      const review = await this.reviewModel.findByPk(id);
      if (!review) {
        throw new NotFoundException(`Review not found with id ${id}`);
      }

      // Only the author of the review or an admin can update it
      const user = await this.userModel.findByPk(user_id);
      if (
        review.user_id !== user_id &&
        user?.role !== Roles.ADMIN &&
        user?.role !== Roles.SUPER_ADMIN
      ) {
        throw new ForbiddenException(
          'You do not have permission to update this review',
        );
      }

      // If it's a reply, don't allow changing the rating
      if (review.is_reply && updateReviewDto.rating) {
        throw new BadRequestException('Cannot set rating for a reply');
      }

      await review.update(updateReviewDto);

      // If the rating was updated, update the product's average rating
      if (updateReviewDto.rating && !review.is_reply) {
        await this.updateProductRating(review.product_id);
      }

      return successRes(review, 200);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to update review');
    }
  }

  async remove(id: string, user_id: string) {
    try {
      const review = await this.reviewModel.findByPk(id);
      if (!review) {
        throw new NotFoundException(`Review not found with id ${id}`);
      }

      // Only the author of the review or an admin can delete it
      const user = await this.userModel.findByPk(user_id);
      if (
        review.user_id !== user_id &&
        user?.role !== Roles.ADMIN &&
        user?.role !== Roles.SUPER_ADMIN
      ) {
        throw new ForbiddenException(
          'You do not have permission to delete this review',
        );
      }

      // If it's a parent review, delete all replies first
      if (!review.is_reply) {
        await this.reviewModel.destroy({
          where: { parent_id: id },
        });
      }

      await review.destroy();

      // If it's a review with rating, update the product's average rating
      if (!review.is_reply) {
        await this.updateProductRating(review.product_id);
      }

      return successRes(null, 200);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to delete review');
    }
  }

  private async updateProductRating(product_id: string) {
    try {
      // Calculate the average rating
      const result = await this.reviewModel.findAll({
        where: { product_id, is_reply: false },
        attributes: [
          [
            this.sequelize.fn('AVG', this.sequelize.col('rating')),
            'averageRating',
          ],
        ],
      });

      const avgRating = result[0].getDataValue('averageRating') || 0;

      // Update the product with the new average rating
      // This assumes the Product model has a rating field
      await this.productModel.update(
        { rating: avgRating },
        { where: { id: product_id } },
      );
    } catch (error) {
      console.error('Failed to update product rating:', error);
    }
  }
}
