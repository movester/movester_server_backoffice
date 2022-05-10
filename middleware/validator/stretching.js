const { body, query } = require('express-validator');

const createStretching = [
  body('title')
    .exists()
    .withMessage('title을(를) 입력해주세요.')
    .isLength({ min: 2, max: 20 })
    .withMessage('title은 최소 2글자부터 최대 20글자까지 가능합니다.'),
  body('contents').exists().withMessage('contents을(를) 입력해주세요.'),
  body('mainBody')
    .exists()
    .withMessage('mainBody을(를) 입력해주세요.')
    .isInt()
    .withMessage('mainBody 는 숫자로만 이루어져야 합니다.')
    .toInt(),
  body('subBody')
    .exists()
    .withMessage('subBody을(를) 입력해주세요.')
    .isInt()
    .withMessage('subBody 는 숫자로만 이루어져야 합니다.')
    .toInt(),
  body('tool').exists().withMessage('tool을(를) 입력해주세요.'),
  body('youtubeUrl').exists().withMessage('youtubeUrl을(를) 입력해주세요.'),
  body('image').exists().withMessage('image을(를) 입력해주세요.'),
  body('postures')
    .exists()
    .withMessage('postures을(를) 입력해주세요.')
    .isArray()
    .withMessage('postures 는 배열로만 이루어져야 합니다.'),
  body('effects')
    .exists()
    .withMessage('effects을(를) 입력해주세요.')
    .isArray()
    .withMessage('effects 는 배열로만 이루어져야 합니다.'),
];

const updateStretching = [
  body('stretchingIdx')
    .exists()
    .withMessage('stretchingIdx를 입력해주세요.')
    .isInt()
    .withMessage('stretchingIdx 는 숫자로만 이루어져야 합니다.')
    .toInt(),
  body('title')
    .exists()
    .withMessage('title을(를) 입력해주세요.')
    .isLength({ min: 5, max: 50 })
    .withMessage('title은 최소 5글자부터 최대 50글자까지 가능합니다.'),
  body('contents').exists().withMessage('contents을(를) 입력해주세요.'),
  body('mainBody')
    .exists()
    .withMessage('mainBody을(를) 입력해주세요.')
    .isInt()
    .withMessage('mainBody 는 숫자로만 이루어져야 합니다.')
    .toInt(),
  body('subBody')
    .exists()
    .withMessage('subBody을(를) 입력해주세요.')
    .isInt()
    .withMessage('subBody 는 숫자로만 이루어져야 합니다.')
    .toInt(),
  body('tool').exists().withMessage('tool을(를) 입력해주세요.'),
  body('youtubeUrl').exists().withMessage('youtubeUrl을(를) 입력해주세요.'),
  body('image').exists().withMessage('image을(를) 입력해주세요.'),
];

const getStretchings = [
  query('title', 'title을(를) 입력해주세요.').exists(),
  query('mainCategory', 'mainCategory(를) 입력해주세요.').exists().toInt(),
  query('subCategory', 'subCategory(를) 입력해주세요.').exists().toInt(),
  query('posture', 'posture(를) 입력해주세요.').exists().toInt(),
  query('effect', 'effect(를) 입력해주세요.').exists().toInt(),
  query('tool', 'tool(를) 입력해주세요.').exists().toInt(),
];

module.exports = {
  createStretching,
  updateStretching,
  getStretchings,
};
