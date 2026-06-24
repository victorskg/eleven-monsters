import type { Player, PlayStyle, TeamRatings } from "./types";
import { calculateChemistryBonus } from "./chemistry";

const ATTACK_POSITIONS = new Set(["LW", "RW", "ST", "CAM"]);
const DEFENSE_POSITIONS = new Set(["GK", "CB", "LB", "RB", "CDM"]);
const MIDFIELD_POSITIONS = new Set(["CM", "CAM", "CDM"]);

function avg(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function playerAttackScore(p: Player): number {
  const { shooting, pace, passing, physical } = p.attributes;
  return shooting * 0.4 + pace * 0.25 + passing * 0.2 + physical * 0.15;
}

function playerDefenseScore(p: Player): number {
  const { defending, physical, pace, passing } = p.attributes;
  return defending * 0.45 + physical * 0.3 + pace * 0.15 + passing * 0.1;
}

function playerMidScore(p: Player): number {
  const { passing, pace, defending, shooting } = p.attributes;
  return passing * 0.35 + pace * 0.2 + defending * 0.25 + shooting * 0.2;
}

export function calculateTeamRatings(
  players: Player[],
  playStyle: PlayStyle,
): TeamRatings {
  const attackers = players.filter((p) => ATTACK_POSITIONS.has(p.position));
  const defenders = players.filter((p) => DEFENSE_POSITIONS.has(p.position));
  const midfielders = players.filter((p) => MIDFIELD_POSITIONS.has(p.position));

  const attackBase = avg(attackers.map(playerAttackScore));
  const defenseBase = avg(defenders.map(playerDefenseScore));
  const midBase = avg(midfielders.map(playerMidScore));

  const pressingMod = (playStyle.pressing - 50) / 100;
  const widthMod = (playStyle.width - 50) / 200;
  const tempoMod = (playStyle.tempo - 50) / 150;

  const chemistryBonus = calculateChemistryBonus(players);

  const attack =
    attackBase * (1 + widthMod + tempoMod * 0.5 + pressingMod * 0.3) *
    (1 + chemistryBonus);
  const defense =
    defenseBase * (1 - pressingMod * 0.25 + widthMod * 0.1) *
    (1 + chemistryBonus * 0.5);
  const midfield = midBase * (1 + tempoMod + pressingMod * 0.15);

  const blendedAttack = attack * 0.7 + midfield * 0.3;
  const blendedDefense = defense * 0.75 + midfield * 0.25;

  return {
    attack: Math.round(blendedAttack),
    defense: Math.round(blendedDefense),
    midfield: Math.round(midfield),
    chemistryBonus: Math.round(chemistryBonus * 100),
  };
}
