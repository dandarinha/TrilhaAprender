import React, { useState, useEffect, useMemo } from 'react';
import { GameLayout } from './GameLayout';
import { useGameLogic } from '../hooks/useGameLogic';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCcw } from 'lucide-react';
import { SpeakButton } from './SpeakButton';

// Apenas animais, flores, insetos, frutas e vegetais (todos com emoji correspondente)
const WORDS_DATA = [
  // 2 sílabas
  { word: "GATO",       syllables: ["GA", "TO"],              emoji: "🐱" },
  { word: "PATO",       syllables: ["PA", "TO"],              emoji: "🦆" },
  { word: "RATO",       syllables: ["RA", "TO"],              emoji: "🐀" },
  { word: "SAPO",       syllables: ["SA", "PO"],              emoji: "🐸" },
  { word: "VACA",       syllables: ["VA", "CA"],              emoji: "🐮" },
  { word: "PERA",       syllables: ["PE", "RA"],              emoji: "🍐" },
  { word: "LOBO",       syllables: ["LO", "BO"],              emoji: "🐺" },
  { word: "ROSA",       syllables: ["RO", "SA"],              emoji: "🌹" },
  { word: "GALO",       syllables: ["GA", "LO"],              emoji: "🐓" },
  // 3 sílabas
  { word: "BANANA",     syllables: ["BA", "NA", "NA"],        emoji: "🍌" },
  { word: "MACACO",     syllables: ["MA", "CA", "CO"],        emoji: "🐵" },
  { word: "CAVALO",     syllables: ["CA", "VA", "LO"],        emoji: "🐴" },
  { word: "TUCANO",     syllables: ["TU", "CA", "NO"],        emoji: "🐦" },
  { word: "ARARA",      syllables: ["A", "RA", "RA"],          emoji: "🦜" },
  { word: "TOMATE",     syllables: ["TO", "MA", "TE"],        emoji: "🍅" },
  { word: "ABELHA",     syllables: ["A", "BE", "LHA"],        emoji: "🐝" },
  { word: "COELHO",     syllables: ["CO", "E", "LHO"],        emoji: "🐰" },
  { word: "CENOURA",    syllables: ["CE", "NOU", "RA"],       emoji: "🥕" },
  { word: "MORANGO",    syllables: ["MO", "RAN", "GO"],       emoji: "🍓" },
  { word: "LAGARTO",    syllables: ["LA", "GAR", "TO"],       emoji: "🦎" },
  { word: "GORILA",     syllables: ["GO", "RI", "LA"],        emoji: "🦍" },
  // 4 sílabas
  { word: "MELANCIA",   syllables: ["ME", "LAN", "CI", "A"],   emoji: "🍉" },
  { word: "BORBOLETA",  syllables: ["BOR", "BO", "LE", "TA"],  emoji: "🦋" },
  { word: "TARTARUGA",  syllables: ["TAR", "TA", "RU", "GA"],  emoji: "🐢" },
  { word: "JOANINHA",   syllables: ["JO", "A", "NI", "NHA"],   emoji: "🐞" },
  { word: "ELEFANTE",   syllables: ["E", "LE", "FAN", "TE"],   emoji: "🐘" },
];

function shuffleWords<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function PortugueseGame() {
  const { score, lives, gameOver, handleCorrect, handleWrong, resetGame } = useGameLogic();

  const [correctCount, setCorrectCount] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [shuffledSyllables, setShuffledSyllables] = useState<string[]>([]);
  const [selectedSyllables, setSelectedSyllables] = useState<string[]>([]);
  
  // Word Search state
  const [isWordSearch, setIsWordSearch] = useState(false);
  const [grid, setGrid] = useState<{letter: string, id: string}[]>([]);
  const [wordSearchSelected, setWordSearchSelected] = useState<string[]>([]);

  // Nível sobe a cada 3 acertos: 2 sílabas → 3 sílabas → 4 sílabas...
  const targetSyllables = 2 + Math.floor(correctCount / 3);
  const level = Math.floor(correctCount / 3) + 1;

  const pool = useMemo(
    () => WORDS_DATA.filter(w => w.syllables.length === targetSyllables),
    [targetSyllables]
  );
  const wordList = useMemo(() => shuffleWords(pool.length > 0 ? pool : WORDS_DATA), [pool]);
  const currentWordData = useMemo(() => wordList[currentWordIndex % wordList.length], [wordList, currentWordIndex]);

  useEffect(() => {
    // Collect all syllables
    const allSyllables = WORDS_DATA.flatMap((w) => w.syllables);
    const distractors: string[] = [];
    
    // Select 2 or 3 random distractors that are not in the current word
    while (distractors.length < 3) {
      const randomSyl = allSyllables[Math.floor(Math.random() * allSyllables.length)];
      if (!currentWordData.syllables.includes(randomSyl) && !distractors.includes(randomSyl)) {
        distractors.push(randomSyl);
      }
    }

    setShuffledSyllables(shuffleArray([...currentWordData.syllables, ...distractors]));
    setSelectedSyllables([]);
  }, [currentWordData, lives]);

  const handleSyllableClick = (syllable: string, originalIndex: number) => {
    const id = syllable + '-' + originalIndex;
    if (selectedSyllables.includes(id)) return;
    
    const newSelection = [...selectedSyllables, id];
    setSelectedSyllables(newSelection);
    
    const cleanSelection = newSelection.map(s => s.split('-')[0]);
    const expectedSoFar = currentWordData.syllables.slice(0, cleanSelection.length);
    const isCorrectSoFar = cleanSelection.every((val, index) => val === expectedSoFar[index]);
    
    if (!isCorrectSoFar) {
      handleWrong();
      setSelectedSyllables([]);
      return;
    }

    if (cleanSelection.length === currentWordData.syllables.length) {
      handleCorrect();
      setTimeout(() => {
        setupWordSearch();
      }, 800);
    }
  };

  const setupWordSearch = () => {
    const word = currentWordData.word;
    const size = Math.max(5, word.length + 1);
    const newGrid = Array(size * size).fill('');
    
    // Decide if horizontal or vertical
    const isHorizontal = Math.random() > 0.5;
    
    let startRow = 0;
    let startCol = 0;
    
    if (isHorizontal) {
      startRow = Math.floor(Math.random() * size);
      startCol = Math.floor(Math.random() * (size - word.length + 1));
      for (let i = 0; i < word.length; i++) {
        newGrid[startRow * size + startCol + i] = word[i];
      }
    } else {
      startRow = Math.floor(Math.random() * (size - word.length + 1));
      startCol = Math.floor(Math.random() * size);
      for (let i = 0; i < word.length; i++) {
        newGrid[(startRow + i) * size + startCol] = word[i];
      }
    }
    
    // Fill the rest with random letters
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const finalGrid = newGrid.map((l, i) => ({
      id: `cell-${i}`,
      letter: l === '' ? alphabet[Math.floor(Math.random() * alphabet.length)] : l
    }));
    
    setGrid(finalGrid);
    setWordSearchSelected([]);
    setIsWordSearch(true);
  };

  const handleWordSearchClick = (cell: {letter: string, id: string}) => {
    if (wordSearchSelected.includes(cell.id)) return;
    
    const word = currentWordData.word;
    const expectedLetter = word[wordSearchSelected.length];
    
    if (cell.letter === expectedLetter) {
      const newSelection = [...wordSearchSelected, cell.id];
      setWordSearchSelected(newSelection);
      
      if (newSelection.length === word.length) {
        handleCorrect();
        setTimeout(() => {
          setIsWordSearch(false);
          setCorrectCount(c => c + 1);
          setCurrentWordIndex(prev => prev + 1);
        }, 1000);
      }
    } else {
      handleWrong();
      setWordSearchSelected([]);
    }
  };

  const handleClear = () => setSelectedSyllables([]);

  return (
    <GameLayout
      planetName="Trilha das Palavras"
      themeColor="red"
      lives={lives}
      score={score}
      gameOver={gameOver}
      onRestart={() => {
        resetGame();
        setCurrentWordIndex(0);
        setCorrectCount(0);
      }}
    >
      <div className="flex flex-col items-center justify-center gap-4 sm:gap-8 py-2 sm:py-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <h3
            className="text-xl sm:text-3xl font-black text-center uppercase tracking-widest text-red-200"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Forme a palavra!
          </h3>
          <SpeakButton text={currentWordData.word} />
        </div>

        <div className="flex items-center gap-2 sm:gap-4 text-red-100 font-bold flex-wrap justify-center">
          <span className="bg-red-900/60 border-2 border-white px-3 py-1 rounded-full text-sm sm:text-base" style={{ fontFamily: 'var(--font-display)' }}>
            Nível {level} — {targetSyllables} sílabas
          </span>
          <span className="bg-red-900/60 border-2 border-white px-3 py-1 rounded-full text-sm sm:text-base">
            {correctCount % 3} / 3
          </span>
        </div>

        <div className="relative inline-block">
          <div className="text-7xl sm:text-9xl mb-2 sm:mb-4 bg-white rounded-3xl p-4 sm:p-6 border-4 border-white shadow-[0_8px_0_rgba(0,0,0,0.2)]">
            {currentWordData.emoji}
          </div>
          <div className="absolute -top-2 -right-2">
            <SpeakButton text={currentWordData.word} />
          </div>
        </div>

        {isWordSearch ? (
          <div className="flex flex-col items-center gap-3 sm:gap-4 w-full">
            <h4 className="text-lg sm:text-2xl font-bold text-white mb-1 sm:mb-2">Encontre a palavra!</h4>
            <div
              className="grid gap-1.5 sm:gap-2 p-3 sm:p-4 bg-red-900/60 rounded-2xl border-4 border-red-400"
              style={{ gridTemplateColumns: `repeat(${Math.max(5, currentWordData.word.length + 1)}, minmax(0, 1fr))` }}
            >
              {grid.map((cell) => {
                const isSelected = wordSearchSelected.includes(cell.id);
                return (
                  <motion.button
                    key={cell.id}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleWordSearchClick(cell)}
                    className={`
                      w-9 h-9 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-base sm:text-3xl font-black transition-colors border-2
                      ${isSelected
                        ? 'bg-green-500 text-white border-white shadow-lg'
                        : 'bg-white text-red-600 border-red-200 shadow-sm hover:bg-red-50'}
                    `}
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {cell.letter}
                  </motion.button>
                )
              })}
            </div>
            <div className="h-10 mt-2 sm:mt-4 flex gap-2">
              {wordSearchSelected.map((id, i) => (
                <div key={i} className="w-7 sm:w-8 h-10 border-b-4 border-white text-xl sm:text-2xl font-bold text-center text-white">
                  {grid.find(c => c.id === id)?.letter}
                </div>
              ))}
              {Array.from({ length: currentWordData.word.length - wordSearchSelected.length }).map((_, i) => (
                <div key={`empty-${i}`} className="w-7 sm:w-8 h-10 border-b-4 border-white/30" />
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2 sm:gap-4 min-h-16 sm:min-h-32 p-4 sm:p-6 border-4 border-dashed border-red-300 rounded-3xl bg-black/30 justify-center items-center w-full max-w-3xl relative">
              {selectedSyllables.length > 0 && (
                <button
                  onClick={handleClear}
                  className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                >
                  <RefreshCcw size={16} />
                </button>
              )}

              <AnimatePresence mode="popLayout">
                {selectedSyllables.length === 0 ? (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-white/40 text-sm sm:text-lg font-bold flex items-center h-full text-center"
                  >
                    Clique nas sílabas na ordem certa
                  </motion.span>
                ) : (
                  selectedSyllables.map((item, i) => (
                    <motion.div
                      initial={{ scale: 0, opacity: 0, y: -20 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0, opacity: 0 }}
                      key={item + i}
                      className="bg-white text-red-600 font-black text-2xl sm:text-5xl px-4 sm:px-8 py-3 sm:py-6 rounded-2xl shadow-md"
                    >
                      {item.split('-')[0]}
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-4 justify-center mt-3 sm:mt-6 w-full max-w-2xl">
              {shuffledSyllables.map((syllable, index) => {
                const id = syllable + '-' + index;
                const isSelected = selectedSyllables.includes(id);
                return (
                  <div key={id} className="relative">
                    {!isSelected && (
                      <div className="absolute -top-3 -right-3 z-10">
                        <SpeakButton text={syllable} size={16} />
                      </div>
                    )}
                    <motion.button
                      whileHover={{ scale: isSelected ? 1 : 1.05 }}
                      whileTap={{ scale: isSelected ? 1 : 0.95 }}
                      onClick={() => handleSyllableClick(syllable, index)}
                      disabled={isSelected}
                      className={`
                        ${isSelected
                          ? 'bg-black/30 text-white/20 border-white/10 shadow-none scale-95'
                          : 'bg-gradient-to-b from-red-400 to-red-600 text-white border-red-700 shadow-[0_4px_0_rgb(153,27,27)] hover:from-red-300 hover:to-red-500'
                        }
                        border px-5 sm:px-10 py-3 sm:py-6 rounded-2xl font-black text-2xl sm:text-5xl transition-all duration-200 uppercase
                      `}
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {syllable}
                    </motion.button>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </GameLayout>
  );
}