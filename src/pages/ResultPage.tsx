import { memo } from "react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/Button";
import { ScreenLayout } from "../components/ui/ScreenLayout";
import { useGameStore } from "../stores/gameStore";

export const ResultPage = memo(function ResultPage() {
  const champion = useGameStore((s) => s.champion);
  const tournament = useGameStore((s) => s.tournament);
  const draftSlots = useGameStore((s) => s.draftSlots);
  const reset = useGameStore((s) => s.reset);

  const userResults = tournament.group.fixtures
    .filter((f) => f.isUserMatch && f.result)
    .map((f) => f.result!);

  const koResults = tournament.knockoutMatches
    .filter((m) => m.result)
    .map((m) => m.result!);

  const allResults = [...userResults, ...koResults];
  const wins = allResults.filter((r) => r.won).length;
  const goalsFor = allResults.reduce((a, r) => a + r.homeGoals, 0);
  const goalsAgainst = allResults.reduce((a, r) => a + r.awayGoals, 0);

  return (
    <ScreenLayout>
      <div className="flex flex-col items-center gap-8 text-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 1 }}
        >
          {champion ? (
            <>
              <p className="font-display text-6xl text-[var(--color-gold)]">
                CAMPEÃO!
              </p>
              <p className="mt-2 text-4xl">🏆</p>
            </>
          ) : (
            <>
              <p className="font-display text-4xl text-red-400">ELIMINADO</p>
              <p className="mt-2 text-sm opacity-70">
                Mas toda lenda tem uma segunda chance...
              </p>
            </>
          )}
        </motion.div>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="font-display text-3xl text-[var(--color-gold)]">
              {wins}
            </p>
            <p className="text-xs uppercase opacity-60">Vitórias</p>
          </div>
          <div>
            <p className="font-display text-3xl text-[var(--color-gold)]">
              {goalsFor}
            </p>
            <p className="text-xs uppercase opacity-60">Gols Pró</p>
          </div>
          <div>
            <p className="font-display text-3xl text-[var(--color-gold)]">
              {goalsAgainst}
            </p>
            <p className="text-xs uppercase opacity-60">Gols Contra</p>
          </div>
        </div>

        <div className="w-full max-w-lg rounded border border-white/10 bg-black/30 p-4">
          <h3 className="font-display text-sm tracking-widest text-[var(--color-gold)] mb-3">
            Sua Seleção
          </h3>
          <div className="grid grid-cols-2 gap-2 text-left text-sm">
            {draftSlots.map((slot) =>
              slot.player ? (
                <div key={slot.slotId} className="flex justify-between">
                  <span className="opacity-70">{slot.label}</span>
                  <span>
                    {slot.player.name}{" "}
                    <span className="text-[var(--color-gold)]">
                      ({slot.player.ovr})
                    </span>
                  </span>
                </div>
              ) : null,
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <Button size="lg" onClick={reset}>
            Jogar Novamente
          </Button>
        </div>
      </div>
    </ScreenLayout>
  );
});

export default ResultPage;
