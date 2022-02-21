const userDao = require('../dao/user');
const CODE = require('../utils/statusCode');

const getUserInfo = async idx => {
  try {
    const userInfo = await userDao.getUserInfo(idx);
    if (!userInfo) return CODE.NOT_FOUND;
    return userInfo;
  } catch (err) {
    console.error(`=== User Service getUserInfo Error: ${err} === `);
    throw new Error(err);
  }
};

const getUsersCount = async () => {
  try {
    const usersCount = await userDao.getUsersCount();
    return usersCount;
  } catch (err) {
    console.error(`=== User Service getUsersCount Error: ${err} === `);
    throw new Error(err);
  }
};

const getUsersList = async (page, sort) => {
  try {
    const SORT_LIST = ['JOIN', 'ATTEND_POINT'];

    const getSearchStart = page => (page - 1) * 10;

    let tempUsersList;

    if (sort === SORT_LIST[0]) {
      tempUsersList = await userDao.getUsersListByCreateAt(getSearchStart(page));
    }

    if (sort === SORT_LIST[1]) {
      tempUsersList = await userDao.getUsersListByAttendPoint(getSearchStart(page));
    }

    const usersList = tempUsersList.map(user => {
      user.attendPoint = user.attendPoint * 10 || 0;
      return user;
    });

    return usersList;
  } catch (err) {
    console.error(`=== User Service getUsersList Error: ${err} === `);
    throw new Error(err);
  }
};

const getUserByIdx = async idx => {
  try {
    const attendPoint = await userDao.getUserByIdx(idx);
    return attendPoint;
  } catch (err) {
    console.error(`=== User Service getUserByIdx Error: ${err} === `);
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
    console.error(`=== User Service getUserAttendPoints Error: ${err} === `);
    throw new Error(err);
  }
};

const getUserRecords = async (idx, year) => {
  try {
    const tempRecords = await userDao.getUserRecords(idx, year);

    const records = new Array(12).fill([null, null]);

    tempRecords.forEach(({ month, shoulder, leg }) => {
      const calcShoulder = !shoulder ? shoulder : shoulder.toFixed(1);
      const calcLeg = !leg ? leg : leg.toFixed(1);
      records[month - 1] = [calcShoulder, calcLeg];
    });

    return records;
  } catch (err) {
    console.error(`=== User Service getUserRecords Error: ${err} === `);
    throw new Error(err);
  }
};

const getUsersSearch = async (type, value, page) => {
  try {
    const serachType = {
      USER_IDX: 'user_idx',
      EMAIL: 'email',
      NAME: 'name',
    };

    const getSearchStart = page => (page === 1 ? 0 : (page - 1) * 10);

    const tempUsers = await userDao.getUsersSearch(serachType[type], value);
    const searchCnt = tempUsers.length;

    const users = tempUsers.splice(getSearchStart(page), 10).map(user => {
      user.attendPoint = user.attendPoint * 10 || 0;
      return user;
    });

    return { searchCnt, users };
  } catch (err) {
    console.error(`=== User Service getUsersSearch Error: ${err} === `);
    throw new Error(err);
  }
};

module.exports = {
  getUserInfo,
  getUsersCount,
  getUsersList,
  getUserByIdx,
  getUserAttendPoints,
  getUserRecords,
  getUsersSearch,
};
