const express = require('express');

const router = express.Router();
const noticeCtrl = require('../controllers/serviceCenter/notice');
const faqCtrl = require('../controllers/serviceCenter/faq');

// notice
router.post('/notices', noticeCtrl.noticeCreate);
router.get('/notices', noticeCtrl.noticeList);
router.get('/notices/:noticeIdx', noticeCtrl.noticeDetail);
router.put('/notices/:noticeIdx', noticeCtrl.noticeUpdate);
router.delete('/notices/:noticeIdx', noticeCtrl.noticeDelete);

// faq
router.post('/faqs/', faqCtrl.faqCreate);
router.get('/faqs', faqCtrl.faqList);
router.get('/faqs/:faqIdx', faqCtrl.faqDetail);
router.put('/faqs/:faqIdx', faqCtrl.faqUpdate);
router.delete('/faqs/:faqIdx', faqCtrl.faqDelete);

module.exports = router;
