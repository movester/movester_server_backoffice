const pool = require('./pool');

const join = async ({ joinUser }) => {
  let conn;
  try {
    conn = await pool.getConnection(async conn => conn);

    const sql = `INSERT INTO admin (id, password, name, admin_type, create_at)
                 VALUES ('${joinUser.id}', '${joinUser.password}', '${joinUser.name}', ${joinUser.rank}, now())`;

    const [row] = await conn.query(sql);
    return !!Object.keys(row).length;
  } catch (err) {
    console.error(`=== Admin Dao join Error: ${err} === `);
    throw new Error(err);
  } finally {
    conn.release();
  }
};

const findAdminById = async id => {
  let conn;
  try {
    conn = await pool.getConnection(async conn => conn);

    const sql = `SELECT admin_idx AS 'adminIdx', id, password, name, admin_type AS 'rank'
                   FROM admin WHERE id = '${id}'`;

    const [row] = await conn.query(sql);
    return row.length ? row[0] : null;
  } catch (err) {
    console.error(`=== Admin Dao findAdminById Error: ${err} === `);
    throw new Error(err);
  } finally {
    conn.release();
  }
};

const findAdminByName = async name => {
  let conn;
  try {
    conn = await pool.getConnection(async conn => conn);

    const sql = `SELECT admin_idx AS 'adminIdx', id, password, name, admin_type AS 'rank'
                   FROM admin
                  WHERE name = '${name}'`;

    const [row] = await conn.query(sql);
    return row.length ? row[0] : null;
  } catch (err) {
    console.error(`=== Admin Dao findAdminByName Error: ${err} === `);
    throw new Error(err);
  } finally {
    conn.release();
  }
};

const findAdminByIdx = async idx => {
  let conn;

  try {
    conn = await pool.getConnection(async conn => conn);

    const sql = `SELECT admin_idx AS 'adminIdx', id, password, name, admin_type AS 'rank'
                  FROM admin
                 WHERE admin_idx = ${idx}`;

    const [row] = await conn.query(sql);
    return row.length ? row[0] : null;
  } catch (err) {
    console.error(`=== Admin Dao findAdminByIdx Error: ${err} === `);
    throw new Error(err);
  } finally {
    conn.release();
  }
};

const updatePassword = async (adminIdx, password) => {
  let conn;
  try {
    conn = await pool.getConnection(async conn => conn);

    const sql = `UPDATE admin
                    SET password = '${password}'
                  WHERE admin_idx = ${adminIdx}`;

    const [row] = await conn.query(sql);
    return !!Object.keys(row);
  } catch (err) {
    console.error(`=== Admin Dao updatePassword Error: ${err} === `);
    throw new Error(err);
  } finally {
    conn.release();
  }
};

const getAdminsList = async () => {
  let conn;

  try {
    conn = await pool.getConnection(async conn => conn);

    const sql = `SELECT admin_idx AS 'adminIdx', id, name, admin_type AS 'rank', DATE_FORMAT(create_at,'%Y.%m.%d') AS 'createAt'
                   FROM admin
                  ORDER BY create_at desc`;

    const [row] = await conn.query(sql);
    return row;
  } catch (err) {
    console.error(`=== Admin Dao getAdminsList Error: ${err} === `);
    throw new Error(err);
  } finally {
    conn.release();
  }
};

const deleteAdmin = async idx => {
  let conn;

  try {
    conn = await pool.getConnection(async conn => conn);

    const sql = `DELETE
                   FROM admin
                  WHERE admin_idx = ${idx}`;

    const [row] = await conn.query(sql);

    return row;
  } catch (err) {
    console.error(`=== Admin Dao deleteAdmin Error: ${err} === `);
    throw new Error(err);
  } finally {
    conn.release();
  }
};

module.exports = {
  join,
  findAdminById,
  findAdminByName,
  findAdminByIdx,
  updatePassword,
  getAdminsList,
  deleteAdmin,
};
