const { query } = require('express-validator');

const getUsersListByCreateAt = [query('page').exists()];

module.exports = {
  getUsersListByCreateAt,
};
