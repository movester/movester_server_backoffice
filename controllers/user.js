const userService = require('../service/user');
const CODE = require('../utils/statusCode');
const MSG = require('../utils/responseMessage');
const form = require('../utils/responseForm');

const getUserInfo = async (req, res) => {
  try {
    const { idx } = req.params;

    const userInfo = await userService.getUserInfo(idx);

    if (userInfo === CODE.NOT_FOUND) return res.status(CODE.NOT_FOUND).json(form.fail(MSG.IDX_NOT_EXIST));

    return res.status(CODE.OK).json(form.success(userInfo));
  } catch (err) {
    console.error(`=== User Ctrl getUserInfo Error: ${err} === `);
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }
};

const getUsersCount = async (_, res) => {
  try {
    const usersCount = await userService.getUsersCount();
    return res.status(CODE.OK).json(form.success(usersCount));
  } catch (err) {
    console.error(`=== User Ctrl getUsersCount Error: ${err} === `);
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }
};

const getUsersList = async (req, res) => {
  try {
    const { page, sort } = req.query;

    const usersList = await userService.getUsersList(page, sort);
    return res.status(CODE.OK).json(form.success(usersList));
  } catch (err) {
    console.error(`=== User Ctrl getUsersList Error: ${err} === `);
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }
};

const getUserAttendPoints = async (req, res) => {
  try {
    const { idx } = req.params;
    const { year } = req.query;

    const user = await userService.getUserByIdx(idx);
    if (!user) {
      return res.status(CODE.NOT_FOUND).json(form.fail(MSG.IDX_NOT_EXIST));
    }

    const attendPoints = await userService.getUserAttendPoints(idx, year);

    if (attendPoints === CODE.NOT_FOUND) {
      return res.status(CODE.NOT_FOUND).json(form.fail(MSG.IDX_NOT_EXIST));
    }

    return res.status(CODE.OK).json(form.success(attendPoints));
  } catch (err) {
    console.error(`=== User Ctrl getUserAttendPoints Error: ${err} === `);
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }
};

const getUserRecords = async (req, res) => {
  try {
    const { idx } = req.params;
    const { year } = req.query;

    const user = await userService.getUserByIdx(idx);
    if (!user) {
      return res.status(CODE.NOT_FOUND).json(form.fail(MSG.IDX_NOT_EXIST));
    }

    const records = await userService.getUserRecords(idx, year);
    return res.status(CODE.OK).json(form.success(records));
  } catch (err) {
    console.error(`=== User Ctrl getUserRecords Error: ${err} === `);
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }
};

const getUsersSearch = async (req, res) => {
  try {
    const { type, value, page } = req.query;
    const users = await userService.getUsersSearch(type, value, page);

    return res.status(CODE.OK).json(form.success(users));
  } catch (err) {
    console.error(`=== User Ctrl getUsersSearch Error: ${err} === `);
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
