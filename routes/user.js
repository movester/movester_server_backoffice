const express = require('express');

const router = express.Router();
const userCtrl = require('../controllers/user');
const auth = require('../middleware/auth');
const validator = require('../middleware/validator/user');
const validatorError = require('../middleware/validatorError');

router.get('/info/:idx', auth.checkToken, userCtrl.getUserByIdx);
router.get('/count', auth.checkToken, userCtrl.getUsersCount);
router.get(
  '/list/join-date',
  auth.checkToken,
  validator.getUsersListByCreateAt,
  validatorError.error,
  userCtrl.getUsersListByCreateAt
);

module.exports = router;
