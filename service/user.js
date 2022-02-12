const userDao = require('../dao/user');
const CODE = require('../utils/statusCode');

const getUsers = async () => {
  try {
    const result = await userDao.getUsers();
    return result;
  } catch (err) {
    return CODE.INTERNAL_SERVER_ERROR;
  }
};

const getUserByIdx = async idx => {
  try {
    const result = await userDao.getUserByIdx(idx);
    if (!result) return CODE.NOT_FOUND;
    return result;
  } catch (err) {
    return CODE.INTERNAL_SERVER_ERROR;
  }
};

const getUsersCount = async () => {
  try {
    const result = await userDao.getUsersCount();
    return result;
  } catch (err) {
    return CODE.INTERNAL_SERVER_ERROR;
  }
};

const getUsersList = async (pages, sort) => {
  try {
    const getLimitStart = pages => (pages === 1 ? 0 : (pages - 1) * 10 - 1);
    // TODO: sort 로직 처리
    const result = await userDao.getUsersByIdx(getLimitStart(pages));
    return result;
  } catch (err) {
    return CODE.INTERNAL_SERVER_ERROR;
  }
};

module.exports = {
  getUsers,
  getUserByIdx,
  getUsersCount,
  getUsersList,
};
