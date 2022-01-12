const adminService = require('../service/admin');
const CODE = require('../utils/statusCode');
const MSG = require('../utils/responseMessage');
const form = require('../utils/responseForm');
const encrypt = require('../modules/encrypt');

const login = async (req, res) => {
  const loginUser = req.body;
  const isLogin = await adminService.login(loginUser);

  if (typeof isLogin === 'number') {
    if (isLogin === CODE.BAD_REQUEST) {
      return res.status(CODE.BAD_REQUEST).json(form.fail(MSG.EMAIL_NOT_EXIST));
    }
    if (isLogin === CODE.NOT_FOUND) {
      return res.status(CODE.NOT_FOUND).json(form.fail(MSG.PW_MISMATCH));
    }
    if (isLogin === CODE.INTERNAL_SERVER_ERROR) {
      return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
    }
  }

  return res.status(CODE.OK).json(form.success(isLogin));
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

  const isEmail = await adminService.findUserByEmail(joinUser.email);
  if (!isEmail) {
    return res.status(CODE.DB_ERROR).json(form.successFalse(MSG.DB_ERROR));
  }
  if (Object.keys(isEmail).length > 0) {
    return res.status(CODE.BAD_REQUEST).json(form.successFalse(MSG.EMAIL_ALREADY_EXIST));
  }
  return await adminService.join({ joinUser }, res);
};

const updatePassword = async (req, res) => {
  const updatePasswordUser = req.body;
  if (updatePasswordUser.newPassword !== updatePasswordUser.confirmPassword) {
    return res.status(CODE.BAD_REQUEST).json(form.successFalse(MSG.CONFIRM_PW_MISMATCH));
  }

  const admin = await adminService.findUserByIdx(req.params.adminIdx);
  if (!admin) {
    return res.status(CODE.DB_ERROR).json(form.successFalse(MSG.DB_ERROR));
  }

  const comparePassword = admin[0].password;
  const isCorrectBeforePassword = await encrypt.comparePassword(updatePasswordUser.beforePassword, comparePassword);

  if (isCorrectBeforePassword === 0) {
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.successFalse(MSG.ENCRYPT_ERROR));
  }

  if (isCorrectBeforePassword === false) {
    return res.status(CODE.BAD_REQUEST).json(form.successFalse(MSG.PW_MISMATCH));
  }

  return await adminService.updatePassword({ updatePasswordUser }, res);
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
