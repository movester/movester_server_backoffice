const jwt = require('../modules/jwt');
const redisClient = require('../config/redis');
const CODE = require('../utils/statusCode');
const MSG = require('../utils/responseMessage');
const form = require('../utils/responseForm');

const checkToken = async (req, res, next) => {
  if (req.cookies.accessToken === undefined) {
    console.log('쿠키 없음!');
    res.status(CODE.UNAUTHORIZED).json(form.fail(MSG.TOKEN_EMPTY));
  }

  const accessToken = await jwt.verifyAccessToken(req.cookies.accessToken);
  const refreshToken = await jwt.verifyRefeshToken(req.cookies.refreshToken);

  console.log(accessToken, refreshToken);

  if (accessToken === undefined) {
    if (refreshToken === undefined) {
      // access X refesh X
      console.log('access refesh 모두 만료');
      return res.status(CODE.UNAUTHORIZED).json(form.fail('권한 없음!'));
    }
    // access X refesh O
    console.log('access 만료 refresh 유효');
    // db에서 payload에 담을 데이터 가져오기
    const newAccessToken = await jwt.signAccessToken({ idx: refreshToken.idx, email: refreshToken.email });
    console.log('newAccessToken', newAccessToken);
    res.cookie('accessToken', newAccessToken);
    req.cookies.accessToken = newAccessToken;
    next();
  } else if (refreshToken === undefined) {
    // access O refesh X
    console.log('access 유효 refesh 만료');
    const newRefreshToken = await jwt.signRefreshToken({ idx: accessToken.idx, email: accessToken.email });
    // db에 새로 발급된 refresh token 삽입
    console.log('newRefreshToken', newRefreshToken);
    res.cookie('refreshToken', newRefreshToken);
    req.cookies.refreshToken = newRefreshToken;
    next();
  } else {
    // access O refesh O
    console.log('access/refresh 둘다 유효!');
    next();
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
  checkToken,
  verifyRefreshToken,
  generateRefreshToken,
};
