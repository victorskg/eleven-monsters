export type Position = "GK" | "CB" | "LB" | "RB" | "CDM" | "CM" | "CAM" | "LW" | "RW" | "ST";

export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export type GameMode = "classic" | "almanac";

export type FormationId = "4-3-3" | "4-4-2" | "3-5-2";

export type TournamentPhase =
  | "groups"
  | "round16"
  | "quarter"
  | "semi"
  | "final";

export type MatchPeriod = "regular" | "extra" | "penalties";

export type TournamentStage = "group" | "knockout" | "finished";

export interface PlayerAttributes {
  pace: number;
  shooting: number;
  passing: number;
  defending: number;
  physical: number;
}

export interface Player {
  id: string;
  name: string;
  nation: string;
  year: number;
  squadId: string;
  position: Position;
  ovr: number;
  attributes: PlayerAttributes;
}

export interface Squad {
  id: string;
  nation: string;
  year: number;
  label: string;
  players: Player[];
}

export interface FormationSlot {
  id: string;
  position: Position;
  label: string;
}

export interface Formation {
  id: FormationId;
  label: string;
  slots: FormationSlot[];
}

export interface PitchCoordinate {
  x: number;
  y: number;
}

export interface PlayStyle {
  pressing: number;
  width: number;
  tempo: number;
}

export interface DraftSlot {
  slotId: string;
  position: Position;
  label: string;
  player: Player | null;
}

export interface PackOffer {
  slotId: string;
  position: Position;
  players: Player[];
}

export interface TeamRatings {
  attack: number;
  defense: number;
  midfield: number;
  chemistryBonus: number;
}

export interface OpponentProfile {
  playStyle: PlayStyle;
  trait: string;
  weakness: string;
  strengthNote: string;
}

export interface Opponent {
  id: string;
  name: string;
  phase: TournamentPhase;
  strength: number;
  profile: OpponentProfile;
}

export type HalftimeChoice = "maintain" | "push" | "hold";

export type MatchPhase = "idle" | "first_half" | "halftime" | "second_half" | "complete";

export interface PartialMatchState {
  firstHalfEvents: GoalEvent[];
  homeGoalsHT: number;
  awayGoalsHT: number;
  opponent: Opponent;
  seed: number;
  playStyle: PlayStyle;
  players: Player[];
  ratings: TeamRatings;
  halftimeChoice?: HalftimeChoice;
}

export interface MatchPreview {
  winChance: number;
  drawChance: number;
  lossChance: number;
  expectedGoalsFor: number;
  expectedGoalsAgainst: number;
  factors: string[];
}

export interface GoalEvent {
  minute: number;
  team: "home" | "away";
  scorerName: string;
  period: MatchPeriod;
  description: string;
}

export interface MatchResult {
  homeGoals: number;
  awayGoals: number;
  homeGoalsRegular: number;
  awayGoalsRegular: number;
  homeGoalsET: number;
  awayGoalsET: number;
  penalties?: { home: number; away: number };
  wentToExtraTime: boolean;
  wentToPenalties: boolean;
  events: GoalEvent[];
  preview: MatchPreview;
  won: boolean;
  drew: boolean;
}

export interface GroupTeam {
  id: string;
  name: string;
  strength: number;
  isUser: boolean;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

export interface GroupFixture {
  id: string;
  home: string;
  away: string;
  round: number;
  played: boolean;
  homeGoals?: number;
  awayGoals?: number;
  isUserMatch: boolean;
  result?: MatchResult;
}

export interface TournamentGroup {
  name: string;
  teams: GroupTeam[];
  fixtures: GroupFixture[];
  userMatchIds: string[];
}

export interface KnockoutMatch {
  id: string;
  phase: TournamentPhase;
  opponent: Opponent;
  result: MatchResult | null;
  revealed: boolean;
}

export interface TournamentState {
  group: TournamentGroup;
  knockoutMatches: KnockoutMatch[];
  stage: TournamentStage;
  currentUserFixtureIndex: number;
  currentKnockoutIndex: number;
  groupComplete: boolean;
  qualified: boolean;
}

export type GameScreen =
  | "home"
  | "setup"
  | "draft"
  | "tactics"
  | "tournament"
  | "match"
  | "result";
