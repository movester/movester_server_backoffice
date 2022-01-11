const express = require('express');

const router = express.Router();

router.use('/admins', require('./admin'));
router.use('/service-center', require('./serviceCenter'));
router.use('/common', require('./common'));

module.exports = router;
