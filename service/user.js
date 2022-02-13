const userDao = require('../dao/user');
const CODE = require('../utils/statusCode');

const getUserInfo = async idx => {
  try {
    const userInfo = await userDao.getUserInfo(idx);
    if(!userInfo) return CODE.NOT_FOUND
    return userInfo;
  } catch (err) {
    return CODE.INTERNAL_SERVER_ERROR;
  }
};

const getUsersCount = async () => {
  try {
    const usersCount = await userDao.getUsersCount();
    return usersCount;
  } catch (err) {
    return CODE.INTERNAL_SERVER_ERROR;
  }
};

module.exports = {
  getUserInfo,
  getUsersCount
};
