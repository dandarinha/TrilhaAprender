import { useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  GraduationCap,
  Search,
  Star,
  Trophy,
  User,
  Users,
} from "lucide-react";

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
  const {
    history,
    setPlayerName,
    goToScreen,
  } = useGame();

  const [search, setSearch] = useState("");

  /*
    Os alunos são obtidos através do histórico do GameContext.

    Cada registro possui:
    - id
    - name
    - stars
    - completedCount
    - date
  */

  /*
    Remove alunos repetidos pelo nome.

    Como o histórico é salvo do mais recente para o mais antigo,
    o primeiro registro encontrado será mantido.
  */
  const students = useMemo(() => {
    const uniqueStudents = new Map<
      string,
      (typeof history)[number]
    >();

    history.forEach((student) => {
      const normalizedName = student.name
        .trim()
        .toLowerCase();

      if (
        normalizedName &&
        !uniqueStudents.has(normalizedName)
      ) {
        uniqueStudents.set(normalizedName, student);
      }
    });

    return Array.from(uniqueStudents.values());
  }, [history]);

  /*
    Filtra os alunos pelo nome digitado na busca.
  */
  const visibleStudents = useMemo(() => {
    const normalizedSearch = search
      .trim()
      .toLowerCase();

    if (!normalizedSearch) {
      return students;
    }

    return students.filter((student) =>
      student.name
        .toLowerCase()
        .includes(normalizedSearch),
    );
  }, [students, search]);

  /*
    Seleciona um aluno.

    Quando o componente é utilizado dentro do Home,
    onStudentSelected controla a navegação pelo estado "step".

    O fallback goToScreen permanece para que o componente
    também possa ser utilizado em uma navegação baseada no GameContext.
  */
  const handleSelectStudent = (studentName: string) => {
    const normalizedName = studentName.trim();

    if (!normalizedName) {
      return;
    }

    setPlayerName(normalizedName);

    if (onStudentSelected) {
      onStudentSelected(normalizedName);
      return;
    }

    goToScreen("trail-select");
  };

  /*
    Volta para a tela inicial.

    Quando o componente é utilizado dentro do Home,
    onBack controla a navegação pelo estado "step".
  */
  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    goToScreen("start");
  };

  return (
    <div className="relative z-10 min-h-screen w-full px-4 py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col">
        {/* Cabeçalho */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <Button
            onClick={handleBack}
            variant="secondary"
            size="lg"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Voltar
          </Button>

          <div className="text-right">
            <p className="text-sm font-semibold text-white/70">
              Trilha do Aprender
            </p>

            <h1 className="text-2xl font-bold text-white md:text-4xl">
              Mural de Alunos
            </h1>
          </div>
        </div>

        {/* Título principal */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 text-center"
        >
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-emerald-700 p-5 shadow-lg">
              <GraduationCap className="h-12 w-12 text-white" />
            </div>
          </div>

          <h2 className="mb-3 text-3xl font-bold text-white md:text-5xl">
            Olá, explorador!
          </h2>

          <p className="mx-auto max-w-2xl text-base text-white/80 md:text-lg">
            Escolha seu nome no mural para continuar sua aventura
            pela floresta.
          </p>
        </motion.div>

        {/* Barra de pesquisa */}
        <div className="mx-auto mb-8 w-full max-w-xl">
          <label
            htmlFor="student-search"
            className="mb-2 block text-sm font-semibold text-white"
          >
            Procurar aluno
          </label>

          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/50" />

            <input
              id="student-search"
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Digite o nome do aluno..."
              autoComplete="off"
              className="w-full rounded-2xl border-2 border-emerald-300/30 bg-emerald-950/60 px-12 py-4 text-center text-lg text-white outline-none transition placeholder:text-white/40 focus:border-emerald-300"
            />
          </div>
        </div>

        {/* Contador de alunos */}
        <div className="mb-6 flex items-center justify-center gap-2 text-white/80">
          <Users className="h-5 w-5" />

          <span>
            {visibleStudents.length}{" "}
            {visibleStudents.length === 1
              ? "aluno encontrado"
              : "alunos encontrados"}
          </span>
        </div>

        {/* Mural de alunos */}
        {visibleStudents.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visibleStudents.map((student, index) => (
              <motion.button
                key={student.id}
                type="button"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.25,
                  delay: index * 0.05,
                }}
                onClick={() =>
                  handleSelectStudent(student.name)
                }
                className="group rounded-3xl border-2 border-white/80 bg-white p-5 text-left shadow-lg transition hover:-translate-y-1 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-yellow-300"
              >
                {/* Avatar e nome */}
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white shadow-md transition group-hover:bg-emerald-600">
                    <User className="h-8 w-8" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-xl font-bold text-emerald-950">
                      {student.name}
                    </h3>

                    <p className="text-sm text-emerald-800/70">
                      Explorador da floresta
                    </p>
                  </div>
                </div>

                {/* Estatísticas do aluno */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Estrelas */}
                  <div className="rounded-2xl bg-yellow-100 p-3">
                    <div className="mb-1 flex items-center gap-2">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-600" />

                      <span className="text-xs font-semibold text-yellow-800">
                        Estrelas
                      </span>
                    </div>

                    <p className="text-2xl font-bold text-yellow-900">
                      {student.stars}
                    </p>
                  </div>

                  {/* Atividades concluídas */}
                  <div className="rounded-2xl bg-blue-100 p-3">
                    <div className="mb-1 flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-blue-700" />

                      <span className="text-xs font-semibold text-blue-800">
                        Atividades
                      </span>
                    </div>

                    <p className="text-2xl font-bold text-blue-900">
                      {student.completedCount}
                    </p>
                  </div>
                </div>

                {/* Data da sessão */}
                <div className="mt-4 flex items-center gap-2 text-sm text-emerald-900/70">
                  <CalendarDays className="h-4 w-4" />

                  <span>
                    Última sessão: {student.date}
                  </span>
                </div>

                {/* Ação */}
                <div className="mt-5 rounded-full bg-emerald-800 px-4 py-3 text-center font-bold text-white transition group-hover:bg-emerald-600">
                  Continuar como este aluno
                </div>
              </motion.button>
            ))}
          </div>
        ) : (
          /* Estado sem alunos */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto w-full max-w-xl rounded-3xl border-2 border-white/70 bg-emerald-950/70 p-8 text-center shadow-xl"
          >
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-emerald-700 p-5">
                <BookOpen className="h-12 w-12 text-white" />
              </div>
            </div>

            <h3 className="mb-3 text-2xl font-bold text-white">
              Nenhum aluno encontrado
            </h3>

            <p className="mb-6 text-white/75">
              {search.trim()
                ? "Nenhum aluno corresponde à pesquisa realizada."
                : "Ainda não existe nenhum registro de aluno no histórico do jogo."}
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
        <div className="mt-10 text-center text-sm text-white/60">
          <p>
            Os alunos são exibidos a partir do histórico salvo pelo
            GameContext.
          </p>
        </div>
      </div>
    </div>
  );
}