import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document} from 'mongoose';

@Schema()
export class SubCategory extends Document {
    @Prop()
    name: string;
}

export const SubCategorySchema = SchemaFactory.createForClass(SubCategory);
