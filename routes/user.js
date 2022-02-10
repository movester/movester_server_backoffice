const express = require('express');

const router = express.Router();
const userCtrl = require('../controllers/user');
const auth = require('../middleware/auth');

router.get('/', auth.checkToken, userCtrl.getUsers);
router.get('/:idx', auth.checkToken, userCtrl.getUserByIdx);

module.exports = router;
