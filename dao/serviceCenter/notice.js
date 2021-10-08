const pool = require("../pool.js");

const noticeCreate = async ({ createPost }) => {
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            const sql = `INSERT INTO notice (title, contents, admin_user_idx, create_at, update_at) VALUES ('${createPost.title}', '${createPost.contents}', '${createPost.adminUserIdx}', now(), now())`;
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
            const sql = `SELECT notice_idx, title, DATE_FORMAT(create_at,'%Y-%m-%d') as create_at FROM notice order by notice_idx desc`;
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

const noticeDetail = async noticeIdx => {
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            const sql = `SELECT notice_idx, title, contents, create_at, update_at, admin_user_idx FROM notice WHERE notice_idx = ${noticeIdx}`;
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

const noticeUpdate = async ({ updatePost }) => {
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            const sql = `UPDATE notice SET title = '${updatePost.title}', contents = '${updatePost.contents}', admin_user_idx = '${updatePost.adminUserIdx}', update_at = now() WHERE notice_idx = ${updatePost.noticeIdx}`;
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

const noticeDelete = async noticeIdx => {
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            const sql = `DELETE FROM notice WHERE notice_idx = ${noticeIdx}`;
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
    noticeDetail,
    noticeUpdate,
    noticeDelete
};
