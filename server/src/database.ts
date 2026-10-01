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
  /* ---------------------------------------------------------
     ALUNOS
  --------------------------------------------------------- */

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

  /* ---------------------------------------------------------
     ATIVIDADES
  --------------------------------------------------------- */

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

  /* ---------------------------------------------------------
     ATIVIDADES JOGADAS
     
     IMPORTANTE:
     
     Não existe:
       - completed_at
       - UNIQUE(student_id, activity_id)
     
     O mesmo aluno pode jogar a mesma atividade
     quantas vezes quiser.
  --------------------------------------------------------- */

  await execute(`
    CREATE TABLE IF NOT EXISTS student_activities (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      student_id VARCHAR(36) NOT NULL,
      activity_id VARCHAR(100) NOT NULL,
      played_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

      PRIMARY KEY (id),

      KEY idx_student_activities_student (
        student_id
      ),

      KEY idx_student_activities_activity (
        activity_id
      ),

      KEY idx_student_activities_played_at (
        played_at
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

  /* ---------------------------------------------------------
     SESSÕES
  --------------------------------------------------------- */

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

      KEY idx_game_sessions_active (
        student_id,
        finished_at
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

  console.log(
    "Tabelas do jogo verificadas com sucesso."
  );
}

/* =========================================================
   MIGRAÇÃO DA TABELA DE ATIVIDADES
========================================================= */

/**
 * Atualiza bancos que já foram criados com a
 * estrutura antiga.
 *
 * Estrutura antiga:
 *
 * student_activities
 * ├── completed_at
 * └── UNIQUE(student_id, activity_id)
 *
 * Estrutura nova:
 *
 * student_activities
 * ├── played_at
 * └── sem UNIQUE(student_id, activity_id)
 */

async function migrateStudentActivities() {
  console.log(
    "Verificando estrutura de student_activities..."
  );

  /*
   * Descobre se a tabela existe.
   */
  const [tableRows] = await executeQuery(
    `
      SELECT COUNT(*) AS count
      FROM information_schema.tables
      WHERE table_schema = ?
        AND table_name = 'student_activities'
    `,
    [databaseName]
  );

  const tableExists =
    Number(
      (tableRows as any[])[0]?.count ?? 0
    ) > 0;

  if (!tableExists) {
    console.log(
      "student_activities ainda não existe. Será criada pela inicialização."
    );

    return;
  }

  /* ---------------------------------------------------------
     VERIFICAR COLUNAS
  --------------------------------------------------------- */

  const [columnRows] =
    await executeQuery(
      `
        SELECT
          column_name
        FROM information_schema.columns
        WHERE table_schema = ?
          AND table_name = 'student_activities'
      `,
      [databaseName]
    );

  const columns = new Set(
    (columnRows as any[]).map(
      (row) => row.column_name
    )
  );

  /* ---------------------------------------------------------
     RENOMEAR completed_at → played_at
  --------------------------------------------------------- */

  if (
    columns.has("completed_at") &&
    !columns.has("played_at")
  ) {
    console.log(
      "Migrando completed_at para played_at..."
    );

    await execute(`
      ALTER TABLE student_activities
      CHANGE COLUMN completed_at
      played_at DATETIME NOT NULL
      DEFAULT CURRENT_TIMESTAMP
    `);
  }

  /* ---------------------------------------------------------
     SE NÃO EXISTIR played_at, CRIAR
  --------------------------------------------------------- */

  const [updatedColumnRows] =
    await executeQuery(
      `
        SELECT
          column_name
        FROM information_schema.columns
        WHERE table_schema = ?
          AND table_name = 'student_activities'
      `,
      [databaseName]
    );

  const updatedColumns = new Set(
    (updatedColumnRows as any[]).map(
      (row) => row.column_name
    )
  );

  if (!updatedColumns.has("played_at")) {
    console.log(
      "Criando coluna played_at..."
    );

    await execute(`
      ALTER TABLE student_activities
      ADD COLUMN played_at DATETIME NOT NULL
      DEFAULT CURRENT_TIMESTAMP
      AFTER activity_id
    `);
  }

  /* ---------------------------------------------------------
     REMOVER ÍNDICE UNIQUE ANTIGO
  --------------------------------------------------------- */

  const [indexRows] =
    await executeQuery(
      `
        SELECT
          index_name,
          non_unique
        FROM information_schema.statistics
        WHERE table_schema = ?
          AND table_name = 'student_activities'
      `,
      [databaseName]
    );

  const indexes =
    indexRows as Array<{
      index_name: string;
      non_unique: number;
    }>;

  const uniqueStudentActivityIndexes =
    indexes.filter(
      (index) =>
        index.non_unique === 0 &&
        index.index_name !== "PRIMARY" &&
        index.index_name !== "uq_student_activity"
    );

  /*
   * Remove especificamente o índice antigo
   * quando ele existir.
   */
  const oldUniqueIndex = indexes.find(
    (index) =>
      index.index_name ===
      "uq_student_activity"
  );

  if (oldUniqueIndex) {
    console.log(
      "Removendo restrição antiga de atividade única..."
    );

    await execute(`
      ALTER TABLE student_activities
      DROP INDEX uq_student_activity
    `);
  }

  /*
   * Também verificamos possíveis índices UNIQUE
   * equivalentes criados com outro nome.
   */
  for (const index of uniqueStudentActivityIndexes) {
    const [indexColumns] =
      await executeQuery(
        `
          SELECT
            column_name
          FROM information_schema.statistics
          WHERE table_schema = ?
            AND table_name = 'student_activities'
            AND index_name = ?
          ORDER BY seq_in_index
        `,
        [
          databaseName,
          index.index_name,
        ]
      );

    const columnNames =
      (indexColumns as any[]).map(
        (row) => row.column_name
      );

    const isStudentActivityUnique =
      columnNames.length === 2 &&
      columnNames.includes(
        "student_id"
      ) &&
      columnNames.includes(
        "activity_id"
      );

    if (isStudentActivityUnique) {
      console.log(
        `Removendo índice UNIQUE antigo: ${index.index_name}`
      );

      await execute(`
        ALTER TABLE student_activities
        DROP INDEX \`${index.index_name}\`
      `);
    }
  }

  /*
   * Índices normais para consultas de desempenho.
   */
  await ensureIndex(
    "student_activities",
    "idx_student_activities_student",
    `
      CREATE INDEX idx_student_activities_student
      ON student_activities(student_id)
    `
  );

  await ensureIndex(
    "student_activities",
    "idx_student_activities_activity",
    `
      CREATE INDEX idx_student_activities_activity
      ON student_activities(activity_id)
    `
  );

  await ensureIndex(
    "student_activities",
    "idx_student_activities_played_at",
    `
      CREATE INDEX idx_student_activities_played_at
      ON student_activities(played_at)
    `
  );

  console.log(
    "Estrutura de student_activities atualizada."
  );
}

/* =========================================================
   ÍNDICES
========================================================= */

async function ensureIndex(
  tableName: string,
  indexName: string,
  createSql: string
) {
  const [rows] =
    await executeQuery(
      `
        SELECT COUNT(*) AS count
        FROM information_schema.statistics
        WHERE table_schema = ?
          AND table_name = ?
          AND index_name = ?
      `,
      [
        databaseName,
        tableName,
        indexName,
      ]
    );

  const exists =
    Number(
      (rows as any[])[0]?.count ?? 0
    ) > 0;

  if (!exists) {
    await execute(createSql);
  }
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

  console.log(
    "Atividades iniciais verificadas com sucesso."
  );
}

/* =========================================================
   FUNÇÃO AUXILIAR
========================================================= */

async function execute(
  sql: string,
  values: any[] = []
) {
  const connection =
    await mysql.createConnection({
      ...dbConfig,
      database: databaseName,
    });

  try {
    await connection.execute(
      sql,
      values
    );
  } finally {
    await connection.end();
  }
}

/* =========================================================
   EXECUTAR QUERY E RETORNAR RESULTADO
========================================================= */

async function executeQuery(
  sql: string,
  values: any[] = []
) {
  const connection =
    await mysql.createConnection({
      ...dbConfig,
      database: databaseName,
    });

  try {
    return await connection.execute(
      sql,
      values
    );
  } finally {
    await connection.end();
  }
}

/* =========================================================
   INICIALIZAÇÃO COMPLETA
========================================================= */

export async function initializeDatabase() {
  console.log(
    "Inicializando banco de dados..."
  );

  await createDatabaseIfNotExists();

  await createTables();

  /*
   * Muito importante:
   *
   * createTables() não modifica tabelas que já existem.
   *
   * Por isso a migração vem depois.
   */
  await migrateStudentActivities();

  await seedActivities();

  console.log(
    "Banco de dados pronto."
  );
}