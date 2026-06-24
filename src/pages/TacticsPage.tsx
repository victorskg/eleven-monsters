import { memo, useMemo } from "react";
import { calculateTeamRatings } from "../engine/ratings";
import { getChemistryNotes } from "../engine/chemistry";
import { PitchField } from "../components/draft/PitchField";
import { Button } from "../components/ui/Button";
import { ScreenLayout } from "../components/ui/ScreenLayout";
import { StatBar } from "../components/ui/StatBar";
import { useGameStore } from "../stores/gameStore";
import type { Player } from "../engine/types";

function StyleSlider({
  label,
  value,
  onChange,
  id,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  id: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <label htmlFor={id} className="font-display text-sm tracking-wide">
          {label}
        </label>
        <span className="text-sm opacity-70">{value}</span>
      </div>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 appearance-none rounded-full bg-black/40 accent-[var(--color-gold)] cursor-pointer"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
      />
      <div className="flex justify-between text-[10px] opacity-40">
        <span>Baixo</span>
        <span>Alto</span>
      </div>
    </div>
  );
}

export const TacticsPage = memo(function TacticsPage() {
  const draftSlots = useGameStore((s) => s.draftSlots);
  const playStyle = useGameStore((s) => s.playStyle);
  const formationId = useGameStore((s) => s.formationId);
  const setPlayStyle = useGameStore((s) => s.setPlayStyle);
  const finishDraft = useGameStore((s) => s.finishDraft);

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

  const chemistryNotes = useMemo(
    () => getChemistryNotes(players),
    [players],
  );

  return (
    <ScreenLayout
      title="TÁTICA"
      subtitle={`Formação ${formationId}`}
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(200px,280px)_1fr] lg:items-start">
        <div className="flex justify-center lg:sticky lg:top-4">
          <PitchField
            slots={draftSlots}
            formationId={formationId}
            readonly
            compact
            className="w-full"
          />
        </div>

        <div className="space-y-6">
          <div className="rounded border border-white/10 bg-black/30 p-5 space-y-5">
            <h2 className="font-display text-lg tracking-widest text-[var(--color-gold)]">
              Estilo de Jogo
            </h2>
            <StyleSlider
              id="pressing"
              label="Pressão"
              value={playStyle.pressing}
              onChange={(v) => setPlayStyle({ pressing: v })}
            />
            <StyleSlider
              id="width"
              label="Largura"
              value={playStyle.width}
              onChange={(v) => setPlayStyle({ width: v })}
            />
            <StyleSlider
              id="tempo"
              label="Ritmo"
              value={playStyle.tempo}
              onChange={(v) => setPlayStyle({ tempo: v })}
            />
          </div>

          <div className="rounded border border-white/10 bg-black/30 p-5 space-y-4">
            <h2 className="font-display text-lg tracking-widest text-[var(--color-gold)]">
              Força do Time
            </h2>
            <StatBar label="Ataque" value={ratings.attack} />
            <StatBar label="Defesa" value={ratings.defense} color="#3b82f6" />
            <StatBar label="Meio-campo" value={ratings.midfield} color="#22c55e" />
            {ratings.chemistryBonus > 0 && (
              <p className="text-sm text-[var(--color-gold)]">
                Química: +{ratings.chemistryBonus}%
              </p>
            )}
            {chemistryNotes.length > 0 && (
              <ul className="space-y-1 text-xs opacity-70">
                {chemistryNotes.map((note) => (
                  <li key={note}>• {note}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="text-center lg:text-left">
            <Button size="lg" onClick={finishDraft}>
              Ir para o Torneio
            </Button>
          </div>
        </div>
      </div>
    </ScreenLayout>
  );
});

export default TacticsPage;
