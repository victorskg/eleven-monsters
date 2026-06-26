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
  {
    squadId: "ned-1988",
    label: "Holanda 1988",
    minPlayers: 3,
    bonus: 0.1,
    playStyleBonus: { width: 6, tempo: 6 },
    description: "Euro campeã — ataque total",
  },
  {
    squadId: "ger-1974",
    label: "Alemanha 1974",
    minPlayers: 3,
    bonus: 0.1,
    playStyleBonus: { pressing: 5, tempo: 3 },
    description: "Máquina de Müller — eficiência alemã",
  },
  {
    squadId: "ita-1982",
    label: "Itália 1982",
    minPlayers: 3,
    bonus: 0.1,
    playStyleBonus: { pressing: -3, width: -3 },
    description: "Azzurra campeã — defesa e contra-ataque",
  },
  {
    squadId: "hun-1954",
    label: "Hungria 1954",
    minPlayers: 3,
    bonus: 0.1,
    playStyleBonus: { tempo: 8, width: 5 },
    description: "Magyar Maravilha — futebol ofensivo",
  },
  {
    squadId: "cro-2018",
    label: "Croácia 2018",
    minPlayers: 3,
    bonus: 0.1,
    playStyleBonus: { tempo: 4, pressing: 4 },
    description: "Vice campeã — meio técnico e garra",
  },
  {
    squadId: "uru-2010",
    label: "Uruguai 2010",
    minPlayers: 3,
    bonus: 0.1,
    description: "La Celeste — garra e talento",
  },
  {
    squadId: "mex-1986",
    label: "México 1986",
    minPlayers: 3,
    bonus: 0.08,
    description: "Anfitrião — coragem no Azteca",
  },
  {
    squadId: "jpn-2002",
    label: "Japão 2002",
    minPlayers: 3,
    bonus: 0.08,
    playStyleBonus: { tempo: 5, pressing: 5 },
    description: "Coletivo azul — organização e técnica",
  },
  {
    squadId: "sen-2002",
    label: "Senegal 2002",
    minPlayers: 3,
    bonus: 0.08,
    playStyleBonus: { pressing: 5, tempo: 4 },
    description: "Leões de Teranga — físico e transição",
  },
  {
    squadId: "bra-2010",
    label: "Brasil 2010",
    minPlayers: 3,
    bonus: 0.1,
    playStyleBonus: { tempo: 5, width: 4 },
    description: "Canarinho — meio criativo",
  },
  {
    squadId: "bra-2014",
    label: "Brasil 2014",
    minPlayers: 3,
    bonus: 0.1,
    playStyleBonus: { width: 5, tempo: 4 },
    description: "Seleção da Copa em casa",
  },
  {
    squadId: "ger-2010",
    label: "Alemanha 2010",
    minPlayers: 3,
    bonus: 0.1,
    playStyleBonus: { pressing: 6, tempo: 4 },
    description: "Jovens alemães — transição rápida",
  },
  {
    squadId: "bra-2026",
    label: "Brasil 2026",
    minPlayers: 3,
    bonus: 0.1,
    playStyleBonus: { tempo: 6, width: 5 },
    description: "Nova geração — velocidade e técnica",
  },
  {
    squadId: "fra-2026",
    label: "França 2026",
    minPlayers: 3,
    bonus: 0.1,
    description: "Bleus — elenco completo",
  },
  {
    squadId: "nor-2026",
    label: "Noruega 2026",
    minPlayers: 3,
    bonus: 0.1,
    playStyleBonus: { tempo: 5, pressing: 4 },
    description: "Haaland e Ødegaard — ataque direto",
  },
  {
    squadId: "jpn-2026",
    label: "Japão 2026",
    minPlayers: 3,
    bonus: 0.08,
    playStyleBonus: { pressing: 6, tempo: 5 },
    description: "Samurai Blue — pressão coletiva",
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
