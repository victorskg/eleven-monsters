# Referência: análise do 7a0 (Sete a Zero)

> **Para agentes de IA:** Contexto sobre o competidor **7a0**. Use para calibrar expectativas e evitar replicar o design seed-driven dele. Os princípios do **Eleven Monsters** estão em [`design-principles.md`](design-principles.md) — **habilidade > seed**.

## TL;DR

- O **7a0** é um jogo de draft + simulação de Copa com RNG determinística por **seed**.
- ~**73% das seeds** tornam o título **impossível**, mesmo com escolhas ótimas.
- Placares usam **Poisson**; adversários ficam mais fortes a cada fase.
- Time mediano (OVR ~80) chega à final ~**12%** das vezes; campeão com jogo perfeito ~**10%**.
- **Eleven Monsters** deve ser o oposto: draft, tática, intervalo e conhecimento (almanaque) devem mover o resultado mais que a seed.

---

## Metadados

| Campo | Valor |
|-------|-------|
| Jogo analisado | 7a0 (Sete a Zero) |
| Gênero | Draft de seleções históricas + simulação de Copa |
| Método | Engenharia reversa via console do navegador |
| Fonte original | Artigo de **yagovf** (adaptado para referência interna) |
| Uso neste repo | Benchmark do que **não** copiar |

---

## Loop de jogo (7a0)

1. Rola dado → recebe seleção histórica
2. Monta elenco posição a posição (draft)
3. Simula Copa (grupos + mata-mata)
4. Objetivo: sair invicto / conquistar título

---

## RNG e seed

### Comportamento

- Gerador **pseudoaleatório com seed** fixada no início da partida.
- A seed define **tudo** de forma determinística:
  - Seleções disponíveis no draft
  - Adversários por fase
  - Placares de cada jogo
- O jogo **revela** progressivamente; o resultado já está decidido no segundo 0.
- Seed ≈ número com **~4,29 bilhões** de possibilidades (praticamente única por partida).
- Adversários por fase também vêm da seed (ex.: "Escócia 1974 nas quartas" é roteiro, não RNG ao vivo).

### Implicação de design

> Sabendo a seed, dá para prever o torneio inteiro antes de simular.

---

## Simulação de placar

### Modelo

- Dois sorteios **independentes** (gols a favor e gols sofridos).
- Distribuição: **Poisson** (modelo estatístico comum para gols).

### Fórmulas

```
λ_gols_a_favor   = 1.4 + (ATAQUE_jogador − força_adversário) × 0.08
λ_gols_sofridos  = 1.4 + (força_adversário − DEFESA_jogador) × 0.08
```

- Base: **1,4 gols** por sorteio ("jogo médio").
- Cada ponto de vantagem no ataque/defesa: **±0,08** na média de gols.

---

## Curva de dificuldade (força do adversário)

| Fase | Força adversário |
|------|------------------|
| Grupos | 68 – 76 |
| Oitavas | 79 |
| Quartas | 83 |
| Semifinal | 87 |
| Final | 91 |

Adversários **escalam**; o elenco do jogador **não**.

---

## Base de jogadores (7a0)

| Dado | Valor |
|------|-------|
| Seleções | ~250 |
| Jogadores | ~5.613 |
| OVR range | 64 – 99 |
| OVR máximo (99) | Maradona, Messi, Pelé, Neuer, Yashin |
| Ofuscação | XOR + código interno por atleta (notas exibidas ≠ reais) |

---

## Taxas de vitória por fase (simulações com notas reais)

Probabilidade de **vencer** a fase (não acumulada de campeonato):

| Fase | Time mediano (OVR ~80) | Time forte (OVR ~90) |
|------|------------------------|----------------------|
| Grupos | 60% – 80% | ~90% |
| Oitavas | 54% | 88% |
| Quartas | 38% | 76% |
| Semifinal | 24% | 62% |
| Final | 12% | 46% |

**Padrão:** grupos tranquilos → queda brusca no mata-mata → sensação de "morrer nas quartas".

---

## Seed vs habilidade (3.000 simulações)

| Cenário | Taxa de título |
|---------|----------------|
| Jogador perfeito (escolhas ótimas, sem voltar atrás) | ~**10%** |
| Com retrospecto (reorganiza elenco ao final) | ~**27%** |
| Escolhendo a seed livremente | **100%** |

### Conclusão quantitativa

- ~**73% das seeds** → título **impossível** independente das decisões.
- Resultado frequentemente **parcialmente determinado** antes da primeira escolha.
- Habilidade muda quanto você **aproveita** a seed; raramente transforma seed ruim em título.

---

## Psicologia de retenção (7a0)

- Projetado para ser **quase ganhável**: boa parte chega longe, perde no fim → "jogar de novo".
- Frustração nas quartas é **matemática**, não sabotagem intencional visível.

---

## Contraste: 7a0 vs Eleven Monsters

| Aspecto | 7a0 | Eleven Monsters |
|---------|-----|-----------------|
| Seed | Define teto (~73% runs impossíveis) | Define adversários/placares, **não** teto |
| Draft | Notas visíveis; pouca sinergia | Química, posição, traits, modo almanaque |
| Tática | Ausente | Estilo + matchup + intervalo |
| Taxa título (mediano) | ~10% com jogo **perfeito** | ~8% com time uniforme 80; ~34% com elite 90 |
| Lift habilidade (80→90) | Limitado pela seed | ~**+26 pp** campeão (seeds pareadas) |
| Seeds sem classificação (elite) | Alto (estrutural) | ~**11%** (guardrail ≤ 15%) |

**Regra:** ao implementar features, pergunte — *isso aumenta agência do jogador ou só a variância da seed?*

---

## Arquivos relacionados neste repo

| Arquivo | Conteúdo |
|---------|----------|
| [`design-principles.md`](design-principles.md) | Princípios e guardrails do Eleven Monsters |
| [`../src/engine/balance.ts`](../src/engine/balance.ts) | Simulador Monte Carlo + `runAgencyReport` |
| [`../.cursor/rules/game-design.mdc`](../.cursor/rules/game-design.mdc) | Regra always-on para agentes de IA |
| Comando | `bun run balance` |

---

## Créditos

Análise original: **yagovf** — engenharia reversa do 7a0 publicada ~11 dias antes da adaptação deste documento. Adaptado para referência interna do projeto Eleven Monsters; respeito ao criador original do 7a0.
