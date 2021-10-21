const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/adminUser");
const Validator = require("../middleware/validator");
const ValidatorError = require("../middleware/validatorError");
const auth = require("../middleware/auth");

// accessToken, refeshToken 재발급 과정 동작이 원활한지 테스트를 만들도록 함
router.get("/dashboard", auth.verifyToken, userCtrl.dashboard);

router.post("/login", Validator.login, ValidatorError.error, userCtrl.login);
router.post(
    "/reissueAccessToken",
    auth.verifyRefreshToken,
    userCtrl.reissueAccessToken
);
router.post("/logout", auth.verifyToken, userCtrl.logout);
router.get("/auth", auth.verifyToken, userCtrl.auth);
router.post("/join", Validator.join, ValidatorError.error, userCtrl.join);
router.put("/password/:adminUserIdx", Validator.updatePassword, ValidatorError.error, userCtrl.updatePassword);

module.exports = router;
