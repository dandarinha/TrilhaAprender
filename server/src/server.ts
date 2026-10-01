import express, { Request, Response } from "express";
import cors from "cors";
import crypto from "crypto";
import { db } from "./db";
import { initializeDatabase } from "./database";

const app = express();

const PORT = Number(process.env.PORT || 3000);

const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:5173";

const allowedOrigins = [
  "http://localhost:5173",
  FRONTEND_URL,
].filter((origin, index, array) => array.indexOf(origin) === index);

app.use(
  cors({
    origin: (origin, callback) => {
      // Permite requisições sem Origin, como algumas ferramentas locais.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error("Origem não autorizada pelo CORS.")
      );
    },
  })
);

app.use(express.json());

/* =========================================================
   TESTE DA API
========================================================= */

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: "API Trilha do Aprender funcionando.",
  });
});

/* =========================================================
   ALUNOS
========================================================= */

/**
 * GET /api/students
 *
 * Lista todos os alunos cadastrados.
 */
app.get("/api/students", async (_req: Request, res: Response) => {
  try {
    const [rows] = await db.query(`
      SELECT
        id,
        name,
        className,
        paws,
        createdAt,
        lastAccess
      FROM students
      ORDER BY name ASC
    `);

    res.json(rows);
  } catch (error) {
    console.error("Erro ao buscar alunos:", error);

    res.status(500).json({
      error: "Erro ao buscar alunos.",
    });
  }
});

/**
 * POST /api/students
 *
 * Cadastro de aluno feito pela Área do Professor.
 */
app.post("/api/students", async (req: Request, res: Response) => {
  try {
    const { name, className } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        error: "O nome do aluno é obrigatório.",
      });
    }

    const studentName = name.trim();

    const [existingRows] = await db.query(
      `
        SELECT id
        FROM students
        WHERE name = ?
        LIMIT 1
      `,
      [studentName]
    );

    if ((existingRows as any[]).length > 0) {
      return res.status(409).json({
        error: "Já existe um aluno cadastrado com esse nome.",
      });
    }

    const studentId = crypto.randomUUID();

    await db.query(
      `
        INSERT INTO students (
          id,
          name,
          className,
          paws,
          createdAt,
          lastAccess
        )
        VALUES (?, ?, ?, 0, NOW(), NULL)
      `,
      [
        studentId,
        studentName,
        className && typeof className === "string"
          ? className.trim() || null
          : null,
      ]
    );

    const [rows] = await db.query(
      `
        SELECT
          id,
          name,
          className,
          paws,
          createdAt,
          lastAccess
        FROM students
        WHERE id = ?
      `,
      [studentId]
    );

    res.status(201).json((rows as any[])[0]);
  } catch (error) {
    console.error("Erro ao cadastrar aluno:", error);

    res.status(500).json({
      error: "Erro ao cadastrar aluno.",
    });
  }
});

/**
 * DELETE /api/students/:studentId
 *
 * Exclusão de aluno feita pela Área do Professor.
 */
app.delete(
  "/api/students/:studentId",
  async (req: Request, res: Response) => {
    try {
      const { studentId } = req.params;

      const [result] = await db.query(
        `
          DELETE FROM students
          WHERE id = ?
        `,
        [studentId]
      );

      const deleteResult = result as any;

      if (deleteResult.affectedRows === 0) {
        return res.status(404).json({
          error: "Aluno não encontrado.",
        });
      }

      res.json({
        success: true,
        message: "Aluno excluído com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao excluir aluno:", error);

      res.status(500).json({
        error: "Erro ao excluir aluno.",
      });
    }
  }
);

/* =========================================================
   SESSÕES
========================================================= */

/**
 * POST /api/students/:studentId/session
 *
 * Inicia uma nova sessão de jogo.
 */
app.post(
  "/api/students/:studentId/session",
  async (req: Request, res: Response) => {
    try {
      const { studentId } = req.params;

      const [studentRows] = await db.query(
        `
          SELECT id
          FROM students
          WHERE id = ?
          LIMIT 1
        `,
        [studentId]
      );

      if ((studentRows as any[]).length === 0) {
        return res.status(404).json({
          error: "Aluno não encontrado.",
        });
      }

      await db.query(
        `
          UPDATE game_sessions
          SET finished_at = NOW()
          WHERE student_id = ?
            AND finished_at IS NULL
        `,
        [studentId]
      );

      const [result] = await db.query(
        `
          INSERT INTO game_sessions (
            student_id,
            paws,
            started_at,
            finished_at
          )
          VALUES (?, 0, NOW(), NULL)
        `,
        [studentId]
      );

      await db.query(
        `
          UPDATE students
          SET lastAccess = NOW()
          WHERE id = ?
        `,
        [studentId]
      );

      res.status(201).json({
        id: (result as any).insertId,
        studentId,
        message: "Sessão iniciada.",
      });
    } catch (error) {
      console.error("Erro ao iniciar sessão:", error);

      res.status(500).json({
        error: "Erro ao iniciar sessão.",
      });
    }
  }
);

/**
 * PATCH /api/students/:studentId/session/finish
 *
 * Finaliza a sessão atual do aluno.
 */
app.patch(
  "/api/students/:studentId/session/finish",
  async (req: Request, res: Response) => {
    try {
      const { studentId } = req.params;
      const { paws } = req.body;

      const [studentRows] = await db.query(
        `
          SELECT id
          FROM students
          WHERE id = ?
          LIMIT 1
        `,
        [studentId]
      );

      if ((studentRows as any[]).length === 0) {
        return res.status(404).json({
          error: "Aluno não encontrado.",
        });
      }

      if (paws !== undefined) {
        const numericPaws = Number(paws);

        if (!Number.isFinite(numericPaws) || numericPaws < 0) {
          return res.status(400).json({
            error: "Quantidade de patinhas inválida.",
          });
        }

        await db.query(
          `
            UPDATE students
            SET
              paws = ?,
              lastAccess = NOW()
            WHERE id = ?
          `,
          [numericPaws, studentId]
        );

        await db.query(
          `
            UPDATE game_sessions
            SET paws = ?
            WHERE student_id = ?
              AND finished_at IS NULL
          `,
          [numericPaws, studentId]
        );
      } else {
        await db.query(
          `
            UPDATE students
            SET lastAccess = NOW()
            WHERE id = ?
          `,
          [studentId]
        );
      }

      const [result] = await db.query(
        `
          UPDATE game_sessions
          SET finished_at = NOW()
          WHERE student_id = ?
            AND finished_at IS NULL
        `,
        [studentId]
      );

      res.json({
        success: true,
        finished: (result as any).affectedRows > 0,
      });
    } catch (error) {
      console.error("Erro ao finalizar sessão:", error);

      res.status(500).json({
        error: "Erro ao finalizar sessão.",
      });
    }
  }
);

/* =========================================================
   PATINHAS
========================================================= */

/**
 * PATCH /api/students/:studentId/paws
 *
 * Atualiza a quantidade atual de patinhas.
 */
app.patch(
  "/api/students/:studentId/paws",
  async (req: Request, res: Response) => {
    try {
      const { studentId } = req.params;
      const { paws } = req.body;

      const numericPaws = Number(paws);

      if (!Number.isFinite(numericPaws) || numericPaws < 0) {
        return res.status(400).json({
          error: "Quantidade de patinhas inválida.",
        });
      }

      const [result] = await db.query(
        `
          UPDATE students
          SET
            paws = ?,
            lastAccess = NOW()
          WHERE id = ?
        `,
        [numericPaws, studentId]
      );

      if ((result as any).affectedRows === 0) {
        return res.status(404).json({
          error: "Aluno não encontrado.",
        });
      }

      await db.query(
        `
          UPDATE game_sessions
          SET paws = ?
          WHERE student_id = ?
            AND finished_at IS NULL
        `,
        [numericPaws, studentId]
      );

      res.json({
        success: true,
        paws: numericPaws,
      });
    } catch (error) {
      console.error("Erro ao atualizar patinhas:", error);

      res.status(500).json({
        error: "Erro ao atualizar patinhas.",
      });
    }
  }
);

/* =========================================================
   ATIVIDADES
========================================================= */

/**
 * GET /api/activities
 *
 * Lista as atividades disponíveis.
 */
app.get("/api/activities", async (_req: Request, res: Response) => {
  try {
    const [rows] = await db.query(`
      SELECT
        id,
        name,
        trail,
        subject
      FROM activities
      ORDER BY subject, trail, name
    `);

    res.json(rows);
  } catch (error) {
    console.error("Erro ao buscar atividades:", error);

    res.status(500).json({
      error: "Erro ao buscar atividades.",
    });
  }
});

/**
 * POST /api/students/:studentId/activities
 *
 * Registra uma atividade concluída pelo aluno.
 */
app.post(
  "/api/students/:studentId/activities",
  async (req: Request, res: Response) => {
    try {
      const { studentId } = req.params;
      const { activityId } = req.body;

      if (!activityId || typeof activityId !== "string") {
        return res.status(400).json({
          error: "O activityId é obrigatório.",
        });
      }

      const [studentRows] = await db.query(
        `
          SELECT id
          FROM students
          WHERE id = ?
          LIMIT 1
        `,
        [studentId]
      );

      if ((studentRows as any[]).length === 0) {
        return res.status(404).json({
          error: "Aluno não encontrado.",
        });
      }

      const [activityRows] = await db.query(
        `
          SELECT id
          FROM activities
          WHERE id = ?
          LIMIT 1
        `,
        [activityId]
      );

      if ((activityRows as any[]).length === 0) {
        return res.status(404).json({
          error: "Atividade não encontrada.",
        });
      }

      await db.query(
        `
          INSERT INTO student_activities (
            student_id,
            activity_id,
            completed_at
          )
          VALUES (?, ?, NOW())
          ON DUPLICATE KEY UPDATE
            completed_at = VALUES(completed_at)
        `,
        [studentId, activityId]
      );

      await db.query(
        `
          UPDATE students
          SET lastAccess = NOW()
          WHERE id = ?
        `,
        [studentId]
      );

      const [countRows] = await db.query(
        `
          SELECT COUNT(*) AS completedCount
          FROM student_activities
          WHERE student_id = ?
        `,
        [studentId]
      );

      res.json({
        success: true,
        completedCount: Number(
          (countRows as any[])[0]?.completedCount ?? 0
        ),
      });
    } catch (error) {
      console.error("Erro ao registrar atividade:", error);

      res.status(500).json({
        error: "Erro ao registrar atividade.",
      });
    }
  }
);

/* =========================================================
   DESEMPENHO
========================================================= */

/**
 * GET /api/students/:studentId/performance
 *
 * Retorna o desempenho completo de um aluno.
 */
app.get(
  "/api/students/:studentId/performance",
  async (req: Request, res: Response) => {
    try {
      const { studentId } = req.params;

      const [studentRows] = await db.query(
        `
          SELECT
            id,
            name,
            className,
            paws,
            createdAt,
            lastAccess
          FROM students
          WHERE id = ?
          LIMIT 1
        `,
        [studentId]
      );

      const students = studentRows as any[];

      if (students.length === 0) {
        return res.status(404).json({
          error: "Aluno não encontrado.",
        });
      }

      const student = students[0];

      const [activityRows] = await db.query(
        `
          SELECT
            a.id,
            a.name,
            a.trail,
            a.subject,
            sa.completed_at
          FROM student_activities sa
          INNER JOIN activities a
            ON a.id = sa.activity_id
          WHERE sa.student_id = ?
          ORDER BY sa.completed_at DESC
        `,
        [studentId]
      );

      const activities = activityRows as any[];

      const [sessionRows] = await db.query(
        `
          SELECT
            id,
            paws,
            started_at,
            finished_at
          FROM game_sessions
          WHERE student_id = ?
          ORDER BY started_at DESC
        `,
        [studentId]
      );

      const sessions = sessionRows as any[];

      const completedCount = activities.length;
      const sessionsCount = sessions.length;

      const trails = new Set(
        activities.map((activity) => activity.trail)
      );

      res.json({
        student,
        statistics: {
          completedCount,
          sessionsCount,
          trailsCompleted: trails.size,
        },
        activities,
        sessions,
      });
    } catch (error) {
      console.error("Erro ao buscar desempenho:", error);

      res.status(500).json({
        error: "Erro ao buscar desempenho.",
      });
    }
  }
);

/* =========================================================
   INICIALIZAÇÃO
========================================================= */

async function startServer() {
  try {
    /*
     * Primeiro garante que:
     * - o banco exista;
     * - as tabelas existam;
     * - as atividades iniciais existam.
     */
    await initializeDatabase();

    // Testa a conexão com o banco já inicializado.
    await db.query("SELECT 1");

    console.log("MySQL conectado com sucesso.");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(
        `API Trilha do Aprender rodando na porta ${PORT}.`
      );
      console.log(
        `Acesso local: http://localhost:${PORT}`
      );
      console.log(
        `Acesso pela rede: http://IP-DA-MAQUINA:${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Não foi possível iniciar a API ou conectar ao MySQL."
    );
    console.error(error);

    process.exit(1);
  }
}

startServer();