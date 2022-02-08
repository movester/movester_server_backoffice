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

module.exports = {
  getUsers,
};
