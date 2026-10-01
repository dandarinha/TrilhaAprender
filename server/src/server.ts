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
].filter(
  (origin, index, array) =>
    array.indexOf(origin) === index
);

/* =========================================================
   FUNÇÕES AUXILIARES
========================================================= */

/**
 * Normaliza o parâmetro de ID do aluno.
 *
 * Dependendo da versão dos tipos do Express,
 * req.params.studentId pode ser inferido como
 * string | string[].
 *
 * Esta função garante que as rotas trabalhem
 * sempre com uma string válida.
 */
function getStudentId(
  value: string | string[]
): string | null {
  const studentId = Array.isArray(value)
    ? value[0]
    : value;

  if (
    typeof studentId !== "string" ||
    !studentId.trim()
  ) {
    return null;
  }

  return studentId.trim();
}

/* =========================================================
   MIDDLEWARES
========================================================= */

app.use(
  cors({
    origin: (origin, callback) => {
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
   HEALTH CHECK
========================================================= */

app.get(
  "/api/health",
  (_req: Request, res: Response) => {
    return res.json({
      success: true,
      message: "API Trilha do Aprender funcionando.",
    });
  }
);

/* =========================================================
   ALUNOS
========================================================= */

app.get(
  "/api/students",
  async (_req: Request, res: Response) => {
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

      return res.json(rows);
    } catch (error) {
      console.error("Erro ao buscar alunos:", error);

      return res.status(500).json({
        error: "Erro ao buscar alunos.",
      });
    }
  }
);

app.post(
  "/api/students",
  async (req: Request, res: Response) => {
    try {
      const { name, className } = req.body;

      if (
        typeof name !== "string" ||
        !name.trim()
      ) {
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
          error:
            "Já existe um aluno cadastrado com esse nome.",
        });
      }

      const studentId = crypto.randomUUID();

      const normalizedClass =
        typeof className === "string"
          ? className.trim() || null
          : null;

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
          normalizedClass,
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
          LIMIT 1
        `,
        [studentId]
      );

      return res.status(201).json(
        (rows as any[])[0]
      );
    } catch (error) {
      console.error(
        "Erro ao cadastrar aluno:",
        error
      );

      return res.status(500).json({
        error: "Erro ao cadastrar aluno.",
      });
    }
  }
);

app.delete(
  "/api/students/:studentId",
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const studentId = getStudentId(
        req.params.studentId
      );

      if (!studentId) {
        return res.status(400).json({
          error: "ID do aluno é obrigatório.",
        });
      }

      const [result] = await db.query(
        `
          DELETE FROM students
          WHERE id = ?
        `,
        [studentId]
      );

      if ((result as any).affectedRows === 0) {
        return res.status(404).json({
          error: "Aluno não encontrado.",
        });
      }

      return res.json({
        success: true,
        message: "Aluno excluído com sucesso.",
      });
    } catch (error) {
      console.error(
        "Erro ao excluir aluno:",
        error
      );

      return res.status(500).json({
        error: "Erro ao excluir aluno.",
      });
    }
  }
);

/* =========================================================
   SESSÕES
========================================================= */

app.post(
  "/api/students/:studentId/session",
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const studentId = getStudentId(
        req.params.studentId
      );

      if (!studentId) {
        return res.status(400).json({
          error: "ID do aluno é obrigatório.",
        });
      }

      const [studentRows] = await db.query(
        `
          SELECT
            id,
            paws
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

      await db.query(
        `
          UPDATE game_sessions
          SET finished_at = NOW()
          WHERE student_id = ?
            AND finished_at IS NULL
        `,
        [studentId]
      );

      const currentPaws =
        Number(students[0].paws) || 0;

      const [result] = await db.query(
        `
          INSERT INTO game_sessions (
            student_id,
            paws,
            started_at,
            finished_at
          )
          VALUES (?, ?, NOW(), NULL)
        `,
        [
          studentId,
          currentPaws,
        ]
      );

      await db.query(
        `
          UPDATE students
          SET lastAccess = NOW()
          WHERE id = ?
        `,
        [studentId]
      );

      return res.status(201).json({
        id: (result as any).insertId,
        studentId,
        paws: currentPaws,
        message: "Sessão iniciada.",
      });
    } catch (error) {
      console.error(
        "Erro ao iniciar sessão:",
        error
      );

      return res.status(500).json({
        error: "Erro ao iniciar sessão.",
      });
    }
  }
);

app.patch(
  "/api/students/:studentId/session/finish",
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const studentId = getStudentId(
        req.params.studentId
      );

      if (!studentId) {
        return res.status(400).json({
          error: "ID do aluno é obrigatório.",
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

      const [result] = await db.query(
        `
          UPDATE game_sessions
          SET
            paws = (
              SELECT paws
              FROM students
              WHERE id = ?
            ),
            finished_at = NOW()
          WHERE student_id = ?
            AND finished_at IS NULL
        `,
        [
          studentId,
          studentId,
        ]
      );

      await db.query(
        `
          UPDATE students
          SET lastAccess = NOW()
          WHERE id = ?
        `,
        [studentId]
      );

      return res.json({
        success: true,
        finished:
          (result as any).affectedRows > 0,
      });
    } catch (error) {
      console.error(
        "Erro ao finalizar sessão:",
        error
      );

      return res.status(500).json({
        error: "Erro ao finalizar sessão.",
      });
    }
  }
);

/* =========================================================
   PATINHAS
========================================================= */

app.patch(
  "/api/students/:studentId/paws",
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const studentId = getStudentId(
        req.params.studentId
      );

      if (!studentId) {
        return res.status(400).json({
          error: "ID do aluno é obrigatório.",
        });
      }

      const { amount } = req.body;
      const delta = Number(amount);

      if (
        !Number.isFinite(delta) ||
        !Number.isInteger(delta) ||
        delta <= 0
      ) {
        return res.status(400).json({
          error:
            "A quantidade de patinhas deve ser um inteiro positivo.",
        });
      }

      const [result] = await db.query(
        `
          UPDATE students
          SET
            paws = paws + ?,
            lastAccess = NOW()
          WHERE id = ?
        `,
        [
          delta,
          studentId,
        ]
      );

      if ((result as any).affectedRows === 0) {
        return res.status(404).json({
          error: "Aluno não encontrado.",
        });
      }

      await db.query(
        `
          UPDATE game_sessions
          SET paws = (
            SELECT paws
            FROM students
            WHERE id = ?
          )
          WHERE student_id = ?
            AND finished_at IS NULL
        `,
        [
          studentId,
          studentId,
        ]
      );

      const [rows] = await db.query(
        `
          SELECT paws
          FROM students
          WHERE id = ?
          LIMIT 1
        `,
        [studentId]
      );

      const student =
        (rows as any[])[0];

      return res.json({
        success: true,
        paws: Number(
          student?.paws ?? 0
        ),
      });
    } catch (error) {
      console.error(
        "Erro ao atualizar patinhas:",
        error
      );

      return res.status(500).json({
        error: "Erro ao atualizar patinhas.",
      });
    }
  }
);

/* =========================================================
   ATIVIDADES
========================================================= */

app.get(
  "/api/activities",
  async (
    _req: Request,
    res: Response
  ) => {
    try {
      const [rows] = await db.query(`
        SELECT
          id,
          name,
          trail,
          subject
        FROM activities
        ORDER BY
          subject,
          trail,
          name
      `);

      return res.json(rows);
    } catch (error) {
      console.error(
        "Erro ao buscar atividades:",
        error
      );

      return res.status(500).json({
        error: "Erro ao buscar atividades.",
      });
    }
  }
);

app.post(
  "/api/students/:studentId/activities",
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const studentId = getStudentId(
        req.params.studentId
      );

      if (!studentId) {
        return res.status(400).json({
          error: "ID do aluno é obrigatório.",
        });
      }

      const { activityId } = req.body;

      if (
        typeof activityId !== "string" ||
        !activityId.trim()
      ) {
        return res.status(400).json({
          error: "O activityId é obrigatório.",
        });
      }

      const normalizedActivityId =
        activityId.trim();

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
          SELECT
            id,
            name,
            trail,
            subject
          FROM activities
          WHERE id = ?
          LIMIT 1
        `,
        [normalizedActivityId]
      );

      const activities =
        activityRows as any[];

      if (activities.length === 0) {
        return res.status(404).json({
          error: "Atividade não encontrada.",
        });
      }

      const [result] = await db.query(
        `
          INSERT INTO student_activities (
            student_id,
            activity_id,
            played_at
          )
          VALUES (?, ?, NOW())
        `,
        [
          studentId,
          normalizedActivityId,
        ]
      );

      await db.query(
        `
          UPDATE students
          SET lastAccess = NOW()
          WHERE id = ?
        `,
        [studentId]
      );

      return res.status(201).json({
        success: true,
        id: (result as any).insertId,
        activity: activities[0],
        message:
          "Atividade registrada como jogada.",
      });
    } catch (error) {
      console.error(
        "Erro ao registrar atividade jogada:",
        error
      );

      return res.status(500).json({
        error:
          "Erro ao registrar atividade jogada.",
      });
    }
  }
);

/* =========================================================
   DESEMPENHO
========================================================= */

app.get(
  "/api/students/:studentId/performance",
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const studentId = getStudentId(
        req.params.studentId
      );

      if (!studentId) {
        return res.status(400).json({
          error: "ID do aluno é obrigatório.",
        });
      }

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

      const students =
        studentRows as any[];

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
            sa.played_at
          FROM student_activities sa
          INNER JOIN activities a
            ON a.id = sa.activity_id
          WHERE sa.student_id = ?
          ORDER BY
            sa.played_at DESC,
            sa.id DESC
        `,
        [studentId]
      );

      const activities =
        activityRows as any[];

      const [sessionRows] = await db.query(
        `
          SELECT
            id,
            paws,
            started_at,
            finished_at
          FROM game_sessions
          WHERE student_id = ?
          ORDER BY
            started_at DESC
        `,
        [studentId]
      );

      const sessions =
        sessionRows as any[];

      const playedActivitiesCount =
        activities.length;

      const sessionsCount =
        sessions.length;

      return res.json({
        student,

        statistics: {
          playedActivitiesCount,
          sessionsCount,
        },

        activities,

        sessions,
      });
    } catch (error) {
      console.error(
        "Erro ao buscar desempenho:",
        error
      );

      return res.status(500).json({
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
    await initializeDatabase();

    await db.query("SELECT 1");

    console.log(
      "MySQL conectado com sucesso."
    );

    app.listen(
      PORT,
      "0.0.0.0",
      () => {
        console.log(
          `API Trilha do Aprender rodando na porta ${PORT}.`
        );

        console.log(
          `Acesso local: http://localhost:${PORT}`
        );

        console.log(
          `Acesso pela rede: http://IP-DA-MAQUINA:${PORT}`
        );
      }
    );
  } catch (error) {
    console.error(
      "Não foi possível iniciar a API ou conectar ao MySQL."
    );

    console.error(error);

    process.exit(1);
  }
}

startServer();
