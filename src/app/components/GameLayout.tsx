import React, { useMemo } from 'react';
import { Link } from 'react-router';
import {
  ArrowLeft,
  Sun,
  PawPrint,
  TreePine,
  RefreshCw,
} from 'lucide-react';
import { motion } from 'motion/react';
import { randomCuriosity } from '../lib/curiosities';

interface GameLayoutProps {
  planetName: string;
  themeColor: string;
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

  const curiosity = useMemo(
    () => randomCuriosity(),
    [gameOver]
  );

  return (
    <div
      className="
        relative flex min-h-0 w-full max-w-full flex-col
        overflow-x-hidden overflow-y-auto
        bg-gradient-to-b from-[#0d3d28] via-[#0b4a2e] to-[#052e1c]
        text-white
      "
      style={{
        fontFamily: 'var(--font-body)',
        minHeight: '100dvh',
      }}
    >
      {/* Vagalumes */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {[...Array(20)].map((_, i) => (
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
            animate={{
              opacity: [0.15, 1, 0.15],
              y: [0, -12, 0],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Folhagem inferior */}
      <div
        className="
          pointer-events-none absolute bottom-0 left-0 right-0
          z-0 h-16 opacity-70
          bg-gradient-to-t from-[#052e1c] to-transparent
          sm:h-32
        "
      />

      {/* Header compacto */}
      <header
        className="
          relative z-10 flex shrink-0 items-center justify-between
          border-b-2 border-[#6b3f22]
          bg-[#052e1c]/70
          px-2.5 py-2
          shadow-[0_3px_12px_rgba(0,0,0,0.35)]
          backdrop-blur-sm
          sm:border-b-4 sm:px-6 sm:py-4
        "
      >
        <Link
          to="/"
          className="
            flex items-center gap-1.5
            rounded-full border-2 border-[#a9713f]
            bg-[#6b3f22]
            px-2.5 py-1.5
            text-sm font-bold
            shadow-[0_2px_0_rgba(0,0,0,0.3)]
            transition-colors hover:bg-[#7c4a28]
            sm:gap-2 sm:px-3 sm:py-2
          "
        >
          <ArrowLeft size={17} />
          <span className="hidden sm:inline">Trilhas</span>
        </Link>

        <div className="flex items-center gap-2.5 text-base font-black sm:gap-6 sm:text-2xl">
          {/* Pontuação */}
          <motion.div
            key={score}
            initial={{ scale: 1.5 }}
            animate={{ scale: 1 }}
            className="
              flex items-center gap-1
              text-[#f6a623]
              drop-shadow-[0_0_8px_rgba(246,166,35,0.6)]
              sm:gap-2
            "
          >
            <PawPrint
              size={21}
              className="fill-[#f6a623] sm:hidden"
            />

            <PawPrint
              size={30}
              className="hidden fill-[#f6a623] sm:block"
            />

            <span style={{ fontFamily: 'var(--font-display)' }}>
              {score}
            </span>
          </motion.div>

          {/* Vidas */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={false}
                animate={{
                  scale: i < lives ? 1 : 0.5,
                  opacity: i < lives ? 1 : 0.3,
                }}
              >
                <Sun
                  size={22}
                  className={
                    i < lives
                      ? `
                        fill-yellow-300 text-yellow-400
                        drop-shadow-[0_0_6px_rgba(250,204,21,0.7)]
                        sm:h-[26px] sm:w-[26px]
                      `
                      : `
                        fill-[#1c3b2a] text-[#2d5a40]
                        sm:h-[26px] sm:w-[26px]
                      `
                  }
                />
              </motion.div>
            ))}
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main
        className="
          relative z-10 flex min-h-0 w-full flex-1
          flex-col items-center justify-start
          px-2 py-4
          sm:justify-center
          sm:px-4 sm:py-6
        "
      >
        {!gameOver ? (
          <div
            className="
              flex w-full min-w-0 max-w-3xl
              flex-col items-center justify-center gap-2
              sm:gap-4
            "
          >
            {/* Nome do jogo */}
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex min-w-0 flex-col items-center gap-1"
            >
              <span
                className="
                  inline-flex max-w-full items-center justify-center
                  rounded-full border-2 border-[#a9713f]
                  bg-[#6b3f22]
                  px-3 py-1.5
                  text-center text-sm font-black uppercase
                  tracking-wide
                  shadow-[0_3px_0_rgba(0,0,0,0.3)]
                  sm:border-4 sm:px-6 sm:py-3
                  sm:text-2xl sm:tracking-widest
                "
                style={{
                  fontFamily: 'var(--font-display)',
                  color: '#fdf6e3',
                }}
              >
                <span className="truncate">
                  🌿 {planetName}
                </span>
              </span>
            </motion.div>

            {/* Painel principal com altura mínima, não fixa */}
            <div
              className="
                w-full min-w-0
                max-w-[340px]
                min-h-[360px]
                rounded-2xl border-4
                bg-[#14432c]/90
                p-3
                shadow-[0_5px_0_rgba(0,0,0,0.3)]
                backdrop-blur-md
                overflow-hidden
                sm:max-w-2xl
                sm:min-h-[500px]
                sm:rounded-3xl
                sm:border-[6px]
                sm:p-6
                sm:shadow-[0_10px_0_rgba(0,0,0,0.3)]
              "
              style={{ borderColor: borderHex }}
            >
              <div className="flex w-full flex-col items-center">
                {children}
              </div>
            </div>
          </div>
        ) : (
          /* Tela de fim de jogo */
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{
              type: 'spring',
              bounce: 0.6,
            }}
            className="
              w-full max-w-md
              rounded-2xl border-4 border-[#6b3f22]
              bg-[#14432c]
              p-3 text-center
              shadow-[0_8px_0_rgba(0,0,0,0.4),0_0_25px_rgba(246,166,35,0.3)]
              sm:rounded-[2rem]
              sm:border-[6px] sm:p-10
              sm:shadow-[0_16px_0_rgba(0,0,0,0.4),0_0_40px_rgba(246,166,35,0.3)]
            "
          >
            <div className="mb-1 text-5xl sm:mb-4 sm:text-8xl">
              🌿
            </div>

            <h2
              className="
                mb-1 text-2xl font-black
                text-transparent
                sm:mb-3 sm:text-5xl
              "
              style={{
                fontFamily: 'var(--font-display)',
                backgroundImage:
                  'linear-gradient(to right, #f6a623, #35b35b, #2a7de1)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
              }}
            >
              Fim da Trilha!
            </h2>

            <p className="mb-3 text-base font-bold text-white/90 sm:mb-6 sm:text-2xl">
              Você juntou{' '}
              <strong className="text-xl text-[#f6a623] sm:text-4xl">
                {score}
              </strong>{' '}
              pegadas! 🐾
            </p>

            {/* Curiosidade */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="
                mb-3 rounded-xl
                border-2 border-[#35b35b]/60
                bg-[#0d3d28]
                p-2.5 text-left
                shadow-[0_3px_0_rgba(0,0,0,0.3)]
                sm:mb-6 sm:rounded-2xl
                sm:border-4 sm:p-5
              "
            >
              <div className="mb-1 flex items-center gap-2">
                <span className="text-2xl sm:text-4xl">
                  {curiosity.emoji}
                </span>

                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-[#35b35b] sm:text-xs">
                    Você sabia?
                  </p>

                  <p
                    className="text-xs font-black text-yellow-200 sm:text-lg"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {curiosity.animal}
                  </p>
                </div>
              </div>

              <p className="text-xs font-semibold leading-snug text-white/90 sm:text-base">
                {curiosity.fact}
              </p>
            </motion.div>

            <div className="flex flex-col gap-2 sm:gap-4">
              <button
                onClick={onRestart}
                className="
                  flex w-full items-center justify-center gap-2
                  rounded-xl border-2 border-white/40
                  bg-gradient-to-b from-[#f6a623] to-[#d98a10]
                  py-2.5 text-base font-black
                  text-[#052e1c]
                  shadow-[0_3px_0_rgba(0,0,0,0.3)]
                  transition-all hover:brightness-105
                  active:translate-y-[2px]
                  sm:rounded-2xl sm:py-4 sm:text-xl
                  sm:shadow-[0_5px_0_rgba(0,0,0,0.3)]
                "
                style={{ fontFamily: 'var(--font-display)' }}
              >
                <RefreshCw size={18} />
                Explorar de novo
              </button>

              <Link
                to="/"
                className="
                  flex w-full items-center justify-center gap-2
                  rounded-xl border-2 border-[#a9713f]
                  bg-[#6b3f22]
                  py-2.5 text-base font-black
                  shadow-[0_3px_0_rgba(0,0,0,0.3)]
                  transition-all hover:bg-[#7c4a28]
                  active:translate-y-[2px]
                  sm:rounded-2xl sm:py-4 sm:text-xl
                  sm:shadow-[0_5px_0_rgba(0,0,0,0.3)]
                "
                style={{ fontFamily: 'var(--font-display)' }}
              >
                <TreePine size={18} />
                Voltar às Trilhas
              </Link>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
