import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useGame } from "../components/GameContext";

export function useGameLogic() {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [streak, setStreak] = useState(0);
  const { addPaws } = useGame();

  const handleCorrect = useCallback(() => {
    setScore((value) => value + 1);
    setCorrectAnswers((value) => value + 1);
    setStreak((value) => value + 1);
    // O MySQL continua sendo a fonte oficial da pontuação.
    addPaws(1).catch((error: unknown) => {
      console.error("Erro ao adicionar patinha:", error);
      toast.error("A patinha ficou pendente e será sincronizada.");
    });
    toast.success("Acertou! Ganhou 1 patinha! 🐾");
  }, [addPaws]);

  const handleWrong = useCallback(() => {
    setWrongAnswers((value) => value + 1);
    setStreak(0);
    setLives((currentLives) => {
      const nextLives = Math.max(0, currentLives - 1);
      if (nextLives === 0) setGameOver(true);
      return nextLives;
    });
    toast.error("Ops! Observe a trilha e tente de novo! 🍂");
  }, []);

  const resetGame = useCallback(() => {
    setScore(0);
    setLives(3);
    setGameOver(false);
    setCorrectAnswers(0);
    setWrongAnswers(0);
    setStreak(0);
  }, []);

  const totalAnswers = correctAnswers + wrongAnswers;
  const accuracy = totalAnswers === 0
    ? 0
    : Math.round((correctAnswers / totalAnswers) * 100);
  const level = Math.min(5, 1 + Math.floor(correctAnswers / 3));

  return {
    score,
    lives,
    gameOver,
    correctAnswers,
    wrongAnswers,
    streak,
    accuracy,
    level,
    handleCorrect,
    handleWrong,
    resetGame,
  };
}
