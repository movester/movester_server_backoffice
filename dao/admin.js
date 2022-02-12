const pool = require('./pool');

const join = async ({ joinUser }) => {
  let connection;
  try {
    connection = await pool.getConnection(async conn => conn);
    const sql = `INSERT INTO admin (id, password, name, admin_rank, create_at) VALUES ('${joinUser.id}', '${joinUser.password}', '${joinUser.name}', ${joinUser.rank}, now())`;
    const [row] = await connection.query(sql);
    return !!Object.keys(row).length;
  } catch (err) {
    console.log(`===DB Error > ${err}===`);
    throw new Error(err);
  } finally {
    connection.release();
  }
};

const findAdminById = async id => {
  let connection;
  try {
    connection = await pool.getConnection(async conn => conn);
    const sql = `SELECT admin_idx AS 'adminIdx', id, password, name, admin_rank AS 'rank' FROM admin WHERE id = '${id}'`;
    const [row] = await connection.query(sql);
    return row.length ? row[0] : undefined;
  } catch (err) {
    console.log(`===DB Error > ${err}===`);
    throw new Error(err);
  } finally {
    connection.release();
  }
};

const findAdminByName = async name => {
  let connection;
  try {
    connection = await pool.getConnection(async conn => conn);
    const sql = `SELECT admin_idx AS 'adminIdx', id, password, name, admin_rank AS 'rank' FROM admin WHERE name = '${name}'`;
    const [row] = await connection.query(sql);
    return row.length ? row[0] : null;
  } catch (err) {
    console.log(`===DB Error > ${err}===`);
    throw new Error(err);
  } finally {
    connection.release();
  }
};

const findAdminByIdx = async idx => {
  let connection;

  try {
    connection = await pool.getConnection(async conn => conn);
    const sql = `SELECT admin_idx AS 'adminIdx', id, password, name, admin_rank AS 'rank' FROM admin WHERE admin_idx = ${idx}`;
    const [row] = await connection.query(sql);
    return row.length ? row[0] : null;
  } catch (err) {
    console.log(`===DB Error > ${err}===`);
    throw new Error(err);
  } finally {
    connection.release();
  }
};

const updatePassword = async (adminIdx, password) => {
  let connection;
  try {
    connection = await pool.getConnection(async conn => conn);
    const sql = `UPDATE admin SET password = '${password}' WHERE admin_idx = ${adminIdx}`;
    const [row] = await connection.query(sql);
    return !!Object.keys(row);
  } catch (err) {
    console.log(`===DB Error > ${err}===`);
    throw new Error(err);
  } finally {
    connection.release();
  }
};

module.exports = {
  join,
  findAdminById,
  findAdminByName,
  findAdminByIdx,
  updatePassword,
};
