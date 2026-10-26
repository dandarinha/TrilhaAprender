import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import {
  Play,
  LogOut,
  ChevronLeft,
  PawPrint,
  Leaf,
  Footprints,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { useGame } from "./GameContext";
import { NameInputScreen } from "./NameInputScreen";

type Trail = {
  id: string;
  name: string;
  subject: string;
  path: string;
  color: string;
  icon: React.ReactNode;
};

const BIOMAS: {
  id: "portuguese" | "math";
  name: string;
  subject: string;
  emoji: string;
  color: string;
  trails: Trail[];
}[] = [
  {
    id: "portuguese",
    name: "Floresta das Sílabas",
    subject: "Português",
    emoji: "🌳",
    color: "from-[#0B4D2B] to-[#6A9876]",
    trails: [
      {
        id: "portuguese",
        name: "Trilha Vermelha",
        subject: "Forme a Palavra",
        path: "/portuguese",
        color: "from-[#B9270A] to-[#FF9A5C]",
        icon: <Footprints size={40} className="text-[#B9270A]" />,
      },
      {
        id: "syllable-match",
        name: "Trilha Azul",
        subject: "Sílaba Inicial",
        path: "/syllable-match",
        color: "from-[#2F6F8A] to-[#77AFC0]",
        icon: <Footprints size={40} className="text-[#2F6F8A]" />,
      },
      {
        id: "rhymes",
        name: "Trilha Amarela",
        subject: "Rimas",
        path: "/rhymes",
        color: "from-[#D98B05] to-[#F4C35D]",
        icon: <Footprints size={40} className="text-[#D98B05]" />,
      },
    ],
  },
  {
    id: "math",
    name: "Bosque da Matemática",
    subject: "Matemática",
    emoji: "🌲",
    color: "from-[#0B4D2B] to-[#A7C9B0]",
    trails: [
      {
        id: "addition",
        name: "Trilha Vermelha",
        subject: "Adição",
        path: "/math/addition",
        color: "from-[#B9270A] to-[#FF9A5C]",
        icon: <Footprints size={40} className="text-[#B9270A]" />,
      },
      {
        id: "subtraction",
        name: "Trilha Azul",
        subject: "Subtração",
        path: "/math/subtraction",
        color: "from-[#2F6F8A] to-[#77AFC0]",
        icon: <Footprints size={40} className="text-[#2F6F8A]" />,
      },
      {
        id: "counting",
        name: "Trilha Amarela",
        subject: "Contagem",
        path: "/math/counting",
        color: "from-[#D98B05] to-[#F4C35D]",
        icon: <Footprints size={40} className="text-[#D98B05]" />,
      },
    ],
  },
];

/* ─── START SCREEN ─── */

export function StartScreen({
  onStart,
}: {
  onStart: () => void;
}) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 1.2, opacity: 0 }}
      className="landing-screen relative z-10 flex w-full flex-col items-center justify-center gap-5 text-center sm:gap-8"
    >
      <Link
        to="/professor"
        className="absolute right-2 top-2 z-20 flex items-center gap-2 rounded-2xl border-2 border-[#6A9876]/40 bg-[#0B4D2B]/90 px-3 py-2.5 text-xs font-black text-white shadow-[0_4px_0_rgba(0,0,0,0.2)] transition-all hover:bg-[#155A35] active:translate-y-1 sm:right-4 sm:top-4 sm:px-4 sm:text-sm"
        style={{ fontFamily: "var(--font-display)" }}
      >
        👩‍🏫 ÁREA DO PROFESSOR
      </Link>

      <div className="space-y-3 sm:space-y-4">
        <div className="landing-badge mb-2 sm:mb-4">
          <Leaf className="text-[#6A9876]" size={18} />

          <span className="text-sm font-bold uppercase tracking-widest text-white sm:text-base">
            Aventura na Floresta
          </span>

          <Leaf className="text-[#F45A0A]" size={18} />
        </div>

        <h1
          className="landing-title text-4xl font-black sm:text-7xl"
          style={{
            fontFamily: "var(--font-display)",
            backgroundImage:
              "linear-gradient(to bottom right, #F45A0A, #6A9876, #6A9876)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
          }}
        >
          Trilha do Aprender
        </h1>

        <p
          className="mx-auto max-w-2xl text-base font-black text-[#FF9A5C] sm:text-2xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Jornada Tropical 🌿
        </p>

        <p className="mx-auto mt-1 max-w-xl text-base font-bold text-[#DCEBDD] sm:text-xl">
          Aprenda as letras junto com os bichos do Brasil!
        </p>

      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onStart}
        className="landing-action group relative min-w-52 overflow-hidden rounded-full px-7 py-3.5 text-lg sm:min-w-64 sm:px-10 sm:py-5 sm:text-2xl"
      >
        <div
          className="relative z-10 flex items-center gap-3 text-2xl font-black uppercase text-white sm:gap-4 sm:text-4xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          <Play
            size={28}
            fill="currentColor"
            className="sm:hidden"
          />

          <Play
            size={40}
            fill="currentColor"
            className="hidden sm:block"
          />

          <span>Explorar</span>
        </div>
      </motion.button>
    </motion.div>
  );
}

/* ─── HEADER BAR ─── */

function HeaderBar({
  name,
  paws,
  onLogout,
}: {
  name: string;
  paws: number;
  onLogout: () => void;
}) {
  return (
    <div className="home-header flex w-full flex-row items-center justify-between gap-2 border-b-4 border-[#7A200F] bg-[#0B4D2B]/80 px-4 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.4)] backdrop-blur-md sm:gap-6 sm:px-8 sm:py-4">
      <div className="flex min-w-0 items-center gap-2 sm:gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border-2 border-[#F45A0A] bg-gradient-to-b from-[#6A9876] to-[#0B4D2B] text-xl sm:h-14 sm:w-14 sm:text-2xl">
          🧭
        </div>

        <div className="min-w-0 text-left">
          <h2
            className="truncate text-sm font-black text-white drop-shadow-md sm:text-xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span className="hidden sm:inline">Explorador </span>
            {name}! 🌿
          </h2>

          <p className="truncate text-xs font-medium text-[#DCEBDD] sm:text-sm">
            Bem-vindo à floresta!
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex shrink-0 items-center gap-1 rounded-full border-4 border-white bg-gradient-to-b from-[#F45A0A] to-[#d98a10] px-3 py-2 font-black text-[#7A200F] shadow-[0_4px_0_rgba(0,0,0,0.25)] sm:gap-2 sm:px-4">
          <PawPrint
            size={18}
            className="fill-[#7A200F] sm:hidden"
          />

          <PawPrint
            size={22}
            className="hidden fill-[#7A200F] sm:block"
          />

          <span
            className="text-base sm:text-xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {paws}
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onLogout}
          className="flex shrink-0 items-center gap-1 rounded-xl border-2 border-[#F45A0A] bg-[#7A200F] px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-[#B9270A] sm:gap-2 sm:px-4"
        >
          <LogOut size={16} />

          <span className="hidden sm:inline">Trocar</span>
        </motion.button>
      </div>
    </div>
  );
}

/* ─── BIOMAS SCREEN ─── */

function BiomasScreen({
  onSelectBioma,
}: {
  onSelectBioma: (id: "portuguese" | "math") => void;
}) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="biome-select-screen relative z-10 flex w-full max-w-5xl flex-col items-center gap-4 px-4 py-4 sm:gap-6 sm:py-6"
    >
      <div className="w-full space-y-2 text-center sm:space-y-4">
        <h1
          className="text-3xl font-black text-transparent sm:text-6xl"
          style={{
            fontFamily: "var(--font-display)",
            backgroundImage:
              "linear-gradient(to bottom right, #F45A0A, #6A9876, #6A9876)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
          }}
        >
          Escolha um Bioma! 🗺️
        </h1>
      </div>

      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-8">
        {BIOMAS.map((bioma, index) => (
          <motion.button
            key={bioma.id}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              delay: index * 0.15,
              type: "spring",
            }}
            whileHover={{ scale: 1.05, y: -10 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectBioma(bioma.id)}
            className={`habitat-card relative flex flex-col items-center gap-3 bg-gradient-to-b ${bioma.color} p-5 sm:gap-6 sm:p-10`}
          >
            <div className="habitat-emblem">
              {bioma.emoji}
            </div>

            <div
              className="text-center"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <h3 className="text-xl font-black text-white sm:text-3xl">
                {bioma.name}
              </h3>

              <p className="mt-1 text-sm font-bold text-white/90 sm:text-xl">
                {bioma.subject}
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── TRAILS FOR BIOMA SCREEN ─── */

function TrailsForBiomaScreen({
  biomaId,
  onBack,
}: {
  biomaId: "portuguese" | "math";
  onBack: () => void;
}) {
  const bioma = BIOMAS.find((item) => item.id === biomaId);

  if (!bioma) return null;

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="trail-select-screen relative z-10 flex w-full max-w-6xl flex-col items-center gap-3 px-4 py-3 sm:gap-5 sm:py-5"
    >
      <div className="forest-panel-light flex w-full items-center justify-between gap-2 rounded-2xl p-2 sm:p-3">
        <button
          type="button"
          onClick={onBack}
          className="shrink-0 rounded-full border border-[#A7C9B0]/50 bg-[#0B4D2B]/70 p-3 text-white transition-all hover:bg-[#155A35] sm:p-4"
          aria-label="Voltar para os biomas"
        >
          <ChevronLeft size={24} />
        </button>

        <h1
          className="forest-title flex-1 text-center text-xl font-black sm:text-5xl"
          style={{
            fontFamily: "var(--font-display)",
            backgroundImage:
              "linear-gradient(to bottom right, #F45A0A, #6A9876, #6A9876)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
          }}
        >
          {bioma.emoji} {bioma.name}
        </h1>

        <div className="w-10 shrink-0 sm:w-16" />
      </div>

      <p
        className="text-sm font-black text-white/80 sm:text-lg"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Escolha sua Trilha!
      </p>

      <div className="grid w-full grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-4">
        {bioma.trails.map((trail, index) => (
          <motion.div
            key={trail.id}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              delay: index * 0.1,
              type: "spring",
            }}
            whileHover={{ scale: 1.05, y: -10 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-full w-full"
          >
            <Link
              to={trail.path}
              className={`path-card group relative flex w-full flex-row items-center justify-center gap-3 overflow-hidden bg-gradient-to-b ${trail.color} p-3 sm:flex-col sm:gap-3 sm:p-4`}
            >
              <div className="pointer-events-none absolute inset-0 text-white/20">
                <Footprints className="absolute -right-3 -top-3 h-16 w-16 -rotate-12 transition-transform duration-300 group-hover:rotate-0 group-hover:scale-110 sm:h-20 sm:w-20" />

                <Footprints className="absolute -bottom-3 -left-3 h-16 w-16 rotate-45 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 sm:h-20 sm:w-20" />
              </div>

              <div className="relative z-10 flex flex-row items-center gap-3 sm:flex-col sm:gap-3">
                <div className="path-emblem transition-transform duration-300 group-hover:-translate-y-1">
                  {trail.icon}
                </div>

                <div
                  className="text-left sm:text-center"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <h3 className="mb-1 text-base font-black text-white sm:text-xl">
                    {trail.name}
                  </h3>

                  <div className="inline-flex items-center justify-center gap-1 rounded-full border-2 border-white/40 bg-black/25 px-3 py-1 text-white sm:gap-2 sm:px-4 sm:py-2">
                    <span className="text-[11px] font-bold sm:text-base">
                      {trail.subject}
                    </span>
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
  const {
    state,
    saveCurrentSession,
    resetGame,
    isOnline,
  } = useGame();
  const location = useLocation();

  /*
   * Etapas da navegação:
   *
   * 0 = Tela inicial
   * 1 = Mural de alunos / identificação
   * 2 = Escolha de bioma
   * 3 = Escolha de trilha
   */
  const [step, setStep] = useState(0);

  const [explorerName, setExplorerName] = useState("Explorador");

  const [biomaId, setBiomaId] = useState<
    "portuguese" | "math" | null
  >(null);

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const requestedBioma = new URLSearchParams(location.search).get("trails");
    const shouldReturnToTrails =
      (requestedBioma === "math" || requestedBioma === "portuguese") &&
      Boolean(state.studentId);

    try {
      if (!shouldReturnToTrails) {
        // A retomada exige uma nova seleção para evitar iniciar uma sessão
        // duplicada com dados possivelmente desatualizados do navegador.
        localStorage.removeItem("bichoBioma");
      }
    } catch {
      setExplorerName("Explorador");
    }

    if (shouldReturnToTrails) {
      setExplorerName(state.playerName || "Explorador");
      setBiomaId(requestedBioma === "math" ? "math" : "portuguese");
      setStep(3);
    }
    setIsLoaded(true);
  }, [location.search, state.playerName, state.studentId]);

  const handleLogout = () => {
    if (state.studentId) {
      void saveCurrentSession().catch((error: unknown) => {
        console.error("Não foi possível finalizar a sessão ao sair:", error);
      });
    }

    try {
      localStorage.removeItem("bichoName");
      localStorage.removeItem("bichoBioma");
    } catch {
      // Evita que um erro do localStorage interrompa a troca de aluno.
    }

    resetGame();
    setExplorerName("Explorador");
    setBiomaId(null);
    setStep(0);
  };

  const handleStudentSelected = (name: string) => {
    setExplorerName(name);
    try {
      localStorage.setItem("bichoName", name);
    } catch {
      // O jogo continua funcionando se o armazenamento estiver indisponível.
    }
    setBiomaId(null);
    setStep(2);
  };

  const handleSelectBioma = (
    id: "portuguese" | "math",
  ) => {
    setBiomaId(id);

    try {
      localStorage.setItem("bichoBioma", id);
    } catch {
      // O jogo continua funcionando mesmo se o localStorage estiver indisponível.
    }

    setStep(3);
  };

  const handleBackToBiomas = () => {
    setBiomaId(null);

    try {
      localStorage.removeItem("bichoBioma");
    } catch {
      // Não interrompe a navegação caso o localStorage falhe.
    }

    setStep(2);
  };

  if (!isLoaded) return null;

  const isLoggedInScreen = step === 2 || step === 3;

  return (
    <div className="app-shell forest-scene relative flex min-h-screen flex-col overflow-x-hidden overflow-y-auto">
      {/* Vagalumes */}
      <div className="pointer-events-none fixed inset-0 z-0">
        {[...Array(40)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute rounded-full bg-yellow-200"
            style={{
              width: `${Math.random() * 5 + 2}px`,
              height: `${Math.random() * 5 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              boxShadow: "0 0 10px rgba(246,224,94,0.9)",
            }}
            animate={{
              opacity: [0.1, 1, 0.1],
              y: [0, -14, 0],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Dossel superior */}
      <div className="pointer-events-none fixed left-0 right-0 top-0 z-0 h-16 bg-gradient-to-b from-[#0B4D2B] to-transparent opacity-80 sm:h-24" />

      {/* Header fixo quando o aluno já foi selecionado */}
      {isLoggedInScreen && (
        <div className="sticky top-0 z-20 w-full">
          <HeaderBar
            name={explorerName}
            paws={state.paws}
            onLogout={handleLogout}
          />
        </div>
      )}

      <div
        className={`relative z-10 flex flex-1 flex-col items-center p-4 sm:p-8 ${
          isLoggedInScreen
            ? "justify-start"
            : "min-h-screen justify-center"
        }`}
      >
        {!isOnline && isLoggedInScreen && (
          <div
            className="mb-3 rounded-full border border-[#F45A0A]/50 bg-[#0B4D2B]/85 px-4 py-2 text-center text-xs font-black text-[#ffe0a3] shadow-lg"
            role="status"
          >
            Você está em modo aventura. O progresso será sincronizado quando a conexão voltar.
          </div>
        )}
        <AnimatePresence mode="wait">
          {/* Tela inicial */}
          {step === 0 && (
            <StartScreen
              key="start"
              onStart={() => setStep(1)}
            />
          )}

          {/* Mural de alunos */}
          {step === 1 && (
            <NameInputScreen
              key="name-input"
              onStudentSelected={handleStudentSelected}
              onBack={() => setStep(0)}
            />
          )}

          {/* Seleção de bioma */}
          {step === 2 && (
            <BiomasScreen
              key="biomas"
              onSelectBioma={handleSelectBioma}
            />
          )}

          {/* Seleção de trilha */}
          {step === 3 && biomaId && (
            <TrailsForBiomaScreen
              key="trails"
              biomaId={biomaId}
              onBack={handleBackToBiomas}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
