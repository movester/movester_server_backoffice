const weekService = require('../service/week');
const CODE = require('../utils/statusCode');
const MSG = require('../utils/responseMessage');
const form = require('../utils/responseForm');

const createWeek = async (req, res) => {
  try {
    const week = req.body;
    week.adminIdx = req.cookies.idx;

    const isTitleDuplicate = await weekService.findWeekByTitle(week.title);
    if (isTitleDuplicate) {
      return res.status(CODE.DUPLICATE).json(form.fail(MSG.TITLE_ALREADY_EXIST));
    }

    const weekIdx = await weekService.createWeek(week);
    if (!weekIdx) return res.status(CODE.NOT_FOUND).json(form.fail(MSG.IDX_NOT_EXIST));

    return res.status(CODE.CREATED).json(form.success({ weekIdx }));
  } catch (err) {
    console.error(`=== Week Ctrl createWeek Error: ${err} === `);
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }
};

const deleteWeek = async (req, res) => {
  try {
    const weekIdx = req.params.idx;

    const isDelete = await weekService.deleteWeek(weekIdx);
    if (!isDelete) return res.status(CODE.NOT_FOUND).json(form.fail(MSG.IDX_NOT_EXIST));

    return res.status(CODE.OK).json(form.success());
  } catch (err) {
    console.error(`=== Week Ctrl deleteWeek Error: ${err} === `);
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }
};

const updateWeek = async (req, res) => {
  try {
    const week = req.body;
    week.adminIdx = req.cookies.idx;

    const isTitleDuplicate = await weekService.findWeekByTitle(week.title);
    if (isTitleDuplicate.weekIdx !== week.weekIdx) {
      return res.status(CODE.DUPLICATE).json(form.fail(MSG.TITLE_ALREADY_EXIST));
    }

    const isUpdate = await weekService.updateWeek(week);
    if (!isUpdate) return res.status(CODE.NOT_FOUND).json(form.fail(MSG.IDX_NOT_EXIST));

    return res.status(CODE.OK).json(form.success());
  } catch (err) {
    console.error(`=== Week Ctrl updateWeek Error: ${err} === `);
  }
}

const getWeek = async (req, res) => {
  try {
    const weekIdx = req.params.idx;

    const week = await weekService.getWeek(weekIdx);
    if (!week) return res.status(CODE.NOT_FOUND).json(form.fail(MSG.IDX_NOT_EXIST));

    return res.status(CODE.OK).json(form.success(week));
  } catch (err) {
    console.error(`=== Week Ctrl getWeek Error: ${err} === `);
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }
};

module.exports = {
  createWeek,
  deleteWeek,
  updateWeek,
  getWeek
};
