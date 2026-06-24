import { memo } from "react";

interface StatBarProps {
  label: string;
  value: number;
  max?: number;
  color?: string;
}

export const StatBar = memo(function StatBar({
  label,
  value,
  max = 100,
  color = "var(--color-gold)",
}: StatBarProps) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="uppercase tracking-wide opacity-80">{label}</span>
        <span className="font-display text-sm">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-black/30">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
});
