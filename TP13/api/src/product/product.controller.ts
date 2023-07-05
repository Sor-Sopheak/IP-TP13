import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Param,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './schemas/product.schema';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post('/add')
  @UseInterceptors(FileInterceptor('image'))
  async createProduct(
    @UploadedFile() img:any,
    @Body() product: CreateProductDto
    ) {
    return this.productService.create(product, img);
  }

  @Get('/all')
  async getAllProduct() {
    return this.productService.findAllWithPrice();
  }

  @Get('/all/:subCategoryId?')
  async getId(@Param('subCategoryId') subCategoryId: string) {
    return this.productService.findCategoryItems(subCategoryId);
  }

  @Put('/update/:id')
  @UseInterceptors(FileInterceptor('image'))
  async updateProduct(
    @UploadedFile() img:any,
    @Body() product: UpdateProductDto,
    @Param('id') productId: string,
  ) {
    return this.productService.updateById(productId, product, img);
  }

  @Get('/id')
  async getProductById(@Body('id') id: string): Promise<Product> {
    return this.productService.findById(id);
  }

  @Delete('/delete/:id')
  async deleteProduct(
    @Param('id') id: string,
  ): Promise<{ status?: boolean; message?: string }> {
    return await this.productService.deleteById(id);
  }
}
