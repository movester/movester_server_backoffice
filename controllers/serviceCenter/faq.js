const faqService = require("../../service/serviceCenter/faq");

const faqCreate = async (req, res) => {
    const createPost = req.body;
    return await faqService.faqCreate({ createPost }, res);
};

const faqList = async (req, res) => {
    return await faqService.faqList(res);
};

const faqDetail = async (req, res) => {
    return await faqService.faqDetail(req.body.faqIdx, res);
};

const faqUpdate = async (req, res) => {
    const updatePost = req.body;
    return await faqService.faqUpdate({ updatePost }, res);
};

const faqDelete = async (req, res) => {
    return await faqService.faqDelete(req.body.faqIdx, res);
};

module.exports = {
    faqCreate,
    faqList,
    faqDetail,
    faqUpdate,
    faqDelete
};
