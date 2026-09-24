import { useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Compass,
  GraduationCap,
  PawPrint,
  Search,
  Sparkles,
  Trophy,
  User,
  Users,
  X,
} from "lucide-react"; // Ajuste o import se necessário

import { Button } from "./Button";
import { useGame } from "./GameContext";

type NameInputScreenProps = {
  onStudentSelected?: (name: string) => void;
  onBack?: () => void;
};

export function NameInputScreen({
  onStudentSelected,
  onBack,
}: NameInputScreenProps) {
  const { history, setPlayerName, goToScreen } = useGame();
  const [search, setSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Filtra lista de alunos do banco
  const students = useMemo(() => {
    const uniqueStudents = new Map<string, (typeof history)[number]>();

    history.forEach((student) => {
      const normalizedName = student.name.trim().toLowerCase();

      if (normalizedName && !uniqueStudents.has(normalizedName)) {
        uniqueStudents.set(normalizedName, student);
      }
    });

    return Array.from(uniqueStudents.values());
  }, [history]);

  // Filtra alunos visíveis com base na pesquisa
  const visibleStudents = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return students;
    }

    return students.filter((student) =>
      student.name.toLowerCase().includes(normalizedSearch)
    );
  }, [students, search]);

  // Seleciona um aluno que JÁ EXISTE no banco
  const handleSelectStudent = async (studentName: string) => {
    const normalizedName = studentName.trim();

    if (!normalizedName || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      await setPlayerName(normalizedName);

      if (onStudentSelected) {
        onStudentSelected(normalizedName);
        return;
      }

      goToScreen("trail-select");
    } catch (error) {
      console.error("Erro ao selecionar aluno:", error);
      setErrorMessage("Não foi possível conectar ao aluno. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    goToScreen("start");
  };

  return (
    <div className="relative z-10 min-h-screen w-full px-4 py-6 sm:py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col">
        {/* Cabeçalho */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleBack}
            className="group flex items-center gap-2 rounded-2xl border-2 border-yellow-300 bg-yellow-400 px-4 py-2 font-bold text-[#052e1c] shadow-md transition-all hover:bg-yellow-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            <span>Voltar</span>
          </button>

          <div className="text-right">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#052e1c]/60 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#57b85b] border border-[#35b35b]/30">
              <Compass className="h-3.5 w-3.5" /> Trilha do Aprender
            </span>
            <h1
              className="mt-1 text-xl font-black text-white drop-shadow-md sm:text-3xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Mural dos Exploradores
            </h1>
          </div>
        </div>

        {/* Banner principal */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 text-center"
        >
          <div className="mb-4 flex justify-center">
            <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border-4 border-white/80 bg-gradient-to-br from-[#f6a623] via-[#57b85b] to-[#2e7d32] p-4 shadow-[0_8px_20px_rgba(0,0,0,0.4)]">
              <GraduationCap className="h-10 w-10 text-white drop-shadow" />
              <div className="absolute -bottom-2 -right-2 rounded-full border-2 border-white bg-[#f6a623] p-1 text-[#052e1c]">
                <Sparkles className="h-4 w-4" />
              </div>
            </div>
          </div>

          <h2
            className="mb-2 text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#f6a623] via-[#57b85b] to-[#ffd166] drop-shadow-md sm:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Olá, explorador! 🌿
          </h2>

          <p className="mx-auto max-w-xl text-base font-medium text-[#cde7d5] sm:text-lg">
            Procure e clique no seu nome no mural abaixo para continuar sua jornada!
          </p>
        </motion.div>

        {/* Barra de pesquisa */}
        <div className="mx-auto mb-6 w-full max-w-xl">
          <label
            htmlFor="student-search"
            className="mb-2 block text-xs font-bold uppercase tracking-wider text-yellow-300"
          >
            Procurar Seu Nome
          </label>

          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#57b85b]" />

            <input
              id="student-search"
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Digite seu nome para encontrar..."
              autoComplete="off"
              className="w-full rounded-2xl border-4 border-[#35b35b]/40 bg-[#052e1c]/80 px-12 py-3.5 text-center text-lg font-bold text-white outline-none backdrop-blur-md transition-all placeholder:text-white/40 focus:border-[#f6a623] focus:ring-4 focus:ring-[#f6a623]/20"
              style={{ fontFamily: "var(--font-display)" }}
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-1 text-white/70 hover:bg-white/20 hover:text-white transition"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {errorMessage && (
          <p className="mb-4 text-center text-sm font-bold text-red-400">
            {errorMessage}
          </p>
        )}

        {/* Contador de alunos */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#35b35b]/40 bg-[#052e1c]/60 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#cde7d5] backdrop-blur-sm">
            <Users className="h-4 w-4 text-[#57b85b]" />
            <span>
              {visibleStudents.length}{" "}
              {visibleStudents.length === 1
                ? "explorador encontrado"
                : "exploradores encontrados"}
            </span>
          </div>
        </div>

        {/* Grid de alunos existentes */}
        {visibleStudents.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visibleStudents.map((student, index) => (
              <motion.button
                key={student.id || index}
                type="button"
                disabled={isSubmitting}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                }}
                onClick={() => handleSelectStudent(student.name)}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border-4 border-white bg-gradient-to-b from-white via-amber-50/30 to-amber-100/60 p-5 text-left shadow-[0_8px_0_rgba(0,0,0,0.25)] transition-all hover:-translate-y-1.5 hover:shadow-[0_12px_0_rgba(0,0,0,0.3)] focus:outline-none focus:ring-4 focus:ring-[#f6a623] cursor-pointer disabled:opacity-50"
              >
                <div className="absolute right-3 top-3 opacity-10 transition-opacity group-hover:opacity-20 pointer-events-none">
                  <PawPrint className="h-16 w-16 text-[#052e1c]" />
                </div>

                <div>
                  <div className="mb-4 flex items-center gap-3.5">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 border-white bg-gradient-to-br from-[#57b85b] to-[#2e7d32] text-white shadow-md transition-transform group-hover:scale-105">
                      <User className="h-7 w-7" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3
                        className="truncate text-xl font-black text-[#052e1c]"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {student.name}
                      </h3>
                      <p className="text-xs font-bold text-[#35b35b]">
                        Explorador da Selva 🐾
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="rounded-2xl border border-amber-300/60 bg-gradient-to-b from-amber-100 to-amber-200/80 p-2.5 shadow-inner">
                      <div className="mb-1 flex items-center gap-1.5">
                        <PawPrint className="h-4 w-4 fill-[#d98a10] text-[#d98a10]" />
                        <span className="text-[11px] font-black uppercase text-[#7c4a28]">
                          Patinhas
                        </span>
                      </div>
                      <p className="text-xl font-black text-[#5a3410]">
                        {student.paws ?? 0}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-sky-300/60 bg-gradient-to-b from-sky-100 to-sky-200/80 p-2.5 shadow-inner">
                      <div className="mb-1 flex items-center gap-1.5">
                        <Trophy className="h-4 w-4 text-[#2a7de1]" />
                        <span className="text-[11px] font-black uppercase text-[#1e5bb0]">
                          Atividades
                        </span>
                      </div>
                      <p className="text-xl font-black text-[#0b4a2e]">
                        {student.completedCount ?? 0}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3.5 flex items-center gap-1.5 text-xs font-semibold text-[#052e1c]/70">
                    <CalendarDays className="h-3.5 w-3.5 text-[#57b85b]" />
                    <span>Última sessão: {student.date || "Hoje"}</span>
                  </div>
                </div>

                <div className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-white/50 bg-gradient-to-r from-[#57b85b] to-[#2e7d32] py-2.5 px-4 font-black uppercase text-white shadow-[0_4px_0_rgba(0,0,0,0.2)] transition-colors group-hover:from-[#35b35b] group-hover:to-[#1e5a23]">
                  <span
                    className="text-xs sm:text-sm"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Continuar Aventura
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto w-full max-w-md rounded-3xl border-4 border-[#35b35b]/40 bg-[#052e1c]/80 p-8 text-center backdrop-blur-md shadow-2xl"
          >
            <div className="mb-4 flex justify-center">
              <div className="rounded-full border-2 border-[#57b85b]/40 bg-[#052e1c] p-4 text-[#f6a623]">
                <BookOpen className="h-10 w-10" />
              </div>
            </div>

            <h3
              className="mb-2 text-2xl font-black text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Aluno não encontrado 👩‍🏫
            </h3>

            <p className="mb-6 text-sm font-medium text-[#cde7d5]">
              {search.trim()
                ? `O aluno "${search.trim()}" ainda não está cadastrado no sistema. Peça à professora para realizar o seu cadastro!`
                : "Ainda não existem alunos cadastrados. Peça à professora para cadastrar a turma!"}
            </p>

            {search.trim() && (
              <Button
                onClick={() => setSearch("")}
                variant="secondary"
                size="lg"
              >
                Limpar pesquisa
              </Button>
            )}
          </motion.div>
        )}

        {/* Rodapé */}
        <div className="mt-8 text-center text-xs font-semibold text-white/50">
          <p>
            Não encontra seu nome? Entre em contato com a sua professora para realizar o cadastro no painel.
          </p>
        </div>
      </div>
    </div>
  );
}