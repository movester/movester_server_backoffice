const express = require('express');

const router = express.Router();
const commonCtrl = require('../controllers/common');

router.post('/uploadfiles', commonCtrl.fileUpload);

module.exports = router;
