const pool = require('../pool');

const faqCreate = async createPost => {
  try {
    const connection = await pool.getConnection(async conn => conn);
    try {
      const sql = `INSERT INTO faq (title, contents, admin_idx, create_at, update_at) VALUES ('${createPost.title}', '${createPost.contents}', '${createPost.adminIdx}', now(), now())`;
      const [row] = await connection.query(sql);
      connection.release();
      return row;
    } catch (err) {
      console.log(`Query Error > ${err}`);
      connection.release();
      return false;
    }
  } catch (err) {
    console.log(`DB Error > ${err}`);
    return false;
  }
};

const faqList = async () => {
  try {
    const connection = await pool.getConnection(async conn => conn);
    try {
      const sql =
        "SELECT faq_idx, title, DATE_FORMAT(create_at,'%Y-%m-%d') as create_at FROM faq order by faq_idx desc";
      const [row] = await connection.query(sql);
      connection.release();
      return row;
    } catch (err) {
      console.log(`Query Error > ${err}`);
      connection.release();
      return false;
    }
  } catch (err) {
    console.log(`DB Error > ${err}`);
    return false;
  }
};

const faqDetail = async faqIdx => {
  try {
    const connection = await pool.getConnection(async conn => conn);
    try {
      const sql = `SELECT faq_idx, title, contents, create_at, update_at, admin_idx FROM faq WHERE faq_idx = ${faqIdx}`;
      const [row] = await connection.query(sql);
      connection.release();
      return row;
    } catch (err) {
      console.log(`Query Error > ${err}`);
      connection.release();
      return false;
    }
  } catch (err) {
    console.log(`DB Error > ${err}`);
    return false;
  }
};

const faqUpdate = async (faqIdx, { updatePost }) => {
  try {
    const connection = await pool.getConnection(async conn => conn);
    try {
      const sql = `UPDATE faq SET title = '${updatePost.title}', contents = '${updatePost.contents}', admin_idx = '${updatePost.adminIdx}', update_at = now() WHERE faq_idx = ${faqIdx}`;
      const [row] = await connection.query(sql);
      connection.release();
      return row;
    } catch (err) {
      console.log(`Query Error > ${err}`);
      connection.release();
      return false;
    }
  } catch (err) {
    console.log(`DB Error > ${err}`);
    return false;
  }
};

const faqDelete = async faqIdx => {
  try {
    const connection = await pool.getConnection(async conn => conn);
    try {
      const sql = `DELETE FROM faq WHERE faq_idx = ${faqIdx}`;
      const [row] = await connection.query(sql);
      connection.release();
      return row;
    } catch (err) {
      console.log(`Query Error > ${err}`);
      connection.release();
      return false;
    }
  } catch (err) {
    console.log(`DB Error > ${err}`);
    return false;
  }
};

module.exports = {
  faqCreate,
  faqList,
  faqDetail,
  faqUpdate,
  faqDelete,
};
