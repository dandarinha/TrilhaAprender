import { motion } from 'motion/react';
import { Star, Trophy } from 'lucide-react';
import { Button } from '../Button';
import { useGame } from '../GameContext';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

export function RewardScreen() {
  const { state, goToScreen, resetGame } = useGame();

  useEffect(() => {
    // Trigger confetti
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      confetti({
        particleCount: 3,
        angle: randomInRange(55, 125),
        spread: randomInRange(50, 70),
        origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 },
        colors: ['#ff6ec7', '#00f6ff', '#ffd93d', '#39ff14'],
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
      <motion.div
        className="text-8xl mb-6"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', duration: 1 }}
      >
        <Trophy className="w-32 h-32 text-[#ffd93d]" fill="#ffd93d" />
      </motion.div>

      <motion.h2
        className="font-display text-6xl md:text-7xl mb-4 text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <span className="text-[#39ff14] drop-shadow-[0_0_20px_rgba(57,255,20,0.8)]">
          Parabéns!
        </span>
      </motion.h2>

      <motion.p
        className="text-2xl text-white/90 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Você completou a atividade, {state.playerName}!
      </motion.p>

      {/* Stars Display */}
      <motion.div
        className="bg-[#2d1b4e]/80 backdrop-blur-sm px-12 py-8 rounded-3xl border-2 border-[#ffd93d]/40 mb-8"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.7, type: 'spring' }}
      >
        <div className="flex items-center gap-4">
          <Star className="w-16 h-16 text-[#ffd93d] fill-[#ffd93d]" />
          <div>
            <p className="text-white/70 text-sm">Total de Estrelas</p>
            <p className="font-display text-6xl text-[#ffd93d]">{state.stars}</p>
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <Button
          onClick={() => goToScreen('planet')}
          variant="primary"
          size="lg"
        >
          Jogar Novamente
        </Button>
        <Button
          onClick={() => goToScreen('ship-select')}
          variant="secondary"
          size="lg"
        >
          Escolher Outra Nave
        </Button>
      </motion.div>

      {/* Floating elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl"
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 50,
            }}
            animate={{
              y: -100,
              x: Math.random() * window.innerWidth,
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          >
            ⭐
          </motion.div>
        ))}
      </div>
    </div>
  );
}
