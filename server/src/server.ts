import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import { db, dbConfig } from "./db";

const app = express();
app.disable("etag"); // Desativa cache 304 para garantir dados atualizados em tempo real

const PORT = 3000;

app.use(cors());
app.use(express.json());

/* 0. Inicialização automática do DATABASE e da TABELA */
async function initDatabase() {
  try {
    const tempConnection = await mysql.createConnection(dbConfig);
    await tempConnection.query(`CREATE DATABASE IF NOT EXISTS trilha_aprender;`);
    await tempConnection.end();

    await db.query(`
      CREATE TABLE IF NOT EXISTS students (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        paws INT DEFAULT 0,
        completedCount INT DEFAULT 0,
        date VARCHAR(50)
      );
    `);
    console.log("✅ Base de dados 'trilha_aprender' e Tabela 'students' prontas!");
  } catch (error) {
    console.error("❌ Erro crítico ao inicializar a base de dados:", error);
    process.exit(1);
  }
}

/* 1. Buscar todos os alunos (para o Mural) */
app.get("/api/students", async (_req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM students ORDER BY name ASC");
    res.json(rows);
  } catch (error) {
    console.error("❌ Erro no GET /api/students:", error);
    res.status(500).json({ error: "Erro ao buscar alunos." });
  }
});

/* 2. ROTA DA PROFESSORA: Cadastrar novo aluno */
app.post("/api/students", async (req, res) => {
  const { name } = req.body;

  if (!name || typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "Nome do aluno é obrigatório." });
  }

  const trimmedName = name.trim();

  try {
    const [existing]: any = await db.query(
      "SELECT id FROM students WHERE LOWER(name) = LOWER(?)",
      [trimmedName]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: "Este aluno já está cadastrado!" });
    }

    const newId = Date.now().toString();
    const today = new Date().toLocaleDateString("pt-BR");

    await db.query(
      "INSERT INTO students (id, name, paws, completedCount, date) VALUES (?, ?, 0, 0, ?)",
      [newId, trimmedName, today]
    );

    console.log(`👩‍🏫 Professora cadastrou o aluno "${trimmedName}" no MySQL!`);
    return res.status(201).json({ message: "Aluno cadastrado com sucesso!" });
  } catch (error: any) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Este aluno já está cadastrado!" });
    }
    console.error("❌ Erro ao cadastrar aluno:", error);
    res.status(500).json({ error: "Erro ao cadastrar aluno no banco de dados." });
  }
});

/* 3. ROTA DO ALUNO / SESSÃO: Iniciar e salvar progresso da sessão */
app.post("/api/students/session", async (req, res) => {
  const { name, paws, completedCount } = req.body;

  if (!name || typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "Nome do aluno é obrigatório." });
  }

  const trimmedName = name.trim();

  try {
    const [existingRows]: any = await db.query(
      "SELECT * FROM students WHERE LOWER(name) = LOWER(?)",
      [trimmedName]
    );

    // Se o aluno não existir, BLOQUEIA a entrada!
    if (existingRows.length === 0) {
      return res.status(404).json({ error: "Aluno não cadastrado no sistema." });
    }

    const student = existingRows[0];
    const today = new Date().toLocaleDateString("pt-BR");

    // Mantém os valores atuais caso não tenham sido enviados novos na requisição
    const newPaws = Number.isFinite(paws) ? Math.max(0, Number(paws)) : student.paws;
    const newCompleted = Number.isFinite(completedCount) ? Math.max(0, Number(completedCount)) : student.completedCount;

    await db.query(
      "UPDATE students SET date = ?, paws = ?, completedCount = ? WHERE id = ?",
      [today, newPaws, newCompleted, student.id]
    );

    return res.status(200).json({ message: "Sessão atualizada com sucesso!" });
  } catch (error) {
    console.error("❌ Erro ao iniciar/atualizar sessão:", error);
    res.status(500).json({ error: "Erro ao atualizar sessão." });
  }
});

/* 4. Atualizar patinhas do aluno em tempo real */
app.patch("/api/students/paws", async (req, res) => {
  const { playerName, paws } = req.body;

  if (!playerName || typeof playerName !== "string" || !playerName.trim()) {
    return res.status(400).json({ error: "Nome do jogador é obrigatório." });
  }

  const safePaws = Number.isFinite(paws) ? Math.max(0, Number(paws)) : 0;

  try {
    const [result]: any = await db.query(
      "UPDATE students SET paws = ? WHERE LOWER(name) = LOWER(?)",
      [safePaws, playerName.trim()]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Aluno não encontrado." });
    }

    res.status(200).json({ message: "Patinhas atualizadas com sucesso." });
  } catch (error) {
    console.error("❌ Erro no PATCH /api/students/paws:", error);
    res.status(500).json({ error: "Erro ao atualizar patinhas." });
  }
});

/* 5. Atualizar atividades concluídas */
app.patch("/api/students/activity", async (req, res) => {
  const { playerName, completedCount } = req.body;

  if (!playerName || typeof playerName !== "string" || !playerName.trim()) {
    return res.status(400).json({ error: "Nome do jogador é obrigatório." });
  }

  const safeCompleted = Number.isFinite(completedCount) ? Math.max(0, Number(completedCount)) : 0;

  try {
    const [result]: any = await db.query(
      "UPDATE students SET completedCount = ? WHERE LOWER(name) = LOWER(?)",
      [safeCompleted, playerName.trim()]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Aluno não encontrado." });
    }

    res.status(200).json({ message: "Progresso de atividades atualizado com sucesso." });
  } catch (error) {
    console.error("❌ Erro no PATCH /api/students/activity:", error);
    res.status(500).json({ error: "Erro ao atualizar atividades." });
  }
});

/* 6. Limpar histórico */
app.delete("/api/students", async (_req, res) => {
  try {
    await db.query("DELETE FROM students");
    res.status(200).json({ message: "Histórico apagado com sucesso." });
  } catch (error) {
    console.error("❌ Erro no DELETE /api/students:", error);
    res.status(500).json({ error: "Erro ao apagar histórico." });
  }
});

/* Inicializa o servidor apenas APÓS criar o banco de dados */
async function startServer() {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`🚀 Servidor Node.js rodando em http://localhost:${PORT}`);
  });
}

startServer();