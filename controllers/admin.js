const adminService = require('../service/admin');
const CODE = require('../utils/statusCode');
const MSG = require('../utils/responseMessage');
const form = require('../utils/responseForm');
const encrypt = require('../modules/encrypt');

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

  return res.status(CODE.OK).json(form.success(result));
};

const reissueAccessToken = async (req, res) => {
  const email = req.decodeRefreshToken.sub;
  return adminService.reissueAccessToken(email, res);
};

// accessToken, refeshToken 재발급 과정 동작이 원활한지 테스트를 만들도록 함
const dashboard = async (req, res) => res.json({ status: true, message: 'hello from dashboard' });

const logout = async (req, res) => {
  const email = req.decodeData.sub;
  return await adminService.logout(email, res);
};

const auth = async (req, res) => {
  const authUser = {
    isAuth: true,
    email: req.decodeData.sub,
    accessToken: req.accessToken,
  };
  res.json(form.successTrue(MSG.LOGIN_SUCCESS, authUser));
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
  reissueAccessToken,
  dashboard,
  logout,
  auth,
  join,
  updatePassword,
};
