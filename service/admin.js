const jwt = require('jsonwebtoken');
const adminDao = require('../dao/admin');
const commonDao = require('../dao/common');
const encrypt = require('../utils/encrypt');
const statusCode = require('../utils/statusCode');
const responseMessage = require('../utils/responseMessage');
const resForm = require('../utils/resForm');
const auth = require('../middleware/auth');
const redisClient = require('../config/redis');

const login = async ({ email, password }, res) => {
  try {
    const admin = await adminDao.findUserByEmail(email);
    console.log('admin', admin);
    if (!admin) {
      return statusCode.NOT_FOUND;
    }
    const hashPassword = admin.password;
    const isCorrectPassword = await encrypt.compare(password, hashPassword);

    // TODO : 0 과 false 는 둘 다 falsy 한 값으로 명확한 네이밍으로 수정 필요
    if (isCorrectPassword === 0) {
      return res.status(statusCode.INTERNAL_SERVER_ERROR).json(
        resForm.successFalse(responseMessage.ENCRYPT_ERROR, {
          isAuth: false,
        })
      );
    }

    if (isCorrectPassword === false) {
      return res.status(statusCode.BAD_REQUEST).json(
        resForm.successFalse(responseMessage.PW_MISMATCH, {
          isAuth: false,
        })
      );
    }

    const accessToken = jwt.sign({ sub: email }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: process.env.JWT_ACCESS_TIME,
    });
    const refreshToken = auth.generateRefreshToken(email);

    const resData = {
      isAuth: true,
      adminIdx: admin[0].admin_idx,
      email: admin[0].email,
      name: admin[0].name,
      accessToken,
      refreshToken,
    };
    return res.status(statusCode.OK).json(resForm.successTrue(responseMessage.LOGIN_SUCCESS, resData));
  } catch (err) {
    // throw new Error(err);
    console.log(err);
  }
};

const reissueAccessToken = (email, res) => {
  const accessToken = jwt.sign({ sub: email }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_TIME,
  });
  const refreshToken = auth.generateRefreshToken(email);

  const token = {
    accessToken,
    refreshToken,
  };

  return res.status(statusCode.OK).json(resForm.successTrue(responseMessage.TOKEN_GENERATE_REFRESH_SUCCESS, token));
};

const logout = async (email, res) => {
  await redisClient.del(email.toString());

  return res.status(statusCode.OK).json(resForm.successTrue(responseMessage.LOGOUT_SUCCESS, { isAuth: false }));
};

const join = async ({ joinUser }, res) => {
  const hashedPassword = await encrypt.hashPassword(joinUser.password);
  if (!hashedPassword) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json(resForm.successFalse(responseMessage.ENCRYPT_ERROR));
  }
  joinUser.password = hashedPassword;

  const daoRow = await adminDao.join({ joinUser });

  if (!daoRow) {
    return res.status(statusCode.DB_ERROR).json(resForm.successFalse(responseMessage.DB_ERROR));
  }

  const idxDaoRow = await commonDao.getCreateIdx();

  const resData = {
    adminIdx: idxDaoRow[0].idx,
    email: joinUser.email,
    name: joinUser.name,
  };

  return res.status(statusCode.OK).json(resForm.successTrue(responseMessage.JOIN_SUCCESS, resData));
};

const findUserByEmail = async email => {
  const daoRow = await adminDao.findUserByEmail(email);
  return daoRow || false;
};

const findUserByIdx = async idx => {
  const daoRow = await adminDao.findUserByIdx(idx);
  return daoRow || false;
};

const updatePassword = async ({ updatePasswordUser }, res) => {
  const hashPassword = await encrypt.hashPassword(updatePasswordUser.newPassword);
  if (!hashPassword) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json(resForm.successFalse(responseMessage.ENCRYPT_ERROR));
  }

  const daoRow = await adminDao.updatePassword(updatePasswordUser.adminIdx, hashPassword);
  if (!daoRow) {
    return res.status(statusCode.DB_ERROR).json(resForm.successFalse(responseMessage.DB_ERROR));
  }
  return res.status(statusCode.OK).json(resForm.successTrue(responseMessage.UPDATE_PASSWORD_SUCCESS));
};

module.exports = {
  login,
  reissueAccessToken,
  logout,
  join,
  findUserByEmail,
  findUserByIdx,
  updatePassword,
};
