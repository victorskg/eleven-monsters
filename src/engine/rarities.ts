import type { Rarity } from "./types";

export const RARITY_THRESHOLDS: { min: number; rarity: Rarity }[] = [
  { min: 95, rarity: "legendary" },
  { min: 90, rarity: "epic" },
  { min: 83, rarity: "rare" },
  { min: 75, rarity: "uncommon" },
  { min: 0, rarity: "common" },
];

export function getRarity(ovr: number): Rarity {
  for (const t of RARITY_THRESHOLDS) {
    if (ovr >= t.min) return t.rarity;
  }
  return "common";
}

export const RARITY_ORDER: Rarity[] = [
  "common",
  "uncommon",
  "rare",
  "epic",
  "legendary",
];

export function maxRarity(rarities: Rarity[]): Rarity {
  return rarities.reduce((best, r) =>
    RARITY_ORDER.indexOf(r) > RARITY_ORDER.indexOf(best) ? r : best,
  );
}

export const RARITY_COLORS: Record<
  Rarity,
  { border: string; glow: string; label: string }
> = {
  common: {
    border: "#6b7280",
    glow: "rgba(107,114,128,0.3)",
    label: "Comum",
  },
  uncommon: {
    border: "#22c55e",
    glow: "rgba(34,197,94,0.4)",
    label: "Incomum",
  },
  rare: {
    border: "#3b82f6",
    glow: "rgba(59,130,246,0.5)",
    label: "Raro",
  },
  epic: {
    border: "#a855f7",
    glow: "rgba(168,85,247,0.6)",
    label: "Épico",
  },
  legendary: {
    border: "#d4af37",
    glow: "rgba(212,175,55,0.7)",
    label: "Lendário",
  },
};
