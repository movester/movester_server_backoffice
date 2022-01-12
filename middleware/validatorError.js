const { validationResult } = require('express-validator');
const statusCode = require('../utils/statusCode');
const responseMessage = require('../utils/responseMessage');
const resForm = require('../utils/resForm');

const error = (req, res, next) => {
  const err = validationResult(req);
  const missDataToSubmit = {
    requestParameteError: err.array(),
  };
  if (!err.isEmpty()) {
    return res
      .status(statusCode.BAD_REQUEST)
      .json(resForm.successFalse(responseMessage.VALUE_INVALID, missDataToSubmit));
  }
  next();
};

module.exports = {
  error,
};
