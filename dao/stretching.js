const pool = require('./pool');


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

    const getInsertPostureSql = posture => `INSERT
                                              INTO stretching_posture (stretching_idx, posture_type)
                                            VALUES (${stretchingIdx}, ${posture});`;

    // TODO : 비동기 에러 처리
    postures.forEach(async posture => {
      await conn.query(getInsertPostureSql(posture));
    });

    const getInsertEffectSql = effect => `INSERT
                                            INTO stretching_effect (stretching_idx, effect_type)
                                          VALUES (${stretchingIdx}, ${effect});`;

    // TODO : 비동기 에러 처리
    effects.forEach(async effect => {
      await conn.query(getInsertEffectSql(effect));
    });

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
    const sql = `SELECT stretching_idx AS 'stretchingIdx', title, main_body AS mainBody, sub_body AS subBody FROM stretching WHERE title = '${title}'`;
    const [row] = await conn.query(sql);
    return row.length ? row[0] : null;
  } catch (err) {
    console.error(`=== Stretching Dao findStretchingByTitle Error: ${err} === `);
    throw new Error(err);
  } finally {
    conn.release();
  }
};

module.exports = {
  createStretching,
  findStretchingByTitle,
};
