const express = require('express');

const router = express.Router();

router.use('/admins', require('./admin'));
router.use('/users', require('./user'));
router.use('/common', require('./common'));
router.use('/stretchings', require('./stretching'));
router.use('/weeks', require('./week'));

module.exports = router;
