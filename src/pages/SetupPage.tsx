import { memo, useState } from "react";
import type { FormationId, GameMode } from "../engine/types";
import { FORMATIONS } from "../engine/formations";
import { Button } from "../components/ui/Button";
import { ScreenLayout } from "../components/ui/ScreenLayout";
import { useGameStore } from "../stores/gameStore";

export const SetupPage = memo(function SetupPage() {
  const setScreen = useGameStore((s) => s.setScreen);
  const startGame = useGameStore((s) => s.startGame);
  const [mode, setMode] = useState<GameMode>("classic");
  const [formationId, setFormationId] = useState<FormationId>("4-3-3");

  return (
    <ScreenLayout title="PREPARAR EQUIPE" subtitle="Formação e modo de jogo">
      <div className="mx-auto max-w-lg space-y-8">
        <section>
          <h2 className="font-display text-xl tracking-widest text-[var(--color-gold)] mb-4">
            Modo de Jogo
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                ["classic", "CLÁSSICO", "Notas dos jogadores visíveis nas cartas"],
                ["almanac", "ALMANAQUE", "Notas ocultas — conhecimento histórico vale ouro"],
              ] as const
            ).map(([id, label, desc]) => (
              <button
                key={id}
                type="button"
                onClick={() => setMode(id)}
                className={`rounded border p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-gold)] ${
                  mode === id
                    ? "border-[var(--color-gold)] bg-[var(--color-gold)]/10"
                    : "border-[var(--color-gold)]/30 bg-black/30 hover:border-[var(--color-gold)]/60"
                }`}
              >
                <p className="font-display text-lg tracking-wide">{label}</p>
                <p className="mt-1 text-xs opacity-70">{desc}</p>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl tracking-widest text-[var(--color-gold)] mb-4">
            Formação
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {(Object.keys(FORMATIONS) as FormationId[]).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setFormationId(id)}
                className={`rounded border py-4 font-display text-2xl tracking-widest transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-gold)] ${
                  formationId === id
                    ? "border-[var(--color-gold)] bg-[var(--color-gold)]/10"
                    : "border-white/10 bg-black/20 hover:border-[var(--color-gold)]/50"
                }`}
              >
                {id}
              </button>
            ))}
          </div>
        </section>

        <div className="flex flex-col items-center gap-4">
          <Button size="lg" onClick={() => startGame(mode, formationId)}>
            Iniciar Draft
          </Button>
          <Button variant="ghost" onClick={() => setScreen("home")}>
            Voltar
          </Button>
        </div>
      </div>
    </ScreenLayout>
  );
});

export default SetupPage;
