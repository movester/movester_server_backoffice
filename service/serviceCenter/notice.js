const noticeDao = require("../../dao/serviceCenter/notice");
const commonDao = require("../../dao/common");
const statusCode = require("../../utils/statusCode");
const responseMessage = require("../../utils/responseMessage");
const utils = require("../../utils/utils");
const multerUpload = require("../../utils/multer");

const noticeCreate = async ({ createPost }, res) => {
    const daoRow = await noticeDao.noticeCreate({ createPost });
    if (!daoRow) {
        const isNoticeCreateSuccess = res
            .status(statusCode.DB_ERROR)
            .json(utils.successFalse(responseMessage.DB_ERROR));
        return isNoticeCreateSuccess;
    }
    const idxDaoRow = await commonDao.getCreateIdx();

    const isNoticeCreateSuccess = res.status(statusCode.OK).json(
        utils.successTrue(responseMessage.POST_CREATE_SUCCESS, {
            noticeIdx: idxDaoRow[0].idx
        })
    );

    return isNoticeCreateSuccess;
};

const noticeList = async res => {
    const daoRow = await noticeDao.noticeList();
    if (!daoRow) {
        const isNoticeListSuccess = res
            .status(statusCode.DB_ERROR)
            .json(utils.successFalse(responseMessage.DB_ERROR));
        return isNoticeListSuccess;
    }

    // TODO : daoRow 칼럼명 snake > camelCase 변경
    const isNoticeListSuccess = res
        .status(statusCode.OK)
        .json(utils.successTrue(responseMessage.POST_LIST_SUCCESS, daoRow));
    return isNoticeListSuccess;
};

const noticeDetail = async (noticeIdx, res) => {
    const daoRow = await noticeDao.noticeDetail(noticeIdx);
    if (!daoRow) {
        const isNoticeDetailSuccess = res
            .status(statusCode.DB_ERROR)
            .json(utils.successFalse(responseMessage.DB_ERROR));
        return isNoticeDetailSuccess;
    }

    const resData = {
        noticeIdx: daoRow[0].notice_idx,
        title: daoRow[0].title,
        contents: daoRow[0].contents,
        adminUserIdx: daoRow[0].admin_user_idx,
        createAt: daoRow[0].create_at,
        updateAt: daoRow[0].update_at
    };

    const isNoticeDetailSuccess = res
        .status(statusCode.OK)
        .json(utils.successTrue(responseMessage.POST_DETAIL_SUCCESS, resData));
    return isNoticeDetailSuccess;
};

const noticeUpdate = async ({ updatePost }, res) => {
    const daoRow = await noticeDao.noticeUpdate({ updatePost });
    if (!daoRow) {
        const isNoticeUpdateSuccess = res
            .status(statusCode.DB_ERROR)
            .json(
                utils.successFalse(responseMessage.DB_ERROR, missDataToSubmit)
            );
        return isNoticeUpdateSuccess;
    }

    dataToSubmit = { title: updatePost.title };

    const isNoticeUpdateSuccess = res
        .status(statusCode.OK)
        .json(
            utils.successTrue(responseMessage.POST_UPDATE_SUCCESS, dataToSubmit)
        );

    return isNoticeUpdateSuccess;
};

const noticeDelete = async (noticeIdx, res) => {
    const daoRow = await noticeDao.noticeDelete(noticeIdx);
    if (!daoRow) {
        const isNoticeDeleteSuccess = res
            .status(statusCode.DB_ERROR)
            .json(utils.successFalse(responseMessage.DB_ERROR));
        return isNoticeDeleteSuccess;
    }

    const isNoticeDeleteSuccess = res
        .status(statusCode.OK)
        .json(utils.successTrue(responseMessage.POST_DELETE_SUCCESS));
    console.log(isNoticeDeleteSuccess);
    return isNoticeDeleteSuccess;
};

module.exports = {
    noticeCreate,
    noticeList,
    noticeDetail,
    noticeUpdate,
    noticeDelete,
};
