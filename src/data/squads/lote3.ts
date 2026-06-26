import { p, squad } from "./helpers";

/**
 * Lote 3 — eras 2010–2014 + Copa do Mundo 2026.
 * Elencos 2026 baseados nas convocatórias oficiais (mai/2026).
 */
export const bra2010 = squad("bra-2010", "BRA", 2010, "Brasil 2010", [
  p("bra-2010", "BRA", 2010, "cezar", "Júlio César", "GK", 89),
  p("bra-2010", "BRA", 2010, "maicon", "Maicon", "RB", 90, { shooting: 88 }),
  p("bra-2010", "BRA", 2010, "lucio", "Lúcio", "CB", 91, { defending: 92 }),
  p("bra-2010", "BRA", 2010, "juan", "Juan", "CB", 87),
  p("bra-2010", "BRA", 2010, "bastos", "Bastos", "LB", 84),
  p("bra-2010", "BRA", 2010, "melo", "Felipe Melo", "CDM", 85, { defending: 86 }),
  p("bra-2010", "BRA", 2010, "gilberto", "Gilberto Silva", "CM", 88, { defending: 87 }),
  p("bra-2010", "BRA", 2010, "kaka", "Kaká", "CAM", 93, { passing: 94, shooting: 90 }),
  p("bra-2010", "BRA", 2010, "robinho", "Robinho", "LW", 89, { pace: 92 }),
  p("bra-2010", "BRA", 2010, "fabiano", "Fabiano", "ST", 86, { shooting: 87 }),
  p("bra-2010", "BRA", 2010, "alves", "Dani Alves", "RB", 88, { pace: 89 }),
]);

export const bra2014 = squad("bra-2014", "BRA", 2014, "Brasil 2014", [
  p("bra-2014", "BRA", 2014, "cezar", "Júlio César", "GK", 87),
  p("bra-2014", "BRA", 2014, "alves", "Dani Alves", "RB", 89, { pace: 88 }),
  p("bra-2014", "BRA", 2014, "silva-th", "Thiago Silva", "CB", 91, { defending: 92 }),
  p("bra-2014", "BRA", 2014, "david-luiz", "David Luiz", "CB", 86, { shooting: 84 }),
  p("bra-2014", "BRA", 2014, "marcelo", "Marcelo", "LB", 90, { pace: 91 }),
  p("bra-2014", "BRA", 2014, "fernandinho", "Fernandinho", "CDM", 87),
  p("bra-2014", "BRA", 2014, "paulinho", "Paulinho", "CM", 85),
  p("bra-2014", "BRA", 2014, "oscar", "Oscar", "CAM", 88, { passing: 89 }),
  p("bra-2014", "BRA", 2014, "neymar", "Neymar", "LW", 92, { pace: 93, shooting: 90 }),
  p("bra-2014", "BRA", 2014, "fred", "Fred", "ST", 82),
  p("bra-2014", "BRA", 2014, "hulk", "Hulk", "RW", 87, { physical: 90 }),
]);

export const ger2010 = squad("ger-2010", "GER", 2010, "Alemanha 2010", [
  p("ger-2010", "GER", 2010, "neuer", "Neuer", "GK", 90, { defending: 89 }),
  p("ger-2010", "GER", 2010, "lahm", "Lahm", "RB", 90, { defending: 88 }),
  p("ger-2010", "GER", 2010, "mertesacker", "Mertesacker", "CB", 86, { defending: 87 }),
  p("ger-2010", "GER", 2010, "friedrich", "Friedrich", "CB", 84),
  p("ger-2010", "GER", 2010, "badstuber", "Badstuber", "LB", 83),
  p("ger-2010", "GER", 2010, "schweinsteiger", "Schweinsteiger", "CM", 91, { passing: 90 }),
  p("ger-2010", "GER", 2010, "khedira", "Khedira", "CM", 88),
  p("ger-2010", "GER", 2010, "kroos", "Kroos", "CAM", 89, { passing: 91 }),
  p("ger-2010", "GER", 2010, "ozeil", "Özil", "CAM", 91, { passing: 93 }),
  p("ger-2010", "GER", 2010, "mueller-t", "Thomas Müller", "ST", 90, { shooting: 89 }),
  p("ger-2010", "GER", 2010, "klose", "Klose", "ST", 89, { shooting: 90 }),
]);

// Convocados CBF (18/05/2026). Éderson (Atalanta) entrou no lugar de Wesley.
export const bra2026 = squad("bra-2026", "BRA", 2026, "Brasil 2026", [
  p("bra-2026", "BRA", 2026, "alisson", "Alisson", "GK", 91, { defending: 90 }),
  p("bra-2026", "BRA", 2026, "danilo", "Danilo", "RB", 86, { defending: 85 }),
  p("bra-2026", "BRA", 2026, "marquinhos", "Marquinhos", "CB", 91, { defending: 92 }),
  p("bra-2026", "BRA", 2026, "gabriel", "Gabriel", "CB", 90, { defending: 91 }),
  p("bra-2026", "BRA", 2026, "alex-sandro", "Alex Sandro", "LB", 83),
  p("bra-2026", "BRA", 2026, "casemiro", "Casemiro", "CDM", 87, { defending: 88 }),
  p("bra-2026", "BRA", 2026, "bruno-guimaraes", "Bruno Guimarães", "CM", 91, { passing: 92 }),
  p("bra-2026", "BRA", 2026, "paqueta", "Paquetá", "CM", 87, { passing: 88 }),
  p("bra-2026", "BRA", 2026, "raphinha", "Raphinha", "RW", 90, { pace: 90 }),
  p("bra-2026", "BRA", 2026, "vinicius", "Vinícius Júnior", "LW", 95, { pace: 96, shooting: 92 }),
  p("bra-2026", "BRA", 2026, "neymar", "Neymar", "CAM", 90, { passing: 91, shooting: 88 }),
  p("bra-2026", "BRA", 2026, "matheus-cunha", "Matheus Cunha", "ST", 88, { shooting: 89 }),
]);

// Convocados FFF (14/05/2026) — Deschamps.
export const fra2026 = squad("fra-2026", "FRA", 2026, "França 2026", [
  p("fra-2026", "FRA", 2026, "maignan", "Maignan", "GK", 91),
  p("fra-2026", "FRA", 2026, "kounde", "Koundé", "RB", 89, { defending: 88 }),
  p("fra-2026", "FRA", 2026, "saliba", "Saliba", "CB", 93, { defending: 94 }),
  p("fra-2026", "FRA", 2026, "konate", "Konaté", "CB", 90, { defending: 91 }),
  p("fra-2026", "FRA", 2026, "hernandez-t", "T. Hernández", "LB", 88, { pace: 89 }),
  p("fra-2026", "FRA", 2026, "kante", "Kanté", "CDM", 87, { defending: 88 }),
  p("fra-2026", "FRA", 2026, "tchouameni", "Tchouaméni", "CM", 91, { passing: 90 }),
  p("fra-2026", "FRA", 2026, "cherki", "Cherki", "CAM", 88, { passing: 90 }),
  p("fra-2026", "FRA", 2026, "mbappe", "Mbappé", "ST", 96, { pace: 97, shooting: 93 }),
  p("fra-2026", "FRA", 2026, "dembele", "Dembélé", "RW", 94, { pace: 95, shooting: 90 }),
  p("fra-2026", "FRA", 2026, "thuram", "Thuram", "ST", 88, { physical: 89 }),
  p("fra-2026", "FRA", 2026, "olise", "Olise", "RW", 90, { passing: 91 }),
]);

// Convocados NFF (21/05/2026) — Solbakken.
export const nor2026 = squad("nor-2026", "NOR", 2026, "Noruega 2026", [
  p("nor-2026", "NOR", 2026, "nyland", "Nyland", "GK", 84),
  p("nor-2026", "NOR", 2026, "ryerson", "Ryerson", "RB", 84, { pace: 85 }),
  p("nor-2026", "NOR", 2026, "ajer", "Ajer", "CB", 86, { defending: 87 }),
  p("nor-2026", "NOR", 2026, "ostigard", "Østigaard", "CB", 84, { defending: 85 }),
  p("nor-2026", "NOR", 2026, "bjorkan", "Bjørkan", "LB", 81),
  p("nor-2026", "NOR", 2026, "berge", "Berge", "CDM", 86, { defending: 87 }),
  p("nor-2026", "NOR", 2026, "odegaard", "Ødegaard", "CAM", 93, { passing: 94 }),
  p("nor-2026", "NOR", 2026, "aursnes", "Aursnes", "CM", 85, { passing: 86 }),
  p("nor-2026", "NOR", 2026, "haaland", "Haaland", "ST", 97, { shooting: 98, pace: 91 }),
  p("nor-2026", "NOR", 2026, "sorloth", "Sørloth", "ST", 88, { physical: 89 }),
  p("nor-2026", "NOR", 2026, "nusa", "Nusa", "LW", 87, { pace: 92 }),
  p("nor-2026", "NOR", 2026, "bobb", "Bobb", "RW", 84, { pace: 88 }),
]);

// Convocados JFA (15/05/2026). Mitoma fora por lesão.
export const jpn2026 = squad("jpn-2026", "JPN", 2026, "Japão 2026", [
  p("jpn-2026", "JPN", 2026, "suzuki-z", "Zion Suzuki", "GK", 86),
  p("jpn-2026", "JPN", 2026, "tomiyasu", "Tomiyasu", "CB", 85, { defending: 86 }),
  p("jpn-2026", "JPN", 2026, "itakura", "Itakura", "CB", 86, { defending: 87 }),
  p("jpn-2026", "JPN", 2026, "hiroki-ito", "Hiroki Ito", "CB", 84, { defending: 85 }),
  p("jpn-2026", "JPN", 2026, "nagatomo", "Nagatomo", "LB", 78),
  p("jpn-2026", "JPN", 2026, "endo", "Endo", "CDM", 87, { defending: 86 }),
  p("jpn-2026", "JPN", 2026, "kamada", "Kamada", "CM", 88, { passing: 89 }),
  p("jpn-2026", "JPN", 2026, "tanaka", "Ao Tanaka", "CM", 85, { physical: 86 }),
  p("jpn-2026", "JPN", 2026, "kubo", "Kubo", "CAM", 89, { passing: 90, shooting: 86 }),
  p("jpn-2026", "JPN", 2026, "doan", "Doan", "RW", 87, { shooting: 86 }),
  p("jpn-2026", "JPN", 2026, "ueda", "Ueda", "ST", 86, { shooting: 87 }),
  p("jpn-2026", "JPN", 2026, "maeda", "Maeda", "LW", 84, { pace: 86 }),
]);

export const LOTE3_SQUADS = [
  bra2010,
  bra2014,
  ger2010,
  bra2026,
  fra2026,
  nor2026,
  jpn2026,
];
