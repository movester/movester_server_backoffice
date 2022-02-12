const express = require('express');

const router = express.Router();
const userCtrl = require('../controllers/user');
const auth = require('../middleware/auth');

router.get('/info/:idx', auth.checkToken, userCtrl.getUserByIdx);
router.get('/count', auth.checkToken, userCtrl.getUsersCount);
router.get('/list', auth.checkToken, userCtrl.getUsersList);

module.exports = router;
