import { motion } from 'motion/react';
import { Rocket } from 'lucide-react';
import { Button } from '../Button';
import { useGame } from '../GameContext';

export function StartScreen() {
  const { goToScreen } = useGame();

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', duration: 1 }}
        className="mb-8"
      >
        <Rocket className="w-24 h-24 text-[#ff6ec7]" strokeWidth={2} />
      </motion.div>

      <motion.h1
        className="font-display text-6xl md:text-8xl mb-4 text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <span className="text-[#ff6ec7] drop-shadow-[0_0_10px_rgba(255,110,199,0.8)]">
          Space
        </span>
        <br />
        <span className="text-[#00f6ff] drop-shadow-[0_0_10px_rgba(0,246,255,0.8)]">
          Kids
        </span>
      </motion.h1>

      <motion.p
        className="text-xl md:text-2xl text-white/90 mb-12 text-center max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Explore o universo e aprenda com alienígenas amigáveis!
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <Button
          onClick={() => goToScreen('name-input')}
          variant="primary"
          size="lg"
        >
          Começar Aventura
        </Button>
      </motion.div>

      {/* Floating astronaut emoji */}
      <motion.div
        className="absolute bottom-10 right-10 text-6xl"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        👨‍🚀
      </motion.div>
    </div>
  );
}
