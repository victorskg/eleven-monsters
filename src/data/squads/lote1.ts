import { p, squad } from "./helpers";

/** Lote 1 — seleções base do jogo */

const bra1970 = squad("bra-1970", "BRA", 1970, "Brasil 1970", [
  p("bra-1970", "BRA", 1970, "felix", "Félix", "GK", 88, { defending: 90 }),
  p("bra-1970", "BRA", 1970, "alberto", "Carlos Alberto", "RB", 94, { pace: 92, defending: 88 }),
  p("bra-1970", "BRA", 1970, "brito", "Brito", "CB", 86),
  p("bra-1970", "BRA", 1970, "piazza", "Piazza", "CB", 88, { defending: 90 }),
  p("bra-1970", "BRA", 1970, "everaldo", "Everaldo", "LB", 85),
  p("bra-1970", "BRA", 1970, "clodoaldo", "Clodoaldo", "CM", 89, { passing: 91 }),
  p("bra-1970", "BRA", 1970, "gerson", "Gerson", "CM", 91, { passing: 93 }),
  p("bra-1970", "BRA", 1970, "rivellino", "Rivellino", "CAM", 92, { shooting: 90 }),
  p("bra-1970", "BRA", 1970, "jairzinho", "Jairzinho", "RW", 93, { pace: 95, shooting: 91 }),
  p("bra-1970", "BRA", 1970, "pele", "Pelé", "ST", 99, { shooting: 98, passing: 96 }),
  p("bra-1970", "BRA", 1970, "tostao", "Tostão", "ST", 92, { shooting: 93 }),
  p("bra-1970", "BRA", 1970, "garrincha", "Garrincha", "RW", 97, { pace: 94, passing: 95 }),
  p("bra-1970", "BRA", 1970, "pele-bench", "Pelé (res)", "CAM", 99, { shooting: 98 }),
]);

const bra2002 = squad("bra-2002", "BRA", 2002, "Brasil 2002", [
  p("bra-2002", "BRA", 2002, "marcos", "Marcos", "GK", 90),
  p("bra-2002", "BRA", 2002, "cafu", "Cafu", "RB", 93, { pace: 92 }),
  p("bra-2002", "BRA", 2002, "lucio", "Lúcio", "CB", 91, { defending: 92 }),
  p("bra-2002", "BRA", 2002, "roque", "Roque Júnior", "CB", 86),
  p("bra-2002", "BRA", 2002, "edmilson", "Edmilson", "CB", 88),
  p("bra-2002", "BRA", 2002, "roberto-carlos", "Roberto Carlos", "LB", 92, { pace: 94, shooting: 88 }),
  p("bra-2002", "BRA", 2002, "gilberto", "Gilberto Silva", "CDM", 89, { defending: 90 }),
  p("bra-2002", "BRA", 2002, "kleberson", "Kleberson", "CM", 85),
  p("bra-2002", "BRA", 2002, "rivaldo", "Rivaldo", "CAM", 94, { shooting: 95 }),
  p("bra-2002", "BRA", 2002, "ronaldinho", "Ronaldinho", "CAM", 96, { passing: 97 }),
  p("bra-2002", "BRA", 2002, "ronaldo", "Ronaldo", "ST", 97, { pace: 96, shooting: 98 }),
]);

const arg1986 = squad("arg-1986", "ARG", 1986, "Argentina 1986", [
  p("arg-1986", "ARG", 1986, "pumpido", "Pumpido", "GK", 87),
  p("arg-1986", "ARG", 1986, "brown", "Brown", "CB", 86, { defending: 87 }),
  p("arg-1986", "ARG", 1986, "cuciuffo", "Cuciuffo", "CB", 85),
  p("arg-1986", "ARG", 1986, "ruggeri", "Ruggeri", "CB", 88, { defending: 90 }),
  p("arg-1986", "ARG", 1986, "giusti", "Giusti", "RB", 84),
  p("arg-1986", "ARG", 1986, "batista", "Batista", "CDM", 84, { defending: 85 }),
  p("arg-1986", "ARG", 1986, "burruchaga", "Burruchaga", "CM", 89, { passing: 90 }),
  p("arg-1986", "ARG", 1986, "enrique", "Enrique", "CM", 85),
  p("arg-1986", "ARG", 1986, "olarticoechea", "Olarticoechea", "LB", 82),
  p("arg-1986", "ARG", 1986, "maradona", "Maradona", "CAM", 99, { passing: 98, shooting: 94 }),
  p("arg-1986", "ARG", 1986, "valdano", "Valdano", "ST", 90, { shooting: 91 }),
]);

const arg2022 = squad("arg-2022", "ARG", 2022, "Argentina 2022", [
  p("arg-2022", "ARG", 2022, "martinez", "E. Martínez", "GK", 92),
  p("arg-2022", "ARG", 2022, "molina", "Molina", "RB", 86),
  p("arg-2022", "ARG", 2022, "otamendi", "Otamendi", "CB", 88, { defending: 89 }),
  p("arg-2022", "ARG", 2022, "romero", "C. Romero", "CB", 87),
  p("arg-2022", "ARG", 2022, "tagliafico", "Tagliafico", "LB", 84),
  p("arg-2022", "ARG", 2022, "de-paul", "De Paul", "CM", 89, { passing: 90 }),
  p("arg-2022", "ARG", 2022, "fernandez", "Enzo Fernández", "CM", 90, { passing: 91 }),
  p("arg-2022", "ARG", 2022, "mac-allister", "Mac Allister", "CM", 88),
  p("arg-2022", "ARG", 2022, "messi", "Messi", "RW", 99, { shooting: 97, passing: 98 }),
  p("arg-2022", "ARG", 2022, "alvarez", "J. Álvarez", "ST", 87),
  p("arg-2022", "ARG", 2022, "di-maria", "Di María", "LW", 91, { pace: 90 }),
  p("arg-2022", "ARG", 2022, "lautaro", "Lautaro", "ST", 89, { shooting: 90 }),
]);

const ger2014 = squad("ger-2014", "GER", 2014, "Alemanha 2014", [
  p("ger-2014", "GER", 2014, "neuer", "Neuer", "GK", 96, { defending: 95 }),
  p("ger-2014", "GER", 2014, "lahm", "Lahm", "RB", 92, { defending: 90 }),
  p("ger-2014", "GER", 2014, "hummels", "Hummels", "CB", 90, { defending: 91 }),
  p("ger-2014", "GER", 2014, "boateng", "Boateng", "CB", 89),
  p("ger-2014", "GER", 2014, "howedes", "Hoewedes", "LB", 84),
  p("ger-2014", "GER", 2014, "kroos", "Kroos", "CM", 93, { passing: 95 }),
  p("ger-2014", "GER", 2014, "schweinsteiger", "Schweinsteiger", "CM", 90),
  p("ger-2014", "GER", 2014, "khedira", "Khedira", "CDM", 87),
  p("ger-2014", "GER", 2014, "mueller", "Müller", "CAM", 91, { shooting: 90 }),
  p("ger-2014", "GER", 2014, "ozeil", "Özil", "CAM", 92, { passing: 94 }),
  p("ger-2014", "GER", 2014, "klose", "Klose", "ST", 91, { shooting: 92 }),
  p("ger-2014", "GER", 2014, "goetze", "Götze", "CAM", 88),
]);

const fra1998 = squad("fra-1998", "FRA", 1998, "França 1998", [
  p("fra-1998", "FRA", 1998, "barthez", "Barthez", "GK", 89),
  p("fra-1998", "FRA", 1998, "thuram", "Thuram", "RB", 91, { defending: 92 }),
  p("fra-1998", "FRA", 1998, "desailly", "Desailly", "CB", 90),
  p("fra-1998", "FRA", 1998, "blanc", "Blanc", "CB", 89),
  p("fra-1998", "FRA", 1998, "lizarazu", "Lizarazu", "LB", 87),
  p("fra-1998", "FRA", 1998, "deschamps", "Deschamps", "CDM", 88),
  p("fra-1998", "FRA", 1998, "petit", "Petit", "CM", 89),
  p("fra-1998", "FRA", 1998, "zidane", "Zidane", "CAM", 96, { passing: 97 }),
  p("fra-1998", "FRA", 1998, "djorkaeff", "Djorkaeff", "CAM", 88),
  p("fra-1998", "FRA", 1998, "henry", "Henry", "ST", 93, { pace: 95, shooting: 92 }),
  p("fra-1998", "FRA", 1998, "guivarc", "Guivarc'h", "ST", 78),
]);

const fra2018 = squad("fra-2018", "FRA", 2018, "França 2018", [
  p("fra-2018", "FRA", 2018, "lloris", "Lloris", "GK", 88),
  p("fra-2018", "FRA", 2018, "pavard", "Pavard", "RB", 86),
  p("fra-2018", "FRA", 2018, "varane", "Varane", "CB", 91, { defending: 92 }),
  p("fra-2018", "FRA", 2018, "umtiti", "Umtiti", "CB", 88),
  p("fra-2018", "FRA", 2018, "hernandez", "Hernández", "LB", 85),
  p("fra-2018", "FRA", 2018, "kante", "Kanté", "CDM", 92, { defending: 93 }),
  p("fra-2018", "FRA", 2018, "pogba", "Pogba", "CM", 90, { passing: 91 }),
  p("fra-2018", "FRA", 2018, "matuidi", "Matuidi", "CM", 86),
  p("fra-2018", "FRA", 2018, "griezmann", "Griezmann", "CAM", 91, { shooting: 92 }),
  p("fra-2018", "FRA", 2018, "mbappe", "Mbappé", "ST", 94, { pace: 98 }),
  p("fra-2018", "FRA", 2018, "giroud", "Giroud", "ST", 84, { shooting: 86 }),
]);

const ita2006 = squad("ita-2006", "ITA", 2006, "Itália 2006", [
  p("ita-2006", "ITA", 2006, "buffon", "Buffon", "GK", 95),
  p("ita-2006", "ITA", 2006, "zambrotta", "Zambrotta", "RB", 89),
  p("ita-2006", "ITA", 2006, "cannavaro", "Cannavaro", "CB", 94, { defending: 96 }),
  p("ita-2006", "ITA", 2006, "materazzi", "Materazzi", "CB", 87),
  p("ita-2006", "ITA", 2006, "grosso", "Grosso", "LB", 86),
  p("ita-2006", "ITA", 2006, "gattuso", "Gattuso", "CDM", 90, { defending: 91 }),
  p("ita-2006", "ITA", 2006, "pirlo", "Pirlo", "CM", 94, { passing: 96 }),
  p("ita-2006", "ITA", 2006, "perrotta", "Perrotta", "CM", 84),
  p("ita-2006", "ITA", 2006, "camoranesi", "Camoranesi", "RW", 86),
  p("ita-2006", "ITA", 2006, "toni", "Toni", "ST", 88, { shooting: 89 }),
  p("ita-2006", "ITA", 2006, "totti", "Totti", "CAM", 91, { passing: 92 }),
]);

const ned1974 = squad("ned-1974", "NED", 1974, "Holanda 1974", [
  p("ned-1974", "NED", 1974, "jongbloed", "Jongbloed", "GK", 82),
  p("ned-1974", "NED", 1974, "suurbier", "Suurbier", "RB", 86),
  p("ned-1974", "NED", 1974, "rijsbergen", "Rijsbergen", "CB", 85),
  p("ned-1974", "NED", 1974, "haan", "Haan", "CB", 87),
  p("ned-1974", "NED", 1974, "krol", "Krol", "LB", 90, { defending: 88 }),
  p("ned-1974", "NED", 1974, "jansen", "Jansen", "CDM", 84),
  p("ned-1974", "NED", 1974, "neeskens", "Neeskens", "CM", 91, { passing: 90 }),
  p("ned-1974", "NED", 1974, "van-hanegem", "van Hanegem", "CM", 89),
  p("ned-1974", "NED", 1974, "rep", "Rep", "RW", 92, { shooting: 93 }),
  p("ned-1974", "NED", 1974, "rensenbrink", "Rensenbrink", "LW", 90, { shooting: 89 }),
  p("ned-1974", "NED", 1974, "cruyff", "Cruyff", "ST", 97, { passing: 96 }),
]);

const uru1950 = squad("uru-1950", "URU", 1950, "Uruguai 1950", [
  p("uru-1950", "URU", 1950, "maspoli", "Máspoli", "GK", 86),
  p("uru-1950", "URU", 1950, "gonzalez", "González", "RB", 82),
  p("uru-1950", "URU", 1950, "tejera", "Tejera", "LB", 80),
  p("uru-1950", "URU", 1950, "gambetta", "Gambetta", "CB", 84, { defending: 85 }),
  p("uru-1950", "URU", 1950, "varela", "Varela", "CDM", 92, { passing: 91, physical: 90 }),
  p("uru-1950", "URU", 1950, "andrade", "Andrade", "CM", 88, { passing: 89 }),
  p("uru-1950", "URU", 1950, "ghiggia", "Ghiggia", "RW", 90, { pace: 91 }),
  p("uru-1950", "URU", 1950, "perez", "Pérez", "CM", 85, { shooting: 84 }),
  p("uru-1950", "URU", 1950, "miguez", "Míguez", "ST", 87),
  p("uru-1950", "URU", 1950, "schiaffino", "Schiaffino", "CAM", 94, { passing: 93, shooting: 88 }),
  p("uru-1950", "URU", 1950, "moran", "Morán", "LW", 79),
]);

const eng1966 = squad("eng-1966", "ENG", 1966, "Inglaterra 1966", [
  p("eng-1966", "ENG", 1966, "banks", "Banks", "GK", 90),
  p("eng-1966", "ENG", 1966, "cohen", "Cohen", "RB", 86),
  p("eng-1966", "ENG", 1966, "charlton-j", "Jack Charlton", "CB", 88, { defending: 90 }),
  p("eng-1966", "ENG", 1966, "moore", "Moore", "CB", 93, { defending: 94 }),
  p("eng-1966", "ENG", 1966, "wilson", "Ray Wilson", "LB", 84),
  p("eng-1966", "ENG", 1966, "stiles", "Stiles", "CDM", 87),
  p("eng-1966", "ENG", 1966, "ball", "Alan Ball", "CM", 88, { pace: 87 }),
  p("eng-1966", "ENG", 1966, "charlton-b", "Bobby Charlton", "CM", 94, { shooting: 93 }),
  p("eng-1966", "ENG", 1966, "peters", "Peters", "CM", 86),
  p("eng-1966", "ENG", 1966, "hunt", "Hunt", "ST", 88),
  p("eng-1966", "ENG", 1966, "hurst", "Hurst", "ST", 90, { shooting: 91 }),
]);

const esp2010 = squad("esp-2010", "ESP", 2010, "Espanha 2010", [
  p("esp-2010", "ESP", 2010, "casillas", "Casillas", "GK", 92),
  p("esp-2010", "ESP", 2010, "ramos", "Sergio Ramos", "RB", 91, { defending: 90 }),
  p("esp-2010", "ESP", 2010, "pique", "Piqué", "CB", 90),
  p("esp-2010", "ESP", 2010, "puyol", "Puyol", "CB", 91, { defending: 93 }),
  p("esp-2010", "ESP", 2010, "capdevila", "Capdevila", "LB", 84),
  p("esp-2010", "ESP", 2010, "busquets", "Busquets", "CDM", 91, { defending: 90 }),
  p("esp-2010", "ESP", 2010, "xavi", "Xavi", "CM", 95, { passing: 97 }),
  p("esp-2010", "ESP", 2010, "iniesta", "Iniesta", "CM", 96, { passing: 97 }),
  p("esp-2010", "ESP", 2010, "pedro", "Pedro", "RW", 87),
  p("esp-2010", "ESP", 2010, "villa", "Villa", "ST", 92, { shooting: 93 }),
  p("esp-2010", "ESP", 2010, "torres", "Torres", "ST", 89, { pace: 90 }),
]);

const gre2004 = squad("gre-2004", "GRE", 2004, "Grécia 2004", [
  p("gre-2004", "GRE", 2004, "nikopolidis", "Nikopolidis", "GK", 84),
  p("gre-2004", "GRE", 2004, "seitaridis", "Seitaridis", "RB", 80),
  p("gre-2004", "GRE", 2004, "kapsis", "Kapsis", "CB", 82),
  p("gre-2004", "GRE", 2004, "dellas", "Dellas", "CB", 86, { defending: 88 }),
  p("gre-2004", "GRE", 2004, "fyssas", "Fyssas", "LB", 79),
  p("gre-2004", "GRE", 2004, "katsouranis", "Katsouranis", "CDM", 83),
  p("gre-2004", "GRE", 2004, "zagorakis", "Zagorakis", "CM", 87),
  p("gre-2004", "GRE", 2004, "basinas", "Basinas", "CM", 81),
  p("gre-2004", "GRE", 2004, "giannakopoulos", "Giannakopoulos", "RW", 82),
  p("gre-2004", "GRE", 2004, "vryzas", "Vryzas", "ST", 80),
  p("gre-2004", "GRE", 2004, "charisteas", "Charisteas", "ST", 84),
]);

const cmr1990 = squad("cmr-1990", "CMR", 1990, "Camarões 1990", [
  p("cmr-1990", "CMR", 1990, "nkono", "N'Kono", "GK", 84),
  p("cmr-1990", "CMR", 1990, "tataw", "Tataw", "RB", 80),
  p("cmr-1990", "CMR", 1990, "kunde", "Kundé", "CB", 82, { defending: 83 }),
  p("cmr-1990", "CMR", 1990, "massing", "Massing", "CB", 81, { defending: 82 }),
  p("cmr-1990", "CMR", 1990, "ebwelle", "Ebwelle", "LB", 78),
  p("cmr-1990", "CMR", 1990, "mbouh", "Mbouh", "CM", 79),
  p("cmr-1990", "CMR", 1990, "kana", "Kana", "CDM", 80),
  p("cmr-1990", "CMR", 1990, "mfede", "M'Fede", "CM", 81),
  p("cmr-1990", "CMR", 1990, "milla", "Milla", "CAM", 88, { shooting: 87 }),
  p("cmr-1990", "CMR", 1990, "omam", "Omam-Biyick", "ST", 82),
  p("cmr-1990", "CMR", 1990, "makanaky", "Makanaky", "ST", 80),
]);

const usa1994 = squad("usa-1994", "USA", 1994, "EUA 1994", [
  p("usa-1994", "USA", 1994, "meola", "Tony Meola", "GK", 82),
  p("usa-1994", "USA", 1994, "caligiuri", "Caligiuri", "RB", 78),
  p("usa-1994", "USA", 1994, "balboa", "Balboa", "CB", 80, { defending: 81 }),
  p("usa-1994", "USA", 1994, "lalas", "Lalas", "CB", 78),
  p("usa-1994", "USA", 1994, "dooley", "Dooley", "LB", 79),
  p("usa-1994", "USA", 1994, "ramos", "Tab Ramos", "CM", 82, { passing: 83 }),
  p("usa-1994", "USA", 1994, "harkes", "Harkes", "CM", 81),
  p("usa-1994", "USA", 1994, "reyna", "Reyna", "CM", 80, { passing: 82 }),
  p("usa-1994", "USA", 1994, "jones", "Cobi Jones", "RW", 78),
  p("usa-1994", "USA", 1994, "wynalda", "Wynalda", "ST", 82, { shooting: 83 }),
  p("usa-1994", "USA", 1994, "wegerle", "Wegerle", "ST", 81),
]);

const por1966 = squad("por-1966", "POR", 1966, "Portugal 1966", [
  p("por-1966", "POR", 1966, "pereira", "Pereira", "GK", 84),
  p("por-1966", "POR", 1966, "hilario", "Hilário", "CB", 83, { defending: 84 }),
  p("por-1966", "POR", 1966, "baptista", "Baptista", "CB", 82),
  p("por-1966", "POR", 1966, "jose-carlos", "José Carlos", "CB", 81),
  p("por-1966", "POR", 1966, "festa", "Festa", "CB", 80),
  p("por-1966", "POR", 1966, "coluna", "Coluna", "CM", 88, { passing: 89 }),
  p("por-1966", "POR", 1966, "graca", "Graça", "CM", 84, { passing: 85 }),
  p("por-1966", "POR", 1966, "simoes", "Simões", "RW", 85, { pace: 86 }),
  p("por-1966", "POR", 1966, "augusto", "Augusto", "LW", 84),
  p("por-1966", "POR", 1966, "eusebio", "Eusébio", "ST", 95, { shooting: 96, pace: 93 }),
  p("por-1966", "POR", 1966, "torres", "Torres", "ST", 85, { shooting: 86 }),
]);


const ned1988 = squad("ned-1988", "NED", 1988, "Holanda 1988", [
  p("ned-1988", "NED", 1988, "van-breukelen", "van Breukelen", "GK", 88, { defending: 89 }),
  p("ned-1988", "NED", 1988, "van-tiggelen", "van Tiggelen", "RB", 84),
  p("ned-1988", "NED", 1988, "rijkaard", "Rijkaard", "CB", 93, { defending: 92, passing: 91 }),
  p("ned-1988", "NED", 1988, "koeman", "Koeman", "CB", 90, { shooting: 92, passing: 89 }),
  p("ned-1988", "NED", 1988, "van-aerle", "van Aerle", "LB", 83),
  p("ned-1988", "NED", 1988, "wouters", "Wouters", "CDM", 86, { defending: 87 }),
  p("ned-1988", "NED", 1988, "muhren", "Mühren", "CM", 85, { passing: 86 }),
  p("ned-1988", "NED", 1988, "vanenburg", "Vanenburg", "CM", 84),
  p("ned-1988", "NED", 1988, "gullit", "Gullit", "CAM", 95, { physical: 94, passing: 92 }),
  p("ned-1988", "NED", 1988, "van-basten", "van Basten", "ST", 96, { shooting: 97 }),
  p("ned-1988", "NED", 1988, "bosman", "Bosman", "RW", 82),
]);

const ger1974 = squad("ger-1974", "GER", 1974, "Alemanha 1974", [
  p("ger-1974", "GER", 1974, "maier", "Maier", "GK", 91, { defending: 90 }),
  p("ger-1974", "GER", 1974, "vogts", "Vogts", "RB", 88, { defending: 89 }),
  p("ger-1974", "GER", 1974, "schwarzenbeck", "Schwarzenbeck", "CB", 87, { defending: 88 }),
  p("ger-1974", "GER", 1974, "beckenbauer", "Beckenbauer", "CB", 97, { passing: 96, defending: 95 }),
  p("ger-1974", "GER", 1974, "breitner", "Breitner", "LB", 89, { shooting: 88 }),
  p("ger-1974", "GER", 1974, "wimmer", "Wimmer", "CDM", 85),
  p("ger-1974", "GER", 1974, "overath", "Overath", "CM", 85, { passing: 86 }),
  p("ger-1974", "GER", 1974, "bonhof", "Bonhof", "CM", 86, { passing: 87 }),
  p("ger-1974", "GER", 1974, "grabowski", "Grabowski", "RW", 84, { pace: 86 }),
  p("ger-1974", "GER", 1974, "hoeness", "Hoeness", "LW", 87, { shooting: 86 }),
  p("ger-1974", "GER", 1974, "gerd-muller", "Gerd Müller", "ST", 96, { shooting: 97 }),
]);

const ita1982 = squad("ita-1982", "ITA", 1982, "Itália 1982", [
  p("ita-1982", "ITA", 1982, "zoff", "Zoff", "GK", 92, { defending: 93 }),
  p("ita-1982", "ITA", 1982, "conti", "Conti", "RB", 85),
  p("ita-1982", "ITA", 1982, "scirea", "Scirea", "CB", 93, { defending: 94, passing: 90 }),
  p("ita-1982", "ITA", 1982, "gentile", "Gentile", "CB", 90, { defending: 92, physical: 91 }),
  p("ita-1982", "ITA", 1982, "cabrini", "Cabrini", "LB", 88),
  p("ita-1982", "ITA", 1982, "oriali", "Oriali", "CDM", 86, { defending: 87 }),
  p("ita-1982", "ITA", 1982, "tardelli", "Tardelli", "CM", 91, { shooting: 90, physical: 89 }),
  p("ita-1982", "ITA", 1982, "antognoni", "Antognoni", "CAM", 90, { passing: 92 }),
  p("ita-1982", "ITA", 1982, "causio", "Causio", "CAM", 87, { passing: 88 }),
  p("ita-1982", "ITA", 1982, "rossi", "Rossi", "ST", 94, { shooting: 95 }),
  p("ita-1982", "ITA", 1982, "graziani", "Graziani", "ST", 88, { shooting: 87 }),
]);

const hun1954 = squad("hun-1954", "HUN", 1954, "Hungria 1954", [
  p("hun-1954", "HUN", 1954, "grosics", "Grosics", "GK", 90),
  p("hun-1954", "HUN", 1954, "lorant", "Lóránt", "CB", 88, { defending: 89 }),
  p("hun-1954", "HUN", 1954, "budai", "Budai", "RB", 85),
  p("hun-1954", "HUN", 1954, "lants", "Lantos", "LB", 86),
  p("hun-1954", "HUN", 1954, "bozsik", "Bozsik", "CM", 94, { passing: 95 }),
  p("hun-1954", "HUN", 1954, "zakarias", "Zakariás", "CM", 89, { passing: 88 }),
  p("hun-1954", "HUN", 1954, "machos", "Machos", "CDM", 84),
  p("hun-1954", "HUN", 1954, "hidegkuti", "Hidegkuti", "CAM", 93, { passing: 92, shooting: 90 }),
  p("hun-1954", "HUN", 1954, "puskas", "Puskás", "ST", 98, { shooting: 97, passing: 93 }),
  p("hun-1954", "HUN", 1954, "kocsis", "Kocsis", "ST", 95, { shooting: 96 }),
  p("hun-1954", "HUN", 1954, "toth", "Tóth", "RW", 83),
]);

export const LOTE1_SQUADS = [
  bra1970,
  bra2002,
  arg1986,
  arg2022,
  ger2014,
  fra1998,
  fra2018,
  ita2006,
  ned1974,
  uru1950,
  eng1966,
  esp2010,
  gre2004,
  cmr1990,
  usa1994,
  por1966,
  ned1988,
  ger1974,
  ita1982,
  hun1954,
];
