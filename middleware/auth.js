const jwt = require('../modules/jwt');
const radis = require('../modules/radis');
const CODE = require('../utils/statusCode');
const MSG = require('../utils/responseMessage');
const form = require('../utils/responseForm');

const checkToken = async (req, res, next) => {
  if (!req.cookies.accessToken) {
    return res.status(CODE.UNAUTHORIZED).json(form.fail(MSG.UNAUTHORIZED));
  }

  const accessToken = await jwt.verifyAccessToken(req.cookies.accessToken);
  const refreshToken = await jwt.verifyRefeshToken(req.cookies.refreshToken);

  if (!accessToken) {
    if (!refreshToken) {
      // access 만료 refesh 만료
      return res.status(CODE.UNAUTHORIZED).json(form.fail(MSG.UNAUTHORIZED));
    }
    // access 만료 refesh 유효
    const radisToken = await radis.get(refreshToken.idx);

    if (req.cookies.refreshToken !== radisToken) {
      return res.status(CODE.UNAUTHORIZED).json(form.fail(MSG.TOKEN_INVALID));
    }
    
    const newAccessToken = await jwt.signAccessToken({ idx: refreshToken.idx, email: refreshToken.email });

    res.cookie('accessToken', newAccessToken);
    req.cookies.accessToken = newAccessToken;

    next();
  } else if (!refreshToken) {
    // access 유효 refesh 만료

    const newRefreshToken = await jwt.signRefreshToken({ idx: accessToken.idx, email: accessToken.email });

    radis.set(accessToken.idx, newRefreshToken);
    res.cookie('refreshToken', newRefreshToken);
    req.cookies.refreshToken = newRefreshToken;

    next();
  } else {
    // access 유효 refesh 유효
    req.cookies.idx = accessToken.idx;
    next();
  }
};

module.exports = {
  checkToken,
};
