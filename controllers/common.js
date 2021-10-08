const commonService = require("../service/common");

const fileUpload = async (req, res) => {
    const isFileUploadSuccess = await commonService.fileUpload(req, res);
    return isFileUploadSuccess;
};

module.exports = {
    fileUpload
};