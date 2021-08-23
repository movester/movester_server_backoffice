const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const Validator = require("../middleware/validator");
const ValidatorError = require("../middleware/validatorError");
const auth = require("../middleware/auth");

router.get("/dashboard", auth.verifyToken, userCtrl.dashboard);
router.post("/login", Validator.login, ValidatorError.login, userCtrl.login);
router.post(
    "/reissueAccessToken",
    auth.verifyRefreshToken,
    userCtrl.reissueAccessToken
);
router.get("/logout", auth.verifyToken, userCtrl.logout);
router.get("/auth", auth.verifyToken, userCtrl.auth);
router.post("/join", Validator.join, ValidatorError.join, userCtrl.join);

module.exports = router;
