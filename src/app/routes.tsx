import { lazy, type ComponentType } from "react";
import { createBrowserRouter, Navigate } from "react-router";
import { useGame } from "./components/GameContext";

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

function ProtectedGame({ Component }: { Component: ComponentType }) {
  const { state } = useGame();
  if (!state.studentId) return <Navigate to="/" replace />;
  return <Component />;
}

const guarded = (Component: ComponentType) => (
  <ProtectedGame Component={Component} />
);

export const router = createBrowserRouter([
  { path: "/", Component: Home },
  { path: "/professor", Component: TeacherArea },
  { path: "/portuguese", element: guarded(PortugueseGame) },
  { path: "/syllable-match", element: guarded(SyllableMatchGame) },
  { path: "/rhymes", element: guarded(RhymesGame) },
  { path: "/math/addition", element: guarded(AdditionGame) },
  { path: "/math/subtraction", element: guarded(SubtractionGame) },
  { path: "/math/counting", element: guarded(CountingGame) },
]);
