const { param, query } = require('express-validator');

const getUserInfo = [param('idx').matches(/^\d+$/).withMessage('idx 는 숫자로만 이루어져야 합니다.').toInt()];

const getUsersList = [
  query('page')
    .exists()
    .withMessage('page 값이 없습니다.')
    .isInt()
    .withMessage('idx 는 숫자로만 이루어져야 합니다.')
    .toInt(),
  query('sort')
    .exists()
    .withMessage('sort 값이 없습니다.')
    .isIn(['JOIN', 'ATTEND_POINT'])
    .withMessage('정해진 sort 기준에 없는 값입니다.'),
];

const getUserAttendPoints = [
  param('idx').isInt().withMessage('idx 는 숫자로만 이루어져야 합니다.').toInt(),
  query('year')
    .exists()
    .withMessage('year 값이 없습니다.')
    .isInt()
    .withMessage('year 는 숫자로만 이루어져야 합니다.')
    .toInt(),
];

const getUsersSearch = [
  query('type')
    .exists()
    .withMessage('검색 기준 값이 없습니다.')
    .isIn(['USER_IDX', 'EMAIL', 'NAME'])
    .withMessage('정해진 type 기준에 없는 값입니다.'),
  query('value').exists().withMessage('검색 값이 없습니다.'),
];

module.exports = {
  getUserInfo,
  getUsersList,
  getUserAttendPoints,
  getUsersSearch,
};
