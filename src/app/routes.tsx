import { createBrowserRouter } from "react-router";

import Home from "./components/Home";
import PortugueseGame from "./components/PortugueseGame";
import {
  AdditionGame,
  SubtractionGame,
  CountingGame,
} from "./components/MathGame";
import SyllableMatchGame from "./components/SyllableMatchGame";
import RhymesGame from "./components/RhymesGame";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/portuguese",
    Component: PortugueseGame,
  },
  {
    path: "/syllable-match",
    Component: SyllableMatchGame,
  },
  {
    path: "/rhymes",
    Component: RhymesGame,
  },
  {
    path: "/math/addition",
    Component: AdditionGame,
  },
  {
    path: "/math/subtraction",
    Component: SubtractionGame,
  },
  {
    path: "/math/counting",
    Component: CountingGame,
  },
]);