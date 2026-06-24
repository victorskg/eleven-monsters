import type { GroupFixture, GroupTeam, TournamentGroup } from "./types";

export interface StandingRow extends GroupTeam {
  goalDifference: number;
  rank: number;
}

function getHeadToHeadWinner(
  teamA: string,
  teamB: string,
  fixtures: GroupFixture[],
): string | null {
  const match = fixtures.find(
    (f) =>
      f.played &&
      ((f.home === teamA && f.away === teamB) ||
        (f.home === teamB && f.away === teamA)),
  );
  if (!match || match.homeGoals === undefined || match.awayGoals === undefined) {
    return null;
  }
  if (match.homeGoals > match.awayGoals) return match.home;
  if (match.awayGoals > match.homeGoals) return match.away;
  return null;
}

function compareTeams(
  a: GroupTeam,
  b: GroupTeam,
  fixtures: GroupFixture[],
): number {
  if (b.points !== a.points) return b.points - a.points;

  const gdA = a.goalsFor - a.goalsAgainst;
  const gdB = b.goalsFor - b.goalsAgainst;
  if (gdB !== gdA) return gdB - gdA;

  const h2h = getHeadToHeadWinner(a.id, b.id, fixtures);
  if (h2h === a.id) return -1;
  if (h2h === b.id) return 1;

  if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
  return a.name.localeCompare(b.name);
}

export function computeStandings(group: TournamentGroup): StandingRow[] {
  const sorted = [...group.teams].sort((a, b) =>
    compareTeams(a, b, group.fixtures),
  );

  return sorted.map((team, index) => ({
    ...team,
    goalDifference: team.goalsFor - team.goalsAgainst,
    rank: index + 1,
  }));
}

export function isUserQualified(group: TournamentGroup): boolean {
  const standings = computeStandings(group);
  const user = standings.find((t) => t.isUser);
  return user !== undefined && user.rank <= 2;
}

export function applyFixtureResult(
  group: TournamentGroup,
  fixtureId: string,
  homeGoals: number,
  awayGoals: number,
): TournamentGroup {
  const fixtures = group.fixtures.map((f) =>
    f.id === fixtureId ? { ...f, played: true, homeGoals, awayGoals } : f,
  );

  const teams = group.teams.map((team) => {
    const fixture = fixtures.find((f) => f.id === fixtureId);
    if (!fixture) return team;

    const isHome = fixture.home === team.id;
    const isAway = fixture.away === team.id;
    if (!isHome && !isAway) return team;

    const gf = isHome ? homeGoals : awayGoals;
    const ga = isHome ? awayGoals : homeGoals;
    const won = gf > ga;
    const drew = gf === ga;

    return {
      ...team,
      played: team.played + 1,
      won: team.won + (won ? 1 : 0),
      drawn: team.drawn + (drew ? 1 : 0),
      lost: team.lost + (!won && !drew ? 1 : 0),
      goalsFor: team.goalsFor + gf,
      goalsAgainst: team.goalsAgainst + ga,
      points: team.points + (won ? 3 : drew ? 1 : 0),
    };
  });

  return { ...group, fixtures, teams };
}
