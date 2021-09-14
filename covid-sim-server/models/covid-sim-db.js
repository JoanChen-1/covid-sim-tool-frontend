const { Pool } = require("pg");

const pool = new Pool({
    host: process.env.DB_HOSTNAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

async function query(text, params) {
    try {
        // console.log("start query ");
        const start = Date.now();
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        // console.log("executed query ", { text, duration, rows: res.rowCount });
        return res;
    } catch (err) {
        throw err;
    }
}

module.exports = {
    query,
};
