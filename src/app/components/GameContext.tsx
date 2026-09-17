import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type PlayerHistory = {
  id: string;
  name: string;
  stars: number;
  completedCount: number;
  date: string;
};

export type TrailColor = 'red' | 'blue' | 'yellow' | null;

export type GameScreen =
  | 'start'
  | 'name-input'
  | 'trail-select'
  | 'forest'
  | 'animal'
  | 'minigame'
  | 'reward';

export type Subject = 'portuguese' | 'math' | 'english' | null;

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
  goToScreen: (screen: GameScreen) => void;
  addStars: (amount: number) => void;
  completeActivity: (activityId: string) => void;
  saveCurrentSession: () => void;
  clearHistory: () => void;
  resetGame: () => void;
}

export const GameContext = createContext<GameContextType | undefined>(
  undefined
);

export const initialState: GameState = {
  playerName: '',
  selectedTrail: null,
  subject: null,
  stars: 0,
  currentScreen: 'start',
  currentAnimal: null,
  completedActivities: [],
};

const HISTORY_STORAGE_KEY = 'trilha_aprender_history';

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(initialState);

  const [history, setHistory] = useState<PlayerHistory[]>(() => {
    if (typeof window === 'undefined') {
      return [];
    }

    try {
      const savedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      return savedHistory ? JSON.parse(savedHistory) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        HISTORY_STORAGE_KEY,
        JSON.stringify(history)
      );
    }
  }, [history]);

  const setPlayerName = (name: string) => {
    setState((previousState) => ({
      ...previousState,
      playerName: name,
    }));
  };

  const selectTrail = (trail: TrailColor) => {
    const subject: Subject =
      trail === 'red'
        ? 'portuguese'
        : trail === 'blue'
          ? 'math'
          : trail === 'yellow'
            ? 'english'
            : null;

    setState((previousState) => ({
      ...previousState,
      selectedTrail: trail,
      subject,
    }));
  };

  const goToScreen = (screen: GameScreen) => {
    setState((previousState) => ({
      ...previousState,
      currentScreen: screen,
    }));
  };

  const addStars = (amount: number) => {
    setState((previousState) => ({
      ...previousState,
      stars: Math.max(0, previousState.stars + amount),
    }));
  };

  const completeActivity = (activityId: string) => {
    setState((previousState) => {
      if (previousState.completedActivities.includes(activityId)) {
        return previousState;
      }

      return {
        ...previousState,
        completedActivities: [
          ...previousState.completedActivities,
          activityId,
        ],
      };
    });
  };

  const saveCurrentSession = () => {
    if (!state.playerName.trim()) {
      return;
    }

    const newRecord: PlayerHistory = {
      id:
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: state.playerName,
      stars: state.stars,
      completedCount: state.completedActivities.length,
      date: new Date().toLocaleDateString('pt-BR'),
    };

    setHistory((previousHistory) => [
      newRecord,
      ...previousHistory,
    ]);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const resetGame = () => {
    setState(initialState);
  };

  return (
    <GameContext.Provider
      value={{
        state,
        history,
        setPlayerName,
        selectTrail,
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

export function useGame() {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error(
      'useGame deve ser utilizado dentro de GameProvider.'
    );
  }

  return context;
}
