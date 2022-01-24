const pool = require('./pool');

const join = async ({ joinUser }) => {
  let connection;
  try {
    connection = await pool.getConnection(async conn => conn);
    const sql = `INSERT INTO admin (email, password, name, create_at) VALUES ('${joinUser.email}', '${joinUser.password}', '${joinUser.name}', now())`;
    const [row] = await connection.query(sql);
    return !!Object.keys(row).length;
  } catch (err) {
    console.log(`===DB Error > ${err}===`);
    throw new Error(err);
  } finally {
    connection.release();
  }
};

const findAdminByEmail = async email => {
  let connection;
  try {
    connection = await pool.getConnection(async conn => conn);
    const sql = `SELECT admin_idx, email, password, name FROM admin WHERE email = '${email}'`;
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
    const sql = `SELECT admin_idx, email, password, name FROM admin WHERE name = '${name}'`;
    const [row] = await connection.query(sql);
    return row.length ? row[0] : undefined;
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
    const sql = `SELECT admin_idx, email, password, name FROM admin WHERE admin_idx = ${idx}`;
    const [row] = await connection.query(sql);
    return row.length ? row[0] : undefined;
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
  findAdminByEmail,
  findAdminByName,
  findAdminByIdx,
  updatePassword,
};
