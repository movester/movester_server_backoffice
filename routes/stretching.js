const express = require('express');

const router = express.Router();
const stretchingCtrl = require('../controllers/stretching');
const auth = require('../middleware/auth');
const validator = require('../middleware/validator/stretching');
const commonValidator = require('../middleware/validator/common');
const validatorError = require('../middleware/validatorError');

router.post('/', auth.checkToken, validator.createStretching, validatorError.err, stretchingCtrl.createStretching);
router.delete('/:idx', auth.checkToken, commonValidator.checkParamIdx, validatorError.err, stretchingCtrl.deleteStretching);

module.exports = router;
