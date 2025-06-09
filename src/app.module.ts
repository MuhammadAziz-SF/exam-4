import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import config from './config';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductModule } from './product/product.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { User } from './users/entities/user.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { Category } from './categories/entities/category.entity';
import { Product } from './product/models/product.model';
import { Store } from './store/model/store.model';
import { Admin } from './admin/models/admin.model';
import { AdminModule } from './admin/admin.module';
import { StoreModule } from './store/store.module';
import { CartModule } from './cart/cart.module';
import { ReviewsModule } from './reviews/reviews.module';
import { Review } from './reviews/entities/review.entity';
import { Cart } from './cart/entities/cart.entity';
import { MailModule } from './mail/email.module';
import { Order } from './orders/entities/order.entity';
import { OrderModule } from './orders/order.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: config.PG_HOST,
      port: config.PG_PORT,
      username: config.PG_USER,
      password: config.PG_PASS,
      database: config.PG_DB,
      synchronize: true,
      logging: false,
      autoLoadModels: true,
      models: [User, Category, Product, Store, Admin, Review, Cart, Order],
    }),
    CacheModule.register({ isGlobal: true }),
    JwtModule.register({
      secret: config.JWT_ACCESS_K,
      signOptions: { expiresIn: config.JWT_ACCESS_T },
      global: true,
    }),
    PassportModule,
    AdminModule,
    UsersModule,
    CategoriesModule,
    ProductModule,
    StoreModule,
    CartModule,
    ReviewsModule,
    MailModule,
    OrderModule,
  ],
  providers: [JwtService],
})
export class AppModule {}
