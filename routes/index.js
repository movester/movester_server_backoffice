const express = require("express");
const router = express.Router();

router.get("/", (req, res) => res.send("Dev Server"));
router.get("/api/hello", (req, res) => res.send("Dev Server"));
router.use("/api/adminUser", require("./adminUser"));

module.exports = router;
