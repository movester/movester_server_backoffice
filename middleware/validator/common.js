const { param } = require('express-validator');

const checkIdx = [param('idx').isInt().withMessage('idx 는 숫자로만 이루어져야 합니다.').toInt()];

module.exports = {
  checkIdx,
};
