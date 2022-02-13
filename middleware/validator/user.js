const { query } = require('express-validator');

const getUsersList = [
  query('page').exists().withMessage('page 값이 없습니다.'),
  query('sort')
    .exists()
    .withMessage('sort 값이 없습니다.')
    .isIn(['JOIN', 'ATTEND_POINT'])
    .withMessage('정해진 sort에 없는 값입니다.'),
];

module.exports = {
  getUsersList,
};
