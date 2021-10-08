const faqService = require("../../service/serviceCenter/faq");

const faqCreate = async (req, res) => {
    const createPost = req.body;
    const isfaqCreateSuccess = await faqService.faqCreate(
        { createPost },
        res
    );
    return isfaqCreateSuccess;
};

const faqList = async (req, res) => {
    const isfaqListSuccess = await faqService.faqList(res);
    return isfaqListSuccess;
};

const faqDetail = async (req, res) => {
    const isfaqDetailSuccess = await faqService.faqDetail(
        req.body.faqIdx,
        res
    );
    return isfaqDetailSuccess;
};

const faqUpdate = async (req, res) => {
    const updatePost = req.body;
    const isfaqUpdateSuccess = await faqService.faqUpdate(
        { updatePost },
        res
    );
    return isfaqUpdateSuccess;
};

const faqDelete = async (req, res) => {
    const isfaqDeleteSuccess = await faqService.faqDelete(
        req.body.faqIdx,
        res
    );
    return isfaqDeleteSuccess;
};

module.exports = {
    faqCreate,
    faqList,
    faqDetail,
    faqUpdate,
    faqDelete,
};