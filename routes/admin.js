const express = require('express');

const router = express.Router();
const userCtrl = require('../controllers/admin');
const validator = require('../middleware/validator');
const validatorError = require('../middleware/validatorError');
const auth = require('../middleware/auth');

// TEST API
router.get('/', auth.checkToken, (req, res) => res.send('인증 완료'));
router.post('/join', auth.checkToken, validator.join, validatorError.error, userCtrl.join);
router.post('/login', validator.login, validatorError.error, userCtrl.login);
router.patch('/password/:adminIdx', auth.checkToken, validator.updatePassword, validatorError.error, userCtrl.updatePassword);
router.post('/logout', auth.checkToken, userCtrl.logout);

module.exports = router;