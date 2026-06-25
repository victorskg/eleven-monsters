import type {
  GroupFixture,
  KnockoutMatch,
  Opponent,
  TournamentGroup,
  TournamentPhase,
  TournamentState,
} from "./types";
import { applyFixtureResult } from "./standings";
import { OPPONENT_NAMES, PHASE_STRENGTH, simulateAiMatch } from "./simulation";
import { getOpponentProfile } from "./opponents";
import { createRng, randomInt } from "./rng";

const KNOCKOUT_PHASES: TournamentPhase[] = [
  "round16",
  "quarter",
  "semi",
  "final",
];

const GROUP_NAMES = ["A", "B", "C", "D", "E", "F", "G", "H"];

function buildGroupFixtures(opponentIds: string[]): GroupFixture[] {
  const rounds: [string, string][][] = [
    [
      ["user", opponentIds[0]],
      [opponentIds[1], opponentIds[2]],
    ],
    [
      ["user", opponentIds[1]],
      [opponentIds[0], opponentIds[2]],
    ],
    [
      ["user", opponentIds[2]],
      [opponentIds[0], opponentIds[1]],
    ],
  ];

  const fixtures: GroupFixture[] = [];
  let fixtureIndex = 0;

  for (let round = 0; round < rounds.length; round++) {
    for (const [home, away] of rounds[round]) {
      fixtures.push({
        id: `fixture-${fixtureIndex++}`,
        home,
        away,
        round: round + 1,
        played: false,
        isUserMatch: home === "user" || away === "user",
      });
    }
  }

  return fixtures;
}

export function simulateAiFixturesForRound(
  group: TournamentGroup,
  round: number,
  seed: number,
): TournamentGroup {
  let updated = group;
  let fixtureSeed = seed;

  for (const fixture of group.fixtures) {
    if (fixture.isUserMatch || fixture.played || fixture.round !== round) continue;

    const homeTeam = group.teams.find((t) => t.id === fixture.home)!;
    const awayTeam = group.teams.find((t) => t.id === fixture.away)!;
    const { homeGoals, awayGoals } = simulateAiMatch(
      homeTeam.strength,
      awayTeam.strength,
      fixtureSeed++,
    );
    updated = applyFixtureResult(updated, fixture.id, homeGoals, awayGoals);
  }

  return updated;
}

export function generateTournament(seed: number): TournamentState {
  const rng = createRng(seed ^ 0xdeadbeef);
  const groupName = `Grupo ${GROUP_NAMES[randomInt(rng, 0, GROUP_NAMES.length - 1)]}`;

  const opponentPool = [...OPPONENT_NAMES.groups];
  const opponents: { name: string; strength: number }[] = [];

  for (let i = 0; i < 3; i++) {
    const idx = randomInt(rng, 0, opponentPool.length - 1);
    const name = opponentPool.splice(idx, 1)[0];
    opponents.push({
      name,
      strength: randomInt(rng, 68, 76),
    });
  }

  const teams = [
    {
      id: "user",
      name: "Você",
      strength: 80,
      isUser: true,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
    },
    ...opponents.map((o, i) => ({
      id: `opp-${i}`,
      name: o.name,
      strength: o.strength,
      isUser: false,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
    })),
  ];

  const opponentIds = opponents.map((_, i) => `opp-${i}`);
  const fixtures = buildGroupFixtures(opponentIds);

  const userMatchIds = fixtures
    .filter((f) => f.isUserMatch)
    .map((f) => f.id);

  const group: TournamentGroup = {
    name: groupName,
    teams,
    fixtures,
    userMatchIds,
  };

  return {
    group,
    knockoutMatches: [],
    stage: "group",
    currentUserFixtureIndex: 0,
    currentKnockoutIndex: 0,
    groupComplete: false,
    qualified: false,
  };
}

export function createKnockoutMatch(
  phase: TournamentPhase,
  seed: number,
  index: number,
): KnockoutMatch {
  const rng = createRng(seed + index * 9973);
  const names = OPPONENT_NAMES[phase];
  const name = names[randomInt(rng, 0, names.length - 1)];

  const opponent: Opponent = {
    id: `ko-${phase}-${index}`,
    name,
    phase,
    strength: PHASE_STRENGTH[phase],
    profile: getOpponentProfile(name),
  };

  return {
    id: `knockout-${index}`,
    phase,
    opponent,
    result: null,
    revealed: true,
  };
}

export function getPhaseLabel(phase: TournamentPhase): string {
  const labels: Record<TournamentPhase, string> = {
    groups: "Fase de Grupos",
    round16: "Oitavas de Final",
    quarter: "Quartas de Final",
    semi: "Semifinal",
    final: "Final",
  };
  return labels[phase];
}

export function getNextKnockoutPhase(
  currentIndex: number,
): TournamentPhase | null {
  return KNOCKOUT_PHASES[currentIndex] ?? null;
}

export function getCurrentUserFixture(state: TournamentState) {
  const fixtureId = state.group.userMatchIds[state.currentUserFixtureIndex];
  return state.group.fixtures.find((f) => f.id === fixtureId) ?? null;
}

export function getOpponentForUserFixture(
  state: TournamentState,
  fixtureId: string,
): Opponent | null {
  const fixture = state.group.fixtures.find((f) => f.id === fixtureId);
  if (!fixture) return null;

  const opponentId = fixture.home === "user" ? fixture.away : fixture.home;
  const team = state.group.teams.find((t) => t.id === opponentId);
  if (!team) return null;

  return {
    id: team.id,
    name: team.name,
    phase: "groups",
    strength: team.strength,
    profile: getOpponentProfile(team.name),
  };
}
