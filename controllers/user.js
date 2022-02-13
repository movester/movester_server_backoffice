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

const getAttendPoint = async (req, res) => {
  const { idx } = req.params;
  const result = await userService.getAttendPoint(idx);

  if (result === CODE.INTERNAL_SERVER_ERROR) {
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }

  if (result === CODE.NOT_FOUND) {
    return res.status(CODE.NOT_FOUND).json(form.fail(MSG.IDX_NOT_EXIST));
  }

  return res.status(CODE.OK).json(form.success(result));
};

const getRecord = async (req, res) => {
  const { idx } = req.params;
  const result = await userService.getRecord(idx);

  if (result === CODE.INTERNAL_SERVER_ERROR) {
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }

  if (result === CODE.NOT_FOUND) {
    return res.status(CODE.NOT_FOUND).json(form.fail(MSG.IDX_NOT_EXIST));
  }

  return res.status(CODE.OK).json(form.success(result));
};

module.exports = {
  getUserInfo,
  getUsersCount,
  getUsersList,
  getAttendPoint,
  getRecord,
};
