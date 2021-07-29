const { validationResult } = require("express-validator");
const statusCode = require("../utils/statusCode");
const responseMessage = require("../utils/responseMessage");
const utils = require("../utils/utils");

const error = (req, res, next) => {
    const err = validationResult(req);
    const missDataToSubmit = {
        requestParameteError: err.array()
    };
    if (!err.isEmpty()) {
        return res
            .status(statusCode.BAD_REQUEST)
            .json(utils.successFalse(responseMessage.VALUE_INVALID,missDataToSubmit));
    }
    next();
};


module.exports = {
    error
};
