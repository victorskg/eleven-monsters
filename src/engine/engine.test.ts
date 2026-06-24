import { describe, expect, it } from "vitest";
import { generatePack } from "./draft";
import {
  calculateLambdas,
  pickScorer,
  simulateMatch,
  simulateAiMatch,
} from "./simulation";
import { calculateTeamRatings } from "./ratings";
import { getRarity } from "./rarities";
import { generateTournament, simulateAiFixturesForRound } from "./tournament";
import {
  applyFixtureResult,
  computeStandings,
  isUserQualified,
} from "./standings";
import type { Player, TournamentGroup } from "./types";

const mockPlayer = (id: string, ovr: number, position: Player["position"]): Player => ({
  id,
  name: `Player ${id}`,
  nation: "BRA",
  year: 2002,
  squadId: "bra-2002",
  position,
  ovr,
  attributes: {
    pace: ovr,
    shooting: ovr,
    passing: ovr,
    defending: ovr,
    physical: ovr,
  },
});

const mockPool: Player[] = [
  mockPlayer("gk1", 88, "GK"),
  mockPlayer("gk2", 75, "GK"),
  mockPlayer("gk3", 70, "GK"),
  mockPlayer("cb1", 90, "CB"),
  mockPlayer("st1", 95, "ST"),
  mockPlayer("st2", 80, "ST"),
];

const fullTeam = Array.from({ length: 11 }, (_, i) =>
  mockPlayer(`p${i}`, 85 + (i % 3), i === 0 ? "GK" : i < 5 ? "CB" : "ST"),
);

describe("rarities", () => {
  it("maps ovr to correct tier", () => {
    expect(getRarity(64)).toBe("common");
    expect(getRarity(80)).toBe("uncommon");
    expect(getRarity(85)).toBe("rare");
    expect(getRarity(92)).toBe("epic");
    expect(getRarity(99)).toBe("legendary");
  });
});

describe("draft", () => {
  it("generates 3 players per pack", () => {
    const pack = generatePack(mockPool, "gk", "GK", 12345, 0);
    expect(pack.players).toHaveLength(3);
    expect(pack.position).toBe("GK");
  });

  it("is deterministic with same seed", () => {
    const a = generatePack(mockPool, "gk", "GK", 999, 1);
    const b = generatePack(mockPool, "gk", "GK", 999, 1);
    expect(a.players.map((p) => p.id)).toEqual(b.players.map((p) => p.id));
  });
});

describe("simulation", () => {
  it("higher attack yields more expected goals", () => {
    const weak = calculateLambdas(70, 70, 85);
    const strong = calculateLambdas(90, 85, 85);
    expect(strong.goalsFor).toBeGreaterThan(weak.goalsFor);
  });

  it("simulates a group match with valid result", () => {
    const result = simulateMatch(
      fullTeam,
      { pressing: 50, width: 50, tempo: 50 },
      { id: "1", name: "Test", phase: "groups", strength: 75 },
      42,
    );
    expect(result.homeGoals).toBeGreaterThanOrEqual(0);
    expect(result.awayGoals).toBeGreaterThanOrEqual(0);
    expect(result.homeGoalsRegular).toBeDefined();
    expect(result.preview.winChance).toBeGreaterThan(0);
  });

  it("includes scorer name in goal events", () => {
    const result = simulateMatch(
      fullTeam,
      { pressing: 50, width: 50, tempo: 50 },
      { id: "1", name: "Grécia 2004", phase: "groups", strength: 75 },
      123,
    );
    for (const ev of result.events) {
      if (ev.period !== "penalties") {
        expect(ev.scorerName).toBeTruthy();
        expect(ev.description).toContain(ev.scorerName);
      }
    }
  });

  it("pickScorer returns player name for home team", () => {
    const rng = () => 0.1;
    const name = pickScorer(fullTeam, "home", "Test", rng);
    expect(fullTeam.some((p) => p.name === name)).toBe(true);
  });

  it("knockout draw can go to extra time", () => {
    let foundET = false;
    for (let seed = 0; seed < 500; seed++) {
      const result = simulateMatch(
        fullTeam,
        { pressing: 50, width: 50, tempo: 50 },
        { id: "1", name: "Test", phase: "round16", strength: 80 },
        seed,
      );
      if (result.wentToExtraTime) {
        foundET = true;
        expect(result.homeGoalsRegular).toBe(result.awayGoalsRegular);
        break;
      }
    }
    expect(foundET).toBe(true);
  });

  it("simulates AI matches", () => {
    const { homeGoals, awayGoals } = simulateAiMatch(80, 75, 99);
    expect(homeGoals).toBeGreaterThanOrEqual(0);
    expect(awayGoals).toBeGreaterThanOrEqual(0);
  });
});

describe("ratings", () => {
  it("calculates team ratings from players", () => {
    const team = [
      mockPlayer("gk", 90, "GK"),
      mockPlayer("cb", 88, "CB"),
      mockPlayer("st", 95, "ST"),
    ];
    const ratings = calculateTeamRatings(team, {
      pressing: 60,
      width: 50,
      tempo: 55,
    });
    expect(ratings.attack).toBeGreaterThan(0);
    expect(ratings.defense).toBeGreaterThan(0);
  });
});

describe("tournament", () => {
  it("generates group with 4 teams and 3 user matches", () => {
    const t = generateTournament(1234);
    expect(t.group.teams).toHaveLength(4);
    expect(t.group.userMatchIds).toHaveLength(3);
    expect(t.group.fixtures).toHaveLength(6);
    expect(t.knockoutMatches).toHaveLength(0);
  });

  it("simulates AI fixtures per round", () => {
    const t = generateTournament(1234);
    const round1 = simulateAiFixturesForRound(t.group, 1, 999);
    const aiFixture = round1.fixtures.find((f) => f.round === 1 && !f.isUserMatch)!;

    expect(aiFixture.played).toBe(true);
    expect(aiFixture.homeGoals).toBeGreaterThanOrEqual(0);
    expect(aiFixture.awayGoals).toBeGreaterThanOrEqual(0);

    const teamsWithGames = round1.teams.filter((team) => team.played > 0);
    expect(teamsWithGames).toHaveLength(2);
  });
});

describe("standings", () => {
  function makeGroup(): TournamentGroup {
    return {
      name: "Grupo A",
      teams: [
        { id: "a", name: "A", strength: 80, isUser: false, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
        { id: "b", name: "B", strength: 75, isUser: false, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
        { id: "user", name: "Você", strength: 85, isUser: true, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
        { id: "c", name: "C", strength: 70, isUser: false, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
      ],
      fixtures: [
        { id: "f1", home: "user", away: "a", round: 1, played: false, isUserMatch: true },
        { id: "f2", home: "b", away: "c", round: 1, played: false, isUserMatch: false },
        { id: "f3", home: "user", away: "b", round: 2, played: false, isUserMatch: true },
        { id: "f4", home: "a", away: "c", round: 2, played: false, isUserMatch: false },
        { id: "f5", home: "user", away: "c", round: 3, played: false, isUserMatch: true },
        { id: "f6", home: "a", away: "b", round: 3, played: false, isUserMatch: false },
      ],
      userMatchIds: ["f1", "f3", "f5"],
    };
  }

  it("sorts by points", () => {
    let group = makeGroup();
    group = applyFixtureResult(group, "f1", 3, 0);
    group = applyFixtureResult(group, "f3", 2, 2);
    group = applyFixtureResult(group, "f5", 1, 0);

    const standings = computeStandings(group);
    expect(standings[0].points).toBeGreaterThanOrEqual(standings[1].points);
    const user = standings.find((t) => t.isUser)!;
    expect(user.points).toBe(7);
  });

  it("breaks tie by head-to-head", () => {
    let group = makeGroup();
    group = applyFixtureResult(group, "f2", 2, 0);
    group = applyFixtureResult(group, "f6", 2, 0);

    const standings = computeStandings(group);
    const a = standings.find((t) => t.id === "a")!;
    const b = standings.find((t) => t.id === "b")!;
    expect(a.points).toBe(b.points);
    expect(a.rank).toBeLessThan(b.rank);
  });

  it("checks user qualification in top 2", () => {
    let group = makeGroup();
    group = applyFixtureResult(group, "f1", 3, 0);
    group = applyFixtureResult(group, "f3", 3, 0);
    group = applyFixtureResult(group, "f5", 3, 0);
    expect(isUserQualified(group)).toBe(true);
  });
});

describe("goal balance", () => {
  it("keeps average total goals per match realistic", () => {
    const team = Array.from({ length: 11 }, (_, i) =>
      mockPlayer(`p${i}`, 88, i === 0 ? "GK" : "ST"),
    );
    let totalGoals = 0;
    const runs = 200;
    for (let seed = 0; seed < runs; seed++) {
      const result = simulateMatch(
        team,
        { pressing: 50, width: 50, tempo: 50 },
        { id: "1", name: "Test", phase: "groups", strength: 75 },
        seed,
      );
      totalGoals += result.homeGoalsRegular + result.awayGoalsRegular;
    }
    const avg = totalGoals / runs;
    expect(avg).toBeLessThan(5);
    expect(avg).toBeGreaterThan(0.5);
  });
});
