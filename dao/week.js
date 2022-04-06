const pool = require('./pool');

const getWeeks = async () => {
  let conn;

  try {
    conn = await pool.getConnection(async conn => conn);

    const sql = `SELECT week_stretching_idx AS 'weekIdx'
                      , title
                      , is_expose AS 'isExpose'
                      , DATE_FORMAT(create_at,'%Y.%m.%d') AS 'createAt'
                      , admin_idx AS 'adminIdx'
                   FROM week_stretching
               ORDER BY title ASC;`;

    const [row] = await conn.query(sql);

    return row;
  } catch (err) {
    console.error(`=== Week Dao getWeeks Error: ${err} === `);
    throw new Error(err);
  } finally {
    conn.release();
  }
};

const createWeek = async ({ title, mon, tue, wed, thu, fri, sat, sun, adminIdx }) => {
  let conn;
  try {
    conn = await pool.getConnection(async conn => conn);
    const sql = `INSERT
                   INTO week_stretching (title, mon_stretching_idx, tue_stretching_idx, wed_stretching_idx, thu_stretching_idx, fri_stretching_idx, sat_stretching_idx, sun_stretching_idx, admin_idx)
                 VALUES ('${title}', ${mon}, ${tue}, ${wed}, ${thu}, ${fri}, ${sat}, ${sun}, ${adminIdx});`;
    const [row] = await conn.query(sql);
    return row.insertId;
  } catch (err) {
    console.error(`=== Week Dao createWeek Error: ${err.code} === `);
    throw new Error(err.code);
  } finally {
    conn.release();
  }
};

const findWeekByTitle = async title => {
  let conn;
  try {
    conn = await pool.getConnection(async conn => conn);
    const sql = `SELECT week_stretching_idx AS 'weekIdx'
                      , title
                   FROM week_stretching
                  WHERE title = '${title}'`;
    const [row] = await conn.query(sql);
    return row.length ? row[0] : null;
  } catch (err) {
    console.error(`=== Week Dao findWeekByTitle Error: ${err} === `);
    throw new Error(err);
  } finally {
    conn.release();
  }
};

const findWeekByIdx = async idx => {
  let conn;
  try {
    conn = await pool.getConnection(async conn => conn);
    const sql = `SELECT week_stretching_idx AS 'weekIdx'
                      , title
                      , is_expose AS 'isExpose'
                   FROM week_stretching
                  WHERE week_stretching_idx = ${idx}`;
    const [row] = await conn.query(sql);
    return row.length ? row[0] : null;
  } catch (err) {
    console.error(`=== Week Dao findWeekByIdx Error: ${err} === `);
    throw new Error(err);
  } finally {
    conn.release();
  }
};

const deleteWeek = async idx => {
  let conn;

  try {
    conn = await pool.getConnection(async conn => conn);

    const sql = `DELETE
                   FROM week_stretching
                  WHERE week_stretching_idx = ${idx}`;

    const [row] = await conn.query(sql);

    return row.affectedRows;
  } catch (err) {
    console.error(`=== Week Dao deleteWeek Error: ${err} === `);
    throw new Error(err);
  } finally {
    conn.release();
  }
};

const updateWeek = async ({ title, mon, tue, wed, thu, fri, sat, sun, adminIdx, weekIdx }) => {
  let conn;

  try {
    conn = await pool.getConnection(async conn => conn);

    const sql = `UPDATE week_stretching
                    SET title = '${title}'
                      , mon_stretching_idx = ${mon}
                      , tue_stretching_idx = ${tue}
                      , wed_stretching_idx = ${wed}
                      , thu_stretching_idx = ${thu}
                      , fri_stretching_idx = ${fri}
                      , sat_stretching_idx = ${sat}
                      , sun_stretching_idx = ${sun}
                      , admin_idx = ${adminIdx}
                      , create_at = CURRENT_TIMESTAMP()
                  WHERE week_stretching_idx = ${weekIdx}`;

    const [row] = await conn.query(sql);

    return row.affectedRows;
  } catch (err) {
    console.error(`=== Week Dao updateWeek Error: ${err.code} === `);
    throw new Error(err.code);
  } finally {
    conn.release();
  }
};

const getWeek = async weekIdx => {
  let conn;

  try {
    conn = await pool.getConnection(async conn => conn);

    await conn.beginTransaction();

    const getWeekSql = `SELECT week_stretching_idx AS 'weekIdx'
                             , title
                             , admin_idx AS 'adminIdx'
                             , DATE_FORMAT(create_at,'%Y.%m.%d') AS 'createAt'
                             , is_expose AS 'isExpose'
                             , mon_stretching_idx AS 'monIdx'
                             , tue_stretching_idx AS 'tueIdx'
                             , wed_stretching_idx AS 'wedIdx'
                             , thu_stretching_idx AS 'thuIdx'
                             , fri_stretching_idx AS 'friIdx'
                             , sat_stretching_idx AS 'satIdx'
                             , sun_stretching_idx AS 'sunIdx'
                          FROM week_stretching
                         WHERE week_stretching_idx = ${weekIdx}`;

    const [row] = await conn.query(getWeekSql);
    if (!row.length) return null;

    const week = row[0];
    const weekIdxs = [week.tueIdx, week.wedIdx, week.thuIdx, week.friIdx, week.satIdx, week.sunIdx];

    const getStretchingTitleSql = idx => `(SELECT title
                                             FROM stretching
                                            WHERE stretching_idx = ${idx})`;

    const getUnionSql = weekIdxs.reduce(
      (acc, dayIdx) => `${acc} UNION ALL ${getStretchingTitleSql(dayIdx)}`,
      getStretchingTitleSql(week.monIdx)
    );

    const [titles] = await conn.query(getUnionSql);
    week.titles = titles;

    conn.commit();
    return week;
  } catch (err) {
    console.error(`=== Week Dao getWeek Error: ${err} === `);
    throw new Error(err);
  } finally {
    conn.release();
  }
};

const updateExposeWeek = async idx => {
  let conn;

  try {
    conn = await pool.getConnection(async conn => conn);
    await conn.beginTransaction();

    const getExposedSql = `SELECT week_stretching_idx AS 'exposedWeekIdx'
                             FROM week_stretching
                            WHERE is_expose = 1;`;

    const [exposed] = await conn.query(getExposedSql);

    if (exposed.length) {
      const { exposedWeekIdx } = exposed[0];
      const unExposeSql = `UPDATE week_stretching
                              SET is_expose = 0
                            WHERE week_stretching_idx = ${exposedWeekIdx};`;
      await conn.query(unExposeSql);
    }

    const exposeSql = `UPDATE week_stretching
                          SET is_expose = 1
                        WHERE week_stretching_idx = ${idx};`;
    await conn.query(exposeSql);

    conn.commit();
  } catch (err) {
    console.error(`=== Week Dao updateExposeWeek Error: ${err} === `);
    throw new Error(err);
  } finally {
    conn.release();
  }
};

const cancelExposeWeek = async idx => {
  let conn;

  try {
    conn = await pool.getConnection(async conn => conn);

    const sql = `UPDATE week_stretching
                    SET is_expose = 0
                  WHERE week_stretching_idx = ${idx};`;

    const [row] = await conn.query(sql);

    return row.affectedRows;
  } catch (err) {
    console.error(`=== Week Dao cancelExposeWeek Error: ${err} === `);
    throw new Error(err);
  } finally {
    conn.release();
  }
};

const getExposeWeek = async () => {
  let conn;
  try {
    conn = await pool.getConnection(async conn => conn);
    const sql = `SELECT week_stretching_idx AS 'weekIdx'
                      , title
                   FROM week_stretching
                  WHERE is_expose = 1`;
    const [row] = await conn.query(sql);
    return row.length ? row[0] : null;
  } catch (err) {
    console.error(`=== Week Dao getExposeWeek Error: ${err} === `);
    throw new Error(err);
  } finally {
    conn.release();
  }
};

module.exports = {
  getWeeks,
  createWeek,
  findWeekByTitle,
  findWeekByIdx,
  deleteWeek,
  updateWeek,
  getWeek,
  updateExposeWeek,
  cancelExposeWeek,
  getExposeWeek,
};
