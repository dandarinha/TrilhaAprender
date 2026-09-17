import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/* ─────────────────────────────────────────────
   TIPOS
───────────────────────────────────────────── */

export type PlayerHistory = {
  id: string;
  name: string;
  stars: number;
  completedCount: number;
  date: string;
};

export type TrailColor = "red" | "blue" | "yellow" | null;

export type Subject = "portuguese" | "math" | null;

export type GameScreen =
  | "start"
  | "name-input"
  | "trail-select"
  | "forest"
  | "animal"
  | "minigame"
  | "reward";

export interface GameState {
  playerName: string;
  selectedTrail: TrailColor;
  subject: Subject;
  stars: number;
  currentScreen: GameScreen;
  currentAnimal: string | null;
  completedActivities: string[];
}

export interface GameContextType {
  state: GameState;
  history: PlayerHistory[];

  setPlayerName: (name: string) => void;
  selectTrail: (trail: TrailColor) => void;
  setSubject: (subject: Subject) => void;
  goToScreen: (screen: GameScreen) => void;
  addStars: (amount: number) => void;
  completeActivity: (activityId: string) => void;

  saveCurrentSession: () => void;
  clearHistory: () => void;
  resetGame: () => void;
}

/* ─────────────────────────────────────────────
   CONTEXTO
───────────────────────────────────────────── */

export const GameContext = createContext<GameContextType | undefined>(
  undefined
);

/* ─────────────────────────────────────────────
   ESTADO INICIAL
───────────────────────────────────────────── */

export const initialState: GameState = {
  playerName: "",
  selectedTrail: null,
  subject: null,
  stars: 0,
  currentScreen: "start",
  currentAnimal: null,
  completedActivities: [],
};

/* ─────────────────────────────────────────────
   CONFIGURAÇÕES
───────────────────────────────────────────── */

const HISTORY_STORAGE_KEY = "trilha_aprender_history";

/* ─────────────────────────────────────────────
   FUNÇÕES AUXILIARES
───────────────────────────────────────────── */

function generateId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

function isValidHistory(value: unknown): value is PlayerHistory[] {
  if (!Array.isArray(value)) {
    return false;
  }

  return value.every((item) => {
    if (!item || typeof item !== "object") {
      return false;
    }

    const player = item as Partial<PlayerHistory>;

    return (
      typeof player.id === "string" &&
      typeof player.name === "string" &&
      typeof player.stars === "number" &&
      typeof player.completedCount === "number" &&
      typeof player.date === "string"
    );
  });
}

/* ─────────────────────────────────────────────
   PROVIDER
───────────────────────────────────────────── */

export function GameProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, setState] = useState<GameState>(initialState);

  const [history, setHistory] = useState<PlayerHistory[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    try {
      const savedHistory = localStorage.getItem(
        HISTORY_STORAGE_KEY
      );

      if (!savedHistory) {
        return [];
      }

      const parsedHistory: unknown = JSON.parse(savedHistory);

      return isValidHistory(parsedHistory)
        ? parsedHistory
        : [];
    } catch {
      return [];
    }
  });

  /* ─────────────────────────────────────────
     SALVAR HISTÓRICO NO LOCALSTORAGE
  ───────────────────────────────────────── */

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      localStorage.setItem(
        HISTORY_STORAGE_KEY,
        JSON.stringify(history)
      );
    } catch {
      // Evita que o jogo quebre caso o armazenamento esteja indisponível.
    }
  }, [history]);

  /* ─────────────────────────────────────────
     JOGADOR
  ───────────────────────────────────────── */

  const setPlayerName = (name: string) => {
    setState((previousState) => ({
      ...previousState,
      playerName: name.trim(),
    }));
  };

  /* ─────────────────────────────────────────
     TRILHAS
  ───────────────────────────────────────── */

  const selectTrail = (trail: TrailColor) => {
    /*
      As três trilhas existem para as duas matérias:

      Português:
      - Trilha Vermelha
      - Trilha Azul
      - Trilha Amarela

      Matemática:
      - Trilha Vermelha
      - Trilha Azul
      - Trilha Amarela

      A cor da trilha não define a matéria.
    */

    setState((previousState) => ({
      ...previousState,
      selectedTrail: trail,
    }));
  };

  /* ─────────────────────────────────────────
     MATÉRIAS
  ───────────────────────────────────────── */

  const setSubject = (subject: Subject) => {
    setState((previousState) => ({
      ...previousState,
      subject,
    }));
  };

  /* ─────────────────────────────────────────
     NAVEGAÇÃO
  ───────────────────────────────────────── */

  const goToScreen = (screen: GameScreen) => {
    setState((previousState) => ({
      ...previousState,
      currentScreen: screen,
    }));
  };

  /* ─────────────────────────────────────────
     ESTRELAS
  ───────────────────────────────────────── */

  const addStars = (amount: number) => {
    if (!Number.isFinite(amount)) {
      return;
    }

    setState((previousState) => ({
      ...previousState,
      stars: Math.max(
        0,
        previousState.stars + Math.round(amount)
      ),
    }));
  };

  /* ─────────────────────────────────────────
     ATIVIDADES
  ───────────────────────────────────────── */

  const completeActivity = (activityId: string) => {
    const normalizedId = activityId.trim();

    if (!normalizedId) {
      return;
    }

    setState((previousState) => {
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
  };

  /* ─────────────────────────────────────────
     SALVAR SESSÃO
  ───────────────────────────────────────── */

  const saveCurrentSession = () => {
    const playerName = state.playerName.trim();

    if (!playerName) {
      return;
    }

    const normalizedName = playerName.toLowerCase();

    const newRecord: PlayerHistory = {
      id: generateId(),
      name: playerName,
      stars: Math.max(0, state.stars),
      completedCount: state.completedActivities.length,
      date: new Date().toLocaleDateString("pt-BR"),
    };

    setHistory((previousHistory) => {
      const existingStudentIndex = previousHistory.findIndex(
        (student) =>
          student.name.trim().toLowerCase() === normalizedName
      );

      /*
        Se o aluno ainda não existe, ele é adicionado ao mural.
      */
      if (existingStudentIndex === -1) {
        return [newRecord, ...previousHistory];
      }

      /*
        Se o aluno já existe, atualiza seus dados sem criar
        um card duplicado no mural.
      */
      const updatedHistory = [...previousHistory];

      const existingStudent =
        updatedHistory[existingStudentIndex];

      updatedHistory[existingStudentIndex] = {
        ...existingStudent,
        name: playerName,
        stars: Math.max(
          existingStudent.stars,
          newRecord.stars
        ),
        completedCount: Math.max(
          existingStudent.completedCount,
          newRecord.completedCount
        ),
        date: newRecord.date,
      };

      return updatedHistory;
    });
  };

  /* ─────────────────────────────────────────
     LIMPAR HISTÓRICO
  ───────────────────────────────────────── */

  const clearHistory = () => {
    setHistory([]);
  };

  /* ─────────────────────────────────────────
     RESETAR JOGO
  ───────────────────────────────────────── */

  const resetGame = () => {
    setState({
      ...initialState,
      completedActivities: [],
    });
  };

  /* ─────────────────────────────────────────
     PROVIDER
  ───────────────────────────────────────── */

  return (
    <GameContext.Provider
      value={{
        state,
        history,
        setPlayerName,
        selectTrail,
        setSubject,
        goToScreen,
        addStars,
        completeActivity,
        saveCurrentSession,
        clearHistory,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

/* ─────────────────────────────────────────────
   HOOK PERSONALIZADO
───────────────────────────────────────────── */

export function useGame(): GameContextType {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error(
      "useGame deve ser utilizado dentro de GameProvider."
    );
  }

  return context;
}