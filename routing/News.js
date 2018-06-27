import express from 'express';
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator/check';
import User from '../models/User';
import config from '../config';
import News from '../models/News';

const router = express.Router();
router.get('/', (req, res) => {
  News.find().then((news) => {
    res.status(200).json({
      result: 1,
      data: news,
    });
  });
});
router.get('/user', (req, res) => {
  jwt.verify(req.headers['x-access-token'], config.secret, (err, decoded) => {
    if (err) {
      res.json({ status: "error", message: err.message, data: null });
    } else {
      User.findOne({ _id: decoded.id }).select('-password').then((user) => {
        News.find({
          creator: user._id,
        }).then((news) => {
          res.status(200).json({
            result: 1,
            data: news,
          });
        });
      });
    }
  });
});
router.get('/:id', [

  check('id').isMongoId().trim().withMessage('News not Found'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const id = req.params.id;


  News.findById(id).then((news) => {
    if (!news) {
      res.status(200).json({
        result: 0,
        data: "News not Found",
      });
    } else {
      res.status(200).json({
        result: 1,
        data: news,
      });
    }
  });
});
router.post('/:id/edit', [

  check('id').isMongoId().trim().withMessage('News not Found'),
  check('title').isLength({ min: 5 }).withMessage('must be at least 5 chars long'),
  check('content').isLength({ min: 5 }).withMessage('must be at least 25 chars long'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const id = req.params.id;


  jwt.verify(req.headers['x-access-token'], config.secret, (err, decoded) => {
    if (err) {
      res.json({ status: "error", message: err.message, data: null });
    } else {
      User.findOne({ _id: decoded.id }).select('-password').then((user) => {
        News.findOneAndUpdate({ _id: id, creator: user._id }, {
          title: req.body.title,
          content: req.body.content,
        }).then((error, news) => {
          console.log(news);
          if (error) {
            res.status(200).json({
              result: 0,
              data: "News not found",
            });
          } else {
            res.status(200).json({
              result: 1,
              data: news,
            });
          }
        });
      });
    }
  });
});
router.post('/', [
  check('title').isLength({ min: 5 }).withMessage('must be at least 5 chars long'),

  check('content').isLength({ min: 25 }).withMessage('must be at least 25 chars long'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  jwt.verify(req.headers['x-access-token'], config.secret, (err, decoded) => {
    if (err) {
      res.json({ status: "error", message: err.message, data: null });
    } else {
      User.findOne({ _id: decoded.id }).select('-password').then((user) => {
        News.create({
          title: req.body.title,
          content: req.body.content,
          creator: user._id,
        }).then(newsOne => res.json(newsOne));
      });
    }
  });
});
module.exports = router;
