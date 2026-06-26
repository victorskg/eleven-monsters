# Princípios de design — Eleven Monsters

Este documento define a identidade do jogo e como validar mudanças. **Leia antes de alterar balanceamento, draft, simulação ou modos de jogo.**

## Diferencial vs 7a0

O [7a0](competitor-7a0-analysis.md) é essencialmente um jogo de **seed**: ~73% das seeds tornam o título matematicamente impossível, mesmo com escolhas perfeitas. A frustração vem da RNG, não das decisões do jogador.

**Eleven Monsters inverte isso:** habilidade e boas decisões devem pesar **mais** que a seed.

| | 7a0 | Eleven Monsters |
|---|-----|-----------------|
| Seed manda | Sim (~73% runs perdidas por design) | Não — seed define adversários/placares, não o teto do jogador |
| Draft importa | Pouco (nota visível) | Muito (química, posição, modo almanaque) |
| Tática importa | Não | Sim (estilo, intervalo, matchup) |
| Conhecimento importa | Não | Sim (modo almanaque, perfis de adversário) |

## Pilares de agência do jogador

Toda feature nova deve reforçar pelo menos um destes pilares:

1. **Draft** — escolher jogadores certos para cada posição; química (duplas, nação, era, traits)
2. **Tática** — sliders de estilo + conselho contra fraqueza do adversário
3. **Intervalo** — decisão push / hold / maintain altera o 2º tempo
4. **Conhecimento** — modo almanaque recompensa quem conhece futebol histórico

Evite mecânicas que **anulem** decisões (ex.: bloqueio duro por seed, stats ocultos sem forma de inferir, adversários opacos).

## Métricas de balanceamento (baseline atual)

Rodar `bun run balance` após mudanças em `simulation.ts`, `tournament.ts`, `ratings.ts`, `chemistry.ts` ou `draft.ts`.

### Taxas de campeonato (3000 runs, tática default)

| Perfil | OVR | Campeão | Classificou | Quartas+ |
|--------|-----|---------|-------------|----------|
| Mediano | 80 | ~8% | ~80% | ~60% |
| Forte | 85 | ~19% | ~86% | ~70% |
| Elite | 90 | ~34% | ~89% | ~77% |

### Agência vs seed (seeds pareadas)

| Métrica | Valor atual | Alvo mínimo |
|---------|-------------|-------------|
| Lift habilidade (90 − 80 campeão) | ~26 pp | **≥ 20 pp** |
| Elite ganha, mediano não (mesma seed) | ~27% | **≥ 15%** |
| Mediano ganha, elite não (mesma seed) | ~0,3% | **≤ 2%** |
| Seeds sem classificação (time 90) | ~11% | **≤ 15%** |
| Lift decisão (push vs maintain, OVR 85) | ~7 pp | **≥ 3 pp** |

Interpretação:

- **Lift de habilidade alto** → montar um time melhor muda o resultado de forma clara
- **Mediano quase nunca vence quando elite perde** → sorte não supera qualidade
- **Poucas seeds “sem classificação” com time elite** → seed não mata a run cedo
- **Lift de decisão** → intervalo e tática importam

### O que NÃO otimizar

- Não copiar a curva do 7a0 (quartas ~38% com time mediano) se isso exigir seeds impossíveis
- Não aumentar variância só para “dramatizar” — frustração sem agência é anti-design
- Não esconder informação no modo clássico; no almanaque, pistas > RNG pura

## Parâmetros sensíveis

| Arquivo | Constantes | Efeito |
|---------|------------|--------|
| `simulation.ts` | `PHASE_STRENGTH`, `BASE_GOALS`, `STRENGTH_FACTOR` | Curva de dificuldade por fase |
| `ratings.ts` | pesos de atributo, mods de estilo | Quanto draft/tática impactam |
| `chemistry.ts` | bônus, duplas, cap | Recompensa por synergies |
| `draft.ts` | pesos do pack | Variedade vs consistência |
| `matchups.ts` | mods táticos | Leitura de adversário |

Mata-mata atual (`PHASE_STRENGTH`): grupos 72, oitavas 75, quartas 79, semi 83, final 86.

## Checklist antes de merge

- [ ] `bun run test` passa (inclui `balance.test.ts`)
- [ ] `bun run balance` — métricas dentro dos alvos
- [ ] Mudança reforça agência (draft/tática/intervalo/conhecimento)?
- [ ] Modo almanaque continua jogável sem memorizar notas?

## Referências

- Simulador: `src/engine/balance.ts`
- Script: `bun run balance`
- Testes de regressão: `src/engine/balance.test.ts`
- Análise 7a0: `docs/competitor-7a0-analysis.md`
