const express = require('express');

const router = express.Router();
const weekCtrl = require('../controllers/week');
const auth = require('../middleware/auth');
const validator = require('../middleware/validator/week');
const validatorError = require('../middleware/validatorError');

router.post('/', auth.checkToken, validator.createWeek, validatorError.err, weekCtrl.createWeek);

module.exports = router;
