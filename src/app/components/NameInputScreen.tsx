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
      className="relative z-10 flex w-full max-w-6xl flex-col gap-4 px-3 py-4 sm:px-5 sm:py-5"
    >
      {/* ========================================================
          BARRA SUPERIOR
      ======================================================== */}

      <div className="flex items-center">
        <button
          type="button"
          onClick={handleBack}
          disabled={isSelecting}
          className="group flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-[#052e1c]/80 text-white shadow-[0_3px_0_rgba(0,0,0,0.22)] backdrop-blur-md transition-all hover:border-[#57b85b]/70 hover:bg-[#0d3d28] active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
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
        className="flex flex-col items-center text-center"
      >
        <div className="mb-2 flex items-center gap-2 rounded-full border border-[#57b85b]/40 bg-[#052e1c]/75 px-3.5 py-1.5 shadow-[0_0_18px_rgba(53,179,91,0.16)] backdrop-blur-md">
          <Leaf
            size={13}
            className="text-[#57b85b]"
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
            className="text-[#f6a623]"
            fill="currentColor"
          />
        </div>

        <h1
          className="text-2xl font-black leading-tight text-transparent sm:text-4xl"
          style={{
            fontFamily:
              "var(--font-display)",
            backgroundImage:
              "linear-gradient(135deg, #f6a623 0%, #57b85b 55%, #8bd477 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip:
              "text",
          }}
        >
          Quem vai explorar hoje?
        </h1>

        <p className="mt-1 max-w-xl text-xs font-bold text-[#cde7d5] sm:text-sm">
          Encontre seu nome no mural e
          continue sua aventura.
        </p>
      </motion.header>

      {/* ========================================================
          ÁREA DO MURAL
      ======================================================== */}

      <section className="w-full rounded-[22px] border border-white/15 bg-[#052e1c]/65 p-3 shadow-[0_12px_35px_rgba(0,0,0,0.18)] backdrop-blur-md sm:p-4">

        {/* ======================================================
            CABEÇALHO DO MURAL
        ====================================================== */}

        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-2">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#57b85b]/30 bg-[#0d3d28] text-[#57b85b]">
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
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#57b85b]"
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
                    className="w-full rounded-xl border border-[#57b85b]/30 bg-[#031f13]/70 py-2.5 pl-10 pr-3 text-xs font-bold text-white outline-none backdrop-blur-md transition placeholder:text-white/35 focus:border-[#f6a623]/80 focus:ring-2 focus:ring-[#f6a623]/10 disabled:cursor-not-allowed disabled:opacity-50"
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
            className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-[#57b85b]/25 bg-[#031f13]/45 px-5 py-8"
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-[#57b85b]/30 bg-[#0d3d28] text-[#57b85b]">
              <Leaf
                size={24}
                fill="currentColor"
              />
            </div>

            <h2
              className="text-base font-black text-[#f6a623] sm:text-lg"
              style={{
                fontFamily:
                  "var(--font-display)",
              }}
            >
              Carregando exploradores...
            </h2>

            <p className="mt-1 text-xs font-bold text-[#cde7d5]">
              Buscando os alunos cadastrados.
            </p>
          </motion.div>
        ) : visibleStudents.length > 0 ? (

          /* ====================================================
             CARDS DOS ALUNOS
          ==================================================== */

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

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
                    className="group relative flex min-h-[112px] flex-col overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-[#174a32] via-[#14512f] to-[#0d3d28] p-3 text-left shadow-[0_4px_0_rgba(0,0,0,0.22)] transition-all hover:border-[#f6a623]/80 hover:shadow-[0_6px_18px_rgba(0,0,0,0.2)] disabled:cursor-wait disabled:opacity-60"
                  >
                    {/* ==================================================
                        DECORAÇÃO
                    ================================================== */}

                    <div className="pointer-events-none absolute -right-7 -top-7 h-20 w-20 rounded-full bg-[#57b85b]/10 transition-transform duration-300 group-hover:scale-125" />

                    <div className="pointer-events-none absolute -bottom-8 -left-8 h-20 w-20 rounded-full bg-[#f6a623]/5" />

                    <Leaf
                      size={35}
                      className="pointer-events-none absolute right-2 top-2 rotate-12 text-[#57b85b]/10 transition-transform duration-300 group-hover:rotate-45"
                      fill="currentColor"
                    />

                    {/* ==================================================
                        IDENTIFICAÇÃO
                    ================================================== */}

                    <div className="relative z-10 min-w-0">

                      <div className="mb-2 flex items-center justify-between gap-2">

                        <span className="inline-flex items-center rounded-md border border-[#8bd477]/20 bg-[#8bd477]/10 px-2 py-1 text-[8px] font-black uppercase tracking-wider text-[#BDE6B0]">
                          Explorador
                        </span>

                        {/* PATINHAS */}

                        <span className="flex items-center gap-1 text-[9px] font-bold text-[#D7EBDD]">
                          <PawPrint
                            size={11}
                            className="text-[#f6a623]"
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

                      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#f6a623] px-2.5 py-1.5 text-[9px] font-black uppercase tracking-wide text-[#173B2B] shadow-[0_2px_0_rgba(0,0,0,0.2)] transition-all group-hover:bg-[#ffb83d]">

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
            className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#57b85b]/30 bg-[#031f13]/45 px-5 py-8 text-center"
          >

            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-[#57b85b]/25 bg-[#0d3d28] text-[#57b85b]">
              {search.trim() ? (
                <Search size={22} />
              ) : (
                <UserRound size={22} />
              )}
            </div>

            <h2
              className="text-base font-black text-[#f6a623] sm:text-lg"
              style={{
                fontFamily:
                  "var(--font-display)",
              }}
            >
              {search.trim()
                ? "Nenhum explorador encontrado"
                : "Nenhum explorador cadastrado"}
            </h2>

            <p className="mt-1 max-w-md text-xs font-bold text-[#cde7d5]">
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
          className="text-[#57b85b]"
          fill="currentColor"
        />

        Escolha seu perfil e continue sua jornada.

        <Leaf
          size={11}
          className="text-[#f6a623]"
          fill="currentColor"
        />

      </div>
    </motion.div>
  );
}