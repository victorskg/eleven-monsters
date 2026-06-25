import type { PlayStyle } from "./types";

export interface MatchupModifier {
  attackMod: number;
  defenseMod: number;
  notes: string[];
}

export function calculateMatchupModifier(
  userStyle: PlayStyle,
  opponentStyle: PlayStyle,
): MatchupModifier {
  let attackMod = 1;
  let defenseMod = 1;
  const notes: string[] = [];

  const pressingDelta = userStyle.pressing - opponentStyle.tempo;
  if (pressingDelta > 15) {
    attackMod += 0.06;
    notes.push("Pressão alta neutraliza ritmo adversário (+ataque)");
  } else if (pressingDelta < -15) {
    attackMod -= 0.04;
    notes.push("Ritmo adversário supera sua pressão (-ataque)");
  }

  const widthDelta = userStyle.width - opponentStyle.width;
  if (widthDelta > 15) {
    attackMod += 0.04;
    notes.push("Jogo largo estica defesa adversária (+ataque)");
  }

  const tempoDelta = userStyle.tempo - opponentStyle.pressing;
  if (tempoDelta > 15) {
    attackMod += 0.04;
    notes.push("Ritmo alto cria superioridade (+ataque)");
  }

  if (userStyle.pressing > 65 && opponentStyle.tempo > 65) {
    defenseMod -= 0.06;
    notes.push("Pressão alta vs posse — espaços nas costas (-defesa)");
  }

  if (userStyle.pressing < 40 && opponentStyle.pressing > 60) {
    defenseMod -= 0.05;
    notes.push("Adversário pressiona, sua saída de bola sofre (-defesa)");
  }

  if (userStyle.width < 40 && opponentStyle.width > 60) {
    defenseMod -= 0.04;
    notes.push("Adversário estica o campo contra você (-defesa)");
  }

  if (userStyle.pressing < 40 && opponentStyle.tempo < 40) {
    defenseMod += 0.05;
    notes.push("Jogo lento neutraliza adversário retrancado (+defesa)");
  }

  attackMod = Math.max(0.85, Math.min(1.15, attackMod));
  defenseMod = Math.max(0.85, Math.min(1.15, defenseMod));

  return { attackMod, defenseMod, notes };
}
