const pool = require('./pool');

const getUsers = async () => {
  let connection;
  try {
    connection = await pool.getConnection(async conn => conn);

    const sql = `SELECT user_idx AS 'userIdx', email, name, kakao_id AS 'kakaoId', is_email_verify AS 'isEmailVerify', create_at AS 'createAt', delete_at AS 'deleteAt' FROM user`;
    const [row] = await connection.query(sql);
    return row.length ? row : null;
  } catch (err) {
    console.log(`===DB Error > ${err}===`);
    throw new Error(err);
  } finally {
    connection.release();
  }
};

const getUserByIdx = async (idx) => {
  let connection;
  try {
    connection = await pool.getConnection(async conn => conn);

    const sql = `SELECT user_idx AS 'userIdx', email, name, kakao_id AS 'kakaoId', email_verify_key AS 'emailVerifyKey', is_email_verify AS 'isEmailVerify', create_at AS 'createAt', delete_at AS 'deleteAt' FROM user WHERE user_idx = ${idx}`;
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
    return row[0].count;
  } catch (err) {
    console.log(`===DB Error > ${err}===`);
    throw new Error(err);
  } finally {
    connection.release();
  }
};

const getAttendPoint = async (idx) => {
  let connection;
  try {
    connection = await pool.getConnection(async conn => conn);
    // TODO: FIX SQL
    const sql = `SELECT * FROM attend_point WHERE user_idx = ${idx}`;
    const [row] = await connection.query(sql);
    return row.length ? row : null;
  } catch (err) {
    console.log(`===DB Error > ${err}===`);
    throw new Error(err);
  } finally {
    connection.release();
  }
};

const getRecord = async (idx) => {
  let connection;
  try {
    connection = await pool.getConnection(async conn => conn);
    // TODO: FIX SQL
    const sql = `SELECT * FROM user_record WHERE user_idx = ${idx}`;
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
  getUsers,
  getUserByIdx,
  getUsersCount,
  getAttendPoint,
  getRecord
};
