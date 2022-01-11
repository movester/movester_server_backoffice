const noticeService = require('../../service/serviceCenter/notice');

const noticeCreate = async (req, res) => await noticeService.noticeCreate(req.body, res);

const noticeList = async (req, res) => await noticeService.noticeList(res);

const noticeDetail = async (req, res) => await noticeService.noticeDetail(req.params.noticeIdx, res);

const noticeUpdate = async (req, res) => {
  const updatePost = req.body;
  return await noticeService.noticeUpdate(req.params.noticeIdx, { updatePost }, res);
};

const noticeDelete = async (req, res) => await noticeService.noticeDelete(req.params.noticeIdx, res);

module.exports = {
  noticeCreate,
  noticeList,
  noticeDetail,
  noticeUpdate,
  noticeDelete,
};
