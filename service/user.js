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

    const accessToken = jwt.sign(
        { sub: loginUser.email },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.JWT_ACCESS_TIME }
    );
    const refreshToken = auth.generateRefreshToken(loginUser.email);

    const dataToSubmit = {
        name: daoRow[0].name,
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

const join = async ({ joinUser }, res) => {
    const missDataToSubmit = {
        email: null
    };

    const hashPassword = await encrypt.hashPassword(joinUser.password);
    if (!hashPassword) {
        const isJoinSuccess = res
            .status(statusCode.INTERNAL_SERVER_ERROR)
            .json(
                utils.successFalse(
                    responseMessage.ENCRYPT_ERROR,
                    missDataToSubmit
                )
            );
        return isJoinSuccess;
    }
    joinUser.password = hashPassword;

    const daoRow = await userDao.join({ joinUser });
    if (!daoRow) {
        const isJoinSuccess = res
            .status(statusCode.DB_ERROR)
            .json(
                utils.successFalse(responseMessage.DB_ERROR, missDataToSubmit)
            );
        return isJoinSuccess;
    }

    const dataToSubmit = {
        email: joinUser.email
    };
    const isJoinSuccess = res
        .status(statusCode.OK)
        .json(utils.successTrue(responseMessage.JOIN_SUCCESS, dataToSubmit));
    return isJoinSuccess;
};

const findUserByEmail = async email => {
    const daoRow = await userDao.findUserByEmail(email);
    if (!daoRow) {
        return false;
    }
    return daoRow;
};


module.exports = {
    login,
    reissueAccessToken,
    logout,
    join,
    findUserByEmail
};
