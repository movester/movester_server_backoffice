const express = require('express');

const router = express.Router();
const adminCtrl = require('../controllers/admin');
const validator = require('../middleware/validator');
const validatorError = require('../middleware/validatorError');
const auth = require('../middleware/auth');

router.post('/join', auth.checkToken, validator.join, validatorError.error, adminCtrl.join);
router.post('/login', validator.login, validatorError.error, adminCtrl.login);
router.patch(
  '/password/:adminIdx',
  auth.checkToken,
  validator.updatePassword,
  validatorError.error,
  adminCtrl.updatePassword
);
router.post('/logout', auth.checkToken, adminCtrl.logout);

module.exports = router;
