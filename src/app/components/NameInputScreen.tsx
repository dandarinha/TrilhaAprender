import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  ChevronLeft,
  Leaf,
  PawPrint,
  Search,
  UserRound,
} from "lucide-react";
import { useGame } from "./GameContext";

type NameInputScreenProps = {
  onStudentSelected?: (name: string) => void;
  onBack?: () => void;
};

function normalizeName(name: string) {
  return name.trim().replace(/\s+/g, " ");
}

export function NameInputScreen({
  onStudentSelected,
  onBack,
}: NameInputScreenProps) {
  const {
    history,
    setPlayerName,
    refreshStudents,
    goToScreen,
  } = useGame();

  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSelecting, setIsSelecting] = useState(false);
  const [error, setError] = useState("");

  /*
   * ============================================================
   * CARREGAR ALUNOS
   * ============================================================
   *
   * O mural apenas consulta os alunos cadastrados.
   * O cadastro é feito exclusivamente pela Área do Professor.
   */

  useEffect(() => {
    const loadStudents = async () => {
      setIsLoading(true);
      setError("");

      try {
        await refreshStudents();
      } catch (error) {
        console.error(
          "Erro ao atualizar os alunos:",
          error
        );

        setError(
          "Não foi possível carregar os exploradores."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadStudents();
  }, [refreshStudents]);

  /*
   * ============================================================
   * FILTRO
   * ============================================================
   */

  const visibleStudents = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return history;
    }

    return history.filter((student) =>
      `${student.name} ${student.className ?? ""}`
        .toLowerCase()
        .includes(term)
    );
  }, [history, search]);

  /*
   * ============================================================
   * VOLTAR
   * ============================================================
   */

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    goToScreen("start");
  };

  /*
   * ============================================================
   * SELECIONAR ALUNO
   * ============================================================
   */

  const handleSelectStudent = async (
    student: (typeof history)[number]
  ) => {
    const selectedName = normalizeName(
      student.name
    );

    setError("");
    setIsSelecting(true);

    try {
      /*
       * setPlayerName:
       * 1. localiza o aluno cadastrado;
       * 2. inicia uma sessão;
       * 3. carrega as patinhas;
       * 4. carrega o progresso;
       * 5. atualiza o GameContext.
       */
      await setPlayerName(selectedName);

      if (onStudentSelected) {
        onStudentSelected(selectedName);
      } else {
        goToScreen("trail-select");
      }
    } catch (error) {
      console.error(
        "Erro ao selecionar aluno:",
        error
      );

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(
          "Não foi possível selecionar este explorador."
        );
      }
    } finally {
      setIsSelecting(false);
    }
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: 35,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      exit={{
        opacity: 0,
        x: -35,
      }}
      transition={{
        duration: 0.25,
      }}
      className="player-screen explorer-screen relative z-10 flex w-full max-w-6xl min-w-0 flex-col gap-4 px-3 py-4 sm:px-5 sm:py-5"
    >
      {/* ========================================================
          BARRA SUPERIOR
      ======================================================== */}

      <div className="flex items-center">
        <button
          type="button"
          onClick={handleBack}
          disabled={isSelecting}
          className="group flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-[#0B4D2B]/80 text-white shadow-[0_3px_0_rgba(0,0,0,0.22)] backdrop-blur-md transition-all hover:border-[#6A9876]/70 hover:bg-[#155A35] active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Voltar"
        >
          <ChevronLeft
            size={20}
            className="transition-transform group-hover:-translate-x-0.5"
          />
        </button>
      </div>

      {/* ========================================================
          CABEÇALHO
      ======================================================== */}

      <motion.header
        initial={{
          opacity: 0,
          y: -12,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="forest-panel-light explorer-header rounded-3xl p-4 text-center sm:p-6"
      >
        <div className="mb-2 flex items-center gap-2 rounded-full border border-[#6A9876]/40 bg-[#0B4D2B]/75 px-3.5 py-1.5 shadow-[0_0_18px_rgba(53,179,91,0.16)] backdrop-blur-md">
          <Leaf
            size={13}
            className="text-[#6A9876]"
            fill="currentColor"
          />

          <span
            className="text-[10px] font-black uppercase tracking-[0.18em] text-white sm:text-xs"
            style={{
              fontFamily:
                "var(--font-display)",
            }}
          >
            Mural dos Exploradores
          </span>

          <Leaf
            size={13}
            className="text-[#F45A0A]"
            fill="currentColor"
          />
        </div>

        <h1
          className="text-2xl font-black leading-tight text-transparent sm:text-4xl"
          style={{
            fontFamily:
              "var(--font-display)",
            backgroundImage:
              "linear-gradient(135deg, #F45A0A 0%, #6A9876 55%, #A7C9B0 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip:
              "text",
          }}
        >
          Quem vai explorar hoje?
        </h1>

        <p className="mt-1 max-w-xl text-xs font-bold text-[#DCEBDD] sm:text-sm">
          Encontre seu nome no mural e
          continue sua aventura.
        </p>
      </motion.header>

      {/* ========================================================
          ÁREA DO MURAL
      ======================================================== */}

      <section className="forest-panel-light explorer-board w-full min-w-0 rounded-[22px] p-3 sm:p-4">

        {/* ======================================================
            CABEÇALHO DO MURAL
        ====================================================== */}

        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-2">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#6A9876]/30 bg-[#155A35] text-[#6A9876]">
              <UserRound size={17} />
            </div>

            <div className="text-left">
              <h2
                className="text-sm font-black text-white sm:text-base"
                style={{
                  fontFamily:
                    "var(--font-display)",
                }}
              >
                Exploradores cadastrados
              </h2>

              <p className="text-[10px] font-semibold text-[#9FC8AA]">
                Escolha seu perfil para começar.
              </p>
            </div>

          </div>

          {/* ====================================================
              PESQUISA
          ==================================================== */}

          {!isLoading &&
            history.length > 0 && (
              <div className="w-full sm:w-64">
                <div className="relative">

                  <Search
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6A9876]"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(event) =>
                      setSearch(
                        event.target.value
                      )
                    }
                    placeholder="Pesquisar nome..."
                    disabled={isSelecting}
                    className="w-full rounded-xl border border-[#6A9876]/30 bg-[#07391F]/70 py-2.5 pl-10 pr-3 text-xs font-bold text-white outline-none backdrop-blur-md transition placeholder:text-white/35 focus:border-[#F45A0A]/80 focus:ring-2 focus:ring-[#F45A0A]/10 disabled:cursor-not-allowed disabled:opacity-50"
                  />

                </div>
              </div>
            )}

        </div>

        {/* ======================================================
            ERRO
        ====================================================== */}

        {error && (
          <motion.div
            initial={{
              opacity: 0,
              y: -5,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mb-3 rounded-xl border border-red-400/40 bg-red-950/45 px-3.5 py-2.5 text-center text-[11px] font-bold text-red-100 backdrop-blur-md"
          >
            {error}
          </motion.div>
        )}

        {/* ======================================================
            CARREGANDO
        ====================================================== */}

        {isLoading ? (
          <motion.div
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-[#6A9876]/25 bg-[#07391F]/45 px-5 py-8"
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-[#6A9876]/30 bg-[#155A35] text-[#6A9876]">
              <Leaf
                size={24}
                fill="currentColor"
              />
            </div>

            <h2
              className="text-base font-black text-[#F45A0A] sm:text-lg"
              style={{
                fontFamily:
                  "var(--font-display)",
              }}
            >
              Carregando exploradores...
            </h2>

            <p className="mt-1 text-xs font-bold text-[#DCEBDD]">
              Buscando os alunos cadastrados.
            </p>
          </motion.div>
        ) : visibleStudents.length > 0 ? (

          /* ====================================================
             CARDS DOS ALUNOS
          ==================================================== */

          <div className="explorer-grid grid w-full min-w-0 grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {visibleStudents.map(
              (student, index) => {
                const paws =
                  Number(student.paws) || 0;

                return (
                  <motion.button
                    key={student.id}
                    type="button"
                    initial={{
                      opacity: 0,
                      y: 12,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: index * 0.035,
                      duration: 0.2,
                    }}
                    whileHover={
                      !isSelecting
                        ? {
                            y: -2,
                          }
                        : undefined
                    }
                    whileTap={
                      !isSelecting
                        ? {
                            scale: 0.985,
                          }
                        : undefined
                    }
                    onClick={() =>
                      handleSelectStudent(
                        student
                      )
                    }
                    disabled={isSelecting}
                    className="explorer-card group relative flex min-h-[112px] min-w-0 w-full flex-col overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-[#0B4D2B] via-[#155A35] to-[#155A35] p-3 text-left shadow-[0_4px_0_rgba(0,0,0,0.22)] transition-all hover:border-[#F45A0A]/80 hover:shadow-[0_6px_18px_rgba(0,0,0,0.2)] disabled:cursor-wait disabled:opacity-60"
                  >
                    {/* ==================================================
                        DECORAÇÃO
                    ================================================== */}

                    <div className="pointer-events-none absolute -right-7 -top-7 h-20 w-20 rounded-full bg-[#6A9876]/10 transition-transform duration-300 group-hover:scale-125" />

                    <div className="pointer-events-none absolute -bottom-8 -left-8 h-20 w-20 rounded-full bg-[#F45A0A]/5" />

                    <Leaf
                      size={35}
                      className="pointer-events-none absolute right-2 top-2 rotate-12 text-[#6A9876]/10 transition-transform duration-300 group-hover:rotate-45"
                      fill="currentColor"
                    />

                    {/* ==================================================
                        IDENTIFICAÇÃO
                    ================================================== */}

                    <div className="relative z-10 min-w-0">

                      <div className="mb-2 flex items-center justify-between gap-2">

                        <span className="inline-flex items-center rounded-md border border-[#A7C9B0]/20 bg-[#A7C9B0]/10 px-2 py-1 text-[8px] font-black uppercase tracking-wider text-[#BDE6B0]">
                          Explorador
                        </span>

                        {/* PATINHAS */}

                        <span className="flex items-center gap-1 text-[9px] font-bold text-[#D7EBDD]">
                          <PawPrint
                            size={11}
                            className="text-[#F45A0A]"
                          />

                          {paws}
                        </span>

                      </div>

                      <h2
                        className="truncate pr-2 text-base font-black text-white sm:text-[17px]"
                        style={{
                          fontFamily:
                            "var(--font-display)",
                        }}
                      >
                        {student.name}
                      </h2>

                      {student.className && (
                        <p className="mt-0.5 truncate text-[10px] font-semibold text-[#A9CFB2]">
                          {student.className}
                        </p>
                      )}

                    </div>

                    {/* ==================================================
                        AÇÃO
                    ================================================== */}

                    <div className="relative z-10 mt-auto flex items-center justify-between gap-2 pt-3">

                      <span className="text-[9px] font-bold text-white/45">
                        Pronto para explorar?
                      </span>

                      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#F45A0A] px-2.5 py-1.5 text-[9px] font-black uppercase tracking-wide text-[#173C2A] shadow-[0_2px_0_rgba(0,0,0,0.2)] transition-all group-hover:bg-[#ffb83d]">

                        <PawPrint size={12} />

                        {isSelecting
                          ? "Entrando..."
                          : "Explorar"}

                      </span>

                    </div>

                  </motion.button>
                );
              }
            )}

          </div>

        ) : (

          /* ====================================================
             ESTADO VAZIO
          ==================================================== */

          <motion.div
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#6A9876]/30 bg-[#07391F]/45 px-5 py-8 text-center"
          >

            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-[#6A9876]/25 bg-[#155A35] text-[#6A9876]">
              {search.trim() ? (
                <Search size={22} />
              ) : (
                <UserRound size={22} />
              )}
            </div>

            <h2
              className="text-base font-black text-[#F45A0A] sm:text-lg"
              style={{
                fontFamily:
                  "var(--font-display)",
              }}
            >
              {search.trim()
                ? "Nenhum explorador encontrado"
                : "Nenhum explorador cadastrado"}
            </h2>

            <p className="mt-1 max-w-md text-xs font-bold text-[#DCEBDD]">
              {search.trim()
                ? "Tente pesquisar por outro nome."
                : "Peça ao professor para cadastrar seu nome antes de começar."}
            </p>

          </motion.div>
        )}

      </section>

      {/* ========================================================
          RODAPÉ
      ======================================================== */}

      <div className="flex items-center justify-center gap-2 text-[9px] font-bold text-white/40">

        <Leaf
          size={11}
          className="text-[#6A9876]"
          fill="currentColor"
        />

        Escolha seu perfil e continue sua jornada.

        <Leaf
          size={11}
          className="text-[#F45A0A]"
          fill="currentColor"
        />

      </div>
    </motion.div>
  );
}
