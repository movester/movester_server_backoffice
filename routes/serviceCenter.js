const express = require("express");
const router = express.Router();
const noticeCtrl = require("../controllers/serviceCenter/notice");
const faqCtrl = require("../controllers/serviceCenter/faq");

// notice
router.post("/notice/create", noticeCtrl.noticeCreate);
router.get("/notice/list", noticeCtrl.noticeList);
router.post("/notice/detail", noticeCtrl.noticeDetail);
router.post("/notice/update", noticeCtrl.noticeUpdate);
router.post("/notice/delete", noticeCtrl.noticeDelete);

// faq
router.post("/faq/create", faqCtrl.faqCreate);
router.get("/faq/list", faqCtrl.faqList);
router.post("/faq/detail", faqCtrl.faqDetail);
router.post("/faq/update", faqCtrl.faqUpdate);
router.post("/faq/delete", faqCtrl.faqDelete);

module.exports = router;
