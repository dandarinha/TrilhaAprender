import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../Button';
import { useGame } from '../GameContext';

interface Question {
  num1: number;
  num2: number;
  correctAnswer: number;
  options: number[];
}

const generateQuestion = (): Question => {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const correctAnswer = num1 + num2;

  const options = [correctAnswer];
  while (options.length < 3) {
    const wrongAnswer = correctAnswer + Math.floor(Math.random() * 10) - 5;
    if (wrongAnswer > 0 && !options.includes(wrongAnswer)) {
      options.push(wrongAnswer);
    }
  }

  return {
    num1,
    num2,
    correctAnswer,
    options: options.sort(() => Math.random() - 0.5),
  };
};

export function MathGame() {
  const { addStars, goToScreen } = useGame();
  const [questions] = useState(() => Array.from({ length: 5 }, generateQuestion));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);

  const question = questions[currentQuestion];

  const handleAnswer = (answer: number) => {
    setSelectedAnswer(answer);
    const correct = answer === question.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setScore(prev => prev + 1);
      addStars(1);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        goToScreen('reward');
      }
    }, 1500);
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
      {/* Progress */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-2">
        {questions.map((_, idx) => (
          <div
            key={idx}
            className={`w-3 h-3 rounded-full transition-all ${
              idx === currentQuestion
                ? 'bg-[#00f6ff] w-8'
                : idx < currentQuestion
                ? 'bg-[#39ff14]'
                : 'bg-white/30'
            }`}
          />
        ))}
      </div>

      <motion.div
        className="bg-[#2d1b4e]/90 backdrop-blur-sm p-4 sm:p-8 md:p-12 rounded-3xl border-2 border-[#4da6ff]/40 max-w-2xl w-full"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <h3 className="font-display text-2xl sm:text-3xl text-center mb-6 sm:mb-8 text-[#00f6ff]">
          Quanto é?
        </h3>

        {/* Question */}
        <div className="flex items-center justify-center gap-2 sm:gap-6 mb-8 sm:mb-12">
          <motion.div
            className="w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center bg-[#4da6ff]/20 rounded-2xl sm:rounded-3xl border-4 border-[#4da6ff]/40"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
          >
            <span className="font-display text-3xl sm:text-5xl text-white">{question.num1}</span>
          </motion.div>

          <span className="font-display text-4xl sm:text-6xl text-[#ffd93d]">+</span>

          <motion.div
            className="w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center bg-[#4da6ff]/20 rounded-2xl sm:rounded-3xl border-4 border-[#4da6ff]/40"
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
          >
            <span className="font-display text-3xl sm:text-5xl text-white">{question.num2}</span>
          </motion.div>

          <span className="font-display text-4xl sm:text-6xl text-white">=</span>

          <motion.div
            className={`w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center rounded-2xl sm:rounded-3xl border-4 font-display text-3xl sm:text-5xl
              ${
                isCorrect === true
                  ? 'bg-[#39ff14]/30 border-[#39ff14] text-[#39ff14]'
                  : isCorrect === false
                  ? 'bg-red-500/30 border-red-500 text-red-500'
                  : 'bg-[#1a0b2e]/60 border-[#00f6ff] border-dashed text-[#00f6ff]'
              }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <AnimatePresence mode="wait">
              {selectedAnswer !== null ? (
                <motion.span
                  key={selectedAnswer}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  {selectedAnswer}
                </motion.span>
              ) : (
                <span className="text-3xl sm:text-4xl">?</span>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Visual Representation */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8">
          {Array.from({ length: question.num1 }).map((_, i) => (
            <span key={`a-${i}`} className="text-xl sm:text-3xl">⭐</span>
          ))}
          <span className="text-xl sm:text-2xl self-center">+</span>
          {Array.from({ length: question.num2 }).map((_, i) => (
            <span key={`b-${i}`} className="text-xl sm:text-3xl">⭐</span>
          ))}
        </div>

        {/* Options */}
        <div className="flex justify-center gap-3 sm:gap-4">
          {question.options.map((option) => (
            <Button
              key={option}
              onClick={() => handleAnswer(option)}
              variant="accent"
              size="lg"
              disabled={selectedAnswer !== null}
            >
              {option}
            </Button>
          ))}
        </div>

        {/* Feedback */}
        <AnimatePresence>
          {isCorrect !== null && (
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <p className={`font-display text-2xl ${isCorrect ? 'text-[#39ff14]' : 'text-red-400'}`}>
                {isCorrect ? '✨ Perfeito!' : '❌ Tente de novo!'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
