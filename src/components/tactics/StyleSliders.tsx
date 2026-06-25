import { memo } from "react";
import type { PlayStyle } from "../../engine/types";

function StyleSlider({
  label,
  value,
  onChange,
  id,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  id: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <label htmlFor={id} className="font-display text-sm tracking-wide">
          {label}
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
        className="w-full h-2 appearance-none rounded-full bg-black/40 accent-[var(--color-gold)] cursor-pointer"
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

interface StyleSlidersProps {
  playStyle: PlayStyle;
  onChange: (style: Partial<PlayStyle>) => void;
  idPrefix?: string;
}

export const StyleSliders = memo(function StyleSliders({
  playStyle,
  onChange,
  idPrefix = "",
}: StyleSlidersProps) {
  const prefix = idPrefix ? `${idPrefix}-` : "";
  return (
    <div className="space-y-5">
      <StyleSlider
        id={`${prefix}pressing`}
        label="Pressão"
        value={playStyle.pressing}
        onChange={(v) => onChange({ pressing: v })}
      />
      <StyleSlider
        id={`${prefix}width`}
        label="Largura"
        value={playStyle.width}
        onChange={(v) => onChange({ width: v })}
      />
      <StyleSlider
        id={`${prefix}tempo`}
        label="Ritmo"
        value={playStyle.tempo}
        onChange={(v) => onChange({ tempo: v })}
      />
    </div>
  );
});
