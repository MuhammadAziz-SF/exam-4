import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
// import { AdminModule } from './admin/admin.module';
import config from './config';
// import { Admin } from './admin/models/admin.model';
// import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';

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
      models: [],
    }),
    UsersModule
  ],
})
export class AppModule {}
