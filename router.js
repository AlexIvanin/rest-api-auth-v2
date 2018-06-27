import express from 'express';
import User from './routing/User';
import News from './routing/News';

const router = express.Router();

router.use('/user', User);
router.use('/news', News);
module.exports = router;
