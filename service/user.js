const userDao = require('../dao/user');
const CODE = require('../utils/statusCode');

const getUserInfo = async idx => {
  try {
    const userInfo = await userDao.getUserInfo(idx);
    if (!userInfo) return CODE.NOT_FOUND;
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

const getUserByIdx = async idx => {
  try {
    const attendPoint = await userDao.getUserByIdx(idx);
    return attendPoint;
  } catch (err) {
    throw new Error(err);
  }
};

const getUserAttendPoints = async (idx, year) => {
  try {
    const tempAttendPoints = await userDao.getUserAttendPoints(idx, year);
    const attendPoints = new Array(12).fill(0);

    tempAttendPoints.forEach(({ month, attendPoint }) => {
      attendPoints[month - 1] = attendPoint;
    });

    return attendPoints;
  } catch (err) {
    return CODE.INTERNAL_SERVER_ERROR;
  }
};

const getUserRecords = async (idx, year) => {
  try {
    const tempRecords = await userDao.getUserRecords(idx, year);

    const records = new Array(12).fill([0, 0]);
    tempRecords.forEach(({ month, shoulder, leg }) => {
      records[month - 1] = [shoulder, leg];
    });
    
    return records;
  } catch (err) {
    return CODE.INTERNAL_SERVER_ERROR;
  }
};

module.exports = {
  getUserInfo,
  getUsersCount,
  getUsersList,
  getUserByIdx,
  getUserAttendPoints,
  getUserRecords,
};
