import { memo } from "react";
import type { HalftimeChoice, Opponent } from "../../engine/types";

interface HalftimeDecisionProps {
  homeGoals: number;
  awayGoals: number;
  opponent: Opponent;
  onChoose: (choice: HalftimeChoice) => void;
}

const CHOICES: {
  id: HalftimeChoice;
  label: string;
  description: string;
}[] = [
  {
    id: "maintain",
    label: "Manter",
    description: "Seguir com a mesma tática do 1º tempo",
  },
  {
    id: "push",
    label: "Aumentar pressão",
    description: "Mais ataque, mais risco — buscar virada ou ampliar",
  },
  {
    id: "hold",
    label: "Segurar",
    description: "Fechar o jogo — menos gols, defesa reforçada",
  },
];

export const HalftimeDecision = memo(function HalftimeDecision({
  homeGoals,
  awayGoals,
  opponent,
  onChoose,
}: HalftimeDecisionProps) {
  const trailing = homeGoals < awayGoals;
  const tip = trailing
    ? `${opponent.profile.trait}: ${opponent.profile.weakness}`
    : `Adversário joga ${opponent.profile.trait.toLowerCase()} — ${opponent.profile.weakness}`;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="w-full max-w-md rounded border border-[var(--color-gold)] bg-[var(--color-broadcast)] p-6 space-y-5 shadow-2xl">
        <div className="text-center">
          <p className="font-display text-sm tracking-widest text-[var(--color-gold)]">
            INTERVALO
          </p>
          <p className="font-display text-4xl mt-2">
            {homeGoals} × {awayGoals}
          </p>
          <p className="text-xs opacity-60 mt-1">vs {opponent.name}</p>
        </div>

        <p className="text-xs text-center opacity-70 italic">{tip}</p>

        <div className="space-y-2">
          {CHOICES.map((choice) => (
            <button
              key={choice.id}
              type="button"
              onClick={() => onChoose(choice.id)}
              className="w-full rounded border border-white/20 bg-black/30 px-4 py-3 text-left transition-colors hover:border-[var(--color-gold)] hover:bg-[var(--color-gold)]/10 focus-visible:outline-2 focus-visible:outline-[var(--color-gold)]"
            >
              <p className="font-display tracking-wide text-[var(--color-gold)]">
                {choice.label}
              </p>
              <p className="text-xs opacity-70 mt-0.5">{choice.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});
