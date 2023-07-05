import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { Model } from 'mongoose';
import { UpdateProductDto } from './dto/update-product.dto';
import { SubCategory } from 'src/sub-category/schemas/sub-category.schema';
import { Category } from 'src/category/schemas/category.schema';
import { ObjectId } from 'mongodb';
import { UploadFileService } from 'src/upload-file/upload-file.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<Product>,

		@InjectModel(SubCategory.name)
		private subctgModel: Model<SubCategory>,

    @InjectModel(Category.name) 
    private categoryModel: Model<Category>,

    private fileMng: UploadFileService
  ) {}

  async create(product: CreateProductDto, imgFile?: any): Promise<{
    product?: Product;
    status?: boolean;
    message?: string;
    error?: any;
  }> {
    try {
      const imgPath = this.fileMng.saveImage(imgFile, './src/img/products');
      const { name, description, categoryId, subCategoryId } = product;
      const newProduct = await this.productModel.create({
        name, description, categoryId, subCategoryId, imageUrl: imgPath
      });

      return {
        status: true,
        product: newProduct,
      };
    } catch (error) {
      return {
        status: false,
        error: error,
      };
    }
  }

  async findAll(): Promise<Product[]> {

    return this.productModel.find().exec();
  }
  
  async findCategoryItems(subctgId: string) {
    try {
      const productPrices = await this.productModel.aggregate([
        {
          $match: { subCategoryId: new ObjectId(subctgId) }
        },
        {
          $lookup: {
            from: "prices",
            localField: "_id",
            foreignField: "productId",
            as: "prices"
          }
        },
        {
          $project: {
            _id: 1,
            name: 1,
            description: 1,
            imageUrl: 1,
            subCategoryId: 1,
            categoryId: 1,
            prices: {
              _id: 1,
              price: 1,
              shop: 1
            }
          }
        }
      ]);
  
      return {
        status: true,
        data: productPrices
      };
    } catch (error) {
      return {
        status: false,
        error: error
      };
    }
  }
  

  async findById(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();

    if (!product) {
      throw new NotFoundException(`Product with this ID (${id}) not found.`);
    }
    return product;
  }

  // async updateById(productId:string, product: UpdateProductDto, newImg?: any): Promise<{ Product?: any; status?: any; message?: any }> {
  //   const { name, description, categoryId, subCategoryId } = product;
  //   if (subCategoryId && categoryId) {

  //     // find all subctg id 
	// 		const subctgIds = await this.subctgModel.find({}, '_id').exec();

  //     // if this.suctgId == all subctg id
	// 		for (const scId of subctgIds) {
	// 			if (scId._id.toString() === subCategoryId) {

  //         const existedProduct = await this.productModel.findById(productId);

  //         if (!existedProduct) {
  //           return {
  //             status: false,
  //             message: 'Product with this ID is not found!'
  //           }
  //         }
  //         const filePath = this.fileMng.saveImage(newImg, './src/img/products');
  //         if (existedProduct.imageUrl) {
  //           this.fileMng.deleteFile(existedProduct.imageUrl);
  //         }

	// 				const updateProduct = await this.productModel.findByIdAndUpdate(productId, {name, description, imageUrl: filePath, categoryId, subCategoryId }, {new: true});
	// 				return {
	// 					status: true,
	// 					Product: updateProduct
	// 				};
	// 			}
	// 		}
  //     return {
	// 			status: false,
	// 			message: 'The subcategory with this ID does not exist.'
	// 		}
  //   }
  //   const categoryExists = await this.categoryModel.find({}, '_id').exec();
  //   if (!categoryExists) {
  //     return {
  //       status: false,
  //       message: 'The category with this ID does not exist.',
  //     };
  //   }
  //   return {
  //     status: false,
  //     message: 'The categoryId and subcategoryId cannot be null.',
  //   };
  // }

  async updateById(productId:string, product: UpdateProductDto, newImg?: any): Promise<{ Product?: any; status?: any; message?: any }> {
    const { name, description, categoryId, subCategoryId } = product;
    let existedProduct = await this.productModel.findById(productId);

    let newImgPath: string;
    if (newImg) {
        newImgPath = this.fileMng.saveImage(newImg, './src/img/products');
        this.fileMng.deleteFile(existedProduct.imageUrl);
    }

    if (newImgPath) {
      existedProduct = await this.productModel.findByIdAndUpdate(productId, {
        name, description, categoryId, subCategoryId, imageUrl : newImgPath
      }, {new: true})
    } else {
      existedProduct = await this.productModel.findByIdAndUpdate(productId, {
        name, description, categoryId, subCategoryId
      }, {new: true})
    }

   

    return {
      status: true,
      message: 'Upload successfully'
    }
  }

  async deleteById(
    id: string,
  ): Promise<{ status?: boolean; message?: string }> {
    await this.productModel.findByIdAndDelete(id);
    return {
      status: true,
      message: 'Product deleted successfully.',
    };
  }


  async findAllWithPrice() {
    try {
      const productPrices = await this.productModel.aggregate([
        {
          $lookup: {
            from: "prices",
            localField: "_id",
            foreignField: "productId",
            as: "prices"
          }
        },
        {
          $project: {
            _id: 1,
            name: 1,
            description: 1,
            imageUrl: 1,
            subCategoryId: 1,
            categoryId: 1,
            prices: {
              _id: 1,
              price: 1,
              shop: 1
            }

          }
        }
      ])
      return {
        status: true,
        data: productPrices
      }
    } catch (error) {
      return {
        status: false,
        error: error
      }
    }
  }
}


