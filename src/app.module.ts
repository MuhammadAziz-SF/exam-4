import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import config from './config';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductModule } from './product/product.module';
import { StoreModule } from './store/store.module';
import { User } from './users/entity/user.entitiy';
import { Store } from './store/model/store.model';

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
      models: [User, Store],
    }),
    UsersModule,
    CategoriesModule,
    ProductModule,
    StoreModule,
  ],
})
export class AppModule {}
