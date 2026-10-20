import { lazy } from "react";
import { createBrowserRouter } from "react-router";

const Home = lazy(() => import("./components/Home"));
const TeacherArea = lazy(() => import("./components/TeacherArea"));
const PortugueseGame = lazy(() => import("./components/PortugueseGame"));
const SyllableMatchGame = lazy(() => import("./components/SyllableMatchGame"));
const RhymesGame = lazy(() => import("./components/RhymesGame"));
const AdditionGame = lazy(async () => {
  const module = await import("./components/MathGame");
  return { default: module.AdditionGame };
});
const SubtractionGame = lazy(async () => {
  const module = await import("./components/MathGame");
  return { default: module.SubtractionGame };
});
const CountingGame = lazy(async () => {
  const module = await import("./components/MathGame");
  return { default: module.CountingGame };
});

export const router = createBrowserRouter([
  { path: "/", Component: Home },
  { path: "/professor", Component: TeacherArea },
  { path: "/portuguese", Component: PortugueseGame },
  { path: "/syllable-match", Component: SyllableMatchGame },
  { path: "/rhymes", Component: RhymesGame },
  { path: "/math/addition", Component: AdditionGame },
  { path: "/math/subtraction", Component: SubtractionGame },
  { path: "/math/counting", Component: CountingGame },
]);
