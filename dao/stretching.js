const pool = require('./pool');

const createStretching = async (mainPart, subPart, tool, youtubeUrl, title, contents, image, adminIdx) => {
  let connection;
  try {
    connection = await pool.getConnection(async conn => conn);

    const sql = `INSERT INTO stretching (main_part, sub_part, tool, youtube_url, title, contents, image, create_at, admin_idx) VALUES (${mainPart},${subPart},${tool},'${youtubeUrl}','${title}','${contents}','${image}',now(),'${adminIdx}');`;
    const [row] = await connection.query(sql);
    return row.length ? row : null;
  } catch (err) {
    console.log(`===DB Error > ${err}===`);
    throw new Error(err);
  } finally {
    connection.release();
  }
};

const getLastIdx = async () => {
  let connection;
  try {
    connection = await pool.getConnection(async conn => conn);
    // 추후 posture로 수정
    const sql = `SELECT MAX(stretching_idx) AS stretchingIdx FROM stretching;`;
    const [row] = await connection.query(sql);
    return row[0].stretchingIdx;
  } catch (err) {
    console.log(`===DB Error > ${err}===`);
    throw new Error(err);
  } finally {
    connection.release();
  }
};

const createStretchingPosture = async (idx, posture) => {
  let connection;
  try {
    connection = await pool.getConnection(async conn => conn);
    // 추후 posture로 수정
    const sql = `INSERT INTO stretching_posture (stretching_idx, tag) VALUES (${idx},${posture});`;
    const [row] = await connection.query(sql);
    return row.length ? row : null;
  } catch (err) {
    console.log(`===DB Error > ${err}===`);
    throw new Error(err);
  } finally {
    connection.release();
  }
};

const createStretchingEffect = async (idx, effect) => {
  let connection;
  try {
    connection = await pool.getConnection(async conn => conn);
    // 추후 effect로 수정
    const sql = `INSERT INTO stretching_effect (stretching_idx, tag) VALUES (${idx},${effect});`;
    const [row] = await connection.query(sql);
    return row.length ? row : null;
  } catch (err) {
    console.log(`===DB Error > ${err}===`);
    throw new Error(err);
  } finally {
    connection.release();
  }
};

const findStretchingByTitle = async title => {
  let connection;
  try {
    connection = await pool.getConnection(async conn => conn);
    const sql = `SELECT stretching_idx AS 'stretchingIdx', title, main_part AS mainPart, sub_part AS subPart FROM stretching WHERE title = '${title}'`;
    const [row] = await connection.query(sql);
    return row.length ? row[0] : null;
  } catch (err) {
    console.log(`===DB Error > ${err}===`);
    throw new Error(err);
  } finally {
    connection.release();
  }
};

module.exports = {
  createStretching,
  getLastIdx,
  createStretchingPosture,
  createStretchingEffect,
  findStretchingByTitle,
};
