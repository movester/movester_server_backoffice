const bcrypt = require('bcrypt');

const saltRounds = 10;

const hashPassword = password =>
  new Promise((resolve, reject) => {
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) reject(err);
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) reject(err);
        resolve(hash);
      });
    });
  });

const comparePassword = async (password, hashPassword) => {
  const result = await bcrypt.compare(password, hashPassword);
  return result;
};

module.exports = {
  hashPassword,
  comparePassword,
};
