import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import config from './config';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductModule } from './product/product.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DeliversModule } from './delivers/delivers.module';
import { Delivers } from './delivers/model/delivery.model';
import { OrderItem } from './order-items/entities/order-item.entity';
import { User } from './users/entities/user.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { Category } from './categories/entities/category.entity';
import { Product } from './product/models/product.model';
import { Store } from './store/model/store.model';
import { OrderDelivery } from './order_delivery/entities/order_delivery.entity';
import { Admin } from './admin/models/admin.model';
import { AdminModule } from './admin/admin.module';
import { StoreModule } from './store/store.module';
import { OrderDeliveryModule } from './order_delivery/order_delivery.module';
import { OrderItemsModule } from './order-items/order-items.module';
import { CartModule } from './cart/cart.module';
import { CartItemsModule } from './cart-items/cart-items.module';
import { ReviewsModule } from './reviews/reviews.module';
import { TransactionModule } from './transaction/transaction.module';
import { Review } from './reviews/entities/review.entity';
import { Cart } from './cart/entities/cart.entity';
import { CartItem } from './cart-items/entities/cart-item.entity';
import { Transaction } from './transaction/entities/transaction.entity';
import { MailModule } from './mail/email.module';

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
      sync: {
        force: false,
        alter: true,
      },
      models: [
        User,
        Category,
        Product,
        Delivers,
        OrderItem,
        Store,
        OrderDelivery,
        Admin,
        Review,
        Cart,
        CartItem,
        Transaction
      ],
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
    DeliversModule,
    OrderDeliveryModule,
    OrderItemsModule,
    CartModule,
    CartItemsModule,
    ReviewsModule,
    TransactionModule,
    MailModule
  ],
  providers: [JwtService],
})
export class AppModule {}
