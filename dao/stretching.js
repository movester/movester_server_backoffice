const pool = require('./pool');
const { getArrayQuery } = require('../utils/sql');

const createStretching = async ({
  title,
  contents,
  mainBody,
  subBody,
  tool,
  youtubeUrl,
  image,
  adminIdx,
  postures,
  effects,
}) => {
  let conn;
  try {
    conn = await pool.getConnection(async conn => conn);
    await conn.beginTransaction();

    const insertStretching = `INSERT
                                INTO stretching (title, contents, main_body, sub_body, tool, youtube_url, image, writer)
                              VALUES ('${title}', '${contents}', ${mainBody}, ${subBody}, ${tool}, '${youtubeUrl}', '${image}', ${adminIdx});`;
    const [insertRow] = await conn.query(insertStretching);

    const stretchingIdx = insertRow.insertId;

    const effectSql = `INSERT
                         INTO stretching_effect (stretching_idx, effect_type)
                       VALUES`;
    const insertEffects = getArrayQuery(effectSql, stretchingIdx, effects);
    await conn.query(insertEffects);

    const postureSql = `INSERT
                          INTO stretching_posture (stretching_idx, posture_type)
                        VALUES`;
    const insertPostures = getArrayQuery(postureSql, stretchingIdx, postures);
    await conn.query(insertPostures);

    conn.commit();
    return stretchingIdx;
  } catch (err) {
    console.error(`=== Stretching Dao createStretching Error: ${err} === `);
    conn.rollback();
    throw new Error(err);
  } finally {
    conn.release();
  }
};

const findStretchingByTitle = async title => {
  let conn;
  try {
    conn = await pool.getConnection(async conn => conn);
    const sql = `SELECT stretching_idx AS 'stretchingIdx', title, main_body AS mainBody, sub_body AS subBody
                   FROM stretching
                  WHERE title = '${title}'`;
    const [row] = await conn.query(sql);
    return row.length ? row[0] : null;
  } catch (err) {
    console.error(`=== Stretching Dao findStretchingByTitle Error: ${err} === `);
    throw new Error(err);
  } finally {
    conn.release();
  }
};

const findStretchingByIdx = async stretchingIdx => {
  let conn;
  try {
    conn = await pool.getConnection(async conn => conn);
    const sql = `SELECT stretching_idx AS 'stretchingIdx', title, main_body AS 'mainBody', sub_body AS 'subBody'
                   FROM stretching
                  WHERE stretching_idx = ${stretchingIdx}`;
    const [row] = await conn.query(sql);
    return row.length ? row[0] : null;
  } catch (err) {
    console.error(`=== Stretching Dao findStretchingByIdx Error: ${err} === `);
    throw new Error(err);
  } finally {
    conn.release();
  }
};

const deleteStretching = async idx => {
  let conn;

  try {
    conn = await pool.getConnection(async conn => conn);

    const sql = `DELETE
                   FROM stretching
                  WHERE stretching_idx = ${idx}`;

    const [row] = await conn.query(sql);

    return row.affectedRows;
  } catch (err) {
    console.error(`=== Stretching Dao deleteStretching Error: ${err} === `);
    throw new Error(err);
  } finally {
    conn.release();
  }
};

const getDetailStretching = async stretchingIdx => {
  let conn;
  try {
    conn = await pool.getConnection(async conn => conn);
    await conn.beginTransaction();

    const stretchingSql = `SELECT stretching_idx AS 'stretchingIdx', title, contents, main_body AS mainBody, sub_body AS subBody, tool, youtube_url, image, writer, DATE_FORMAT(create_at,'%Y.%m.%d') AS 'createAt'
                   FROM stretching
                  WHERE stretching_idx = ${stretchingIdx}`;
    const [stretching] = await conn.query(stretchingSql);

    if (!stretching.length) return null;

    const effectSql = ` SELECT stretching_idx AS 'stretchingIdx', effect_type AS effect
                          FROM stretching_effect
                         WHERE stretching_idx = ${stretchingIdx}`;
    const [effect] = await conn.query(effectSql);

    const postureSql = ` SELECT stretching_idx AS 'stretchingIdx', posture_type AS posture
                           FROM stretching_posture
                          WHERE stretching_idx = ${stretchingIdx}`;
    const [posture] = await conn.query(postureSql);

    return {
      stretching: stretching[0],
      effect,
      posture,
    };
  } catch (err) {
    console.error(`=== Stretching Dao getDetailStretching Error: ${err} === `);
    throw new Error(err);
  } finally {
    conn.release();
  }
};

module.exports = {
  createStretching,
  findStretchingByTitle,
  findStretchingByIdx,
  deleteStretching,
  getDetailStretching,
};
