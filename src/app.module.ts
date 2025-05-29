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
import { Product } from './product/models/product.model';
import { Category } from './categories/entities/category.entity';
import { User } from './users/entities/user.entity';
import { CacheModule } from '@nestjs/cache-manager';

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
      models: [Admin, User, Category, Product],
    }),
    CacheModule.register({
      isGlobal: true,
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
  ],
  providers: [JwtStrategy],
})
export class AppModule {}
