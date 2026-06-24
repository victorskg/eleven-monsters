import { memo } from "react";
import type { DraftSlot, FormationId, GameMode } from "../../engine/types";
import { getPitchLayout } from "../../engine/formations";

interface PitchFieldProps {
  slots: DraftSlot[];
  formationId: FormationId;
  currentSlotId?: string;
  mode?: GameMode;
  readonly?: boolean;
  compact?: boolean;
  size?: "default" | "large";
  className?: string;
}

export const PitchField = memo(function PitchField({
  slots,
  formationId,
  currentSlotId,
  mode = "classic",
  readonly = false,
  compact = false,
  size = "default",
  className = "",
}: PitchFieldProps) {
  const layout = getPitchLayout(formationId);
  const isLarge = size === "large" && !compact;

  const sizeClasses = compact
    ? "max-w-xs h-[min(52vh,480px)]"
    : isLarge
      ? "w-full h-[min(62vh,720px)] max-w-3xl"
      : "w-full max-w-2xl aspect-[3/4]";

  const tokenSize = compact
    ? "h-8 w-8 text-[9px]"
    : isLarge
      ? "h-12 w-12 text-xs sm:h-14 sm:w-14 sm:text-sm"
      : "h-10 w-10 text-[10px]";

  const nameSize = compact
    ? "max-w-[48px] text-[8px]"
    : isLarge
      ? "max-w-[80px] text-[10px] sm:text-xs"
      : "max-w-[64px] text-[9px]";

  return (
    <div
      className={`relative mx-auto rounded-lg border-2 border-white/20 overflow-hidden shadow-2xl ${sizeClasses} ${className}`}
    >
      <div className="absolute inset-0 bg-[var(--color-pitch)]">
        <div className="absolute inset-x-0 top-0 h-px bg-white/30" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-white/30" />
        <div className="absolute inset-y-0 left-0 w-px bg-white/30" />
        <div className="absolute inset-y-0 right-0 w-px bg-white/30" />
        <div className="absolute left-0 right-0 top-1/2 h-px bg-white/30" />
        <div
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30 ${
            isLarge ? "h-24 w-24" : "h-16 w-16"
          }`}
        />
        <div
          className={`absolute left-1/4 right-1/4 top-0 border-b border-x border-white/20 ${
            isLarge ? "h-20" : "h-12"
          }`}
        />
        <div
          className={`absolute left-1/4 right-1/4 bottom-0 border-t border-x border-white/20 ${
            isLarge ? "h-20" : "h-12"
          }`}
        />
      </div>

      {slots.map((slot) => {
        const pos = layout[slot.slotId];
        if (!pos) return null;

        const isCurrent = !readonly && slot.slotId === currentSlotId && !slot.player;

        return (
          <div
            key={slot.slotId}
            className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          >
            <div
              className={`flex flex-col items-center ${
                isLarge ? "min-w-[60px]" : compact ? "min-w-[40px]" : "min-w-[52px]"
              } ${isCurrent ? "scale-110" : slot.player ? "scale-100" : "scale-90 opacity-50"}`}
            >
              <div
                className={`flex items-center justify-center rounded-full border-2 font-bold shadow-lg ${tokenSize} ${
                  isCurrent
                    ? "border-[var(--color-gold)] bg-[var(--color-gold)]/20 text-[var(--color-gold)] animate-pulse"
                    : slot.player
                      ? "border-white/60 bg-[var(--color-broadcast)]/80 text-[var(--color-cream)]"
                      : "border-dashed border-white/30 bg-black/40 text-white/40"
                }`}
              >
                {slot.player
                  ? mode === "classic"
                    ? slot.player.ovr
                    : "?"
                  : slot.label}
              </div>
              {slot.player && (
                <span
                  className={`mt-0.5 truncate font-bold text-center text-[var(--color-cream)] drop-shadow ${nameSize}`}
                >
                  {slot.player.name.split(" ").pop()}
                </span>
              )}
              {!slot.player && (
                <span
                  className={`mt-0.5 text-white/50 ${compact ? "text-[7px]" : "text-[8px]"}`}
                >
                  {slot.label}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
});

export function getNextEmptySlot(slots: DraftSlot[]) {
  return slots.find((s) => !s.player);
}
