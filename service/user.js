const userDao = require("../dao/user");
const encrypt = require("../utils/encrypt");
const statusCode = require("../utils/statusCode");
const responseMessage = require("../utils/responseMessage");
const utils = require("../utils/utils");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const redisClient = require("../config/redis");

const login = async ({ loginUser }, res) => {
    const missDataToSubmit = {
        isAuth: false
    };
    const daoRow = await userDao.login(loginUser.email);
    if (!daoRow) {
        const isLoginSuccess = res
            .status(statusCode.DB_ERROR)
            .json(
                utils.successFalse(responseMessage.DB_ERROR, missDataToSubmit)
            );
        return isLoginSuccess;
    }
    if (Object.keys(daoRow).length === 0) {
        const isLoginSuccess = res
            .status(statusCode.BAD_REQUEST)
            .json(
                utils.successFalse(
                    responseMessage.EMAIL_NOT_EXIST,
                    missDataToSubmit
                )
            );
        return isLoginSuccess;
    }
    const hashPassword = daoRow[0].password;
    const isCorrectPassword = await encrypt.comparePassword(
        loginUser.password,
        hashPassword
    );

    if (isCorrectPassword === 0) {
        const isLoginSuccess = res
            .status(statusCode.INTERNAL_SERVER_ERROR)
            .json(
                utils.successFalse(
                    responseMessage.ENCRYPT_ERROR,
                    missDataToSubmit
                )
            );
        return isLoginSuccess;
    }

    if (isCorrectPassword === false) {
        const isLoginSuccess = res
            .status(statusCode.BAD_REQUEST)
            .json(
                utils.successFalse(
                    responseMessage.PW_MISMATCH,
                    missDataToSubmit
                )
            );
        return isLoginSuccess;
    }
    if (!daoRow[0].is_email_verify) {
        const isLoginSuccess = res
            .status(statusCode.BAD_REQUEST)
            .json(
                utils.successFalse(
                    responseMessage.EMAIL_VERIFY_NOT,
                    missDataToSubmit
                )
            );
        return isLoginSuccess;
    }

    const accessToken = jwt.sign(
        { sub: loginUser.email },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.JWT_ACCESS_TIME }
    );
    const refreshToken = auth.generateRefreshToken(loginUser.email);

    const dataToSubmit = {
        accessToken: accessToken,
        refreshToken: refreshToken,
        isAuth: true
    };

    const isLoginSuccess = res
        .status(statusCode.OK)
        .json(utils.successTrue(responseMessage.LOGIN_SUCCESS, dataToSubmit));
    return isLoginSuccess;
};

const reissueAccessToken = (email, res) => {
    const accessToken = jwt.sign(
        { sub: email },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.JWT_ACCESS_TIME }
    );
    const refreshToken = auth.generateRefreshToken(email);

    const token = {
        accessToken: accessToken,
        refreshToken: refreshToken
    };

    const isReissueAccessToken = res
        .status(statusCode.OK)
        .json(
            utils.successTrue(
                responseMessage.TOKEN_GENERATE_REFRESH_SUCCESS,
                token
            )
        );
    return isReissueAccessToken;
};

const logout = async (email, res) => {
    await redisClient.del(email.toString());

    const dataToSubmit = {
        isAuth: false
    };

    const isLogoutSuccess = res
        .status(statusCode.OK)
        .json(utils.successTrue(responseMessage.LOGOUT_SUCCESS, dataToSubmit));
    return isLogoutSuccess;
};

module.exports = {
    login,
    reissueAccessToken,
    logout
};
