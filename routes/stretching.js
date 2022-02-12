const express = require('express');

const router = express.Router();
const stretchingCtrl = require('../controllers/stretching');
const auth = require('../middleware/auth');

router.post('/', auth.checkToken, stretchingCtrl.createStretching);

module.exports = router;
