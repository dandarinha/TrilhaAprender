import { useContext } from "react";
import { X, Trash2, Award, Calendar } from "lucide-react";

import { GameContext } from "./GameContext";
import type { PlayerHistory } from "./GameContext";

type HistoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function HistoryModal({
  isOpen,
  onClose,
}: HistoryModalProps) {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error(
      "HistoryModal deve ser utilizado dentro de GameProvider."
    );
  }

  const { history, clearHistory } = context;

  if (!isOpen) {
    return null;
  }

  const handleClearHistory = () => {
    const confirmed = window.confirm(
      "Deseja apagar todo o histórico de recordes?"
    );

    if (confirmed) {
      clearHistory();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="history-modal-title"
    >
      <div className="flex max-h-[85vh] w-full max-w-md flex-col rounded-3xl border-4 border-slate-700 bg-slate-900 p-6 shadow-2xl">
        {/* Cabeçalho */}
        <div className="mb-4 flex items-center justify-between border-b-2 border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-[#bfe0ff]">
            <Award className="h-6 w-6 text-amber-400" />

            <h2
              id="history-modal-title"
              className="text-xl font-black uppercase tracking-wider"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Recordes da Floresta
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar histórico"
            className="rounded-xl p-1 text-zinc-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Lista de jogadores */}
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="flex flex-col gap-2.5">
            {history.length === 0 ? (
              <div className="py-8 text-center font-bold text-zinc-500">
                Nenhuma aventura registrada ainda! 🌿
              </div>
            ) : (
              history.map((player: PlayerHistory) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/60 p-3"
                >
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="truncate text-base font-black uppercase tracking-wide text-emerald-400">
                      {player.name}
                    </span>

                    <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {player.date}
                      </span>

                      <span>
                        🌳 Atividades: {player.completedCount}
                      </span>
                    </div>
                  </div>

                  <div className="ml-3 shrink-0 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-right">
                    <span className="text-lg font-black text-amber-400">
                      ⭐ {player.stars}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Rodapé */}
        <div className="mt-4 flex items-center justify-between border-t-2 border-slate-800 pt-3">
          <span className="text-xs font-bold text-zinc-500">
            {history.length}{" "}
            {history.length === 1 ? "jogador registrado" : "jogadores registrados"}
          </span>

          {history.length > 0 && (
            <button
              type="button"
              onClick={handleClearHistory}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-rose-400 transition-colors hover:bg-rose-500/10 hover:text-rose-300"
            >
              <Trash2 className="h-4 w-4" />
              Apagar Tudo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/*
  Exportação nomeada opcional.
  Assim, os dois imports funcionam:

  import HistoryModal from "./HistoryModal";

  ou:

  import { HistoryModal } from "./HistoryModal";
*/
export { HistoryModal };