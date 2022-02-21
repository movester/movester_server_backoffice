const pool = require('./pool');

const getCreateIdx = async () => {
  try {
    const connection = await pool.getConnection(async conn => conn);
    try {
      const sql = 'SELECT LAST_INSERT_ID() AS "idx"';
      const [row] = await connection.query(sql);
      connection.release();
      return row;
    } catch (err) {
      console.error(`===DB Error > ${err}===`);
      connection.release();
      return false;
    }
  } catch (err) {
    console.error(`===DB Error > ${err}===`);
    return false;
  }
};

module.exports = {
  getCreateIdx,
};
