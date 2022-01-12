const jwt = require('../modules/jwt');
const redisClient = require('../config/redis');
const CODE = require('../utils/statusCode');
const MSG = require('../utils/responseMessage');
const form = require('../utils/responseForm');

const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

const verifyToken = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) res.status(CODE.UNAUTHORIZED).json(form.fail(MSG.TOKEN_EMPTY));
    const decode = await jwt.verify(token);

    if (decode === TOKEN_EXPIRED) return res.status(CODE.UNAUTHORIZED).json(form.fail(MSG.EXPIRED_TOKEN));

    if (decode === TOKEN_INVALID) return res.status(CODE.UNAUTHORIZED).json(form.fail(MSG.INVALID_TOKEN));

    if (!decode.idx) return res.json(form.fail(MSG.INVALID_TOKEN));

    req.idx = decode.idx;
    next();
  } catch (err) {
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }
};

const verifyRefreshToken = (req, res, next) => {
  const refreshToken = req.body.token;
  if (!refreshToken) {
    return res.status(CODE.BAD_REQUEST).json(form.fail(MSG.VALUE_NULL));
  }
  try {
    const decodeRefreshToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    req.decodeRefreshToken = decodeRefreshToken;

    redisClient.get(decodeRefreshToken.sub.toString(), (err, data) => {
      if (err) throw err;

      if (!data) {
        return res.status(CODE.BAD_REQUEST).json(form.fail(MSG.TOKEN_EMPTY));
      }
      if (JSON.parse(data).token !== refreshToken) {
        return res.status(CODE.BAD_REQUEST).json(form.fail(MSG.TOKEN_INVALID));
      }
      next();
    });
  } catch (err) {
    console.log(`verifyRefreshToken > ${err}`);
    res.status(CODE.BAD_REQUEST).json(form.fail(MSG.TOKEN_INVALID));
  }
};

// TODO : fix
const generateRefreshToken = email => {
  const refreshToken = jwt.sign({ sub: email, secret: 'movester' }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_TIME,
  });

  redisClient.get(email.toString(), (err, data) => {
    if (err) throw err;
    console.log(data);
    redisClient.set(email.toString(), JSON.stringify({ token: refreshToken }));
  });

  return refreshToken;
};

module.exports = {
  verifyToken,
  verifyRefreshToken,
  generateRefreshToken,
};
