import { createContext, useContext, useState, ReactNode } from 'react';

type ShipType = 'red' | 'blue' | 'yellow' | null;
type GameScreen = 'start' | 'name-input' | 'ship-select' | 'travel' | 'planet' | 'minigame' | 'reward';
type Subject = 'portuguese' | 'math' | 'english' | null;

interface GameState {
  playerName: string;
  selectedShip: ShipType;
  subject: Subject;
  stars: number;
  currentScreen: GameScreen;
  currentPlanet: string | null;
  completedActivities: string[];
}

interface GameContextType {
  state: GameState;
  setPlayerName: (name: string) => void;
  selectShip: (ship: ShipType) => void;
  goToScreen: (screen: GameScreen) => void;
  addStars: (amount: number) => void;
  completeActivity: (activityId: string) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const initialState: GameState = {
  playerName: '',
  selectedShip: null,
  subject: null,
  stars: 0,
  currentScreen: 'start',
  currentPlanet: null,
  completedActivities: [],
};

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(initialState);

  const setPlayerName = (name: string) => {
    setState(prev => ({ ...prev, playerName: name }));
  };

  const selectShip = (ship: ShipType) => {
    const subject =
      ship === 'red' ? 'portuguese' :
      ship === 'blue' ? 'math' :
      ship === 'yellow' ? 'english' :
      null;
    setState(prev => ({ ...prev, selectedShip: ship, subject }));
  };

  const goToScreen = (screen: GameScreen) => {
    setState(prev => ({ ...prev, currentScreen: screen }));
  };

  const addStars = (amount: number) => {
    setState(prev => ({ ...prev, stars: prev.stars + amount }));
  };

  const completeActivity = (activityId: string) => {
    setState(prev => ({
      ...prev,
      completedActivities: [...prev.completedActivities, activityId],
    }));
  };

  const resetGame = () => {
    setState(initialState);
  };

  return (
    <GameContext.Provider
      value={{
        state,
        setPlayerName,
        selectShip,
        goToScreen,
        addStars,
        completeActivity,
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
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}
