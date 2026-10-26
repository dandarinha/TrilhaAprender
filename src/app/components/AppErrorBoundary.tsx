import React from "react";

type Props = { children: React.ReactNode };
type State = { hasError: boolean };

export class AppErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("Erro inesperado na aplicação:", error);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="forest-scene flex min-h-screen items-center justify-center px-5 py-8 text-center">
        <section className="max-w-md rounded-3xl border-4 border-[#FF9A5C] bg-[#FFF4E8] p-6 text-black shadow-[0_8px_0_rgba(11,77,43,.25)]">
          <div className="mb-2 text-5xl" aria-hidden="true">🌿</div>
          <h1 className="mb-2 text-2xl font-black text-[#0B4D2B]">
            A trilha precisa ser recarregada
          </h1>
          <p className="mb-5 text-sm font-semibold leading-relaxed">
            O navegador não conseguiu carregar uma parte do jogo. Tente novamente; seu progresso salvo no banco não será apagado.
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            className="min-h-11 w-full rounded-2xl border-2 border-[#B9270A] bg-[#FF9A5C] px-5 py-3 font-black text-black"
          >
            Recarregar o jogo
          </button>
        </section>
      </main>
    );
  }
}
