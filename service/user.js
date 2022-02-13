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

const getUsersList = async (page, sort) => {
  try {
    const SORT_LIST = ['JOIN', 'ATTEND_POINT'];

    const getSearchStart = page => (page - 1) * 10;

    if (sort === SORT_LIST[0]) {
      const usersList = await userDao.getUsersListByCreateAt(getSearchStart(page));
      return usersList;
    }

    if (sort === SORT_LIST[1]) {
      const usersList = await userDao.getUsersListByAttendPoint(getSearchStart(page));
      return usersList;
    }
  } catch (err) {
    return CODE.INTERNAL_SERVER_ERROR;
  }
};

module.exports = {
  getUserInfo,
  getUsersCount,
  getUsersList,
};
