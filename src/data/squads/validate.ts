import type { Squad } from "../../engine/types";
import { normalizePlayerName, playerNameMatches } from "./normalize";
import referenceData from "./reference.json";

export interface SquadValidationIssue {
  squadId: string;
  kind: "structure" | "reference";
  message: string;
}

export interface SquadReferenceEntry {
  source: string;
  note?: string;
  requiredXI: string[];
  /** Se definido, o pool do jogo deve bater exatamente com esta lista. */
  pool?: string[];
}

type ReferenceFile = {
  version: number;
  squads: Record<string, SquadReferenceEntry>;
};

const reference = referenceData as ReferenceFile;

export function validateSquadStructure(squad: Squad): SquadValidationIssue[] {
  const issues: SquadValidationIssue[] = [];
  const { id, players } = squad;

  if (players.length < 11) {
    issues.push({
      squadId: id,
      kind: "structure",
      message: `menos de 11 jogadores (${players.length})`,
    });
  }

  const gkCount = players.filter((p) => p.position === "GK").length;
  if (gkCount !== 1) {
    issues.push({
      squadId: id,
      kind: "structure",
      message: `esperado 1 goleiro, encontrado ${gkCount}`,
    });
  }

  const ids = players.map((p) => p.id);
  const dupIds = ids.filter((playerId, i) => ids.indexOf(playerId) !== i);
  if (dupIds.length > 0) {
    issues.push({
      squadId: id,
      kind: "structure",
      message: `IDs duplicados: ${[...new Set(dupIds)].join(", ")}`,
    });
  }

  const names = players.map((p) => normalizePlayerName(p.name));
  const dupNames = names.filter((name, i) => names.indexOf(name) !== i);
  if (dupNames.length > 0) {
    issues.push({
      squadId: id,
      kind: "structure",
      message: `nomes duplicados: ${[...new Set(dupNames)].join(", ")}`,
    });
  }

  return issues;
}

export function validateSquadReference(squad: Squad): SquadValidationIssue[] {
  const entry = reference.squads[squad.id];
  if (!entry) return [];

  const issues: SquadValidationIssue[] = [];
  const playerNames = squad.players.map((p) => p.name);

  for (const required of entry.requiredXI) {
    const found = playerNames.some((name) => playerNameMatches(name, required));
    if (!found) {
      issues.push({
        squadId: squad.id,
        kind: "reference",
        message: `jogador obrigatório ausente: ${required}`,
      });
    }
  }

  if (entry.pool) {
    const poolNorm = entry.pool.map(normalizePlayerName).sort();
    const squadNorm = playerNames.map(normalizePlayerName).sort();

    const missingFromSquad = entry.pool.filter(
      (expected) => !playerNames.some((name) => playerNameMatches(name, expected)),
    );
    const extraInSquad = playerNames.filter(
      (name) => !entry.pool!.some((expected) => playerNameMatches(name, expected)),
    );

    if (missingFromSquad.length > 0) {
      issues.push({
        squadId: squad.id,
        kind: "reference",
        message: `pool incompleto, faltam: ${missingFromSquad.join(", ")}`,
      });
    }
    if (extraInSquad.length > 0) {
      issues.push({
        squadId: squad.id,
        kind: "reference",
        message: `jogadores extras fora do pool: ${extraInSquad.join(", ")}`,
      });
    }

    if (
      poolNorm.length !== squadNorm.length &&
      missingFromSquad.length === 0 &&
      extraInSquad.length === 0
    ) {
      // fallback — nomes equivalentes com contagem diferente
      issues.push({
        squadId: squad.id,
        kind: "reference",
        message: `pool com tamanho divergente (ref=${poolNorm.length}, jogo=${squadNorm.length})`,
      });
    }
  }

  return issues;
}

export function validateAllSquads(squads: Squad[]): SquadValidationIssue[] {
  return squads.flatMap((squad) => [
    ...validateSquadStructure(squad),
    ...validateSquadReference(squad),
  ]);
}

export function formatValidationReport(issues: SquadValidationIssue[]): string {
  if (issues.length === 0) return "OK — nenhum problema encontrado.";
  return issues
    .map((i) => `[${i.squadId}] (${i.kind}) ${i.message}`)
    .join("\n");
}

export function getReferencedSquadIds(): string[] {
  return Object.keys(reference.squads);
}
