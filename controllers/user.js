const userService = require('../service/user');
const CODE = require('../utils/statusCode');
const MSG = require('../utils/responseMessage');
const form = require('../utils/responseForm');

const getUserInfo = async (req, res) => {
  const { idx } = req.params;
  const userInfo = await userService.getUserInfo(idx);

  if (userInfo === CODE.INTERNAL_SERVER_ERROR) {
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }

  if (userInfo === CODE.NOT_FOUND) {
    return res.status(CODE.NOT_FOUND).json(form.fail(MSG.IDX_NOT_EXIST));
  }

  return res.status(CODE.OK).json(form.success(userInfo));
};

const getUsersCount = async (req, res) => {
  const usersCount = await userService.getUsersCount();

  if (usersCount === CODE.INTERNAL_SERVER_ERROR) {
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }

  return res.status(CODE.OK).json(form.success(usersCount));
};


module.exports = {
  getUserInfo,
  getUsersCount,
};
