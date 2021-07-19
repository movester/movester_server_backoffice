const express = require("express");
const router = express.Router();

router.get("/", (req, res) => res.send("Dev Server"));
router.use("/api/user", require("./user"));

module.exports = router;
