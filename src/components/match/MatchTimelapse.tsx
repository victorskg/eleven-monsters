import { memo, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { GoalEvent, MatchResult } from "../../engine/types";

interface MatchTimelapseProps {
  result: MatchResult;
  opponentName: string;
  onComplete: () => void;
}

const TICK_MS = 80;

function eventKey(event: GoalEvent): string {
  return `${event.period}-${event.minute}-${event.team}-${event.scorerName}-${event.description}`;
}

function formatClock(minute: number, wentToET: boolean): string {
  if (minute === 45) return "HT";
  if (minute > 90 && wentToET) return `${minute}' ET`;
  if (minute >= 90) return `90+${minute - 90}'`;
  return `${minute}'`;
}

export const MatchTimelapse = memo(function MatchTimelapse({
  result,
  opponentName,
  onComplete,
}: MatchTimelapseProps) {
  const [minute, setMinute] = useState(0);
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [visibleEvents, setVisibleEvents] = useState<GoalEvent[]>([]);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const endMinute = result.wentToExtraTime ? 120 : 90;

  useEffect(() => {
    const goalEvents = result.events.filter((e) => e.period !== "penalties");
    const penaltyEvent = result.events.find((e) => e.period === "penalties");

    let currentMinute = 0;
    let cancelled = false;
    const shownKeys = new Set<string>();

    const interval = setInterval(() => {
      if (cancelled) return;

      currentMinute += 1;
      setMinute(currentMinute);

      const newGoals = goalEvents.filter(
        (e) => e.minute <= currentMinute && e.minute > currentMinute - 1,
      );

      if (newGoals.length > 0) {
        const toShow: GoalEvent[] = [];
        let homeDelta = 0;
        let awayDelta = 0;

        for (const goal of newGoals) {
          const key = eventKey(goal);
          if (shownKeys.has(key)) continue;
          shownKeys.add(key);
          toShow.push(goal);
          if (goal.team === "home") homeDelta += 1;
          else awayDelta += 1;
        }

        if (toShow.length > 0) {
          setVisibleEvents((prev) => [...prev, ...toShow]);
          if (homeDelta > 0) setHomeScore((s) => s + homeDelta);
          if (awayDelta > 0) setAwayScore((s) => s + awayDelta);
        }
      }

      if (currentMinute >= endMinute) {
        clearInterval(interval);

        if (penaltyEvent) {
          const key = eventKey(penaltyEvent);
          if (!shownKeys.has(key)) {
            shownKeys.add(key);
            setVisibleEvents((prev) => [...prev, penaltyEvent]);
          }
        }

        setTimeout(() => {
          if (!cancelled) onCompleteRef.current();
        }, 1200);
      }
    }, TICK_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [result, endMinute]);

  const progress = Math.min(100, (minute / endMinute) * 100);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto">
      {/* Placar */}
      <div className="text-center">
        <p className="font-display text-sm tracking-widest opacity-60 mb-2">
          {opponentName}
        </p>
        <div className="flex items-center justify-center gap-6">
          <span className="font-display text-6xl text-[var(--color-gold)]">
            {homeScore}
          </span>
          <motion.span
            key={minute}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="font-display text-2xl text-[var(--color-cream)]/70 min-w-[60px] text-center"
          >
            {formatClock(minute, result.wentToExtraTime)}
          </motion.span>
          <span className="font-display text-6xl text-[var(--color-gold)]">
            {awayScore}
          </span>
        </div>
        {result.wentToExtraTime && minute > 90 && (
          <p className="mt-1 text-xs text-yellow-400/80 uppercase tracking-widest">
            Prorrogação
          </p>
        )}
      </div>

      {/* Barra de progresso */}
      <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-[var(--color-gold)]"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.05 }}
        />
      </div>

      {/* Feed de eventos */}
      <div className="w-full space-y-2 min-h-[120px]">
        <AnimatePresence>
          {visibleEvents.map((ev) => (
            <motion.div
              key={eventKey(ev)}
              initial={{ opacity: 0, y: 10, x: ev.team === "home" ? -20 : 20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              className={`rounded px-3 py-2 text-sm flex items-center gap-2 ${
                ev.period === "penalties"
                  ? "bg-yellow-900/40 border border-yellow-600/30"
                  : ev.team === "home"
                    ? "bg-green-900/30"
                    : "bg-red-900/30"
              }`}
            >
              <span className="font-display text-[var(--color-gold)] min-w-[40px]">
                {ev.period === "penalties" ? "PEN" : `${ev.minute}'`}
              </span>
              <span>
                {ev.period === "penalties"
                  ? ev.description
                  : `${ev.scorerName} ⚽`}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
});
