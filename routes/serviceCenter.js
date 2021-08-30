const express = require("express");
const router = express.Router();
const serviceCenterCtrl = require("../controllers/serviceCenter");

router.post("/notice/create", serviceCenterCtrl.noticeCreate);
router.get("/notice/list", serviceCenterCtrl.noticeList);
router.post("/notice/detail", serviceCenterCtrl.noticeDetail);
router.post("/uploadfiles", serviceCenterCtrl.fileUpload);


module.exports = router;
