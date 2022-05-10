const { body } = require('express-validator');

const join = [
  body('id')
    .exists()
    .withMessage('아이디를 입력해주세요.')
    .matches(/^[a-zA-Z0-9]{5,10}$/)
    .withMessage('아이디는 영문, 숫자로 조합된 5자리 이상 10자리 이하로 입력해주세요.'),
  body('password')
    .notEmpty()
    .withMessage('비밀번호를 입력해주세요.')
    .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,20}$/)
    .withMessage('비밀번호는 영문, 숫자를 반드시 포함하여 8자리 이상 20자리 이하로 입력해주세요.'),
  body('name')
    .exists()
    .withMessage('이름 입력해주세요.')
    .matches(/^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]{2,8}$/)
    .withMessage('이름은 한글, 영문, 숫자로 조합된 2자리 이상 8자리 이하로 입력해주세요.'),
  body('rank')
    .exists()
    .withMessage('등급을 입력해주세요.')
    .isInt()
    .withMessage('rank 는 숫자로만 이루어져야 합니다.')
    .toInt(),
];

const login = [
  body('id')
    .exists()
    .withMessage('아이디를 입력해주세요.')
    .matches(/^[a-zA-Z0-9]{5,10}$/)
    .withMessage('아이디는 영문, 숫자로 조합된 5자리 이상 10자리 이하로 입력해주세요.'),
  body('password')
    .notEmpty()
    .withMessage('비밀번호를 입력해주세요.')
    .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,20}$/)
    .withMessage('비밀번호는 영문, 숫자를 반드시 포함하여 8자리 이상 20자리 이하로 입력해주세요.'),
];

const updatePassword = [
  body('beforePassword')
    .exists()
    .withMessage('기존 비밀번호를 입력해주세요.')
    .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,20}$/)
    .withMessage('비밀번호는 영문, 숫자를 반드시 포함하여 8자리 이상 20자리 이하로 입력해주세요.'),
  body('newPassword')
    .exists()
    .withMessage('새로운 비밀번호를 입력해주세요.')
    .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,20}$/)
    .withMessage('비밀번호는 영문, 숫자를 반드시 포함하여 8자리 이상 20자리 이하로 입력해주세요.'),
  body('confirmPassword')
    .exists()
    .withMessage('비밀번호 확인값을 입력해주세요.')
    .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,20}$/)
    .withMessage('비밀번호는 영문, 숫자를 반드시 포함하여 8자리 이상 20자리 이하로 입력해주세요.'),
];

module.exports = {
  join,
  login,
  updatePassword,
};
