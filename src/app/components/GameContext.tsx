import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/* ============================================================
   TIPOS
============================================================ */

export type Student = {
  id: string;
  name: string;
  className: string | null;
  paws: number;
  createdAt: string;
  lastAccess: string | null;
  playedActivitiesCount?: number;
};

export type PlayerHistory = Student;

export type TrailColor =
  | "red"
  | "blue"
  | "yellow"
  | null;

export type Subject =
  | "portuguese"
  | "math"
  | null;

export type GameScreen =
  | "start"
  | "name-input"
  | "trail-select"
  | "forest"
  | "animal"
  | "minigame"
  | "reward";

export interface GameState {
  studentId: string | null;
  playerName: string;
  selectedTrail: TrailColor;
  subject: Subject;
  paws: number;
  currentScreen: GameScreen;
  currentAnimal: string | null;
}

export interface GameContextType {
  state: GameState;

  /**
   * Alunos cadastrados pelo professor.
   */
  history: PlayerHistory[];

  /**
   * Seleciona um aluno existente e inicia uma sessão.
   */
  setPlayerName: (name: string) => Promise<void>;

  /**
   * Atualiza a lista de alunos.
   */
  refreshStudents: () => Promise<void>;

  selectTrail: (trail: TrailColor) => void;

  setSubject: (subject: Subject) => void;

  goToScreen: (screen: GameScreen) => void;

  /**
   * Adiciona patinhas.
   *
   * O valor enviado ao backend é um DELTA.
   * Exemplo: addPaws(1) adiciona uma patinha.
   *
   * A pontuação oficial permanece no MySQL.
   */
  addPaws: (amount: number) => Promise<void>;

  /**
   * Registra uma atividade que foi jogada.
   *
   * Não representa conclusão.
   * A mesma atividade pode ser registrada várias vezes.
   */
  playActivity: (activityId: string) => Promise<void>;

  /**
   * Finaliza somente a sessão atual.
   */
  saveCurrentSession: () => Promise<void>;

  /**
   * Limpa somente o estado local.
   */
  resetGame: () => void;
}

/* ============================================================
   CONTEXTO
============================================================ */

export const GameContext =
  createContext<GameContextType | undefined>(undefined);

/* ============================================================
   ESTADO INICIAL
============================================================ */

export const initialState: GameState = {
  studentId: null,
  playerName: "",
  selectedTrail: null,
  subject: null,
  paws: 0,
  currentScreen: "start",
  currentAnimal: null,
};

/* ============================================================
   API
============================================================ */

const API_BASE_URL = "http://localhost:3000/api";

/* ============================================================
   TIPOS INTERNOS
============================================================ */

type PerformanceActivity = {
  id: string;
  name: string;
  trail: string;
  subject: string;
  played_at: string;
};

type PerformanceSession = {
  id: number;
  paws: number;
  started_at: string;
  finished_at: string | null;
};

type PerformanceResponse = {
  student: Student;

  statistics?: {
    playedActivitiesCount?: number;
    sessionsCount?: number;
  };

  activities?: PerformanceActivity[];

  sessions?: PerformanceSession[];
};

/* ============================================================
   PROVIDER
============================================================ */

export function GameProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, setState] =
    useState<GameState>(initialState);

  const [history, setHistory] = useState<
    PlayerHistory[]
  >([]);

  /* ==========================================================
     BUSCAR DESEMPENHO
  ========================================================== */

  const fetchStudentPerformance = useCallback(
    async (
      studentId: string
    ): Promise<PerformanceResponse | null> => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/students/${encodeURIComponent(
            studentId
          )}/performance`
        );

        if (!response.ok) {
          console.error(
            `Não foi possível carregar o desempenho do aluno ${studentId}.`
          );

          return null;
        }

        const performance =
          (await response.json()) as PerformanceResponse;

        return performance;
      } catch (error: unknown) {
        console.error(
          "Erro ao buscar desempenho do aluno:",
          error
        );

        return null;
      }
    },
    []
  );

  /* ==========================================================
     ATUALIZAR LISTA DE ALUNOS

     Importante:
     - /students é a fonte principal;
     - performance complementa os dados;
     - atividades são contadas como JOGADAS;
     - não existe atividade concluída.
  ========================================================== */

  const refreshStudents = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/students`
      );

      if (!response.ok) {
        throw new Error(
          "Não foi possível carregar os alunos."
        );
      }

      const students =
        (await response.json()) as Student[];

      const studentsWithPerformance =
        await Promise.all(
          students.map(async (student) => {
            const performance =
              await fetchStudentPerformance(student.id);

            if (!performance) {
              return {
                ...student,
                paws: Number(student.paws) || 0,
                playedActivitiesCount: 0,
              };
            }

            const performancePaws =
              Number(performance.student?.paws);

            const studentPaws =
              Number(student.paws);

            const playedActivitiesCount =
              Number(
                performance.statistics
                  ?.playedActivitiesCount
              );

            return {
              ...student,

              paws: Number.isFinite(performancePaws)
                ? performancePaws
                : Number.isFinite(studentPaws)
                  ? studentPaws
                  : 0,

              playedActivitiesCount:
                Number.isFinite(
                  playedActivitiesCount
                )
                  ? playedActivitiesCount
                  : 0,
            };
          })
        );

      setHistory(studentsWithPerformance);

      /*
       * Se o aluno atualmente selecionado ainda existir,
       * mantém suas patinhas sincronizadas no estado local.
       */
      setState((previousState) => {
        if (!previousState.studentId) {
          return previousState;
        }

        const currentStudent =
          studentsWithPerformance.find(
            (student) =>
              student.id === previousState.studentId
          );

        if (!currentStudent) {
          return previousState;
        }

        return {
          ...previousState,
          paws: Number(currentStudent.paws) || 0,
          playerName: currentStudent.name,
        };
      });
    } catch (error: unknown) {
      console.error(
        "Erro ao atualizar lista de alunos:",
        error
      );

      throw error;
    }
  }, [fetchStudentPerformance]);

  /* ==========================================================
     CARREGAMENTO INICIAL
  ========================================================== */

  useEffect(() => {
    refreshStudents().catch((error: unknown) => {
      console.error(
        "Não foi possível carregar os alunos inicialmente:",
        error
      );
    });
  }, [refreshStudents]);

  /* ==========================================================
     SELECIONAR ALUNO
  ========================================================== */

  const setPlayerName = useCallback(
    async (name: string) => {
      const trimmedName = name.trim();

      if (!trimmedName) {
        throw new Error(
          "Nome do aluno é obrigatório."
        );
      }

      /*
       * O jogo NÃO cadastra alunos.
       *
       * Só é permitido selecionar alguém
       * previamente cadastrado pelo professor.
       */
      const student = history.find(
        (item) =>
          item.name.trim().toLowerCase() ===
          trimmedName.toLowerCase()
      );

      if (!student) {
        throw new Error(
          "Aluno não cadastrado. Solicite o cadastro à professora."
        );
      }

      try {
        /* ------------------------------------------------------
           INICIAR SESSÃO
        ------------------------------------------------------ */

        const sessionResponse = await fetch(
          `${API_BASE_URL}/students/${encodeURIComponent(
            student.id
          )}/session`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const sessionData =
          await sessionResponse
            .json()
            .catch(() => ({}));

        if (!sessionResponse.ok) {
          throw new Error(
            sessionData.error ||
              "Não foi possível iniciar a sessão."
          );
        }

        /* ------------------------------------------------------
           BUSCAR DADOS ATUAIS
        ------------------------------------------------------ */

        const performance =
          await fetchStudentPerformance(student.id);

        const performancePaws =
          Number(performance?.student?.paws);

        const currentPaws =
          Number.isFinite(performancePaws)
            ? performancePaws
            : Number(student.paws) || 0;

        /* ------------------------------------------------------
           ATUALIZAR ESTADO
        ------------------------------------------------------ */

        setState((previousState) => ({
          ...previousState,

          studentId: student.id,

          playerName: student.name,

          paws: currentPaws,
        }));

        /*
         * Atualiza os dados do mural.
         *
         * Não interfere no cadastro.
         */
        await refreshStudents();
      } catch (error: unknown) {
        console.error(
          "Erro ao selecionar aluno:",
          error
        );

        throw error;
      }
    },
    [
      history,
      fetchStudentPerformance,
      refreshStudents,
    ]
  );

  /* ==========================================================
     SELECIONAR TRILHA
  ========================================================== */

  const selectTrail = useCallback(
    (trail: TrailColor) => {
      setState((previousState) => ({
        ...previousState,
        selectedTrail: trail,
      }));
    },
    []
  );

  /* ==========================================================
     DEFINIR MATÉRIA
  ========================================================== */

  const setSubject = useCallback(
    (subject: Subject) => {
      setState((previousState) => ({
        ...previousState,
        subject,
      }));
    },
    []
  );

  /* ==========================================================
     ALTERAR TELA
  ========================================================== */

  const goToScreen = useCallback(
    (screen: GameScreen) => {
      setState((previousState) => ({
        ...previousState,
        currentScreen: screen,
      }));
    },
    []
  );

  /* ==========================================================
     ADICIONAR PATINHAS

     O frontend envia SOMENTE o delta.

     Exemplo:

       addPaws(1)
       addPaws(1)

     O backend faz:

       paws = paws + amount

     A API é a fonte oficial da pontuação.
  ========================================================== */

  const addPaws = useCallback(
    async (amount: number) => {
      if (!Number.isFinite(amount)) {
        return;
      }

      const delta = Math.round(amount);

      if (delta === 0) {
        return;
      }

      const studentId = state.studentId;

      if (!studentId) {
        console.warn(
          "Tentativa de adicionar patinhas sem aluno selecionado."
        );

        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/students/${encodeURIComponent(
            studentId
          )}/paws`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              amount: delta,
            }),
          }
        );

        const data =
          await response
            .json()
            .catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Não foi possível atualizar as patinhas."
          );
        }

        const savedPaws = Number(data.paws);

        /*
         * O backend retorna o valor efetivamente
         * salvo no banco.
         */
        if (Number.isFinite(savedPaws)) {
          setState((previousState) => {
            /*
             * Evita atualizar uma sessão diferente
             * caso o usuário tenha trocado de perfil
             * enquanto a requisição estava pendente.
             */
            if (
              previousState.studentId !== studentId
            ) {
              return previousState;
            }

            return {
              ...previousState,
              paws: savedPaws,
            };
          });
        }
      } catch (error: unknown) {
        console.error(
          "Erro ao atualizar patinhas:",
          error
        );

        throw error;
      }
    },
    [state.studentId]
  );

  /* ==========================================================
     REGISTRAR ATIVIDADE JOGADA

     NÃO existe conclusão.

     Cada entrada na atividade pode gerar um registro.

     Exemplo:

       Rimas
       Rimas
       Rimas
       Adição
  ========================================================== */

  const playActivity = useCallback(
    async (activityId: string) => {
      const normalizedId =
        activityId.trim();

      if (!normalizedId) {
        return;
      }

      const studentId = state.studentId;

      if (!studentId) {
        console.warn(
          "Tentativa de registrar atividade sem aluno selecionado."
        );

        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/students/${encodeURIComponent(
            studentId
          )}/activities`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              activityId: normalizedId,
            }),
          }
        );

        const data =
          await response
            .json()
            .catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Não foi possível registrar a atividade jogada."
          );
        }

        /*
         * Não adiciona patinhas.
         *
         * Patinhas só são concedidas por handleCorrect().
         */
      } catch (error: unknown) {
        console.error(
          "Erro ao registrar atividade jogada:",
          error
        );

        throw error;
      }
    },
    [state.studentId]
  );

  /* ==========================================================
     FINALIZAR SESSÃO

     Apenas a SESSÃO é encerrada.

     O frontend NÃO envia paws.
     O backend consulta students.paws,
     que é a fonte oficial da pontuação.
  ========================================================== */

  const saveCurrentSession = useCallback(
    async () => {
      const studentId = state.studentId;

      if (!studentId) {
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/students/${encodeURIComponent(
            studentId
          )}/session/finish`,
          {
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json",
            },
          }
        );

        const data =
          await response
            .json()
            .catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Não foi possível finalizar a sessão."
          );
        }

        /*
         * Atualiza o mural após o encerramento.
         *
         * Não fazemos reset aqui.
         * Quem decide quando limpar o estado
         * é o fluxo de troca/saída do jogo.
         */
        await refreshStudents();
      } catch (error: unknown) {
        console.error(
          "Erro ao finalizar sessão:",
          error
        );

        throw error;
      }
    },
    [
      state.studentId,
      refreshStudents,
    ]
  );

  /* ==========================================================
     RESETAR JOGO

     Somente estado local.

     NÃO:
       - exclui aluno;
       - remove patinhas;
       - remove atividades;
       - remove sessões;
       - altera MySQL.
  ========================================================== */

  const resetGame = useCallback(() => {
    setState({
      ...initialState,
    });
  }, []);

  /* ==========================================================
     CONTEXTO
  ========================================================== */

  return (
    <GameContext.Provider
      value={{
        state,
        history,

        setPlayerName,
        refreshStudents,

        selectTrail,
        setSubject,
        goToScreen,

        addPaws,
        playActivity,

        saveCurrentSession,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

/* ============================================================
   HOOK
============================================================ */

export function useGame(): GameContextType {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error(
      "useGame deve ser utilizado dentro de GameProvider."
    );
  }

  return context;
}
