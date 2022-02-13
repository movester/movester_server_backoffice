const { body } = require('express-validator');

const join = [
  body('id')
    .exists()
    .withMessage('아이디를 입력해주세요.')
    .isLength({ min: 5, max: 10 })
    .withMessage('아이디는 최소 5글자부터 최대 10글자까지 가능합니다.'),
  body('password')
    .exists()
    .withMessage('비밀번호를 입력해주세요.')
    .isLength({ min: 5, max: 20 })
    .withMessage('비밀번호는 최소 5글자부터 최대 20글자까지 가능합니다.'),
  body('name')
    .exists()
    .withMessage('이름 입력해주세요.')
    .isLength({ min: 2, max: 12 })
    .withMessage('이름은 최소 2글자부터 최대 12글자까지 가능합니다.'),
  body('rank')
    .exists()
    .withMessage('등급을 입력해주세요.')
    .matches(/^\d+$/)
    .withMessage('rank 는 숫자로만 이루어져야 합니다.')
    .toInt(),
];

const login = [
  body('id')
    .exists()
    .withMessage('아이디를 입력해주세요.')
    .isLength({ min: 5, max: 10 })
    .withMessage('아이디는 최소 5글자부터 최대 10글자까지 가능합니다.'),
  body('password')
    .exists()
    .withMessage('비밀번호를 입력해주세요.')
    .isLength({ min: 5, max: 20 })
    .withMessage('비밀번호는 최소 5글자부터 최대 20글자까지 가능합니다.'),
];

const updatePassword = [
  body('beforePassword')
    .exists()
    .withMessage('기존 비밀번호를 입력해주세요.')
    .isLength({ min: 5, max: 20 })
    .withMessage('비밀번호는 최소 5글자부터 최대 20글자까지 가능합니다.'),
  body('newPassword')
    .exists()
    .withMessage('새로운 비밀번호를 입력해주세요.')
    .isLength({ min: 5, max: 20 })
    .withMessage('비밀번호는 최소 5글자부터 최대 20글자까지 가능합니다.'),
  body('confirmPassword')
    .exists()
    .withMessage('비밀번호 확인값을 입력해주세요.')
    .isLength({ min: 5, max: 20 })
    .withMessage('비밀번호는 최소 5글자부터 최대 20글자까지 가능합니다.'),
];

module.exports = {
  join,
  login,
  updatePassword,
};
