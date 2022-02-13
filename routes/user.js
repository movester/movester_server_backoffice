const express = require('express');

const router = express.Router();
const userCtrl = require('../controllers/user');
const auth = require('../middleware/auth');

router.get('/info/:idx', auth.checkToken, userCtrl.getUserInfo);
router.get('/count', auth.checkToken, userCtrl.getUsersCount);

module.exports = router;
