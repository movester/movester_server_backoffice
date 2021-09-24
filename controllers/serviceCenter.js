const serviceCenterService = require("../service/serviceCenter");

const noticeCreate = async (req, res) => {
    const createPost = req.body;
    const isNoticeCreateSuccess = await serviceCenterService.noticeCreate({ createPost }, res);
    return isNoticeCreateSuccess;
};

const noticeList = async (req, res) => {
    const isNoticeListSuccess = await serviceCenterService.noticeList(res);
    return isNoticeListSuccess
};

const noticeDetail = async (req, res) => {
    const isNoticeDetailSuccess = await serviceCenterService.noticeDetail(req.body.noticeIdx, res);
    return isNoticeDetailSuccess
};

const noticeUpdate = async (req, res) => {
    const updatePost = req.body;
    console.log(updatePost)
    const isNoticeUpdateSuccess = await serviceCenterService.noticeUpdate({ updatePost }, res);
    return isNoticeUpdateSuccess
};

const noticeDelete = async (req, res) => {
    const isNoticeDeleteSuccess = await serviceCenterService.noticeDelete(req.body.noticeIdx, res);
    return isNoticeDeleteSuccess
};

const fileUpload = async (req, res) => {
    const isFileUploadSuccess = await serviceCenterService.fileUpload(req, res);
    return isFileUploadSuccess
};



module.exports = {
    noticeCreate,
    noticeList,
    noticeDetail,
    noticeUpdate,
    noticeDelete,
    fileUpload
};
