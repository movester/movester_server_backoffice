const jwt = require('../modules/jwt');
const adminDao = require('../dao/admin');
const commonDao = require('../dao/common');
const encrypt = require('../modules/encrypt');
const CODE = require('../utils/statusCode');
const MSG = require('../utils/responseMessage');
const form = require('../utils/responseForm');
const auth = require('../middleware/auth');
const redisClient = require('../config/redis');

const login = async ({ email, password }) => {
  try {
    const admin = await adminDao.findAdminByEmail(email);

    if (!admin) {
      return CODE.BAD_REQUEST;
    }

    const isCorrectPassword = await encrypt.compare(password, admin.password);

    if (!isCorrectPassword) {
      return CODE.NOT_FOUND;
    }

    const token = await jwt.sign({ idx: admin.admin_idx, email: admin.email });
    // const refreshToken = auth.generateRefreshToken(email);

    return {
      isAuth: true,
      adminIdx: admin.admin_idx,
      email: admin.email,
      name: admin.name,
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
    };
  } catch (err) {
    return CODE.INTERNAL_SERVER_ERROR;
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

  return res.status(CODE.OK).json(form.success(MSG.TOKEN_GENERATE_REFRESH_SUCCESS, token));
};

const logout = async (email, res) => {
  await redisClient.del(email.toString());

  return res.status(CODE.OK).json(form.success(MSG.LOGOUT_SUCCESS, { isAuth: false }));
};

const join = async ({ joinUser }, res) => {
  const hashedPassword = await encrypt.hash(joinUser.password);
  if (!hashedPassword) {
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.successFalse(MSG.ENCRYPT_ERROR));
  }
  joinUser.password = hashedPassword;

  const daoRow = await adminDao.join({ joinUser });

  if (!daoRow) {
    return res.status(CODE.DB_ERROR).json(form.successFalse(MSG.DB_ERROR));
  }

  const idxDaoRow = await commonDao.getCreateIdx();

  const resData = {
    adminIdx: idxDaoRow[0].idx,
    email: joinUser.email,
    name: joinUser.name,
  };

  return res.status(CODE.OK).json(form.success(MSG.JOIN_SUCCESS, resData));
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
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.successFalse(MSG.ENCRYPT_ERROR));
  }

  const daoRow = await adminDao.updatePassword(updatePasswordUser.adminIdx, hashPassword);
  if (!daoRow) {
    return res.status(CODE.DB_ERROR).json(form.successFalse(MSG.DB_ERROR));
  }
  return res.status(CODE.OK).json(form.success(MSG.UPDATE_PASSWORD_SUCCESS));
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
