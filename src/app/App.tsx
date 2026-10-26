import { Suspense } from "react";
import { RouterProvider } from "react-router/dom";
import { Toaster } from "sonner";

import { router } from "./routes";
import { GameProvider } from "./components/GameContext";
import { AppErrorBoundary } from "./components/AppErrorBoundary";

export default function App() {
  return (
    <AppErrorBoundary>
      <GameProvider>
        <Suspense
          fallback={
            <div className="forest-scene flex min-h-screen items-center justify-center text-xl font-black text-white">
              Explorando a floresta...
            </div>
          }
        >
          <RouterProvider router={router} />
        </Suspense>
        <Toaster
          position="top-center"
          richColors
          closeButton
          toastOptions={{
            duration: 1800,
            style: {
              fontFamily: "var(--font-body)",
              fontWeight: 800,
              borderRadius: "1rem",
            },
          }}
        />
      </GameProvider>
    </AppErrorBoundary>
  );
}
