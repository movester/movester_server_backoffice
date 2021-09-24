const serviceCenterDao = require("../dao/serviceCenter");
const statusCode = require("../utils/statusCode");
const responseMessage = require("../utils/responseMessage");
const utils = require("../utils/utils");
const multerUpload = require("../utils/multer");

let missDataToSubmit = {};
let dataToSubmit = {};

const noticeCreate = async ({ createPost }, res) => {
    console.log(createPost)
    const daoRow = await serviceCenterDao.noticeCreate({ createPost });
    if (!daoRow) {
        const isNoticeCreateSuccess = res
            .status(statusCode.DB_ERROR)
            .json(
                utils.successFalse(responseMessage.DB_ERROR, missDataToSubmit)
            );
        return isNoticeCreateSuccess;
    }
    const idxDaoRow = await serviceCenterDao.getCreateIdx();
    const noticeIdx = idxDaoRow[0].idx;

    dataToSubmit = { postIdx: noticeIdx };
    const isNoticeCreateSuccess = res
        .status(statusCode.OK)
        .json(
            utils.successTrue(responseMessage.POST_CREATE_SUCCESS, dataToSubmit)
        );

    return isNoticeCreateSuccess;
};

const noticeList = async res => {
    const daoRow = await serviceCenterDao.noticeList();
    if (!daoRow) {
        const isNoticeListSuccess = res
            .status(statusCode.DB_ERROR)
            .json(
                utils.successFalse(responseMessage.DB_ERROR, missDataToSubmit)
            );
        return isNoticeListSuccess;
    }

    const isNoticeListSuccess = res
        .status(statusCode.OK)
        .json(utils.successTrue(responseMessage.POST_LIST_SUCCESS, daoRow));
    return isNoticeListSuccess;
};

const noticeDetail = async (postId, res) => {
    const daoRow = await serviceCenterDao.noticeDetail(postId);
    if (!daoRow) {
        const isNoticeDetailSuccess = res
            .status(statusCode.DB_ERROR)
            .json(
                utils.successFalse(responseMessage.DB_ERROR, missDataToSubmit)
            );
        return isNoticeDetailSuccess;
    }

    const isNoticeDetailSuccess = res
        .status(statusCode.OK)
        .json(utils.successTrue(responseMessage.POST_DETAIL_SUCCESS, daoRow));
    return isNoticeDetailSuccess;
};

const noticeUpdate = async ({ updatePost }, res) => {
    const daoRow = await serviceCenterDao.noticeUpdate({ updatePost });
    if (!daoRow) {
        const isNoticeUpdateSuccess = res
            .status(statusCode.DB_ERROR)
            .json(
                utils.successFalse(responseMessage.DB_ERROR, missDataToSubmit)
            );
        return isNoticeUpdateSuccess;
    }

    dataToSubmit = { title : updatePost.title };

    const isNoticeUpdateSuccess = res
        .status(statusCode.OK)
        .json(
            utils.successTrue(responseMessage.POST_UPDATE_SUCCESS, dataToSubmit)
        );

    return isNoticeUpdateSuccess;
};

const noticeDelete = async (postId, res) => {
    const daoRow = await serviceCenterDao.noticeDelete(postId);
    if (!daoRow) {
        const isNoticeDeleteSuccess = res
            .status(statusCode.DB_ERROR)
            .json(
                utils.successFalse(responseMessage.DB_ERROR, missDataToSubmit)
            );
        return isNoticeDeleteSuccess;
    }

    const isNoticeDeleteSuccess = res
        .status(statusCode.OK)
        .json(utils.successTrue(responseMessage.POST_DELETE_SUCCESS, daoRow));
    return isNoticeDeleteSuccess;
};

const fileUpload = async (req, res) => {
    multerUpload(req, res, err => {
        if (err) {
            const isfileUploadSuccess = res
                .status(statusCode.DB_ERROR)
                .json(
                    utils.successFalse(responseMessage.FILE_UPLOAD_FAIL, err)
                );
            return isfileUploadSuccess;
        }
        const dataToSubmit = {
            url: res.req.file.path,
            fileName: res.req.file.filename
        };

        const isfileUploadSuccess = res
            .status(statusCode.OK)
            .json(
                utils.successTrue(
                    responseMessage.FILE_UPLOAD_SUCCESS,
                    dataToSubmit
                )
            );
        return isfileUploadSuccess;
    });
};

module.exports = {
    noticeCreate,
    noticeList,
    noticeDetail,
    noticeUpdate,
    noticeDelete,
    fileUpload
};
