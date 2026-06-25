import type { PlayStyle } from "../../engine/types";

export interface SquadTrait {
  squadId: string;
  label: string;
  minPlayers: number;
  bonus: number;
  playStyleBonus?: Partial<PlayStyle>;
  description: string;
}

export const SQUAD_TRAITS: SquadTrait[] = [
  {
    squadId: "bra-1970",
    label: "Brasil 1970",
    minPlayers: 3,
    bonus: 0.1,
    playStyleBonus: { tempo: 5, width: 5 },
    description: "Jogo bonito — ritmo e largura",
  },
  {
    squadId: "bra-1970",
    label: "Brasil 1970",
    minPlayers: 5,
    bonus: 0.15,
    playStyleBonus: { tempo: 10, width: 8 },
    description: "Seleção completa — domínio total",
  },
  {
    squadId: "arg-2022",
    label: "Argentina 2022",
    minPlayers: 3,
    bonus: 0.1,
    description: "Campeões do mundo — coletivo sólido",
  },
  {
    squadId: "arg-2022",
    label: "Argentina 2022",
    minPlayers: 5,
    bonus: 0.15,
    description: "Albiceleste completa",
  },
  {
    squadId: "arg-1986",
    label: "Argentina 1986",
    minPlayers: 3,
    bonus: 0.1,
    description: "Maradona e companhia",
  },
  {
    squadId: "ned-1974",
    label: "Holanda 1974",
    minPlayers: 3,
    bonus: 0.1,
    playStyleBonus: { width: 8, tempo: 5 },
    description: "Futebol total — posse e largura",
  },
  {
    squadId: "esp-2010",
    label: "Espanha 2010",
    minPlayers: 3,
    bonus: 0.1,
    playStyleBonus: { tempo: 3, pressing: 5 },
    description: "Tiki-taka — controle de posse",
  },
  {
    squadId: "ger-2014",
    label: "Alemanha 2014",
    minPlayers: 3,
    bonus: 0.1,
    playStyleBonus: { pressing: 8 },
    description: "Pressing alemão",
  },
  {
    squadId: "fra-1998",
    label: "França 1998",
    minPlayers: 3,
    bonus: 0.1,
    description: "Les Bleus campeões",
  },
  {
    squadId: "ita-2006",
    label: "Itália 2006",
    minPlayers: 3,
    bonus: 0.1,
    playStyleBonus: { pressing: -5, width: -5 },
    description: "Catenaccio moderno — defesa sólida",
  },
  {
    squadId: "bra-2002",
    label: "Brasil 2002",
    minPlayers: 3,
    bonus: 0.1,
    playStyleBonus: { tempo: 5 },
    description: "Penta campeão — ataque fluido",
  },
  {
    squadId: "gre-2004",
    label: "Grécia 2004",
    minPlayers: 3,
    bonus: 0.08,
    playStyleBonus: { pressing: -8, width: -5 },
    description: "Muro grego — retranca",
  },
];

export function getSquadTraitBonus(
  squadId: string,
  count: number,
): { bonus: number; trait: SquadTrait | null } {
  const traits = SQUAD_TRAITS.filter((t) => t.squadId === squadId).sort(
    (a, b) => b.minPlayers - a.minPlayers,
  );

  for (const trait of traits) {
    if (count >= trait.minPlayers) {
      return { bonus: trait.bonus, trait };
    }
  }

  return { bonus: 0, trait: null };
}
