import { MongooseModule } from '@nestjs/mongoose';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { Module } from '@nestjs/common';
import { CategorySchema } from './schemas/category.schema';
import { UploadFileService } from 'src/upload-file/upload-file.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Category', schema: CategorySchema }])],
    controllers: [CategoryController],
    providers: [CategoryService, UploadFileService]
        
})

export class CategoryModule {}
