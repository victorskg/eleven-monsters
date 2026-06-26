import { lazy, Suspense } from "react";
import { Analytics } from "@vercel/analytics/react";
import { useGameStore } from "./stores/gameStore";

const HomePage = lazy(() => import("./pages/HomePage"));
const SetupPage = lazy(() => import("./pages/SetupPage"));
const DraftPage = lazy(() => import("./pages/DraftPage"));
const TacticsPage = lazy(() => import("./pages/TacticsPage"));
const TournamentPage = lazy(() => import("./pages/TournamentPage"));
const MatchPage = lazy(() => import("./pages/MatchPage"));
const ResultPage = lazy(() => import("./pages/ResultPage"));

function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="font-display text-2xl tracking-widest text-[var(--color-gold)]">
        CARREGANDO...
      </p>
    </div>
  );
}

export default function App() {
  const screen = useGameStore((s) => s.screen);

  return (
    <div className="film-grain min-h-screen">
      <Suspense fallback={<Loading />}>
        {screen === "home" && <HomePage />}
        {screen === "setup" && <SetupPage />}
        {screen === "draft" && <DraftPage />}
        {screen === "tactics" && <TacticsPage />}
        {screen === "tournament" && <TournamentPage />}
        {screen === "match" && <MatchPage />}
        {screen === "result" && <ResultPage />}
      </Suspense>
      <Analytics />
    </div>
  );
}
