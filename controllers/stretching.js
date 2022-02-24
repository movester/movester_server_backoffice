const stretchingService = require('../service/stretching');
const CODE = require('../utils/statusCode');
const MSG = require('../utils/responseMessage');
const form = require('../utils/responseForm');

const createStretching = async (req, res) => {
  try {
    const stretching = req.body;
    stretching.adminIdx = req.cookies.idx;

    const IsTitleDuplicate = await stretchingService.findStretchingByTitle(stretching.title);
    if (IsTitleDuplicate) {
      return res.status(CODE.DUPLICATE).json(form.fail(MSG.TITLE_ALREADY_EXIST));
    }

    const newStretchingIdx = await stretchingService.createStretching(stretching);

    return res.status(CODE.CREATED).json(form.success(newStretchingIdx));
  } catch (err) {
    console.error(`=== Stretching Ctrl createStretching Error: ${err} === `);
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }
};

module.exports = {
  createStretching,
};
