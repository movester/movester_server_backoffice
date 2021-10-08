const noticeService = require("../../service/serviceCenter/notice");

const noticeCreate = async (req, res) => {
    const createPost = req.body;
    const isNoticeCreateSuccess = await noticeService.noticeCreate(
        { createPost },
        res
    );
    return isNoticeCreateSuccess;
};

const noticeList = async (req, res) => {
    const isNoticeListSuccess = await noticeService.noticeList(res);
    return isNoticeListSuccess;
};

const noticeDetail = async (req, res) => {
    const isNoticeDetailSuccess = await noticeService.noticeDetail(
        req.body.noticeIdx,
        res
    );
    return isNoticeDetailSuccess;
};

const noticeUpdate = async (req, res) => {
    const updatePost = req.body;
    const isNoticeUpdateSuccess = await noticeService.noticeUpdate(
        { updatePost },
        res
    );
    return isNoticeUpdateSuccess;
};

const noticeDelete = async (req, res) => {
    const isNoticeDeleteSuccess = await noticeService.noticeDelete(
        req.body.noticeIdx,
        res
    );
    return isNoticeDeleteSuccess;
};

module.exports = {
    noticeCreate,
    noticeList,
    noticeDetail,
    noticeUpdate,
    noticeDelete,
};