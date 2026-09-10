import React, { useMemo } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, Sun, PawPrint, TreePine, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { randomCuriosity } from '../lib/curiosities';

interface GameLayoutProps {
  planetName: string;
  themeColor: string; // chave de tema: red | blue | yellow | green | purple
  lives: number;
  score: number;
  gameOver: boolean;
  onRestart: () => void;
  children: React.ReactNode;
}

const BORDER_HEX: Record<string, string> = {
  red: '#e0402b',
  blue: '#2a7de1',
  yellow: '#f6a623',
  green: '#35b35b',
  purple: '#f06fa8',
};

export function GameLayout({
  planetName,
  themeColor,
  lives,
  score,
  gameOver,
  onRestart,
  children,
}: GameLayoutProps) {
  const borderHex = BORDER_HEX[themeColor] ?? '#35b35b';
  // Curiosidade sorteada uma vez por partida encerrada
  const curiosity = useMemo(() => randomCuriosity(), [gameOver]);

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-[#0d3d28] via-[#0b4a2e] to-[#052e1c] text-white overflow-hidden flex flex-col relative"
      style={{ fontFamily: 'var(--font-body)' }}
    >
      {/* Vagalumes flutuando no dossel */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(28)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-yellow-200"
            style={{
              width: Math.random() * 5 + 2 + 'px',
              height: Math.random() * 5 + 2 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              boxShadow: '0 0 10px rgba(246,224,94,0.9)',
            }}
            animate={{ opacity: [0.15, 1, 0.15], y: [0, -12, 0] }}
            transition={{ duration: Math.random() * 4 + 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* Folhagem inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 z-0 pointer-events-none opacity-70 bg-gradient-to-t from-[#052e1c] to-transparent" />

      {/* Header */}
      <header className="relative z-10 p-3 sm:p-6 flex justify-between items-center bg-[#052e1c]/70 backdrop-blur-sm border-b-4 border-[#6b3f22] shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
        <Link
          to="/"
          className="flex items-center gap-2 bg-[#6b3f22] hover:bg-[#7c4a28] transition-colors px-3 py-2 rounded-full font-bold border-2 border-[#a9713f] shadow-[0_3px_0_rgba(0,0,0,0.3)]"
        >
          <ArrowLeft size={18} />
          <span className="hidden sm:inline text-sm">Trilhas</span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-6 text-lg sm:text-2xl font-black">
          {/* Pontuação em pegadas */}
          <motion.div
            key={score}
            initial={{ scale: 1.5 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1 sm:gap-2 text-[#f6a623] drop-shadow-[0_0_8px_rgba(246,166,35,0.6)]"
          >
            <PawPrint size={24} className="fill-[#f6a623] sm:hidden" />
            <PawPrint size={30} className="fill-[#f6a623] hidden sm:block" />
            <span style={{ fontFamily: 'var(--font-display)' }}>{score}</span>
          </motion.div>

          {/* Energia em raios de sol */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={false}
                animate={{ scale: i < lives ? 1 : 0.5, opacity: i < lives ? 1 : 0.3, rotate: i < lives ? 0 : 0 }}
              >
                <Sun
                  size={26}
                  className={i < lives
                    ? 'fill-yellow-300 text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.7)]'
                    : 'fill-[#1c3b2a] text-[#2d5a40]'}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 w-full">
        {!gameOver ? (
          <div className="w-full max-w-4xl flex flex-col items-center gap-6 sm:gap-10">
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex flex-col items-center gap-1 sm:gap-2"
            >
              <span
                className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-full text-base sm:text-2xl font-black uppercase tracking-widest bg-[#6b3f22] border-4 border-[#a9713f] shadow-[0_4px_0_rgba(0,0,0,0.3)]"
                style={{ fontFamily: 'var(--font-display)', color: '#fdf6e3' }}
              >
                🌿 {planetName}
              </span>
            </motion.div>

            {/* Painel de madeira/folha */}
            <div
              className="w-full max-w-2xl bg-[#14432c]/90 backdrop-blur-md border-[6px] rounded-3xl p-4 sm:p-10 shadow-[0_10px_0_rgba(0,0,0,0.3)]"
              style={{ borderColor: borderHex }}
            >
              {children}
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', bounce: 0.6 }}
            className="bg-[#14432c] border-[6px] border-[#6b3f22] p-6 sm:p-10 rounded-[2rem] text-center max-w-md w-full shadow-[0_16px_0_rgba(0,0,0,0.4),0_0_40px_rgba(246,166,35,0.3)]"
          >
            <div className="text-6xl sm:text-8xl mb-3 sm:mb-4">🌿</div>
            <h2
              className="text-3xl sm:text-5xl font-black mb-2 sm:mb-3 text-transparent bg-clip-text bg-gradient-to-r from-[#f6a623] via-[#35b35b] to-[#2a7de1]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Fim da Trilha!
            </h2>
            <p className="text-lg sm:text-2xl text-white/90 mb-4 sm:mb-6 font-bold">
              Você juntou{' '}
              <strong className="text-[#f6a623] text-2xl sm:text-4xl">{score}</strong>{' '}
              pegadas! 🐾
            </p>

            {/* Card de curiosidade sobre a fauna brasileira */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-left bg-[#0d3d28] border-4 border-[#35b35b]/60 rounded-2xl p-4 sm:p-5 mb-6 shadow-[0_4px_0_rgba(0,0,0,0.3)]"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-3xl sm:text-4xl">{curiosity.emoji}</span>
                <div>
                  <p className="text-[10px] sm:text-xs uppercase tracking-widest text-[#35b35b] font-black">Você sabia?</p>
                  <p className="text-sm sm:text-lg font-black text-yellow-200" style={{ fontFamily: 'var(--font-display)' }}>
                    {curiosity.animal}
                  </p>
                </div>
              </div>
              <p className="text-sm sm:text-base text-white/90 font-semibold leading-snug">{curiosity.fact}</p>
            </motion.div>

            <div className="flex flex-col gap-3 sm:gap-4">
              <button
                onClick={onRestart}
                className="w-full py-3 sm:py-4 bg-gradient-to-b from-[#f6a623] to-[#d98a10] hover:brightness-105 rounded-2xl font-black text-lg sm:text-xl flex items-center justify-center gap-2 shadow-[0_5px_0_rgba(0,0,0,0.3)] transition-all active:translate-y-[2px] border-2 border-white/40 text-[#052e1c]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                <RefreshCw size={20} />
                Explorar de novo
              </button>
              <Link
                to="/"
                className="w-full py-3 sm:py-4 bg-[#6b3f22] hover:bg-[#7c4a28] rounded-2xl font-black text-lg sm:text-xl flex items-center justify-center gap-2 transition-all active:translate-y-[2px] border-2 border-[#a9713f] shadow-[0_5px_0_rgba(0,0,0,0.3)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                <TreePine size={20} />
                Voltar às Trilhas
              </Link>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
