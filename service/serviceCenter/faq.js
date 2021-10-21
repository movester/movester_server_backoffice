const faqDao = require("../../dao/serviceCenter/faq");
const commonDao = require("../../dao/common");
const statusCode = require("../../utils/statusCode");
const responseMessage = require("../../utils/responseMessage");
const utils = require("../../utils/utils");

const faqCreate = async (createPost, res) => {
    const daoRow = await faqDao.faqCreate(createPost);
    if (!daoRow) {
        return res
            .status(statusCode.DB_ERROR)
            .json(utils.successFalse(responseMessage.DB_ERROR));
    }
    const idxDaoRow = await commonDao.getCreateIdx();

    return res.status(statusCode.OK).json(
        utils.successTrue(responseMessage.POST_CREATE_SUCCESS, {
            faqIdx: idxDaoRow[0].idx
        })
    );
};

const faqList = async res => {
    const daoRow = await faqDao.faqList();
    if (!daoRow) {
        return res
            .status(statusCode.DB_ERROR)
            .json(utils.successFalse(responseMessage.DB_ERROR));
    }

    // TODO : daoRow 칼럼명 snake > camelCase 변경
    return res
        .status(statusCode.OK)
        .json(utils.successTrue(responseMessage.POST_LIST_SUCCESS, daoRow));
};

const faqDetail = async (faqIdx, res) => {
    const daoRow = await faqDao.faqDetail(faqIdx);
    if (!daoRow) {
        return res
            .status(statusCode.DB_ERROR)
            .json(utils.successFalse(responseMessage.DB_ERROR));
    }

    const resData = {
        faqIdx: daoRow[0].faq_idx,
        title: daoRow[0].title,
        contents: daoRow[0].contents,
        adminIdx: daoRow[0].admin_idx,
        createAt: daoRow[0].create_at,
        updateAt: daoRow[0].update_at
    };

    return res
        .status(statusCode.OK)
        .json(utils.successTrue(responseMessage.POST_DETAIL_SUCCESS, resData));
};

const faqUpdate = async (faqIdx, { updatePost }, res) => {
    const daoRow = await faqDao.faqUpdate(faqIdx, { updatePost });
    if (!daoRow) {
        return res
            .status(statusCode.DB_ERROR)
            .json(
                utils.successFalse(responseMessage.DB_ERROR)
            );
    }

    dataToSubmit = { title: updatePost.title };

    return res
        .status(statusCode.OK)
        .json(
            utils.successTrue(responseMessage.POST_UPDATE_SUCCESS, dataToSubmit)
        );
};

const faqDelete = async (faqIdx, res) => {
    const daoRow = await faqDao.faqDelete(faqIdx);
    if (!daoRow) {
        return res
            .status(statusCode.DB_ERROR)
            .json(utils.successFalse(responseMessage.DB_ERROR));
    }

    return res
        .status(statusCode.OK)
        .json(utils.successTrue(responseMessage.POST_DELETE_SUCCESS));
};

module.exports = {
    faqCreate,
    faqList,
    faqDetail,
    faqUpdate,
    faqDelete
};
