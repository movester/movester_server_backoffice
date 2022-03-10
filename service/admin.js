const jwt = require('../modules/jwt');
const adminDao = require('../dao/admin');
const encrypt = require('../modules/encrypt');
const redis = require('../modules/redis');

const join = async joinUser => {
  try {
    const hashPassword = await encrypt.hash(joinUser.password);
    joinUser.password = hashPassword;

    const isJoin = await adminDao.join({ joinUser });
    return isJoin;
  } catch (err) {
    console.error(`=== Admin Service join Error: ${err} === `);
    throw new Error(err);
  }
};

const login = async ({ id, password }) => {
  try {
    const admin = await adminDao.findAdminById(id);

    const isCorrectPassword = await encrypt.compare(password, admin.password);

    if (!isCorrectPassword) {
      return false;
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
    console.error(`=== Admin Service login Error: ${err} === `);
    throw new Error(err);
  }
};

const findAdminById = async id => {
  try {
    const admin = await adminDao.findAdminById(id);
    return admin;
  } catch (err) {
    console.error(`=== Admin Service findAdminById Error: ${err} === `);
    throw new Error(err);
  }
};

const findAdminByName = async name => {
  try {
    const admin = await adminDao.findAdminByName(name);
    return admin;
  } catch (err) {
    console.error(`=== Admin Service findAdminByName Error: ${err} === `);
    throw new Error(err);
  }
};

const findAdminByIdx = async idx => {
  try {
    const admin = await adminDao.findAdminByIdx(idx);
    return admin;
  } catch (err) {
    console.error(`=== Admin Service findAdminByIdx Error: ${err} === `);
    throw new Error(err);
  }
};

const updatePassword = async ({ adminIdx, newPassword }) => {
  try {
    const hashPassword = await encrypt.hash(newPassword);
    const isUpdatePassword = await adminDao.updatePassword(adminIdx, hashPassword);
    return isUpdatePassword;
  } catch (err) {
    console.error(`=== Admin Service updatePassword Error: ${err} === `);
    throw new Error(err);
  }
};

const getAdminsList = async () => {
  try {
    const adminsList = await adminDao.getAdminsList();
    return adminsList;
  } catch (err) {
    console.error(`=== Admin Service getAdminsList Error: ${err} === `);
    throw new Error(err);
  }
};

const deleteAdmin = async idx => {
  try {
    const adminsList = await adminDao.deleteAdmin(idx);
    return adminsList;
  } catch (err) {
    console.error(`=== Admin Service deleteAdmin Error: ${err} === `);
    throw new Error(err);
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
  deleteAdmin,
};
