const express = require('express');

const router = express.Router();
const userCtrl = require('../controllers/user');
const auth = require('../middleware/auth');

router.get('/info/:idx', auth.checkToken, userCtrl.getUserByIdx);
router.get('/count', auth.checkToken, userCtrl.getUsersCount);
router.get('/list/idx-order', auth.checkToken, userCtrl.getUsersByIdx);

module.exports = router;
