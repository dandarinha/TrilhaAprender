import { RouterProvider } from "react-router/dom";

import { router } from "./routes";
import { GameProvider } from "./components/GameContext";

export default function App() {
  return (
    <GameProvider>
      <RouterProvider router={router} />
    </GameProvider>
  );
}