export interface ShareResultStats {
  champion: boolean;
  wins: number;
  goalsFor: number;
  goalsAgainst: number;
}

function getShareUrl(): string {
  return typeof window !== "undefined"
    ? `${window.location.origin}${window.location.pathname}`
    : "https://eleven-monsters.vercel.app";
}

function buildShareText(stats: ShareResultStats): string {
  if (stats.champion) {
    return `🏆 Campeão no Eleven Monsters! ${stats.wins} vitórias, ${stats.goalsFor} gols marcados e ${stats.goalsAgainst} gols sofridos. Monte seu time e tente superar:`;
  }

  return `⚽ Joguei Eleven Monsters — ${stats.wins} vitórias e ${stats.goalsFor} gols marcados. Consegue fazer melhor?`;
}

export function buildShareMessage(stats: ShareResultStats): string {
  return `${buildShareText(stats)} ${getShareUrl()}`;
}

export async function shareGameResult(
  stats: ShareResultStats,
): Promise<"shared" | "copied"> {
  const message = buildShareMessage(stats);

  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({
        title: "Eleven Monsters",
        text: message,
      });
      return "shared";
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        throw err;
      }
    }
  }

  await navigator.clipboard.writeText(message);
  return "copied";
}
