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
  getUsers,
  getUserByIdx,
  getUsersCount,
  getUsersList,
};
