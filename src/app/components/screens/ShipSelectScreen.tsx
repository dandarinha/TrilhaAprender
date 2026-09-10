import { motion } from 'motion/react';
import { useGame } from '../GameContext';

export function ShipSelectScreen() {
  const { state, selectShip, goToScreen } = useGame();

  const handleShipSelect = (ship: 'red' | 'blue' | 'yellow') => {
    selectShip(ship);
    setTimeout(() => {
      goToScreen('travel');
      setTimeout(() => goToScreen('planet'), 2000);
    }, 500);
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
      <motion.h2
        className="font-display text-5xl md:text-6xl mb-4 text-center text-[#ffd93d]"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Escolha sua Nave, {state.playerName}!
      </motion.h2>

      <motion.p
        className="text-xl text-white/80 mb-12 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Cada nave te leva a diferentes planetas de aprendizado
      </motion.p>

      <div className="grid md:grid-cols-3 gap-6 w-full max-w-6xl">
        {/* Red Ship - Portuguese */}
        <motion.button
          onClick={() => handleShipSelect('red')}
          className="group relative bg-[#2d1b4e]/60 backdrop-blur-sm p-8 rounded-3xl border-2 border-[#ff3b5c]/40
                     hover:border-[#ff3b5c] transition-all hover:shadow-[0_0_40px_rgba(255,59,92,0.5)]"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="text-8xl mb-4">🚀</div>
          <h3 className="font-display text-3xl mb-2 text-[#ff3b5c]">Nave Vermelha</h3>
          <p className="text-white/70">Planeta das Palavras</p>
          <div className="mt-4 px-4 py-2 bg-[#ff3b5c]/20 rounded-full inline-block">
            <span className="text-[#ff3b5c] font-semibold">📚 Português</span>
          </div>
        </motion.button>

        {/* Blue Ship - Math */}
        <motion.button
          onClick={() => handleShipSelect('blue')}
          className="group relative bg-[#2d1b4e]/60 backdrop-blur-sm p-8 rounded-3xl border-2 border-[#4da6ff]/40
                     hover:border-[#4da6ff] transition-all hover:shadow-[0_0_40px_rgba(77,166,255,0.5)]"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="text-8xl mb-4">🚀</div>
          <h3 className="font-display text-3xl mb-2 text-[#4da6ff]">Nave Azul</h3>
          <p className="text-white/70">Planeta dos Números</p>
          <div className="mt-4 px-4 py-2 bg-[#4da6ff]/20 rounded-full inline-block">
            <span className="text-[#4da6ff] font-semibold">🔢 Matemática</span>
          </div>
        </motion.button>

        {/* Yellow Ship - English */}
        <motion.button
          onClick={() => handleShipSelect('yellow')}
          className="group relative bg-[#2d1b4e]/60 backdrop-blur-sm p-8 rounded-3xl border-2 border-[#ffd93d]/40
                     hover:border-[#ffd93d] transition-all hover:shadow-[0_0_40px_rgba(255,217,61,0.5)]"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="text-8xl mb-4">🚀</div>
          <h3 className="font-display text-3xl mb-2 text-[#ffd93d]">Nave Amarela</h3>
          <p className="text-white/70">Planeta do Inglês</p>
          <div className="mt-4 px-4 py-2 bg-[#ffd93d]/20 rounded-full inline-block">
            <span className="text-[#ffd93d] font-semibold">🌍 English</span>
          </div>
        </motion.button>
      </div>
    </div>
  );
}
