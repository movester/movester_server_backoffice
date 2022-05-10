const { body } = require('express-validator');

const createWeek = [
  body('title')
    .exists()
    .withMessage('title을(를) 입력해주세요.')
    .isLength({ min: 2, max: 20 })
    .withMessage('title은 최소 2글자부터 최대 20글자까지 가능합니다.'),
  body('week', 'week 는 숫자로만 이루어진 길이가 7인 배열이어야 합니다.')
    .isArray({ min: 7, max: 7 })
    .custom(v => v.every(e => e > 0)),
];

const updateWeek = [
  body('weekIdx')
    .exists()
    .withMessage('weekIdx 값이 없습니다.')
    .isInt()
    .withMessage('idx 는 숫자로만 이루어져야 합니다.')
    .toInt(),
  body('title')
    .exists()
    .withMessage('title을(를) 입력해주세요.')
    .isLength({ min: 2, max: 20 })
    .withMessage('title은 최소 5글자부터 최대 20글자까지 가능합니다.'),
  body('week', 'week 는 숫자로만 이루어진 길이가 7인 배열이어야 합니다.')
    .isArray({ min: 7, max: 7 })
    .custom(v => v.every(e => e > 0)),
];

const checkBodyIdx = [body('weekIdx').isInt().withMessage('idx 는 숫자로만 이루어져야 합니다.').toInt()];

module.exports = {
  createWeek,
  updateWeek,
  checkBodyIdx
};
