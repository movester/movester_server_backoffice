const express = require("express");
const router = express.Router();
const serviceCenterCtrl = require("../controllers/serviceCenter");
const multerUpload = require("../utils/multer");

router.post("/notice/create", serviceCenterCtrl.noticeCreate);
router.get("/notice/list", serviceCenterCtrl.noticeList);
router.post("/notice/detail", serviceCenterCtrl.noticeDetail);
router.post("/uploadfiles", serviceCenterCtrl.fileUpload);


module.exports = router;
