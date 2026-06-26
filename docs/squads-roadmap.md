# Base de seleções — roadmap

## Estrutura de arquivos

| Arquivo | Conteúdo |
|---------|----------|
| `helpers.ts` | Factory `p()` e `squad()` |
| `index.ts` | Agrega `ALL_SQUADS` + exports públicos |
| `lote1.ts` | 20 seleções base |
| `lote2.ts` | 5 seleções — diversidade geográfica |
| `lote3.ts` | 7 seleções — 2010–2014 + Copa 2026 |

## Lotes

### Lote 1 — 20 seleções ✅

Definidas em `lote1.ts`: Brasil 1970/2002, Argentina 86/22, Alemanha 2014, França 98/18, etc.

### Lote 2 — 5 seleções ✅

| ID | Seleção | Craques |
|----|---------|---------|
| `cro-2018` | Croácia 2018 | Modrić, Rakitić, Mandžukić |
| `uru-2010` | Uruguai 2010 | Forlán, Suárez, Cavani |
| `mex-1986` | México 1986 | Negrete, Sánchez |
| `jpn-2002` | Japão 2002 | Nakata, Ono |
| `sen-2002` | Senegal 2002 | Diouf, Cissé |

### Lote 3 — 7 seleções ✅

| ID | Seleção | Notas |
|----|---------|-------|
| `bra-2010` | Brasil 2010 | Kaká, Robinho, Lúcio |
| `bra-2014` | Brasil 2014 | Neymar, Oscar, Thiago Silva |
| `ger-2010` | Alemanha 2010 | Klose, Özil, Thomas Müller |
| `bra-2026` | Brasil 2026 | CBF 18/05 — Alisson, Vini Jr., Neymar, Raphinha |
| `fra-2026` | França 2026 | FFF 14/05 — Mbappé, Dembélé, Saliba, Cherki |
| `nor-2026` | Noruega 2026 | NFF 21/05 — Haaland, Ødegaard, Sørloth |
| `jpn-2026` | Japão 2026 | JFA 15/05 — Endo, Kubo, Kamada (Mitoma fora) |

> **Alemanha 2014** já existia como `ger-2014` no Lote 1 — não duplicada.

### Fontes dos elencos 2026

| Seleção | Fonte | Data |
|---------|-------|------|
| Brasil | [CBF](https://www.cbf.com.br) / ESPN | 18 mai 2026 |
| França | BBC Sport / France 24 | 14 mai 2026 |
| Noruega | BBC Sport / USAToday | 21 mai 2026 |
| Japão | [JFA](https://www.jfa.jp/eng/samuraiblue/worldcup_2026/member.html) / FIFA | 15 mai 2026 |

Atualizar `lote3.ts` se houver mudanças por lesão durante a Copa.

## Ao adicionar seleções

1. Criar squad em `loteN.ts` (ou `index.ts` se core)
2. Trait em `traits.ts` (3+ jogadores)
3. Dupla lendária em `chemistry.ts` se aplicável
4. `bun run test && bun run balance`
5. Atualizar contadores em `HomePage.tsx`

## Validação de elencos

| Arquivo | Função |
|---------|--------|
| `reference.json` | XI de referência + fonte por seleção auditada |
| `normalize.ts` | Comparação de nomes (sem acentos) |
| `validate.ts` | Checagens estruturais + match com referência |
| `squads.test.ts` | Guardrail no CI (`bun run test`) |

```bash
bun run validate:squads   # script standalone
```

Ao corrigir uma seleção, atualizar `reference.json` com `requiredXI` e, se pool fixo, `pool`.

### Status da auditoria (32/32)

Todas as seleções têm entrada em `reference.json`. Correções históricas aplicadas nos lotes 1–2:

| Seleção | Correção principal |
|---------|-------------------|
| `ned-1974` | Rijsbergen + Rensenbrink (final 74); −Rijnsoever, Swart |
| `gre-2004` | XI da final Euro 2004; −Gkalas, Papadopoulos |
| `cmr-1990` | Elenco real + Milla; −nomes inventados |
| `por-1966` | XI do 3º lugar 66; −Morais, Vicente |
| `sen-2002` | XI vs França 2002; −Hajji, Sarr fictícios |
