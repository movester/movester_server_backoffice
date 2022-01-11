const noticeDao = require('../../dao/serviceCenter/notice');
const commonDao = require('../../dao/common');
const statusCode = require('../../utils/statusCode');
const responseMessage = require('../../utils/responseMessage');
const utils = require('../../utils/utils');

const noticeCreate = async (createPost, res) => {
  const daoRow = await noticeDao.noticeCreate(createPost);
  if (!daoRow) {
    return res.status(statusCode.DB_ERROR).json(utils.successFalse(responseMessage.DB_ERROR));
  }
  const idxDaoRow = await commonDao.getCreateIdx();

  return res.status(statusCode.OK).json(
    utils.successTrue(responseMessage.POST_CREATE_SUCCESS, {
      noticeIdx: idxDaoRow[0].idx,
    })
  );
};

const noticeList = async res => {
  const daoRow = await noticeDao.noticeList();
  if (!daoRow) {
    return res.status(statusCode.DB_ERROR).json(utils.successFalse(responseMessage.DB_ERROR));
  }

  // TODO : daoRow 칼럼명 snake > camelCase 변경
  return res.status(statusCode.OK).json(utils.successTrue(responseMessage.POST_LIST_SUCCESS, daoRow));
};

const noticeDetail = async (noticeIdx, res) => {
  const daoRow = await noticeDao.noticeDetail(noticeIdx);
  if (!daoRow) {
    return res.status(statusCode.DB_ERROR).json(utils.successFalse(responseMessage.DB_ERROR));
  }

  const resData = {
    noticeIdx: daoRow[0].notice_idx,
    title: daoRow[0].title,
    contents: daoRow[0].contents,
    adminIdx: daoRow[0].admin_idx,
    createAt: daoRow[0].create_at,
    updateAt: daoRow[0].update_at,
  };

  return res.status(statusCode.OK).json(utils.successTrue(responseMessage.POST_DETAIL_SUCCESS, resData));
};

const noticeUpdate = async (noticeIdx, { updatePost }, res) => {
  const daoRow = await noticeDao.noticeUpdate(noticeIdx, { updatePost });
  if (!daoRow) {
    return res.status(statusCode.DB_ERROR).json(utils.successFalse(responseMessage.DB_ERROR));
  }

  const dataToSubmit = { title: updatePost.title };

  return res.status(statusCode.OK).json(utils.successTrue(responseMessage.POST_UPDATE_SUCCESS, dataToSubmit));
};

const noticeDelete = async (noticeIdx, res) => {
  const daoRow = await noticeDao.noticeDelete(noticeIdx);
  if (!daoRow) {
    return res.status(statusCode.DB_ERROR).json(utils.successFalse(responseMessage.DB_ERROR));
  }

  return res.status(statusCode.OK).json(utils.successTrue(responseMessage.POST_DELETE_SUCCESS));
};

module.exports = {
  noticeCreate,
  noticeList,
  noticeDetail,
  noticeUpdate,
  noticeDelete,
};
