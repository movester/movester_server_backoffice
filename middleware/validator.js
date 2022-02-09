const { body } = require('express-validator');

const join = [
  body('id')
    .exists()
    .withMessage('아이디를 입력해주세요.')
    .isLength({ min: 4, max: 16 })
    .withMessage('이메일은 최소 4글자부터 최대 16글자까지 가능합니다.'),
  body('name')
    .exists()
    .withMessage('이름 입력해주세요.')
    .isLength({ min: 1, max: 12 })
    .withMessage('이름은 최소 1글자부터 최대 12글자까지 가능합니다.'),
  body('password')
    .exists()
    .withMessage('비밀번호를 입력해주세요.')
    .isLength({ min: 4, max: 20 }) // 개발시 테스트 버전
    .withMessage('비밀번호는 최소 8글자부터 최대 20글자까지 가능합니다.'),
];

const login = [
  body('email').exists().isLength({ min: 4, max: 10 }),
  body('password').exists().isLength({ min: 4, max: 20 }),
];

const updatePassword = [
  body('beforePassword')
    .exists(),
  body('newPassword')
    .exists(),
  body('confirmPassword')
    .exists()
];

module.exports = {
  join,
  login,
  updatePassword,
};
