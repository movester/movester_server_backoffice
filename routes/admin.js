const express = require('express');

const router = express.Router();
const userCtrl = require('../controllers/admin');
const validator = require('../middleware/validator');
const validatorError = require('../middleware/validatorError');
const auth = require('../middleware/auth');

// accessToken, refeshToken 재발급 과정 동작이 원활한지 테스트를 만들도록 함
// router.get('/dashboard', auth.verifyToken, userCtrl.dashboard);
router.get('/', (_, res) => res.send('hello'));

router.post('/join', validator.join, validatorError.error, userCtrl.join);
router.post('/login', validator.login, validatorError.error, userCtrl.login);
router.patch('/password/:adminIdx', validator.updatePassword, validatorError.error, userCtrl.updatePassword);
router.post('/reissue-access-token', auth.verifyRefreshToken, userCtrl.reissueAccessToken);
router.post('/logout', auth.verifyToken, userCtrl.logout);
router.get('/auth', auth.verifyToken, userCtrl.auth);

module.exports = router;
