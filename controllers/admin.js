const adminService = require('../service/admin');
const CODE = require('../utils/statusCode');
const MSG = require('../utils/responseMessage');
const form = require('../utils/responseForm');
const encrypt = require('../modules/encrypt');
const redis = require('../modules/redis');

const join = async (req, res) => {
  const reqAdmin = await adminService.findAdminByIdx(req.cookies.idx);
  if (!reqAdmin.rank) {
    return res.status(CODE.UNAUTHORIZED).json(form.fail(MSG.SUPER_ADMIN_ONLY));
  }

  const joinAdmin = req.body;
  try {
    const isIdDuplicate = await adminService.findAdminById(joinAdmin.id);
    if (isIdDuplicate) {
      return res.status(CODE.DUPLICATE).json(form.fail(MSG.ID_ALREADY_EXIST));
    }

    const isNameDuplicate = await adminService.findAdminByName(joinAdmin.name);
    if (isNameDuplicate) {
      return res.status(CODE.DUPLICATE).json(form.fail(MSG.NAME_ALREADY_EXIST));
    }
  } catch (err) {
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }

  const isJoin = await adminService.join(joinAdmin);
  if (isJoin === CODE.INTERNAL_SERVER_ERROR) {
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }
  res.status(CODE.CREATED).json(form.success());
};

const login = async (req, res) => {
  const reqAdmin = req.body;
  const loginAdmin = await adminService.login(reqAdmin);

  if (typeof loginAdmin === 'number') {
    if (loginAdmin === CODE.BAD_REQUEST) {
      return res.status(CODE.BAD_REQUEST).json(form.fail(MSG.ID_NOT_EXIST));
    }
    if (loginAdmin === CODE.NOT_FOUND) {
      return res.status(CODE.NOT_FOUND).json(form.fail(MSG.PW_MISMATCH));
    }
    if (loginAdmin === CODE.INTERNAL_SERVER_ERROR) {
      return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
    }
  }

  return res
    .status(CODE.OK)
    .cookie('accessToken', loginAdmin.token.accessToken, { httpOnly: true })
    .cookie('refreshToken', loginAdmin.token.refreshToken, { httpOnly: true })
    .json(form.success(loginAdmin.admin));
};

const logout = async (req, res) => {
  redis.del(req.cookies.idx);
  res.clearCookie('accessToken').clearCookie('refreshToken').status(CODE.OK).json(form.success(MSG.LOGOUT_SUCCESS));
};

const updatePassword = async (req, res) => {
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

  if (!isCorrectBeforePassword) {
    return res.status(CODE.BAD_REQUEST).json(form.fail(MSG.PW_MISMATCH));
  }

  const isUpdatePassword = await adminService.updatePassword(reqAdmin);

  if (isUpdatePassword === CODE.INTERNAL_SERVER_ERROR) {
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }

  return res.status(CODE.OK).json(form.success());
};

const getAdminsList = async (req, res) => {
  const adminsList = await adminService.getAdminsList();

  if (adminsList === CODE.INTERNAL_SERVER_ERROR) {
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }

  return res.status(CODE.OK).json(form.success(adminsList));
};

const deleteAdmin = async (req, res) => {
  try {
    const reqAdmin = await adminService.findAdminByIdx(req.cookies.idx);
    if (!reqAdmin.rank) {
      return res.status(CODE.UNAUTHORIZED).json(form.fail(MSG.SUPER_ADMIN_ONLY));
    }
    const { idx } = req.params;

    const isExistAdminIdx = await adminService.findAdminByIdx(idx);
    if (!isExistAdminIdx) {
      return res.status(CODE.NOT_FOUND).json(form.fail(MSG.IDX_NOT_EXIST));
    }

    const adminsList = await adminService.deleteAdmin(idx);

    if (adminsList === CODE.INTERNAL_SERVER_ERROR) {
      return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
    }

    return res.status(CODE.OK).json(form.success());
  } catch (err) {
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
