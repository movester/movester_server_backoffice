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

const getUsersList = async (req, res) => {
  const { page, sort } = req.query;

  const usersList = await userService.getUsersList(page, sort);

  if (usersList === CODE.INTERNAL_SERVER_ERROR) {
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }

  return res.status(CODE.OK).json(form.success(usersList));
};

const getUserAttendPoints = async (req, res) => {
  const { idx } = req.params;
  const { year } = req.query;

  try {
    const user = await userService.getUserByIdx(idx);
    if (!user) {
      return res.status(CODE.NOT_FOUND).json(form.fail(MSG.IDX_NOT_EXIST));
    }
  } catch (err) {
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }

  const attendPoints = await userService.getUserAttendPoints(idx, year);

  if (attendPoints === CODE.INTERNAL_SERVER_ERROR) {
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }

  if (attendPoints === CODE.NOT_FOUND) {
    return res.status(CODE.NOT_FOUND).json(form.fail(MSG.IDX_NOT_EXIST));
  }

  return res.status(CODE.OK).json(form.success(attendPoints));
};

const getUserRecords = async (req, res) => {
  const { idx } = req.params;
  const { year } = req.query;

  try {
    const user = await userService.getUserByIdx(idx);
    if (!user) {
      return res.status(CODE.NOT_FOUND).json(form.fail(MSG.IDX_NOT_EXIST));
    }
  } catch (err) {
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }

  const records = await userService.getUserRecords(idx, year);

  if (records === CODE.INTERNAL_SERVER_ERROR) {
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }

  return res.status(CODE.OK).json(form.success(records));
};

const getUsersSearch = async (req, res) => {
  const { type, value } = req.query;

  try {
    const users = await userService.getUsersSearch(type, value);

    if (users === CODE.INTERNAL_SERVER_ERROR) {
      return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
    }

    return res.status(CODE.OK).json(form.success(users));
  } catch (err) {
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }
};

module.exports = {
  getUserInfo,
  getUsersCount,
  getUsersList,
  getUserAttendPoints,
  getUserRecords,
  getUsersSearch,
};
