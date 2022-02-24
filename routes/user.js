const express = require('express');

const router = express.Router();
const userCtrl = require('../controllers/user');
const auth = require('../middleware/auth');
const validator = require('../middleware/validator/user');
const validatorError = require('../middleware/validatorError');

router.get('/info/:idx', auth.checkToken, validator.getUserInfo, validatorError.err, userCtrl.getUserInfo);
router.get('/count', auth.checkToken, userCtrl.getUsersCount);
router.get('/list', auth.checkToken, validator.getUsersList, validatorError.err, userCtrl.getUsersList);
router.get('/attend-points/:idx', auth.checkToken, validator.getUserAttendPoints, validatorError.err, userCtrl.getUserAttendPoints);
router.get('/records/:idx', auth.checkToken, validator.getUserAttendPoints, validatorError.err, userCtrl.getUserRecords);
router.get('/search', auth.checkToken, validator.getUsersSearch, validatorError.err, userCtrl.getUsersSearch);

module.exports = router;
