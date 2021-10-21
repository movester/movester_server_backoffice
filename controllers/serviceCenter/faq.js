const faqService = require("../../service/serviceCenter/faq");

const faqCreate = async (req, res) => {
    return await faqService.faqCreate(req.body, res);
};

const faqList = async (req, res) => {
    return await faqService.faqList(res);
};

const faqDetail = async (req, res) => {
    return await faqService.faqDetail(req.params.faqIdx, res);
};

const faqUpdate = async (req, res) => {
    const updatePost = req.body;
    return await faqService.faqUpdate(req.params.faqIdx, { updatePost }, res);
};

const faqDelete = async (req, res) => {
    return await faqService.faqDelete(req.params.faqIdx, res);
};

module.exports = {
    faqCreate,
    faqList,
    faqDetail,
    faqUpdate,
    faqDelete
};
