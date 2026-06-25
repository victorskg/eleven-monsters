import type { Player } from "./types";
import { getSquadTraitBonus } from "../data/squads/traits";

const CHEMISTRY_CAP = 0.35;

const LEGENDARY_PAIRS: [string, string, string][] = [
  ["pele", "garrincha", "Pelé + Garrincha"],
  ["messi", "maradona", "Messi + Maradona"],
  ["xavi", "iniesta", "Xavi + Iniesta"],
  ["zidane", "henry", "Zidane + Henry"],
  ["cruyff", "rep", "Cruyff + Rep"],
];

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function computeBonus(players: Player[]): { bonus: number; notes: string[] } {
  let bonus = 0;
  const notes: string[] = [];
  const names = players.map((p) => normalizeName(p.name));
  const nations = players.map((p) => p.nation);
  const years = players.map((p) => p.year);

  for (const [a, b, label] of LEGENDARY_PAIRS) {
    if (names.some((n) => n.includes(a)) && names.some((n) => n.includes(b))) {
      bonus += 0.08;
      notes.push(`Dupla lendária: ${label} (+8%)`);
    }
  }

  const nationCounts = new Map<string, number>();
  for (const n of nations) {
    nationCounts.set(n, (nationCounts.get(n) ?? 0) + 1);
  }
  for (const [nation, count] of nationCounts) {
    if (count >= 5) {
      bonus += 0.03;
      notes.push(`${count}× ${nation} (+3%)`);
    } else if (count >= 3) {
      bonus += 0.02;
      notes.push(`${count}× ${nation} (+2%)`);
    }
  }

  const yearCounts = new Map<number, number>();
  for (const y of years) {
    yearCounts.set(y, (yearCounts.get(y) ?? 0) + 1);
  }
  for (const count of yearCounts.values()) {
    if (count >= 2) {
      bonus += 0.02;
      notes.push(`Mesma Copa (${count} jogadores, +2%)`);
      break;
    }
  }

  const squadCounts = new Map<string, number>();
  for (const p of players) {
    squadCounts.set(p.squadId, (squadCounts.get(p.squadId) ?? 0) + 1);
  }
  for (const [squadId, count] of squadCounts) {
    const { bonus: squadBonus, trait } = getSquadTraitBonus(squadId, count);
    if (squadBonus > 0 && trait) {
      bonus += squadBonus;
      notes.push(`${trait.label} (${count} jogadores, +${Math.round(squadBonus * 100)}%)`);
    }
  }

  return { bonus: Math.min(bonus, CHEMISTRY_CAP), notes };
}

export function calculateChemistryBonus(players: Player[]): number {
  return computeBonus(players).bonus;
}

export function getChemistryNotes(players: Player[]): string[] {
  return computeBonus(players).notes;
}

export interface ChemistryDelta {
  deltaPercent: number;
  newNotes: string[];
  brokenNotes: string[];
}

export function previewChemistryDelta(
  currentPlayers: Player[],
  candidate: Player,
): ChemistryDelta {
  const before = computeBonus(currentPlayers);
  const after = computeBonus([...currentPlayers, candidate]);

  const newNotes = after.notes.filter((n) => !before.notes.includes(n));
  const brokenNotes: string[] = [];

  return {
    deltaPercent: Math.round((after.bonus - before.bonus) * 100),
    newNotes,
    brokenNotes,
  };
}

export function getCurrentChemistryPercent(players: Player[]): number {
  return Math.round(calculateChemistryBonus(players) * 100);
}
