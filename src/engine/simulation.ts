import type {
  HalftimeChoice,
  MatchPreview,
  MatchResult,
  Opponent,
  PartialMatchState,
  PlayStyle,
  Player,
  TeamRatings,
  TournamentPhase,
  GoalEvent,
  MatchPeriod,
} from "./types";
import { calculateTeamRatings } from "./ratings";
import { calculateMatchupModifier } from "./matchups";
import { createRng } from "./rng";

export const BASE_GOALS = 0.85;
export const STRENGTH_FACTOR = 0.055;
const MAX_LAMBDA = 1.8;
const ET_LAMBDA_FACTOR = 0.45;
const FIRST_HALF_FACTOR = 0.48;

const SCORER_POSITIONS = new Set<Player["position"]>(["ST", "LW", "RW", "CAM", "CM"]);

const AWAY_SCORER_NAMES = [
  "Silva", "Santos", "García", "Müller", "Rossi", "Dupont", "Johnson", "Kim",
];

export const PHASE_STRENGTH: Record<TournamentPhase, number> = {
  groups: 72,
  round16: 77,
  quarter: 81,
  semi: 85,
  final: 88,
};

export const OPPONENT_NAMES: Record<TournamentPhase, string[]> = {
  groups: [
    "Grécia 2004",
    "Camarões 1990",
    "EUA 1994",
    "Coreia 2002",
    "África do Sul 2010",
    "Nova Zelândia 2010",
    "México 1986",
    "Suécia 1994",
  ],
  round16: ["México 1986", "Bélgica 2018", "Suécia 1994", "Japão 2018"],
  quarter: ["Holanda 1974", "Alemanha 2006", "Uruguai 1950", "Croácia 2018"],
  semi: ["França 1982", "Itália 1994", "Brasil 1998", "Portugal 1966"],
  final: ["Argentina 2022", "Brasil 1970", "Alemanha 2014", "Espanha 2010"],
};

const HALFTIME_MODS: Record<
  HalftimeChoice,
  { attackMod: number; defenseMod: number; label: string }
> = {
  maintain: { attackMod: 1, defenseMod: 1, label: "Manter tática" },
  push: { attackMod: 1.12, defenseMod: 0.92, label: "Aumentar pressão" },
  hold: { attackMod: 0.92, defenseMod: 1.1, label: "Segurar resultado" },
};

function poissonSample(lambda: number, rng: () => number): number {
  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= rng();
  } while (p > L);
  return k - 1;
}

function hashChoice(seed: number, choice: HalftimeChoice): number {
  const codes = { maintain: 0, push: 1, hold: 2 };
  return (seed ^ (codes[choice] * 0x9e3779b9)) >>> 0;
}

export function calculateLambdas(
  teamAttack: number,
  teamDefense: number,
  opponentStrength: number,
  factor = 1,
  matchup?: { attackMod: number; defenseMod: number },
): { goalsFor: number; goalsAgainst: number } {
  const attackMod = matchup?.attackMod ?? 1;
  const defenseMod = matchup?.defenseMod ?? 1;

  const goalsFor = Math.min(
    MAX_LAMBDA,
    Math.max(
      0.2,
      (BASE_GOALS + (teamAttack - opponentStrength) * STRENGTH_FACTOR) *
        factor *
        attackMod,
    ),
  );
  const goalsAgainst = Math.min(
    MAX_LAMBDA,
    Math.max(
      0.2,
      (BASE_GOALS + (opponentStrength - teamDefense) * STRENGTH_FACTOR) *
        factor *
        (2 - defenseMod),
    ),
  );
  return { goalsFor, goalsAgainst };
}

export function estimateMatchPreview(
  ratings: TeamRatings,
  opponent: Opponent,
  playStyle: PlayStyle,
): MatchPreview {
  const matchup = calculateMatchupModifier(playStyle, opponent.profile.playStyle);
  const { goalsFor, goalsAgainst } = calculateLambdas(
    ratings.attack,
    ratings.defense,
    opponent.strength,
    1,
    matchup,
  );

  const factors: string[] = [
    `Seu ataque (${ratings.attack}) vs defesa adversária (~${opponent.strength})`,
    `Sua defesa (${ratings.defense}) vs ataque adversário (~${opponent.strength})`,
    `Gols esperados: ${goalsFor.toFixed(1)} a favor, ${goalsAgainst.toFixed(1)} contra`,
    `Estilo adversário: ${opponent.profile.trait}`,
  ];
  if (ratings.chemistryBonus > 0) {
    factors.push(`Bônus de química: +${ratings.chemistryBonus}%`);
  }
  for (const note of matchup.notes) {
    factors.push(note);
  }

  const diff = goalsFor - goalsAgainst;
  let winChance = 0.35 + diff * 0.15;
  let drawChance = 0.22 - Math.abs(diff) * 0.03;
  let lossChance = 1 - winChance - drawChance;

  winChance = Math.max(0.05, Math.min(0.85, winChance));
  drawChance = Math.max(0.08, Math.min(0.35, drawChance));
  lossChance = Math.max(0.05, 1 - winChance - drawChance);
  const total = winChance + drawChance + lossChance;

  return {
    winChance: winChance / total,
    drawChance: drawChance / total,
    lossChance: lossChance / total,
    expectedGoalsFor: goalsFor,
    expectedGoalsAgainst: goalsAgainst,
    factors,
  };
}

export function pickScorer(
  players: Player[],
  team: "home" | "away",
  opponentName: string,
  rng: () => number,
): string {
  if (team === "away") {
    const idx = Math.floor(rng() * AWAY_SCORER_NAMES.length);
    return `${AWAY_SCORER_NAMES[idx]} (${opponentName.split(" ")[0]})`;
  }

  const scorers = players.filter((p) => SCORER_POSITIONS.has(p.position));
  const pool = scorers.length > 0 ? scorers : players;
  const weights = pool.map((p) => p.attributes.shooting);
  const total = weights.reduce((a, b) => a + b, 0);
  let roll = rng() * total;
  for (let i = 0; i < pool.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return pool[i].name;
  }
  return pool[pool.length - 1].name;
}

function generateGoalMinutes(
  count: number,
  minMinute: number,
  maxMinute: number,
  rng: () => number,
): number[] {
  const minutes: number[] = [];
  for (let i = 0; i < count; i++) {
    minutes.push(Math.floor(rng() * (maxMinute - minMinute)) + minMinute);
  }
  return minutes.sort((a, b) => a - b);
}

function buildGoalEvents(
  homeCount: number,
  awayCount: number,
  period: MatchPeriod,
  minMinute: number,
  maxMinute: number,
  players: Player[],
  opponent: Opponent,
  rng: () => number,
): GoalEvent[] {
  const events: GoalEvent[] = [];
  const homeMinutes = generateGoalMinutes(homeCount, minMinute, maxMinute, rng);
  const awayMinutes = generateGoalMinutes(awayCount, minMinute, maxMinute, rng);

  for (const minute of homeMinutes) {
    const scorer = pickScorer(players, "home", opponent.name, rng);
    events.push({
      minute,
      team: "home",
      scorerName: scorer,
      period,
      description: `${scorer} marca aos ${minute}'`,
    });
  }
  for (const minute of awayMinutes) {
    const scorer = pickScorer(players, "away", opponent.name, rng);
    events.push({
      minute,
      team: "away",
      scorerName: scorer,
      period,
      description: `${scorer} marca aos ${minute}'`,
    });
  }

  return events.sort((a, b) => a.minute - b.minute);
}

function simulatePenalties(
  ratings: TeamRatings,
  opponentStrength: number,
  rng: () => number,
): { home: number; away: number } {
  const homeChance = 0.72 + (ratings.attack - opponentStrength) * 0.004;
  const awayChance = 0.72 + (opponentStrength - ratings.defense) * 0.004;

  let home = 0;
  let away = 0;

  for (let i = 0; i < 5; i++) {
    if (rng() < homeChance) home++;
    if (rng() < awayChance) away++;
  }

  while (home === away) {
    const h = rng() < homeChance;
    const a = rng() < awayChance;
    home += h ? 1 : 0;
    away += a ? 1 : 0;
    if (h && !a) break;
    if (!h && a) break;
  }

  return { home, away };
}

function resolveWinner(
  homeGoals: number,
  awayGoals: number,
  penalties?: { home: number; away: number },
): { won: boolean; drew: boolean } {
  if (penalties) {
    if (penalties.home > penalties.away) return { won: true, drew: false };
    if (penalties.away > penalties.home) return { won: false, drew: false };
  }
  if (homeGoals > awayGoals) return { won: true, drew: false };
  if (homeGoals < awayGoals) return { won: false, drew: false };
  return { won: false, drew: true };
}

export function simulateFirstHalf(
  players: Player[],
  playStyle: PlayStyle,
  opponent: Opponent,
  seed: number,
): PartialMatchState {
  const ratings = calculateTeamRatings(players, playStyle);
  const matchup = calculateMatchupModifier(playStyle, opponent.profile.playStyle);
  const { goalsFor, goalsAgainst } = calculateLambdas(
    ratings.attack,
    ratings.defense,
    opponent.strength,
    FIRST_HALF_FACTOR,
    matchup,
  );

  const rng = createRng(seed);
  const homeGoalsHT = poissonSample(goalsFor, rng);
  const awayGoalsHT = poissonSample(goalsAgainst, rng);

  const firstHalfEvents = buildGoalEvents(
    homeGoalsHT,
    awayGoalsHT,
    "regular",
    1,
    45,
    players,
    opponent,
    rng,
  );

  return {
    firstHalfEvents,
    homeGoalsHT,
    awayGoalsHT,
    opponent,
    seed,
    playStyle,
    players,
    ratings,
  };
}

export function simulateSecondHalf(
  partial: PartialMatchState,
  choice: HalftimeChoice,
): MatchResult {
  const { opponent, players, playStyle, ratings, seed, homeGoalsHT, awayGoalsHT } =
    partial;

  const matchup = calculateMatchupModifier(playStyle, opponent.profile.playStyle);
  const htMod = HALFTIME_MODS[choice];
  const combinedMatchup = {
    attackMod: matchup.attackMod * htMod.attackMod,
    defenseMod: matchup.defenseMod * htMod.defenseMod,
  };

  const secondHalfFactor = 1 - FIRST_HALF_FACTOR;
  const { goalsFor, goalsAgainst } = calculateLambdas(
    ratings.attack,
    ratings.defense,
    opponent.strength,
    secondHalfFactor,
    combinedMatchup,
  );

  const rng = createRng(hashChoice(seed, choice));
  const homeSecond = poissonSample(goalsFor, rng);
  const awaySecond = poissonSample(goalsAgainst, rng);

  const homeRegular = homeGoalsHT + homeSecond;
  const awayRegular = awayGoalsHT + awaySecond;

  const secondHalfEvents = buildGoalEvents(
    homeSecond,
    awaySecond,
    "regular",
    46,
    90,
    players,
    opponent,
    rng,
  );

  const events: GoalEvent[] = [
    ...partial.firstHalfEvents,
    ...secondHalfEvents,
  ];

  const isKnockout = opponent.phase !== "groups";
  let homeET = 0;
  let awayET = 0;
  let wentToExtraTime = false;
  let wentToPenalties = false;
  let penalties: { home: number; away: number } | undefined;

  if (isKnockout && homeRegular === awayRegular) {
    wentToExtraTime = true;
    const etLambdas = calculateLambdas(
      ratings.attack,
      ratings.defense,
      opponent.strength,
      ET_LAMBDA_FACTOR,
      combinedMatchup,
    );
    homeET = poissonSample(etLambdas.goalsFor, rng);
    awayET = poissonSample(etLambdas.goalsAgainst, rng);

    events.push(
      ...buildGoalEvents(
        homeET,
        awayET,
        "extra",
        91,
        120,
        players,
        opponent,
        rng,
      ),
    );

    const totalHome = homeRegular + homeET;
    const totalAway = awayRegular + awayET;

    if (totalHome === totalAway) {
      wentToPenalties = true;
      penalties = simulatePenalties(ratings, opponent.strength, rng);
      events.push({
        minute: 120,
        team: penalties.home > penalties.away ? "home" : "away",
        scorerName: "Pênaltis",
        period: "penalties",
        description: `Disputa de pênaltis: ${penalties.home} × ${penalties.away}`,
      });
    }
  }

  const homeGoals = homeRegular + homeET;
  const awayGoals = awayRegular + awayET;
  const { won, drew } = resolveWinner(homeGoals, awayGoals, penalties);

  const preview = estimateMatchPreview(ratings, opponent, playStyle);

  return {
    homeGoals,
    awayGoals,
    homeGoalsRegular: homeRegular,
    awayGoalsRegular: awayRegular,
    homeGoalsET: homeET,
    awayGoalsET: awayET,
    penalties,
    wentToExtraTime,
    wentToPenalties,
    events: events.sort((a, b) => a.minute - b.minute),
    preview,
    won,
    drew,
  };
}

export function simulateMatch(
  players: Player[],
  playStyle: PlayStyle,
  opponent: Opponent,
  seed: number,
  halftimeChoice: HalftimeChoice = "maintain",
): MatchResult {
  const partial = simulateFirstHalf(players, playStyle, opponent, seed);
  return simulateSecondHalf(partial, halftimeChoice);
}

export function simulateAiMatch(
  homeStrength: number,
  awayStrength: number,
  seed: number,
): { homeGoals: number; awayGoals: number } {
  const rng = createRng(seed);
  const homeLambda = Math.min(
    MAX_LAMBDA,
    Math.max(0.2, BASE_GOALS + (homeStrength - awayStrength) * STRENGTH_FACTOR),
  );
  const awayLambda = Math.min(
    MAX_LAMBDA,
    Math.max(0.2, BASE_GOALS + (awayStrength - homeStrength) * STRENGTH_FACTOR),
  );
  const homeGoals = poissonSample(homeLambda, rng);
  const awayGoals = poissonSample(awayLambda, rng);
  return { homeGoals, awayGoals };
}

export function getHalftimeChoiceLabel(choice: HalftimeChoice): string {
  return HALFTIME_MODS[choice].label;
}
