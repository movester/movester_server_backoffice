const jwt = require('../modules/jwt');
const redis = require('../modules/redis');
const adminService = require('../service/admin')
const CODE = require('../utils/statusCode');
const MSG = require('../utils/responseMessage');
const form = require('../utils/responseForm');

const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

const checkToken = async (req, res, next) => {
  if (!req.cookies.accessToken) {
    return res.status(CODE.UNAUTHORIZED).json(form.fail(MSG.UNAUTHORIZED));
  }

  const accessToken = await jwt.verifyAccessToken(req.cookies.accessToken);
  const refreshToken = await jwt.verifyRefeshToken(req.cookies.refreshToken);

  if (accessToken === TOKEN_INVALID || refreshToken === TOKEN_INVALID) {
    return res.status(CODE.UNAUTHORIZED).json(form.fail(MSG.UNAUTHORIZED));
  }
  if (accessToken === TOKEN_EXPIRED) {
    if (refreshToken === TOKEN_EXPIRED) {
      // access 만료 refesh 만료
      return res.status(CODE.UNAUTHORIZED).json(form.fail(MSG.UNAUTHORIZED));
    }
    // access 만료 refesh 유효
    const redisToken = await redis.get(refreshToken.idx);

    if (req.cookies.refreshToken !== redisToken) {
      return res.status(CODE.UNAUTHORIZED).json(form.fail(MSG.TOKEN_INVALID));
    }

    const newAccessToken = await jwt.signAccessToken({ idx: refreshToken.idx, email: refreshToken.email });

    res.cookie('accessToken', newAccessToken);
    req.cookies.accessToken = newAccessToken;
    req.cookies.userIdx = refreshToken.idx;

    next();
  } else if (refreshToken === TOKEN_EXPIRED) {
    // access 유효 refesh 만료

    const newRefreshToken = await jwt.signRefreshToken({ idx: accessToken.idx, email: accessToken.email });

    redis.set(accessToken.idx, newRefreshToken);
    res.cookie('refreshToken', newRefreshToken);
    req.cookies.refreshToken = newRefreshToken;
    req.cookies.userIdx = accessToken.idx;

    next();
  } else {
    // access 유효 refesh 유효
    req.cookies.idx = accessToken.idx;
    next();
  }
};

const checkSuperAdmin = async (req, res, next) => {
  try {
    const admin = await adminService.findAdminByIdx(req.cookies.idx);
    if (!admin.rank) {
      return res.status(CODE.UNAUTHORIZED).json(form.fail(MSG.SUPER_ADMIN_ONLY));
    }
  } catch (err) {
    console.error(`===Auth Middleware Error > ${err}===`);
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }

  next();
};

const checkReadOnlyAdmin = async (req, res, next) => {
  try {
    const admin = await adminService.findAdminByIdx(req.cookies.idx);
    if (admin.rank===2) {
      return res.status(CODE.UNAUTHORIZED).json(form.fail(MSG.UNAUTHORIZED));
    }
  } catch (err) {
    console.error(`===Auth Middleware Error > ${err}===`);
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }

  next();
};

module.exports = {
  checkToken,
  checkSuperAdmin,
  checkReadOnlyAdmin
};
