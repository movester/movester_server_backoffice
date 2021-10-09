const userService = require("../service/adminUser");
const statusCode = require("../utils/statusCode");
const responseMessage = require("../utils/responseMessage");
const utils = require("../utils/utils");
const encrypt = require("../utils/encrypt");

const login = async (req, res) => {
    const loginUser = req.body;
    return await userService.login({ loginUser }, res);
};

const reissueAccessToken = async (req, res) => {
    const email = req.decodeRefreshToken.sub;
    return userService.reissueAccessToken(email, res);
};

// accessToken, refeshToken 재발급 과정 동작이 원활한지 테스트를 만들도록 함
const dashboard = async (req, res) => {
    return res.json({ status: true, message: "hello from dashboard" });
};

const logout = async (req, res) => {
    const email = req.decodeData.sub;
    return await userService.logout(email, res);
};

const auth = async (req, res) => {
    const authUser = {
        isAuth: true,
        email: req.decodeData.sub,
        accessToken: req.accessToken
    };
    res.json(utils.successTrue(responseMessage.LOGIN_SUCCESS, authUser));
};

const join = async (req, res) => {
    const joinUser = req.body;

    const isEmail = await userService.findUserByEmail(joinUser.email);
    if (!isEmail) {
        return res
            .status(statusCode.DB_ERROR)
            .json(utils.successFalse(responseMessage.DB_ERROR));
    }
    if (Object.keys(isEmail).length > 0) {
        return res
            .status(statusCode.BAD_REQUEST)
            .json(utils.successFalse(responseMessage.EMAIL_ALREADY_EXIST));
    }
    return await userService.join({ joinUser }, res);
};

const updatePassword = async (req, res) => {
    const updatePasswordUser = req.body;
    if (updatePasswordUser.newPassword !== updatePasswordUser.confirmPassword) {
        return res
            .status(statusCode.BAD_REQUEST)
            .json(utils.successFalse(responseMessage.CONFIRM_PW_MISMATCH));
    }

    const adminUser = await userService.findUserByIdx(
        updatePasswordUser.adminUserIdx
    );
    if (!adminUser) {
        return res
            .status(statusCode.DB_ERROR)
            .json(utils.successFalse(responseMessage.DB_ERROR));
    }

    const comparePassword = adminUser[0].password;
    const isCorrectBeforePassword = await encrypt.comparePassword(
        updatePasswordUser.beforePassword,
        comparePassword
    );

    if (isCorrectBeforePassword === 0) {
        return res
            .status(statusCode.INTERNAL_SERVER_ERROR)
            .json(utils.successFalse(responseMessage.ENCRYPT_ERROR));
    }

    if (isCorrectBeforePassword === false) {
        return res
            .status(statusCode.BAD_REQUEST)
            .json(utils.successFalse(responseMessage.PW_MISMATCH));
    }

    return await userService.updatePassword({ updatePasswordUser }, res);
};

module.exports = {
    login,
    reissueAccessToken,
    dashboard,
    logout,
    auth,
    join,
    updatePassword
};
