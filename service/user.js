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
    if(!result) return CODE.NOT_FOUND
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

const getAttendPoint = async idx => {
  try {
    const result = await userDao.getAttendPoint(idx);
    if(!result) return CODE.NOT_FOUND
    return result;
  } catch (err) {
    return CODE.INTERNAL_SERVER_ERROR;
  }
};

const getRecord = async idx => {
  try {
    const result = await userDao.getRecord(idx);
    if(!result) return CODE.NOT_FOUND
    return result;
  } catch (err) {
    return CODE.INTERNAL_SERVER_ERROR;
  }
};

module.exports = {
  getUsers,
  getUserByIdx,
  getUsersCount,
  getAttendPoint,
  getRecord
};
