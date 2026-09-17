import React, { useState, useEffect } from "react";
import { Link } from "react-router";
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
    color: "from-[#2e7d32] to-[#57b85b]",
    trails: [
      {
        id: "portuguese",
        name: "Trilha Vermelha",
        subject: "Forme a Palavra",
        path: "/portuguese",
        color: "from-[#e0402b] to-[#f4795f]",
        icon: <Footprints size={40} className="text-[#e0402b]" />,
      },
      {
        id: "syllable-match",
        name: "Trilha Azul",
        subject: "Sílaba Inicial",
        path: "/syllable-match",
        color: "from-[#2a7de1] to-[#5aa0ee]",
        icon: <Footprints size={40} className="text-[#2a7de1]" />,
      },
      {
        id: "rhymes",
        name: "Trilha Amarela",
        subject: "Rimas",
        path: "/rhymes",
        color: "from-[#f6a623] to-[#ffd166]",
        icon: <Footprints size={40} className="text-[#f6a623]" />,
      },
    ],
  },
  {
    id: "math",
    name: "Bosque da Matemática",
    subject: "Matemática",
    emoji: "🌲",
    color: "from-[#0b6e8f] to-[#2ab7d6]",
    trails: [
      {
        id: "addition",
        name: "Trilha Vermelha",
        subject: "Adição",
        path: "/math/addition",
        color: "from-[#e0402b] to-[#f4795f]",
        icon: <Footprints size={40} className="text-[#e0402b]" />,
      },
      {
        id: "subtraction",
        name: "Trilha Azul",
        subject: "Subtração",
        path: "/math/subtraction",
        color: "from-[#2a7de1] to-[#5aa0ee]",
        icon: <Footprints size={40} className="text-[#2a7de1]" />,
      },
      {
        id: "counting",
        name: "Trilha Amarela",
        subject: "Contagem",
        path: "/math/counting",
        color: "from-[#f6a623] to-[#ffd166]",
        icon: <Footprints size={40} className="text-[#f6a623]" />,
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
      className="relative z-10 flex w-full flex-col items-center justify-center gap-8 text-center sm:gap-14"
    >
      <Link
        to="/professor"
        className="absolute -top-12 right-2 z-20 flex items-center gap-2 rounded-2xl border-2 border-[#35b35b]/40 bg-[#052e1c]/90 px-3 py-2.5 text-xs font-black text-white shadow-[0_4px_0_rgba(0,0,0,0.2)] transition-all hover:bg-[#0d3d28] active:translate-y-1 sm:top-4 sm:right-4 sm:px-4 sm:text-sm"
        style={{ fontFamily: "var(--font-display)" }}
      >
        👩‍🏫 ÁREA DO PROFESSOR
      </Link>

      <div className="space-y-3 sm:space-y-4">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border-2 border-[#35b35b]/50 bg-[#052e1c]/60 px-4 py-2 shadow-[0_0_20px_rgba(53,179,91,0.3)] backdrop-blur-sm sm:mb-4 sm:gap-3 sm:px-6">
          <Leaf className="text-[#57b85b]" size={18} />

          <span className="text-sm font-bold uppercase tracking-widest text-white sm:text-base">
            Aventura na Floresta
          </span>

          <Leaf className="text-[#f6a623]" size={18} />
        </div>

        <h1
          className="text-5xl font-black text-transparent drop-shadow-[0_4px_20px_rgba(0,0,0,0.4)] sm:text-8xl"
          style={{
            fontFamily: "var(--font-display)",
            backgroundImage:
              "linear-gradient(to bottom right, #f6a623, #57b85b, #2a7de1)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
          }}
        >
          Trilha do Aprender
        </h1>

        <p
          className="mx-auto max-w-2xl text-lg font-black text-yellow-200 sm:text-3xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Jornada Tropical 🌿
        </p>

        <p className="mx-auto mt-1 max-w-xl text-base font-bold text-[#cde7d5] sm:text-xl">
          Aprenda as letras junto com os bichos do Brasil!
        </p>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onStart}
        className="group relative flex items-center justify-center overflow-hidden rounded-full border-4 border-white/50 bg-gradient-to-b from-[#57b85b] to-[#2e7d32] px-8 py-4 shadow-[0_8px_0_rgba(0,0,0,0.35)] active:translate-y-[3px] active:shadow-[0_3px_0_rgba(0,0,0,0.35)] sm:px-12 sm:py-6"
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
  onLogout,
}: {
  name: string;
  onLogout: () => void;
}) {
  const [totalPaws, setTotalPaws] = useState(0);

  useEffect(() => {
    const read = () => {
      try {
        setTotalPaws(
          parseInt(localStorage.getItem("bichoStars") || "0", 10),
        );
      } catch {
        setTotalPaws(0);
      }
    };

    read();

    window.addEventListener("bichoStarsChanged", read);
    window.addEventListener("storage", read);

    return () => {
      window.removeEventListener("bichoStarsChanged", read);
      window.removeEventListener("storage", read);
    };
  }, []);

  return (
    <div className="flex w-full flex-row items-center justify-between gap-2 border-b-4 border-[#6b3f22] bg-[#052e1c]/80 px-4 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.4)] backdrop-blur-md sm:gap-6 sm:px-8 sm:py-4">
      <div className="flex min-w-0 items-center gap-2 sm:gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border-2 border-[#a9713f] bg-gradient-to-b from-[#57b85b] to-[#2e7d32] text-xl sm:h-14 sm:w-14 sm:text-2xl">
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

          <p className="truncate text-xs font-medium text-[#cde7d5] sm:text-sm">
            Bem-vindo à floresta!
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex shrink-0 items-center gap-1 rounded-full border-4 border-white bg-gradient-to-b from-[#f6a623] to-[#d98a10] px-3 py-2 font-black text-[#5a3410] shadow-[0_4px_0_rgba(0,0,0,0.25)] sm:gap-2 sm:px-4">
          <PawPrint
            size={18}
            className="fill-[#5a3410] sm:hidden"
          />

          <PawPrint
            size={22}
            className="hidden fill-[#5a3410] sm:block"
          />

          <span
            className="text-base sm:text-xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {totalPaws}
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onLogout}
          className="flex shrink-0 items-center gap-1 rounded-xl border-2 border-[#a9713f] bg-[#6b3f22] px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-[#7c4a28] sm:gap-2 sm:px-4"
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
      className="relative z-10 flex w-full max-w-5xl flex-col items-center gap-5 px-4 py-6 sm:gap-10 sm:py-10"
    >
      <div className="w-full space-y-2 text-center sm:space-y-4">
        <h1
          className="text-3xl font-black text-transparent sm:text-6xl"
          style={{
            fontFamily: "var(--font-display)",
            backgroundImage:
              "linear-gradient(to bottom right, #f6a623, #57b85b, #2a7de1)",
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
            className={`relative flex flex-col items-center gap-3 rounded-3xl border-4 border-white bg-gradient-to-b ${bioma.color} p-5 shadow-[0_6px_0_rgba(0,0,0,0.3)] transition-all hover:shadow-[0_10px_0_rgba(0,0,0,0.3)] active:translate-y-[2px] sm:gap-6 sm:p-10`}
          >
            <div className="rounded-full border-4 border-white bg-white/90 p-3 text-6xl shadow-[0_4px_0_rgba(0,0,0,0.2)] sm:p-4 sm:text-9xl">
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
      className="relative z-10 flex w-full max-w-6xl flex-col items-center gap-5 px-4 py-6 sm:gap-8 sm:py-10"
    >
      <div className="flex w-full items-center justify-between gap-2">
        <button
          type="button"
          onClick={onBack}
          className="shrink-0 rounded-full border-2 border-[#35b35b]/40 bg-[#052e1c]/60 p-3 text-white backdrop-blur-sm transition-all hover:bg-[#052e1c]/80 sm:p-4"
          aria-label="Voltar para os biomas"
        >
          <ChevronLeft size={24} />
        </button>

        <h1
          className="flex-1 text-center text-xl font-black text-transparent sm:text-5xl"
          style={{
            fontFamily: "var(--font-display)",
            backgroundImage:
              "linear-gradient(to bottom right, #f6a623, #57b85b, #2a7de1)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
          }}
        >
          {bioma.emoji} {bioma.name}
        </h1>

        <div className="w-10 shrink-0 sm:w-16" />
      </div>

      <p
        className="text-base font-black text-white/80 sm:text-xl"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Escolha sua Trilha!
      </p>

      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-6">
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
              className={`group relative flex w-full flex-row items-center justify-center gap-4 overflow-hidden rounded-3xl border-4 border-white bg-gradient-to-b ${trail.color} p-4 shadow-[0_6px_0_rgba(0,0,0,0.3)] transition-all hover:translate-y-[-4px] hover:shadow-[0_10px_0_rgba(0,0,0,0.3)] active:translate-y-[2px] sm:flex-col sm:gap-6 sm:p-8`}
            >
              <div className="pointer-events-none absolute inset-0 text-white/20">
                <Footprints className="absolute -right-3 -top-3 h-16 w-16 -rotate-12 transition-transform duration-300 group-hover:rotate-0 group-hover:scale-110 sm:h-20 sm:w-20" />

                <Footprints className="absolute -bottom-3 -left-3 h-16 w-16 rotate-45 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 sm:h-20 sm:w-20" />
              </div>

              <div className="relative z-10 flex flex-row items-center gap-4 sm:flex-col sm:gap-6">
                <div className="flex items-center justify-center rounded-3xl border-4 border-white bg-white p-4 shadow-[0_4px_0_rgba(0,0,0,0.15)] transition-transform duration-300 group-hover:-translate-y-1 sm:p-6">
                  {trail.icon}
                </div>

                <div
                  className="text-left sm:text-center"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <h3 className="mb-1 text-lg font-black text-white sm:text-2xl">
                    {trail.name}
                  </h3>

                  <div className="inline-flex items-center justify-center gap-1 rounded-full border-2 border-white/40 bg-black/25 px-3 py-1 text-white sm:gap-2 sm:px-4 sm:py-2">
                    <span className="text-xs font-bold sm:text-lg">
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
    setPlayerName,
    saveCurrentSession,
    resetGame,
  } = useGame();

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
    try {
      const savedName = localStorage.getItem("bichoName");

      const savedBioma = localStorage.getItem(
        "bichoBioma",
      ) as "portuguese" | "math" | null;

      if (savedName) {
        setExplorerName(savedName);
        setPlayerName(savedName);
      }

      /*
       * Se já existir um aluno salvo e um bioma salvo,
       * o jogo retorna diretamente para a seleção de biomas.
       */
      if (
        savedName &&
        (savedBioma === "portuguese" || savedBioma === "math")
      ) {
        setBiomaId(savedBioma);
        setStep(2);
      }
    } catch {
      setExplorerName("Explorador");
    }

    setIsLoaded(true);
  }, [setPlayerName]);

  const handleLogout = () => {
    if (
      state.playerName.trim() &&
      (state.stars > 0 ||
        state.completedActivities.length > 0)
    ) {
      saveCurrentSession();
    }

    try {
      localStorage.removeItem("bichoName");
      localStorage.removeItem("bichoBioma");
      localStorage.removeItem("bichoStars");
    } catch {
      // Evita que um erro do localStorage interrompa a troca de aluno.
    }

    window.dispatchEvent(new Event("bichoStarsChanged"));

    resetGame();
    setExplorerName("Explorador");
    setBiomaId(null);
    setStep(0);
  };

  const handleStudentSelected = (name: string) => {
    setExplorerName(name);
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
    <div className="relative flex min-h-screen flex-col overflow-x-hidden overflow-y-auto bg-gradient-to-b from-[#0d3d28] via-[#0b4a2e] to-[#052e1c]">
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
      <div className="pointer-events-none fixed left-0 right-0 top-0 z-0 h-16 bg-gradient-to-b from-[#052e1c] to-transparent opacity-80 sm:h-24" />

      {/* Header fixo quando o aluno já foi selecionado */}
      {isLoggedInScreen && (
        <div className="sticky top-0 z-20 w-full">
          <HeaderBar
            name={explorerName}
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