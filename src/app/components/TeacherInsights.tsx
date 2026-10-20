import { CheckCircle2, Clock3, Target, XCircle } from "lucide-react";
import type { ReactNode } from "react";

type TeacherInsightsProps = {
  correct: number;
  wrong: number;
  accuracy: number;
  durationSeconds: number;
};

function formatDuration(totalSeconds: number) {
  const seconds = Math.max(0, Math.round(totalSeconds || 0));
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return minutes ? `${minutes}min ${remainder}s` : `${remainder}s`;
}

export default function TeacherInsights({
  correct,
  wrong,
  accuracy,
  durationSeconds,
}: TeacherInsightsProps) {
  const total = correct + wrong;
  return (
    <section className="border-b border-[#EBD8C8] bg-[#FFFEF8] px-5 py-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-black text-[#173C2A]">Evolução pedagógica</h3>
          <p className="text-[10px] font-semibold text-[#526A5A]">Resumo das respostas registradas nas partidas</p>
        </div>
        <span className="rounded-full bg-[#E6F1DF] px-2.5 py-1 text-[10px] font-black text-[#397348]">
          {total} respostas
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <InsightCard icon={<CheckCircle2 size={16} />} label="Acertos" value={correct} tone="green" />
        <InsightCard icon={<XCircle size={16} />} label="Erros" value={wrong} tone="red" />
        <InsightCard icon={<Target size={16} />} label="Precisão média" value={`${accuracy}%`} tone="orange" />
        <InsightCard icon={<Clock3 size={16} />} label="Tempo total" value={formatDuration(durationSeconds)} tone="blue" />
      </div>
    </section>
  );
}

function InsightCard({ icon, label, value, tone }: { icon: ReactNode; label: string; value: number | string; tone: "green" | "red" | "orange" | "blue" }) {
  const styles = {
    green: "bg-[#EAF5E4] text-[#397348]",
    red: "bg-[#FCEDEA] text-[#A64235]",
    orange: "bg-[#FFF4D9] text-[#9A6812]",
    blue: "bg-[#EAF2F4] text-[#356879]",
  };
  return (
    <div className={`rounded-xl px-3 py-2.5 ${styles[tone]}`}>
      <div className="flex items-center gap-1.5 text-current">{icon}<span className="text-[9px] font-black uppercase tracking-wide">{label}</span></div>
      <strong className="mt-1 block text-lg font-black text-[#173C2A]">{value}</strong>
    </div>
  );
}
