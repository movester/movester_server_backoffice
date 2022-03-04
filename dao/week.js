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

const getExposeWeek = async () => {
  let conn;
  try {
    conn = await pool.getConnection(async conn => conn);
    const sql = `SELECT week_stretching_idx AS 'weekIdx', title
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
  createWeek,
  findWeekByTitle,
  deleteWeek,
  getExposeWeek,
};
