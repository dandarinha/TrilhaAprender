import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Student = {
  id: string;
  name: string;
  className: string | null;
  paws: number;
  createdAt: string;
  lastAccess: string | null;
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
  completedActivities: string[];
}

export interface GameContextType {
  state: GameState;
  history: PlayerHistory[];

  setPlayerName: (name: string) => Promise<void>;
  refreshStudents: () => Promise<void>;

  selectTrail: (trail: TrailColor) => void;
  setSubject: (subject: Subject) => void;
  goToScreen: (screen: GameScreen) => void;

  addPaws: (amount: number) => Promise<void>;
  completeActivity: (activityId: string) => Promise<void>;

  saveCurrentSession: () => Promise<void>;
  resetGame: () => void;
}

export const GameContext =
  createContext<GameContextType | undefined>(
    undefined
  );

export const initialState: GameState = {
  studentId: null,
  playerName: "",
  selectedTrail: null,
  subject: null,
  paws: 0,
  currentScreen: "start",
  currentAnimal: null,
  completedActivities: [],
};

const API_BASE_URL =
  "http://localhost:3000/api";

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

  /**
   * Carrega os alunos diretamente da API.
   *
   * O cadastro dos alunos NÃO acontece aqui.
   * Esta função apenas consulta o MySQL através da API.
   */
  const refreshStudents = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/students`
      );

      if (!response.ok) {
        throw new Error(
          "Não foi possível carregar os alunos."
        );
      }

      const data: PlayerHistory[] =
        await response.json();

      setHistory(data);
    } catch (error) {
      console.error(
        "Erro ao carregar alunos:",
        error
      );
    }
  };

  /**
   * Carrega os alunos quando o GameProvider é iniciado.
   */
  useEffect(() => {
    refreshStudents();
  }, []);

  /**
   * Seleciona um aluno já cadastrado pelo professor.
   *
   * Não cria aluno.
   * Não salva aluno no localStorage.
   * A validação é feita com os alunos vindos da API/MySQL.
   */
  const setPlayerName = async (
    name: string
  ) => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      throw new Error(
        "Nome do aluno é obrigatório."
      );
    }

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
      /**
       * Inicia uma nova sessão para o aluno
       * já existente no banco.
       */
      const response = await fetch(
        `${API_BASE_URL}/students/${student.id}/session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Não foi possível iniciar a sessão."
        );
      }

      /**
       * O endpoint atual retorna apenas os dados
       * da sessão, não um objeto student.
       *
       * Portanto, usamos diretamente o aluno
       * que já foi encontrado na lista da API.
       */
      const selectedStudent = student;

      /**
       * Atualiza a lista de alunos para refletir
       * o lastAccess alterado pela sessão.
       */
      await refreshStudents();

      /**
       * Busca as atividades já concluídas
       * pelo aluno no MySQL.
       */
      const performanceResponse =
        await fetch(
          `${API_BASE_URL}/students/${student.id}/performance`
        );

      let completedActivities: string[] = [];

      if (performanceResponse.ok) {
        const performance =
          await performanceResponse.json();

        completedActivities = Array.isArray(
          performance.activities
        )
          ? performance.activities.map(
              (activity: {
                id: string;
              }) => activity.id
            )
          : [];
      }

      /**
       * Atualiza o estado da sessão atual.
       */
      setState((previousState) => ({
        ...previousState,
        studentId: selectedStudent.id,
        playerName: selectedStudent.name,
        paws:
          Number(selectedStudent.paws) || 0,
        completedActivities,
        currentScreen:
          previousState.currentScreen,
      }));
    } catch (error) {
      console.error(
        "Erro ao selecionar aluno:",
        error
      );

      throw error;
    }
  };

  /**
   * Seleciona a trilha.
   */
  const selectTrail = (
    trail: TrailColor
  ) => {
    setState((previousState) => ({
      ...previousState,
      selectedTrail: trail,
    }));
  };

  /**
   * Define a matéria.
   */
  const setSubject = (
    subject: Subject
  ) => {
    setState((previousState) => ({
      ...previousState,
      subject,
    }));
  };

  /**
   * Altera a tela atual do jogo.
   */
  const goToScreen = (
    screen: GameScreen
  ) => {
    setState((previousState) => ({
      ...previousState,
      currentScreen: screen,
    }));
  };

  /**
   * Adiciona ou remove patinhas.
   *
   * O valor atualizado é salvo no MySQL através da API.
   */
  const addPaws = async (
    amount: number
  ) => {
    if (!Number.isFinite(amount)) {
      return;
    }

    const delta = Math.round(amount);

    if (!state.studentId) {
      console.warn(
        "Tentativa de adicionar patinhas sem aluno selecionado."
      );

      return;
    }

    const updatedPaws = Math.max(
      0,
      state.paws + delta
    );

    try {
      const response = await fetch(
        `${API_BASE_URL}/students/${state.studentId}/paws`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paws: updatedPaws,
          }),
        }
      );

      const data = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Não foi possível atualizar as patinhas."
        );
      }

      setState((previousState) => ({
        ...previousState,
        paws:
          Number(data.paws) ||
          updatedPaws,
      }));

      /**
       * Mantém a lista de alunos sincronizada
       * com o banco.
       */
      await refreshStudents();
    } catch (error) {
      console.error(
        "Erro ao atualizar patinhas:",
        error
      );

      throw error;
    }
  };

  /**
   * Registra uma atividade concluída.
   *
   * O registro é salvo em student_activities
   * através da API.
   */
  const completeActivity = async (
    activityId: string
  ) => {
    const normalizedId =
      activityId.trim();

    if (!normalizedId) {
      return;
    }

    if (!state.studentId) {
      console.warn(
        "Tentativa de concluir atividade sem aluno selecionado."
      );

      return;
    }

    /**
     * Evita uma nova chamada caso a atividade
     * já tenha sido registrada nesta sessão.
     */
    if (
      state.completedActivities.includes(
        normalizedId
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/students/${state.studentId}/activities`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            activityId:
              normalizedId,
          }),
        }
      );

      const data = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Não foi possível registrar a atividade."
        );
      }

      setState((previousState) => {
        /**
         * Proteção contra duplicidade no estado
         * mesmo que a API seja chamada novamente.
         */
        if (
          previousState.completedActivities.includes(
            normalizedId
          )
        ) {
          return previousState;
        }

        return {
          ...previousState,
          completedActivities: [
            ...previousState.completedActivities,
            normalizedId,
          ],
        };
      });
    } catch (error) {
      console.error(
        "Erro ao registrar atividade:",
        error
      );

      throw error;
    }
  };

  /**
   * Finaliza a sessão atual.
   *
   * O encerramento é registrado no MySQL.
   */
  const saveCurrentSession =
    async () => {
      if (!state.studentId) {
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/students/${state.studentId}/session/finish`,
          {
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              paws: state.paws,
            }),
          }
        );

        const data = await response
          .json()
          .catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Não foi possível finalizar a sessão."
          );
        }

        /**
         * Atualiza os dados dos alunos depois
         * que a sessão foi encerrada.
         */
        await refreshStudents();
      } catch (error) {
        console.error(
          "Erro ao finalizar sessão:",
          error
        );

        throw error;
      }
    };

  /**
   * Volta o estado do jogo para o estado inicial.
   *
   * Não exclui o aluno do banco.
   * O cadastro continua existindo no MySQL.
   */
  const resetGame = () => {
    setState({
      ...initialState,
    });
  };

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
        completeActivity,

        saveCurrentSession,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextType {
  const context =
    useContext(GameContext);

  if (!context) {
    throw new Error(
      "useGame deve ser utilizado dentro de GameProvider."
    );
  }

  return context;
}