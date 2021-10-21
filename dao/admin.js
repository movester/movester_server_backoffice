const pool = require("./pool.js");

const join = async ({ joinUser }) => {
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            const sql = `INSERT INTO admin (email, password, name, create_at) VALUES ('${joinUser.email}', '${joinUser.password}', '${joinUser.name}', now())`;
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
            const sql = `SELECT admin_idx, email, password, name FROM admin WHERE email = '${email}'`;
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
            const sql = `SELECT admin_idx, email, password, name FROM admin WHERE admin_idx = ${idx}`;
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

const updatePassword = async (adminIdx, password) => {
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            const sql = `UPDATE admin SET password = '${password}' WHERE admin_idx = ${adminIdx}`;
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
