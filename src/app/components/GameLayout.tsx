import React, { useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router';
import {
  ArrowLeft,
  Sun,
  PawPrint,
  TreePine,
  RefreshCw,
} from 'lucide-react';
import { motion } from 'motion/react';
import { randomCuriosity } from '../lib/curiosities';
import { useGame } from './GameContext';

interface GameLayoutProps {
  planetName: string;
  gameId: string;
  themeColor: string;
  lives: number;
  score: number;
  level?: number;
  accuracy?: number;
  correctAnswers?: number;
  wrongAnswers?: number;
  streak?: number;
  learningCorrection?: {
    prompt: string;
    answer: string;
    explanation: string;
  };
  gameOver: boolean;
  onRestart: () => void;
  children: React.ReactNode;
}

const BORDER_HEX: Record<string, string> = {
  red: '#B9270A',
  blue: '#6A9876',
  yellow: '#F45A0A',
  green: '#6A9876',
  purple: '#FF9A5C',
};

export function GameLayout({
  planetName,
  gameId,
  themeColor,
  lives,
  score,
  level = 1,
  accuracy = 0,
  streak = 0,
  correctAnswers = 0,
  wrongAnswers = 0,
  learningCorrection,
  gameOver,
  onRestart,
  children,
}: GameLayoutProps) {
  const { isOnline, saveCurrentSession } = useGame();
  const location = useLocation();
  const navigate = useNavigate();
  const [endedByBack, setEndedByBack] = React.useState(false);
  const startedAtRef = useRef(Date.now());
  const sessionSavedRef = useRef(false);
  const showEndScreen = gameOver || endedByBack;
  const borderHex = BORDER_HEX[themeColor] ?? '#6A9876';

  const curiosity = useMemo(
    () => randomCuriosity(),
    [showEndScreen]
  );

  const handleBack = () => {
    if (showEndScreen) return;
    setEndedByBack(true);
    void saveCurrentSession({
      correctAnswers,
      wrongAnswers,
      accuracy,
      durationSeconds: Math.round((Date.now() - startedAtRef.current) / 1000),
      endReason: 'navigation',
    });
  };

  useEffect(() => {
    if (!gameOver || sessionSavedRef.current) return;
    sessionSavedRef.current = true;
    void saveCurrentSession({
      correctAnswers,
      wrongAnswers,
      accuracy,
      durationSeconds: Math.round((Date.now() - startedAtRef.current) / 1000),
      endReason: 'game_over',
    });
  }, [accuracy, correctAnswers, gameOver, saveCurrentSession, wrongAnswers]);

  const handleRestart = () => {
    setEndedByBack(false);
    sessionSavedRef.current = false;
    startedAtRef.current = Date.now();
    onRestart();
  };

  const handleTrails = () => {
    const subject = location.pathname.startsWith('/math')
      ? 'math'
      : 'portuguese';
    navigate(`/?trails=${subject}`);
  };

  return (
    <div
      className={`adventure-shell game-layout game-layout--${gameId} relative flex min-h-0 w-full max-w-full flex-col overflow-x-hidden overflow-y-auto text-white`}
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
          bg-gradient-to-t from-[#0B4D2B] to-transparent
          sm:h-32
        "
      />

      {/* Header compacto */}
      <header
        className="adventure-header
          relative z-10 flex shrink-0 items-center justify-between
          border-b-2 border-[#7A200F]
          bg-[#0B4D2B]/70
          px-2.5 py-2
          shadow-[0_3px_12px_rgba(0,0,0,0.35)]
          backdrop-blur-sm
          sm:border-b-4 sm:px-5 sm:py-3
        "
      >
        <button
          type="button"
          onClick={handleBack}
          disabled={showEndScreen}
          className="adventure-back
            flex items-center gap-1.5
            rounded-full border-2 border-[#F45A0A]
            bg-[#7A200F]
            px-2.5 py-1.5
            text-sm font-bold
            shadow-[0_2px_0_rgba(0,0,0,0.3)]
            transition-colors hover:bg-[#B9270A]
            sm:gap-2 sm:px-3 sm:py-2
          "
        >
          <ArrowLeft size={17} />
          <span className="hidden sm:inline">Encerrar</span>
        </button>

        <div className="flex items-center gap-2.5 text-base font-black sm:gap-6 sm:text-2xl">
          <span
            className={`hud-pill hud-pill--info hidden items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-black sm:inline-flex ${
              isOnline
                ? 'border-[#6A9876]/50 bg-[#6A9876]/15 text-[#bfe8c5]'
                : 'border-[#F45A0A]/60 bg-[#F45A0A]/15 text-[#ffe0a3]'
            }`}
            aria-live="polite"
          >
            <span aria-hidden="true">{isOnline ? '●' : '○'}</span>
            {isOnline ? 'Sincronizado' : 'Modo aventura'}
          </span>
          <span
            className="hud-pill hud-pill--info hidden rounded-full border border-[#6A9876]/50 bg-[#6A9876]/15 px-2 py-1 text-[10px] font-black sm:inline-flex"
            aria-label={`Nível ${level}, precisão ${accuracy}%`}
          >
            Nível {level} · {accuracy}%
          </span>
          {streak >= 2 && (
            <span className="hud-pill hud-pill--life hidden rounded-full border border-[#F45A0A]/50 bg-[#F45A0A]/15 px-2 py-1 text-[10px] font-black sm:inline-flex" aria-live="polite">
              Sequência {streak} 🔥
            </span>
          )}
          {/* Pontuação */}
          <motion.div
            key={score}
            initial={{ scale: 1.5 }}
            animate={{ scale: 1 }}
            className="hud-pill hud-pill--score
              flex items-center gap-1
              text-[#F45A0A]
              drop-shadow-[0_0_8px_rgba(246,166,35,0.6)]
              sm:gap-2
            "
          >
            <PawPrint
              size={21}
              className="fill-[#F45A0A] sm:hidden"
            />

            <PawPrint
              size={30}
              className="hidden fill-[#F45A0A] sm:block"
            />

            <span
              style={{ fontFamily: 'var(--font-display)' }}
              aria-live="polite"
              aria-label={`Pontuação: ${score} patinhas`}
            >
              {score}
            </span>
          </motion.div>

          {/* Vidas */}
          <div
            className="hud-pill hud-pill--life flex items-center gap-0.5 sm:gap-1"
            role="status"
            aria-label={`${lives} de 3 vidas restantes`}
            aria-live="polite"
          >
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
          sm:px-3 sm:py-4
        "
      >
        {!showEndScreen ? (
          <div
            className="
              flex w-full min-w-0 max-w-3xl
              flex-col items-center justify-center gap-2
              sm:gap-3
            "
          >
            {/* Nome do jogo */}
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex min-w-0 flex-col items-center gap-1"
            >
              <span
                className="adventure-title
                  inline-flex max-w-full items-center justify-center
                  rounded-full border-2 border-[#F45A0A]
                  bg-[#7A200F]
                  px-3 py-1.5
                  text-center text-sm font-black uppercase
                  tracking-wide
                  shadow-[0_3px_0_rgba(0,0,0,0.3)]
                  sm:border-4 sm:px-5 sm:py-2
                  sm:text-xl sm:tracking-widest
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
              className="adventure-stage game-stage
                w-full min-w-0
                max-w-[340px]
                min-h-[360px]
                rounded-2xl border-4
                bg-[#14432c]/90 forest-panel
                p-2.5
                shadow-[0_5px_0_rgba(0,0,0,0.3)]
                backdrop-blur-md
                overflow-x-hidden overflow-y-auto
                sm:max-w-2xl
                sm:min-h-[440px]
                sm:rounded-3xl
                sm:border-[6px]
                sm:p-4
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
            className="adventure-finish game-stage
              w-full max-w-md
              rounded-2xl border-4 border-[#7A200F]
              bg-[#14432c] forest-panel
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
                  'linear-gradient(to right, #F45A0A, #6A9876, #6A9876)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
              }}
            >
              Fim da Trilha!
            </h2>

            <p className="mb-3 text-base font-bold text-white/90 sm:mb-6 sm:text-2xl">
              Você juntou{' '}
              <strong className="text-xl text-[#F45A0A] sm:text-4xl">
                {score}
              </strong>{' '}
              pegadas! 🐾
            </p>

            {learningCorrection && wrongAnswers > 0 && (
              <div className="learning-correction mb-3 rounded-xl border-2 border-[#6A9876] bg-[#E8F1E8] p-2.5 text-left sm:mb-6 sm:rounded-2xl sm:p-4">
                <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-[#0B4D2B] sm:text-xs">
                  Vamos corrigir
                </p>
                <p className="text-xs font-bold text-black sm:text-sm">
                  {learningCorrection.prompt}
                </p>
                <p className="mt-1 text-sm font-black text-[#0B4D2B] sm:text-lg">
                  Resposta: {learningCorrection.answer}
                </p>
                <p className="mt-1 text-[11px] font-semibold leading-snug text-black sm:text-sm">
                  {learningCorrection.explanation}
                </p>
              </div>
            )}

            {/* Curiosidade */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="adventure-curiosity curiosity-card
                mb-3 rounded-xl
                border-2 border-[#6A9876]/60
                bg-[#155A35]
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
                  <p className="text-[9px] font-black uppercase tracking-widest text-[#6A9876] sm:text-xs">
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
                onClick={handleRestart}
                className="
                  flex w-full items-center justify-center gap-2
                  rounded-xl border-2 border-white/40
                  bg-gradient-to-b from-[#F45A0A] to-[#d98a10]
                  py-2.5 text-base font-black
                  text-[#0B4D2B]
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

              <button
                type="button"
                onClick={handleTrails}
                className="
                  flex w-full items-center justify-center gap-2
                  rounded-xl border-2 border-[#F45A0A]
                  bg-[#7A200F]
                  py-2.5 text-base font-black
                  shadow-[0_3px_0_rgba(0,0,0,0.3)]
                  transition-all hover:bg-[#B9270A]
                  active:translate-y-[2px]
                  sm:rounded-2xl sm:py-4 sm:text-xl
                  sm:shadow-[0_5px_0_rgba(0,0,0,0.3)]
                "
                style={{ fontFamily: 'var(--font-display)' }}
              >
                <TreePine size={18} />
                Voltar às Trilhas
              </button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
