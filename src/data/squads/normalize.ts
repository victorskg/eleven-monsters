/** Normaliza nome para comparação (sem acentos, minúsculas). */
export function normalizePlayerName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Verifica se o nome do jogador contém o fragmento esperado. */
export function playerNameMatches(playerName: string, expected: string): boolean {
  const normPlayer = normalizePlayerName(playerName);
  const normExpected = normalizePlayerName(expected);
  return normPlayer.includes(normExpected) || normExpected.includes(normPlayer);
}
