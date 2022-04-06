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
<<<<<<< HEAD
                                INTO stretching (title, contents, main_body, sub_body, tool, youtube_url, image, admin_idx AS 'adminIdx')
=======
                                INTO stretching (title, contents, main_body, sub_body, tool, youtube_url, image, admin_idx)
>>>>>>> origin/fix/82_작성자_스키마_변경_대응
                              VALUES ('${title}', '${contents}', ${mainBody}, ${subBody}, ${tool}, '${youtubeUrl}', '${image}', ${adminIdx});`;
    const [insertRow] = await conn.query(insertStretching);

    const stretchingIdx = insertRow.insertId;

    if (effects.length) {
      const effectSql = `INSERT
                           INTO stretching_effect (stretching_idx, effect_type)
                         VALUES`;
      const insertEffects = getArrayQuery(effectSql, stretchingIdx, effects);
      await conn.query(insertEffects);
    }

    if (postures.length) {
      const postureSql = `INSERT
                            INTO stretching_posture (stretching_idx, posture_type)
                          VALUES`;
      const insertPostures = getArrayQuery(postureSql, stretchingIdx, postures);
      await conn.query(insertPostures);
    }

    conn.commit();
    return stretchingIdx;
  } catch (err) {
    console.error(`=== Stretching Dao createStretching Error: ${err} === `);
    conn.rollback();
    throw new Error(err.code);
  } finally {
    conn.release();
  }
};

const findStretchingByTitle = async title => {
  let conn;
  try {
    conn = await pool.getConnection(async conn => conn);
    const sql = `SELECT stretching_idx AS 'stretchingIdx'
                      , title
                      , main_body AS mainBody
                      , sub_body AS subBody
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
    const sql = `SELECT stretching_idx AS 'stretchingIdx'
                      , title
                      , main_body AS 'mainBody'
                      , sub_body AS 'subBody'
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

<<<<<<< HEAD
    const stretchingSql = `SELECT a.stretching_idx AS 'stretchingIdx'
                                , a.title
                                , a.contents
                                , a.main_body AS mainBody
                                , a.sub_body AS subBody
                                , a.tool
                                , a.youtube_url
                                , a.image
                                , a.admin_idx AS 'adminIdx'
                                , DATE_FORMAT(a.create_at,'%Y.%m.%d') AS 'createAt'
                                , (SELECT AVG(b.difficulty)
                                     FROM stretching_difficulty b
                                    WHERE a.stretching_idx = b.stretching_idx
                                  ) AS 'difficulty'
                             FROM stretching a
=======
    const stretchingSql = `SELECT stretching_idx AS 'stretchingIdx'
                                , title
                                , contents
                                , main_body AS mainBody
                                , sub_body AS subBody
                                , tool
                                , youtube_url
                                , image
                                , admin_idx AS adminIdx
                                , DATE_FORMAT(create_at,'%Y.%m.%d') AS 'createAt'
                             FROM stretching
>>>>>>> origin/fix/82_작성자_스키마_변경_대응
                            WHERE stretching_idx = ${stretchingIdx}`;
    const [stretching] = await conn.query(stretchingSql);

    if (!stretching.length) return null;

<<<<<<< HEAD
    const effectSql = ` SELECT effect_type AS effect
=======
    const effectSql = ` SELECT stretching_idx AS 'stretchingIdx'
                             , effect_type AS effect
>>>>>>> origin/fix/82_작성자_스키마_변경_대응
                          FROM stretching_effect
                         WHERE stretching_idx = ${stretchingIdx}`;
    const [effect] = await conn.query(effectSql);

<<<<<<< HEAD
    const postureSql = ` SELECT posture_type AS posture
=======
    const postureSql = ` SELECT stretching_idx AS 'stretchingIdx'
                              , posture_type AS posture
>>>>>>> origin/fix/82_작성자_스키마_변경_대응
                           FROM stretching_posture
                          WHERE stretching_idx = ${stretchingIdx}`;
    const [posture] = await conn.query(postureSql);

    return {
      ...stretching[0],
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

const updateStretching = async stretching => {
  let conn;

  try {
    conn = await pool.getConnection(async conn => conn);

    await conn.beginTransaction();

    const updateStretching = `UPDATE stretching
                                 SET title = '${stretching.title}'
                                   , contents = '${stretching.contents}'
                                   , main_body = ${stretching.mainBody}
                                   , sub_body = ${stretching.subBody}
                                   , tool = ${stretching.tool}
                                   , youtube_url = '${stretching.youtubeUrl}'
                                   , image = '${stretching.image}'
<<<<<<< HEAD
                                   , admin_idx AS 'adminIdx' = ${stretching.adminIdx}
=======
                                   , admin_idx = ${stretching.adminIdx}
>>>>>>> origin/fix/82_작성자_스키마_변경_대응
                               WHERE stretching_idx = ${stretching.stretchingIdx}`;
    const [updateRow] = await conn.query(updateStretching);

    const isEffect = Object.keys(stretching).includes('effects');
    if (isEffect) {
      const deleteEffect = `DELETE
                              FROM stretching_effect
                             WHERE stretching_idx = ${stretching.stretchingIdx};`;
      await conn.query(deleteEffect);

      const insertEffectSql = `INSERT
                                 INTO stretching_effect (stretching_idx, effect_type)
                               VALUES`;
      const insertEffects = getArrayQuery(insertEffectSql, stretching.stretchingIdx, stretching.effects);
      await conn.query(insertEffects);
    }

    const isPosture = Object.keys(stretching).includes('postures');
    if (isPosture) {
      const deletePosture = `DELETE
                               FROM stretching_posture
                              WHERE stretching_idx = ${stretching.stretchingIdx};`;
      await conn.query(deletePosture);

      const insertPosture = `INSERT
                               INTO stretching_posture (stretching_idx, posture_type)
                             VALUES`;
      const insertPostures = getArrayQuery(insertPosture, stretching.stretchingIdx, stretching.postures);
      await conn.query(insertPostures);
    }

    conn.commit();
    return updateRow.affectedRows;
  } catch (err) {
    console.error(`=== Stretching Dao updateStretching Error: ${err} === `);
    throw new Error(err);
  } finally {
    conn.release();
  }
};

const getStretchings = async ({ title, mainCategory, subCategory, posture, effect, tool }) => {
  let conn;

  try {
    conn = await pool.getConnection(async conn => conn);

    const sql = `SELECT stretching_idx AS 'stretchingIdx'
                      , title
                      , main_body AS 'mainBody'
                      , sub_body AS 'subBody'
                      , (SELECT group_concat(effect_type SEPARATOR ' ')
                           FROM movester_db.stretching_effect AS b
	                    	  WHERE a.stretching_idx = b.stretching_idx
	                     GROUP BY b.stretching_idx
	                       ) AS 'effect'
	                    , (SELECT group_concat(posture_type SEPARATOR ' ')
	                      	 FROM movester_db.stretching_posture AS c
	                      	WHERE a.stretching_idx = c.stretching_idx
	                     GROUP BY c.stretching_idx
	                       ) AS 'posture'
                      , (SELECT AVG(difficulty)
                           FROM stretching_difficulty d
                          WHERE a.stretching_idx = d.stretching_idx
                        ) AS 'difficulty'
                   FROM stretching a
                  WHERE a.title LIKE CONCAT('%',${title},'%')
                    AND a.main_body LIKE CONCAT('%',${mainCategory},'%')
                    AND a.sub_body LIKE CONCAT('%',${subCategory},'%')
                    AND IFNULL(a.tool,'') LIKE CONCAT('%',${tool},'%')
                    AND IFNULL((SELECT group_concat(effect_type SEPARATOR ' ')
                                  FROM stretching_effect AS b
                                 WHERE a.stretching_idx = b.stretching_idx
                              GROUP BY b.stretching_idx
                        ), '') LIKE CONCAT('%', ${effect},'%')
                    AND IFNULL((SELECT group_concat(posture_type SEPARATOR ' ')
                                  FROM stretching_posture AS c
                                 WHERE a.stretching_idx = c.stretching_idx
                              GROUP BY c.stretching_idx
                        ), '') LIKE CONCAT('%',${posture},'%')
                    ORDER BY a.stretching_idx DESC;`;

    const [row] = await conn.query(sql);

    return row;
  } catch (err) {
    console.error(`=== Stretching Dao getStretchings Error: ${err} === `);
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
  updateStretching,
  getStretchings,
};
