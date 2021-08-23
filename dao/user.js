const pool = require("../dao/pool.js");

const test = async () => {
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            const sql = `SELECT user_idx, email, name FROM user`;
            const [rows] = await connection.query(sql);
            connection.release();
            return rows;
        } catch (err) {
            console.log("Query Error");
            connection.release();
            return false;
        }
    } catch (err) {
        console.log("DB Error");
        return false;
    }
};

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

const login = async email => {
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

module.exports = {
    test,
    login,
    join,
    findUserByEmail
};
