import { memo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TournamentPhase } from "../../engine/types";
import { getPhaseCelebrationCopy } from "../../engine/tournament";

interface PhaseAdvanceOverlayProps {
  phase: TournamentPhase | null;
  onDismiss: () => void;
}

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  angle: (i / 18) * Math.PI * 2,
  distance: 80 + (i % 5) * 28,
  size: 4 + (i % 3) * 3,
  delay: (i % 6) * 0.03,
}));

export const PhaseAdvanceOverlay = memo(function PhaseAdvanceOverlay({
  phase,
  onDismiss,
}: PhaseAdvanceOverlayProps) {
  useEffect(() => {
    if (!phase) return;
    const timer = setTimeout(onDismiss, 4200);
    return () => clearTimeout(timer);
  }, [phase, onDismiss]);

  const copy = phase ? getPhaseCelebrationCopy(phase) : null;

  return (
    <AnimatePresence>
      {phase && copy && (
        <motion.div
          key={phase}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          onClick={onDismiss}
          role="dialog"
          aria-live="polite"
          aria-label={`${copy.title} ${copy.phaseLine}`}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[var(--color-broadcast)]/85 backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: [0.6, 1.08, 1], opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 pointer-events-none"
          >
            <motion.div
              className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(212,175,55,0.35) 0%, transparent 70%)",
              }}
              animate={{ scale: [0.8, 1.4, 1.1], opacity: [0.4, 0.9, 0.5] }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
            {PARTICLES.map((p) => (
              <motion.span
                key={p.id}
                className="absolute left-1/2 top-1/2 rounded-full bg-[var(--color-gold)]"
                style={{ width: p.size, height: p.size }}
                initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                animate={{
                  x: Math.cos(p.angle) * p.distance,
                  y: Math.sin(p.angle) * p.distance,
                  opacity: [0, 1, 0],
                  scale: [0, 1.2, 0.4],
                }}
                transition={{
                  duration: 1.1,
                  delay: 0.15 + p.delay,
                  ease: "easeOut",
                }}
              />
            ))}
          </motion.div>

          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
            className="relative z-10 max-w-md text-center"
          >
            <motion.p
              initial={{ letterSpacing: "0.5em", opacity: 0 }}
              animate={{ letterSpacing: "0.15em", opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="font-display text-sm uppercase text-green-400"
            >
              {copy.title}
            </motion.p>

            <motion.h2
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.45,
                type: "spring",
                stiffness: 180,
                damping: 14,
              }}
              className="mt-3 font-display text-4xl sm:text-5xl leading-none tracking-widest text-[var(--color-gold)] drop-shadow-[0_0_24px_rgba(212,175,55,0.45)]"
            >
              {copy.phaseLine}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.45 }}
              className="mt-5 text-base italic text-[var(--color-cream)]/85"
            >
              {copy.subtitle}
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0.5] }}
              transition={{ delay: 1.6, duration: 0.8 }}
              className="mt-10 text-[10px] uppercase tracking-[0.3em] text-white/40"
            >
              Toque para continuar
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
