import { create } from "zustand";
import type {
  FormationId,
  GameMode,
  GameScreen,
  HalftimeChoice,
  MatchPhase,
  MatchResult,
  PackOffer,
  PartialMatchState,
  Player,
  PlayStyle,
  TournamentPhase,
  TournamentState,
} from "../engine/types";
import { getFormation } from "../engine/formations";
import { generatePack } from "../engine/draft";
import { getPlayerPool } from "../data/squads";
import {
  createKnockoutMatch,
  generateTournament,
  getCurrentUserFixture,
  getNextKnockoutPhase,
  getOpponentForUserFixture,
  getPhaseCelebrationAfterWin,
  simulateAiFixturesForRound,
} from "../engine/tournament";
import {
  simulateFirstHalf,
  simulateSecondHalf,
  simulateMatch,
} from "../engine/simulation";
import {
  applyFixtureResult,
  isUserQualified,
} from "../engine/standings";

interface GameStore {
  screen: GameScreen;
  mode: GameMode;
  formationId: FormationId;
  playStyle: PlayStyle;
  draftSlots: ReturnType<typeof initDraftSlots>;
  currentPack: PackOffer | null;
  rerollsLeft: number;
  scoutLeft: number;
  scoutedPlayerId: string | null;
  packAnimating: boolean;
  packIndex: number;
  tournament: TournamentState;
  champion: boolean;
  eliminated: boolean;
  phaseCelebration: TournamentPhase | null;
  rngSeed: number;
  lastMatchResult: MatchResult | null;
  partialMatch: PartialMatchState | null;
  matchPhase: MatchPhase;

  setScreen: (screen: GameScreen) => void;
  startGame: (mode: GameMode, formationId: FormationId) => void;
  setPlayStyle: (style: Partial<PlayStyle>) => void;
  openPack: () => void;
  rerollPack: () => void;
  scoutPlayer: (playerId: string) => void;
  selectPlayer: (player: Player) => void;
  setPackAnimating: (v: boolean) => void;
  finishDraft: () => void;
  simulateCurrentMatch: () => void;
  applyHalftimeChoice: (choice: HalftimeChoice) => void;
  setMatchPhase: (phase: MatchPhase) => void;
  completeMatchView: () => void;
  simulateAllMatches: () => void;
  clearPhaseCelebration: () => void;
  reset: () => void;
}

function initDraftSlots(formationId: FormationId) {
  const formation = getFormation(formationId);
  return formation.slots.map((slot) => ({
    slotId: slot.id,
    position: slot.position,
    label: slot.label,
    player: null as Player | null,
  }));
}

function newSeed() {
  return Math.floor(Math.random() * 0xffffffff);
}

function emptyTournament(): TournamentState {
  return {
    group: {
      name: "",
      teams: [],
      fixtures: [],
      userMatchIds: [],
    },
    knockoutMatches: [],
    stage: "group",
    currentUserFixtureIndex: 0,
    currentKnockoutIndex: 0,
    groupComplete: false,
    qualified: false,
  };
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

function finalizeMatch(
  tournament: TournamentState,
  result: MatchResult,
  rngSeed: number,
): { tournament: TournamentState; champion: boolean; eliminated: boolean } {
  let updated = { ...tournament };
  let champion = false;
  let eliminated = false;

  if (updated.stage === "group" && !updated.groupComplete) {
    const fixture = getCurrentUserFixture(updated);
    if (!fixture) return { tournament: updated, champion, eliminated };

    const group = applyFixtureResult(
      updated.group,
      fixture.id,
      result.homeGoalsRegular,
      result.awayGoalsRegular,
    );
    const fixtures = group.fixtures.map((f) =>
      f.id === fixture.id ? { ...f, result } : f,
    );
    updated = { ...updated, group: { ...group, fixtures } };
    updated = processGroupAfterUserMatch(updated, rngSeed);

    if (updated.groupComplete && !updated.qualified) {
      eliminated = true;
    }
  } else if (updated.stage === "knockout") {
    const knockoutMatches = updated.knockoutMatches.map((m, i) =>
      i === updated.currentKnockoutIndex ? { ...m, result } : m,
    );
    updated = { ...updated, knockoutMatches };

    const processed = processKnockoutAfterMatch(updated, result, rngSeed);
    updated = processed.tournament;
    champion = processed.champion;
    eliminated = processed.eliminated;
  }

  return { tournament: updated, champion, eliminated };
}

function processKnockoutAfterMatch(
  tournament: TournamentState,
  result: MatchResult,
  seed: number,
): { tournament: TournamentState; champion: boolean; eliminated: boolean } {
  let updated = { ...tournament };
  let champion = false;
  let eliminated = false;

  if (!result.won) {
    updated.stage = "finished";
    eliminated = true;
    return { tournament: updated, champion, eliminated };
  }

  const currentPhase = updated.knockoutMatches[updated.currentKnockoutIndex]?.phase;
  if (currentPhase === "final") {
    updated.stage = "finished";
    champion = true;
    return { tournament: updated, champion, eliminated };
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

  return { tournament: updated, champion, eliminated };
}

function getMatchSeed(tournament: TournamentState, rngSeed: number): number {
  if (tournament.stage === "group") {
    return rngSeed + tournament.currentUserFixtureIndex * 31337;
  }
  return rngSeed + 50000 + tournament.currentKnockoutIndex * 31337;
}

function getCurrentOpponent(tournament: TournamentState) {
  if (tournament.stage === "group" && !tournament.groupComplete) {
    const fixture = getCurrentUserFixture(tournament);
    if (!fixture || fixture.played) return null;
    return getOpponentForUserFixture(tournament, fixture.id);
  }
  if (tournament.stage === "knockout") {
    const koMatch = tournament.knockoutMatches[tournament.currentKnockoutIndex];
    if (!koMatch || koMatch.result) return null;
    return koMatch.opponent;
  }
  return null;
}

export const useGameStore = create<GameStore>((set, get) => ({
  screen: "home",
  mode: "classic",
  formationId: "4-3-3",
  playStyle: { pressing: 50, width: 50, tempo: 50 },
  draftSlots: initDraftSlots("4-3-3"),
  currentPack: null,
  rerollsLeft: 3,
  scoutLeft: 1,
  scoutedPlayerId: null,
  packAnimating: false,
  packIndex: 0,
  tournament: emptyTournament(),
  champion: false,
  eliminated: false,
  phaseCelebration: null,
  rngSeed: newSeed(),
  lastMatchResult: null,
  partialMatch: null,
  matchPhase: "idle",

  setScreen: (screen) => set({ screen }),

  startGame: (mode, formationId) => {
    const seed = newSeed();
    set({
      screen: "draft",
      mode,
      formationId,
      playStyle: { pressing: 50, width: 50, tempo: 50 },
      draftSlots: initDraftSlots(formationId),
      currentPack: null,
      rerollsLeft: 3,
      scoutLeft: 1,
      scoutedPlayerId: null,
      packAnimating: false,
      packIndex: 0,
      tournament: generateTournament(seed),
      champion: false,
      eliminated: false,
      phaseCelebration: null,
      rngSeed: seed,
      lastMatchResult: null,
      partialMatch: null,
      matchPhase: "idle",
    });
  },

  setPlayStyle: (style) =>
    set((s) => ({ playStyle: { ...s.playStyle, ...style } })),

  openPack: () => {
    const state = get();
    const nextSlot = state.draftSlots.find((s) => !s.player);
    if (!nextSlot || state.packAnimating) return;

    const pool = getPlayerPool();
    const pickedIds = new Set(
      state.draftSlots.filter((s) => s.player).map((s) => s.player!.id),
    );
    const availablePool = pool.filter((p) => !pickedIds.has(p.id));

    const pack = generatePack(
      availablePool,
      nextSlot.slotId,
      nextSlot.position,
      state.rngSeed,
      state.packIndex,
    );

    set({
      currentPack: pack,
      packAnimating: true,
      scoutedPlayerId: null,
    });
  },

  rerollPack: () => {
    const state = get();
    if (state.rerollsLeft <= 0 || !state.currentPack || state.packAnimating)
      return;

    const nextSlot = state.draftSlots.find((s) => !s.player);
    if (!nextSlot) return;

    const pool = getPlayerPool();
    const pickedIds = new Set(
      state.draftSlots.filter((s) => s.player).map((s) => s.player!.id),
    );
    const availablePool = pool.filter((p) => !pickedIds.has(p.id));

    const newIndex = state.packIndex + 100;
    const pack = generatePack(
      availablePool,
      nextSlot.slotId,
      nextSlot.position,
      state.rngSeed,
      newIndex,
    );

    set({
      currentPack: pack,
      rerollsLeft: state.rerollsLeft - 1,
      packIndex: newIndex,
      packAnimating: true,
      scoutedPlayerId: null,
    });
  },

  scoutPlayer: (playerId) => {
    const state = get();
    if (state.scoutLeft <= 0 || state.mode !== "almanac") return;
    set({ scoutedPlayerId: playerId, scoutLeft: state.scoutLeft - 1 });
  },

  selectPlayer: (player) => {
    const state = get();
    if (!state.currentPack) return;

    const draftSlots = state.draftSlots.map((slot) =>
      slot.slotId === state.currentPack!.slotId
        ? { ...slot, player }
        : slot,
    );

    const allFilled = draftSlots.every((s) => s.player);
    set({
      draftSlots,
      currentPack: null,
      packAnimating: false,
      packIndex: state.packIndex + 1,
      scoutedPlayerId: null,
      screen: allFilled ? "tactics" : "draft",
    });
  },

  setPackAnimating: (v) => set({ packAnimating: v }),

  finishDraft: () => set({ screen: "tournament" }),

  simulateCurrentMatch: () => {
    const state = get();
    const players = state.draftSlots
      .map((s) => s.player)
      .filter((p): p is Player => p !== null);
    if (players.length < 11) return;

    const opponent = getCurrentOpponent(state.tournament);
    if (!opponent) return;

    const seed = getMatchSeed(state.tournament, state.rngSeed);
    const partial = simulateFirstHalf(players, state.playStyle, opponent, seed);

    set({
      partialMatch: partial,
      matchPhase: "first_half",
      lastMatchResult: null,
      screen: "match",
    });
  },

  applyHalftimeChoice: (choice) => {
    const state = get();
    if (!state.partialMatch) return;

    const result = simulateSecondHalf(state.partialMatch, choice);
    const prevTournament = state.tournament;
    const { tournament, champion, eliminated } = finalizeMatch(
      state.tournament,
      result,
      state.rngSeed,
    );
    const phaseCelebration = getPhaseCelebrationAfterWin(
      prevTournament,
      tournament,
      champion,
      eliminated,
    );

    set({
      tournament,
      lastMatchResult: result,
      partialMatch: { ...state.partialMatch, halftimeChoice: choice },
      matchPhase: "second_half",
      champion,
      eliminated,
      phaseCelebration,
    });
  },

  setMatchPhase: (phase) => set({ matchPhase: phase }),

  completeMatchView: () =>
    set({
      partialMatch: null,
      matchPhase: "idle",
    }),

  simulateAllMatches: () => {
    const state = get();
    const players = state.draftSlots
      .map((s) => s.player)
      .filter((p): p is Player => p !== null);
    if (players.length < 11) return;

    let tournament = { ...state.tournament };
    let lastResult = state.lastMatchResult;
    let champion = false;
    let eliminated = false;

    while (tournament.stage === "group" && !tournament.groupComplete) {
      const fixture = getCurrentUserFixture(tournament);
      if (!fixture) break;

      const opponent = getOpponentForUserFixture(tournament, fixture.id);
      if (!opponent) break;

      const result = simulateMatch(
        players,
        state.playStyle,
        opponent,
        getMatchSeed(tournament, state.rngSeed),
        "maintain",
      );
      lastResult = result;

      const group = applyFixtureResult(
        tournament.group,
        fixture.id,
        result.homeGoalsRegular,
        result.awayGoalsRegular,
      );
      const fixtures = group.fixtures.map((f) =>
        f.id === fixture.id ? { ...f, result } : f,
      );
      tournament = { ...tournament, group: { ...group, fixtures } };
      tournament = processGroupAfterUserMatch(tournament, state.rngSeed);

      if (tournament.groupComplete && !tournament.qualified) {
        eliminated = true;
        break;
      }
    }

    while (tournament.stage === "knockout" && !champion && !eliminated) {
      const koMatch = tournament.knockoutMatches[tournament.currentKnockoutIndex];
      if (!koMatch) break;

      const result = simulateMatch(
        players,
        state.playStyle,
        koMatch.opponent,
        getMatchSeed(tournament, state.rngSeed),
        "maintain",
      );
      lastResult = result;

      const knockoutMatches = tournament.knockoutMatches.map((m, i) =>
        i === tournament.currentKnockoutIndex ? { ...m, result } : m,
      );
      tournament = { ...tournament, knockoutMatches };

      const processed = processKnockoutAfterMatch(
        tournament,
        result,
        state.rngSeed,
      );
      tournament = processed.tournament;
      champion = processed.champion;
      eliminated = processed.eliminated;
    }

    set({
      tournament,
      lastMatchResult: lastResult,
      champion,
      eliminated,
      partialMatch: null,
      matchPhase: "idle",
      screen: "result",
    });
  },

  clearPhaseCelebration: () => set({ phaseCelebration: null }),

  reset: () =>
    set({
      screen: "home",
      draftSlots: initDraftSlots("4-3-3"),
      currentPack: null,
      tournament: emptyTournament(),
      champion: false,
      eliminated: false,
      phaseCelebration: null,
      lastMatchResult: null,
      partialMatch: null,
      matchPhase: "idle",
    }),
}));
