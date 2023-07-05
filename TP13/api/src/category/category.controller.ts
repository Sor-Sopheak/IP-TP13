import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './schemas/category.schema';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UploadFileService } from 'src/upload-file/upload-file.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('category')
export class CategoryController {
    constructor(
        private categoryService: CategoryService,

        private fileMng: UploadFileService
        ) {}

    @Post('/add')
    async createCategory(@Body() Category: CreateCategoryDto) {
        return await this.categoryService.create(Category);
    }


    // ==============================================================
    // @Post('/uploadFile')
    // @UseInterceptors(FileInterceptor('image'))
    // uplaodFile(@UploadedFile() img: any) {
    //     return this.fileMng.saveImage(img, './src/img/product');
    // }
    // ==============================================================

    @Get('/all')
    async getAllCategories(): Promise<Category[]> {
        return this.categoryService.findAll();
    }

    // Get by ID
    @Get('/id')
    async getCategory(@Param('id') id: string): Promise<Category> {
        return this.categoryService.findById(id);
    }

    // Update by ID
    @Put('/update/:id')
    async updateCategpry(@Body() category: UpdateCategoryDto,@Param("id") categoryId:string) {
        return this.categoryService.updateById(categoryId, category);
    }

    // Delete by ID
    @Delete('/delete/:id')
    async deleteCategory(@Param('id') id: string): Promise<{status?: boolean; message?: string }> {
        return await this.categoryService.deleteById(id);
    }
}
