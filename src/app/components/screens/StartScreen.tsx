import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Leaf, PawPrint } from 'lucide-react';

import { Button } from '../Button';
import { useGame } from '../GameContext';
import { HistoryModal } from "../HistoryModal";

export default function StartScreen() {
  const { goToScreen } = useGame();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
      {/* Botão de Histórico / Recordes */}
      <button
        type="button"
        onClick={() => setIsHistoryOpen(true)}
        className="absolute right-4 top-4 z-20 flex cursor-pointer items-center gap-2 rounded-2xl border-2 border-[#35b35b]/40 bg-[#052e1c]/80 px-4 py-2.5 text-sm font-black text-white shadow-[0_4px_0_rgba(0,0,0,0.2)] transition-all hover:bg-[#0d3d28] active:translate-y-1 active:shadow-none"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        <Trophy className="h-4 w-4 text-amber-400" fill="currentColor" />
        RECORDES
      </button>

      {/* Ícones da floresta */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', duration: 1 }}
        className="mb-8 flex items-center gap-4"
      >
        <Leaf className="h-16 w-16 text-[#57b85b]" />
        <PawPrint className="h-24 w-24 text-[#f6a623]" strokeWidth={2} />
        <Leaf className="h-16 w-16 text-[#2a7de1]" />
      </motion.div>

      {/* Título do jogo */}
      <motion.h1
        className="mb-4 text-center font-display text-5xl font-black sm:text-7xl md:text-8xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <span className="text-[#57b85b] drop-shadow-[0_0_10px_rgba(87,184,91,0.8)]">
          Trilha
        </span>
        <br />
        <span className="text-[#f6a623] drop-shadow-[0_0_10px_rgba(246,166,35,0.8)]">
          do Aprender
        </span>
      </motion.h1>

      {/* Texto de subtítulo */}
      <motion.p
        className="mb-12 max-w-md text-center text-xl text-white/90 md:text-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Explore a floresta e aprenda com os animais da natureza!
      </motion.p>

      {/* Botão para iniciar o jogo */}
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

      {/* Modal de Histórico */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />
    </div>
  );
}
