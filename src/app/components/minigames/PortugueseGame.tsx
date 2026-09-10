import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGame } from '../GameContext';
import { SpeakButton } from '../SpeakButton';

const words = [
  { word: 'GATO', image: '🐱', missing: 2, options: ['T', 'P', 'M'] },
  { word: 'SOL',  image: '☀️', missing: 0, options: ['S', 'C', 'L'] },
  { word: 'FLOR', image: '🌸', missing: 2, options: ['O', 'A', 'U'] },
];

export function PortugueseGame() {
  const { state, addStars, goToScreen } = useGame();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const question = words[currentQuestion];
  const wordArray = question.word.split('');
  const correctLetter = wordArray[question.missing];

  const handleSelect = (letter: string) => {
    if (isCorrect !== null) return;
    setSelectedAnswer(letter);
  };

  const handleVerify = () => {
    if (!selectedAnswer) return;
    const correct = selectedAnswer === correctLetter;
    setIsCorrect(correct);
    if (correct) addStars(1);
  };

  const handleNext = () => {
    if (currentQuestion < words.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    } else {
      goToScreen('reward');
    }
  };

  const tutorId = typeof window !== 'undefined' ? localStorage.getItem('spaceKidsTutor') : 'Zap';
  const tutorHex = tutorId === 'Zap' ? '#ef4444' : tutorId === 'Zep' ? '#3b82f6' : '#eab308';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0420] via-[#1a0b2e] to-[#0f1854] flex flex-col text-white font-body relative overflow-hidden">
      {/* Header Bar */}
      <header className="relative z-10 w-full p-4 sm:p-6 flex items-center justify-between bg-black/40 backdrop-blur-md border-b-4 border-pink-500/50 shadow-lg shrink-0">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="bg-white rounded-full p-2 border-2 border-pink-400">
          </div>
          <div>
            <h1 className="font-display text-xl sm:text-2xl text-pink-400">
              Fase {currentQuestion + 1}/{words.length} — Planeta das Letras
            </h1>
            <p className="text-sm font-bold text-white/70">{state.playerName}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-black text-xl border-2 border-white shadow-[0_4px_0_rgba(161,98,7,1)]">
            ⭐ {state.stars}
          </div>
          <SpeakButton text="Encontre a letra que falta para formar a palavra!" className="bg-pink-500 text-white border-2 border-white" size={28} />
        </div>
      </header>

      {/* Central Play Area — fixed layout, no shifting */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-8 w-full">
        <div className="w-full max-w-lg flex flex-col items-center gap-6 sm:gap-8">

          {/* Card — fixed min-height so content swap never shifts layout */}
          <div className="w-full bg-white rounded-3xl shadow-[0_8px_0_rgba(0,0,0,0.2)] border-4 border-slate-200 overflow-hidden"
               style={{ minHeight: '340px' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="flex flex-col items-center gap-4 p-6 sm:p-8"
              >
                {/* Image + speaker */}
                <div className="relative flex items-center justify-center">
                  <div className="text-7xl sm:text-9xl select-none">{question.image}</div>
                  <div className="absolute -top-2 -right-2">
                    <SpeakButton text={question.word} size={28} className="bg-slate-100 hover:bg-slate-200" />
                  </div>
                </div>

                {/* Letter slots */}
                <div className="flex justify-center gap-3 sm:gap-4">
                  {wordArray.map((letter, idx) => {
                    const isMissing = idx === question.missing;
                    return (
                      <div
                        key={idx}
                        className={`w-14 h-16 sm:w-20 sm:h-24 flex items-center justify-center rounded-2xl border-4 font-display text-3xl sm:text-5xl shadow-md transition-colors duration-200
                          ${!isMissing
                            ? 'bg-slate-100 border-slate-300 text-slate-800'
                            : isCorrect === true
                              ? 'bg-green-100 border-green-500 text-green-600 shadow-[0_0_15px_rgba(34,197,94,0.5)]'
                              : isCorrect === false
                                ? 'bg-red-100 border-red-500 text-red-600'
                                : selectedAnswer
                                  ? 'bg-blue-100 border-blue-400 text-blue-600'
                                  : 'bg-white/10 border-pink-400 border-dashed text-pink-300'
                          }`}
                      >
                        {isMissing
                          ? (selectedAnswer ?? <span className="text-2xl sm:text-3xl opacity-50">_</span>)
                          : letter}
                      </div>
                    );
                  })}
                </div>

                {/* Feedback text — fixed height so it doesn't shift card */}
                <div className="h-8 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {isCorrect !== null && (
                      <motion.p
                        key={String(isCorrect)}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className={`font-display text-xl ${isCorrect ? 'text-green-600' : 'text-red-500'}`}
                      >
                        {isCorrect ? '✨ Muito bem!' : '❌ Tente de novo!'}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Option tiles */}
          <div className="flex justify-center gap-4 sm:gap-6">
            {question.options.map((letter) => {
              const isSelected = selectedAnswer === letter;
              return (
                <motion.button
                  key={`${currentQuestion}-${letter}`}
                  whileHover={{ scale: isCorrect !== null ? 1 : 1.06, y: isCorrect !== null ? 0 : -4 }}
                  whileTap={{ scale: isCorrect !== null ? 1 : 0.94 }}
                  onClick={() => handleSelect(letter)}
                  disabled={isCorrect !== null}
                  className={`w-20 h-20 sm:w-28 sm:h-28 rounded-2xl border-4 font-display text-4xl sm:text-5xl flex items-center justify-center shadow-[0_6px_0_rgba(0,0,0,0.2)] transition-all cursor-pointer disabled:cursor-default select-none
                    ${isSelected && isCorrect === null
                      ? 'bg-blue-400 border-blue-200 text-white shadow-[0_2px_0_rgba(0,0,0,0.2)] translate-y-1'
                      : isSelected && isCorrect === true
                        ? 'bg-green-500 border-green-200 text-white'
                        : isSelected && isCorrect === false
                          ? 'bg-red-500 border-red-200 text-white'
                          : 'bg-gradient-to-b from-white to-slate-200 border-slate-100 text-slate-800'
                    }`}
                >
                  {letter}
                </motion.button>
              );
            })}
          </div>

        </div>
      </main>

      {/* Bottom Action Area */}
      <footer className="relative z-10 w-full p-4 sm:p-8 flex items-end justify-between max-w-6xl mx-auto shrink-0">
        <div className="hidden sm:flex items-end gap-4">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="bg-white rounded-full p-4 border-4 border-slate-200 shadow-lg"
          >
          </motion.div>
          <div className="bg-white text-slate-800 font-bold text-xl p-4 rounded-3xl rounded-bl-none shadow-lg border-2 border-slate-100 mb-6 max-w-xs">
            {isCorrect === true
              ? 'Muito bem! Você acertou! 🎉'
              : isCorrect === false
                ? 'Ops! Tente novamente! 💪'
                : 'Escolha a letra que falta!'}
          </div>
        </div>

        <div className="flex-1 flex justify-end">
          {isCorrect === null ? (
            <motion.button
              whileHover={selectedAnswer ? { scale: 1.05 } : {}}
              whileTap={selectedAnswer ? { scale: 0.95 } : {}}
              onClick={handleVerify}
              disabled={!selectedAnswer}
              className={`min-h-[64px] px-8 sm:px-12 rounded-full font-display text-2xl sm:text-3xl border-4 shadow-[0_6px_0_rgba(0,0,0,0.2)] transition-all uppercase
                ${selectedAnswer
                  ? 'bg-gradient-to-b from-pink-400 to-pink-600 border-pink-300 text-white cursor-pointer hover:shadow-[0_8px_0_rgba(0,0,0,0.2)] hover:-translate-y-1'
                  : 'bg-slate-300 border-slate-200 text-slate-500 opacity-50 cursor-not-allowed'
                }`}
            >
              Verificar
            </motion.button>
          ) : (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className="min-h-[64px] px-8 sm:px-12 rounded-full font-display text-2xl sm:text-3xl bg-gradient-to-b from-green-400 to-green-600 border-4 border-green-300 text-white shadow-[0_6px_0_rgba(21,128,61,1)] cursor-pointer hover:shadow-[0_8px_0_rgba(21,128,61,1)] hover:-translate-y-1 uppercase"
            >
              {currentQuestion < words.length - 1 ? 'Próximo' : 'Finalizar!'}
            </motion.button>
          )}
        </div>
      </footer>
    </div>
  );
}
