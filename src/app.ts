import express from 'express';
import { promises as fsp } from 'fs';
import cors from 'cors';
import bodyParser from 'body-parser';
import multer from 'multer';
import mongoose from 'mongoose';

import words from './word/router';
import categoryRoutes from './categories/router';

require('dotenv').config();
const cloudinary = require('cloudinary').v2;

const PORT = 4000;
const app = express();
app.use(bodyParser.json());
app.use(cors());
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './public/');
  },
  filename(req, file, cb) {
    cb(null, `${file.originalname}-${Date.now()}${file.originalname.substr((file.originalname.length - 4),
      file.originalname.length)}`);
  },
});
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

export const upload = multer({ storage });

app.use('/api/categories', categoryRoutes);
app.use('/api/words', words);

async function start() {
  try {
    await mongoose.connect('mongodb+srv://valeriya:_WhNMPLp5tBjnk8@cluster0.mrh35.mongodb.net/efk', {
      useNewUrlParser: true,
      useFindAndModify: false,
    });
    app.listen(PORT, () => console.log('Server started on http://localhost:4000'));
  } catch (error) {
    console.log(error);
  }
}
start();

app.post('/api/image', upload.single('image'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    res.send(result);
  } catch (error) {
    res.send(error);
  }
  fsp.unlink(req.file.path);
});

app.post('/api/audio', upload.single('audio'), async (req, res) => {
  try {
    console.log(req.file.path);
    const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'video' });
    res.send(result);
  } catch (error) {
    res.send(error);
  }
  fsp.unlink(req.file.path);
});
