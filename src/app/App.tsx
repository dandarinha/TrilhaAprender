import { RouterProvider } from "react-router/dom";
import { Toaster } from "sonner";

import { router } from "./routes";
import { GameProvider } from "./components/GameContext";

export default function App() {
  return (
    <GameProvider>
      <RouterProvider router={router} />
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
  );
}
