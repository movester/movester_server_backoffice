const express = require('express');

const router = express.Router();
const weekCtrl = require('../controllers/week');
const auth = require('../middleware/auth');
const validator = require('../middleware/validator/week');
const commonValidator = require('../middleware/validator/common');
const validatorError = require('../middleware/validatorError');

router.get('/', auth.checkToken, weekCtrl.getWeeks);
router.post(
  '/',
  auth.checkToken,
  auth.checkReadOnlyAdmin,
  validator.createWeek,
  validatorError.err,
  weekCtrl.createWeek
);
router.delete(
  '/:idx',
  auth.checkToken,
  auth.checkReadOnlyAdmin,
  commonValidator.checkParamIdx,
  validatorError.err,
  weekCtrl.deleteWeek
);
router.put(
  '/',
  auth.checkToken,
  auth.checkReadOnlyAdmin,
  validator.updateWeek,
  validatorError.err,
  weekCtrl.updateWeek
);
router.get('/:idx', auth.checkToken, commonValidator.checkParamIdx, validatorError.err, weekCtrl.getWeek);
router.patch(
  '/expose',
  auth.checkToken,
  auth.checkReadOnlyAdmin,
  validator.checkBodyIdx,
  validatorError.err,
  weekCtrl.updateExposeWeek
);
router.delete(
  '/expose/:idx',
  auth.checkToken,
  auth.checkReadOnlyAdmin,
  commonValidator.checkParamIdx,
  validatorError.err,
  weekCtrl.cancelExposeWeek
);
router.get('/expose/stretchings', auth.checkToken, weekCtrl.getExposeWeek);

module.exports = router;
