import type { Player, Squad } from "../../engine/types";

export function p(
  squadId: string,
  nation: string,
  year: number,
  id: string,
  name: string,
  position: Player["position"],
  ovr: number,
  attrs: Partial<Player["attributes"]> = {},
): Player {
  const base = {
    pace: ovr - 2,
    shooting: ovr - 3,
    passing: ovr - 1,
    defending: ovr - 4,
    physical: ovr - 2,
  };
  return {
    id: `${squadId}-${id}`,
    name,
    nation,
    year,
    squadId,
    position,
    ovr,
    attributes: { ...base, ...attrs },
  };
}

export function squad(
  id: string,
  nation: string,
  year: number,
  label: string,
  players: Player[],
): Squad {
  return { id, nation, year, label, players };
}
