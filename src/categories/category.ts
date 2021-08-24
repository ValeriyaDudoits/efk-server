import { model, Schema, Model } from 'mongoose';

export interface CategorySchemaI {
  _id: string,
  name: string;
}

export const CategorySchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: { type: String, required: true },
});

export const CategoryItem: Model<CategorySchemaI> = model('CategoryDB', CategorySchema);
