const pool = require('./pool');

const getUserInfo = async (idx) => {
  let connection;
  try {
    connection = await pool.getConnection(async conn => conn);

    const sql = `SELECT user_idx AS 'userIdx', email, name, kakao_id AS 'kakaoId', is_email_verify AS 'isEmailVerify', create_at AS 'createAt' FROM user WHERE user_idx = ${idx}`;
    const [row] = await connection.query(sql);
    return row.length ? row : null;
  } catch (err) {
    console.log(`===DB Error > ${err}===`);
    throw new Error(err);
  } finally {
    connection.release();
  }
};

const getUsersCount = async () => {
  let connection;
  try {
    connection = await pool.getConnection(async conn => conn);

    const sql = `SELECT COUNT(*) AS count FROM user`;
    const [row] = await connection.query(sql);
    return row.length ? row : null;
  } catch (err) {
    console.log(`===DB Error > ${err}===`);
    throw new Error(err);
  } finally {
    connection.release();
  }
};

module.exports = {
  getUserInfo,
  getUsersCount,
};
