import type { Player, Squad } from "../../engine/types";
import { LOTE1_SQUADS } from "./lote1";
import { LOTE2_SQUADS } from "./lote2";
import { LOTE3_SQUADS } from "./lote3";

export const ALL_SQUADS: Squad[] = [
  ...LOTE1_SQUADS,
  ...LOTE2_SQUADS,
  ...LOTE3_SQUADS,
];

export function getAllPlayers(): Player[] {
  return ALL_SQUADS.flatMap((s) => s.players);
}

export function getPlayerPool(): Player[] {
  return getAllPlayers();
}
