const express = require('express');

const router = express.Router();

router.use('/admins', require('./admin'));
router.use('/users', require('./user'));
router.use('/service-center', require('./serviceCenter'));
router.use('/common', require('./common'));
router.use('/stretching', require('./stretching'));

module.exports = router;
