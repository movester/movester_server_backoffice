const multerUpload = require('../utils/multer');
const statusCode = require('../utils/statusCode');
const responseMessage = require('../utils/responseMessage');
const utils = require('../utils/utils');

const fileUpload = async (req, res) => {
  await multerUpload(req, res, err => {
    if (err) {
      return res.status(statusCode.DB_ERROR).json(utils.successFalse(responseMessage.FILE_UPLOAD_FAIL, err));
    }
    const dataToSubmit = {
      url: res.req.file.path,
      fileName: res.req.file.filename,
    };

    return res.status(statusCode.OK).json(utils.successTrue(responseMessage.FILE_UPLOAD_SUCCESS, dataToSubmit));
  });
};

module.exports = {
  fileUpload,
};
