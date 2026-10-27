import { CheckCircle2, Clock3, Target, TrendingUp, XCircle } from "lucide-react";
import type { ReactNode } from "react";

type InsightSession = {
  id: number;
  started_at: string;
  accuracy: number;
  correct_answers: number;
  wrong_answers: number;
  duration_seconds: number;
  end_reason: string | null;
};

type TeacherInsightsProps = {
  correct: number;
  wrong: number;
  accuracy: number;
  durationSeconds: number;
  sessions: InsightSession[];
  completedSessions: number;
  abandonedSessions: number;
  gameOverSessions: number;
  bestAccuracy: number;
  recentAccuracy: number;
};

function formatDuration(totalSeconds: number) {
  const seconds = Math.max(0, Math.round(totalSeconds || 0));
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return minutes ? `${minutes}min ${remainder}s` : `${remainder}s`;
}

function formatDay(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

export default function TeacherInsights({ correct, wrong, accuracy, durationSeconds, sessions, completedSessions, abandonedSessions, gameOverSessions, bestAccuracy, recentAccuracy }: TeacherInsightsProps) {
  const total = correct + wrong;
  const orderedSessions = [...sessions].reverse().slice(-8);
  const maxAnswers = Math.max(1, ...orderedSessions.map((session) => Number(session.correct_answers || 0) + Number(session.wrong_answers || 0)));
  const totalSessionOutcomes = completedSessions + abandonedSessions + gameOverSessions;
  const completionRate = totalSessionOutcomes === 0 ? 0 : Math.round((completedSessions / totalSessionOutcomes) * 100);
  const accuracyDelta = recentAccuracy - accuracy;

  return (
    <section className="border-b border-[#EBD8C8] bg-[#FFFEF8] px-5 py-4 text-[#000000]">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-black text-[#173C2A]">Análise da aprendizagem</h3>
          <p className="text-[10px] font-semibold text-[#38503F]">Respostas, evolução recente e como as partidas terminaram</p>
        </div>
        <span className="rounded-full bg-[#E6F1DF] px-2.5 py-1 text-[10px] font-black text-[#173C2A]">{total} respostas analisadas</span>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <InsightCard icon={<CheckCircle2 size={16} />} label="Acertos" value={correct} tone="green" />
        <InsightCard icon={<XCircle size={16} />} label="Erros" value={wrong} tone="red" />
        <InsightCard icon={<Target size={16} />} label="Precisão" value={`${accuracy}%`} tone="orange" />
        <InsightCard icon={<Clock3 size={16} />} label="Tempo total" value={formatDuration(durationSeconds)} tone="blue" />
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-[1.25fr_.75fr]">
        <div className="rounded-xl border border-[#D9E4D3] bg-[#F5FAF1] p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div><h4 className="text-xs font-black text-[#173C2A]">Evolução por partida</h4><p className="text-[10px] font-semibold text-[#38503F]">Precisão e volume das últimas partidas</p></div>
            <TrendingUp size={17} className="text-[#397348]" aria-hidden="true" />
          </div>
          {orderedSessions.length === 0 ? (
            <p className="py-4 text-center text-xs font-semibold text-[#38503F]">Ainda não há partidas suficientes para mostrar evolução.</p>
          ) : (
            <div className="flex h-28 items-end gap-1.5 sm:gap-2" aria-label="Gráfico de evolução das últimas partidas">
              {orderedSessions.map((session, index) => {
                const answers = Number(session.correct_answers || 0) + Number(session.wrong_answers || 0);
                const height = Math.max(8, Math.round((answers / maxAnswers) * 72));
                const accuracyHeight = Math.max(4, Math.round((Number(session.accuracy || 0) / 100) * 72));
                return <div key={session.id} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-1"><span className="text-[9px] font-black text-[#173C2A]">{Number(session.accuracy || 0)}%</span><div className="relative flex h-[72px] w-full max-w-8 items-end justify-center rounded-t-md bg-[#DCEBDD]" title={`${formatDay(session.started_at)} — ${session.accuracy}% de precisão`}><div className="absolute bottom-0 w-2/3 rounded-t-md bg-[#397348]" style={{ height: `${accuracyHeight}px` }} /><div className="absolute bottom-0 left-0.5 w-1 rounded-t bg-[#FF9A5C]" style={{ height: `${height}px` }} /></div><span className="text-[9px] font-bold text-[#38503F]">{index + 1}</span></div>;
              })}
            </div>
          )}
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[9px] font-bold text-[#38503F]"><span><i className="mr-1 inline-block h-2 w-2 rounded-sm bg-[#397348]" />Precisão</span><span><i className="mr-1 inline-block h-2 w-2 rounded-sm bg-[#FF9A5C]" />Respostas</span></div>
        </div>

        <div className="rounded-xl border border-[#EBD8C8] bg-[#FFF9ED] p-3">
          <h4 className="text-xs font-black text-[#173C2A]">Indicadores de progresso</h4>
          <div className="mt-2 grid grid-cols-2 gap-2"><MiniIndicator label="Melhor precisão" value={`${bestAccuracy}%`} /><MiniIndicator label="Últimas partidas" value={`${recentAccuracy}%`} /><MiniIndicator label="Conclusão" value={`${completionRate}%`} /><MiniIndicator label="Sessões" value={sessions.length} /></div>
          <p className={`mt-3 rounded-lg px-2 py-1.5 text-[10px] font-black ${accuracyDelta >= 0 ? "bg-[#E6F1DF] text-[#173C2A]" : "bg-[#FCEDEA] text-[#7A200F]"}`}>{accuracyDelta >= 0 ? "Tendência positiva" : "Atenção à retomada"} · {accuracyDelta >= 0 ? "+" : ""}{accuracyDelta} pontos contra a média geral</p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2"><Outcome label="Concluídas" value={completedSessions} tone="green" /><Outcome label="Game over" value={gameOverSessions} tone="red" /><Outcome label="Saída/navegação" value={abandonedSessions} tone="orange" /></div>
    </section>
  );
}

function InsightCard({ icon, label, value, tone }: { icon: ReactNode; label: string; value: number | string; tone: "green" | "red" | "orange" | "blue" }) {
  const styles = { green: "bg-[#EAF5E4] text-[#397348]", red: "bg-[#FCEDEA] text-[#A64235]", orange: "bg-[#FFF4D9] text-[#9A6812]", blue: "bg-[#EAF2F4] text-[#356879]" };
  return <div className={`rounded-xl px-3 py-2.5 ${styles[tone]}`}><div className="flex items-center gap-1.5 text-current">{icon}<span className="text-[9px] font-black uppercase tracking-wide">{label}</span></div><strong className="mt-1 block text-lg font-black text-[#173C2A]">{value}</strong></div>;
}
function MiniIndicator({ label, value }: { label: string; value: number | string }) { return <div className="rounded-lg bg-white px-2 py-2"><span className="block text-[9px] font-bold text-[#38503F]">{label}</span><strong className="block text-sm font-black text-[#173C2A]">{value}</strong></div>; }
function Outcome({ label, value, tone }: { label: string; value: number; tone: "green" | "red" | "orange" }) { const styles = { green: "border-[#B9D7AE] bg-[#F1F8ED]", red: "border-[#E8C5BC] bg-[#FFF4F1]", orange: "border-[#E9D09A] bg-[#FFFAEE]" }; return <div className={`rounded-lg border px-2 py-2 ${styles[tone]}`}><span className="block text-[9px] font-bold text-[#38503F]">{label}</span><strong className="text-base font-black text-[#173C2A]">{value}</strong></div>; }
