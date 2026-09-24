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
  paws: number;
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
  paws: number;
  currentScreen: GameScreen;
  currentAnimal: string | null;
  completedActivities: string[];
}

export interface GameContextType {
  state: GameState;
  history: PlayerHistory[];

  setPlayerName: (name: string) => Promise<void>;
  selectTrail: (trail: TrailColor) => void;
  setSubject: (subject: Subject) => void;
  goToScreen: (screen: GameScreen) => void;
  addPaws: (amount: number) => void;
  completeActivity: (activityId: string) => void;

  saveCurrentSession: () => Promise<void>;
  clearHistory: () => Promise<void>;
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
  paws: 0,
  currentScreen: "start",
  currentAnimal: null,
  completedActivities: [],
};

/* ─────────────────────────────────────────────
   CONFIGURAÇÕES DE API
───────────────────────────────────────────── */

const API_BASE_URL = "http://localhost:3000/api";

/* ─────────────────────────────────────────────
   PROVIDER
───────────────────────────────────────────── */

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(initialState);
  const [history, setHistory] = useState<PlayerHistory[]>([]);

  /* ─────────────────────────────────────────
     BUSCAR ALUNOS / HISTÓRICO DO MYSQL
  ───────────────────────────────────────── */

  const fetchHistory = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/students`);
      if (response.ok) {
        const data: PlayerHistory[] = await response.json();
        setHistory(data);
      } else {
        console.error("Erro ao buscar lista de alunos na API:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao carregar lista de alunos do MySQL:", error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  /* ─────────────────────────────────────────
     DEFINIR / SELECIONAR JOGADOR E REGISTAR SESSÃO NO BANCO
  ───────────────────────────────────────── */

  const setPlayerName = async (name: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    const normalizedName = trimmedName.toLowerCase();

    // 1. Localiza se o aluno já existe no cadastro
    const existingStudent = history.find(
      (student) => student.name.trim().toLowerCase() === normalizedName
    );

    if (!existingStudent) {
      throw new Error("Aluno não cadastrado. Solicite o cadastro à professora.");
    }

    // 2. Envia a sessão para o backend (MySQL)
    try {
      const response = await fetch(`${API_BASE_URL}/students/session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: existingStudent.name,
          paws: existingStudent.paws,
          completedCount: existingStudent.completedCount,
          date: new Date().toLocaleDateString("pt-BR"),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Não foi possível iniciar a sessão no servidor.");
      }

      // 3. Atualiza o estado local apenas se o backend confirmar
      setState((previousState) => ({
        ...previousState,
        playerName: existingStudent.name,
        paws: existingStudent.paws,
      }));

      // 4. Recarrega o histórico para sincronizar os dados atualizados
      await fetchHistory();
    } catch (error) {
      console.error("Erro ao registar sessão no MySQL:", error);
      // RE-LANÇA O ERRO para que o NameInputScreen exiba a mensagem na tela!
      throw error;
    }
  };

  /* ─────────────────────────────────────────
     TRILHAS
  ───────────────────────────────────────── */

  const selectTrail = (trail: TrailColor) => {
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
     PATINHAS (ADICIONAR PONTOS)
  ───────────────────────────────────────── */

  const addPaws = (amount: number) => {
    if (!Number.isFinite(amount)) return;

    const delta = Math.round(amount);

    setState((previousState) => {
      const updatedPaws = Math.max(0, previousState.paws + delta);

      // Sincroniza em tempo real com o backend usando o estado mais recente
      if (previousState.playerName) {
        fetch(`${API_BASE_URL}/students/paws`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            playerName: previousState.playerName,
            paws: updatedPaws,
          }),
        }).catch((err) => console.error("Erro ao sincronizar patinhas:", err));
      }

      return {
        ...previousState,
        paws: updatedPaws,
      };
    });
  };

  /* ─────────────────────────────────────────
     ATIVIDADES
  ───────────────────────────────────────── */

  const completeActivity = (activityId: string) => {
    const normalizedId = activityId.trim();
    if (!normalizedId) return;

    setState((previousState) => {
      if (previousState.completedActivities.includes(normalizedId)) {
        return previousState;
      }

      const updatedActivities = [...previousState.completedActivities, normalizedId];

      // Sincroniza progresso com a API usando o estado mais recente
      if (previousState.playerName) {
        fetch(`${API_BASE_URL}/students/activity`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            playerName: previousState.playerName,
            completedCount: updatedActivities.length,
          }),
        }).catch((err) => console.error("Erro ao sincronizar atividade:", err));
      }

      return {
        ...previousState,
        completedActivities: updatedActivities,
      };
    });
  };

  /* ─────────────────────────────────────────
     SALVAR SESSÃO COMPLETA NA API
  ───────────────────────────────────────── */

  const saveCurrentSession = async () => {
    const playerName = state.playerName.trim();
    if (!playerName) return;

    try {
      const response = await fetch(`${API_BASE_URL}/students/session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: playerName,
          paws: state.paws,
          completedCount: state.completedActivities.length,
          date: new Date().toLocaleDateString("pt-BR"),
        }),
      });

      if (response.ok) {
        await fetchHistory();
      } else {
        console.error("Erro ao salvar sessão no servidor:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao salvar sessão no MySQL:", error);
    }
  };

  /* ─────────────────────────────────────────
     LIMPAR HISTÓRICO
  ───────────────────────────────────────── */

  const clearHistory = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/students`, {
        method: "DELETE",
      });

      if (response.ok) {
        setHistory([]);
      } else {
        console.error("Erro ao limpar histórico no servidor.");
      }
    } catch (error) {
      console.error("Erro ao limpar histórico no MySQL:", error);
    }
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

  return (
    <GameContext.Provider
      value={{
        state,
        history,
        setPlayerName,
        selectTrail,
        setSubject,
        goToScreen,
        addPaws,
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
    throw new Error("useGame deve ser utilizado dentro de GameProvider.");
  }

  return context;
}