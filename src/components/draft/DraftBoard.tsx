import { memo } from "react";
import type { DraftSlot } from "../../engine/types";

interface DraftBoardProps {
  slots: DraftSlot[];
  currentSlotId?: string;
}

export const DraftBoard = memo(function DraftBoard({
  slots,
  currentSlotId,
}: DraftBoardProps) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11">
      {slots.map((slot) => {
        const isCurrent = slot.slotId === currentSlotId && !slot.player;
        return (
          <div
            key={slot.slotId}
            className={`flex flex-col items-center rounded border p-2 transition-all ${
              isCurrent
                ? "border-[var(--color-gold)] bg-[var(--color-gold)]/10 scale-105"
                : slot.player
                  ? "border-[var(--color-pitch-light)] bg-black/20"
                  : "border-white/10 bg-black/10 opacity-50"
            }`}
          >
            <span className="font-display text-[10px] tracking-widest text-[var(--color-gold)]">
              {slot.label}
            </span>
            {slot.player ? (
              <div className="mt-1 text-center">
                <p className="text-[10px] font-bold leading-tight">
                  {slot.player.name.split(" ").pop()}
                </p>
                <p className="text-[9px] opacity-60">
                  {slot.player.nation} &apos;{String(slot.player.year).slice(-2)}
                </p>
                <p
                  className="font-display text-sm mt-0.5"
                  style={{
                    color: slot.player.ovr >= 90 ? "var(--color-gold)" : undefined,
                  }}
                >
                  {slot.player.ovr}
                </p>
              </div>
            ) : (
              <div className="mt-2 h-8 w-8 rounded-full border-2 border-dashed border-white/20" />
            )}
          </div>
        );
      })}
    </div>
  );
});

export function getNextEmptySlot(slots: DraftSlot[]) {
  return slots.find((s) => !s.player);
}
