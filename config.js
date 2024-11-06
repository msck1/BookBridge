import mysql2 from 'mysql2/promise';

const pool = mysql2.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "bookbridge",
});

const connection = await pool.getConnection();

export { connection };