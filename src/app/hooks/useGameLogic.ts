import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useGame } from "./GameContext";

export function useGameLogic(activityId?: string) {
  const {
    addPaws,
    completeActivity,
  } = useGame();

  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);

  const handleCorrect = useCallback(async () => {
    setScore((s) => s + 1);

    try {
      // Cada acerto gera uma patinha no banco
      await addPaws(1);

      // Se esta tela representa uma atividade cadastrada,
      // registra a conclusão no banco.
      if (activityId) {
        await completeActivity(activityId);
      }
    } catch (error) {
      console.error(
        "Erro ao salvar progresso da atividade:",
        error
      );
    }

    toast.success("Acertou! Ganhou 1 pegada!", {
      position: "top-center",
      duration: 1500,
      className:
        "bg-green-500 border-none text-white text-lg font-bold p-4 rounded-2xl shadow-xl",
    });
  }, [activityId, addPaws, completeActivity]);

  const handleWrong = useCallback(() => {
    setLives((l) => {
      const newLives = l - 1;

      if (newLives <= 0) {
        setGameOver(true);
      }

      return newLives;
    });

    toast.error("Ops! Tente de novo!", {
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