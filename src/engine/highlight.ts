import { getFormation, getPitchLayout } from "./formations";
import { createRng } from "./rng";
import type {
  DraftSlot,
  FormationId,
  GoalEvent,
  HighlightPhase,
  HighlightPlayType,
  HighlightReplay,
  MatchResult,
  PitchCoordinate,
  Player,
} from "./types";

const ATTACK_POSITIONS = new Set(["ST", "LW", "RW", "CAM"]);

function isDecisiveHomeGoal(
  events: GoalEvent[],
  index: number,
): boolean {
  let home = 0;
  let away = 0;
  for (let i = 0; i <= index; i++) {
    if (events[i].team === "home") home++;
    else away++;
  }
  return home > away;
}

export function pickMatchHighlight(result: MatchResult): GoalEvent | null {
  const goals = result.events.filter((e) => e.period !== "penalties");
  if (goals.length === 0) return null;

  if (result.won) {
    for (let i = goals.length - 1; i >= 0; i--) {
      if (goals[i].team === "home" && isDecisiveHomeGoal(goals, i)) {
        return goals[i];
      }
    }
    return goals.filter((g) => g.team === "home").at(-1) ?? null;
  }

  if (result.drew) {
    return goals.at(-1) ?? null;
  }

  return goals.filter((g) => g.team === "away").at(-1) ?? goals.at(-1) ?? null;
}

function findScorerSlotId(
  slots: DraftSlot[],
  scorerName: string,
): string | null {
  const exact = slots.find((s) => s.player?.name === scorerName);
  if (exact) return exact.slotId;

  const scorerLast = scorerName.split(" ").pop()?.toLowerCase();
  const byLast = slots.find(
    (s) => s.player?.name.split(" ").pop()?.toLowerCase() === scorerLast,
  );
  if (byLast) return byLast.slotId;

  const attacker = slots.find(
    (s) => s.player && ATTACK_POSITIONS.has(s.player.position),
  );
  return attacker?.slotId ?? null;
}

function pickPasserSlotId(
  scorerSlotId: string,
  layout: Record<string, PitchCoordinate>,
  rng: () => number,
): string {
  const scorerPos = layout[scorerSlotId];
  if (!scorerPos) return "cm2";

  const candidates = Object.entries(layout)
    .filter(([id, pos]) => id !== scorerSlotId && id !== "gk" && pos.y > scorerPos.y)
    .sort((a, b) => b[1].y - a[1].y);

  if (candidates.length === 0) return "cm2";
  const idx = Math.floor(rng() * Math.min(3, candidates.length));
  return candidates[idx][0];
}

function inferPlayType(
  slots: DraftSlot[],
  scorerSlotId: string,
  minute: number,
  rng: () => number,
): HighlightPlayType {
  const slot = slots.find((s) => s.slotId === scorerSlotId);
  const pos = slot?.player?.position ?? slot?.position;

  if (pos === "ST" || pos === "LW" || pos === "RW") {
    return minute >= 75 ? "counter" : "cross";
  }
  if (pos === "CAM" || pos === "CM" || pos === "CDM") {
    return rng() > 0.5 ? "set_piece" : "long_shot";
  }
  return "long_shot";
}

function pickWideSlotId(
  scorerSlotId: string,
  layout: Record<string, PitchCoordinate>,
): string {
  const wingIds = ["lw", "rw", "lm", "rm", "lwb", "rwb"].filter(
    (id) => layout[id] && id !== scorerSlotId,
  );
  if (wingIds.length === 0) return "cm2";
  return wingIds.sort((a, b) => {
    const distDiff =
      Math.abs(layout[b].x - 50) - Math.abs(layout[a].x - 50);
    if (distDiff !== 0) return distDiff;
    return b.localeCompare(a);
  })[0];
}

function passPhase(
  layout: Record<string, PitchCoordinate>,
  fromSlotId: string,
  toSlotId: string,
  durationMs: number,
): HighlightPhase {
  return {
    type: "pass",
    from: layout[fromSlotId] ?? { x: 50, y: 50 },
    to: layout[toSlotId] ?? { x: 50, y: 16 },
    fromSlotId,
    toSlotId,
    durationMs,
  };
}

function shotPhase(
  layout: Record<string, PitchCoordinate>,
  fromSlotId: string,
  scorerSlotId: string,
  durationMs: number,
): HighlightPhase {
  const scorer = layout[scorerSlotId] ?? { x: 50, y: 16 };
  return {
    type: "shot",
    from: layout[fromSlotId] ?? scorer,
    to: { x: scorer.x, y: 4 },
    fromSlotId,
    durationMs,
  };
}

function buildPhases(
  playType: HighlightPlayType,
  layout: Record<string, PitchCoordinate>,
  passerSlotId: string,
  scorerSlotId: string,
): HighlightPhase[] {
  const wideSlotId = pickWideSlotId(scorerSlotId, layout);

  if (playType === "long_shot" || playType === "set_piece") {
    return [
      passPhase(layout, passerSlotId, scorerSlotId, playType === "set_piece" ? 500 : 420),
      shotPhase(layout, scorerSlotId, scorerSlotId, playType === "set_piece" ? 240 : 280),
    ];
  }

  if (playType === "cross") {
    return [
      passPhase(layout, passerSlotId, wideSlotId, 400),
      passPhase(layout, wideSlotId, scorerSlotId, 380),
      shotPhase(layout, scorerSlotId, scorerSlotId, 220),
    ];
  }

  // counter: meio → ponta → centroavante → chute
  return [
    passPhase(layout, passerSlotId, wideSlotId, 340),
    passPhase(layout, wideSlotId, scorerSlotId, 320),
    shotPhase(layout, scorerSlotId, scorerSlotId, 200),
  ];
}

export function buildHighlightReplay(
  result: MatchResult,
  slots: DraftSlot[],
  formationId: FormationId,
  opponentName: string,
  seed: number,
): HighlightReplay | null {
  const goalEvent = pickMatchHighlight(result);
  if (!goalEvent) return null;

  const layout = getPitchLayout(formationId);
  const scorerSlotId = findScorerSlotId(slots, goalEvent.scorerName);
  if (!scorerSlotId) return null;

  const rng = createRng(seed + goalEvent.minute * 7919);
  const passerSlotId = pickPasserSlotId(scorerSlotId, layout, rng);
  const playType = inferPlayType(slots, scorerSlotId, goalEvent.minute, rng);
  const phases = buildPhases(playType, layout, passerSlotId, scorerSlotId);

  const scorerPos = layout[scorerSlotId];
  const cameraFocus = {
    x: scorerPos?.x ?? 50,
    y: Math.max(12, (scorerPos?.y ?? 16) - 6),
    scale: 1.75,
  };

  let home = 0;
  let away = 0;
  for (const ev of result.events) {
    if (ev.period === "penalties") continue;
    if (ev.minute > goalEvent.minute) break;
    if (ev.team === "home") home++;
    else away++;
  }

  return {
    goalEvent,
    playType,
    phases,
    scorerSlotId,
    passerSlotId,
    cameraFocus,
    opponentName,
    scoreAfter: { home, away },
  };
}

function demoPlayer(
  slotId: string,
  player: Player,
  formationId: FormationId,
): DraftSlot {
  const slot = getFormation(formationId).slots.find((s) => s.id === slotId)!;
  return {
    slotId,
    position: slot.position,
    label: slot.label,
    player,
  };
}

export function createDemoHighlightPreview(): {
  replay: HighlightReplay;
  slots: DraftSlot[];
  formationId: FormationId;
} {
  const formationId = "4-3-3";
  const layout = getPitchLayout(formationId);

  const pele: Player = {
    id: "demo-pele",
    name: "Pelé",
    nation: "BRA",
    year: 1970,
    squadId: "bra-1970",
    position: "ST",
    ovr: 99,
    attributes: {
      pace: 97,
      shooting: 98,
      passing: 98,
      defending: 95,
      physical: 97,
    },
  };

  const garrincha: Player = {
    id: "demo-garrincha",
    name: "Garrincha",
    nation: "BRA",
    year: 1970,
    squadId: "bra-1970",
    position: "RW",
    ovr: 97,
    attributes: {
      pace: 94,
      shooting: 92,
      passing: 95,
      defending: 70,
      physical: 88,
    },
  };

  const rivellino: Player = {
    id: "demo-rivellino",
    name: "Rivellino",
    nation: "BRA",
    year: 1970,
    squadId: "bra-1970",
    position: "CM",
    ovr: 92,
    attributes: {
      pace: 88,
      shooting: 90,
      passing: 93,
      defending: 78,
      physical: 85,
    },
  };

  const filler = (id: string, name: string, position: Player["position"], ovr: number): Player => ({
    id: `demo-${id}`,
    name,
    nation: "BRA",
    year: 1970,
    squadId: "bra-1970",
    position,
    ovr,
    attributes: {
      pace: ovr - 2,
      shooting: ovr - 3,
      passing: ovr - 1,
      defending: ovr - 4,
      physical: ovr - 2,
    },
  });

  const slots: DraftSlot[] = [
    demoPlayer("gk", filler("gk", "Félix", "GK", 88), formationId),
    demoPlayer("lb", filler("lb", "Everaldo", "LB", 85), formationId),
    demoPlayer("cb1", filler("cb1", "Brito", "CB", 86), formationId),
    demoPlayer("cb2", filler("cb2", "Piazza", "CB", 88), formationId),
    demoPlayer("rb", filler("rb", "Carlos Alberto", "RB", 94), formationId),
    demoPlayer("cm1", filler("cm1", "Clodoaldo", "CM", 89), formationId),
    demoPlayer("cm2", rivellino, formationId),
    demoPlayer("cm3", filler("cm3", "Gerson", "CM", 91), formationId),
    demoPlayer("lw", filler("lw", "Tostão", "LW", 92), formationId),
    demoPlayer("st", pele, formationId),
    demoPlayer("rw", garrincha, formationId),
  ];

  const goalEvent: GoalEvent = {
    minute: 88,
    team: "home",
    scorerName: "Pelé",
    period: "regular",
    description: "Pelé marca aos 88'",
  };

  const scorerSlotId = "st";
  const passerSlotId = "cm2";
  const playType: HighlightPlayType = "counter";
  const phases = buildPhases(playType, layout, passerSlotId, scorerSlotId);
  const scorerPos = layout[scorerSlotId];

  return {
    formationId,
    slots,
    replay: {
      goalEvent,
      playType,
      phases,
      scorerSlotId,
      passerSlotId,
      cameraFocus: {
        x: scorerPos.x,
        y: Math.max(12, scorerPos.y - 6),
        scale: 1.75,
      },
      opponentName: "Itália 1982",
      scoreAfter: { home: 2, away: 1 },
    },
  };
}
