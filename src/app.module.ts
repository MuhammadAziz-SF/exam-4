import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { UsersModule } from './users/users.module';
import { UserProfileModule } from './user-profile/user-profile.module';
import { ProductModule } from './product/product.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [AdminModule, UsersModule, UserProfileModule, ProductModule, CategoriesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
