import React, { useMemo, useState } from "react";
import { Link } from "react-router";
import {
  ArrowLeft,
  BookOpen,
  ClipboardList,
  GraduationCap,
  Plus,
  Search,
  Star,
  Trash2,
  UserRound,
  Users,
  X,
} from "lucide-react";

type Student = {
  id: string;
  name: string;
  className: string;
  createdAt: string;
  stars: number;
  completedActivities: number;
  trailsCompleted: string[];
  lastAccess: string | null;
};

type StudentPerformance = {
  id: string;
  studentId: string;
  studentName: string;
  stars: number;
  completedActivities: string[];
  trailsCompleted: string[];
  lastAccess: string;
};

const STUDENTS_KEY = "trilha_aprender_students";
const PERFORMANCE_KEY = "trilha_aprender_performance";

const TRAIL_NAMES: Record<string, string> = {
  portuguese: "Forme a Palavra",
  "syllable-match": "Sílaba Inicial",
  rhymes: "Rimas",
  addition: "Adição",
  subtraction: "Subtração",
  counting: "Contagem",
};

function createId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function readStorage<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function formatDate(value: string | null) {
  if (!value) return "Ainda não jogou";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Data não disponível"
    : date.toLocaleString("pt-BR");
}

function normalize(value: string) {
  return value.trim().toLocaleLowerCase("pt-BR");
}

export default function TeacherArea() {
  const [students, setStudents] = useState<Student[]>(() =>
    readStorage<Student[]>(STUDENTS_KEY, [])
  );
  const [performance, setPerformance] = useState<StudentPerformance[]>(() =>
    readStorage<StudentPerformance[]>(PERFORMANCE_KEY, [])
  );
  const [name, setName] = useState("");
  const [className, setClassName] = useState("");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const saveStudents = (items: Student[]) => {
    setStudents(items);
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(items));
  };

  const savePerformance = (items: StudentPerformance[]) => {
    setPerformance(items);
    localStorage.setItem(PERFORMANCE_KEY, JSON.stringify(items));
  };

  const studentsWithPerformance = useMemo(
    () =>
      students.map((student) => {
        const result = performance.find(
          (item) => item.studentId === student.id
        );
        return result
          ? {
              ...student,
              stars: result.stars,
              completedActivities: result.completedActivities.length,
              trailsCompleted: result.trailsCompleted,
              lastAccess: result.lastAccess,
            }
          : student;
      }),
    [students, performance]
  );

  const filteredStudents = useMemo(() => {
    const term = normalize(search);
    if (!term) return studentsWithPerformance;
    return studentsWithPerformance.filter((student) =>
      normalize(`${student.name} ${student.className}`).includes(term)
    );
  }, [search, studentsWithPerformance]);

  const selectedStudent = studentsWithPerformance.find(
    (student) => student.id === selectedId
  );
  const selectedPerformance = performance.find(
    (item) => item.studentId === selectedId
  );

  const totalStars = studentsWithPerformance.reduce(
    (sum, student) => sum + student.stars,
    0
  );
  const totalActivities = studentsWithPerformance.reduce(
    (sum, student) => sum + student.completedActivities,
    0
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanName = name.trim();
    const cleanClass = className.trim() || "Turma não informada";

    if (cleanName.length < 2) {
      setError("Digite um nome com pelo menos 2 caracteres.");
      return;
    }

    const exists = students.some(
      (student) =>
        normalize(student.name) === normalize(cleanName) &&
        normalize(student.className) === normalize(cleanClass)
    );

    if (exists) {
      setError("Este aluno já está cadastrado nesta turma.");
      return;
    }

    const student: Student = {
      id: createId(),
      name: cleanName,
      className: cleanClass,
      createdAt: new Date().toISOString(),
      stars: 0,
      completedActivities: 0,
      trailsCompleted: [],
      lastAccess: null,
    };

    saveStudents([student, ...students]);
    setName("");
    setClassName("");
    setError("");
    setShowForm(false);
    setSelectedId(student.id);
  }

  function deleteStudent(student: Student) {
    if (!window.confirm(`Excluir o cadastro de ${student.name}?`)) return;
    saveStudents(students.filter((item) => item.id !== student.id));
    savePerformance(
      performance.filter((item) => item.studentId !== student.id)
    );
    if (selectedId === student.id) setSelectedId(null);
  }

  function clearAll() {
    if (!window.confirm("Apagar todos os alunos e desempenhos?")) return;
    saveStudents([]);
    savePerformance([]);
    setSelectedId(null);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0d3d28] via-[#0b4a2e] to-[#052e1c] px-4 py-6 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[#f6a623] p-3 text-[#052e1c]">
              <GraduationCap size={30} />
            </div>
            <div>
              <h1 className="text-3xl font-black sm:text-5xl">Área do Professor</h1>
              <p className="text-sm text-[#cde7d5] sm:text-base">
                Cadastre alunos e acompanhe o desempenho nas trilhas.
              </p>
            </div>
          </div>
          <Link
            to="/"
            className="flex items-center gap-2 rounded-xl border-2 border-[#a9713f] bg-[#6b3f22] px-4 py-3 font-black transition hover:bg-[#7c4a28]"
          >
            <ArrowLeft size={18} /> Voltar
          </Link>
        </header>

        <section className="mb-8 grid gap-4 sm:grid-cols-3">
          <Summary icon={<Users />} label="Alunos cadastrados" value={students.length} />
          <Summary icon={<Star fill="currentColor" />} label="Estrelas conquistadas" value={totalStars} />
          <Summary icon={<ClipboardList />} label="Atividades concluídas" value={totalActivities} />
        </section>

        <section className="grid items-start gap-6 lg:grid-cols-[340px_1fr]">
          <aside className="rounded-3xl border-2 border-[#35b35b]/40 bg-[#052e1c]/90 p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-2xl font-black">Alunos</h2>
              <button
                type="button"
                onClick={() => {
                  setShowForm((value) => !value);
                  setError("");
                }}
                className="rounded-xl bg-[#57b85b] p-3 text-[#052e1c]"
                aria-label="Cadastrar aluno"
              >
                {showForm ? <X size={20} /> : <Plus size={20} />}
              </button>
            </div>

            {showForm && (
              <form onSubmit={handleSubmit} className="mb-5 rounded-2xl bg-white/10 p-4">
                <label htmlFor="student-name" className="mb-2 block text-sm font-bold">Nome do aluno</label>
                <input
                  id="student-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Nome completo"
                  required
                  maxLength={80}
                  className="mb-3 w-full rounded-xl border-2 border-[#35b35b]/40 bg-[#052e1c] px-3 py-3 text-white outline-none focus:border-[#f6a623]"
                />
                <label htmlFor="student-class" className="mb-2 block text-sm font-bold">Turma</label>
                <input
                  id="student-class"
                  value={className}
                  onChange={(event) => setClassName(event.target.value)}
                  placeholder="Ex.: 3º ano A"
                  maxLength={40}
                  className="mb-3 w-full rounded-xl border-2 border-[#35b35b]/40 bg-[#052e1c] px-3 py-3 text-white outline-none focus:border-[#f6a623]"
                />
                {error && <p className="mb-3 text-sm font-bold text-red-300">{error}</p>}
                <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#f6a623] px-4 py-3 font-black text-[#052e1c]">
                  <Plus size={18} /> Salvar aluno
                </button>
              </form>
            )}

            <div className="mb-4 flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2">
              <Search size={18} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar aluno ou turma"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-white/50"
              />
            </div>

            {filteredStudents.length === 0 ? (
              <p className="rounded-2xl bg-white/10 p-5 text-center text-sm text-[#cde7d5]">Nenhum aluno encontrado.</p>
            ) : (
              <div className="max-h-[520px] space-y-2 overflow-y-auto">
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className={`flex items-center gap-2 rounded-2xl border-2 p-3 ${selectedId === student.id ? "border-[#f6a623] bg-[#f6a623]/20" : "border-transparent bg-white/10"}`}
                  >
                    <button type="button" onClick={() => setSelectedId(student.id)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                      <span className="rounded-full bg-[#57b85b] p-2 text-[#052e1c]"><UserRound size={20} /></span>
                      <span className="min-w-0">
                        <span className="block truncate font-black">{student.name}</span>
                        <span className="block truncate text-xs text-[#cde7d5]">{student.className}</span>
                      </span>
                    </button>
                    <span className="shrink-0 text-sm font-black text-[#f6a623]">⭐ {student.stars}</span>
                  </div>
                ))}
              </div>
            )}

            {students.length > 0 && (
              <button type="button" onClick={clearAll} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/20 px-4 py-3 text-sm font-bold text-red-200">
                <Trash2 size={17} /> Apagar todos
              </button>
            )}
          </aside>

          <section className="rounded-3xl border-2 border-[#35b35b]/40 bg-[#052e1c]/90 p-6 shadow-xl">
            {!selectedStudent ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                <BookOpen size={64} className="mb-5 text-[#57b85b]" />
                <h2 className="mb-3 text-3xl font-black">Selecione um aluno</h2>
                <p className="max-w-md text-[#cde7d5]">Escolha um cadastro para visualizar estrelas, atividades e trilhas realizadas.</p>
              </div>
            ) : (
              <>
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <p className="mb-1 text-sm font-black uppercase tracking-wider text-[#f6a623]">Desempenho individual</p>
                    <h2 className="text-3xl font-black">{selectedStudent.name}</h2>
                    <p className="text-[#cde7d5]">Turma: {selectedStudent.className}</p>
                  </div>
                  <button type="button" onClick={() => setSelectedId(null)} className="rounded-full bg-white/10 p-2" aria-label="Fechar desempenho"><X size={20} /></button>
                </div>

                <div className="mb-6 grid gap-4 sm:grid-cols-3">
                  <Metric icon={<Star fill="currentColor" />} label="Estrelas" value={selectedStudent.stars} />
                  <Metric icon={<ClipboardList />} label="Atividades" value={selectedStudent.completedActivities} />
                  <Metric icon={<UserRound />} label="Último acesso" value={formatDate(selectedStudent.lastAccess)} />
                </div>

                <InfoBlock title="Trilhas realizadas">
                  {selectedStudent.trailsCompleted.length === 0 ? (
                    <p className="text-[#cde7d5]">Nenhuma trilha concluída.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {selectedStudent.trailsCompleted.map((trail) => (
                        <span key={trail} className="rounded-full bg-[#57b85b]/20 px-4 py-2 text-sm font-bold text-[#cde7d5]">{TRAIL_NAMES[trail] ?? trail}</span>
                      ))}
                    </div>
                  )}
                </InfoBlock>

                <InfoBlock title="Atividades concluídas">
                  {selectedPerformance?.completedActivities.length ? (
                    <ul className="space-y-2">
                      {selectedPerformance.completedActivities.map((activity) => (
                        <li key={activity} className="rounded-xl bg-white/10 px-4 py-3 text-sm text-[#cde7d5]">{activity}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[#cde7d5]">Nenhuma atividade registrada.</p>
                  )}
                </InfoBlock>

                <button type="button" onClick={() => deleteStudent(selectedStudent)} className="mt-6 flex items-center gap-2 rounded-xl bg-red-500/20 px-4 py-3 font-bold text-red-200">
                  <Trash2 size={18} /> Excluir aluno
                </button>
              </>
            )}
          </section>
        </section>

        <p className="mt-6 text-center text-xs text-[#cde7d5]/70">Esta versão usa localStorage. Para vários computadores, conecte a área docente a uma API e a um banco de dados.</p>
      </div>
    </main>
  );
}

function Summary({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-3xl border-2 border-[#35b35b]/40 bg-[#052e1c]/80 p-5">
      <div className="mb-3 flex items-center gap-3 text-[#cde7d5]">{icon}<span className="font-bold">{label}</span></div>
      <strong className="text-4xl font-black">{value}</strong>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white/10 p-5">
      <div className="mb-3 text-[#f6a623]">{icon}</div>
      <p className="text-sm text-[#cde7d5]">{label}</p>
      <strong className="text-2xl font-black">{value}</strong>
    </div>
  );
}

function InfoBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 rounded-2xl bg-white/10 p-5">
      <h3 className="mb-4 text-xl font-black">{title}</h3>
      {children}
    </div>
  );
}
