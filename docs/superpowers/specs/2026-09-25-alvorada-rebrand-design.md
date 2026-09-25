# ppl-compass v0.5.0 — rebrand para o design system v6B "Alvorada"

**Data:** 2026-09-25 · **Origem:** fork de `FelipeSilveiraBNG/ppl-compass@0.4.2` em `andreiandrade-bng/ppl-compass`
**Fonte da identidade:** `BNG People/PRD/_transversal/design-system.md` (v6B, aprovado pelo PO em 21/09/2026)

## 1. O que muda e o que não muda

**Não muda:** a arquitetura do pacote (CSS + JS, zero dependência, servido pelo jsDelivr por tag com SRI), o
prefixo `.ppl-`, a API `PplCompass.*`, os atributos `data-ppl-*`, a máquina de quatro estados, a confirmação por
risco (R2/R3), o Wizard, a navegação a partir de JSON, o lint/CI que falha fechado, os 136 ícones do lucide.

**Muda (a identidade inteira):**

| Dimensão | v5 (fork de origem) | v6B Alvorada (esta versão) |
|---|---|---|
| Primária | azul `#2F5AD0` | roxo `#8100FF` — a única cor de ação |
| Acento quente | dourado `#F3C63F`, em qualquer superfície | pêssego `#FFB899`, **só sobre superfícies escuras**, sempre com texto tinta |
| Filosofia de cor | tinta | luz: rampa da noite (`#130D22`) ao dia (`#FBF9F7`) |
| Degradês | nav, CTA de destaque, dourado, selo | só onde há céu: ciclorama (login/porta), sidebar, app à noite, selo. **Nunca** em botão, texto, tabela ou card |
| Tipografia | Urbanist + Playfair itálica + JetBrains Mono | **Sora** (títulos, 600–700) + **Manrope** (UI, 400–800) + **JetBrains Mono** (dados) |
| Raio | 12 controle / 16–18 card | **8** em UI densa / **12** em card / 999 pílula |
| Elevação | sombra difusa em card | card = borda de 1px e **nenhuma sombra**; sombra só em flutuantes (FAB, toast, modal, dropdown, card do login) |
| Vidro | topbar e landing com `backdrop-filter` | sai o vidro: topbar sólida, landing plana |
| Tema escuro | só na landing (`--ppl-lp-*`) | **primeira classe, no shell inteiro**; `prefers-color-scheme` + `data-theme` |
| Eyebrow | 11px caixa alta rastreada acima do título | **abolido**: contexto vira caption abaixo do título; a única caixa alta rastreada é o rótulo de grupo da sidebar |
| Item ativo da sidebar | fundo translúcido + barra dourada | **pílula do dia**: fundo branco, texto e ícone roxos, sem barra |
| Marca na sidebar | quadrado dourado "b" | **logotipo horizontal branco** (150px) + legenda "Depto. Pessoal" em caixa baixa |
| Movimento | subir 2px no hover | mudança de estado é mudança de luz (200ms); um momento autoral, o **Raise** do horizonte (900ms, uma vez) |

## 2. Tokens (`src/tokens.css`) — de/para

Nomes aposentados **reprovam no build** (invariantes): `--ppl-blue-*`, `--ppl-gold*`, `--ppl-lp-*`, `--ppl-info`,
`--ppl-grad-primary`, `--ppl-grad-gold`, `--ppl-shadow-sm`, `--ppl-shadow-lg`, `--ppl-surface-sunk`,
`--ppl-surface-mute`, `--ppl-surface-head`, `--ppl-text-eyebrow`, `--ppl-radius-card-lg`, `.ppl-eyebrow`,
`.ppl-glass`, `.ppl-grad-text`, `.ppl-landing__mesh`, `.ppl-btn--hero`, `.ppl-btn--gold`, `.ppl-badge--gold`,
`.ppl-icon-tile--gold`, `.ppl-nav__mark`, `.ppl-stat-hero`, cores `#2f5ad0` e `#6f00ff`, fontes Urbanist e Playfair.

| Grupo | Tokens |
|---|---|
| Rampa | `--ppl-violet-50…950` (F9F5FF, F1E8FF, E3D0FF, CDAEFF, B48AFF, 9A4DFF, 8100FF, 6600CC, 3E1585, 25104F, 130D22) |
| Marca | `--ppl-primary` 8100FF · `--ppl-primary-hover` 6E00DB · `--ppl-primary-fg` fff · `--ppl-primary-soft` F1E8FF · `--ppl-primary-tint` E3D0FF · `--ppl-link` 6A00D6 · `--ppl-strong` 6600CC · `--ppl-nav-base` 3E1585 · `--ppl-dawn` 25104F · `--ppl-night` 130D22 · `--ppl-lilac` B48AFF · `--ppl-lilac-soft` CDAEFF |
| Luz quente | `--ppl-peach` FFB899 · `--ppl-peach-soft` FFE3D3 · `--ppl-rose` F27BB8 · `--ppl-orchid` C24DFF (rosa e orquídea só em degradê) |
| Texto | `--ppl-ink` 1E1826 · `--ppl-ink-body` 433C4D · `--ppl-ink-soft` 6C6577 · `--ppl-ink-faint` 736C86 · `--ppl-ink-disabled` A79FBD · `--ppl-on-dark` fff · `--ppl-on-dark-soft` CDAEFF |
| Superfície | `--ppl-surface` fff · `--ppl-surface-app` FBF9F7 · `--ppl-surface-subtle` F4F1F6 · `--ppl-surface-muted` ECE7F0 · `--ppl-surface-dark` 25104F · `--ppl-border` E6E1EA · `--ppl-border-strong` CFC8DA |
| Semânticos | `--ppl-success` 0E8A4F / `-soft` E6F5EE / `-strong` 0A6B3D · `--ppl-warning` B5892C / F7EDD4 / 866521 · `--ppl-danger` C0392B / FBEAE7 / BB372A · `--ppl-neutral` 5E5775 / `-soft` E9E4EE · `--ppl-success-on-dark` 7ED9A9 · `--ppl-danger-on-dark` F08A7E |
| Luz (degradês) | `--ppl-grad-sky` (ciclorama) · `--ppl-grad-nav` (sidebar) · `--ppl-grad-seal` (selo) · `--ppl-grad-night` (app à noite) · `--ppl-grad-day` (fundo do dia) |
| Sombra | `--ppl-shadow-color` 62 21 133 · `--ppl-shadow-float` `0 10px 24px -10px rgb(… / .22)` |
| Fonte | `--ppl-font-sans` Manrope · `--ppl-font-display` Sora · `--ppl-font-data` JetBrains Mono |
| Tamanho | `--ppl-text-2xs` 11 · `xs` 12 · `sm` 12.5 · `base` 14 · `md` 15 · `lg` 18 · `h1` 24 · `display` 32 · `hero-number` 40 |
| Forma | `--ppl-radius-sm` 4 · `md` 8 · `control` 8 · `card` 12 · `pill` 999 |
| Movimento | `fast` 120 · `base` 200 · `slow` 300 · `raise` 900ms · `ease` `cubic-bezier(.16,1,.3,1)` |
| Layout | `--ppl-nav-w` 242px · `--ppl-content-max` 1200px · `--ppl-touch` 44px · `--ppl-focus-ring` = primary (lilás no escuro) |
| Dependentes de tema | `--ppl-punch-bg`/`-fg` (roxo/branco de dia, pêssego/tinta à noite) · `--ppl-tab-active` (roxo de dia, pêssego à noite) · `--ppl-scrim` |

**Tema escuro** (`@media (prefers-color-scheme: dark) :root:not([data-theme="light"])` e `:root[data-theme="dark"]`):
app 130D22 · surface 1C1530 · subtle 241B3C · muted 2A2044 · border 342A4F / 4A3D6B · ink F3EFF8 · body CFC7DC ·
soft BDB4D0 · faint AFA6C6 · disabled 6F6688 · primary B48AFF (fg 1E1826) · hover CDAEFF · link CDAEFF ·
strong CDAEFF · primary-soft 241B3C · primary-tint 3E1585 · danger-strong F08A7E · success-strong 7ED9A9 ·
warning-strong E3B85A · neutral B5ABCF / 2A2044 · shadow 0 0 0 (.45) · focus-ring lilac · grad-day = grad-night.
A sidebar é **sempre noite** nos dois temas.

## 3. Componentes (`src/components.css`) — o que cada receita vira

- **Superfícies:** `.ppl-canvas` = `--ppl-grad-day`. `.ppl-card` = borda 1px, raio 12, sem sombra; interativo: fundo `--ppl-surface-subtle` e borda roxa no hover (sem deslocamento). `.ppl-bar` sólida com hairline.
- **Texto:** `.ppl-display` Sora 600 `-0.02em`, `--hero` 32→40px. `.ppl-data` mono tabular. **Novos:** `.ppl-caption` (12px `--ppl-ink-faint`, contexto abaixo do título), `.ppl-group-label` (11/700/.14em/caixa alta/lilás-suave — só sidebar), `.ppl-hero-number` (mono 40–48/600/-0.03em), `.ppl-chip-code` (mono em pílula subtle).
- **Botões:** raio 8; `--primary` sólido roxo; `--secondary` vazado (borda strong, texto roxo, hover fundo violet-50); `--ghost`; `--danger`; **`--punch`** (bater ponto: `--ppl-punch-*`, roxo de dia e pêssego à noite); `--sm`, `--icon`, `--touch`. **Novo `.ppl-fab`**: pílula roxa com sombra flutuante.
- **Badges (2.2, fases do dia):** base em caixa baixa 11/600; `--dawn` (admitido: F1E8FF/6600CC, ponto vazado), `--day` (ativo: branco, borda e texto roxos, ponto cheio), `--transit` (transferido: E3D0FF/6600CC, ponto tracejado), `--warning`, `--muted` (desligado: E9E4EE/5E5775), `--danger`, `--success`, `--info` (= dawn), `--count` (mono). `.ppl-badge__dot`, `--hollow`, `--dashed`.
- **Tile:** raio 8, `--ppl-primary-soft`/roxo; `--warn` (âmbar); `--dark`.
- **Formulário:** rótulo 13/600 caixa baixa; input raio 8, borda strong em repouso, foco roxo, 40px (44 em toque); erro em `--ppl-danger-strong`.
- **Alert / toast:** alert tonal por token; toast sobre `--ppl-surface-dark` (sempre escuro), texto branco, ícone colorido com os `-on-dark`, sombra flutuante, sem blur.
- **Drawer / diálogo:** painéis sólidos (sem blur), scrim `--ppl-scrim`, sombra flutuante, raio 12 no diálogo; alvo com barra roxa; frase em violet-50.
- **Nav (3.1):** 242px, `--ppl-grad-nav`, sempre noite. `.ppl-nav__logo` (SVG branco inline, 150px) + `.ppl-nav__tag` 11/500 caixa baixa lilás-suave. Item: branco 88%, raio 8, 9×12; hover branco 10%; **ativo = pílula branca com texto roxo**. Grupo = `.ppl-group-label` com chevron. `.ppl-nav__count` = pílula pêssego, mono, tinta (o único pêssego do console). Rodapé: avatar branco com iniciais roxas.
- **Topbar:** sólida; `.ppl-topbar__chip` (chip tonal com ponto roxo: o grupo ativo) substitui o eyebrow; migalha com ícone roxo.
- **Cabeçalho de página:** título Sora 24/700; `.ppl-page-head__meta` vira caption **abaixo** do título.
- **Painel / choice / stat:** título de painel Sora 16/600; choice raio 12, padding 20, min 150px, hover subtle; `.ppl-stat` plano; `.ppl-stat-hero` **removido** → `.ppl-hero-number` em card.
- **Tabela:** thead `--ppl-surface-muted`, th 12/700 caixa baixa, hover violet-50.
- **Estados:** skeleton subtle; spinner roxo + violet-200.
- **Steps:** atual = roxo cheio com texto branco (o ativo é invertido); concluído = fundo `--ppl-primary-soft`, número roxo cheio.
- **Tabbar:** fundo `--ppl-tabbar-bg` (branco 92% / noite 86%), ativo `--ppl-tab-active`, pílula `--ppl-primary-soft` (à noite, pêssego a 18%).
- **Landing (2.6 "portal externo: dia frio"):** plana sobre `--ppl-grad-day`; `.ppl-landing__bar` = faixa de céu (`--ppl-grad-sky` cortado no topo, logo branca); hero Sora; sem vidro, sem texto em degradê, sem pêssego. `.ppl-sheet` sólida.
- **Novos dispositivos (2.5):** `.ppl-sky` (ciclorama de tela inteira ou faixa, `--ppl-sky__glow` com o Raise), `.ppl-sky__card` (card branco apoiado no horizonte, com sombra), `.ppl-seal` (selo de alvorada 56px com check e anel), `.ppl-horizon` + `__seg` (faixa de 4 segmentos, `--1…--4`, rótulo + contagem mono, tema escuro com a rampa da noite).

## 4. JavaScript

- `nav()`: contador → `ppl-badge ppl-badge--count ppl-nav__count`; `marca` aceita `{ logo: "people", tag }` e desenha o SVG (`PplCompass.logo()`), ou `{ nome, tag }` sem logo.
- `tema`: inalterado — mas agora vale no shell inteiro (o toggle pode morar na topbar).
- Wizard: sem eyebrow na etapa (a galeria usava `.ppl-eyebrow` numa string).

## 5. Scripts e CI

- `invariantes.mjs`: lista de nomes aposentados acima; CDN permitido `gh/andreiandrade-bng/ppl-compass`; identidade anterior = azul `#2f5ad0`.
- `lint.mjs`: "um dourado" → "**um pêssego por superfície**" (`ppl-btn--punch`, `ppl-nav__count`); `PARES` recalculados com os pares do DS §2.1/§6 nos dois temas; `DIVIDA` = `--ppl-success` (4,2:1 sobre o dia, uso de ícone) e `--ppl-warning` (3,2:1, uso de ícone) — texto usa `-strong`.
- `sri.mjs`: `PPL_OWNER` padrão `andreiandrade-bng`.
- Fontes: `sora-var.woff2`, `manrope-var.woff2`, `jetbrains-mono-var.woff2` (Google Fonts, subset latin, variáveis).

## 6. Documentação, templates e galeria

- `index.html`: páginas reescritas para a identidade (Início, tokens com a rampa, superfícies com caption, botões, badges por fase, navegação com pílula e contador pêssego, landing de dia frio) e **página nova "Luz"** (ciclorama, selo, horizonte, Raise, dosagem 2.6). Cromo da doc: painel de código sobre `--ppl-dawn`.
- `templates/`: os 8 arquétipos migrados (sem eyebrow, contexto em caption, punch na PWA, home com Horizonte do dia e sem card dourado) + **`login.html`** (porta de entrada em ciclorama). URLs do CDN → `andreiandrade-bng/ppl-compass@0.5.0`.
- `demo/gallery.html`, `demo/proof*.html`: idem.
- README, NOTICE (fontes novas), templates/README.

## 7. Publicação

`npm run check` verde → `dist/` regenerado → hashes SRI no README/templates/proof → commit "release: v0.5.0 - alvorada" →
tag `v0.5.0` → push → GitHub Pages (branch `main`, raiz) em `https://andreiandrade-bng.github.io/ppl-compass/`.
