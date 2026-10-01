import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useGame } from "../components/GameContext";

export function useGameLogic() {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);

  const { addPaws } = useGame();

  const handleCorrect = useCallback(() => {
    setScore((currentScore) => currentScore + 1);

    // Cada acerto gera exatamente 1 patinha.
    // A pontuação oficial é salva pelo GameContext/API.
    addPaws(1).catch((error: unknown) => {
      console.error(
        "Erro ao adicionar patinha:",
        error
      );
    });

    toast.success("Acertou! Ganhou 1 patinha! 🐾", {
      position: "top-center",
      duration: 1500,
      className:
        "bg-green-500 border-none text-white text-lg font-bold p-4 rounded-2xl shadow-xl",
    });
  }, [addPaws]);

  const handleWrong = useCallback(() => {
    setLives((currentLives) => {
      const newLives = currentLives - 1;

      if (newLives <= 0) {
        setGameOver(true);
      }

      return newLives;
    });

    toast.error("Ops! Tente de novo! 🍂", {
      position: "top-center",
      duration: 1500,
      className:
        "bg-red-500 border-none text-white text-lg font-bold p-4 rounded-2xl shadow-xl",
    });
  }, []);

  const resetGame = useCallback(() => {
    setScore(0);
    setLives(3);
    setGameOver(false);
  }, []);

  return {
    score,
    lives,
    gameOver,
    handleCorrect,
    handleWrong,
    resetGame,
  };
}
