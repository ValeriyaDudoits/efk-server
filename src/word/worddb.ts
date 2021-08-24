import {
  model, Schema, Model,
} from 'mongoose';
import { DEFAULT_IMAGE } from '../constants';

export interface WordSchema {
  _id: string,
  oldWord?: string;
  word: string;
  translation: string;
  categoryName: string;
  image: string;
  audio: string;
}

export const wordSchema = new Schema({
  _id: Schema.Types.ObjectId,
  oldWord: { type: String, required: false },
  word: { type: String, required: true },
  translation: { type: String, required: true },
  categoryName: { type: String, required: true },
  image: { type: String, default: DEFAULT_IMAGE },
  audio: { type: String, required: false },
});

export const WordItem: Model<WordSchema> = model('WordDB', wordSchema);
