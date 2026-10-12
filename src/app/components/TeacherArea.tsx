import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link } from "react-router";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Download,
  Edit3,
  GraduationCap,
  Leaf,
  PawPrint,
  Plus,
  Search,
  Trash2,
  UserRound,
  Users,
  X,
} from "lucide-react";

const API_BASE_URL =
  (import.meta as ImportMeta & {
    env?: { VITE_API_BASE_URL?: string };
  }).env?.VITE_API_BASE_URL ||
  "http://localhost:3000/api";

type Student = {
  id: string;
  name: string;
  className: string | null;
  paws: number;
  createdAt: string;
  lastAccess: string | null;
  playedActivitiesCount?: number;
};

type Activity = {
  id: string;
  name: string;
  trail: string;
  subject: string;
  played_at: string;
};

type Session = {
  id: number;
  paws: number;
  started_at: string;
  finished_at: string | null;
};

type StudentPerformance = {
  student: Student;
  statistics: {
    playedActivitiesCount: number;
    sessionsCount: number;
  };
  activities: Activity[];
  sessions: Session[];
};

function formatDate(value: string | null | undefined) {
  if (!value) return "Ainda não jogou";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Data não disponível";
  }

  return date.toLocaleString("pt-BR");
}

function formatShortDate(value: string | null | undefined) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function normalize(value: string) {
  return value.trim().toLocaleLowerCase("pt-BR");
}

export default function TeacherArea() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedId, setSelectedId] =
    useState<string | null>(null);

  const [selectedPerformance, setSelectedPerformance] =
    useState<StudentPerformance | null>(null);

  const [name, setName] = useState("");
  const [className, setClassName] = useState("");

  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const [loadingStudents, setLoadingStudents] =
    useState(true);

  const [loadingPerformance, setLoadingPerformance] =
    useState(false);

  const [savingStudent, setSavingStudent] =
    useState(false);

  const [deletingStudent, setDeletingStudent] =
    useState(false);

  const [error, setError] = useState("");

  /*
   * ============================================================
   * CARREGAR ALUNOS
   * ============================================================
   */

  const loadStudents = useCallback(async () => {
    setLoadingStudents(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/students`
      );

      const data = await response
        .json()
        .catch(() => []);

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Não foi possível carregar os alunos."
        );
      }

      const studentsFromApi: Student[] =
        Array.isArray(data) ? data : [];

      setStudents(studentsFromApi);

      if (
        selectedId &&
        !studentsFromApi.some(
          (student) =>
            student.id === selectedId
        )
      ) {
        setSelectedId(null);
        setSelectedPerformance(null);
      }
    } catch (error) {
      console.error(
        "Erro ao carregar alunos:",
        error
      );

      setError(
        error instanceof TypeError
          ? "Não foi possível conectar à API. Inicie o servidor com npm run server e confirme o MySQL."
          : error instanceof Error
          ? error.message
          : "Erro ao carregar os alunos."
      );
    } finally {
      setLoadingStudents(false);
    }
  }, [selectedId]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  /*
   * ============================================================
   * CARREGAR DESEMPENHO
   * ============================================================
   */

  const loadPerformance = useCallback(
    async (studentId: string) => {
      setLoadingPerformance(true);
      setError("");

      try {
        const response = await fetch(
          `${API_BASE_URL}/students/${studentId}/performance`
        );

        const data = await response
          .json()
          .catch(() => null);

        if (!response.ok) {
          throw new Error(
            data?.error ||
              "Não foi possível carregar o desempenho."
          );
        }

        setSelectedPerformance(data);
      } catch (error) {
        console.error(
          "Erro ao carregar desempenho:",
          error
        );

        setSelectedPerformance(null);

        setError(
          error instanceof Error
            ? error.message
            : "Erro ao carregar o desempenho."
        );
      } finally {
        setLoadingPerformance(false);
      }
    },
    []
  );

  useEffect(() => {
    if (!selectedId) {
      setSelectedPerformance(null);
      return;
    }

    loadPerformance(selectedId);
  }, [selectedId, loadPerformance]);

  /*
   * ============================================================
   * FILTRO DE ALUNOS
   * ============================================================
   */

  const filteredStudents = useMemo(() => {
    const term = normalize(search);

    const byClass = classFilter
      ? students.filter((student) => student.className === classFilter)
      : students;
    const byDate = dateFilter
      ? byClass.filter((student) => student.createdAt.slice(0, 10) === dateFilter)
      : byClass;

    if (!term) return byDate;

    return byDate.filter((student) =>
      normalize(
        `${student.name} ${
          student.className ?? ""
        }`
      ).includes(term)
    );
  }, [students, search, classFilter, dateFilter]);

  const availableClasses = useMemo(
    () => Array.from(new Set(students.map((student) => student.className).filter(Boolean))) as string[],
    [students]
  );

  const exportCsv = useCallback(() => {
    const header = ["Nome", "Ano escolar", "Patinhas", "Atividades", "Último acesso"];
    const rows = filteredStudents.map((student) => [
      student.name,
      student.className ?? "",
      String(student.paws ?? 0),
      String(student.playedActivitiesCount ?? 0),
      formatDate(student.lastAccess),
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "relatorio-trilha-do-aprender.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }, [filteredStudents]);

  /*
   * ============================================================
   * ALUNO SELECIONADO
   * ============================================================
   */

  const selectedStudent = useMemo(() => {
    if (!selectedId) return null;

    return (
      students.find(
        (student) =>
          student.id === selectedId
      ) ?? null
    );
  }, [students, selectedId]);

  /*
   * ============================================================
   * MÉTRICAS
   * ============================================================
   */

  const totalPaws = students.reduce(
    (sum, student) =>
      sum + Number(student.paws || 0),
    0
  );

  /*
   * ============================================================
   * CADASTRAR ALUNO
   * ============================================================
   */

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const cleanName = name.trim();
    const cleanClass = className.trim();

    if (cleanName.length < 2) {
      setError("Digite um nome válido.");
      return;
    }

    if (!cleanClass) {
      setError(
        "Selecione o ano escolar."
      );
      return;
    }

    setSavingStudent(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/students`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name: cleanName,
            className: cleanClass,
          }),
        }
      );

      const data = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Não foi possível cadastrar o aluno."
        );
      }

      setName("");
      setClassName("");
      setShowForm(false);

      await loadStudents();

      // A API retorna o aluno criado diretamente; aceite também o formato
      // envelopado para manter compatibilidade com versões anteriores.
      const createdStudent = data?.student ?? data;
      if (createdStudent?.id) {
        setSelectedId(createdStudent.id);
      }
    } catch (error) {
      console.error(
        "Erro ao cadastrar aluno:",
        error
      );

      setError(
        error instanceof TypeError
          ? "Não foi possível conectar à API. Inicie o servidor com npm run server e confirme o MySQL."
          : error instanceof Error
          ? error.message
          : "Erro ao cadastrar aluno."
      );
    } finally {
      setSavingStudent(false);
    }
  };

  const handleEditStudent = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingStudent) return;
    const cleanName = name.trim();
    const cleanClass = className.trim();
    if (cleanName.length < 2 || !cleanClass) {
      setError("Informe nome e ano escolar para editar o explorador.");
      return;
    }
    setSavingStudent(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/students/${editingStudent.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: cleanName, className: cleanClass }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || "Não foi possível editar o aluno.");
      setEditingStudent(null);
      setName("");
      setClassName("");
      await loadStudents();
      if (selectedId) await loadPerformance(selectedId);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro ao editar aluno.");
    } finally {
      setSavingStudent(false);
    }
  };

  /*
   * ============================================================
   * EXCLUIR ALUNO
   * ============================================================
   */

  const handleDeleteStudent = async (
    student: Student
  ) => {
    const confirmed = window.confirm(
      `Excluir o cadastro de ${student.name}?`
    );

    if (!confirmed) {
      return;
    }

    setDeletingStudent(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/students/${student.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Não foi possível excluir o aluno."
        );
      }

      setSelectedId(null);
      setSelectedPerformance(null);

      await loadStudents();
    } catch (error) {
      console.error(
        "Erro ao excluir aluno:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Erro ao excluir aluno."
      );
    } finally {
      setDeletingStudent(false);
    }
  };

  return (
    <main className="teacher-page teacher-shell min-h-screen text-[#173B2B]">
      <div className="mx-auto max-w-[1450px] px-4 py-4 sm:px-5 lg:px-6">

        {/* ======================================================
            HEADER
        ====================================================== */}

        <header className="teacher-header mb-4 rounded-2xl bg-[#174A32] shadow-[0_8px_25px_rgba(23,74,50,0.14)]">
          <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F6A623] text-[#173B2B]">
                <GraduationCap size={24} />
              </div>

              <div>

                <div className="flex items-center gap-1.5">
                  <Leaf
                    size={12}
                    className="text-[#9DD47A]"
                    fill="currentColor"
                  />

                  <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#BFE0B2]">
                    Trilha do Aprender
                  </span>
                </div>

                <h1 className="text-xl font-black leading-tight text-white sm:text-2xl">
                  Central do Professor
                </h1>

              </div>
            </div>

            <Link
              to="/"
              className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-xs font-black text-white transition hover:bg-white/20"
            >
              <ArrowLeft size={15} />

              <span className="hidden sm:inline">
                Voltar ao jogo
              </span>
            </Link>

          </div>
        </header>

        {/* ======================================================
            MENSAGEM DE ERRO
        ====================================================== */}

        {error && (
          <div className="mb-4 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-bold text-red-800">

            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Fechar mensagem"
            >
              <X size={16} />
            </button>

          </div>
        )}

        {/* ======================================================
            RESUMO
        ====================================================== */}

        <section className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">

          <CompactSummary
            icon={<Users size={20} />}
            label="Exploradores"
            value={students.length}
            description="cadastrados"
            type="green"
          />

          <CompactSummary
            icon={<PawPrint size={20} />}
            label="Patinhas"
            value={totalPaws}
            description="acumuladas"
            type="orange"
          />

          <CompactSummary
            icon={
              <ClipboardList size={20} />
            }
            label="Atividades"
            value={
                selectedPerformance
                  ?.statistics
                  .playedActivitiesCount ?? 0
            }
            description={
              selectedStudent
                ? "do aluno selecionado"
                : "selecione um aluno"
            }
            type="cream"
          />

        </section>

        {/* ======================================================
            CONTEÚDO PRINCIPAL
        ====================================================== */}

        <section className="grid items-start gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">

          {/* ====================================================
              MURAL DOS EXPLORADORES
          ==================================================== */}

          <aside className="teacher-panel overflow-hidden rounded-2xl bg-[#FFFDF5] text-[#294A37] shadow-[0_6px_20px_rgba(30,70,45,0.06)]">

            {/* CABEÇALHO */}

            <div className="border-b border-[#E7E3D4] px-4 py-3.5">

              <div className="flex items-center justify-between gap-3">

                <div>

                  <div className="flex items-center gap-1.5">
                    <Leaf
                      size={13}
                      className="text-[#6C9363]"
                      fill="currentColor"
                    />

                    <span className="text-[10px] font-black uppercase tracking-wider text-[#6C9363]">
                      Mural
                    </span>
                  </div>

                  <h2 className="text-lg font-black text-[#294A37]">
                    Meus Exploradores
                  </h2>

                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowForm(
                      (value) => !value
                    );
                    setEditingStudent(null);
                    setName("");
                    setClassName("");
                    setError("");
                  }}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                    showForm
                      ? "bg-[#E7E4D8] text-[#31553F]"
                      : "bg-[#F6A623] text-[#173B2B] hover:bg-[#FFB83D]"
                  }`}
                  aria-label={
                    showForm
                      ? "Fechar cadastro"
                      : "Cadastrar aluno"
                  }
                >
                  {showForm ? (
                    <X size={17} />
                  ) : (
                    <Plus size={18} />
                  )}
                </button>

              </div>
            </div>

            {/* ==================================================
                FORMULÁRIO
            ================================================== */}

            {showForm && (
              <div className="border-b border-[#E7E3D4] bg-[#F6F3E7] p-4">

                <div className="mb-3">

                  <p className="text-xs font-black text-[#294A37]">
                    {editingStudent ? "Editar explorador" : "Novo explorador"}
                  </p>

                  <p className="mt-0.5 text-[10px] font-semibold text-[#89958B]">
                    Preencha os dados do aluno.
                  </p>

                </div>

                <form
                  onSubmit={editingStudent ? handleEditStudent : handleSubmit}
                  className="space-y-2.5"
                >

                  <input
                    value={name}
                    onChange={(event) =>
                      setName(
                        event.target.value
                      )
                    }
                    placeholder="Nome do aluno"
                    maxLength={150}
                    required
                    disabled={savingStudent}
                    className="w-full rounded-lg border border-[#D4D8C8] bg-white px-3 py-2.5 text-xs font-semibold text-[#294A37] outline-none transition placeholder:text-[#9BA69C] focus:border-[#6BA85E] focus:ring-2 focus:ring-[#6BA85E]/10 disabled:opacity-50"
                  />

                  <select
                    value={className}
                    onChange={(event) =>
                      setClassName(
                        event.target.value
                      )
                    }
                    required
                    disabled={savingStudent}
                    className="w-full rounded-lg border border-[#D4D8C8] bg-white px-3 py-2.5 text-xs font-semibold text-[#294A37] outline-none transition focus:border-[#6BA85E] focus:ring-2 focus:ring-[#6BA85E]/10 disabled:opacity-50"
                  >
                    <option
                      value=""
                      disabled
                    >
                      Selecione o ano escolar
                    </option>

                    <option value="1º ano do Ensino Fundamental">
                      1º ano do Ensino Fundamental
                    </option>

                    <option value="2º ano do Ensino Fundamental">
                      2º ano do Ensino Fundamental
                    </option>

                    <option value="3º ano do Ensino Fundamental">
                      3º ano do Ensino Fundamental
                    </option>
                  </select>

                  <button
                    type="submit"
                    disabled={savingStudent}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#2E7547] px-3 py-2.5 text-xs font-black text-white transition hover:bg-[#25613A] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Plus size={15} />

                    {savingStudent
                      ? "Salvando..."
                      : editingStudent
                        ? "Salvar alterações"
                        : "Cadastrar aluno"}
                  </button>

                </form>
              </div>
            )}

            {/* ==================================================
                BUSCA
            ================================================== */}

            <div className="border-b border-[#E7E3D4] p-3">

              <div className="flex items-center gap-2 rounded-lg border border-[#DDDACC] bg-[#F7F5EC] px-3 py-2">

                <Search
                  size={15}
                  className="shrink-0 text-[#77907D]"
                />

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Buscar aluno..."
                  className="min-w-0 flex-1 bg-transparent text-xs font-semibold text-[#294A37] outline-none placeholder:text-[#9BA69C]"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() =>
                      setSearch("")
                    }
                    aria-label="Limpar busca"
                  >
                    <X size={14} />
                  </button>
                )}

              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <select
                  value={classFilter}
                  onChange={(event) => setClassFilter(event.target.value)}
                  aria-label="Filtrar por ano escolar"
                  className="min-w-0 rounded-lg border border-[#DDDACC] bg-[#F7F5EC] px-2 py-2 text-[10px] font-bold text-[#294A37] outline-none"
                >
                  <option value="">Todos os anos</option>
                  {availableClasses.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(event) => setDateFilter(event.target.value)}
                  aria-label="Filtrar por data de cadastro"
                  className="min-w-0 rounded-lg border border-[#DDDACC] bg-[#F7F5EC] px-2 py-2 text-[10px] font-bold text-[#294A37] outline-none"
                />
              </div>
              <button
                type="button"
                onClick={exportCsv}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-[#C9D7C3] bg-white px-3 py-2 text-[10px] font-black text-[#365842] transition hover:bg-[#F0F6EB]"
              >
                <Download size={13} /> Exportar mural filtrado (CSV)
              </button>
            </div>

            {/* ==================================================
                LISTA
            ================================================== */}

            <div className="max-h-[600px] overflow-y-auto p-2.5">

              {loadingStudents ? (
                <div className="px-3 py-8 text-center text-xs font-bold text-[#7C897F]">
                  <Leaf
                    size={18}
                    className="mx-auto mb-2 animate-pulse text-[#6C9363]"
                    fill="currentColor"
                  />

                  Carregando...
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="px-3 py-8 text-center">

                  <div className="mb-2 flex justify-center">
                    <PawPrint
                      size={26}
                      className="text-[#B7C8AF]"
                    />
                  </div>

                  <p className="text-xs font-black text-[#46614F]">
                    {search.trim()
                      ? "Nenhum explorador encontrado"
                      : "Nenhum explorador cadastrado"}
                  </p>

                  <p className="mt-1 text-[10px] font-semibold text-[#89958B]">
                    {search.trim()
                      ? "Tente outro nome."
                      : "Cadastre o primeiro aluno."}
                  </p>

                </div>
              ) : (
                <div className="space-y-1">

                  {filteredStudents.map(
                    (student) => {
                      const selected =
                        selectedId ===
                        student.id;

                      const paws =
                        Number(
                          student.paws
                        ) || 0;

                      return (
                        <div
                          key={student.id}
                          className={`group flex items-center rounded-xl border transition ${
                            selected
                              ? "border-[#BBD5AF] bg-[#EEF6E7]"
                              : "border-transparent hover:bg-[#F8F8F1]"
                          }`}
                        >

                          <button
                            type="button"
                            onClick={() =>
                              setSelectedId(
                                student.id
                              )
                            }
                            className="flex min-w-0 flex-1 items-center gap-2.5 px-2 py-2 text-left"
                          >

                            <span
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                                selected
                                  ? "bg-[#D2E9C5] text-[#28613D]"
                                  : "bg-[#EDF0E7] text-[#52725D]"
                              }`}
                            >
                              <UserRound
                                size={17}
                              />
                            </span>

                            <span className="min-w-0 flex-1">

                              <span className="block truncate text-xs font-black text-[#294A37]">
                                {student.name}
                              </span>

                              <span className="block truncate text-[10px] font-semibold text-[#849087]">
                                {student.className ??
                                  "Sem ano informado"}
                              </span>

                            </span>

                            <span className="flex shrink-0 items-center gap-1 rounded-md bg-[#FFF4D9] px-1.5 py-1 text-[10px] font-black text-[#9A6812]">
                              <PawPrint
                                size={11}
                              />

                              {paws}
                            </span>

                            <ChevronRight
                              size={14}
                              className={
                                selected
                                  ? "text-[#57934E]"
                                  : "text-[#C0C8BF]"
                              }
                            />

                          </button>

                        </div>
                      );
                    }
                  )}

                </div>
              )}

            </div>
          </aside>

          {/* ====================================================
              PAINEL DE DESEMPENHO
          ==================================================== */}

          <section className="min-w-0 overflow-hidden rounded-2xl border border-[#D9D5C2] bg-[#FFFDF5] shadow-[0_6px_20px_rgba(30,70,45,0.06)]">

            {!selectedStudent ? (
              <EmptyPerformance />
            ) : loadingPerformance ? (
              <LoadingPerformance
                name={selectedStudent.name}
              />
            ) : selectedPerformance ? (
              <>

                {/* ==================================================
                    CABEÇALHO
                ================================================== */}

                <div className="border-b border-[#D9E4D3] bg-[#EAF3E2] px-5 py-4">

                  <div className="flex items-center justify-between gap-4">

                    <div className="flex min-w-0 items-center gap-3">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#2E7547] text-white">
                        <UserRound size={22} />
                      </div>

                      <div className="min-w-0">

                        <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#6C9363]">
                          Jornada do explorador
                        </p>

                        <h2 className="truncate text-xl font-black text-[#173B2B]">
                          {
                            selectedPerformance
                              .student.name
                          }
                        </h2>

                        <p className="text-xs font-semibold text-[#718070]">
                          {selectedPerformance
                            .student
                            .className ??
                            "Ano não informado"}
                        </p>

                      </div>
                    </div>

                    <div className="flex items-center gap-2">

                      <button
                        type="button"
                        onClick={() => {
                          if (!selectedStudent) return;
                          setEditingStudent(selectedStudent);
                          setName(selectedStudent.name);
                          setClassName(selectedStudent.className ?? "");
                          setShowForm(true);
                        }}
                        className="flex items-center gap-1 rounded-lg border border-[#C9D7C3] bg-white px-3 py-2 text-[11px] font-black text-[#365842] hover:bg-[#F6F8F1]"
                      >
                        <Edit3 size={14} /> Editar
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (selectedId) {
                            loadPerformance(
                              selectedId
                            );
                          }
                        }}
                        className="rounded-lg border border-[#C9D7C3] bg-white px-3 py-2 text-[11px] font-black text-[#365842] hover:bg-[#F6F8F1]"
                      >
                        Atualizar
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedId(null);
                          setSelectedPerformance(
                            null
                          );
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#C9D7C3] bg-white text-[#718070] hover:bg-[#F6F8F1]"
                        aria-label="Fechar desempenho"
                      >
                        <X size={15} />
                      </button>

                    </div>

                  </div>
                </div>

                {/* ==================================================
                    MÉTRICAS
                ================================================== */}

                <div className="grid grid-cols-2 border-b border-[#E7E3D4] md:grid-cols-4">

                  <CompactMetric
                    icon={
                      <PawPrint size={18} />
                    }
                    label="Patinhas"
                    value={
                      Number(
                        selectedPerformance
                          .student.paws
                      ) || 0
                    }
                  />

                  <CompactMetric
                    icon={
                      <CheckCircle2
                        size={18}
                      />
                    }
                    label="Atividades"
                    value={
                      selectedPerformance
                        .statistics
                        .playedActivitiesCount
                    }
                  />

                  <CompactMetric
                    icon={
                      <CalendarDays
                        size={18}
                      />
                    }
                    label="Sessões"
                    value={
                      selectedPerformance
                        .statistics
                        .sessionsCount
                    }
                  />

                  <CompactMetric
                    icon={
                      <BookOpen
                        size={18}
                      />
                    }
                    label="Trilhas"
                    value={
                      new Set(
                        selectedPerformance.activities.map(
                          (activity) => activity.trail
                        )
                      ).size
                    }
                  />

                </div>

                {/* ==================================================
                    CONTEÚDO
                ================================================== */}

                <div className="p-5">

                  {/* ÚLTIMO ACESSO */}

                  <div className="mb-5 flex items-center justify-between gap-3 rounded-xl bg-[#F7F7EF] px-4 py-3">

                    <div className="flex items-center gap-2.5">

                      <CalendarDays
                        size={17}
                        className="text-[#5E8A58]"
                      />

                      <div>

                        <p className="text-[9px] font-black uppercase tracking-wide text-[#89958B]">
                          Último acesso
                        </p>

                        <p className="text-xs font-black text-[#294A37]">
                          {formatDate(
                            selectedPerformance
                              .student
                              .lastAccess
                          )}
                        </p>

                      </div>

                    </div>

                    <span className="text-[10px] font-bold text-[#8A958C]">
                      Cadastro:{" "}
                      {formatShortDate(
                        selectedPerformance
                          .student
                          .createdAt
                      )}
                    </span>

                  </div>

                  {/* ==================================================
                      ATIVIDADES
                  ================================================== */}

                  <CompactSection
                    icon={
                      <CheckCircle2
                        size={17}
                      />
                    }
                    title="Atividades jogadas"
                    description="Explorações registradas na trilha"
                  >

                    {selectedPerformance
                      .activities.length ===
                    0 ? (
                          <CompactEmpty text="Nenhuma atividade jogada ainda." />
                    ) : (
                      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">

                        {selectedPerformance.activities.map(
                          (activity) => (
                            <div
                              key={activity.id}
                              className="flex min-w-0 items-center gap-2 rounded-xl border border-[#E2E5D9] bg-white px-3 py-2.5"
                            >

                              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E6F1DF] text-[#397348]">
                                <CheckCircle2
                                  size={15}
                                />
                              </span>

                              <div className="min-w-0">

                                <p className="truncate text-xs font-black text-[#294A37]">
                                  {activity.name}
                                </p>

                                <p className="truncate text-[9px] font-semibold text-[#89958B]">
                                  {activity.trail}
                                </p>

                              </div>

                            </div>
                          )
                        )}

                      </div>
                    )}

                  </CompactSection>

                  {/* ==================================================
                      SESSÕES
                  ================================================== */}

                  <CompactSection
                    icon={
                      <CalendarDays
                        size={17}
                      />
                    }
                    title="Sessões"
                    description="Histórico de explorações"
                  >

                    {selectedPerformance
                      .sessions.length ===
                    0 ? (
                      <CompactEmpty text="Nenhuma sessão registrada ainda." />
                    ) : (
                      <div className="space-y-1.5">

                        {selectedPerformance.sessions.map(
                          (session) => (
                            <div
                              key={session.id}
                              className="flex items-center justify-between gap-3 rounded-xl border border-[#E2E5D9] bg-white px-3 py-2"
                            >

                              <div className="flex min-w-0 items-center gap-2">

                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#EEF1E9] text-[#58715E]">
                                  <CalendarDays
                                    size={14}
                                  />
                                </span>

                                <div className="min-w-0">

                                  <p className="text-[11px] font-black text-[#294A37]">
                                    Sessão #
                                    {
                                      session.id
                                    }
                                  </p>

                                  <p className="truncate text-[9px] font-semibold text-[#89958B]">
                                    {formatDate(
                                      session.started_at
                                    )}
                                  </p>

                                </div>

                              </div>

                              <span className="flex shrink-0 items-center gap-1 rounded-md bg-[#FFF4D9] px-2 py-1 text-[10px] font-black text-[#9A6812]">
                                <PawPrint
                                  size={11}
                                />

                                {Number(
                                  session.paws
                                ) || 0}
                              </span>

                            </div>
                          )
                        )}

                      </div>
                    )}

                  </CompactSection>

                  {/* ==================================================
                      EXCLUSÃO
                  ================================================== */}

                  <div className="mt-5 flex justify-end border-t border-[#E7E3D4] pt-4">

                    <button
                      type="button"
                      disabled={
                        deletingStudent
                      }
                      onClick={() =>
                        handleDeleteStudent(
                          selectedPerformance.student
                        )
                      }
                      className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[11px] font-black text-red-700 hover:bg-red-100 disabled:opacity-50"
                    >
                      <Trash2 size={14} />

                      {deletingStudent
                        ? "Excluindo..."
                        : "Excluir explorador"}
                    </button>

                  </div>

                </div>
              </>
            ) : (
              <EmptyPerformance />
            )}

          </section>
        </section>

        {/* ======================================================
            RODAPÉ
        ====================================================== */}

        <footer className="flex items-center justify-center gap-2 py-4 text-[10px] font-semibold text-[#89958B]">

          <Leaf
            size={11}
            className="text-[#6B9A60]"
            fill="currentColor"
          />

          Dados dos alunos armazenados no MySQL
          através da API.

        </footer>

      </div>
    </main>
  );
}

/* ================================================================
   CARD DE RESUMO
================================================================ */

function CompactSummary({
  icon,
  label,
  value,
  description,
  type,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  description: string;
  type: "green" | "orange" | "cream";
}) {
  const styles = {
    green:
      "bg-[#EAF3E2] border-[#C8DDBE]",
    orange:
      "bg-[#FFF5DC] border-[#EBD8A9]",
    cream:
      "bg-[#FFFDF5] border-[#DDD9C8]",
  };

  return (
    <div
      className={`flex items-center justify-between rounded-xl border px-4 py-3 ${styles[type]}`}
    >

      <div>

        <p className="text-[9px] font-black uppercase tracking-wide text-[#708070]">
          {label}
        </p>

        <div className="flex items-baseline gap-1.5">

          <strong className="text-2xl font-black text-[#294A37]">
            {value}
          </strong>

          <span className="text-[9px] font-bold text-[#849087]">
            {description}
          </span>

        </div>

      </div>

      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/70 text-[#397348]">
        {icon}
      </div>

    </div>
  );
}

/* ================================================================
   MÉTRICA DO ALUNO
================================================================ */

function CompactMetric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-2 border-b border-[#E7E3D4] px-4 py-3 md:border-b-0 md:border-r">

      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EEF3E9] text-[#4E7655]">
        {icon}
      </div>

      <div>

        <p className="text-[9px] font-black uppercase tracking-wide text-[#89958B]">
          {label}
        </p>

        <strong className="block text-lg font-black leading-tight text-[#294A37]">
          {value}
        </strong>

      </div>

    </div>
  );
}

/* ================================================================
   SEÇÃO COMPACTA
================================================================ */

function CompactSection({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-5">

      <div className="mb-2.5 flex items-center gap-2.5">

        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E6F0DF] text-[#397348]">
          {icon}
        </div>

        <div>

          <h3 className="text-sm font-black text-[#294A37]">
            {title}
          </h3>

          <p className="text-[9px] font-semibold text-[#89958B]">
            {description}
          </p>

        </div>

      </div>

      {children}

    </section>
  );
}

/* ================================================================
   ESTADO VAZIO
================================================================ */

function CompactEmpty({
  text,
}: {
  text: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-[#D8DCCF] bg-[#FAFAF4] px-4 py-5 text-center text-[10px] font-bold text-[#89958B]">
      <Leaf
        size={14}
        className="mx-auto mb-1.5 text-[#7FA374]"
        fill="currentColor"
      />

      {text}
    </div>
  );
}

/* ================================================================
   SEM ALUNO SELECIONADO
================================================================ */

function EmptyPerformance() {
  return (
    <div className="flex min-h-[500px] flex-col items-center justify-center px-5 text-center">

      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EAF3E2] text-[#5E8A58]">
        <BookOpen size={30} />
      </div>

      <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#6C9363]">
        Jornada do explorador
      </p>

      <h2 className="mt-1 text-xl font-black text-[#294A37]">
        Selecione um explorador
      </h2>

      <p className="mt-1 max-w-sm text-xs font-semibold text-[#7C897F]">
        Escolha um aluno no mural para
        visualizar suas atividades,
        patinhas e sessões.
      </p>

    </div>
  );
}

/* ================================================================
   CARREGANDO
================================================================ */

function LoadingPerformance({
  name,
}: {
  name: string;
}) {
  return (
    <div className="flex min-h-[500px] flex-col items-center justify-center px-5 text-center">

      <div className="mb-4 flex h-16 w-16 animate-pulse items-center justify-center rounded-2xl bg-[#EAF3E2] text-[#5E8A58]">
        <Leaf
          size={30}
          fill="currentColor"
        />
      </div>

      <h2 className="text-lg font-black text-[#294A37]">
        Carregando jornada...
      </h2>

      <p className="mt-1 text-xs font-semibold text-[#7C897F]">
        Buscando os dados de {name}.
      </p>

    </div>
  );
}
