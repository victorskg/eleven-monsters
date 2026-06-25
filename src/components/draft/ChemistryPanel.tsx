import { memo } from "react";
import type { Player } from "../../engine/types";
import {
  getChemistryNotes,
  getCurrentChemistryPercent,
} from "../../engine/chemistry";

interface ChemistryPanelProps {
  players: Player[];
  className?: string;
}

export const ChemistryPanel = memo(function ChemistryPanel({
  players,
  className = "",
}: ChemistryPanelProps) {
  const percent = getCurrentChemistryPercent(players);
  const notes = getChemistryNotes(players);

  return (
    <div
      className={`rounded border border-white/10 bg-black/30 p-4 space-y-3 ${className}`}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm tracking-widest text-[var(--color-gold)]">
          Química
        </h3>
        <span
          className={`font-display text-xl ${
            percent > 0 ? "text-[var(--color-gold)]" : "opacity-40"
          }`}
        >
          +{percent}%
        </span>
      </div>

      {notes.length > 0 ? (
        <ul className="space-y-1 text-xs opacity-80">
          {notes.map((note, i) => (
            <li key={`${note}-${i}`}>• {note}</li>
          ))}
        </ul>
      ) : (
        <p className="text-xs opacity-50 italic">
          Monte sinergias: mesma seleção, nação ou duplas lendárias
        </p>
      )}
    </div>
  );
});
