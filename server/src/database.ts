import mysql from "mysql2/promise";
import { dbConfig, databaseName } from "./db";

/* =========================================================
   CONEXÃO INICIAL
   Conecta ao servidor MySQL sem selecionar um banco específico.
========================================================= */

async function createDatabaseIfNotExists() {
  const connection = await mysql.createConnection(dbConfig);

  try {
    await connection.query(`
      CREATE DATABASE IF NOT EXISTS \`${databaseName}\`
      CHARACTER SET utf8mb4
      COLLATE utf8mb4_unicode_ci
    `);

    console.log(
      `Banco de dados "${databaseName}" verificado com sucesso.`
    );
  } finally {
    await connection.end();
  }
}

/* =========================================================
   TABELAS
========================================================= */

async function createTables() {
  /*
   * ALUNOS
   */
  await execute(`
    CREATE TABLE IF NOT EXISTS students (
      id VARCHAR(36) NOT NULL,
      name VARCHAR(150) NOT NULL,
      className VARCHAR(100) NULL,
      paws INT NOT NULL DEFAULT 0,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      lastAccess DATETIME NULL,

      PRIMARY KEY (id),
      UNIQUE KEY uq_students_name (name)
    )
    ENGINE=InnoDB
    DEFAULT CHARSET=utf8mb4
    COLLATE=utf8mb4_unicode_ci
  `);

  /*
   * ATIVIDADES
   */
  await execute(`
    CREATE TABLE IF NOT EXISTS activities (
      id VARCHAR(100) NOT NULL,
      name VARCHAR(150) NOT NULL,
      trail VARCHAR(150) NOT NULL,
      subject VARCHAR(50) NOT NULL,

      PRIMARY KEY (id)
    )
    ENGINE=InnoDB
    DEFAULT CHARSET=utf8mb4
    COLLATE=utf8mb4_unicode_ci
  `);

  /*
   * ATIVIDADES CONCLUÍDAS PELOS ALUNOS
   */
  await execute(`
    CREATE TABLE IF NOT EXISTS student_activities (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      student_id VARCHAR(36) NOT NULL,
      activity_id VARCHAR(100) NOT NULL,
      completed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

      PRIMARY KEY (id),

      UNIQUE KEY uq_student_activity (
        student_id,
        activity_id
      ),

      CONSTRAINT fk_student_activities_student
        FOREIGN KEY (student_id)
        REFERENCES students(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

      CONSTRAINT fk_student_activities_activity
        FOREIGN KEY (activity_id)
        REFERENCES activities(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
    )
    ENGINE=InnoDB
    DEFAULT CHARSET=utf8mb4
    COLLATE=utf8mb4_unicode_ci
  `);

  /*
   * SESSÕES DE JOGO
   */
  await execute(`
    CREATE TABLE IF NOT EXISTS game_sessions (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      student_id VARCHAR(36) NOT NULL,
      paws INT NOT NULL DEFAULT 0,
      started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      finished_at DATETIME NULL,

      PRIMARY KEY (id),

      KEY idx_game_sessions_student (
        student_id
      ),

      CONSTRAINT fk_game_sessions_student
        FOREIGN KEY (student_id)
        REFERENCES students(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
    )
    ENGINE=InnoDB
    DEFAULT CHARSET=utf8mb4
    COLLATE=utf8mb4_unicode_ci
  `);

  console.log("Tabelas do jogo verificadas com sucesso.");
}

/* =========================================================
   ATIVIDADES INICIAIS
========================================================= */

async function seedActivities() {
  const activities = [
    {
      id: "portuguese",
      name: "Forme a Palavra",
      trail: "Floresta das Sílabas",
      subject: "portuguese",
    },
    {
      id: "syllable-match",
      name: "Sílaba Inicial",
      trail: "Floresta das Sílabas",
      subject: "portuguese",
    },
    {
      id: "rhymes",
      name: "Rimas",
      trail: "Floresta das Sílabas",
      subject: "portuguese",
    },
    {
      id: "addition",
      name: "Adição",
      trail: "Bosque da Matemática",
      subject: "math",
    },
    {
      id: "subtraction",
      name: "Subtração",
      trail: "Bosque da Matemática",
      subject: "math",
    },
    {
      id: "counting",
      name: "Contagem",
      trail: "Bosque da Matemática",
      subject: "math",
    },
  ];

  for (const activity of activities) {
    await execute(
      `
        INSERT INTO activities (
          id,
          name,
          trail,
          subject
        )
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          name = VALUES(name),
          trail = VALUES(trail),
          subject = VALUES(subject)
      `,
      [
        activity.id,
        activity.name,
        activity.trail,
        activity.subject,
      ]
    );
  }

  console.log("Atividades iniciais verificadas com sucesso.");
}

/* =========================================================
   FUNÇÃO AUXILIAR
========================================================= */

async function execute(
  sql: string,
  values: any[] = []
) {
  const connection = await mysql.createConnection({
    ...dbConfig,
    database: databaseName,
  });

  try {
    await connection.execute(sql, values);
  } finally {
    await connection.end();
  }
}

/* =========================================================
   INICIALIZAÇÃO COMPLETA
========================================================= */

export async function initializeDatabase() {
  console.log("Inicializando banco de dados...");

  await createDatabaseIfNotExists();
  await createTables();
  await seedActivities();

  console.log("Banco de dados pronto.");
}