const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const MSG = require('../utils/responseMessage');

const sign = async user => ({
  accessToken: jwt.sign(user, jwtConfig.secretKey, jwtConfig.option),
  refreshToken: jwt.sign(user, jwtConfig.refeshSecretKey, jwtConfig.refeshOption)
});

const verify = async token => {
  try {
    return jwt.verify(token, jwtConfig.secretKey);
  } catch (err) {
    if (err.message === 'jwt expired') {
      console.log('expired token');
      return MSG.TOKEN_EXPIRED;
    }
    console.log('invalid token');
    return MSG.TOKEN_INVALID;
  }
};

module.exports = {
  sign,
  verify,
};
