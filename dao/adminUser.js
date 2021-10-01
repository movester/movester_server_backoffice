const pool = require("./pool.js");

const join = async ({ joinUser }) => {
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            const sql = `INSERT INTO admin_user (email, password, name, create_at) VALUES ('${joinUser.email}', '${joinUser.password}', '${joinUser.name}', now())`;
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

const findUserByEmail = async email => {
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            const sql = `SELECT admin_user_idx, email, password, name FROM admin_user WHERE email = '${email}'`;
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

const findUserByIdx = async idx => {
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            const sql = `SELECT admin_user_idx, email, password, name FROM admin_user WHERE admin_user_idx = ${idx}`;
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

const updatePassword = async (adminUserIdx, password) => {
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            const sql = `UPDATE admin_user SET password = '${password}' WHERE admin_user_idx = ${adminUserIdx}`;
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
    join,
    findUserByEmail,
    findUserByIdx,
    updatePassword
};
