import type { PackOffer, Player, Position } from "./types";
import { createRng } from "./rng";

const POSITION_GROUPS: Record<Position, Position[]> = {
  GK: ["GK"],
  CB: ["CB"],
  LB: ["LB", "CB"],
  RB: ["RB", "CB"],
  CDM: ["CDM", "CM", "CB"],
  CM: ["CM", "CDM", "CAM"],
  CAM: ["CAM", "CM", "LW", "RW"],
  LW: ["LW", "CAM", "ST"],
  RW: ["RW", "CAM", "ST"],
  ST: ["ST", "LW", "RW"],
};

function canPlayPosition(player: Player, slotPosition: Position): boolean {
  return POSITION_GROUPS[slotPosition].includes(player.position);
}

function weightedPick(
  pool: Player[],
  rng: () => number,
  exclude: Set<string>,
): Player | null {
  const available = pool.filter((p) => !exclude.has(p.id));
  if (available.length === 0) return null;

  const weights = available.map((p) => {
    const ovrFactor = Math.max(1, p.ovr - 60);
    return 100 / ovrFactor;
  });
  const total = weights.reduce((a, b) => a + b, 0);
  let roll = rng() * total;

  for (let i = 0; i < available.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return available[i];
  }
  return available[available.length - 1];
}

export function generatePack(
  pool: Player[],
  slotId: string,
  position: Position,
  seed: number,
  packIndex: number,
): PackOffer {
  const rng = createRng(seed + packIndex * 7919);
  const eligible = pool.filter((p) => canPlayPosition(p, position));
  const picked: Player[] = [];
  const used = new Set<string>();

  while (picked.length < 3) {
    const player = weightedPick(eligible, rng, used);
    if (!player) break;
    picked.push(player);
    used.add(player.id);
  }

  while (picked.length < 3 && eligible.length > picked.length) {
    const remaining = eligible.filter((p) => !used.has(p.id));
    const fallback = remaining[Math.floor(rng() * remaining.length)];
    picked.push(fallback);
    used.add(fallback.id);
  }

  return { slotId, position, players: picked };
}
