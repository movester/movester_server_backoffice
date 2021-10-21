const express = require("express");
const router = express.Router();

router.use("/api/adminUsers", require("./adminUser"));
router.use("/api/serviceCenter", require("./serviceCenter"));
router.use("/api/common", require("./common"));

module.exports = router;
