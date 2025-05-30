import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CacheModule } from '@nestjs/cache-manager';

import config from './config';


import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductModule } from './product/product.module';
import { StoreModule } from './store/store.module';
import { DeliversModule } from './delivers/delivers.module';
import { OrderDeliveryModule } from './order_delivery/order_delivery.module';
import { OrderItemsModule } from './order-items/order-items.module';
import { CartModule } from './cart/cart.module';
import { CartItemsModule } from './cart-items/cart-items.module';
import { ReviewsModule } from './reviews/reviews.module';
import { TransactionModule } from './transaction/transaction.module';
import { AdminModule } from './admin/admin.module';


import { User } from './users/entities/user.entity';
import { Category } from './categories/entities/category.entity';
import { Product } from './product/models/product.model';
import { Store } from './store/model/store.model';
import { OrderDelivery } from './order_delivery/entities/order_delivery.entity';
import { Admin } from './admin/models/admin.model';


import { JwtStrategy } from './strategies/jwt.strategy';

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
      models: [User, Category, Product, Store, OrderDelivery, Admin],
    }),
    CacheModule.register({ isGlobal: true }),
    JwtModule.register({
      secret: config.JWT_ACCESS_K,
      signOptions: { expiresIn: config.JWT_ACCESS_T },
    }),
    PassportModule,
    AdminModule,
    UsersModule,
    CategoriesModule,
    ProductModule,
    StoreModule,
    DeliversModule,
    OrderDeliveryModule,
    OrderItemsModule,
    CartModule,
    CartItemsModule,
    ReviewsModule,
    TransactionModule,
  ],
  providers: [JwtStrategy],
})
export class AppModule {}
