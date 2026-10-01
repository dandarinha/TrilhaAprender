import mysql from "mysql2/promise";

export const dbConfig = {
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  port: Number(process.env.DB_PORT || 3306),
};

export const databaseName =
  process.env.DB_NAME || "trilha_aprender";

export const db = mysql.createPool({
  ...dbConfig,
  database: databaseName,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});