import { memo, useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type {
  DraftSlot,
  FormationId,
  HighlightReplay,
  PitchCoordinate,
} from "../../engine/types";
import { getPitchLayout } from "../../engine/formations";

interface MatchHighlightReplayProps {
  replay: HighlightReplay;
  slots: DraftSlot[];
  formationId: FormationId;
  onDismiss: () => void;
  continueLabel?: string;
}

type Stage = "intro" | "playing" | "goal" | "done";

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function coordToStyle(c: PitchCoordinate) {
  return { left: `${c.x}%`, top: `${c.y}%` };
}

export const MatchHighlightReplay = memo(function MatchHighlightReplay({
  replay,
  slots,
  formationId,
  onDismiss,
  continueLabel = "Continuar",
}: MatchHighlightReplayProps) {
  const layout = getPitchLayout(formationId);
  const [stage, setStage] = useState<Stage>("intro");
  const [ballPos, setBallPos] = useState<PitchCoordinate>(
    replay.phases[0]?.from ?? { x: 50, y: 50 },
  );
  const [activeSlots, setActiveSlots] = useState<Set<string>>(new Set());
  const [ballCarrierSlotId, setBallCarrierSlotId] = useState<string | null>(null);
  const [phaseIndex, setPhaseIndex] = useState(-1);
  const cancelledRef = useRef(false);

  const runSequence = useCallback(async () => {
    cancelledRef.current = false;
    setStage("intro");
    setPhaseIndex(-1);
    setActiveSlots(new Set());
    setBallCarrierSlotId(replay.phases[0]?.fromSlotId ?? replay.passerSlotId);
    const startPos =
      replay.phases[0]?.from ??
      layout[replay.passerSlotId] ??
      { x: 50, y: 50 };
    setBallPos(startPos);

    await sleep(900);
    if (cancelledRef.current) return;

    setStage("playing");

    for (let i = 0; i < replay.phases.length; i++) {
      if (cancelledRef.current) return;
      const phase = replay.phases[i];

      const involved = new Set<string>();
      if (phase.fromSlotId) involved.add(phase.fromSlotId);
      if (phase.toSlotId) involved.add(phase.toSlotId);
      setActiveSlots(involved);
      setPhaseIndex(i);
      setBallCarrierSlotId(phase.fromSlotId ?? null);
      setBallPos(phase.from);
      await sleep(120);
      if (cancelledRef.current) return;

      setBallCarrierSlotId(phase.type === "pass" ? phase.toSlotId ?? null : null);
      setBallPos(phase.to);
      await sleep(phase.durationMs);

      if (phase.type === "pass" && phase.toSlotId) {
        setBallCarrierSlotId(phase.toSlotId);
        await sleep(100);
      }
    }

    if (cancelledRef.current) return;
    setStage("goal");
    await sleep(2200);
    if (cancelledRef.current) return;
    setStage("done");
  }, [replay, layout]);

  useEffect(() => {
    runSequence();
    return () => {
      cancelledRef.current = true;
    };
  }, [runSequence]);

  const scorerSlot = slots.find((s) => s.slotId === replay.scorerSlotId);
  const scorerDisplay =
    scorerSlot?.player?.name.split(" ").pop()?.toUpperCase() ??
    replay.goalEvent.scorerName.split(" ").pop()?.toUpperCase() ??
    "GOL";

  const isHomeGoal = replay.goalEvent.team === "home";

  return (
    <div className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-[var(--color-broadcast)]/95 backdrop-blur-md p-4">
      <button
        type="button"
        onClick={onDismiss}
        className="absolute top-4 right-4 z-20 font-display text-xs tracking-widest text-white/50 hover:text-[var(--color-gold)] uppercase"
      >
        Pular
      </button>

      <AnimatePresence>
        {stage === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-[12%] text-center z-10"
          >
            <p className="font-display text-sm tracking-[0.5em] text-[var(--color-gold)]">
              ⟲ INSTANT REPLAY
            </p>
            <motion.p
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 1, 0.6] }}
              transition={{ duration: 0.8 }}
              className="font-display text-4xl text-[var(--color-cream)] mt-2"
            >
              {replay.goalEvent.minute}&apos;
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative w-full max-w-xs sm:max-w-sm aspect-[3/4] overflow-hidden rounded-xl border-2 border-white/20 shadow-2xl">
        <motion.div
          className="absolute inset-0 origin-center"
          animate={{
            scale: stage === "playing" || stage === "goal" ? replay.cameraFocus.scale : 1,
          }}
          style={{
            transformOrigin: `${replay.cameraFocus.x}% ${replay.cameraFocus.y}%`,
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="absolute inset-0 bg-[var(--color-pitch)]">
            <div className="absolute inset-x-0 top-0 h-px bg-white/30" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-white/30" />
            <div className="absolute inset-y-0 left-0 w-px bg-white/30" />
            <div className="absolute inset-y-0 right-0 w-px bg-white/30" />
            <div className="absolute left-0 right-0 top-1/2 h-px bg-white/30" />
            <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30" />
            <div className="absolute left-1/4 right-1/4 top-0 h-12 border-x border-b border-white/20" />
            <div className="absolute left-1/4 right-1/4 bottom-0 h-12 border-x border-t border-white/20" />
          </div>

          {slots.map((slot) => {
            const pos = layout[slot.slotId];
            if (!pos || !slot.player) return null;
            const isActive = activeSlots.has(slot.slotId);
            const isScorer = slot.slotId === replay.scorerSlotId;
            const hasBall = ballCarrierSlotId === slot.slotId;

            return (
              <div
                key={slot.slotId}
                className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  opacity: isActive ? 1 : 0.35,
                  zIndex: hasBall ? 15 : isActive ? 10 : 1,
                }}
              >
                <div
                  className={`relative flex h-9 w-9 items-center justify-center rounded-full border-2 text-[10px] font-bold shadow-lg transition-transform duration-200 ${
                    isScorer && stage === "goal"
                      ? "border-[var(--color-gold)] bg-[var(--color-gold)]/30 text-[var(--color-gold)] scale-125"
                      : hasBall
                        ? "border-white bg-[var(--color-broadcast)] text-[var(--color-cream)] scale-110"
                        : isActive
                          ? "border-[var(--color-gold)]/80 bg-[var(--color-broadcast)]/90 text-[var(--color-cream)]"
                          : "border-white/40 bg-[var(--color-broadcast)]/70 text-[var(--color-cream)]/80"
                  }`}
                >
                  {slot.player.ovr}
                </div>
              </div>
            );
          })}

          {phaseIndex >= 0 && replay.phases[phaseIndex] && (
            <svg
              className="absolute inset-0 z-[5] pointer-events-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <motion.line
                key={`line-${phaseIndex}`}
                x1={replay.phases[phaseIndex].from.x}
                y1={replay.phases[phaseIndex].from.y}
                x2={replay.phases[phaseIndex].to.x}
                y2={replay.phases[phaseIndex].to.y}
                stroke="rgba(255,255,255,0.35)"
                strokeWidth="0.4"
                strokeDasharray="1.5 1"
                initial={{ pathLength: 0, opacity: 0.6 }}
                animate={{ pathLength: 1, opacity: 0 }}
                transition={{
                  duration: replay.phases[phaseIndex].durationMs / 1000,
                  ease: "easeOut",
                }}
              />
            </svg>
          )}

          <motion.div
            className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)] z-20"
            animate={coordToStyle(ballPos)}
            transition={{
              duration:
                phaseIndex >= 0
                  ? (replay.phases[phaseIndex]?.durationMs ?? 300) / 1000
                  : 0.05,
              ease: phaseIndex >= 0 && replay.phases[phaseIndex]?.type === "shot"
                ? "easeIn"
                : "easeInOut",
            }}
          />
        </motion.div>

        <AnimatePresence>
          {stage === "goal" && (
            <motion.div
              key="flash"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.85, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className={`absolute inset-0 z-30 pointer-events-none ${
                isHomeGoal ? "bg-[var(--color-gold)]" : "bg-red-500"
              }`}
            />
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {(stage === "goal" || stage === "done") && (
          <motion.div
            key="celebration"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 text-center"
          >
            <p
              className={`font-display text-sm tracking-[0.35em] ${
                isHomeGoal ? "text-green-400" : "text-red-400"
              }`}
            >
              {isHomeGoal ? "GOL!" : "GOL SOFRIDO"}
            </p>
            <p className="font-display text-5xl text-[var(--color-gold)] mt-2 tracking-widest">
              {scorerDisplay}
            </p>
            <p className="text-sm opacity-70 mt-2">
              {replay.goalEvent.minute}&apos; · {replay.scoreAfter.home} ×{" "}
              {replay.scoreAfter.away} vs {replay.opponentName}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {stage === "done" && (
        <motion.button
          type="button"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onDismiss}
          className="mt-8 font-display tracking-widest text-[var(--color-gold)] border border-[var(--color-gold)]/50 px-8 py-3 rounded hover:bg-[var(--color-gold)]/10 uppercase text-sm"
        >
          {continueLabel}
        </motion.button>
      )}
    </div>
  );
});
