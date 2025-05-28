import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminModule } from './admin/admin.module';
import config from './config';
import { Admin } from './admin/models/admin.model';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductModule } from './product/product.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { OrderDeliveryModule } from './order_delivery/order_delivery.module';
import { OrderDelivery } from './order_delivery/entities/order_delivery.entity';

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
      models: [Admin,OrderDelivery],
    }),
    JwtModule.register({
      secret: config.JWT_ACCESS_K,
      signOptions: { expiresIn: config.JWT_ACCESS_T },
    }),
    PassportModule,
    AdminModule,
    UsersModule,
    CategoriesModule,
    ProductModule,
    OrderDeliveryModule,
  ],
  providers: [JwtStrategy],
})
export class AppModule {}
