import React, { useState, useEffect, useMemo } from 'react';
import { GameLayout } from './GameLayout';
import { useGameLogic } from '../hooks/useGameLogic';
import { motion, AnimatePresence } from 'motion/react';
import { SpeakButton } from './SpeakButton';

type Card = { word: string; emoji: string };
type RhymeSet = { id: string; target: Card; rhyme: Card; distractors: Card[] };

// Apenas animais, flores, insetos, frutas e vegetais (todos com emoji correspondente)
const RHYME_SETS: RhymeSet[] = [
  { id: 'r1', target: { word: 'PATO', emoji: '🦆' },     rhyme: { word: 'GATO', emoji: '🐱' },     distractors: [{ word: 'ABELHA', emoji: '🐝' }, { word: 'UVA', emoji: '🍇' }] },
  { id: 'r2', target: { word: 'RATO', emoji: '🐀' },     rhyme: { word: 'PATO', emoji: '🦆' },     distractors: [{ word: 'ROSA', emoji: '🌹' }, { word: 'LEÃO', emoji: '🦁' }] },
  { id: 'r3', target: { word: 'CAVALO', emoji: '🐴' },   rhyme: { word: 'GALO', emoji: '🐓' },     distractors: [{ word: 'MORANGO', emoji: '🍓' }, { word: 'COELHO', emoji: '🐰' }] },
  { id: 'r4', target: { word: 'LEÃO', emoji: '🦁' },     rhyme: { word: 'LIMÃO', emoji: '🍋' },    distractors: [{ word: 'TIGRE', emoji: '🐯' }, { word: 'PATO', emoji: '🦆' }] },
  { id: 'r5', target: { word: 'GIRASSOL', emoji: '🌻' }, rhyme: { word: 'CARACOL', emoji: '🐌' },  distractors: [{ word: 'PEIXE', emoji: '🐟' }, { word: 'MAÇÃ', emoji: '🍎' }] },
  { id: 'r6', target: { word: 'FOCA', emoji: '🦭' },     rhyme: { word: 'MINHOCA', emoji: '🪱' },  distractors: [{ word: 'BANANA', emoji: '🍌' }, { word: 'SAPO', emoji: '🐸' }] },
  { id: 'r7', target: { word: 'GATO', emoji: '🐱' },     rhyme: { word: 'RATO', emoji: '🐀' },     distractors: [{ word: 'FLOR', emoji: '🌷' }, { word: 'PERA', emoji: '🍐' }] },
  { id: 'r8', target: { word: 'JOANINHA', emoji: '🐞' }, rhyme: { word: 'GALINHA', emoji: '🐔' },  distractors: [{ word: 'TUCANO', emoji: '🐦' }, { word: 'GORILA', emoji: '🦍' }] },
];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function RhymesGame() {
  const { score, lives, gameOver, handleCorrect, handleWrong, resetGame } = useGameLogic();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<Card[]>([]);
  const [completed, setCompleted] = useState(false);
  const [wrongWords, setWrongWords] = useState<string[]>([]);

  const sets = useMemo(() => shuffleArray(RHYME_SETS), []);
  const current = sets[currentIndex % sets.length];

  useEffect(() => {
    setOptions(shuffleArray([current.rhyme, ...current.distractors]));
    setCompleted(false);
    setWrongWords([]);
  }, [current, lives]);

  const handleOptionClick = (card: Card) => {
    if (completed || wrongWords.includes(card.word)) return;

    if (card.word === current.rhyme.word) {
      setCompleted(true);
      handleCorrect();
      setTimeout(() => setCurrentIndex((i) => i + 1), 1400);
    } else {
      setWrongWords((prev) => [...prev, card.word]);
      handleWrong();
      setTimeout(() => setWrongWords((prev) => prev.filter((w) => w !== card.word)), 700);
    }
  };

  return (
    <GameLayout
      planetName="Trilha das Rimas"
      themeColor="yellow"
      lives={lives}
      score={score}
      gameOver={gameOver}
      onRestart={() => {
        resetGame();
        setCurrentIndex(0);
      }}
    >
      <div className="flex flex-col items-center gap-5 sm:gap-8 py-2 sm:py-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <h3
            className="text-lg sm:text-3xl font-black text-center text-yellow-200 uppercase tracking-widest"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Qual palavra rima?
          </h3>
          <SpeakButton text={`Qual palavra rima com ${current.target.word}?`} />
        </div>

        {/* Palavra alvo */}
        <div className="flex flex-col items-center gap-2 sm:gap-3 bg-black/40 p-4 sm:p-8 rounded-3xl border-4 border-yellow-500/50">
          <div className="relative">
            <span className="text-6xl sm:text-8xl bg-white rounded-3xl p-3 sm:p-4 border-4 border-white shadow-[0_6px_0_rgba(0,0,0,0.2)] inline-block">
              {current.target.emoji}
            </span>
            <div className="absolute -top-3 -right-3">
              <SpeakButton text={current.target.word} />
            </div>
          </div>
          <span className="text-3xl sm:text-5xl font-black text-white uppercase" style={{ fontFamily: 'var(--font-display)' }}>
            {current.target.word}
          </span>
        </div>

        {/* Opções */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full max-w-2xl mx-auto">
          {options.map((opt) => {
            const isWrong = wrongWords.includes(opt.word);
            const isCorrectAnswer = opt.word === current.rhyme.word;
            const showCorrect = completed && isCorrectAnswer;
            const dimmed = completed && !isCorrectAnswer;

            return (
              <div key={opt.word} className="relative">
                {!completed && (
                  <div className="absolute -top-3 -right-3 z-10">
                    <SpeakButton text={opt.word} size={16} />
                  </div>
                )}
                <motion.button
                  layout
                  whileHover={{ scale: completed ? 1 : 1.05 }}
                  whileTap={{ scale: completed ? 1 : 0.95 }}
                  animate={isWrong ? { x: [-8, 8, -8, 8, 0] } : {}}
                  onClick={() => handleOptionClick(opt)}
                  disabled={completed}
                  className={`
                    w-full flex flex-col items-center justify-center gap-2 p-2 sm:p-4 rounded-3xl border-4 border-white transition-all min-h-[100px] sm:min-h-[170px]
                    ${showCorrect
                      ? 'bg-green-500 shadow-[0_4px_0_rgb(21,128,61)] scale-110'
                      : dimmed
                      ? 'bg-gray-600/40 opacity-40'
                      : isWrong
                      ? 'bg-red-500 shadow-[0_4px_0_rgb(153,27,27)]'
                      : 'bg-gradient-to-b from-yellow-400 to-yellow-500 shadow-[0_4px_0_rgb(161,98,7)] hover:from-yellow-300'
                    }
                  `}
                >
                  <span className="text-4xl sm:text-6xl bg-white rounded-2xl p-2 sm:p-3 border-2 border-white">{opt.emoji}</span>
                  <span className="text-white font-black text-sm sm:text-xl uppercase" style={{ fontFamily: 'var(--font-display)' }}>
                    {opt.word}
                  </span>
                </motion.button>
              </div>
            );
          })}
        </div>

        <AnimatePresence>
          {completed && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-lg sm:text-3xl font-black text-green-400 text-center"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {current.target.word} rima com {current.rhyme.word}! 🎉
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GameLayout>
  );
}
