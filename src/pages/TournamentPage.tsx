import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { calculateTeamRatings } from "../engine/ratings";
import { computeStandings } from "../engine/standings";
import { estimateMatchPreview } from "../engine/simulation";
import {
  getCurrentUserFixture,
  getOpponentForUserFixture,
  getPhaseLabel,
} from "../engine/tournament";
import { StyleSliders } from "../components/tactics/StyleSliders";
import { Button } from "../components/ui/Button";
import { ScreenLayout } from "../components/ui/ScreenLayout";
import { useGameStore } from "../stores/gameStore";
import type { Opponent, Player } from "../engine/types";

function OpponentProfileCard({ opponent }: { opponent: Opponent }) {
  const { profile } = opponent;
  return (
    <div className="rounded border border-white/10 bg-black/30 p-4 space-y-2 text-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-display tracking-widest text-[var(--color-gold)]">
          {opponent.name}
        </h3>
        <span className="text-xs opacity-60">Força {opponent.strength}</span>
      </div>
      <p>
        <span className="opacity-60">Estilo:</span>{" "}
        <span className="font-bold">{profile.trait}</span>
      </p>
      <p className="text-xs opacity-70">{profile.strengthNote}</p>
      <p className="text-xs text-yellow-400/80">
        Fraqueza: {profile.weakness}
      </p>
    </div>
  );
}

export const TournamentPage = memo(function TournamentPage() {
  const tournament = useGameStore((s) => s.tournament);
  const draftSlots = useGameStore((s) => s.draftSlots);
  const playStyle = useGameStore((s) => s.playStyle);
  const setPlayStyle = useGameStore((s) => s.setPlayStyle);
  const simulateCurrentMatch = useGameStore((s) => s.simulateCurrentMatch);
  const simulateAllMatches = useGameStore((s) => s.simulateAllMatches);

  const players = useMemo(
    () =>
      draftSlots
        .map((s) => s.player)
        .filter((p): p is Player => p !== null),
    [draftSlots],
  );

  const ratings = useMemo(
    () => calculateTeamRatings(players, playStyle),
    [players, playStyle],
  );

  const standings = useMemo(
    () => computeStandings(tournament.group),
    [tournament.group],
  );

  const userFixtures = useMemo(
    () =>
      tournament.group.userMatchIds
        .map((id) => tournament.group.fixtures.find((f) => f.id === id)!)
        .filter(Boolean),
    [tournament.group],
  );

  const currentFixture = getCurrentUserFixture(tournament);
  const currentOpponent = currentFixture
    ? getOpponentForUserFixture(tournament, currentFixture.id)
    : null;

  const currentKnockout =
    tournament.stage === "knockout"
      ? tournament.knockoutMatches[tournament.currentKnockoutIndex]
      : null;

  const activeOpponent =
    currentOpponent ??
    (currentKnockout && !currentKnockout.result
      ? currentKnockout.opponent
      : null);

  const preview =
    activeOpponent &&
    ((currentFixture && !currentFixture.played) ||
      (currentKnockout && !currentKnockout.result))
      ? estimateMatchPreview(ratings, activeOpponent, playStyle)
      : null;

  const playedKnockout = tournament.knockoutMatches.filter((m) => m.result);

  const canSimulate =
    (tournament.stage === "group" &&
      !tournament.groupComplete &&
      currentFixture &&
      !currentFixture.played) ||
    (tournament.stage === "knockout" &&
      currentKnockout &&
      !currentKnockout.result);

  return (
    <ScreenLayout
      title="TORNEIO"
      subtitle={tournament.group.name}
    >
      <div className="space-y-6">
        {/* Tabela do grupo */}
        <div className="rounded border border-white/10 bg-black/30 overflow-hidden">
          <div className="px-4 py-2 border-b border-white/10">
            <h3 className="font-display text-sm tracking-widest text-[var(--color-gold)]">
              Classificação — {tournament.group.name}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-white/50 border-b border-white/10">
                  <th className="px-3 py-2 text-left">#</th>
                  <th className="px-3 py-2 text-left">Time</th>
                  <th className="px-2 py-2 text-center">P</th>
                  <th className="px-2 py-2 text-center">J</th>
                  <th className="px-2 py-2 text-center">V</th>
                  <th className="px-2 py-2 text-center">E</th>
                  <th className="px-2 py-2 text-center">D</th>
                  <th className="px-2 py-2 text-center">GP</th>
                  <th className="px-2 py-2 text-center">GC</th>
                  <th className="px-2 py-2 text-center">SG</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((team) => (
                  <tr
                    key={team.id}
                    className={`border-b border-white/5 ${
                      team.isUser
                        ? "bg-[var(--color-gold)]/10"
                        : team.rank <= 2
                          ? ""
                          : "opacity-60"
                    }`}
                  >
                    <td className="px-3 py-2 font-display">{team.rank}</td>
                    <td className="px-3 py-2 font-bold">
                      {team.name}
                      {team.rank <= 2 && (
                        <span className="ml-1 text-[var(--color-gold)]">▲</span>
                      )}
                    </td>
                    <td className="px-2 py-2 text-center font-display text-[var(--color-gold)]">
                      {team.points}
                    </td>
                    <td className="px-2 py-2 text-center">{team.played}</td>
                    <td className="px-2 py-2 text-center">{team.won}</td>
                    <td className="px-2 py-2 text-center">{team.drawn}</td>
                    <td className="px-2 py-2 text-center">{team.lost}</td>
                    <td className="px-2 py-2 text-center">{team.goalsFor}</td>
                    <td className="px-2 py-2 text-center">{team.goalsAgainst}</td>
                    <td className="px-2 py-2 text-center">
                      {team.goalDifference > 0 ? "+" : ""}
                      {team.goalDifference}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Jogos do usuário no grupo */}
        <div className="space-y-2">
          <h3 className="font-display text-sm tracking-widest text-[var(--color-gold)]">
            Seus Jogos
          </h3>
          {userFixtures.map((fixture, i) => {
            const opponentId =
              fixture.home === "user" ? fixture.away : fixture.home;
            const opponent = tournament.group.teams.find(
              (t) => t.id === opponentId,
            );
            const isCurrent =
              tournament.stage === "group" &&
              !tournament.groupComplete &&
              fixture.id === currentFixture?.id &&
              !fixture.played;
            const won =
              fixture.result?.won || fixture.result?.drew;

            return (
              <motion.div
                key={fixture.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-center justify-between rounded border px-4 py-3 ${
                  isCurrent
                    ? "border-[var(--color-gold)] bg-[var(--color-gold)]/10"
                    : fixture.played
                      ? won
                        ? "border-green-600/40 bg-green-900/20"
                        : "border-red-600/40 bg-red-900/20"
                      : "border-white/10 bg-black/20 opacity-50"
                }`}
              >
                <div>
                  <p className="text-[10px] uppercase tracking-widest opacity-60">
                    Rodada {i + 1}
                  </p>
                  <p className="font-display text-lg tracking-wide">
                    vs {opponent?.name}
                  </p>
                </div>
                <div className="text-right">
                  {fixture.played && fixture.result ? (
                    <p className="font-display text-2xl">
                      {fixture.result.homeGoals} - {fixture.result.awayGoals}
                    </p>
                  ) : isCurrent ? (
                    <span className="font-display text-sm text-[var(--color-gold)]">
                      PRÓXIMO
                    </span>
                  ) : (
                    <span className="text-xs opacity-40">—</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mata-mata: histórico + próximo jogo */}
        {playedKnockout.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-display text-sm tracking-widest text-[var(--color-gold)]">
              Mata-mata
            </h3>
            {playedKnockout.map((match) => (
              <div
                key={match.id}
                className={`flex items-center justify-between rounded border px-4 py-3 ${
                  match.result?.won
                    ? "border-green-600/40 bg-green-900/20"
                    : "border-red-600/40 bg-red-900/20"
                }`}
              >
                <div>
                  <p className="text-[10px] uppercase tracking-widest opacity-60">
                    {getPhaseLabel(match.phase)}
                  </p>
                  <p className="font-display text-lg">vs {match.opponent.name}</p>
                </div>
                {match.result && (
                  <p className="font-display text-2xl">
                    {match.result.penalties
                      ? `(${match.result.penalties.home}) ${match.result.homeGoalsRegular + match.result.homeGoalsET}–${match.result.awayGoalsRegular + match.result.awayGoalsET} (${match.result.penalties.away})`
                      : `${match.result.homeGoals} - ${match.result.awayGoals}`}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {currentKnockout && !currentKnockout.result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded border border-[var(--color-gold)] bg-[var(--color-gold)]/10 px-4 py-4"
          >
            <p className="text-[10px] uppercase tracking-widest opacity-60">
              {getPhaseLabel(currentKnockout.phase)}
            </p>
            <p className="font-display text-xl tracking-wide">
              vs {currentKnockout.opponent.name}
            </p>
          </motion.div>
        )}

        {canSimulate && activeOpponent && (
          <div className="space-y-4">
            <h3 className="font-display text-sm tracking-widest text-[var(--color-gold)]">
              Preparação
            </h3>
            <OpponentProfileCard opponent={activeOpponent} />
            <div className="rounded border border-white/10 bg-black/30 p-4">
              <h4 className="font-display text-sm tracking-widest text-[var(--color-gold)] mb-4">
                Ajustar Tática
              </h4>
              <StyleSliders
                playStyle={playStyle}
                onChange={setPlayStyle}
                idPrefix="tournament"
              />
            </div>
          </div>
        )}

        {preview && (
          <div className="rounded border border-white/10 bg-black/30 p-4 space-y-3">
            <h3 className="font-display text-sm tracking-widest text-[var(--color-gold)]">
              Preview
            </h3>
            <div className="flex h-4 overflow-hidden rounded-full">
              <div
                className="bg-green-600"
                style={{ width: `${preview.winChance * 100}%` }}
              />
              <div
                className="bg-yellow-600"
                style={{ width: `${preview.drawChance * 100}%` }}
              />
              <div
                className="bg-red-600"
                style={{ width: `${preview.lossChance * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] opacity-70">
              <span>Vitória {(preview.winChance * 100).toFixed(0)}%</span>
              <span>Empate {(preview.drawChance * 100).toFixed(0)}%</span>
              <span>Derrota {(preview.lossChance * 100).toFixed(0)}%</span>
            </div>
            <ul className="text-xs opacity-70 space-y-1 border-t border-white/10 pt-3">
              {preview.factors.map((f) => (
                <li key={f}>• {f}</li>
              ))}
            </ul>
          </div>
        )}

        {tournament.groupComplete && tournament.qualified && tournament.stage === "knockout" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded border border-green-600/50 bg-green-900/20 px-4 py-3 text-center"
          >
            <p className="font-display text-lg tracking-widest text-green-400">
              CLASSIFICADO — OITAVAS DE FINAL
            </p>
          </motion.div>
        )}

        {tournament.groupComplete && !tournament.qualified && (
          <p className="text-center text-red-400 font-display tracking-widest">
            NÃO CLASSIFICADO
          </p>
        )}

        <div className="flex flex-wrap justify-center gap-4">
          {canSimulate && (
            <>
              <Button size="lg" onClick={simulateCurrentMatch}>
                Simular Jogo
              </Button>
              <Button variant="secondary" onClick={simulateAllMatches}>
                Simular Tudo
              </Button>
            </>
          )}
        </div>
      </div>
    </ScreenLayout>
  );
});

export default TournamentPage;
