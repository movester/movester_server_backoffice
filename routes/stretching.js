const express = require('express');

const router = express.Router();
const stretchingCtrl = require('../controllers/stretching');
const auth = require('../middleware/auth');
const validator = require('../middleware/validator/stretching');
const validatorError = require('../middleware/validatorError');

router.post('/', auth.checkToken, validator.createStretching, validatorError.err, stretchingCtrl.createStretching);

module.exports = router;
