const commonService = require('../service/common');

const fileUpload = async (req, res) => await commonService.fileUpload(req, res);

module.exports = {
  fileUpload,
};
