const express = require("express");
const router = express.Router();

router.use("/api/admins", require("./admin"));
router.use("/api/service-center", require("./serviceCenter"));
router.use("/api/common", require("./common"));

module.exports = router;
