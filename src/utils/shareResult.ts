export interface ShareResultStats {
  champion: boolean;
  wins: number;
  goalsFor: number;
  goalsAgainst: number;
}

export function buildShareMessage(stats: ShareResultStats): string {
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}${window.location.pathname}`
      : "https://eleven-monsters.vercel.app";

  if (stats.champion) {
    return `🏆 Campeão no Eleven Monsters! ${stats.wins} vitórias, ${stats.goalsFor} gols marcados e ${stats.goalsAgainst} gols sofridos. Monte seu time e tente superar: ${url}`;
  }

  return `⚽ Joguei Eleven Monsters — ${stats.wins} vitórias e ${stats.goalsFor} gols marcados. Consegue fazer melhor? ${url}`;
}

export async function shareGameResult(
  stats: ShareResultStats,
): Promise<"shared" | "copied"> {
  const text = buildShareMessage(stats);
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}${window.location.pathname}`
      : "";

  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({
        title: "Eleven Monsters",
        text,
        url: url || undefined,
      });
      return "shared";
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        throw err;
      }
    }
  }

  await navigator.clipboard.writeText(text);
  return "copied";
}
