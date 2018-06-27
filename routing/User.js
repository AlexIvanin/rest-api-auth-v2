import express from 'express';
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator/check';
import bcrypt from 'bcrypt';
import User from '../models/User';
import config from '../config';

const router = express.Router();
router.get('/', (req, res) => {
  jwt.verify(req.headers['x-access-token'], config.secret, (err, decoded) => {
    if (err) {
      res.json({ status: "error", message: err.message, data: null });
    } else {
      User.findOne({ _id: decoded.id }).select('-password').then((user) => {
        res.status(200).json({
          result: 1,
          data: user,
        });
      });
    }
  });
});
router.post('/signin', [
  check('email').isEmail(),
  check('password').isLength({ min: 5 }).withMessage('must be at least 5 chars long'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  User.findOne({
    email: req.body.email,
  }, (err, user) => {
    if (err) throw err;

    if (!user) {
      res.status(401).send({ success: false, msg: 'Authentication failed. User not found.' });
    } else {
      // check if password matches

      if (bcrypt.compareSync(req.body.password, user.password)) {
        const token = jwt.sign({ id: user._id }, config.secret, { expiresIn: '1h' });
        res.json({ status: "success", message: "user found!!!", data: { user: user, token: token } });
      } else {
        res.json({ status: "error", message: "Invalid email/password!!!", data: null });
      }
    }
  });
});
router.post('/signup', [
  // username must be an email
  check('email').isEmail().custom(value => User.findOne({ email: value }).then((user) => {
    if (user) {
      return Promise.reject('E-mail already in use');
    }
  })),
  // password must be at least 5 chars long
  check('password').isLength({ min: 5 }).withMessage('must be at least 5 chars long'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  User.create({
    email: req.body.email,
    password: req.body.password,
  }).then(user => res.json(user));
});


module.exports = router;
