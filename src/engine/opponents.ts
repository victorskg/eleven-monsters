import type { OpponentProfile, PlayStyle } from "./types";

const DEFAULT_STYLE: PlayStyle = { pressing: 50, width: 50, tempo: 50 };

const PROFILES: Record<string, Omit<OpponentProfile, "playStyle"> & { playStyle: PlayStyle }> = {
  "Grécia 2004": {
    playStyle: { pressing: 35, width: 40, tempo: 30 },
    trait: "Retranca",
    weakness: "Vulnerável a pressão alta e jogo largo",
    strengthNote: "Defesa sólida, pouca criação",
  },
  "Camarões 1990": {
    playStyle: { pressing: 55, width: 55, tempo: 60 },
    trait: "Físico",
    weakness: "Desorganizado sob pressão constante",
    strengthNote: "Ataque imprevisível",
  },
  "EUA 1994": {
    playStyle: { pressing: 45, width: 45, tempo: 40 },
    trait: "Defensivo",
    weakness: "Meio-campo fraco contra ritmo alto",
    strengthNote: "Disciplina tática",
  },
  "Coreia 2002": {
    playStyle: { pressing: 70, width: 50, tempo: 65 },
    trait: "Pressão",
    weakness: "Espaços nas costas da defesa",
    strengthNote: "Intensidade e corrida",
  },
  "África do Sul 2010": {
    playStyle: { pressing: 50, width: 55, tempo: 50 },
    trait: "Equilibrado",
    weakness: "Falta de craques decisivos",
    strengthNote: "Organização coletiva",
  },
  "Nova Zelândia 2010": {
    playStyle: { pressing: 30, width: 35, tempo: 25 },
    trait: "Retranca",
    weakness: "Muito vulnerável ao ataque",
    strengthNote: "Defesa compacta",
  },
  "México 1986": {
    playStyle: { pressing: 55, width: 60, tempo: 55 },
    trait: "Contra-ataque",
    weakness: "Domínio de posse",
    strengthNote: "Transições rápidas",
  },
  "Suécia 1994": {
    playStyle: { pressing: 50, width: 45, tempo: 45 },
    trait: "Físico",
    weakness: "Criação limitada",
    strengthNote: "Jogo direto e bolas aéreas",
  },
  "Bélgica 2018": {
    playStyle: { pressing: 60, width: 55, tempo: 60 },
    trait: "Equilibrado",
    weakness: "Linhas muito abertas",
    strengthNote: "Qualidade individual",
  },
  "Japão 2018": {
    playStyle: { pressing: 65, width: 50, tempo: 70 },
    trait: "Pressão",
    weakness: "Falta de peso físico",
    strengthNote: "Organização e ritmo",
  },
  "Holanda 1974": {
    playStyle: { pressing: 65, width: 80, tempo: 85 },
    trait: "Posse",
    weakness: "Vulnerável a contra-ataques rápidos",
    strengthNote: "Domínio tático e criativo",
  },
  "Alemanha 2006": {
    playStyle: { pressing: 60, width: 55, tempo: 55 },
    trait: "Equilibrado",
    weakness: "Paciência excessiva no ataque",
    strengthNote: "Eficiência e disciplina",
  },
  "Uruguai 1950": {
    playStyle: { pressing: 55, width: 45, tempo: 50 },
    trait: "Físico",
    weakness: "Criação no meio-campo",
    strengthNote: "Garra e combatividade",
  },
  "Croácia 2018": {
    playStyle: { pressing: 55, width: 60, tempo: 65 },
    trait: "Meio-campo",
    weakness: "Defesa em transição",
    strengthNote: "Qualidade técnica no meio",
  },
  "França 1982": {
    playStyle: { pressing: 50, width: 55, tempo: 60 },
    trait: "Criativo",
    weakness: "Inconsistência defensiva",
    strengthNote: "Talentos ofensivos",
  },
  "Itália 1994": {
    playStyle: { pressing: 40, width: 40, tempo: 35 },
    trait: "Retranca",
    weakness: "Pressão alta prolongada",
    strengthNote: "Defesa histórica",
  },
  "Brasil 1998": {
    playStyle: { pressing: 55, width: 65, tempo: 70 },
    trait: "Jogo bonito",
    weakness: "Marcação individual",
    strengthNote: "Ataque estrelado",
  },
  "Portugal 1966": {
    playStyle: { pressing: 50, width: 50, tempo: 55 },
    trait: "Contra-ataque",
    weakness: "Domínio de posse",
    strengthNote: "Eusébio e transições",
  },
  "Argentina 2022": {
    playStyle: { pressing: 55, width: 55, tempo: 60 },
    trait: "Estrelas",
    weakness: "Dependência de craques",
    strengthNote: "Messi e coletivo",
  },
  "Brasil 1970": {
    playStyle: { pressing: 55, width: 70, tempo: 75 },
    trait: "Jogo bonito",
    weakness: "Marcação agressiva",
    strengthNote: "O time mais completo da história",
  },
  "Alemanha 2014": {
    playStyle: { pressing: 65, width: 60, tempo: 65 },
    trait: "Pressão",
    weakness: "Jogo lento e paciente",
    strengthNote: "Pressing alto e eficiência",
  },
  "Espanha 2010": {
    playStyle: { pressing: 60, width: 55, tempo: 50 },
    trait: "Posse",
    weakness: "Contra-ataques diretos",
    strengthNote: "Tiki-taka e controle",
  },
};

export function getOpponentProfile(name: string): OpponentProfile {
  const profile = PROFILES[name];
  if (profile) return profile;

  return {
    playStyle: DEFAULT_STYLE,
    trait: "Equilibrado",
    weakness: "Sem fraqueza clara identificada",
    strengthNote: "Time competitivo",
  };
}

export interface TacticalAdvice {
  exploit: string;
  summary: string;
  highlightPressing: boolean;
  highlightWidth: boolean;
  highlightTempo: boolean;
}

export function getTacticalAdvice(profile: OpponentProfile): TacticalAdvice {
  const w = profile.weakness.toLowerCase();
  let highlightPressing = false;
  let highlightWidth = false;
  let highlightTempo = false;
  const actions: string[] = [];

  if (
    w.includes("pressão") ||
    w.includes("pressao") ||
    w.includes("posse") ||
    w.includes("desorganizado")
  ) {
    highlightPressing = true;
    actions.push("Pressão");
  }
  if (w.includes("ritmo") || w.includes("criação") || w.includes("criacao")) {
    highlightTempo = true;
    actions.push("Ritmo");
  }
  if (w.includes("largo") || w.includes("estica") || w.includes("vulnerável ao ataque")) {
    highlightWidth = true;
    actions.push("Largura");
  }
  if (w.includes("contra-ataque")) {
    highlightPressing = true;
    highlightTempo = true;
    if (!actions.includes("Pressão")) actions.push("Pressão");
    if (!actions.includes("Ritmo")) actions.push("Ritmo");
  }
  if (w.includes("espaços nas costas")) {
    highlightTempo = true;
    if (!actions.includes("Ritmo")) actions.push("Ritmo");
  }

  const unique = [...new Set(actions)];
  const summary =
    unique.length > 0
      ? `Para explorar: suba ${unique.join(", ")}`
      : "Ajuste fino — observe o preview abaixo";

  return {
    exploit: profile.weakness,
    summary,
    highlightPressing,
    highlightWidth,
    highlightTempo,
  };
}
