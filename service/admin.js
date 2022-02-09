const jwt = require('../modules/jwt');
const adminDao = require('../dao/admin');
const encrypt = require('../modules/encrypt');
const redis = require('../modules/redis');
const CODE = require('../utils/statusCode');

const login = async ({ id, password }) => {
  try {
    const admin = await adminDao.findAdminById(id);

    if (!admin) {
      return CODE.BAD_REQUEST;
    }

    const isCorrectPassword = await encrypt.compare(password, admin.password);

    if (!isCorrectPassword) {
      return CODE.NOT_FOUND;
    }

    const token = {
      accessToken: await jwt.signAccessToken({ idx: admin.admin_idx, id: admin.id }),
      refreshToken: await jwt.signRefreshToken({ idx: admin.admin_idx, id: admin.id }),
    };

    redis.set(admin.admin_idx, token.refreshToken);

    return {
      admin: {
        adminIdx: admin.admin_idx,
        id: admin.id,
        name: admin.name,
        rank: admin.admin_rank
      },
      token,
    };
  } catch (err) {
    console.log(err);
    return CODE.INTERNAL_SERVER_ERROR;
  }
};

const join = async joinUser => {
  try {
    const hashPassword = await encrypt.hash(joinUser.password);
    joinUser.password = hashPassword;

    const result = await adminDao.join({ joinUser });
    return result;
  } catch (err) {
    return CODE.INTERNAL_SERVER_ERROR;
  }
};

const findAdminById = async idx => {
  try {
    const result = await adminDao.findAdminById(idx);
    return result;
  } catch (err) {
    throw new Error(err);
  }
};

const findAdminByName = async idx => {
  try {
    const result = await adminDao.findAdminByName(idx);
    return result;
  } catch (err) {
    throw new Error(err);
  }
};

const findAdminByIdx = async idx => {
  try {
    const result = await adminDao.findAdminByIdx(idx);
    return result;
  } catch (err) {
    throw new Error(err);
  }
};

const updatePassword = async ({ adminIdx, newPassword }) => {
  try {
    const hashPassword = await encrypt.hash(newPassword);
    const result = await adminDao.updatePassword(adminIdx, hashPassword);
    return result;
  } catch (err) {
    return CODE.INTERNAL_SERVER_ERROR;
  }
};

module.exports = {
  login,
  join,
  findAdminById,
  findAdminByName,
  findAdminByIdx,
  updatePassword,
};
