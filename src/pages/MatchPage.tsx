import { memo, useState, useCallback, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { MatchTimelapse } from "../components/match/MatchTimelapse";
import { HalftimeDecision } from "../components/match/HalftimeDecision";
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
  const partialMatch = useGameStore((s) => s.partialMatch);
  const matchPhase = useGameStore((s) => s.matchPhase);
  const tournament = useGameStore((s) => s.tournament);
  const champion = useGameStore((s) => s.champion);
  const eliminated = useGameStore((s) => s.eliminated);
  const setScreen = useGameStore((s) => s.setScreen);
  const setMatchPhase = useGameStore((s) => s.setMatchPhase);
  const applyHalftimeChoice = useGameStore((s) => s.applyHalftimeChoice);
  const completeMatchView = useGameStore((s) => s.completeMatchView);

  const [uiPhase, setUiPhase] = useState<"timelapse" | "summary">("timelapse");

  const result = lastMatchResult;

  const matchContext = useMemo(() => {
    if (result) return getMatchContext(tournament, result);
    if (partialMatch) {
      return {
        matchId: `partial-${partialMatch.seed}`,
        opponentName: partialMatch.opponent.name,
        phaseLabel: getPhaseLabel(partialMatch.opponent.phase),
      };
    }
    return null;
  }, [tournament, result, partialMatch]);

  useEffect(() => {
    setUiPhase("timelapse");
  }, [matchContext?.matchId]);

  const handleHalftimeReached = useCallback(() => {
    setMatchPhase("halftime");
  }, [setMatchPhase]);

  const handleHalftimeComplete = useCallback(() => {
    // Intervalo é tratado por onHalftimeReached no minuto 45
  }, []);

  const handleSecondHalfComplete = useCallback(() => {
    setUiPhase("summary");
    completeMatchView();
  }, [completeMatchView]);

  if (!partialMatch && !result) {
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

  if (matchPhase === "halftime" && partialMatch) {
    return (
      <>
        <ScreenLayout
          title="INTERVALO"
          subtitle={`vs ${opponentName}`}
        >
          <div className="flex flex-col items-center gap-4 opacity-40 pointer-events-none">
            <p className="font-display text-4xl">
              {partialMatch.homeGoalsHT} × {partialMatch.awayGoalsHT}
            </p>
          </div>
        </ScreenLayout>
        <HalftimeDecision
          homeGoals={partialMatch.homeGoalsHT}
          awayGoals={partialMatch.awayGoalsHT}
          opponent={partialMatch.opponent}
          onChoose={applyHalftimeChoice}
        />
      </>
    );
  }

  if (
    matchPhase === "first_half" &&
    partialMatch &&
    uiPhase === "timelapse" &&
    !result
  ) {
    return (
      <ScreenLayout
        title={phaseLabel || "1º TEMPO"}
        subtitle={`vs ${opponentName}`}
      >
        <MatchTimelapse
          key={`${matchId}-first`}
          events={partialMatch.firstHalfEvents}
          opponentName={opponentName}
          endMinute={45}
          onHalftimeReached={handleHalftimeReached}
          onComplete={handleHalftimeComplete}
        />
      </ScreenLayout>
    );
  }

  if (matchPhase === "second_half" && result && partialMatch && uiPhase === "timelapse") {
    const secondHalfEvents = result.events.filter(
      (e) => e.minute > 45 || e.period === "extra" || e.period === "penalties",
    );
    const endMinute = result.wentToExtraTime ? 120 : 90;

    return (
      <ScreenLayout
        title={phaseLabel || "2º TEMPO"}
        subtitle={`vs ${opponentName}`}
      >
        <MatchTimelapse
          key={`${matchId}-second`}
          events={secondHalfEvents}
          opponentName={opponentName}
          endMinute={endMinute}
          startMinute={45}
          initialHomeScore={partialMatch.homeGoalsHT}
          initialAwayScore={partialMatch.awayGoalsHT}
          wentToExtraTime={result.wentToExtraTime}
          onComplete={handleSecondHalfComplete}
        />
      </ScreenLayout>
    );
  }

  if (!result) {
    return (
      <ScreenLayout title="PARTIDA">
        <p className="text-center">Carregando partida...</p>
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
          {partialMatch && (
            <p className="text-xs opacity-50 mt-2">
              Intervalo: {partialMatch.homeGoalsHT} × {partialMatch.awayGoalsHT}
            </p>
          )}
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
