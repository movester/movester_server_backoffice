const stretchingService = require('../service/stretching');
const CODE = require('../utils/statusCode');
const MSG = require('../utils/responseMessage');
const form = require('../utils/responseForm');

const createStretching = async (req, res) => {
  try {
    const stretching = req.body;
    stretching.adminIdx = req.cookies.idx;

    const isTitleDuplicate = await stretchingService.findStretchingByTitle(stretching.title);
    if (isTitleDuplicate) {
      return res.status(CODE.DUPLICATE).json(form.fail(MSG.TITLE_ALREADY_EXIST));
    }

    const stretchingIdx = await stretchingService.createStretching(stretching);

    return res.status(CODE.CREATED).json(form.success({ stretchingIdx }));
  } catch (err) {
    console.error(`=== Stretching Ctrl createStretching Error: ${err} === `);
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }
};

const deleteStretching = async (req, res) => {
  try {
    const stretchingIdx = req.params.idx;

    const isDelete = await stretchingService.deleteStretching(stretchingIdx);
    if (!isDelete) return res.status(CODE.NOT_FOUND).json(form.fail(MSG.IDX_NOT_EXIST));

    return res.status(CODE.OK).json(form.success());
  } catch (err) {
    console.error(`=== Stretching Ctrl deleteStretching Error: ${err} === `);
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }
};

const getStretching = async (req, res) => {
  try {
    const stretchingIdx = req.params.idx;

    const stretching = await stretchingService.getStretching(stretchingIdx);
    if (!stretching) return res.status(CODE.NOT_FOUND).json(form.fail(MSG.IDX_NOT_EXIST));
    return res.status(CODE.CREATED).json(form.success(stretching));
  } catch (err) {
    console.error(`=== Stretching Ctrl getStretching Error: ${err} === `);
  }
};

const updateStretching = async (req, res) => {
  try {
    const stretching = req.body;
    stretching.adminIdx = req.cookies.idx;

    const isTitleDuplicate = await stretchingService.findStretchingByTitle(stretching.title);
    if (isTitleDuplicate) {
      return res.status(CODE.DUPLICATE).json(form.fail(MSG.TITLE_ALREADY_EXIST));
    }

    const isUpdate = await stretchingService.updateStretching(stretching);
    if (!isUpdate) return res.status(CODE.NOT_FOUND).json(form.fail(MSG.IDX_NOT_EXIST));

    return res.status(CODE.OK).json(form.success());
  } catch (err) {
    console.error(`=== Stretching Ctrl updateStretching Error: ${err} === `);
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }
};

const getStretchings = async (req, res) => {
  try {
    const search = req.query;
    const stretchings = await stretchingService.getStretchings(search);

    return res.status(CODE.OK).json(form.success(stretchings));
  } catch (err) {
    console.error(`=== Stretching Ctrl getStretchings Error: ${err} === `);
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }
};

module.exports = {
  createStretching,
  deleteStretching,
  getStretching,
  updateStretching,
  getStretchings,
};
