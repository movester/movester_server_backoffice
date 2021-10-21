const express = require("express");
const router = express.Router();
const noticeCtrl = require("../controllers/serviceCenter/notice");
const faqCtrl = require("../controllers/serviceCenter/faq");

// notice
router.post("/notices", noticeCtrl.noticeCreate);
router.get("/notices", noticeCtrl.noticeList);
router.get("/notices/:noticeIdx", noticeCtrl.noticeDetail);
router.put("/notices/:noticeIdx", noticeCtrl.noticeUpdate);
router.delete("/notices/:noticeIdx", noticeCtrl.noticeDelete);

// faq
router.post("/faq/create", faqCtrl.faqCreate);
router.get("/faq/list", faqCtrl.faqList);
router.post("/faq/detail", faqCtrl.faqDetail);
router.post("/faq/update", faqCtrl.faqUpdate);
router.post("/faq/delete", faqCtrl.faqDelete);

module.exports = router;
