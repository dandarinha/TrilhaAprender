import mysql from "mysql2/promise";

export const dbConfig = {
  host: "127.0.0.1", // Usar 127.0.0.1 evita problemas de IPv6 no Node.js
  user: "root",      // Verifique se o utilizador está correto
  password: "", // Digite a sua senha do MySQL aqui
  port: 3306,
};

export const db = mysql.createPool({
  ...dbConfig,
  database: "trilha_aprender",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});