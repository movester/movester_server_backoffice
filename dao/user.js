const pool = require('./pool');

const getUserInfo = async (idx) => {
  let connection;
  try {
    connection = await pool.getConnection(async conn => conn);

    const sql = `SELECT user_idx AS 'userIdx', email, name, kakao_id AS 'kakaoId', is_email_verify AS 'isEmailVerify', DATE_FORMAT(create_at,'%Y.%m.%d') AS 'createAt'
                 FROM user
                 WHERE user_idx = ${idx}`;
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

    const sql = `SELECT COUNT(*) AS count
                 FROM user`;
    const [row] = await connection.query(sql);
    return row.length ? row : null;
  } catch (err) {
    console.log(`===DB Error > ${err}===`);
    throw new Error(err);
  } finally {
    connection.release();
  }
};

const getUsersListByCreateAt = async searchStart => {
  let connection;
  try {
    connection = await pool.getConnection(async conn => conn);

    const sql = `SELECT user_idx AS 'userIdx', email, name, DATE_FORMAT(create_at,'%Y.%m.%d') AS 'createAt'
                      , IFNULL((SELECT COUNT(*) * 10
                                  FROM attend_point
                                 WHERE user_idx = user.user_idx
                                   AND attend_year = YEAR(CURDATE())
                                   AND attend_month = MONTH(CURDATE())
                              GROUP BY user_idx, attend_year, attend_month)
                        ,0) AS 'attendPoint'
                FROM user
                ORDER BY create_at DESC
                LIMIT ${searchStart},10`;

    const [row] = await connection.query(sql);

    return row.length ? row : null;
  } catch (err) {
    console.log(`===DB Error > ${err}===`);
    throw new Error(err);
  } finally {
    connection.release();
  }
};

const getUsersListByAttendPoint = async searchStart => {
  let connection;
  try {
    connection = await pool.getConnection(async conn => conn);

    const sql = `SELECT *
                   FROM (SELECT user_idx AS 'userIdx', email, name,  DATE_FORMAT(create_at,'%Y.%m.%d') AS 'createAt'
                           , IFNULL((SELECT COUNT(*) * 10
                                       FROM attend_point
                                      WHERE user_idx = t1.user_idx
                                        AND attend_year = YEAR(CURDATE())
                                        AND attend_month = MONTH(CURDATE())
                                   GROUP BY user_idx, attend_year, attend_month),0) AS attendPoint
                          FROM user t1
                        ) t2
              ORDER BY attendPoint DESC
              LIMIT ${searchStart},10;`;

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

    const sql = `SELECT user_idx AS userIdx, email
                 FROM user
                 WHERE user_idx = ${idx}`;

    const [row] = await connection.query(sql);
    return row.length ? row : null;
  } catch (err) {
    console.log(`===DB Error > ${err}===`);
    throw new Error(err);
  } finally {
    connection.release();
  }
};

const getUserAttendPoint = async (idx, year) => {
  let connection;
  try {
    connection = await pool.getConnection(async conn => conn);

    const sql = `SELECT attend_month AS month, COUNT(*) * 10 AS attendPoint
                   FROM attend_point
                  WHERE user_idx = ${idx}
                    AND attend_year = ${year}
               GROUP BY user_idx, attend_year, attend_month
               ORDER BY month ASC`;

    const [row] = await connection.query(sql);
    return row
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
  getUserInfo,
  getUsersCount,
  getUsersListByCreateAt,
  getUsersListByAttendPoint,
  getUserByIdx,
  getUserAttendPoint,
  getRecord,
};
