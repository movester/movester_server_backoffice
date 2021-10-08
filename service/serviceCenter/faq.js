const faqDao = require("../../dao/serviceCenter/faq");
const commonDao = require("../../dao/common");
const statusCode = require("../../utils/statusCode");
const responseMessage = require("../../utils/responseMessage");
const utils = require("../../utils/utils");
const multerUpload = require("../../utils/multer");

const faqCreate = async ({ createPost }, res) => {
    const daoRow = await faqDao.faqCreate({ createPost });
    if (!daoRow) {
        const isfaqCreateSuccess = res
            .status(statusCode.DB_ERROR)
            .json(utils.successFalse(responseMessage.DB_ERROR));
        return isfaqCreateSuccess;
    }
    const idxDaoRow = await commonDao.getCreateIdx();

    const isfaqCreateSuccess = res.status(statusCode.OK).json(
        utils.successTrue(responseMessage.POST_CREATE_SUCCESS, {
            faqIdx: idxDaoRow[0].idx
        })
    );

    return isfaqCreateSuccess;
};

const faqList = async res => {
    const daoRow = await faqDao.faqList();
    if (!daoRow) {
        const isfaqListSuccess = res
            .status(statusCode.DB_ERROR)
            .json(utils.successFalse(responseMessage.DB_ERROR));
        return isfaqListSuccess;
    }

    // TODO : daoRow 칼럼명 snake > camelCase 변경
    const isfaqListSuccess = res
        .status(statusCode.OK)
        .json(utils.successTrue(responseMessage.POST_LIST_SUCCESS, daoRow));
    return isfaqListSuccess;
};

const faqDetail = async (faqIdx, res) => {
    const daoRow = await faqDao.faqDetail(faqIdx);
    if (!daoRow) {
        const isfaqDetailSuccess = res
            .status(statusCode.DB_ERROR)
            .json(utils.successFalse(responseMessage.DB_ERROR));
        return isfaqDetailSuccess;
    }

    const resData = {
        faqIdx: daoRow[0].faq_idx,
        title: daoRow[0].title,
        contents: daoRow[0].contents,
        adminUserIdx: daoRow[0].admin_user_idx,
        createAt: daoRow[0].create_at,
        updateAt: daoRow[0].update_at
    };

    const isfaqDetailSuccess = res
        .status(statusCode.OK)
        .json(utils.successTrue(responseMessage.POST_DETAIL_SUCCESS, resData));
    return isfaqDetailSuccess;
};

const faqUpdate = async ({ updatePost }, res) => {
    const daoRow = await faqDao.faqUpdate({ updatePost });
    if (!daoRow) {
        const isfaqUpdateSuccess = res
            .status(statusCode.DB_ERROR)
            .json(
                utils.successFalse(responseMessage.DB_ERROR, missDataToSubmit)
            );
        return isfaqUpdateSuccess;
    }

    dataToSubmit = { title: updatePost.title };

    const isfaqUpdateSuccess = res
        .status(statusCode.OK)
        .json(
            utils.successTrue(responseMessage.POST_UPDATE_SUCCESS, dataToSubmit)
        );

    return isfaqUpdateSuccess;
};

const faqDelete = async (faqIdx, res) => {
    const daoRow = await faqDao.faqDelete(faqIdx);
    if (!daoRow) {
        const isfaqDeleteSuccess = res
            .status(statusCode.DB_ERROR)
            .json(utils.successFalse(responseMessage.DB_ERROR));
        return isfaqDeleteSuccess;
    }

    const isfaqDeleteSuccess = res
        .status(statusCode.OK)
        .json(utils.successTrue(responseMessage.POST_DELETE_SUCCESS));
    console.log(isfaqDeleteSuccess);
    return isfaqDeleteSuccess;
};

module.exports = {
    faqCreate,
    faqList,
    faqDetail,
    faqUpdate,
    faqDelete
};
