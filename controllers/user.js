const userService = require('../service/user');
const CODE = require('../utils/statusCode');
const MSG = require('../utils/responseMessage');
const form = require('../utils/responseForm');

const getUsers = async (req, res) => {
  const result = await userService.getUsers();

  if (result === CODE.INTERNAL_SERVER_ERROR) {
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }

  return res.status(CODE.OK).json(form.success(result));
};

const getUserByIdx = async (req, res) => {
  const { idx } = req.params;
  const result = await userService.getUserByIdx(idx);

  if (result === CODE.INTERNAL_SERVER_ERROR) {
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }

  if (result === CODE.NOT_FOUND) {
    return res.status(CODE.NOT_FOUND).json(form.fail(MSG.IDX_NOT_EXIST));
  }

  return res.status(CODE.OK).json(form.success(result));
};

const getUsersCount = async (req, res) => {
  const result = await userService.getUsersCount();

  if (result === CODE.INTERNAL_SERVER_ERROR) {
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }

  return res.status(CODE.OK).json(form.success(result));
};

const getUsersList = async (req, res) => {
  const pages = +req.query.pages;
  const { sort } = req.query;
  if (!pages || !['idx', 'attendPoint', 'legRecord', 'armRecord'].includes(sort)) {
    return res.status(CODE.BAD_REQUEST).json(form.fail(MSG.VALUE_INVALID));
  }

  const result = await userService.getUsersList(pages, sort);

  if (result === CODE.INTERNAL_SERVER_ERROR) {
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }

  return res.status(CODE.OK).json(form.success(result));
};

module.exports = {
  getUsers,
  getUserByIdx,
  getUsersCount,
  getUsersList,
};
