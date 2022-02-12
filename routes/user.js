const express = require('express');

const router = express.Router();
const userCtrl = require('../controllers/user');
const auth = require('../middleware/auth');

router.get('/', auth.checkToken, userCtrl.getUsers);
router.get('/info/:idx', auth.checkToken, userCtrl.getUserByIdx);
router.get('/count', auth.checkToken, userCtrl.getUsersCount);
router.get('/attend-point/:idx', auth.checkToken, userCtrl.getAttendPoint);
router.get('/record/:idx', auth.checkToken, userCtrl.getRecord);

module.exports = router;
