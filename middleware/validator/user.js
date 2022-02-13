const { param, query } = require('express-validator');

const getUserInfo = [param('idx').matches(/^\d+$/).withMessage('idx 는 숫자로만 이루어져야 합니다.').toInt()];

const getUsersList = [
  query('page')
    .exists()
    .withMessage('page 값이 없습니다.')
    .matches(/^\d+$/)
    .withMessage('idx 는 숫자로만 이루어져야 합니다.')
    .toInt(),
  query('sort')
    .exists()
    .withMessage('sort 값이 없습니다.')
    .isIn(['JOIN', 'ATTEND_POINT'])
    .withMessage('정해진 sort 기준에 없는 값입니다.'),
];

const getUserAttendPoint = [
  param('idx').matches(/^\d+$/).withMessage('idx 는 숫자로만 이루어져야 합니다.').toInt(),
  query('year')
    .exists()
    .withMessage('year 값이 없습니다.')
    .matches(/^\d+$/)
    .withMessage('year 는 숫자로만 이루어져야 합니다.')
    .toInt(),
];

module.exports = {
  getUserInfo,
  getUsersList,
  getUserAttendPoint
};
