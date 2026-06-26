import type {
  HalftimeChoice,
  Player,
  PlayStyle,
  TournamentPhase,
  TournamentState,
} from "./types";
import { applyFixtureResult, isUserQualified } from "./standings";
import {
  createKnockoutMatch,
  generateTournament,
  getCurrentUserFixture,
  getNextKnockoutPhase,
  getOpponentForUserFixture,
  simulateAiFixturesForRound,
} from "./tournament";
import { simulateMatch } from "./simulation";

export interface TeamProfile {
  ovr: number;
  label: string;
}

export interface TournamentRunResult {
  seed: number;
  champion: boolean;
  eliminated: boolean;
  qualified: boolean;
  deepestPhase: TournamentPhase | "groups" | "out";
  knockoutWins: number;
}

export interface BalanceReport {
  runs: number;
  profile: TeamProfile;
  championRate: number;
  qualifiedRate: number;
  round16Rate: number;
  quarterRate: number;
  semiRate: number;
  finalRate: number;
  impossibleSeedRate: number;
}

/** Mede quanto habilidade (OVR / decisões) muda o resultado vs a seed sozinha. */
export interface AgencyReport {
  seedsSampled: number;
  medianChampionRate: number;
  eliteChampionRate: number;
  skillLiftChampion: number;
  eliteWinsMedianLosesRate: number;
  medianWinsEliteLosesRate: number;
  hopelessSeedRate: number;
  decisionLiftChampion: number;
}

const DEFAULT_STYLE: PlayStyle = { pressing: 50, width: 50, tempo: 50 };

export function createUniformTeam(ovr: number): Player[] {
  const positions: Player["position"][] = [
    "GK",
    "CB",
    "CB",
    "LB",
    "RB",
    "CM",
    "CM",
    "CM",
    "LW",
    "RW",
    "ST",
  ];

  return positions.map((position, i) => ({
    id: `sim-${ovr}-${i}`,
    name: `Player ${i}`,
    nation: "SIM",
    year: 2000,
    squadId: "sim",
    position,
    ovr,
    attributes: {
      pace: ovr,
      shooting: ovr,
      passing: ovr,
      defending: ovr,
      physical: ovr,
    },
  }));
}

function getMatchSeed(tournament: TournamentState, rngSeed: number): number {
  if (tournament.stage === "group") {
    return rngSeed + tournament.currentUserFixtureIndex * 31337;
  }
  return rngSeed + 50000 + tournament.currentKnockoutIndex * 31337;
}

function processGroupAfterUserMatch(
  tournament: TournamentState,
  seed: number,
): TournamentState {
  let updated = { ...tournament };
  const playedFixtureId =
    updated.group.userMatchIds[updated.currentUserFixtureIndex];
  const playedFixture = updated.group.fixtures.find(
    (f) => f.id === playedFixtureId,
  );
  const round = playedFixture?.round ?? updated.currentUserFixtureIndex + 1;

  updated = {
    ...updated,
    group: simulateAiFixturesForRound(updated.group, round, seed + round * 997),
  };

  const lastUserFixtureIndex = updated.group.userMatchIds.length - 1;
  const justFinishedLastUserMatch =
    updated.currentUserFixtureIndex >= lastUserFixtureIndex;

  if (!justFinishedLastUserMatch) {
    updated.currentUserFixtureIndex += 1;
    return updated;
  }

  updated.groupComplete = true;
  updated.qualified = isUserQualified(updated.group);

  if (updated.qualified) {
    const koMatch = createKnockoutMatch(
      "round16",
      seed,
      updated.knockoutMatches.length,
    );
    updated.knockoutMatches = [koMatch];
    updated.stage = "knockout";
    updated.currentKnockoutIndex = 0;
  } else {
    updated.stage = "finished";
  }

  return updated;
}

function processKnockoutAfterMatch(
  tournament: TournamentState,
  won: boolean,
  seed: number,
): { tournament: TournamentState; champion: boolean; eliminated: boolean } {
  let updated = { ...tournament };

  if (!won) {
    updated.stage = "finished";
    return { tournament: updated, champion: false, eliminated: true };
  }

  const currentPhase = updated.knockoutMatches[updated.currentKnockoutIndex]?.phase;
  if (currentPhase === "final") {
    updated.stage = "finished";
    return { tournament: updated, champion: true, eliminated: false };
  }

  const nextPhase = getNextKnockoutPhase(updated.currentKnockoutIndex + 1);
  if (nextPhase) {
    const nextMatch = createKnockoutMatch(
      nextPhase,
      seed,
      updated.knockoutMatches.length,
    );
    updated.knockoutMatches = [...updated.knockoutMatches, nextMatch];
    updated.currentKnockoutIndex += 1;
  }

  return { tournament: updated, champion: false, eliminated: false };
}

function deepestPhaseFromRun(
  tournament: TournamentState,
  champion: boolean,
  qualified: boolean,
): TournamentPhase | "groups" | "out" {
  if (champion) return "final";
  if (!qualified) return "out";

  const lastPlayed = [...tournament.knockoutMatches]
    .reverse()
    .find((m) => m.result);

  if (!lastPlayed) return "groups";
  if (lastPlayed.result?.won) return lastPlayed.phase;
  return lastPlayed.phase;
}

export function simulateTournamentRun(
  seed: number,
  players: Player[],
  playStyle: PlayStyle = DEFAULT_STYLE,
  halftimeChoice: HalftimeChoice = "maintain",
): TournamentRunResult {
  let tournament = generateTournament(seed);
  let champion = false;
  let eliminated = false;
  let knockoutWins = 0;
  let qualified = false;

  while (tournament.stage === "group" && !tournament.groupComplete) {
    const fixture = getCurrentUserFixture(tournament);
    if (!fixture) break;

    const opponent = getOpponentForUserFixture(tournament, fixture.id);
    if (!opponent) break;

    const result = simulateMatch(
      players,
      playStyle,
      opponent,
      getMatchSeed(tournament, seed),
      halftimeChoice,
    );

    const group = applyFixtureResult(
      tournament.group,
      fixture.id,
      result.homeGoalsRegular,
      result.awayGoalsRegular,
    );
    tournament = { ...tournament, group };
    tournament = processGroupAfterUserMatch(tournament, seed);

    if (tournament.groupComplete && !tournament.qualified) {
      eliminated = true;
      qualified = false;
      break;
    }
  }

  qualified = tournament.qualified;

  while (tournament.stage === "knockout" && !champion && !eliminated) {
    const koMatch = tournament.knockoutMatches[tournament.currentKnockoutIndex];
    if (!koMatch) break;

    const result = simulateMatch(
      players,
      playStyle,
      koMatch.opponent,
      getMatchSeed(tournament, seed),
      halftimeChoice,
    );

    const knockoutMatches = tournament.knockoutMatches.map((m, i) =>
      i === tournament.currentKnockoutIndex ? { ...m, result } : m,
    );
    tournament = { ...tournament, knockoutMatches };

    if (result.won) knockoutWins += 1;

    const processed = processKnockoutAfterMatch(tournament, result.won, seed);
    tournament = processed.tournament;
    champion = processed.champion;
    eliminated = processed.eliminated;
  }

  return {
    seed,
    champion,
    eliminated,
    qualified,
    deepestPhase: deepestPhaseFromRun(tournament, champion, qualified),
    knockoutWins,
  };
}

function phaseAtLeast(
  phase: TournamentRunResult["deepestPhase"],
  target: TournamentPhase | "groups" | "out",
): boolean {
  const order: (TournamentPhase | "groups" | "out")[] = [
    "out",
    "groups",
    "round16",
    "quarter",
    "semi",
    "final",
  ];
  return order.indexOf(phase) >= order.indexOf(target);
}

export function runBalanceSimulation(
  profile: TeamProfile,
  runs: number,
  playStyle: PlayStyle = DEFAULT_STYLE,
  halftimeChoice: HalftimeChoice = "maintain",
): BalanceReport {
  const players = createUniformTeam(profile.ovr);
  const results: TournamentRunResult[] = [];

  for (let seed = 0; seed < runs; seed++) {
    results.push(
      simulateTournamentRun(seed, players, playStyle, halftimeChoice),
    );
  }

  const qualified = results.filter((r) => r.qualified);
  const champions = results.filter((r) => r.champion);

  return {
    runs,
    profile,
    championRate: champions.length / runs,
    qualifiedRate: qualified.length / runs,
    round16Rate:
      results.filter((r) => phaseAtLeast(r.deepestPhase, "round16")).length /
      runs,
    quarterRate:
      results.filter((r) => phaseAtLeast(r.deepestPhase, "quarter")).length /
      runs,
    semiRate:
      results.filter((r) => phaseAtLeast(r.deepestPhase, "semi")).length / runs,
    finalRate:
      results.filter((r) => phaseAtLeast(r.deepestPhase, "final")).length / runs,
    impossibleSeedRate:
      results.filter((r) => !r.champion && r.knockoutWins === 0 && r.qualified)
        .length / runs,
  };
}

export function formatBalanceReport(report: BalanceReport): string {
  const pct = (n: number) => `${(n * 100).toFixed(1)}%`;
  return [
    `Time ${report.profile.label} (OVR ${report.profile.ovr}) — ${report.runs} runs`,
    `  Campeão:     ${pct(report.championRate)}`,
    `  Classificou: ${pct(report.qualifiedRate)}`,
    `  Oitavas+:    ${pct(report.round16Rate)}`,
    `  Quartas+:    ${pct(report.quarterRate)}`,
    `  Semi+:       ${pct(report.semiRate)}`,
    `  Final+:      ${pct(report.finalRate)}`,
    `  Seeds duras: ${pct(report.impossibleSeedRate)} (classificou, 0 vitórias KO)`,
  ].join("\n");
}

export function runAgencyReport(seedsSampled: number): AgencyReport {
  const medianTeam = createUniformTeam(80);
  const eliteTeam = createUniformTeam(90);
  const strongTeam = createUniformTeam(85);

  let eliteWinsMedianLoses = 0;
  let medianWinsEliteLoses = 0;
  let hopeless = 0;
  let medianChampions = 0;
  let eliteChampions = 0;
  let pushChampions = 0;
  let maintainChampions = 0;

  for (let seed = 0; seed < seedsSampled; seed++) {
    const median = simulateTournamentRun(seed, medianTeam);
    const elite = simulateTournamentRun(seed, eliteTeam);
    const strongPush = simulateTournamentRun(seed, strongTeam, DEFAULT_STYLE, "push");
    const strongMaintain = simulateTournamentRun(
      seed,
      strongTeam,
      DEFAULT_STYLE,
      "maintain",
    );

    if (median.champion) medianChampions += 1;
    if (elite.champion) eliteChampions += 1;
    if (strongPush.champion) pushChampions += 1;
    if (strongMaintain.champion) maintainChampions += 1;

    if (elite.champion && !median.champion) eliteWinsMedianLoses += 1;
    if (median.champion && !elite.champion) medianWinsEliteLoses += 1;
    if (!elite.qualified) hopeless += 1;
  }

  const medianChampionRate = medianChampions / seedsSampled;
  const eliteChampionRate = eliteChampions / seedsSampled;

  return {
    seedsSampled,
    medianChampionRate,
    eliteChampionRate,
    skillLiftChampion: eliteChampionRate - medianChampionRate,
    eliteWinsMedianLosesRate: eliteWinsMedianLoses / seedsSampled,
    medianWinsEliteLosesRate: medianWinsEliteLoses / seedsSampled,
    hopelessSeedRate: hopeless / seedsSampled,
    decisionLiftChampion:
      pushChampions / seedsSampled - maintainChampions / seedsSampled,
  };
}

export function formatAgencyReport(report: AgencyReport): string {
  const pct = (n: number) => `${(n * 100).toFixed(1)}%`;
  const pp = (n: number) => `${(n * 100).toFixed(1)} pp`;
  return [
    `Agência vs Seed (${report.seedsSampled} seeds pareadas)`,
    `  Campeão mediano (80):  ${pct(report.medianChampionRate)}`,
    `  Campeão elite (90):    ${pct(report.eliteChampionRate)}`,
    `  Lift de habilidade:    ${pp(report.skillLiftChampion)}`,
    `  Elite ganha, mediano não: ${pct(report.eliteWinsMedianLosesRate)}`,
    `  Mediano ganha, elite não: ${pct(report.medianWinsEliteLosesRate)}`,
    `  Seeds sem classificação (90): ${pct(report.hopelessSeedRate)}`,
    `  Lift decisão (push vs maintain, 85): ${pp(report.decisionLiftChampion)}`,
  ].join("\n");
}
