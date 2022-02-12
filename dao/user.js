const pool = require('./pool');

const getUsers = async () => {
  let connection;
  try {
    connection = await pool.getConnection(async conn => conn);

    const sql = `SELECT user_idx, email, name, kakao_id, is_email_verify, create_at, delete_at FROM user`;
    const [row] = await connection.query(sql);
    return row.length ? row : undefined;
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
    return row[0].count;
  } catch (err) {
    console.log(`===DB Error > ${err}===`);
    throw new Error(err);
  } finally {
    connection.release();
  }
};

module.exports = {
  getUsers,
  getUsersCount,
};
