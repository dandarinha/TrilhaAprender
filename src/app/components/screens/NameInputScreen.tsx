import { useState } from 'react';
import { motion } from 'motion/react';
import { User } from 'lucide-react';
import { Button } from '../Button';
import { useGame } from '../GameContext';

export function NameInputScreen() {
  const { setPlayerName, goToScreen } = useGame();
  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (name.trim()) {
      setPlayerName(name.trim());
      goToScreen('ship-select');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring' }}
        className="bg-[#2d1b4e]/80 backdrop-blur-sm p-12 rounded-3xl border-2 border-[#ff6ec7]/30 shadow-[0_0_40px_rgba(255,110,199,0.3)] max-w-md w-full"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-[#ff6ec7] p-4 rounded-full">
            <User className="w-12 h-12 text-white" />
          </div>
        </div>

        <h2 className="font-display text-4xl text-center mb-3 text-[#00f6ff]">
          Olá, Astronauta!
        </h2>

        <p className="text-center text-white/80 mb-8">
          Qual é o seu nome?
        </p>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Digite seu nome"
          maxLength={20}
          className="w-full px-6 py-4 rounded-full bg-[#1a0b2e]/60 border-2 border-[#00f6ff]/40
                     text-white text-center font-display text-xl
                     placeholder:text-white/40 focus:border-[#00f6ff] focus:outline-none
                     transition-all"
          autoFocus
        />

        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleSubmit}
            disabled={!name.trim()}
            variant="secondary"
            size="lg"
          >
            Continuar
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
