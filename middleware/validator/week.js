const { body } = require('express-validator');

const createWeek = [
  body('title')
    .exists()
    .withMessage('title을(를) 입력해주세요.')
    .isLength({ min: 5, max: 20 })
    .withMessage('title은 최소 5글자부터 최대 20글자까지 가능합니다.'),
  body('week', 'week 는 숫자로만 이루어진 길이가 7인 배열이어야 합니다.')
    .isArray({ min: 7, max: 7 })
    .custom(v => v.every(e => e > 0)),
];

module.exports = {
  createWeek,
};
