import { memo, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PackOffer, Player } from "../../engine/types";
import { getRarity, maxRarity, RARITY_COLORS } from "../../engine/rarities";
import { PlayerCard } from "./PlayerCard";

interface PackOpeningProps {
  pack: PackOffer;
  mode: "classic" | "almanac";
  scoutedPlayerId: string | null;
  onSelect: (player: Player) => void;
  onScout: (playerId: string) => void;
  onAnimationComplete: () => void;
  scoutLeft: number;
  overlay?: boolean;
}

type Phase = "sealed" | "shaking" | "burst" | "reveal" | "done";

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
  const onCompleteRef = useRef(onAnimationComplete);
  onCompleteRef.current = onAnimationComplete;

  useEffect(() => {
    setPhase("sealed");
    setRevealedCount(0);
  }, [pack]);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("shaking"), 300);
    const t2 = setTimeout(
      () => setPhase("burst"),
      300 + SHAKE_DURATION[topRarity],
    );
    const t3 = setTimeout(
      () => setPhase("reveal"),
      300 + SHAKE_DURATION[topRarity] + 400,
    );
    const t4 = setTimeout(() => {
      setPhase("done");
      onCompleteRef.current();
    }, 300 + SHAKE_DURATION[topRarity] + 400 + pack.players.length * 200 + 200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
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

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <AnimatePresence mode="wait">
        {(phase === "sealed" || phase === "shaking" || phase === "burst") && (
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
                : phase === "burst"
                  ? { scale: [1, 1.3, 0], opacity: [1, 1, 0] }
                  : { scale: 1, rotate: 0 }
            }
            exit={{ opacity: 0 }}
            transition={
              phase === "shaking"
                ? { duration: SHAKE_DURATION[topRarity] / 1000, repeat: 0 }
                : { duration: 0.4 }
            }
            className="relative flex h-36 w-28 items-center justify-center rounded-lg sm:h-44 sm:w-32"
            style={{
              background: `linear-gradient(145deg, ${topColors.border}44, var(--color-broadcast))`,
              border: `3px solid ${topColors.border}`,
              boxShadow: `0 0 40px ${topColors.glow}`,
            }}
          >
            <span className="font-display text-2xl tracking-widest text-[var(--color-cream)]">
              ?
            </span>
            {topRarity === "legendary" && phase === "shaking" && (
              <motion.div
                className="absolute inset-0 rounded-lg foil-legendary opacity-40"
                animate={{ opacity: [0.2, 0.6, 0.2] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {(phase === "reveal" || phase === "done") && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid w-full grid-cols-3 gap-2 sm:gap-4"
        >
          {pack.players.map((player, i) =>
            i < revealedCount || phase === "done" ? (
              <div key={player.id} className="flex justify-center">
                <PlayerCard
                  player={player}
                  mode={mode}
                  scouted={scoutedPlayerId === player.id}
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
            ),
          )}
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
