import { memo, useState, useCallback, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { MatchTimelapse } from "../components/match/MatchTimelapse";
import { Button } from "../components/ui/Button";
import { ScreenLayout } from "../components/ui/ScreenLayout";
import { useGameStore } from "../stores/gameStore";
import { getPhaseLabel } from "../engine/tournament";
import type { MatchResult, TournamentState } from "../engine/types";

function getMatchContext(tournament: TournamentState, result: MatchResult) {
  const koMatch = tournament.knockoutMatches.find((m) => m.result === result);
  if (koMatch) {
    return {
      matchId: koMatch.id,
      opponentName: koMatch.opponent.name,
      phaseLabel: getPhaseLabel(koMatch.phase),
    };
  }

  const fixture = tournament.group.fixtures.find((f) => f.result === result);
  if (fixture) {
    const oppId = fixture.home === "user" ? fixture.away : fixture.home;
    return {
      matchId: fixture.id,
      opponentName:
        tournament.group.teams.find((t) => t.id === oppId)?.name ?? "Adversário",
      phaseLabel: getPhaseLabel("groups"),
    };
  }

  return {
    matchId: "unknown",
    opponentName: "Adversário",
    phaseLabel: "",
  };
}

export const MatchPage = memo(function MatchPage() {
  const lastMatchResult = useGameStore((s) => s.lastMatchResult);
  const tournament = useGameStore((s) => s.tournament);
  const champion = useGameStore((s) => s.champion);
  const eliminated = useGameStore((s) => s.eliminated);
  const setScreen = useGameStore((s) => s.setScreen);

  const [phase, setPhase] = useState<"timelapse" | "summary">("timelapse");

  const handleTimelapseComplete = useCallback(() => {
    setPhase("summary");
  }, []);

  const result = lastMatchResult;

  const matchContext = useMemo(
    () => (result ? getMatchContext(tournament, result) : null),
    [tournament, result],
  );

  useEffect(() => {
    setPhase("timelapse");
  }, [matchContext?.matchId]);

  if (!result) {
    return (
      <ScreenLayout title="PARTIDA">
        <p className="text-center">Nenhum resultado disponível.</p>
        <div className="text-center mt-4">
          <Button onClick={() => setScreen("tournament")}>Voltar</Button>
        </div>
      </ScreenLayout>
    );
  }

  const opponentName = matchContext?.opponentName ?? "Adversário";
  const phaseLabel = matchContext?.phaseLabel ?? "";
  const matchId = matchContext?.matchId ?? "unknown";

  if (phase === "timelapse") {
    return (
      <ScreenLayout
        title={phaseLabel || "AO VIVO"}
        subtitle={`vs ${opponentName}`}
      >
        <MatchTimelapse
          key={matchId}
          result={result}
          opponentName={opponentName}
          onComplete={handleTimelapseComplete}
        />
      </ScreenLayout>
    );
  }

  const scoreDisplay = result.penalties
    ? `(${result.penalties.home}) ${result.homeGoals} × ${result.awayGoals} (${result.penalties.away})`
    : `${result.homeGoals} × ${result.awayGoals}`;

  return (
    <ScreenLayout
      title="RESULTADO"
      subtitle={phaseLabel ? `${phaseLabel} · vs ${opponentName}` : `vs ${opponentName}`}
    >
      <div className="flex flex-col items-center gap-8">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 150 }}
          className="text-center"
        >
          <p className="font-display text-sm tracking-widest opacity-60 mb-2">
            PLACAR FINAL
            {result.wentToExtraTime && " — COM PRORROGAÇÃO"}
            {result.wentToPenalties && " — PÊNALTIS"}
          </p>
          <p className="font-display text-5xl sm:text-7xl text-[var(--color-gold)]">
            {scoreDisplay}
          </p>
          {result.homeGoalsRegular !== undefined && result.wentToExtraTime && (
            <p className="text-xs opacity-50 mt-2">
              Tempo regulamentar: {result.homeGoalsRegular} × {result.awayGoalsRegular}
            </p>
          )}
          <p
            className={`mt-4 font-display text-xl tracking-widest ${
              result.won
                ? "text-green-400"
                : result.drew
                  ? "text-yellow-400"
                  : "text-red-400"
            }`}
          >
            {result.won ? "VITÓRIA" : result.drew ? "EMPATE" : "DERROTA"}
          </p>
        </motion.div>

        {result.events.length > 0 && (
          <div className="w-full max-w-md space-y-2">
            <h3 className="font-display text-sm tracking-widest text-[var(--color-gold)]">
              Gols
            </h3>
            {result.events.map((ev, i) => (
              <div
                key={`${ev.minute}-${i}`}
                className={`rounded px-3 py-2 text-sm ${
                  ev.period === "penalties"
                    ? "bg-yellow-900/30"
                    : ev.team === "home"
                      ? "bg-green-900/30"
                      : "bg-red-900/30"
                }`}
              >
                {ev.period === "penalties"
                  ? ev.description
                  : `${ev.minute}' — ${ev.scorerName} ⚽`}
              </div>
            ))}
          </div>
        )}

        <div className="w-full max-w-md rounded border border-white/10 bg-black/30 p-4">
          <h3 className="font-display text-sm tracking-widest text-[var(--color-gold)] mb-2">
            Análise
          </h3>
          <ul className="text-xs opacity-70 space-y-1">
            {result.preview.factors.map((f) => (
              <li key={f}>• {f}</li>
            ))}
          </ul>
        </div>

        <Button
          size="lg"
          onClick={() =>
            setScreen(champion || eliminated ? "result" : "tournament")
          }
        >
          {champion || eliminated ? "Ver Resultado Final" : "Continuar"}
        </Button>
      </div>
    </ScreenLayout>
  );
});

export default MatchPage;
