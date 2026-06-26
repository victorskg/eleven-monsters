import { describe, expect, it } from "vitest";
import { ALL_SQUADS } from "./index";
import {
  formatValidationReport,
  getReferencedSquadIds,
  validateAllSquads,
  validateSquadStructure,
} from "./validate";

describe("squads", () => {
  it("todas as seleções passam validação estrutural", () => {
    const issues = ALL_SQUADS.flatMap((s) => validateSquadStructure(s));
    expect(issues, formatValidationReport(issues)).toEqual([]);
  });

  it("seleções com referência batem com elenco esperado", () => {
    const issues = validateAllSquads(ALL_SQUADS);
    const referenceIssues = issues.filter((i) => i.kind === "reference");
    expect(referenceIssues, formatValidationReport(referenceIssues)).toEqual([]);
  });

  it("referência cobre seleções auditadas", () => {
    const referenced = getReferencedSquadIds();
    expect(referenced.length).toBe(ALL_SQUADS.length);
    for (const squad of ALL_SQUADS) {
      expect(referenced, `sem referência: ${squad.id}`).toContain(squad.id);
    }
  });

  it("pool total tem jogadores únicos por ID", () => {
    const ids = ALL_SQUADS.flatMap((s) => s.players.map((p) => p.id));
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });
});
