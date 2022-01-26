const adminService = require('../service/admin');
const CODE = require('../utils/statusCode');
const MSG = require('../utils/responseMessage');
const form = require('../utils/responseForm');
const encrypt = require('../modules/encrypt');
const radis = require('../modules/radis');

const login = async (req, res) => {
  const loginUser = req.body;
  const result = await adminService.login(loginUser);

  if (typeof result === 'number') {
    if (result === CODE.BAD_REQUEST) {
      return res.status(CODE.BAD_REQUEST).json(form.fail(MSG.EMAIL_NOT_EXIST));
    }
    if (result === CODE.NOT_FOUND) {
      return res.status(CODE.NOT_FOUND).json(form.fail(MSG.PW_MISMATCH));
    }
    if (result === CODE.INTERNAL_SERVER_ERROR) {
      return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
    }
  }

  return res
    .status(CODE.OK)
    .cookie('accessToken', result.token.accessToken, { httpOnly: true })
    .cookie('refreshToken', result.token.refreshToken, { httpOnly: true })
    .json(form.success(result.admin));
};

const logout = async (req, res) => {
  radis.del(req.cookies.idx);
  res.clearCookie('accessToken').clearCookie('refreshToken').status(CODE.OK).json(form.success(MSG.LOGOUT_SUCCESS));
};

const join = async (req, res) => {
  const joinUser = req.body;
  try {
    const isEmailDuplicate = await adminService.findAdminByEmail(joinUser.email);
    if (isEmailDuplicate) {
      return res.status(CODE.DUPLICATE).json(form.fail(MSG.EMAIL_ALREADY_EXIST));
    }

    const isNameDuplicate = await adminService.findAdminByName(joinUser.name);
    if (isNameDuplicate) {
      return res.status(CODE.DUPLICATE).json(form.fail(MSG.NAME_ALREADY_EXIST));
    }
  } catch (err) {
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }

  const result = await adminService.join(joinUser);
  if (result === CODE.INTERNAL_SERVER_ERROR) {
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }
  res.status(CODE.CREATED).json(form.success());
};

const updatePassword = async (req, res) => {
  const updatePasswordUser = req.body;
  if (updatePasswordUser.newPassword !== updatePasswordUser.confirmPassword) {
    return res.status(CODE.BAD_REQUEST).json(form.fail(MSG.CONFIRM_PW_MISMATCH));
  }

  const { adminIdx } = req.params;
  const admin = await adminService.findAdminByIdx(adminIdx);
  if (!admin) {
    return res.status(CODE.BAD_REQUEST).json(form.fail(MSG.ID_NOT_EXIST));
  }
  updatePasswordUser.adminIdx = adminIdx;

  const isCorrectBeforePassword = await encrypt.compare(updatePasswordUser.beforePassword, admin.password);

  if (!isCorrectBeforePassword) {
    return res.status(CODE.BAD_REQUEST).json(form.fail(MSG.PW_MISMATCH));
  }

  const result = await adminService.updatePassword(updatePasswordUser);

  if (result === CODE.INTERNAL_SERVER_ERROR) {
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }

  return res.status(CODE.OK).json(form.success());
};

module.exports = {
  login,
  logout,
  join,
  updatePassword,
};
