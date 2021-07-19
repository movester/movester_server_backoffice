const userService = require("../service/user");
const statusCode = require("../utils/statusCode");
const responseMessage = require("../utils/responseMessage");
const utils = require("../utils/utils");

const login = async (req, res) => {
    const loginUser = req.body;
    const isLoginSuccess = await userService.login({ loginUser }, res);
    return isLoginSuccess;
};

const reissueAccessToken = async (req, res) => {
    const email = req.decodeRefreshToken.sub;
    const isReissueAccessTokenSuccess = userService.reissueAccessToken(email, res);
    return isReissueAccessTokenSuccess;
};

// test api
const dashboard = async (req, res) => {
    return res.json({ status: true, message: "hello from dashboard" });
};

const logout = async (req, res) => {
    const email = req.decodeData.sub;

    const isLogoutSuccess = await userService.logout(email, res);

    return isLogoutSuccess;
};


module.exports = {
    login,
    reissueAccessToken,
    dashboard,
    logout
};
