import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const run = async () => {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        multipleStatements: true
    });

    const sql = `
    DROP DATABASE IF EXISTS ${process.env.DB_NAME};
  `;

    await connection.query(sql);
    console.log("Database reset successfully");

    connection.end();
};

run();
