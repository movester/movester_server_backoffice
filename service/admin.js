const jwt = require('../modules/jwt');
const adminDao = require('../dao/admin');
const encrypt = require('../modules/encrypt');
const redis = require('../modules/redis');
const CODE = require('../utils/statusCode');

const join = async joinUser => {
  try {
    const hashPassword = await encrypt.hash(joinUser.password);
    joinUser.password = hashPassword;

    const isJoin = await adminDao.join({ joinUser });
    return isJoin;
  } catch (err) {
    return CODE.INTERNAL_SERVER_ERROR;
  }
};

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
      accessToken: await jwt.signAccessToken({ idx: admin.adminIdx, id: admin.id }),
      refreshToken: await jwt.signRefreshToken({ idx: admin.adminIdx, id: admin.id }),
    };

    redis.set(admin.adminIdx, token.refreshToken);

    return {
      admin: {
        adminIdx: admin.adminIdx,
        id: admin.id,
        name: admin.name,
        rank: admin.rank,
      },
      token,
    };
  } catch (err) {
    console.log(err);
    return CODE.INTERNAL_SERVER_ERROR;
  }
};

const findAdminById = async id => {
  try {
    const admin = await adminDao.findAdminById(id);
    return admin;
  } catch (err) {
    throw new Error(err);
  }
};

const findAdminByName = async name => {
  try {
    const admin = await adminDao.findAdminByName(name);
    return admin;
  } catch (err) {
    throw new Error(err);
  }
};

const findAdminByIdx = async idx => {
  try {
    const admin = await adminDao.findAdminByIdx(idx);
    return admin;
  } catch (err) {
    throw new Error(err);
  }
};

const updatePassword = async ({ adminIdx, newPassword }) => {
  try {
    const hashPassword = await encrypt.hash(newPassword);
    const isUpdatePassword = await adminDao.updatePassword(adminIdx, hashPassword);
    return isUpdatePassword;
  } catch (err) {
    return CODE.INTERNAL_SERVER_ERROR;
  }
};

const getAdminsList = async () => {
  try {
    const adminsList = await adminDao.getAdminsList();
    return adminsList;
  } catch (err) {
    return CODE.INTERNAL_SERVER_ERROR;
  }
};

const deleteAdmin = async (idx) => {
  try {
    const adminsList = await adminDao.deleteAdmin(idx);
    return adminsList;
  } catch (err) {
    return CODE.INTERNAL_SERVER_ERROR;
  }
};

module.exports = {
  join,
  login,
  findAdminById,
  findAdminByName,
  findAdminByIdx,
  updatePassword,
  getAdminsList,
  deleteAdmin
};
