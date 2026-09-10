import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export function useGameLogic() {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);

  const handleCorrect = useCallback(() => {
    setScore((s) => s + 1);
    try {
      const total = parseInt(localStorage.getItem('bichoStars') || '0', 10) + 1;
      localStorage.setItem('bichoStars', String(total));
      window.dispatchEvent(new Event('bichoStarsChanged'));
    } catch {}
    toast.success('Acertou! Ganhou 1 pegada! 🐾', {
      position: 'top-center',
      duration: 1500,
      className: 'bg-green-500 border-none text-white text-lg font-bold p-4 rounded-2xl shadow-xl'
    });
  }, []);

  const handleWrong = useCallback(() => {
    setLives((l) => {
      const newLives = l - 1;
      if (newLives <= 0) {
        setGameOver(true);
      }
      return newLives;
    });
    toast.error('Ops! Tente de novo! 🍂', {
      position: 'top-center',
      duration: 1500,
      className: 'bg-red-500 border-none text-white text-lg font-bold p-4 rounded-2xl shadow-xl'
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
    resetGame
  };
}
