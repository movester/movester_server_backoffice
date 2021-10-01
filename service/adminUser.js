const userDao = require("../dao/adminUser");
const commonDao = require("../dao/common");
const encrypt = require("../utils/encrypt");
const statusCode = require("../utils/statusCode");
const responseMessage = require("../utils/responseMessage");
const utils = require("../utils/utils");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const redisClient = require("../config/redis");

const login = async ({ loginUser }, res) => {
    const daoRow = await userDao.findUserByEmail(loginUser.email);
    if (!daoRow) {
        const isLoginSuccess = res
            .status(statusCode.DB_ERROR)
            .json(
                utils.successFalse(responseMessage.DB_ERROR, missDataToSubmit)
            );
        return isLoginSuccess;
    }
    if (Object.keys(daoRow).length === 0) {
        const isLoginSuccess = res.status(statusCode.BAD_REQUEST).json(
            utils.successFalse(responseMessage.EMAIL_NOT_EXIST, {
                isAuth: false
            })
        );
        return isLoginSuccess;
    }
    const hashPassword = daoRow[0].password;
    const isCorrectPassword = await encrypt.comparePassword(
        loginUser.password,
        hashPassword
    );

    // TODO : 0 과 false 는 둘 다 falsy 한 값으로 명확한 네이밍으로 수정 필요
    if (isCorrectPassword === 0) {
        const isLoginSuccess = res
            .status(statusCode.INTERNAL_SERVER_ERROR)
            .json(
                utils.successFalse(responseMessage.ENCRYPT_ERROR, {
                    isAuth: false
                })
            );
        return isLoginSuccess;
    }

    if (isCorrectPassword === false) {
        const isLoginSuccess = res.status(statusCode.BAD_REQUEST).json(
            utils.successFalse(responseMessage.PW_MISMATCH, {
                isAuth: false
            })
        );
        return isLoginSuccess;
    }

    const accessToken = jwt.sign(
        { sub: loginUser.email },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.JWT_ACCESS_TIME }
    );
    const refreshToken = auth.generateRefreshToken(loginUser.email);

    const resData = {
        isAuth: true,
        adminUserIdx: daoRow[0].admin_user_idx,
        email: daoRow[0].email,
        name: daoRow[0].name,
        accessToken: accessToken,
        refreshToken: refreshToken
    };

    const isLoginSuccess = res
        .status(statusCode.OK)
        .json(utils.successTrue(responseMessage.LOGIN_SUCCESS, resData));
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

    const isLogoutSuccess = res
        .status(statusCode.OK)
        .json(
            utils.successTrue(responseMessage.LOGOUT_SUCCESS, { isAuth: false })
        );
    return isLogoutSuccess;
};

const join = async ({ joinUser }, res) => {
    const hashPassword = await encrypt.hashPassword(joinUser.password);
    if (!hashPassword) {
        const isJoinSuccess = res
            .status(statusCode.INTERNAL_SERVER_ERROR)
            .json(utils.successFalse(responseMessage.ENCRYPT_ERROR));
        return isJoinSuccess;
    }
    joinUser.password = hashPassword;

    const daoRow = await userDao.join({ joinUser });

    if (!daoRow) {
        const isJoinSuccess = res
            .status(statusCode.DB_ERROR)
            .json(utils.successFalse(responseMessage.DB_ERROR));
        return isJoinSuccess;
    }

    const idxDaoRow = await commonDao.getCreateIdx();

    const resData = {
        adminUserIdx: idxDaoRow[0].idx,
        email: joinUser.email,
        name: joinUser.name
    };

    const isJoinSuccess = res
        .status(statusCode.OK)
        .json(utils.successTrue(responseMessage.JOIN_SUCCESS, resData));
    return isJoinSuccess;
};

const findUserByEmail = async email => {
    const daoRow = await userDao.findUserByEmail(email);
    if (!daoRow) {
        return false;
    }
    return daoRow;
};

const findUserByIdx = async idx => {
    const daoRow = await userDao.findUserByIdx(idx);
    if (!daoRow) {
        return false;
    }
    return daoRow;
};

const updatePassword = async ({ updatePasswordUser }, res) => {
    const hashPassword = await encrypt.hashPassword(
        updatePasswordUser.newPassword
    );
    if (!hashPassword) {
        const isUpdatePasswordSuccess = res
            .status(statusCode.INTERNAL_SERVER_ERROR)
            .json(utils.successFalse(responseMessage.ENCRYPT_ERROR));
        return isUpdatePasswordSuccess;
    }

    const daoRow = await userDao.updatePassword(
        updatePasswordUser.adminUserIdx,
        hashPassword
    );
    if (!daoRow) {
        const isUpdatePasswordSuccess = res
            .status(statusCode.DB_ERROR)
            .json(utils.successFalse(responseMessage.DB_ERROR));
        return isUpdatePasswordSuccess;
    }
    const isUpdatePasswordSuccess = res
        .status(statusCode.OK)
        .json(utils.successTrue(responseMessage.UPDATE_PASSWORD_SUCCESS));
    return isUpdatePasswordSuccess;
};

module.exports = {
    login,
    reissueAccessToken,
    logout,
    join,
    findUserByEmail,
    findUserByIdx,
    updatePassword
};
