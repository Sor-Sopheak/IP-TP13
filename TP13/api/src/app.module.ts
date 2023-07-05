import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { SubCategoryModule } from './sub-category/sub-category.module';
import { ProductModule } from './product/product.module';
import { PriceModule } from './price/price.module';
import { UploadFileModule } from './upload-file/upload-file.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    
    MulterModule.register({
      dest:'/file'
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    AuthModule,
    CategoryModule,
    PriceModule,
    SubCategoryModule,
    ProductModule,
    UploadFileModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}