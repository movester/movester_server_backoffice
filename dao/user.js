const pool = require('./pool');

const getUserInfo = async idx => {
  let conn;
  try {
    conn = await pool.getConnection(async conn => conn);

    const sql = `SELECT user_idx AS 'userIdx'
                      , email
                      , name
                      , kakao_id AS 'kakaoId'
                      , is_email_auth AS 'isEmailAuth'
                      , DATE_FORMAT(create_at,'%Y.%m.%d') AS 'createAt'
                      , DATE_FORMAT(delete_at,'%Y.%m.%d') AS 'deleteAt'
                   FROM user
                  WHERE user_idx = ${idx}`;
    const [row] = await conn.query(sql);
    return row.length ? row : null;
  } catch (err) {
    console.error(`=== User Dao getUserInfo Error: ${err} === `);
    throw new Error(err);
  } finally {
    conn.release();
  }
};

const getUsersCount = async () => {
  let conn;
  try {
    conn = await pool.getConnection(async conn => conn);

    const sql = `SELECT COUNT(*) AS count
                   FROM user
                  WHERE delete_at IS NULL`;
    const [row] = await conn.query(sql);
    return row.length ? row : null;
  } catch (err) {
    console.error(`=== User Dao getUsersCount Error: ${err} === `);
    throw new Error(err);
  } finally {
    conn.release();
  }
};

const getUsersListByCreateAt = async searchStart => {
  let conn;
  try {
    conn = await pool.getConnection(async conn => conn);

    const sql = `SELECT user_idx AS 'userIdx'
                      , email
                      , name
                      , DATE_FORMAT(create_at,'%Y.%m.%d') AS 'createAt'
                      , (SELECT COUNT(*)
                                  FROM attend_point
                                 WHERE user_idx = user.user_idx
                                   AND attend_year = YEAR(CURDATE())
                                   AND attend_month = MONTH(CURDATE())
                              GROUP BY user_idx, attend_year, attend_month
                        ) AS 'attendPoint'
                  FROM user
                 WHERE delete_at IS NULL
                 ORDER BY create_at DESC
                 LIMIT ${searchStart},10`;

    const [row] = await conn.query(sql);
    return row.length ? row : null;
  } catch (err) {
    console.error(`=== User Dao getUsersListByCreateAt Error: ${err} === `);
    throw new Error(err);
  } finally {
    conn.release();
  }
};

const getUsersListByAttendPoint = async searchStart => {
  let conn;
  try {
    conn = await pool.getConnection(async conn => conn);

    const sql = `SELECT *
                   FROM (SELECT user_idx AS 'userIdx'
                              , email
                              , name
                              , DATE_FORMAT(create_at,'%Y.%m.%d') AS 'createAt'
                           , (SELECT COUNT(*)
                                       FROM attend_point
                                      WHERE user_idx = user.user_idx
                                        AND attend_year = YEAR(CURDATE())
                                        AND attend_month = MONTH(CURDATE())
                                   GROUP BY user_idx, attend_year, attend_month
                              ) AS attendPoint
                          FROM user
                         WHERE delete_at IS NULL
                        ) userAttendPoint
              ORDER BY attendPoint DESC
                 LIMIT ${searchStart},10;`;

    const [row] = await conn.query(sql);

    return row.length ? row : null;
  } catch (err) {
    console.error(`=== User Dao getUsersListByAttendPoint Error: ${err} === `);
    throw new Error(err);
  } finally {
    conn.release();
  }
};

const getUserByIdx = async idx => {
  let conn;
  try {
    conn = await pool.getConnection(async conn => conn);

    const sql = `SELECT user_idx AS userIdx
                      , email
                   FROM user
                  WHERE user_idx = ${idx}`;

    const [row] = await conn.query(sql);
    return row.length ? row : null;
  } catch (err) {
    console.error(`=== User Dao getUserByIdx Error: ${err} === `);
    throw new Error(err);
  } finally {
    conn.release();
  }
};

const getUserAttendPoints = async (idx, year) => {
  let conn;
  try {
    conn = await pool.getConnection(async conn => conn);

    const sql = `SELECT attend_month AS month
                      , COUNT(*) * 10 AS attendPoint
                   FROM attend_point
                  WHERE user_idx = ${idx}
                    AND attend_year = ${year}
               GROUP BY user_idx, attend_year, attend_month
               ORDER BY month ASC`;

    const [row] = await conn.query(sql);
    return row;
  } catch (err) {
    console.error(`=== User Dao getUserAttendPoints Error: ${err} === `);
    throw new Error(err);
  } finally {
    conn.release();
  }
};

const getUserRecords = async (idx, year) => {
  let conn;
  try {
    conn = await pool.getConnection(async conn => conn);

    const sql = `SELECT record_month AS month
                      ,
                     (SELECT record
                        FROM user_record
                       WHERE record_type = 1
                         AND user_idx = ${idx}
                         AND create_at =
                                        (SELECT max(create_at)
                                           FROM user_record
                                          WHERE user_idx = ${idx}
                                            AND record_year = ${year}
                                            AND record_type = 1
                                            AND record_month = recordByMonth.record_month
                                       GROUP BY record_month)
                     ) AS shoulder,
                      (SELECT record
                       FROM user_record
                      WHERE record_type = 2
                        AND user_idx = ${idx}
                        AND create_at =
                                        (SELECT max(create_at)
                                           FROM user_record
                                          WHERE user_idx = ${idx}
                                            AND record_year = ${year}
                                            AND record_type = 2
                                            AND record_month = recordByMonth.record_month
                                       GROUP BY record_month)
                      ) AS leg
                 FROM user_record recordByMonth
                WHERE user_idx = ${idx}
                  AND record_year = ${year}
             GROUP BY record_month`;

    const [row] = await conn.query(sql);

    return row;
  } catch (err) {
    console.error(`=== User Dao getUserRecords Error: ${err} === `);
    throw new Error(err);
  } finally {
    conn.release();
  }
};

const getUsersSearch = async (type, value) => {
  let conn;

  try {
    conn = await pool.getConnection(async conn => conn);

    const sql = `SELECT user_idx AS 'userIdx'
                      , email
                      , name
                      , DATE_FORMAT(create_at,'%Y.%m.%d') AS 'createAt'
                        , (SELECT COUNT(*)
                             FROM attend_point
                            WHERE user_idx = user.user_idx
                              AND attend_year = YEAR(CURDATE())
                              AND attend_month = MONTH(CURDATE())
                         GROUP BY user_idx, attend_year, attend_month
                       ) AS 'attendPoint'
                   FROM user
                  WHERE ${type} LIKE '%${value}%'
               ORDER BY create_at DESC;`;

    const [row] = await conn.query(sql);

    return row;
  } catch (err) {
    console.error(`=== User Dao getUsersSearch Error: ${err} === `);
    throw new Error(err);
  } finally {
    conn.release();
  }
};

module.exports = {
  getUserInfo,
  getUsersCount,
  getUsersListByCreateAt,
  getUsersListByAttendPoint,
  getUserByIdx,
  getUserAttendPoints,
  getUserRecords,
  getUsersSearch,
};
