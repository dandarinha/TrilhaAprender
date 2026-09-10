import React, { useState, useEffect, useMemo } from 'react';
import { GameLayout } from './GameLayout';
import { useGameLogic } from '../hooks/useGameLogic';
import { motion, AnimatePresence } from 'motion/react';
import { SpeakButton } from './SpeakButton';

type Card = { word: string; emoji: string };
type RhymePair = { id: string; left: Card; right: Card };

// Pares diretos de rimas da natureza e fauna
const RHYME_PAIRS: RhymePair[] = [
  { id: 'r1', left: { word: 'PATO', emoji: '🦆' }, right: { word: 'GATO', emoji: '🐱' } },
  { id: 'r2', left: { word: 'CAVALO', emoji: '🐴' }, right: { word: 'GALO', emoji: '🐓' } },
  { id: 'r3', left: { word: 'LEÃO', emoji: '🦁' }, right: { word: 'LIMÃO', emoji: '🍋' } },
  { id: 'r4', left: { word: 'GIRASSOL', emoji: '🌻' }, right: { word: 'CARACOL', emoji: '🐌' } },
  { id: 'r5', left: { word: 'JOANINHA', emoji: '🐞' }, right: { word: 'GALINHA', emoji: '🐔' } },
  { id: 'r6', left: { word: 'RATO', emoji: '🐀' }, right: { word: 'SAPATO', emoji: '👞' } },
  { id: 'r7', left: { word: 'ABACAXI', emoji: '🍍' }, right: { word: 'SIRI', emoji: '🦀' } },
  { id: 'r8', left: { word: 'SAPO', emoji: '🐸' }, right: { word: 'MATO', emoji: '🌿' } },
  { id: 'r9', left: { word: 'ABELHA', emoji: '🐝' }, right: { word: 'OVELHA', emoji: '🐑' } },
  { id: 'r10', left: { word: 'JACARÉ', emoji: '🐊' }, right: { word: 'PÉ', emoji: '🦶' } },
  { id: 'r11', left: { word: 'MACACO', emoji: '🐒' }, right: { word: 'CASACO', emoji: '🧥' } },
  { id: 'r12', left: { word: 'UVA', emoji: '🍇' }, right: { word: 'CHUVA', emoji: '🌧️' } },
  { id: 'r13', left: { word: 'CAJU', emoji: '🥭' }, right: { word: 'TATU', emoji: '🦔' } },
  { id: 'r14', left: { word: 'TOMATE', emoji: '🍅' }, right: { word: 'ABACATE', emoji: '🥑' } },
  { id: 'r15', left: { word: 'VACA', emoji: '🐮' }, right: { word: 'JACA', emoji: '🍈' } },
  { id: 'r16', left: { word: 'BALEIA', emoji: '🐳' }, right: { word: 'AREIA', emoji: '🏖️' } },
];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const PAIRS_PER_ROUND = 3; // Quantidade de pares exibidos por rodada
const ROUND_TIME_SECONDS = 10; // Tempo máximo de cada rodada

export default function RhymesGame() {
  const { score, lives, gameOver, handleCorrect, handleWrong, resetGame } = useGameLogic();
  
  const [roundIndex, setRoundIndex] = useState(0);
  const [selectedLeft, setSelectedLeft] = useState<Card | null>(null);
  const [selectedRight, setSelectedRight] = useState<Card | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [wrongPair, setWrongPair] = useState<{ leftWord: string; rightWord: string } | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(ROUND_TIME_SECONDS);

  // Embaralha todas as rimas no início do jogo
  const allShuffledPairs = useMemo(() => shuffleArray(RHYME_PAIRS), [gameOver]);

  // Pega os 3 pares da rodada atual
  const currentPairs = useMemo(() => {
    const start = (roundIndex * PAIRS_PER_ROUND) % allShuffledPairs.length;
    return allShuffledPairs.slice(start, start + PAIRS_PER_ROUND);
  }, [roundIndex, allShuffledPairs]);

  // Colunas de cartas para a rodada
  const leftColumn = useMemo(() => currentPairs.map((p) => p.left), [currentPairs]);
  const rightColumn = useMemo(() => shuffleArray(currentPairs.map((p) => p.right)), [currentPairs]);

  const allRoundMatched = matchedIds.length === currentPairs.length && currentPairs.length > 0;

  // Reinicia estados e relógio de 10s ao mudar de rodada
  useEffect(() => {
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatchedIds([]);
    setWrongPair(null);
    setTimeLeft(ROUND_TIME_SECONDS);
  }, [roundIndex, currentPairs, lives]);

  // Efeito do Cronômetro de 10 Segundos
  useEffect(() => {
    if (gameOver || allRoundMatched) return;

    if (timeLeft <= 0) {
      handleWrong(); // Perde vida pelo tempo esgotado
      setRoundIndex((prev) => prev + 1); // Passa para a próxima rodada
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, gameOver, allRoundMatched, handleWrong]);

  // Validação ao selecionar um item de cada lado
  const checkMatch = (left: Card, right: Card) => {
    const correctPair = currentPairs.find((p) => p.left.word === left.word && p.right.word === right.word);

    if (correctPair) {
      handleCorrect();
      setMatchedIds((prev) => [...prev, correctPair.id]);
      setSelectedLeft(null);
      setSelectedRight(null);
    } else {
      handleWrong();
      setWrongPair({ leftWord: left.word, rightWord: right.word });
      setTimeout(() => {
        setWrongPair(null);
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 700);
    }
  };

  const handleLeftSelect = (card: Card) => {
    if (isLeftMatched(card)) return;
    setSelectedLeft(card);
    if (selectedRight) {
      checkMatch(card, selectedRight);
    }
  };

  const handleRightSelect = (card: Card) => {
    if (isRightMatched(card)) return;
    setSelectedRight(card);
    if (selectedLeft) {
      checkMatch(selectedLeft, card);
    }
  };

  const isLeftMatched = (card: Card) => currentPairs.some((p) => p.left.word === card.word && matchedIds.includes(p.id));
  const isRightMatched = (card: Card) => currentPairs.some((p) => p.right.word === card.word && matchedIds.includes(p.id));

  // Avança para a próxima rodada quando todos os pares forem encontrados
  useEffect(() => {
    if (matchedIds.length > 0 && matchedIds.length === currentPairs.length) {
      const timer = setTimeout(() => {
        setRoundIndex((prev) => prev + 1);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [matchedIds, currentPairs]);

  return (
    <GameLayout
      planetName="Trilha das Rimas"
      themeColor="yellow"
      lives={lives}
      score={score}
      gameOver={gameOver}
      onRestart={() => {
        resetGame();
        setRoundIndex(0);
        setTimeLeft(ROUND_TIME_SECONDS);
      }}
    >
      <div className="flex flex-col items-center gap-3 sm:gap-5 py-2 sm:py-4">
        
        {/* Cronômetro e Título */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 sm:gap-3">
            <h3
              className="text-lg sm:text-3xl font-black text-center text-yellow-200 uppercase tracking-widest"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Ligue as palavras que rimam!
            </h3>
            <SpeakButton text="Ligue as palavras que rimam!" />
          </div>

          {/* Badge do Tempo Restante */}
          <motion.div
            animate={timeLeft <= 3 ? { scale: [1, 1.1, 1] } : {}}
            transition={{ repeat: Infinity, duration: 0.5 }}
            className={`px-4 py-1 sm:px-6 sm:py-2 rounded-full border-4 text-sm sm:text-xl font-black flex items-center gap-2 shadow-lg ${
              timeLeft <= 3
                ? 'bg-red-600 border-red-300 text-white animate-bounce'
                : 'bg-amber-800/80 border-amber-400 text-yellow-300'
            }`}
          >
            <span>⏱️ Tempo:</span>
            <span className="text-xl sm:text-2xl">{timeLeft}s</span>
          </motion.div>
        </div>

        {/* Estrutura das duas colunas */}
        <div className="grid grid-cols-2 gap-4 sm:gap-12 w-full max-w-3xl mx-auto px-2">
          
          {/* Coluna A (Esquerda) */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <span className="text-center text-white/80 font-bold text-xs sm:text-sm uppercase tracking-wider">
              Coluna A
            </span>
            {leftColumn.map((card) => {
              const matched = isLeftMatched(card);
              const isSelected = selectedLeft?.word === card.word;
              const isWrong = wrongPair?.leftWord === card.word;

              return (
                <div key={card.word} className="relative">
                  <div className="absolute -top-2 -right-2 z-10">
                    <SpeakButton text={card.word} size={16} />
                  </div>
                  <motion.button
                    whileHover={{ scale: matched ? 1 : 1.03 }}
                    whileTap={{ scale: matched ? 1 : 0.97 }}
                    animate={isWrong ? { x: [-8, 8, -8, 8, 0] } : {}}
                    onClick={() => handleLeftSelect(card)}
                    disabled={matched || timeLeft <= 0}
                    className={`
                      w-full flex items-center gap-2 sm:gap-4 p-2 sm:p-4 rounded-2xl border-4 transition-all min-h-[70px] sm:min-h-[100px]
                      ${matched
                        ? 'bg-green-600/80 border-green-300 opacity-60 cursor-default'
                        : isWrong
                        ? 'bg-red-500 border-red-300 shadow-[0_4px_0_rgb(153,27,27)]'
                        : isSelected
                        ? 'bg-yellow-300 border-white shadow-[0_0_15px_rgba(253,224,71,0.8)] scale-105'
                        : 'bg-gradient-to-b from-yellow-400 to-yellow-500 border-white shadow-[0_4px_0_rgb(161,98,7)] hover:from-yellow-300'
                      }
                    `}
                  >
                    <span className="text-3xl sm:text-5xl bg-white rounded-xl p-1 sm:p-2 border border-white/50 shrink-0">
                      {card.emoji}
                    </span>
                    <span className="text-white font-black text-sm sm:text-2xl uppercase truncate" style={{ fontFamily: 'var(--font-display)' }}>
                      {card.word}
                    </span>
                  </motion.button>
                </div>
              );
            })}
          </div>

          {/* Coluna B (Direita) */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <span className="text-center text-white/80 font-bold text-xs sm:text-sm uppercase tracking-wider">
              Coluna B
            </span>
            {rightColumn.map((card) => {
              const matched = isRightMatched(card);
              const isSelected = selectedRight?.word === card.word;
              const isWrong = wrongPair?.rightWord === card.word;

              return (
                <div key={card.word} className="relative">
                  <div className="absolute -top-2 -right-2 z-10">
                    <SpeakButton text={card.word} size={16} />
                  </div>
                  <motion.button
                    whileHover={{ scale: matched ? 1 : 1.03 }}
                    whileTap={{ scale: matched ? 1 : 0.97 }}
                    animate={isWrong ? { x: [-8, 8, -8, 8, 0] } : {}}
                    onClick={() => handleRightSelect(card)}
                    disabled={matched || timeLeft <= 0}
                    className={`
                      w-full flex items-center gap-2 sm:gap-4 p-2 sm:p-4 rounded-2xl border-4 transition-all min-h-[70px] sm:min-h-[100px]
                      ${matched
                        ? 'bg-green-600/80 border-green-300 opacity-60 cursor-default'
                        : isWrong
                        ? 'bg-red-500 border-red-300 shadow-[0_4px_0_rgb(153,27,27)]'
                        : isSelected
                        ? 'bg-yellow-300 border-white shadow-[0_0_15px_rgba(253,224,71,0.8)] scale-105'
                        : 'bg-gradient-to-b from-yellow-400 to-yellow-500 border-white shadow-[0_4px_0_rgb(161,98,7)] hover:from-yellow-300'
                      }
                    `}
                  >
                    <span className="text-3xl sm:text-5xl bg-white rounded-xl p-1 sm:p-2 border border-white/50 shrink-0">
                      {card.emoji}
                    </span>
                    <span className="text-white font-black text-sm sm:text-2xl uppercase truncate" style={{ fontFamily: 'var(--font-display)' }}>
                      {card.word}
                    </span>
                  </motion.button>
                </div>
              );
            })}
          </div>

        </div>

        {/* Feedback visual de sucesso */}
        <AnimatePresence>
          {allRoundMatched && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-xl sm:text-3xl font-black text-green-400 text-center mt-2"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Parabéns! Você encontrou todas as rimas! 🎉
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GameLayout>
  );
}