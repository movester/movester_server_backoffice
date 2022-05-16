const express = require('express');

const router = express.Router();
const adminCtrl = require('../controllers/admin');
const validator = require('../middleware/validator/admin');
const commonValidator = require('../middleware/validator/common');
const validatorError = require('../middleware/validatorError');
const auth = require('../middleware/auth');

router.post(
  '/join',
  auth.checkToken,
  auth.checkSuperAdmin,
  auth.checkReadOnlyAdmin,
  validator.join,
  validatorError.err,
  adminCtrl.join
);
router.post('/login', validator.login, validatorError.err, adminCtrl.login);
router.post('/logout', auth.checkToken, adminCtrl.logout);
router.patch(
  '/password/:adminIdx',
  auth.checkToken,
  auth.checkReadOnlyAdmin,
  validator.updatePassword,
  validatorError.err,
  adminCtrl.updatePassword
);
router.get('/', auth.checkToken, adminCtrl.getAdminsList);
router.delete(
  '/:idx',
  auth.checkToken,
  auth.checkSuperAdmin,
  commonValidator.checkParamIdx,
  validatorError.err,
  adminCtrl.deleteAdmin
);

module.exports = router;
