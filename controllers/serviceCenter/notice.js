const noticeService = require("../../service/serviceCenter/notice");

const noticeCreate = async (req, res) => {
    return await noticeService.noticeCreate(req.body, res);
};

const noticeList = async (req, res) => {
    return await noticeService.noticeList(res);
};

const noticeDetail = async (req, res) => {
    return await noticeService.noticeDetail(req.body.noticeIdx, res);
};

const noticeUpdate = async (req, res) => {
    const updatePost = req.body;
    return await noticeService.noticeUpdate({ updatePost }, res);
};

const noticeDelete = async (req, res) => {
    return await noticeService.noticeDelete(req.body.noticeIdx, res);
};

module.exports = {
    noticeCreate,
    noticeList,
    noticeDetail,
    noticeUpdate,
    noticeDelete
};
