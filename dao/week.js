const pool = require('./pool');

const createWeek = async ({ title, mon, tue, wed, thu, fri, sat, sun, writer }) => {
  let conn;
  try {
    conn = await pool.getConnection(async conn => conn);
    const sql = `INSERT
                   INTO week_stretching (title, mon_stretching_idx, tue_stretching_idx, wed_stretching_idx, thu_stretching_idx, fri_stretching_idx, sat_stretching_idx, sun_stretching_idx, writer)
                 VALUES ('${title}', ${mon}, ${tue}, ${wed}, ${thu}, ${fri}, ${sat}, ${sun}, ${writer});`;
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
    const sql = `SELECT week_stretching_idx AS 'weekIdx', title
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
    const sql = `SELECT week_stretching_idx AS 'weekIdx', title, is_expose AS 'isExpose'
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

module.exports = {
  createWeek,
  findWeekByTitle,
  findWeekByIdx,
  deleteWeek,
  updateExposeWeek,
  cancelExposeWeek,
};
