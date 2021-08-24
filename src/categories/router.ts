import { Router } from 'express';
import { StatusCodes } from '../constants';
import { CategoryItem } from './category';

const mongoose = require('mongoose');

const router = Router();

router.get('/', async (req, res) => {
  const { page } = req.query;
  const { limit } = req.query;
  const skipIndex = (+page - 1) * +limit;
  const endIndex = +page * +limit;
  const results = await CategoryItem.find({});
  console.log(results);
  const endResult = results.slice(skipIndex, endIndex);
  res.json(endResult);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  CategoryItem.remove({ _id: id })
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

router.post('/', async (req, res) => {
  const category = new CategoryItem({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
  });
  category.save()
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(StatusCodes.Error).json({
        error: err,
      });
    });
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const newName = req.body.name;
  CategoryItem.updateOne({ _id: id }, { $set: { name: newName } })
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

export default router;
