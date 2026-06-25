import { memo } from "react";
import { motion } from "framer-motion";
import type { Player } from "../../engine/types";
import { getRarity, RARITY_COLORS } from "../../engine/rarities";

interface PlayerCardProps {
  player: Player;
  mode: "classic" | "almanac";
  scouted?: boolean;
  selected?: boolean;
  onClick?: () => void;
  onScout?: () => void;
  revealDelay?: number;
  size?: "sm" | "md" | "lg";
  synergyDelta?: number;
  synergyNotes?: string[];
}

const SIZE_CLASSES = {
  sm: "w-24 text-[10px] shrink-0",
  md: "w-28 text-[10px] shrink-0 sm:w-32",
  lg: "w-36 text-xs shrink-0 sm:w-40",
};

const ATTR_COLORS: Record<string, string> = {
  PAC: "#22c55e",
  FIN: "#ef4444",
  PAS: "#3b82f6",
  DEF: "#a855f7",
  FIS: "#f97316",
};

function MiniStat({
  label,
  value,
  hidden,
}: {
  label: string;
  value: number;
  hidden: boolean;
}) {
  const pct = Math.min(100, value);
  return (
    <div className="flex items-center gap-1">
      <span className="w-5 text-[8px] opacity-60">{label}</span>
      {hidden ? (
        <span className="text-[8px] opacity-30 flex-1">??</span>
      ) : (
        <>
          <div className="flex-1 h-1 bg-black/30 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${pct}%`,
                backgroundColor: ATTR_COLORS[label],
              }}
            />
          </div>
          <span className="w-5 text-[8px] text-right">{value}</span>
        </>
      )}
    </div>
  );
}

export const PlayerCard = memo(function PlayerCard({
  player,
  mode,
  scouted = false,
  selected = false,
  onClick,
  onScout,
  revealDelay = 0,
  size = "md",
  synergyDelta = 0,
  synergyNotes = [],
}: PlayerCardProps) {
  const rarity = getRarity(player.ovr);
  const colors = RARITY_COLORS[rarity];
  const showStats = mode === "classic" || scouted;
  const isLegendary = rarity === "legendary";
  const hasChemistry = synergyDelta > 0 || synergyNotes.length > 0;
  const { pace, shooting, passing, defending, physical } = player.attributes;

  const flipDuration =
    rarity === "legendary" ? 0.8 : rarity === "epic" ? 0.6 : 0.4;

  return (
    <motion.button
      type="button"
      initial={{ rotateY: 180, opacity: 0, scale: 0.8 }}
      animate={{ rotateY: 0, opacity: 1, scale: selected ? 1.05 : 1 }}
      transition={{
        delay: revealDelay,
        duration: flipDuration,
        type: "spring",
        stiffness: 200,
      }}
      whileHover={onClick ? { y: -8, scale: 1.03 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={`card-sticker relative z-0 flex shrink-0 flex-col p-2 shadow-xl ${SIZE_CLASSES[size]} ${
        onClick ? "cursor-pointer" : "cursor-default"
      } ${selected ? "ring-2 ring-[var(--color-gold)]" : ""}`}
      style={{
        border: `3px solid ${colors.border}`,
        boxShadow: `0 0 20px ${colors.glow}, 0 8px 24px rgba(0,0,0,0.4)`,
      }}
      aria-label={`${player.name}, ${player.nation} ${player.year}`}
    >
      {isLegendary && (
        <div className="foil-legendary absolute inset-0 overflow-hidden rounded-sm opacity-20 pointer-events-none" />
      )}

      <div className="relative z-10 flex flex-col gap-1">
        {hasChemistry && (
          <div className="flex flex-col items-center gap-0.5 rounded bg-black/5 px-1 py-1">
            {synergyDelta > 0 && (
              <span className="bg-[var(--color-gold)] text-black text-[8px] px-1.5 py-0.5 rounded font-display font-bold leading-none">
                +{synergyDelta}%
              </span>
            )}
            {synergyNotes.length > 0 && (
              <p className="text-[7px] text-center text-[var(--color-gold)] leading-snug w-full">
                {synergyNotes[0]}
              </p>
            )}
          </div>
        )}

        <div
          className="font-display text-[10px] uppercase tracking-widest text-center"
          style={{ color: colors.border }}
        >
          {colors.label}
        </div>

        <div className="flex flex-col items-center gap-0.5 border-t border-b border-black/10 py-1">
          <span className="font-display text-lg leading-none text-center">
            {player.name.split(" ").pop()}
          </span>
          <span className="text-[10px] opacity-70 text-center leading-tight line-clamp-2">
            {player.name}
          </span>
          <span className="text-[10px] font-bold">
            {player.nation} &apos;{String(player.year).slice(-2)}
          </span>
          <span className="text-[10px] opacity-60">{player.position}</span>
        </div>

        <div className="space-y-0.5 px-0.5">
          <MiniStat label="PAC" value={pace} hidden={!showStats} />
          <MiniStat label="FIN" value={shooting} hidden={!showStats} />
          <MiniStat label="PAS" value={passing} hidden={!showStats} />
          <MiniStat label="DEF" value={defending} hidden={!showStats} />
          <MiniStat label="FIS" value={physical} hidden={!showStats} />
        </div>

        <div className="text-center pt-0.5">
          {showStats ? (
            <span
              className="font-display text-xl"
              style={{ color: colors.border }}
            >
              {player.ovr}
            </span>
          ) : (
            <span className="text-lg opacity-40">???</span>
          )}
        </div>
      </div>

      {mode === "almanac" && onScout && !scouted && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onScout();
          }}
          className="absolute top-1 right-1 z-20 bg-[var(--color-broadcast)] text-[var(--color-gold)] text-[9px] px-1.5 py-0.5 rounded font-display tracking-wide border border-[var(--color-gold)]"
        >
          SCOUT
        </button>
      )}
    </motion.button>
  );
});
