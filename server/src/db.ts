import dotenv from "dotenv";
import mysql from "mysql2/promise";
import path from "node:path";

const projectRoot = path.resolve(
  process.cwd().toLowerCase().endsWith(`${path.sep}server`)
    ? process.cwd()
    : path.join(process.cwd(), "server")
);

// Aceita configuração na raiz ou em server/.env. A raiz tem prioridade.
dotenv.config({ path: path.join(projectRoot, "..", ".env") });
dotenv.config({
  path: path.join(projectRoot, ".env"),
  override: false,
});

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
