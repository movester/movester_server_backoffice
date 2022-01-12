const adminService = require('../service/admin');
const statusCode = require('../utils/statusCode');
const responseMessage = require('../utils/responseMessage');
const resForm = require('../utils/resForm');
const encrypt = require('../utils/encrypt');

const login = async (req, res) => {
  const loginUser = req.body;
  const isLogin = await adminService.login(loginUser, res);

  if (typeof isLogin === 'number') {
    return res.status(isLogin).json(resForm.successFalse(responseMessage.LOGIN_FAIL));
  }
  res.send("isLogin");
};

// const login = async (req, res) => {
//   const loginUser = req.body;
//   return await adminService.login({ loginUser }, res);
// };

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
  res.json(resForm.successTrue(responseMessage.LOGIN_SUCCESS, authUser));
};

const join = async (req, res) => {
  const joinUser = req.body;

  const isEmail = await adminService.findUserByEmail(joinUser.email);
  if (!isEmail) {
    return res.status(statusCode.DB_ERROR).json(resForm.successFalse(responseMessage.DB_ERROR));
  }
  if (Object.keys(isEmail).length > 0) {
    return res.status(statusCode.BAD_REQUEST).json(resForm.successFalse(responseMessage.EMAIL_ALREADY_EXIST));
  }
  return await adminService.join({ joinUser }, res);
};

const updatePassword = async (req, res) => {
  const updatePasswordUser = req.body;
  if (updatePasswordUser.newPassword !== updatePasswordUser.confirmPassword) {
    return res.status(statusCode.BAD_REQUEST).json(resForm.successFalse(responseMessage.CONFIRM_PW_MISMATCH));
  }

  const admin = await adminService.findUserByIdx(req.params.adminIdx);
  if (!admin) {
    return res.status(statusCode.DB_ERROR).json(resForm.successFalse(responseMessage.DB_ERROR));
  }

  const comparePassword = admin[0].password;
  const isCorrectBeforePassword = await encrypt.comparePassword(updatePasswordUser.beforePassword, comparePassword);

  if (isCorrectBeforePassword === 0) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json(resForm.successFalse(responseMessage.ENCRYPT_ERROR));
  }

  if (isCorrectBeforePassword === false) {
    return res.status(statusCode.BAD_REQUEST).json(resForm.successFalse(responseMessage.PW_MISMATCH));
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