import { memo, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PackOffer, Player } from "../../engine/types";
import { previewChemistryDelta } from "../../engine/chemistry";
import {
  getRarity,
  maxRarity,
  RARITY_COLORS,
  RARITY_ORDER,
} from "../../engine/rarities";
import { PlayerCard } from "./PlayerCard";

interface PackOpeningProps {
  pack: PackOffer;
  mode: "classic" | "almanac";
  currentRoster: Player[];
  scoutedPlayerId: string | null;
  onSelect: (player: Player) => void;
  onScout: (playerId: string) => void;
  onAnimationComplete: () => void;
  scoutLeft: number;
  overlay?: boolean;
}

type Phase = "sealed" | "shaking" | "locked" | "burst" | "reveal" | "done";

const PACK_BORDER_CYCLE_MS = 85;
const PACK_COLOR_HOLD_MS = 1000;
const BURST_DURATION_MS = 400;

const SHAKE_DURATION: Record<string, number> = {
  common: 600,
  uncommon: 800,
  rare: 1000,
  epic: 1400,
  legendary: 2000,
};

export const PackOpening = memo(function PackOpening({
  pack,
  mode,
  currentRoster,
  scoutedPlayerId,
  onSelect,
  onScout,
  onAnimationComplete,
  scoutLeft,
  overlay = false,
}: PackOpeningProps) {
  const topRarity = maxRarity(pack.players.map((p) => getRarity(p.ovr)));
  const topColors = RARITY_COLORS[topRarity];
  const [phase, setPhase] = useState<Phase>("sealed");
  const [revealedCount, setRevealedCount] = useState(0);
  const [packBorderIndex, setPackBorderIndex] = useState(0);
  const onCompleteRef = useRef(onAnimationComplete);
  onCompleteRef.current = onAnimationComplete;

  useEffect(() => {
    setPhase("sealed");
    setRevealedCount(0);
    setPackBorderIndex(0);
  }, [pack]);

  useEffect(() => {
    if (phase !== "sealed" && phase !== "shaking") return;
    const interval = setInterval(() => {
      setPackBorderIndex((i) => (i + 1) % RARITY_ORDER.length);
    }, PACK_BORDER_CYCLE_MS);
    return () => clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    const sealedMs = 300;
    const shakeEnd = sealedMs + SHAKE_DURATION[topRarity];
    const lockedEnd = shakeEnd + PACK_COLOR_HOLD_MS;
    const burstEnd = lockedEnd + BURST_DURATION_MS;

    const t1 = setTimeout(() => setPhase("shaking"), sealedMs);
    const t2 = setTimeout(() => setPhase("locked"), shakeEnd);
    const t3 = setTimeout(() => setPhase("burst"), lockedEnd);
    const t4 = setTimeout(() => setPhase("reveal"), burstEnd);
    const t5 = setTimeout(() => {
      setPhase("done");
      onCompleteRef.current();
    }, burstEnd + pack.players.length * 200 + 200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [pack, topRarity]);

  useEffect(() => {
    if (phase !== "reveal" && phase !== "done") return;
    const interval = setInterval(() => {
      setRevealedCount((c) => Math.min(c + 1, pack.players.length));
    }, 200);
    return () => clearInterval(interval);
  }, [phase, pack.players.length]);

  const cardSize = overlay ? "md" : "lg";
  const packBorderLocked = phase === "locked" || phase === "burst";
  const packColors = packBorderLocked
    ? topColors
    : RARITY_COLORS[RARITY_ORDER[packBorderIndex]];

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <AnimatePresence mode="wait">
        {(phase === "sealed" ||
          phase === "shaking" ||
          phase === "locked" ||
          phase === "burst") && (
          <motion.div
            key="pack"
            initial={{ scale: 0, rotate: -10 }}
            animate={
              phase === "shaking"
                ? {
                    scale: 1,
                    rotate: [0, -3, 3, -3, 3, 0],
                    x: [0, -4, 4, -4, 4, 0],
                  }
                : phase === "locked"
                  ? {
                      scale: [1, 1.06, 1],
                      opacity: 1,
                      boxShadow: [
                        `0 0 40px ${topColors.glow}`,
                        `0 0 64px ${topColors.glow}`,
                        `0 0 40px ${topColors.glow}`,
                      ],
                    }
                  : phase === "burst"
                    ? { scale: [1, 1.3, 0], opacity: [1, 1, 0] }
                    : { scale: 1, rotate: 0 }
            }
            exit={{ opacity: 0 }}
            transition={
              phase === "shaking"
                ? { duration: SHAKE_DURATION[topRarity] / 1000, repeat: 0 }
                : phase === "locked"
                  ? { duration: PACK_COLOR_HOLD_MS / 1000, ease: "easeInOut" }
                  : { duration: BURST_DURATION_MS / 1000 }
            }
            className="relative flex h-36 w-28 items-center justify-center rounded-lg sm:h-44 sm:w-32"
            style={{
              background: `linear-gradient(145deg, ${packColors.border}44, var(--color-broadcast))`,
              border: `3px solid ${packColors.border}`,
              boxShadow: `0 0 40px ${packColors.glow}`,
              transition: packBorderLocked
                ? "border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease"
                : undefined,
            }}
          >
            <span className="font-display text-2xl tracking-widest text-[var(--color-cream)]">
              ?
            </span>
            {packBorderLocked && topRarity === "legendary" && (
              <motion.div
                className="absolute inset-0 rounded-lg foil-legendary opacity-40"
                animate={
                  phase === "locked"
                    ? { opacity: [0.3, 0.7, 0.3] }
                    : { opacity: [0.2, 0.6, 0.2] }
                }
                transition={{
                  repeat: Infinity,
                  duration: phase === "locked" ? 0.8 : 0.5,
                }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {(phase === "reveal" || phase === "done") && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid w-full grid-cols-3 gap-x-2 gap-y-4 sm:gap-x-4 overflow-visible items-start"
        >
          {pack.players.map((player, i) => {
            const delta = previewChemistryDelta(currentRoster, player);
            return i < revealedCount || phase === "done" ? (
              <div key={player.id} className="flex justify-center px-0.5">
                <PlayerCard
                  player={player}
                  mode={mode}
                  scouted={scoutedPlayerId === player.id}
                  synergyDelta={delta.deltaPercent}
                  synergyNotes={delta.newNotes}
                  onClick={phase === "done" ? () => onSelect(player) : undefined}
                  onScout={
                    phase === "done" && scoutLeft > 0
                      ? () => onScout(player.id)
                      : undefined
                  }
                  revealDelay={0}
                  size={cardSize}
                />
              </div>
            ) : (
              <div key={player.id} className="flex justify-center opacity-0" aria-hidden />
            );
          })}
        </motion.div>
      )}

      {phase === "done" && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm italic text-[var(--color-cream)]/70"
        >
          Escolha um jogador para sua seleção
        </motion.p>
      )}
    </div>
  );
});
