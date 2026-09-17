import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Play, LogOut, ChevronLeft, PawPrint, Compass, Leaf, Footprints, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useGame } from './GameContext';
import { HistoryModal } from "./HistoryModal";
type Trail = { id: string; name: string; subject: string; path: string; color: string; icon: React.ReactNode };

const BIOMAS: { id: 'portuguese' | 'math'; name: string; subject: string; emoji: string; color: string; trails: Trail[] }[] = [
  {
    id: 'portuguese',
    name: 'Floresta das Sílabas',
    subject: 'Português',
    emoji: '🌳',
    color: 'from-[#2e7d32] to-[#57b85b]',
    trails: [
      { id: 'portuguese',     name: 'Trilha Vermelha', subject: 'Forme a Palavra', path: '/portuguese',     color: 'from-[#e0402b] to-[#f4795f]', icon: <Footprints size={40} className="text-[#e0402b]" /> },
      { id: 'syllable-match', name: 'Trilha Azul',     subject: 'Sílaba Inicial',  path: '/syllable-match', color: 'from-[#2a7de1] to-[#5aa0ee]', icon: <Footprints size={40} className="text-[#2a7de1]" /> },
      { id: 'rhymes',         name: 'Trilha Amarela',  subject: 'Rimas',           path: '/rhymes',         color: 'from-[#f6a623] to-[#ffd166]', icon: <Footprints size={40} className="text-[#f6a623]" /> },
    ],
  },
  {
    id: 'math',
    name: 'Bosque da Matemática',
    subject: 'Matemática',
    emoji: '🌲',
    color: 'from-[#0b6e8f] to-[#2ab7d6]',
    trails: [
      { id: 'addition',    name: 'Trilha Vermelha', subject: 'Adição',    path: '/math/addition',    color: 'from-[#e0402b] to-[#f4795f]', icon: <Footprints size={40} className="text-[#e0402b]" /> },
      { id: 'subtraction', name: 'Trilha Azul',     subject: 'Subtração', path: '/math/subtraction', color: 'from-[#2a7de1] to-[#5aa0ee]', icon: <Footprints size={40} className="text-[#2a7de1]" /> },
      { id: 'counting',    name: 'Trilha Amarela',  subject: 'Contagem',  path: '/math/counting',    color: 'from-[#f6a623] to-[#ffd166]', icon: <Footprints size={40} className="text-[#f6a623]" /> },
    ],
  },
];

/* ─── START SCREEN ─── */
// import { HistoryModal } from '../HistoryModal'; // Certifique-se de ajustar o caminho da pasta se necessário

export function StartScreen({
  onStart,
  onHistory,
}: {
  onStart: () => void;
  onHistory: () => void;
}) {

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 1.2, opacity: 0 }}
      className="flex flex-col items-center justify-center gap-8 sm:gap-14 text-center relative z-10 w-full"
    >
      {/* Botão de Histórico / Recordes integrado ao tema de Floresta */}
      <button
        onClick={onHistory}
        className="absolute -top-12 sm:top-4 right-4 flex items-center gap-2 bg-[#052e1c]/80 hover:bg-[#0d3d28] text-white font-black text-sm px-4 py-2.5 rounded-2xl border-2 border-[#35b35b]/40 shadow-[0_4px_0_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none transition-all cursor-pointer z-20"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        <Trophy className="w-4 h-4 text-amber-400" fill="currentColor" />
        RECORDES
      </button>

      <div className="space-y-3 sm:space-y-4">
        <div className="inline-flex items-center gap-2 sm:gap-3 bg-[#052e1c]/60 px-4 py-2 sm:px-6 rounded-full backdrop-blur-sm border-2 border-[#35b35b]/50 shadow-[0_0_20px_rgba(53,179,91,0.3)] mb-2 sm:mb-4">
          <Leaf className="text-[#57b85b]" size={18} />
          <span className="text-white font-bold tracking-widest uppercase text-sm sm:text-base">Aventura na Floresta</span>
          <Leaf className="text-[#f6a623]" size={18} />
        </div>
        
        <h1
          className="text-5xl sm:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#f6a623] via-[#57b85b] to-[#2a7de1] filter drop-shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Trilha do Aprender
        </h1>
        
        <p className="text-lg sm:text-3xl text-yellow-200 font-black max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-display)' }}>
          Jornada Tropical 🌿
        </p>
        
        <p className="text-base sm:text-xl text-[#cde7d5] font-bold max-w-xl mx-auto mt-1">
          Aprenda as letras junto com os bichos do Brasil!
        </p>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onStart}
        className="group relative flex items-center justify-center px-8 py-4 sm:px-12 sm:py-6 rounded-full bg-gradient-to-b from-[#57b85b] to-[#2e7d32] shadow-[0_8px_0_rgba(0,0,0,0.35)] overflow-hidden cursor-pointer border-4 border-white/50 active:translate-y-[3px] active:shadow-[0_3px_0_rgba(0,0,0,0.35)]"
      >
        <div className="relative z-10 flex items-center gap-3 sm:gap-4 text-white font-black text-2xl sm:text-4xl uppercase" style={{ fontFamily: 'var(--font-display)' }}>
          <Play size={28} fill="currentColor" className="sm:hidden" />
          <Play size={40} fill="currentColor" className="hidden sm:block" />
          <span>Explorar</span>
        </div>
      </motion.button>


    </motion.div>
  );
}

/* ─── EXPLORER NAME SCREEN ─── */
function ExplorerNameScreen({ onConfirm, onBack }: { onConfirm: (name: string) => void; onBack: () => void }) {
  const [name, setName] = useState('');
  const trimmed = name.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trimmed.length >= 2) onConfirm(trimmed);
  };

  return (
    <motion.form
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center gap-6 sm:gap-8 relative z-10 w-full max-w-xl px-2"
    >
      <button
        type="button"
        onClick={onBack}
        className="self-start bg-[#052e1c]/60 p-3 rounded-full backdrop-blur-sm border-2 border-[#35b35b]/40 text-white hover:bg-[#052e1c]/80 transition-all"
      >
        <ChevronLeft size={24} />
      </button>

      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, type: 'spring', bounce: 0.5 }}
        className="flex flex-col items-center gap-3"
      >
        <motion.div
          animate={{ y: [0, -12, 0], rotate: [-4, 4, -4] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="text-7xl sm:text-9xl select-none"
        >
          🧭
        </motion.div>
        <div className="flex items-center gap-2 bg-[#052e1c]/60 px-4 py-1.5 rounded-full border-2 border-[#35b35b]/40">
          <Compass className="text-[#57b85b]" size={14} />
          <span className="text-[#cde7d5] font-bold text-sm uppercase tracking-widest">Expedição na Selva</span>
          <Leaf className="text-[#f6a623]" size={14} />
        </div>
      </motion.div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="w-full flex flex-col items-center gap-5"
      >
        <h2
          className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#f6a623] via-[#57b85b] to-[#2a7de1] text-center"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Qual é o nome do<br />Explorador?
        </h2>

        <div className="relative w-full">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#57b85b] pointer-events-none">
            <Compass size={22} />
          </div>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Digite seu nome, Explorador!"
            autoFocus
            maxLength={20}
            className="w-full bg-[#052e1c]/60 backdrop-blur-md text-white font-black text-xl sm:text-2xl pl-14 pr-5 py-5 rounded-[2rem] border-4 border-[#35b35b]/40 shadow-2xl focus:outline-none focus:border-[#f6a623] placeholder:text-white/30 text-center uppercase tracking-widest transition-colors"
            style={{ fontFamily: 'var(--font-display)' }}
          />
        </div>

        <motion.button
          whileHover={{ scale: trimmed.length >= 2 ? 1.05 : 1 }}
          whileTap={{ scale: trimmed.length >= 2 ? 0.95 : 1 }}
          type="submit"
          disabled={trimmed.length < 2}
          className="w-full py-4 sm:py-5 rounded-full bg-gradient-to-b from-[#f6a623] to-[#d98a10] text-[#052e1c] font-black text-xl sm:text-2xl uppercase border-4 border-white/50 shadow-[0_6px_0_rgba(0,0,0,0.3)] flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:translate-y-[2px]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <Footprints size={24} /> Entrar na Mata!
        </motion.button>
      </motion.div>
    </motion.form>
  );
}

/* ─── HEADER BAR ─── */
function HeaderBar({ name, onLogout }: { name: string; onLogout: () => void }) {
  const [totalPaws, setTotalPaws] = useState(0);

  useEffect(() => {
    const read = () => {
      try { setTotalPaws(parseInt(localStorage.getItem('bichoStars') || '0', 10)); } catch {}
    };
    read();
    window.addEventListener('bichoStarsChanged', read);
    window.addEventListener('storage', read);
    return () => {
      window.removeEventListener('bichoStarsChanged', read);
      window.removeEventListener('storage', read);
    };
  }, []);

  return (
    <div className="w-full bg-[#052e1c]/80 backdrop-blur-md border-b-4 border-[#6b3f22] shadow-[0_4px_20px_rgba(0,0,0,0.4)] px-4 py-3 sm:px-8 sm:py-4 flex flex-row justify-between items-center gap-2 sm:gap-6">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <div className="w-10 h-10 sm:w-14 sm:h-14 shrink-0 rounded-2xl border-2 border-[#a9713f] bg-gradient-to-b from-[#57b85b] to-[#2e7d32] flex items-center justify-center text-xl sm:text-2xl">
          🧭
        </div>
        <div className="text-left min-w-0">
          <h2 className="text-sm sm:text-xl font-black text-white drop-shadow-md truncate" style={{ fontFamily: 'var(--font-display)' }}>
            <span className="hidden sm:inline">Explorador </span>{name}! 🌿
          </h2>
          <p className="text-[#cde7d5] font-medium text-xs sm:text-sm truncate">
            Bem-vindo à floresta!
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-1 sm:gap-2 bg-gradient-to-b from-[#f6a623] to-[#d98a10] text-[#5a3410] font-black px-3 py-2 sm:px-4 sm:py-2 rounded-full border-4 border-white shadow-[0_4px_0_rgba(0,0,0,0.25)] shrink-0">
          <PawPrint size={18} className="fill-[#5a3410] sm:hidden" />
          <PawPrint size={22} className="fill-[#5a3410] hidden sm:block" />
          <span className="text-base sm:text-xl" style={{ fontFamily: 'var(--font-display)' }}>{totalPaws}</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onLogout}
          className="bg-[#6b3f22] hover:bg-[#7c4a28] text-white px-3 py-2 sm:px-4 sm:py-2 rounded-xl border-2 border-[#a9713f] font-bold flex items-center gap-1 sm:gap-2 transition-colors shrink-0 text-sm"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Trocar</span>
        </motion.button>
      </div>
    </div>
  );
}

/* ─── BIOMAS SCREEN ─── */
function BiomasScreen({ onSelectBioma }: { onSelectBioma: (id: 'portuguese' | 'math') => void }) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex flex-col items-center gap-5 sm:gap-10 relative z-10 w-full max-w-5xl py-6 sm:py-10 px-4"
    >
      <div className="text-center space-y-2 sm:space-y-4 w-full">
        <h1
          className="text-3xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#f6a623] via-[#57b85b] to-[#2a7de1] filter drop-shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Escolha um Bioma! 🗺️
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 w-full">
        {BIOMAS.map((b, i) => (
          <motion.button
            key={b.id}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.15, type: 'spring' }}
            whileHover={{ scale: 1.05, y: -10 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectBioma(b.id)}
            className={`relative flex flex-col items-center gap-3 sm:gap-6 p-5 sm:p-10 rounded-3xl bg-gradient-to-b ${b.color} border-4 border-white shadow-[0_6px_0_rgba(0,0,0,0.3)] hover:shadow-[0_10px_0_rgba(0,0,0,0.3)] active:translate-y-[2px] transition-all`}
          >
            <div className="text-6xl sm:text-9xl bg-white/90 rounded-full p-3 sm:p-4 border-4 border-white shadow-[0_4px_0_rgba(0,0,0,0.2)]">
              {b.emoji}
            </div>
            <div className="text-center" style={{ fontFamily: 'var(--font-display)' }}>
              <h3 className="text-xl sm:text-3xl font-black text-white">{b.name}</h3>
              <p className="text-white/90 font-bold text-sm sm:text-xl mt-1">{b.subject}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── TRAILS FOR BIOMA SCREEN ─── */
function TrailsForBiomaScreen({ biomaId, onBack }: { biomaId: 'portuguese' | 'math'; onBack: () => void }) {
  const bioma = BIOMAS.find(b => b.id === biomaId)!;
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex flex-col items-center gap-5 sm:gap-8 relative z-10 w-full max-w-6xl py-6 sm:py-10 px-4"
    >
      <div className="w-full flex justify-between items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          className="bg-[#052e1c]/60 p-3 sm:p-4 rounded-full backdrop-blur-sm border-2 border-[#35b35b]/40 text-white hover:bg-[#052e1c]/80 transition-all shrink-0"
        >
          <ChevronLeft size={24} />
        </button>
        <h1
          className="text-xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#f6a623] via-[#57b85b] to-[#2a7de1] text-center flex-1"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {bioma.emoji} {bioma.name}
        </h1>
        <div className="w-10 sm:w-16 shrink-0" />
      </div>

      <p className="text-base sm:text-xl font-black text-white/80" style={{ fontFamily: 'var(--font-display)' }}>
        Escolha sua Trilha!
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 w-full">
        {bioma.trails.map((trail, i) => (
          <motion.div
            key={trail.id}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.1, type: 'spring' }}
            whileHover={{ scale: 1.05, y: -10 }}
            whileTap={{ scale: 0.95 }}
            className="flex w-full h-full"
          >
            <Link
              to={trail.path}
              className={`group w-full relative flex flex-row sm:flex-col items-center justify-center p-4 sm:p-8 rounded-3xl bg-gradient-to-b ${trail.color} shadow-[0_6px_0_rgba(0,0,0,0.3)] overflow-hidden border-4 border-white transition-all hover:translate-y-[-4px] hover:shadow-[0_10px_0_rgba(0,0,0,0.3)] active:translate-y-[2px] gap-4 sm:gap-6`}
            >
              {/* Marca d'água de pegadas sutis ao fundo do card */}
              <div className="absolute inset-0 pointer-events-none text-white/20">
                <Footprints className="absolute -top-3 -right-3 w-16 h-16 sm:w-20 sm:h-20 -rotate-12 group-hover:scale-110 group-hover:rotate-0 transition-transform duration-300" />
                <Footprints className="absolute -bottom-3 -left-3 w-16 h-16 sm:w-20 sm:h-20 rotate-45 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
              </div>

              <div className="relative z-10 flex flex-row sm:flex-col items-center gap-4 sm:gap-6">
                {/* Quadro branco centralizado com o ícone de pegada colorido */}
                <div className="bg-white p-4 sm:p-6 rounded-3xl border-4 border-white shadow-[0_4px_0_rgba(0,0,0,0.15)] group-hover:-translate-y-1 transition-transform duration-300 flex items-center justify-center">
                  {trail.icon}
                </div>
                <div className="text-left sm:text-center" style={{ fontFamily: 'var(--font-display)' }}>
                  <h3 className="text-lg sm:text-2xl font-black text-white mb-1">{trail.name}</h3>
                  <div className="inline-flex items-center justify-center gap-1 sm:gap-2 text-white bg-black/25 px-3 py-1 sm:px-4 sm:py-2 rounded-full border-2 border-white/40">
                    <span className="font-bold text-xs sm:text-lg">{trail.subject}</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── HOME ─── */
export default function Home() {
  const { state, setPlayerName, saveCurrentSession, resetGame } = useGame();
  const [step, setStep] = useState(0);
  const [explorerName, setExplorerName] = useState('');
  const [biomaId, setBiomaId] = useState<'portuguese' | 'math' | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem('bichoName');
    const savedBioma = localStorage.getItem('bichoBioma') as 'portuguese' | 'math' | null;
    if (savedName) {
      setExplorerName(savedName);
      setPlayerName(savedName);
      if (savedBioma === 'portuguese' || savedBioma === 'math') {
        setBiomaId(savedBioma);
        setStep(3);
      } else {
        setStep(2);
      }
    }
    setIsLoaded(true);
  }, []);

  const handleOpenHistory = () => {
    setIsHistoryOpen(true);
  };

  const handleCloseHistory = () => {
    setIsHistoryOpen(false);
  };

  const handleNameConfirm = (name: string) => {
    setExplorerName(name);
    setPlayerName(name);
    localStorage.setItem('bichoName', name);
    setStep(2);
  };

  const handleLogout = () => {
    // Salva o progresso antes de trocar de perfil.
    if (
      state.playerName.trim() &&
      (state.stars > 0 || state.completedActivities.length > 0)
    ) {
      saveCurrentSession();
    }

    localStorage.removeItem('bichoName');
    localStorage.removeItem('bichoBioma');
    localStorage.removeItem('bichoStars');
    window.dispatchEvent(new Event('bichoStarsChanged'));

    resetGame();
    setExplorerName('');
    setBiomaId(null);
    setStep(0);
  };

  const handleSelectBioma = (id: 'portuguese' | 'math') => {
    setBiomaId(id);
    localStorage.setItem('bichoBioma', id);
    setStep(3);
  };

  const handleBackToBiomas = () => {
    setBiomaId(null);
    localStorage.removeItem('bichoBioma');
    setStep(2);
  };

  if (!isLoaded) return null;

  const isLoggedInScreen = step >= 2;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d3d28] via-[#0b4a2e] to-[#052e1c] flex flex-col overflow-x-hidden overflow-y-auto relative">
      {/* Vagalumes */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {[...Array(40)].map((_, i) => (
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
            animate={{ opacity: [0.1, 1, 0.1], y: [0, -14, 0] }}
            transition={{ duration: Math.random() * 4 + 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* Dossel superior */}
      <div className="fixed top-0 left-0 right-0 h-16 sm:h-24 z-0 pointer-events-none bg-gradient-to-b from-[#052e1c] to-transparent opacity-80" />

      {/* Header fixo quando logado */}
      {isLoggedInScreen && (
        <div className="sticky top-0 z-20 w-full">
          <HeaderBar name={explorerName} onLogout={handleLogout} />
        </div>
      )}

      <div className={`relative z-10 flex-1 flex flex-col items-center ${isLoggedInScreen ? 'justify-start' : 'justify-center min-h-screen'} p-4 sm:p-8`}>
        <AnimatePresence mode="wait">
          {step === 0 && (
              <StartScreen
                key="start"
                onStart={() => setStep(1)}
                onHistory={handleOpenHistory}
              />
            )}
          {step === 1 && <ExplorerNameScreen key="name" onConfirm={handleNameConfirm} onBack={() => setStep(0)} />}
          {step === 2 && <BiomasScreen key="biomas" onSelectBioma={handleSelectBioma} />}
          {step === 3 && biomaId && <TrailsForBiomaScreen key="trails" biomaId={biomaId} onBack={handleBackToBiomas} />}
        </AnimatePresence>
      </div>

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={handleCloseHistory}
      />
    </div>
  );
}