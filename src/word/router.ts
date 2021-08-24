import { Router } from 'express';
import { StatusCodes } from '../constants';
import { WordItem } from './worddb';

const mongoose = require('mongoose');

const router = Router();

router.get('/', async (req, res) => {
  const { page } = req.query;
  const { limit } = req.query;
  const skipIndex = (+page - 1) * +limit;
  const endIndex = +page * +limit;
  const results = await WordItem.find({});
  console.log(results);
  const endResult = results.slice(skipIndex, endIndex);
  res.json(endResult);
});

router.get('/:categoryName', async (req, res) => {
  const { categoryName } = req.params;
  const { page } = req.query;
  const { limit } = req.query;
  const skipIndex = (+page - 1) * +limit;
  const endIndex = +page * +limit;
  const results = await WordItem.find({ categoryName: `${categoryName}` });
  console.log(results);
  const endResult = results.slice(skipIndex, endIndex);
  res.json(endResult);
});

router.delete('/:categoryName/:delete', async (req, res) => {
  const deleteByCategory = req.params.categoryName;
  WordItem.remove({ categoryName: deleteByCategory })
    .exec()
    .then(() => {
      res.sendStatus(StatusCodes.Ok);
    }).catch((err) => {
      console.log(err);
      res.status(StatusCodes.Error).json({
        error: err,
      });
    });
});

router.delete('/:word', async (req, res) => {
  const wordDelete = req.params.word;
  WordItem.remove({ word: wordDelete })
    .exec()
    .then(() => {
      res.sendStatus(StatusCodes.Ok);
    }).catch((err) => {
      console.log(err);
      res.status(StatusCodes.Error).json({
        error: err,
      });
    });
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  WordItem.updateOne({ _id: id }, {
    $set: {
      word: data.word,
      translation: data.translation,
      categoryName: data.categoryName,
      image: data.image,
      audio: data.audio,
    },
  })
    .exec()
    .then(() => {
      res.status(StatusCodes.Ok).json({
        message: 'Product updated',
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(StatusCodes.Error).json({
        error: err,
      });
    });
});

router.post('/', async (req, res) => {
  const data = req.body;
  let { image } = data;
  if (image == null) {
    image = 'https://res.cloudinary.com/dabjalbwe/image/upload/v1626252246/lmxqrz6wcmwyhkxgcsnr.jpg';
  }
  const word = new WordItem({
    _id: new mongoose.Types.ObjectId(),
    word: data.word,
    translation: data.translation,
    categoryName: data.categoryName,
    image,
    audio: data.audio,
  });
  word.save()
    .then((result) => {
      console.log(result);
      res.status(StatusCodes.Ok).json({
        message: 'Created product successfully',
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(StatusCodes.Error).json({
        error: err,
      });
    });
});

export default router;
