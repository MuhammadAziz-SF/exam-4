import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import cfg from './config';
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
import { ImagesOfProduct } from './product/models/images_of_product.model';

// console.log('Config object:');
// console.log('cfg.PG_HOST:', cfg.PG_HOST);
// console.log('cfg.PG_PORT:', cfg.PG_PORT);
// console.log('cfg.PG_USER:', cfg.PG_USER);
// console.log('cfg.PG_PASS:', cfg.PG_PASS);
// console.log('cfg.PG_DB:', cfg.PG_DB);

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: cfg.PG_HOST,
      port: cfg.PG_PORT,
      username: cfg.PG_USER,
      password: cfg.PG_PASS,
      database: cfg.PG_DB,
      synchronize: true,
      logging: false,
      autoLoadModels: true,
      models: [
        User,
        Category,
        Product,
        Store,
        Admin,
        Review,
        Cart,
        Order,
        ImagesOfProduct,
      ],
    }),
    CacheModule.register({ isGlobal: true }),
    JwtModule.register({
      secret: cfg.JWT_ACCESS_K,
      signOptions: { expiresIn: cfg.JWT_ACCESS_T },
      global: true,
    }),
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
