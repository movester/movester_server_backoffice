const pool = require("./pool.js");

const noticeCreate = async ({ createPost }) => {
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            const sql = `INSERT INTO notice (title, contents, admin_user_idx, create_at, update_at) VALUES ('${createPost.title}', '${createPost.contents}', 1, now(), now())`;
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

const noticeList = async () => {
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            const sql = `SELECT notice_idx, title, create_at FROM notice`;
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

const noticeDetail = async (postId) => {
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            const sql = `SELECT notice_idx, title, contents, create_at, update_at FROM notice WHERE notice_idx = ${postId}`;
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
    noticeCreate,
    noticeList,
    noticeDetail
};
