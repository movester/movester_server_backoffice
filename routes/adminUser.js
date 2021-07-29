const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const Validator = require("../middleware/validator");
const ValidatorError = require("../middleware/validatorError");
const auth = require("../middleware/auth");

router.get("/dashboard", auth.verifyToken, userCtrl.dashboard);
router.post("/login", Validator.login, ValidatorError.error, userCtrl.login);
router.post(
    "/reissueAccessToken",
    auth.verifyRefreshToken,
    userCtrl.reissueAccessToken
);
router.get("/logout", auth.verifyToken, userCtrl.logout);
router.get("/auth", auth.verifyToken, userCtrl.auth);
router.post("/join", Validator.join, ValidatorError.error, userCtrl.join);
router.post("/updatePassword", Validator.updatePassword, ValidatorError.error, userCtrl.updatePassword);

module.exports = router;
