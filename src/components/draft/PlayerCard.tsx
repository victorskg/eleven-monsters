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
}

const SIZE_CLASSES = {
  sm: "w-24 h-36 text-[10px] shrink-0",
  md: "w-28 h-44 text-[10px] shrink-0 sm:w-32 sm:h-48",
  lg: "w-36 h-52 text-xs shrink-0 sm:w-40 sm:h-56",
};

export const PlayerCard = memo(function PlayerCard({
  player,
  mode,
  scouted = false,
  selected = false,
  onClick,
  onScout,
  revealDelay = 0,
  size = "md",
}: PlayerCardProps) {
  const rarity = getRarity(player.ovr);
  const colors = RARITY_COLORS[rarity];
  const showOvr = mode === "classic" || scouted;
  const isLegendary = rarity === "legendary";

  return (
    <motion.button
      type="button"
      initial={{ rotateY: 180, opacity: 0, scale: 0.8 }}
      animate={{ rotateY: 0, opacity: 1, scale: selected ? 1.05 : 1 }}
      transition={{
        delay: revealDelay,
        duration: rarity === "legendary" ? 0.8 : rarity === "epic" ? 0.6 : 0.4,
        type: "spring",
        stiffness: 200,
      }}
      whileHover={onClick ? { y: -8, scale: 1.03 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={`card-sticker relative flex shrink-0 flex-col p-2 shadow-xl ${SIZE_CLASSES[size]} ${
        onClick ? "cursor-pointer" : "cursor-default"
      } ${selected ? "ring-2 ring-[var(--color-gold)]" : ""}`}
      style={{
        border: `3px solid ${colors.border}`,
        boxShadow: `0 0 20px ${colors.glow}, 0 8px 24px rgba(0,0,0,0.4)`,
      }}
      aria-label={`${player.name}, ${player.nation} ${player.year}`}
    >
      {isLegendary && (
        <div className="foil-legendary absolute inset-0 opacity-20 pointer-events-none" />
      )}

      <div
        className="font-display text-[10px] uppercase tracking-widest text-center py-0.5"
        style={{ color: colors.border }}
      >
        {RARITY_COLORS[rarity].label}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-1 border-t border-b border-black/10 py-2">
        <span className="font-display text-lg leading-none text-center">
          {player.name.split(" ").pop()}
        </span>
        <span className="text-[10px] opacity-70 text-center leading-tight">
          {player.name}
        </span>
        <span className="text-[10px] font-bold mt-1">
          {player.nation} &apos;{String(player.year).slice(-2)}
        </span>
        <span className="text-[10px] opacity-60">{player.position}</span>
      </div>

      <div className="text-center py-1">
        {showOvr ? (
          <span
            className="font-display text-2xl"
            style={{ color: colors.border }}
          >
            {player.ovr}
          </span>
        ) : (
          <span className="text-lg opacity-40">???</span>
        )}
      </div>

      {mode === "almanac" && onScout && !scouted && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onScout();
          }}
          className="absolute -top-2 -right-2 bg-[var(--color-broadcast)] text-[var(--color-gold)] text-[9px] px-1.5 py-0.5 rounded font-display tracking-wide border border-[var(--color-gold)]"
        >
          SCOUT
        </button>
      )}
    </motion.button>
  );
});
