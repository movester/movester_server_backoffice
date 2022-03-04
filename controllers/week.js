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

const updateExposeWeek = async (req, res) => {
  try {
    const { weekIdx } = req.body;

    const isValidWeekIdx = await weekService.findWeekByIdx(weekIdx);
    if (!isValidWeekIdx) return res.status(CODE.NOT_FOUND).json(form.fail(MSG.IDX_NOT_EXIST));

    await weekService.updateExposeWeek(weekIdx);

    return res.status(CODE.OK).json(form.success());
  } catch (err) {
    console.error(`=== Week Ctrl updateExposeWeek Error: ${err} === `);
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }
};

const cancelExposeWeek = async (req, res) => {
  try {
    const weekIdx = req.params.idx;

    const isValidWeekIdx = await weekService.findWeekByIdx(weekIdx);
    if (!isValidWeekIdx) return res.status(CODE.NOT_FOUND).json(form.fail(MSG.IDX_NOT_EXIST));

    const isCancel = await weekService.cancelExposeWeek(weekIdx);
    if (!isCancel) return res.status(CODE.NOT_FOUND).json(form.fail("현재 노출중인 일주일 스트레칭이 아닙니다."));

    return res.status(CODE.OK).json(form.success());
  } catch (err) {
    console.error(`=== Week Ctrl cancelExposeWeek Error: ${err} === `);
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }
};

module.exports = {
  createWeek,
  deleteWeek,
  updateExposeWeek,
  cancelExposeWeek
};
