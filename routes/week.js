const express = require('express');

const router = express.Router();
const weekCtrl = require('../controllers/week');
const auth = require('../middleware/auth');
const validator = require('../middleware/validator/week');
const commonValidator = require('../middleware/validator/common');
const validatorError = require('../middleware/validatorError');

router.post('/', auth.checkToken, validator.createWeek, validatorError.err, weekCtrl.createWeek);
router.delete('/:idx', auth.checkToken, commonValidator.checkParamIdx, validatorError.err, weekCtrl.deleteWeek);
router.get('/expose', auth.checkToken, weekCtrl.getExposeWeek);

module.exports = router;
