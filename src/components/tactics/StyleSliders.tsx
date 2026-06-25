import { memo } from "react";
import type { PlayStyle } from "../../engine/types";

function StyleSlider({
  label,
  value,
  onChange,
  id,
  highlight,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  id: string;
  highlight?: boolean;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="font-display text-sm tracking-wide">
          {label}
          {highlight && (
            <span className="ml-1.5 text-[10px] text-[var(--color-gold)]">
              ↑ explorar
            </span>
          )}
        </label>
        <span className="text-sm opacity-70">{value}</span>
      </div>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full h-2 appearance-none rounded-full bg-black/40 accent-[var(--color-gold)] cursor-pointer ${
          highlight ? "ring-1 ring-[var(--color-gold)]/40" : ""
        }`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
      />
      <div className="flex justify-between text-[10px] opacity-40">
        <span>Baixo</span>
        <span>Alto</span>
      </div>
    </div>
  );
}

export interface StyleSliderHints {
  pressing?: boolean;
  width?: boolean;
  tempo?: boolean;
}

interface StyleSlidersProps {
  playStyle: PlayStyle;
  onChange: (style: Partial<PlayStyle>) => void;
  idPrefix?: string;
  hints?: StyleSliderHints;
}

export const StyleSliders = memo(function StyleSliders({
  playStyle,
  onChange,
  idPrefix = "",
  hints,
}: StyleSlidersProps) {
  const prefix = idPrefix ? `${idPrefix}-` : "";
  return (
    <div className="space-y-5">
      <StyleSlider
        id={`${prefix}pressing`}
        label="Pressão"
        value={playStyle.pressing}
        onChange={(v) => onChange({ pressing: v })}
        highlight={hints?.pressing}
      />
      <StyleSlider
        id={`${prefix}width`}
        label="Largura"
        value={playStyle.width}
        onChange={(v) => onChange({ width: v })}
        highlight={hints?.width}
      />
      <StyleSlider
        id={`${prefix}tempo`}
        label="Ritmo"
        value={playStyle.tempo}
        onChange={(v) => onChange({ tempo: v })}
        highlight={hints?.tempo}
      />
    </div>
  );
});
