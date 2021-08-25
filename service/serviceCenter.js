const serviceCenterDao = require("../dao/serviceCenter");
const statusCode = require("../utils/statusCode");
const responseMessage = require("../utils/responseMessage");
const utils = require("../utils/utils");
const multerUpload = require("../utils/multer");

const noticeCreate = async ({ createPost }, res) => {
    const daoRow = await serviceCenterDao.noticeCreate({ createPost });
    if (!daoRow) {
        const isNoticeCreateSuccess = res
            .status(statusCode.DB_ERROR)
            .json(
                utils.successFalse(responseMessage.DB_ERROR, missDataToSubmit)
            );
        return isNoticeCreateSuccess;
    }

    // TODO : res 로 전달한 dataToSubmit 값이 필요하지 않음
    const dataToSubmit = {};
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

const noticeDetail = async (detailId, res) => {
    const daoRow = await serviceCenterDao.noticeDetail(detailId);
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

const fileUpload = async (req, res) => {
    multerUpload(req, res, err => {
        if (err) {
            const isfileUploadSuccess = res
                .status(statusCode.DB_ERROR)
                .json(utils.successFalse(responseMessage.FILE_UPLOAD_FAIL, err));
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
    fileUpload
};
