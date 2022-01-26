const express = require('express');

const router = express.Router();
const userCtrl = require('../controllers/admin');
const validator = require('../middleware/validator');
const validatorError = require('../middleware/validatorError');
const auth = require('../middleware/auth');

router.get('/', auth.checkToken, (req, res) => res.send(req.cookies.refreshToken));

router.post('/join', validator.join, validatorError.error, userCtrl.join);
router.post('/login', validator.login, validatorError.error, userCtrl.login);
router.patch('/password/:adminIdx', validator.updatePassword, validatorError.error, userCtrl.updatePassword);
router.post('/logout', userCtrl.logout);
router.get('/auth', userCtrl.auth);

module.exports = router;
