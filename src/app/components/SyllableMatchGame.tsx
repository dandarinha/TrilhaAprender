import React, { useState, useEffect, useMemo } from 'react';
import { GameLayout } from './GameLayout';
import { useGameLogic } from '../hooks/useGameLogic';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { SpeakButton } from './SpeakButton';

type Target = { syllable: string; word: string; emoji: string };
type Distractor = { word: string; emoji: string };
type Level = { consonant: string; bank: Target[]; distractors: Distractor[] };

/**
 * Sílaba inicial: cada nível é uma consoante com seu banco de sílabas
 * (todas as sílabas básicas formadas por aquela consoante — ex.: B → BA, BE, BI, BO, BU).
 * A criança clica na figura e a sílaba correspondente perde o brilho no banco.
 */
const LEVELS: Level[] = [
  {
    consonant: 'B',
    bank: [
      { syllable: 'BA', word: 'BALEIA',   emoji: '🐳' },
      { syllable: 'BE', word: 'BESOURO',  emoji: '🪲' },
      { syllable: 'BI', word: 'BISONTE',  emoji: '🦬' },
      { syllable: 'BO', word: 'BOTO',     emoji: '🐬' },
      { syllable: 'BU', word: 'BÚFALO',   emoji: '🐃' },
    ],
    distractors: [
      { word: 'ARARA', emoji: '🦜' },
      { word: 'ONÇA',  emoji: '🐆' },
      { word: 'UVA',   emoji: '🍇' },
    ],
  },
  {
    consonant: 'C',
    bank: [
      { syllable: 'CA', word: 'CAVALO',  emoji: '🐴' },
      { syllable: 'CE', word: 'CENOURA', emoji: '🥕' },
      { syllable: 'CI', word: 'CISNE',   emoji: '🦢' },
      { syllable: 'CO', word: 'COELHO',  emoji: '🐰' },
    ],
    distractors: [
      { word: 'PATO',   emoji: '🦆' },
      { word: 'ABELHA', emoji: '🐝' },
      { word: 'UVA',    emoji: '🍇' },
    ],
  },
  {
    consonant: 'G',
    bank: [
      { syllable: 'GA', word: 'GATO',      emoji: '🐱' },
      { syllable: 'GI', word: 'GIRASSOL',  emoji: '🌻' },
      { syllable: 'GO', word: 'GORILA',    emoji: '🦍' },
    ],
    distractors: [
      { word: 'PATO',   emoji: '🦆' },
      { word: 'ABELHA', emoji: '🐝' },
      { word: 'MAÇÃ',   emoji: '🍎' },
    ],
  },
  {
    consonant: 'L',
    bank: [
      { syllable: 'LA', word: 'LAGARTO', emoji: '🦎' },
      { syllable: 'LE', word: 'LEÃO',    emoji: '🦁' },
      { syllable: 'LI', word: 'LIMÃO',   emoji: '🍋' },
      { syllable: 'LO', word: 'LOBO',    emoji: '🐺' },
      { syllable: 'LU', word: 'LULA',    emoji: '🦑' },
    ],
    distractors: [
      { word: 'TIGRE',  emoji: '🐯' },
      { word: 'ABELHA', emoji: '🐝' },
      { word: 'UVA',    emoji: '🍇' },
    ],
  },
  {
    consonant: 'M',
    bank: [
      { syllable: 'MA', word: 'MACACO',   emoji: '🐵' },
      { syllable: 'ME', word: 'MELANCIA', emoji: '🍉' },
      { syllable: 'MI', word: 'MINHOCA',  emoji: '🪱' },
      { syllable: 'MO', word: 'MORANGO',  emoji: '🍓' },
    ],
    distractors: [
      { word: 'PATO',  emoji: '🦆' },
      { word: 'ARARA', emoji: '🦜' },
      { word: 'TIGRE', emoji: '🐯' },
    ],
  },
  {
    consonant: 'P',
    bank: [
      { syllable: 'PA', word: 'PATO',    emoji: '🦆' },
      { syllable: 'PE', word: 'PEIXE',   emoji: '🐟' },
      { syllable: 'PI', word: 'PINGUIM', emoji: '🐧' },
      { syllable: 'PO', word: 'POMBO',   emoji: '🕊️' },
    ],
    distractors: [
      { word: 'GATO',  emoji: '🐱' },
      { word: 'ARARA', emoji: '🦜' },
      { word: 'BOTO',  emoji: '🐬' },
    ],
  },
  {
    consonant: 'T',
    bank: [
      { syllable: 'TA', word: 'TARTARUGA', emoji: '🐢' },
      { syllable: 'TI', word: 'TIGRE',     emoji: '🐯' },
      { syllable: 'TO', word: 'TOMATE',    emoji: '🍅' },
      { syllable: 'TU', word: 'TUCANO',    emoji: '🐦' },
    ],
    distractors: [
      { word: 'MACACO', emoji: '🐵' },
      { word: 'ONÇA',   emoji: '🐆' },
      { word: 'ABELHA', emoji: '🐝' },
    ],
  },
  {
    consonant: 'R',
    bank: [
      { syllable: 'RA', word: 'RATO',        emoji: '🐀' },
      { syllable: 'RE', word: 'RENA',        emoji: '🦌' },
      { syllable: 'RI', word: 'RINOCERONTE', emoji: '🦏' },
      { syllable: 'RO', word: 'ROSA',        emoji: '🌹' },
    ],
    distractors: [
      { word: 'GATO',   emoji: '🐱' },
      { word: 'ABELHA', emoji: '🐝' },
      { word: 'UVA',    emoji: '🍇' },
    ],
  },
  {
    consonant: 'V',
    bank: [
      { syllable: 'VA', word: 'VACA',   emoji: '🐮' },
      { syllable: 'VE', word: 'VEADO',  emoji: '🦌' },
      { syllable: 'VI', word: 'VÍBORA', emoji: '🐍' },
    ],
    distractors: [
      { word: 'PATO',    emoji: '🦆' },
      { word: 'ABELHA',  emoji: '🐝' },
      { word: 'MORANGO', emoji: '🍓' },
    ],
  },
];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

type Figure = { word: string; emoji: string; syllable: string | null };

export default function SyllableMatchGame() {
  const { score, lives, gameOver, handleCorrect, handleWrong, resetGame } = useGameLogic();
  const [levelIndex, setLevelIndex] = useState(0);
  const [foundSyllables, setFoundSyllables] = useState<string[]>([]);
  const [wrongIds, setWrongIds] = useState<string[]>([]);

  const level = useMemo(() => LEVELS[levelIndex % LEVELS.length], [levelIndex]);

  const figures = useMemo<Figure[]>(() => {
    const targets: Figure[] = level.bank.map((t) => ({ word: t.word, emoji: t.emoji, syllable: t.syllable }));
    const distractors: Figure[] = level.distractors.map((d) => ({ word: d.word, emoji: d.emoji, syllable: null }));
    return shuffleArray<Figure>([...targets, ...distractors]);
  }, [level]);

  useEffect(() => {
    setFoundSyllables([]);
    setWrongIds([]);
  }, [levelIndex, lives, level.consonant]);

  const handlePick = (fig: Figure) => {
    if (wrongIds.includes(fig.word)) return;
    // Alvo correto ainda não encontrado
    if (fig.syllable && !foundSyllables.includes(fig.syllable)) {
      const newFound = [...foundSyllables, fig.syllable];
      setFoundSyllables(newFound);
      if (newFound.length === level.bank.length) {
        handleCorrect();
        setTimeout(() => setLevelIndex((i) => i + 1), 900);
      }
      return;
    }
    // Já encontrado — ignora
    if (fig.syllable && foundSyllables.includes(fig.syllable)) return;
    // Distrator (não começa com a consoante)
    setWrongIds((w) => [...w, fig.word]);
    handleWrong();
    setTimeout(() => setWrongIds((w) => w.filter((x) => x !== fig.word)), 700);
  };

  return (
    <GameLayout
      planetName={`Sílaba Inicial — Letra ${level.consonant}`}
      themeColor="blue"
      lives={lives}
      score={score}
      gameOver={gameOver}
      onRestart={() => {
        resetGame();
        setLevelIndex(0);
      }}
    >
      <div className="flex flex-col items-center gap-5 sm:gap-7 py-2 sm:py-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <h3
            className="text-base sm:text-2xl font-black text-center text-[#bfe0ff] uppercase tracking-widest"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Ache as figuras da letra
          </h3>
          <SpeakButton text={level.consonant} />
        </div>

        {/* Placa de madeira com a consoante */}
        <div className="bg-gradient-to-b from-[#a9713f] to-[#6b3f22] text-white font-black text-4xl sm:text-6xl px-6 py-3 sm:px-10 sm:py-5 rounded-3xl border-4 border-[#c99161] shadow-[0_6px_0_rgba(0,0,0,0.35)]" style={{ fontFamily: 'var(--font-display)' }}>
          {level.consonant}
        </div>

        {/* Banco de sílabas (folhas) — perdem o brilho ao serem encontradas */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 w-full">
          {level.bank.map((t) => {
            const found = foundSyllables.includes(t.syllable);
            return (
              <motion.div
                key={t.syllable}
                animate={found ? { scale: [1, 1.15, 1] } : {}}
                className={`
                  flex items-center gap-1.5 px-3 py-2 sm:px-5 sm:py-3 rounded-2xl border-4 font-black text-xl sm:text-3xl transition-all
                  ${found
                    ? 'bg-[#0d3d28] text-white/25 border-white/10 shadow-none'
                    : 'bg-gradient-to-b from-[#57b85b] to-[#2e7d32] text-white border-white shadow-[0_4px_0_rgba(0,0,0,0.3)] drop-shadow-[0_0_10px_rgba(53,179,91,0.6)]'}
                `}
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {found && <Check size={18} className="text-[#57b85b]" />}
                {t.syllable}
              </motion.div>
            );
          })}
        </div>

        {/* Figuras */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 w-full max-w-2xl mx-auto">
          {figures.map((fig) => {
            const isFound = fig.syllable != null && foundSyllables.includes(fig.syllable);
            const isWrong = wrongIds.includes(fig.word);
            return (
              <div key={fig.word} className="relative w-[28%] sm:w-[21%]">
                {!isFound && (
                  <div className="absolute -top-3 -right-3 z-10">
                    <SpeakButton text={fig.word} size={16} />
                  </div>
                )}
                {isFound && (
                  <div className="absolute -top-3 -right-3 z-10 bg-[#35b35b] text-white rounded-full p-1.5 border-2 border-white shadow-md">
                    <Check size={16} />
                  </div>
                )}
                <motion.button
                  whileHover={{ scale: isFound ? 1 : 1.05 }}
                  whileTap={{ scale: isFound ? 1 : 0.95 }}
                  animate={isWrong ? { x: [-8, 8, -8, 8, 0] } : {}}
                  onClick={() => handlePick(fig)}
                  disabled={isFound}
                  className={`
                    w-full flex flex-col items-center justify-center gap-1 p-2 sm:p-4 rounded-3xl border-4 transition-all min-h-[88px] sm:min-h-[150px]
                    ${isFound
                      ? 'bg-[#0d3d28] border-[#35b35b]/40 opacity-50'
                      : isWrong
                      ? 'bg-[#e0402b] border-white'
                      : 'bg-gradient-to-b from-[#2a7de1] to-[#1c5db0] border-white shadow-[0_4px_0_rgba(0,0,0,0.3)] hover:from-[#3a8def]'}
                  `}
                >
                  <span className="text-3xl sm:text-6xl bg-white rounded-2xl p-1.5 sm:p-3 border-2 border-white">{fig.emoji}</span>
                </motion.button>
              </div>
            );
          })}
        </div>

        <p className="text-[#bfe0ff]/70 text-xs sm:text-base font-bold text-center">
          Clique na figura que começa com cada sílaba do banco! 🌿
        </p>
      </div>
    </GameLayout>
  );
}
