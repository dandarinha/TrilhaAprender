import React, { useState, useEffect, useMemo } from 'react';
import { GameLayout } from './GameLayout';
import { useGameLogic } from '../hooks/useGameLogic';
import { motion, AnimatePresence } from 'motion/react';
import { SpeakButton } from './SpeakButton';

// Somente animais, flores, insetos, frutas e vegetais (todos com emoji disponível)
const COUNT_EMOJIS = ['🐢', '🦋', '🐝', '🐞', '🐸', '🐬', '🐟', '🐧', '🐰', '🐴', '🍌', '🍓', '🍇', '🥕', '🌻', '🌸'];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeOptions(answer: number, max = 12): number[] {
  const set = new Set<number>([answer]);
  while (set.size < 4) {
    const off = Math.floor(Math.random() * 5) - 2;
    const v = answer + off + (set.size === 1 ? 1 : 0);
    if (v >= 0 && v <= max + 5) set.add(v);
  }
  return shuffle(Array.from(set));
}

function Dots({ count, emoji, color }: { count: number; emoji: string; color: string }) {
  return (
    <div
      className={`flex flex-wrap gap-0.5 sm:gap-2 justify-center p-1 sm:p-4 rounded-xl sm:rounded-3xl border-2 sm:border-4 border-white ${color} max-w-full`}
    >
      {[...Array(count)].map((_, i) => (
        <motion.span
          key={i}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: i * 0.05 }}
          className="text-2xl sm:text-5xl bg-white rounded-lg sm:rounded-2xl p-0.5 sm:p-2 border-2 border-white shadow-[0_2px_0_rgba(0,0,0,0.15)]"
        >
          {emoji}
        </motion.span>
      ))}
    </div>
  );
}

/* ============================================================ */
/*                       ADDITION GAME                          */
/* ============================================================ */
export function AdditionGame() {
  const { score, lives, gameOver, handleCorrect, handleWrong, resetGame } = useGameLogic();
  const [round, setRound] = useState(0);
  const [locked, setLocked] = useState(false);

  const problem = useMemo(() => {
    const a = Math.floor(Math.random() * 6) + 1;
    const b = Math.floor(Math.random() * 6) + 1;
    const emoji = COUNT_EMOJIS[Math.floor(Math.random() * COUNT_EMOJIS.length)];
    return { a, b, answer: a + b, options: makeOptions(a + b), emoji };
  }, [round]);

  useEffect(() => {
    setLocked(false);
  }, [problem]);

  const handleClick = (n: number) => {
    if (locked) return;
    setLocked(true);
    if (n === problem.answer) {
      handleCorrect();
      setTimeout(() => setRound(r => r + 1), 900);
    } else {
      handleWrong();
      setTimeout(() => setLocked(false), 700);
    }
  };

  return (
    <GameLayout
      planetName="Adição na Floresta"
      themeColor="red"
      lives={lives}
      score={score}
      gameOver={gameOver}
      onRestart={() => { resetGame(); setRound(0); }}
    >
      <div className="flex flex-col items-center gap-2 sm:gap-6 py-0 sm:py-2">
        <div className="flex items-center justify-center gap-1 sm:gap-3 w-full">
          <h3
            className="text-sm sm:text-3xl font-black text-red-200 uppercase tracking-wide sm:tracking-widest text-center max-w-[calc(100vw-90px)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Some os dois grupos!
          </h3>
          <SpeakButton text={`Quanto é ${problem.a} mais ${problem.b}?`} />
        </div>

        <div
          className="text-2xl sm:text-6xl font-black text-white bg-red-900/60 rounded-2xl sm:rounded-3xl px-3 sm:px-8 py-1.5 sm:py-4 border-2 sm:border-4 border-white shadow-[0_3px_0_rgba(0,0,0,0.25)] sm:shadow-[0_4px_0_rgba(0,0,0,0.25)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {problem.a} + {problem.b} = ?
        </div>

        <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-4 w-full">
          <Dots count={problem.a} emoji={problem.emoji} color="bg-red-700/60" />
          <span className="text-2xl sm:text-6xl font-black text-white">+</span>
          <Dots count={problem.b} emoji={problem.emoji} color="bg-red-700/60" />
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-4 w-full max-w-md mt-0 sm:mt-4">
          {problem.options.map((o, i) => (
            <motion.button
              key={`${round}-${i}`}
              whileHover={{ scale: locked ? 1 : 1.05 }}
              whileTap={{ scale: locked ? 1 : 0.95 }}
              onClick={() => handleClick(o)}
              disabled={locked}
              className="bg-gradient-to-b from-red-400 to-red-600 text-white border-2 sm:border-4 border-white shadow-[0_3px_0_rgb(153,27,27)] sm:shadow-[0_4px_0_rgb(153,27,27)] rounded-xl sm:rounded-2xl font-black text-2xl sm:text-5xl py-2 sm:py-5"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {o}
            </motion.button>
          ))}
        </div>
      </div>
    </GameLayout>
  );
}

/* ============================================================ */
/*                     SUBTRACTION GAME                         */
/* ============================================================ */
export function SubtractionGame() {
  const { score, lives, gameOver, handleCorrect, handleWrong, resetGame } = useGameLogic();
  const [round, setRound] = useState(0);
  const [locked, setLocked] = useState(false);

  const problem = useMemo(() => {
    const a = Math.floor(Math.random() * 7) + 4;
    const b = Math.floor(Math.random() * (a - 1)) + 1;
    const emoji = COUNT_EMOJIS[Math.floor(Math.random() * COUNT_EMOJIS.length)];
    return { a, b, answer: a - b, options: makeOptions(a - b), emoji };
  }, [round]);

  useEffect(() => {
    setLocked(false);
  }, [problem]);

  const handleClick = (n: number) => {
    if (locked) return;
    setLocked(true);
    if (n === problem.answer) {
      handleCorrect();
      setTimeout(() => setRound(r => r + 1), 900);
    } else {
      handleWrong();
      setTimeout(() => setLocked(false), 700);
    }
  };

  return (
    <GameLayout
      planetName="Subtração na Floresta"
      themeColor="blue"
      lives={lives}
      score={score}
      gameOver={gameOver}
      onRestart={() => { resetGame(); setRound(0); }}
    >
      <div className="flex flex-col items-center gap-2 sm:gap-6 py-0 sm:py-2">
        <div className="flex items-center justify-center gap-1 sm:gap-3 w-full">
          <h3
            className="text-sm sm:text-3xl font-black text-blue-200 uppercase tracking-wide sm:tracking-widest text-center max-w-[calc(100vw-90px)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Quantos sobram?
          </h3>
          <SpeakButton text={`Você tem ${problem.a}. Tira ${problem.b}. Quanto sobra?`} />
        </div>

        <div
          className="text-2xl sm:text-6xl font-black text-white bg-blue-900/60 rounded-2xl sm:rounded-3xl px-3 sm:px-8 py-1.5 sm:py-4 border-2 sm:border-4 border-white shadow-[0_3px_0_rgba(0,0,0,0.25)] sm:shadow-[0_4px_0_rgba(0,0,0,0.25)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {problem.a} − {problem.b} = ?
        </div>

        <div className="flex flex-wrap gap-0.5 sm:gap-2 justify-center p-1 sm:p-4 rounded-xl sm:rounded-3xl border-2 sm:border-4 border-white bg-blue-700/60 max-w-full">
          {[...Array(problem.a)].map((_, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1, opacity: i < problem.b ? 0.25 : 1 }}
              transition={{ delay: i * 0.05 }}
              className="relative text-2xl sm:text-5xl bg-white rounded-lg sm:rounded-2xl p-0.5 sm:p-2 border-2 border-white shadow-[0_2px_0_rgba(0,0,0,0.15)]"
            >
              {problem.emoji}
              {i < problem.b && (
                <span className="absolute inset-0 flex items-center justify-center text-2xl sm:text-5xl text-red-500 font-black pointer-events-none">
                  ✕
                </span>
              )}
            </motion.span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-4 w-full max-w-md mt-0 sm:mt-2">
          {problem.options.map((o, i) => (
            <motion.button
              key={`${round}-${i}`}
              whileHover={{ scale: locked ? 1 : 1.05 }}
              whileTap={{ scale: locked ? 1 : 0.95 }}
              onClick={() => handleClick(o)}
              disabled={locked}
              className="bg-gradient-to-b from-blue-400 to-blue-600 text-white border-2 sm:border-4 border-white shadow-[0_3px_0_rgb(30,58,138)] sm:shadow-[0_4px_0_rgb(30,58,138)] rounded-xl sm:rounded-2xl font-black text-2xl sm:text-5xl py-2 sm:py-5"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {o}
            </motion.button>
          ))}
        </div>
      </div>
    </GameLayout>
  );
}

/* ============================================================ */
/*                  COUNTING GAME — AGILITY MODE               */
/* ============================================================ */
const COUNTDOWN_SECONDS = 10;

export function CountingGame() {
  const { score, lives, gameOver, handleCorrect, handleWrong, resetGame } = useGameLogic();
  const [round, setRound] = useState(0);
  const [locked, setLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(COUNTDOWN_SECONDS);
  const [flash, setFlash] = useState<'correct' | 'wrong' | null>(null);

  const problem = useMemo(() => {
    const n = Math.floor(Math.random() * 9) + 2;
    const emoji = COUNT_EMOJIS[Math.floor(Math.random() * COUNT_EMOJIS.length)];
    return { n, emoji, options: makeOptions(n) };
  }, [round]);

  // Reset timer and lock state when problem changes
  useEffect(() => {
    setLocked(false);
    setTimeLeft(COUNTDOWN_SECONDS);
    setFlash(null);
  }, [problem]);

  // Countdown timer
  useEffect(() => {
    if (locked || gameOver) return;
    if (timeLeft <= 0) {
      setLocked(true);
      setFlash('wrong');
      handleWrong();
      setTimeout(() => setRound(r => r + 1), 1000);
      return;
    }
    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, locked, gameOver]);

  const handleClick = (v: number) => {
    if (locked) return;
    setLocked(true);
    if (v === problem.n) {
      setFlash('correct');
      handleCorrect();
      setTimeout(() => setRound(r => r + 1), 800);
    } else {
      setFlash('wrong');
      handleWrong();
      setTimeout(() => setRound(r => r + 1), 800);
    }
  };

  const timerFraction = timeLeft / COUNTDOWN_SECONDS;
  const timerColor =
    timerFraction > 0.6 ? 'bg-green-400' :
    timerFraction > 0.3 ? 'bg-yellow-400' :
    'bg-red-500';

  return (
    <GameLayout
      planetName="Contagem Relâmpago ⚡"
      themeColor="yellow"
      lives={lives}
      score={score}
      gameOver={gameOver}
      onRestart={() => { resetGame(); setRound(0); }}
    >
      <div className="flex flex-col items-center gap-2 sm:gap-5 py-0 sm:py-2">
        {/* Timer bar */}
        <div className="w-full flex flex-col gap-1">
          <div className="flex justify-between items-center gap-1">
            <div className="flex items-center gap-1 sm:gap-3 min-w-0">
              <h3
                className="text-sm sm:text-3xl font-black text-yellow-200 uppercase tracking-wide sm:tracking-widest text-center truncate"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Quantos você vê?
              </h3>
              <SpeakButton text="Quantos você vê? Rápido!" />
            </div>
            <motion.span
              key={timeLeft}
              initial={{ scale: 1.4 }}
              animate={{ scale: 1 }}
              className={`text-xl sm:text-4xl font-black shrink-0 ${timeLeft <= 2 ? 'text-red-400' : timeLeft <= 4 ? 'text-yellow-300' : 'text-green-300'}`}
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {timeLeft}s
            </motion.span>
          </div>

          {/* Progress bar track */}
          <div className="w-full h-3 sm:h-5 bg-white/20 rounded-full overflow-hidden border-2 border-white/30">
            <motion.div
              className={`h-full rounded-full ${timerColor} transition-colors duration-300`}
              animate={{ width: `${timerFraction * 100}%` }}
              transition={{ duration: 1, ease: 'linear' }}
            />
          </div>
        </div>

        {/* Flash overlay feedback */}
        <AnimatePresence>
          {flash && (
            <motion.div
              initial={{ opacity: 0.8, scale: 1 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className={`absolute inset-0 rounded-2xl sm:rounded-3xl pointer-events-none ${flash === 'correct' ? 'bg-green-400/30' : 'bg-red-400/30'}`}
            />
          )}
        </AnimatePresence>

        <motion.div
          key={round}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.4 }}
          className="max-w-full"
        >
          <Dots count={problem.n} emoji={problem.emoji} color="bg-yellow-700/60" />
        </motion.div>

        <div className="grid grid-cols-2 gap-2 sm:gap-4 w-full max-w-md">
          {problem.options.map((o, i) => (
            <motion.button
              key={`${round}-${i}`}
              whileHover={{ scale: locked ? 1 : 1.08, y: locked ? 0 : -4 }}
              whileTap={{ scale: locked ? 1 : 0.92 }}
              onClick={() => handleClick(o)}
              disabled={locked}
              className="bg-gradient-to-b from-yellow-400 to-yellow-500 text-white border-2 sm:border-4 border-white shadow-[0_3px_0_rgb(161,98,7)] sm:shadow-[0_4px_0_rgb(161,98,7)] rounded-xl sm:rounded-2xl font-black text-2xl sm:text-5xl py-2 sm:py-5 disabled:opacity-60 transition-all"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {o}
            </motion.button>
          ))}
        </div>

        <p className="text-yellow-200/70 text-xs sm:text-base font-bold text-center">
          ⚡ Responda antes do tempo acabar!
        </p>
      </div>
    </GameLayout>
  );
}

export default AdditionGame;
