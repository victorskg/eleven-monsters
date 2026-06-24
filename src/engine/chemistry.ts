import type { Player } from "./types";

const LEGENDARY_PAIRS: [string, string][] = [
  ["pele", "garrincha"],
  ["messi", "maradona"],
  ["xavi", "iniesta"],
  ["zidane", "henry"],
  ["cruyff", "rep"],
];

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function calculateChemistryBonus(players: Player[]): number {
  let bonus = 0;
  const names = players.map((p) => normalizeName(p.name));
  const nations = players.map((p) => p.nation);
  const years = players.map((p) => p.year);

  for (const [a, b] of LEGENDARY_PAIRS) {
    if (names.some((n) => n.includes(a)) && names.some((n) => n.includes(b))) {
      bonus += 0.08;
    }
  }

  const nationCounts = new Map<string, number>();
  for (const n of nations) {
    nationCounts.set(n, (nationCounts.get(n) ?? 0) + 1);
  }
  for (const count of nationCounts.values()) {
    if (count >= 3) bonus += 0.02;
    if (count >= 5) bonus += 0.03;
  }

  const yearCounts = new Map<number, number>();
  for (const y of years) {
    yearCounts.set(y, (yearCounts.get(y) ?? 0) + 1);
  }
  for (const count of yearCounts.values()) {
    if (count >= 2) bonus += 0.02;
  }

  return Math.min(bonus, 0.2);
}

export function getChemistryNotes(players: Player[]): string[] {
  const notes: string[] = [];
  const names = players.map((p) => normalizeName(p.name));

  for (const [a, b] of LEGENDARY_PAIRS) {
    if (names.some((n) => n.includes(a)) && names.some((n) => n.includes(b))) {
      notes.push(`Dupla lendária ativa (+8% química)`);
      break;
    }
  }

  const nationCounts = new Map<string, number>();
  for (const p of players) {
    nationCounts.set(p.nation, (nationCounts.get(p.nation) ?? 0) + 1);
  }
  for (const [nation, count] of nationCounts) {
    if (count >= 5) notes.push(`${count} jogadores de ${nation} (+5% química)`);
    else if (count >= 3) notes.push(`${count} jogadores de ${nation} (+2% química)`);
  }

  return notes;
}
