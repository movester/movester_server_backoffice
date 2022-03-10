const adminService = require('../service/admin');
const CODE = require('../utils/statusCode');
const MSG = require('../utils/responseMessage');
const form = require('../utils/responseForm');
const encrypt = require('../modules/encrypt');
const redis = require('../modules/redis');

const join = async (req, res) => {
  try {
    const joinAdmin = req.body;

    const isIdDuplicate = await adminService.findAdminById(joinAdmin.id);
    if (isIdDuplicate) return res.status(CODE.DUPLICATE).json(form.fail(MSG.ID_ALREADY_EXIST));

    const isNameDuplicate = await adminService.findAdminByName(joinAdmin.name);
    if (isNameDuplicate) return res.status(CODE.DUPLICATE).json(form.fail(MSG.NAME_ALREADY_EXIST));

    await adminService.join(joinAdmin);
    res.status(CODE.CREATED).json(form.success());
  } catch (err) {
    console.error(`=== Admin Ctrl join Error: ${err} === `);
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }
};

const login = async (req, res) => {
  try {
    const reqAdmin = req.body;
    const isAdminValid = await adminService.findAdminById(reqAdmin.id);

    if (!isAdminValid) return res.status(CODE.BAD_REQUEST).json(form.fail(MSG.ID_NOT_EXIST));
    if (isAdminValid.deleteAt) return res.status(CODE.BAD_REQUEST).json(form.fail('탈퇴한 관리자 계정입니다.'));

    const loginAdmin = await adminService.login(reqAdmin);
    if (!loginAdmin) return res.status(CODE.NOT_FOUND).json(form.fail(MSG.PW_MISMATCH));

    return res
      .status(CODE.OK)
      .cookie('accessToken', loginAdmin.token.accessToken, { httpOnly: true })
      .cookie('refreshToken', loginAdmin.token.refreshToken, { httpOnly: true })
      .json(form.success(loginAdmin.admin));
  } catch (err) {
    console.error(`=== Admin Ctrl login Error: ${err} === `);
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }
};

const logout = async (req, res) => {
  try {
    redis.del(req.cookies.idx);
    res.clearCookie('accessToken').clearCookie('refreshToken').status(CODE.OK).json(form.success(MSG.LOGOUT_SUCCESS));
  } catch (err) {
    console.error(`=== Admin Ctrl logout Error: ${err} === `);
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }
};

const updatePassword = async (req, res) => {
  try {
    const reqAdmin = req.body;
    if (reqAdmin.newPassword !== reqAdmin.confirmPassword) {
      return res.status(CODE.BAD_REQUEST).json(form.fail(MSG.CONFIRM_PW_MISMATCH));
    }

    const { adminIdx } = req.params;
    const admin = await adminService.findAdminByIdx(adminIdx);
    if (!admin) {
      return res.status(CODE.NOT_FOUND).json(form.fail(MSG.IDX_NOT_EXIST));
    }

    reqAdmin.adminIdx = adminIdx;

    const isCorrectBeforePassword = await encrypt.compare(reqAdmin.beforePassword, admin.password);
    if (!isCorrectBeforePassword) return res.status(CODE.BAD_REQUEST).json(form.fail(MSG.PW_MISMATCH));

    await adminService.updatePassword(reqAdmin);
    return res.status(CODE.OK).json(form.success());
  } catch (err) {
    console.error(`=== Admin Ctrl updatePassword Error: ${err} === `);
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }
};

const getAdminsList = async (_, res) => {
  try {
    const adminsList = await adminService.getAdminsList();
    return res.status(CODE.OK).json(form.success(adminsList));
  } catch (err) {
    console.error(`=== Admin Ctrl getAdminsList Error: ${err} === `);
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const { idx } = req.params;

    if (req.cookies.idx === idx)
      return res.status(CODE.BAD_REQUEST).json(form.fail('본인 계정은 본인이 삭제할 수 없습니다.'));

    const isExistAdminIdx = await adminService.findAdminByIdx(idx);
    if (!isExistAdminIdx) return res.status(CODE.NOT_FOUND).json(form.fail(MSG.IDX_NOT_EXIST));

    await adminService.deleteAdmin(idx);
    return res.status(CODE.OK).json(form.success());
  } catch (err) {
    console.error(`=== Admin Ctrl deleteAdmin Error: ${err} === `);
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }
};

module.exports = {
  join,
  login,
  logout,
  updatePassword,
  getAdminsList,
  deleteAdmin,
};
