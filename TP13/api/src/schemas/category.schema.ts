import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Category extends Document {
  @Prop()
  name: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);