const express = require('express');

const router = express.Router();
const userCtrl = require('../controllers/user');
const auth = require('../middleware/auth');
const validator = require('../middleware/validator/user');
const validatorError = require('../middleware/validatorError');

router.get('/info/:idx', auth.checkToken, validator.getUserInfo, validatorError.error, userCtrl.getUserInfo);
router.get('/count', auth.checkToken, userCtrl.getUsersCount);
router.get('/list', auth.checkToken, validator.getUsersList, validatorError.error, userCtrl.getUsersList);
router.get('/attend-points/:idx', auth.checkToken, validator.getUserAttendPoints, validatorError.error, userCtrl.getUserAttendPoints);
router.get('/records/:idx', auth.checkToken, validator.getUserAttendPoints, validatorError.error, userCtrl.getUserRecords);
router.get('/search', auth.checkToken, validator.getUsersSearch, validatorError.error, userCtrl.getUsersSearch);

module.exports = router;
