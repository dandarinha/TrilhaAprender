import { motion } from 'motion/react';
import { Star, BookOpen, Calculator } from 'lucide-react';
import { Button } from '../Button';
import { useGame } from '../GameContext';

export function PlanetScreen() {
  const { state, goToScreen } = useGame();

  const planetInfo =
    state.subject === 'portuguese'
      ? {
          name: 'Planeta das Palavras',
          color: '#ff3b5c',
          alien: '👽',
          alienName: 'Zig',
          icon: BookOpen,
          description: 'Olá! Eu sou o Zig e vou te ensinar sobre letras e palavras!',
        }
      : state.subject === 'math'
      ? {
          name: 'Planeta dos Números',
          color: '#4da6ff',
          alien: '👾',
          alienName: 'Zug',
          icon: Calculator,
          description: 'Oi! Sou o Zug e vou te mostrar como os números são divertidos!',
        }
      : {
          name: 'English Planet',
          color: '#ffd93d',
          alien: '🛸',
          alienName: 'Bip',
          icon: BookOpen,
          description: "Hello! I'm Bip and I'll teach you English words!",
        };

  const Icon = planetInfo.icon;

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
      {/* Stars Counter */}
      <motion.div
        className="absolute top-8 right-8 flex items-center gap-2 bg-[#2d1b4e]/80 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-[#ffd93d]/40"
        initial={{ opacity: 0, y: -20 }}
        animate={{
              y: [0, -10, 0], opacity: 1, y: 0 }}
      >
        <Star className="w-6 h-6 text-[#ffd93d] fill-[#ffd93d]" />
        <span className="font-display text-2xl text-[#ffd93d]">{state.stars}</span>
      </motion.div>

      {/* Planet */}
      <motion.div
        className="relative mb-8"
        initial={{ scale: 0 }}
        animate={{
              y: [0, -10, 0], scale: 1 }}
        transition={{ type: 'spring', duration: 0.8 }}
      >
        <motion.div
          className="w-64 h-64 rounded-full"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${planetInfo.color}40, ${planetInfo.color}20)`,
            boxShadow: `0 0 60px ${planetInfo.color}60`,
          }}
          animate={{
              y: [0, -10, 0],
            rotate: 360,
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon className="w-24 h-24" style={{ color: planetInfo.color }} />
          </div>
        </motion.div>

        {/* Alien */}
        <motion.div
          className="absolute -bottom-8 left-1/2 -translate-x-1/2"
          initial={{ y: 100, opacity: 0 }}
          animate={{
              y: [0, -10, 0], y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="text-7xl"
            animate={{
              y: [0, -10, 0],
              
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {planetInfo.alien}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Dialog Box */}
      <motion.div
        className="bg-[#2d1b4e]/90 backdrop-blur-sm p-8 rounded-3xl border-2 max-w-2xl mt-12"
        style={{ borderColor: `${planetInfo.color}40` }}
        initial={{ opacity: 0, y: 50 }}
        animate={{
              y: [0, -10, 0], opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="text-4xl">{planetInfo.alien}</div>
          <h3 className="font-display text-3xl" style={{ color: planetInfo.color }}>
            {planetInfo.alienName}
          </h3>
        </div>

        <p className="text-xl text-white/90 mb-6">
          {planetInfo.description}
        </p>

        <div className="flex justify-center gap-4">
          <Button
            onClick={() => goToScreen('minigame')}
            variant="primary"
            size="lg"
          >
            Começar Atividade! 🎮
          </Button>
        </div>
      </motion.div>

      {/* Player Info */}
      <motion.div
        className="absolute top-8 left-8 bg-[#2d1b4e]/80 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-[#00f6ff]/40"
        initial={{ opacity: 0, y: -20 }}
        animate={{
              y: [0, -10, 0], opacity: 1, y: 0 }}
      >
        <span className="font-display text-xl text-[#00f6ff]">👨‍🚀 {state.playerName}</span>
      </motion.div>
    </div>
  );
}
