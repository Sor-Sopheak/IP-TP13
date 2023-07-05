import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from './schemas/product.schema';
import { ProductController } from './product.controller';
import { SubCategorySchema } from 'src/sub-category/schemas/sub-category.schema';
import { CategorySchema } from 'src/category/schemas/category.schema';
import { UploadFileService } from 'src/upload-file/upload-file.service';

@Module({
  imports: [
    MongooseModule.forFeature([
        { name: 'Product', schema: ProductSchema }, 
        { name: 'SubCategory', schema: SubCategorySchema},
        { name: 'Category', schema: CategorySchema }
      ])
  ],
  providers: [ProductService, UploadFileService],
  controllers: [ProductController]
})
export class ProductModule {}