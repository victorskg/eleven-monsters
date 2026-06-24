import type { Formation, FormationId, PitchCoordinate } from "./types";

export const FORMATION_PITCH_LAYOUTS: Record<
  FormationId,
  Record<string, PitchCoordinate>
> = {
  "4-3-3": {
    gk: { x: 50, y: 90 },
    lb: { x: 18, y: 68 },
    cb1: { x: 38, y: 72 },
    cb2: { x: 62, y: 72 },
    rb: { x: 82, y: 68 },
    cm1: { x: 30, y: 48 },
    cm2: { x: 50, y: 44 },
    cm3: { x: 70, y: 48 },
    lw: { x: 22, y: 22 },
    st: { x: 50, y: 16 },
    rw: { x: 78, y: 22 },
  },
  "4-4-2": {
    gk: { x: 50, y: 90 },
    lb: { x: 18, y: 68 },
    cb1: { x: 38, y: 72 },
    cb2: { x: 62, y: 72 },
    rb: { x: 82, y: 68 },
    lm: { x: 20, y: 42 },
    cm1: { x: 38, y: 48 },
    cm2: { x: 62, y: 48 },
    rm: { x: 80, y: 42 },
    st1: { x: 38, y: 18 },
    st2: { x: 62, y: 18 },
  },
  "3-5-2": {
    gk: { x: 50, y: 90 },
    cb1: { x: 28, y: 72 },
    cb2: { x: 50, y: 74 },
    cb3: { x: 72, y: 72 },
    lwb: { x: 14, y: 50 },
    cdm: { x: 50, y: 52 },
    cm1: { x: 35, y: 42 },
    cm2: { x: 65, y: 42 },
    rwb: { x: 86, y: 50 },
    st1: { x: 38, y: 18 },
    st2: { x: 62, y: 18 },
  },
};

export const FORMATIONS: Record<FormationId, Formation> = {
  "4-3-3": {
    id: "4-3-3",
    label: "4-3-3",
    slots: [
      { id: "gk", position: "GK", label: "GOL" },
      { id: "lb", position: "LB", label: "LE" },
      { id: "cb1", position: "CB", label: "ZAG" },
      { id: "cb2", position: "CB", label: "ZAG" },
      { id: "rb", position: "RB", label: "LD" },
      { id: "cm1", position: "CM", label: "VOL" },
      { id: "cm2", position: "CM", label: "MEI" },
      { id: "cm3", position: "CM", label: "MEI" },
      { id: "lw", position: "LW", label: "PE" },
      { id: "st", position: "ST", label: "ATA" },
      { id: "rw", position: "RW", label: "PD" },
    ],
  },
  "4-4-2": {
    id: "4-4-2",
    label: "4-4-2",
    slots: [
      { id: "gk", position: "GK", label: "GOL" },
      { id: "lb", position: "LB", label: "LE" },
      { id: "cb1", position: "CB", label: "ZAG" },
      { id: "cb2", position: "CB", label: "ZAG" },
      { id: "rb", position: "RB", label: "LD" },
      { id: "lm", position: "LW", label: "ME" },
      { id: "cm1", position: "CM", label: "VOL" },
      { id: "cm2", position: "CM", label: "MEI" },
      { id: "rm", position: "RW", label: "MD" },
      { id: "st1", position: "ST", label: "ATA" },
      { id: "st2", position: "ST", label: "ATA" },
    ],
  },
  "3-5-2": {
    id: "3-5-2",
    label: "3-5-2",
    slots: [
      { id: "gk", position: "GK", label: "GOL" },
      { id: "cb1", position: "CB", label: "ZAG" },
      { id: "cb2", position: "CB", label: "ZAG" },
      { id: "cb3", position: "CB", label: "ZAG" },
      { id: "lwb", position: "LB", label: "ALA" },
      { id: "cdm", position: "CDM", label: "VOL" },
      { id: "cm1", position: "CM", label: "MEI" },
      { id: "cm2", position: "CM", label: "MEI" },
      { id: "rwb", position: "RB", label: "ALA" },
      { id: "st1", position: "ST", label: "ATA" },
      { id: "st2", position: "ST", label: "ATA" },
    ],
  },
};

export function getFormation(id: FormationId): Formation {
  return FORMATIONS[id];
}

export function getPitchLayout(id: FormationId): Record<string, PitchCoordinate> {
  return FORMATION_PITCH_LAYOUTS[id];
}
