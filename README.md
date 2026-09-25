# ppl-compass

Framework de prototipação do **BNG People**. CSS + JS, **zero dependência**, servido por CDN.

Monte um protótipo navegável do produto escrevendo HTML — com a identidade **v6B "Alvorada"**
já correta e as regras de acessibilidade já embutidas. Alvorada é cor como **luz**, não tinta: o
roxo `#8100FF` é a única cor de ação e vai da noite ao dia; o pêssego `#FFB899` é a luz do
horizonte e só existe sobre a noite. Sora nos títulos, Manrope na UI, JetBrains Mono nos dados.
A operação é plana; o tema escuro é de primeira classe, no shell inteiro.

Fork de `FelipeSilveiraBNG/ppl-compass` (v0.4.2, identidade v5) em `andreiandrade-bng`. O design
system de origem é o `design-system.md` v6B, aprovado pelo PO em 21/09/2026.

---

## Uso

```html
<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet"
        href="https://cdn.jsdelivr.net/gh/andreiandrade-bng/ppl-compass@0.5.0/dist/ppl-compass.css"
        integrity="sha384-GtiX78xFYEvnHF3D6PbfEwl0OQsFnkaZk2usuHomx/JyFUtN4JfSQgI7T/iZREoh"
        crossorigin="anonymous">
</head>
<body>

  <button class="ppl-btn ppl-btn--primary">Concluir admissão</button>

  <script src="https://cdn.jsdelivr.net/gh/andreiandrade-bng/ppl-compass@0.5.0/dist/ppl-compass-icons.js"
          integrity="sha384-K7HJQ+0th6kgYPtM02Ac4GpT4x/2JVA8oI33rClJ/XEdNIkGmSK+Z4IkMfyJqcHb" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/gh/andreiandrade-bng/ppl-compass@0.5.0/dist/ppl-compass.js"
          integrity="sha384-I1G8vAmXzfvEHSYLoCYHp0xUu3aWq2EIv8WBNscMn68emHFPkI1mPdDgoua8PYGO" crossorigin="anonymous"></script>
  <script>addEventListener('DOMContentLoaded', () => PplCompass.init());</script>
</body>
</html>
```

O `<body>` não leva atributo de marca: o tema (claro, escuro, ou o do sistema) é decidido no
`<html>` e vale para tudo o que está dentro.

**Comece pela documentação:** <https://andreiandrade-bng.github.io/ppl-compass/> — 22 páginas com
o exemplo vivo e o código copiável de cada receita, as regras que o pacote embute e a referência da
API. É o [`index.html`](index.html) da raiz, servido pelo GitHub Pages a partir do `main`.

**Para montar uma tela:** [`templates/`](templates/README.md) traz nove arquétipos prontos —
lista, lista com drawer de edição, wizard, home, detalhe, landing, molde móvel, a casca vazia e a
porta de entrada (`login.html`, em ciclorama). Copie o mais próximo e troque o conteúdo.

**Para conferir um componente isolado:** [`demo/gallery.html`](demo/gallery.html) traz os blocos
soltos, sem a navegação da documentação em volta.

### Arquivos publicados

| Arquivo | O que é |
|---|---|
| `ppl-compass.css` | fontes + tokens + componentes — **o padrão, 1 requisição** |
| `ppl-compass-nofonts.css` | igual, sem `@font-face` |
| `ppl-compass-tokens.css` | só as custom properties — trocar isto troca a marca |
| `ppl-compass-components.css` | só as receitas (exige um tokens) |
| `ppl-compass.js` | os comportamentos |
| `ppl-compass-icons.js` | 136 ícones do **lucide**, geometria embutida (ISC) |
| `fonts/*.woff2` | Sora, Manrope, JetBrains Mono — fontes variáveis, subset latin |
| `LICENSE-lucide.txt` | a licença ISC do lucide — viaja junto por exigência dela |

---

## O que existe

**Superfícies** `.ppl-canvas` `.ppl-card` (`--interactive --veil`) `.ppl-bar`
**Texto** `.ppl-display` (`--hero`) `.ppl-data` `.ppl-hero-number` `.ppl-caption` `.ppl-group-label` `.ppl-chip-code` `.ppl-link`
**Ação** `.ppl-btn` (`--primary --secondary --ghost --danger --punch --sm --icon --touch`) `.ppl-fab`
**Estado** `.ppl-badge` (`--dawn --day --transit --success --warning --danger --muted --count`, `__dot` com `--hollow --dashed`) `.ppl-alert` `.ppl-toast` `.ppl-state` `.ppl-skeleton` `.ppl-spinner` `.ppl-progress`
**Formulário** `.ppl-field` `.ppl-input` (`--data --touch`) `.ppl-select` `.ppl-textarea` `.ppl-check` `.ppl-combo`
**Sobreposição** `.ppl-drawer` `.ppl-dialog` `.ppl-scrim`
**Navegação** `.ppl-nav` `.ppl-topbar` `.ppl-topbar__chip` `.ppl-tabbar` `.ppl-page-head`
**Conteúdo** `.ppl-icon-tile` `.ppl-panel` `.ppl-data-panel` `.ppl-choice` `.ppl-stat` `.ppl-table` `.ppl-steps` `.ppl-review` `.ppl-disclosure`
**Luz** `.ppl-sky` (`--split --band`, `__glow __logo __card`) `.ppl-seal` (`--lg`) `.ppl-horizon` (`__seg--1…4`)
**Público** `.ppl-landing` `.ppl-landing__bar` `.ppl-hero` `.ppl-sheet`
**Layout** `.ppl-shell` `.ppl-main` `.ppl-app` `.ppl-stack` `.ppl-row` `.ppl-cols-2`

"Luz" é o grupo dos únicos lugares com degradê: o ciclorama do login e da porta do app, o selo de
conquista e o horizonte do dia. Fora dele, tudo é plano.

### Comportamento sem escrever JavaScript

```html
<aside class="ppl-nav" data-ppl-nav><script type="application/json">{
  "marca": { "logo": "people", "nome": "BNG People", "tag": "Depto. Pessoal", "href": "/" },
  "itens": [ … ]
}</script></aside>
<span data-ppl-logo></span>                      <!-- recebe o logotipo horizontal branco -->
<div class="ppl-data-panel" id="p" data-ppl-state="dados"><div data-ppl-when="dados">…</div></div>
<button data-ppl-state-set="p:vazio">Vazio</button>
<button data-ppl-confirm="R2" data-ppl-confirm-titulo="…" data-ppl-confirm-alvo="…"
        data-ppl-confirm-acao="…" data-ppl-confirm-feito="…">Reabrir</button>
<button data-ppl-drawer-open="meu-drawer">Abrir</button>
<button data-ppl-drawer-close>Fechar</button>
<form data-ppl-submit="Rubrica 1042 criada.">…</form>
<section data-ppl-disclosure>…</section>
<div data-ppl-combo>…</div>
<button data-ppl-search-open>Buscar</button>
<button data-ppl-theme-toggle>Tema</button>
<i data-ppl-icon="wallet" data-ppl-size="16"></i>
```

O logotipo não é colado à mão em cada template — são 4 KB de `path` que divergiriam em silêncio.
`init()` hidrata todo `[data-ppl-logo]` com o mesmo SVG que a sidebar desenha.

### API

```js
PplCompass.init({ acoes: [{ href, label }] });   // sem `acoes`, a busca herda a navegação

PplCompass.nav({
  alvo: '#nav',                                  // ou marque o elemento com data-ppl-nav
  variante: 'lateral' | 'tabbar',                // o mesmo objeto desenha as duas
  rotaAtiva: '/folha',
  marca:   { logo: 'people', nome, tag, href },  // com `logo`, o SVG branco; sem, o nome em Sora
  itens:   [ { label, icone, href, contador? }, { grupo, itens: [ … ] } ],
  usuario: { iniciais, nome, papel, sair }
});
PplCompass.toast.success(msg) / .error(msg, { acao: { label, onClick } }) / .info(msg)
PplCompass.drawer.abrir(id) / .fechar(id)
PplCompass.busca.abrir() / .fechar()
PplCompass.tema.alternar()
PplCompass.icon(nome, tamanho)
PplCompass.logo()                                 // o SVG do logotipo horizontal branco
PplCompass.fmt.cpf / .cnpj / .dinheiro / .contagem / .competencia

PplCompass.painel('painel-folha', 'carregando');   // dados | carregando | vazio | erro

PplCompass.confirmar({
  risco: 'R2' | 'R3',                 // R0 e R1 são RECUSADOS: não abrem diálogo
  titulo: 'Reabrir a competência 2026-08?',        // a consequência, não a ação
  alvo: 'Gestão Hospitalar Ltda · 12.345.678/0001-90',   // ou [{ chave, valor, data? }]
  corpo: '…',
  frase: '2026-08',                   // só R3 — obrigatório nele
  processo: 'fechamento-definitivo',  // só R3 — o "o quê" do evento de auditoria
  acao: 'Reabrir competência',
  onConfirmar() {}, onCancelar() {}
});
// R3 emite `ppl:auditoria` em document: { processo, risco, alvo, quando }

new PplCompass.Wizard({
  raiz, efeito: 'juridico' | 'financeiro' | 'nenhum',
  passos: [{ id, label, validar? }],   // 'revisao' é obrigatório se efeito ≠ 'nenhum'
  aoRenderizar(passo, corpo), onConcluir()
});
```

---

## Regras que o pacote carrega embutidas

Não são preferências de estilo. Um protótipo que as viola gera retrabalho na implementação.

- **Um CTA sólido por tela.** `--primary`, `--punch` e `.ppl-fab` contam. Rótulo verbo-primeiro,
  nunca "OK".
- **No máximo um pêssego por tela, e só sobre a noite.** O pêssego é a luz do horizonte: o
  contador de Pendências na sidebar, o botão de bater ponto do app no tema escuro. Sobre o dia ele
  mede 1,6:1 — ali ele não existe, e o acento é o próprio roxo cheio.
- **Vermelho é só erro e ação destrutiva.** Nunca "chamar atenção".
- **Estado nunca só por cor** — ponto cheio, vazado ou tracejado, sempre com texto. Em tabela de
  DP com centenas de linhas, matiz novo compete com âmbar, vermelho e verde; a diferença vem da
  fase (admitido, ativo, em trânsito) e da forma.
- **Dado de folha e ponto sempre em `.ppl-data`**, com `tabular-nums`.
- **Zero emoji** em qualquer superfície: ícone é ícone, e vem de `ppl-compass-icons.js`.
- **Alvo de toque ≥ 44px** com `.ppl-btn--touch` e `.ppl-input--touch`.
- **Degradê só onde há céu** — login, sidebar, app à noite, selo. Nunca em botão, texto, tabela ou
  card. Botão é plano; texto em degradê não é texto.
- **Card sem sombra.** Em repouso, linha de 1px. Sombra é sinal de algo solto da página — FAB,
  toast, modal, dropdown, o card do login sobre o céu — e um card não está.
- **O branco do dia é o estado ativo.** Item ativo da sidebar é pílula branca com texto roxo; o
  badge "ativo" é branco com borda roxa. Ativo é o que está aceso, não o que tem uma barra ao lado.
- **Eyebrow abolido.** Contexto e data ficam abaixo do título, em `.ppl-caption`. A única caixa
  alta rastreada do sistema é o rótulo de grupo da sidebar.
- **Tema escuro de primeira classe** — vale no shell inteiro, pela preferência do sistema ou por
  `data-theme`. A sidebar é sempre noite, nos dois temas.
- **Fluxo de efeito jurídico ou financeiro termina em revisão.** O `Wizard` falha fechado:
  sem a etapa `revisao` ele não renderiza e mostra o defeito.
- **Contador é o número real, com separador de milhar** — nunca `"99+"`.
- **Confirmação é proporcional ao risco do processo**, e o risco é atributo do processo, não
  decisão de tela. R0 e R1 **não abrem diálogo** — `confirmar()` recusa e diz por quê. Fadiga de
  confirmação é risco mapeado: confirmar ação reversível treina o operador a clicar sem ler, e é a
  confirmação do R3 que paga essa conta.
- **O alvo da ação fica visível no diálogo**, sempre. Sem ele o operador confirma o diálogo, não a
  operação.
- **`Esc` nunca confirma** — mas cancela nos dois níveis, porque fechar diálogo pelo teclado é
  requisito de acessibilidade. No R3 o clique fora não faz nada: perder a frase digitada por um
  clique torto custa refazer o caminho inteiro.
- **Um modal por vez.** O foco é preso marcando os irmãos como `inert`, então um segundo modal
  nasceria inerte — desenhado na tela e invisível ao teclado. Empilhar aqui não degrada, apaga.
- **Tabbar tem no máximo 5 itens.** O sexto não quebra o grid em silêncio: `nav()` falha fechado,
  como faz com grupo vazio, item sem destino e `rotaAtiva` que não existe no menu. Menu que não
  sabe onde você está é pior do que menu nenhum, porque mente com confiança.

### Nomes

Cada nome descreve o que a coisa **é**: `.ppl-card` é um card, `.ppl-bar` é uma barra,
`.ppl-disclosure` é o padrão ARIA que ele implementa. Nada foi herdado do console — lá as
superfícies ainda carregam nomes de decisões já revertidas.

A v0.5.0 aposentou o vocabulário da v5: `blue-*`, `gold`, `lp-*`, `eyebrow`, `glass`, `grad-text`,
`btn--hero`, `stat-hero` e `nav__mark` são nomes aposentados, e o `build.mjs` **falha fechado** se
qualquer um voltar ao fonte. A v6B fala em `violet-*` (a rampa da noite ao dia), `peach` (a luz
quente) e `grad-sky`/`grad-nav`/`grad-seal`/`grad-night`/`grad-day` (os únicos degradês, cada um
com o seu lugar).

---

## Compatibilidade

Duas últimas versões maiores de **Chrome, Edge e Safari**. Safari define o teto — é o último a
chegar. Sem polyfill: polyfill é dependência.

Em uso: `:has()`, `@container`, `color-mix()`, `inert` — é ele que prende o foco no drawer sem
gerenciar `tabindex` à mão —, custom properties e Grid. Fora da v1: aninhamento nativo de CSS.
`backdrop-filter` sobrevive só na tabbar do app, sempre acompanhado de `-webkit-`, que o Safari
exige.

---

## Regras de consumo

**Aponte para uma tag, nunca para um branch.**

| Referência | Cache | Consequência |
|---|---|---|
| `@0.5.0` | 1 ano, imutável | a demo de amanhã é byte a byte a de hoje |
| `@main` | 12 h no edge | a demo pode mudar sozinha antes da reunião |

**Use o arquivo com SRI, não o `.min`.** O jsDelivr gera `.min.css` automaticamente, mas avisa
para **não** usar SRI com arquivo gerado dinamicamente: o minificador muda de versão, o hash
quebra e a página para de carregar. E os comentários das receitas são a documentação — cada uma
anota o componente React de origem e a regra de acessibilidade que a sustenta.

---

## Versionamento

SemVer, **e o pacote está em `0.x` de propósito.** Em `0.x` o próprio SemVer dispensa a garantia de
compatibilidade: um `minor` pode renomear uma classe ou um token. É a promessa honesta enquanto o
framework ainda está descobrindo os próprios nomes — cada fase encontra receita que faltava, e
travar a superfície agora só criaria alias legado, que é exatamente o que o §5.4 do plano existe
para evitar.

**Esta é a v0.5.0, "Alvorada".** Ela trocou a identidade inteira — e com ela renomeou tokens e
classes. Em `0.x` isso é um `minor`, não um `major`: ninguém prometeu que um token da v5
duraria, e criar um alias para cada nome antigo só faria a v6B carregar a v5 nas costas.

**A `1.0.0` volta quando a documentação estiver publicada no GitHub Pages** — antes disso não há
onde alguém conferir o que a estabilidade estaria prometendo.

> No repositório de origem houve uma `v1.0.0` no fim da Fase 1. Ela saiu antes da hora e **foi
> apagada em 26/08/2026**, com a confirmação de que ninguém a consumia. Se você encontrar uma
> referência a `@1.0.0`, troque pela `0.x`: no GitHub a tag já não existe, e o que ainda responde é
> cache do CDN — que some sem aviso. Apagar tag publicada só é seguro com essa confirmação.

**A superfície pública é:** nomes de token, nomes de classe, atributos `data-*` e a API
`PplCompass.*`.

| Mudança | Bump em `0.x` | Bump depois da `1.0.0` |
|---|---|---|
| novo componente, novo token, nova variante | minor | minor |
| ajuste de valor sem trocar nome | patch | patch |
| renomear ou remover token, classe, `data-*` ou método | **minor** | **major** |

---

## Desenvolvimento

`src/` é legível, `dist/` é o que o CDN serve, e **o consumidor não instala nada** — dois arquivos
do CDN e a página funciona. O `package.json` existe só para as duas devDependencies de build —
`playwright-core` (smoke de teclado) e `lucide-static` (geometria dos ícones, embutida na geração);
o pacote não é publicado no npm e nenhuma das duas chega ao navegador.

```bash
npm run check                 # o que o CI roda: autoteste, ícones, build, lint e smoke

npm run icones                # regera src/ppl-compass-icons.js a partir de scripts/icones.txt
npm run icones:conferir       # reprova se o arquivo gerado derivou da lista

node scripts/build.mjs        # monta dist/ e confere as invariantes (inclusive nos .html)
node scripts/lint.mjs         # token órfão, CTA duplicado, pêssego repetido, contraste
node scripts/lint.mjs --autoteste   # confere as CHECAGENS, não o código
node scripts/smoke.mjs        # Tab, Esc e retorno de foco, no Chrome já instalado
node scripts/preview.mjs      # espelha templates/ em .preview/ apontando para ../dist/
node scripts/sri.mjs          # tabela de hashes para colar neste README
node scripts/sri.mjs --html   # as tags prontas, já com a URL do CDN

PPL_TAG=v0.5.0 node scripts/sri.mjs --html
```

O `sri.mjs` monta a URL com o owner `andreiandrade-bng` por padrão; `PPL_OWNER` troca, se um dia
o pacote mudar de casa.

### O que o CI reprova

Roda em PR (`.github/workflows/ci.yml`). Nenhuma destas checagens acrescenta um byte ao que o
navegador baixa.

| Checagem | O que pega |
|---|---|
| **autoteste** | uma regra que parou de morder — roda antes de tudo, porque um lint decorativo deixa o repositório verde e a garantia vazia |
| **token definido** | `var(--ppl-x)` sem `--ppl-x:` em lugar nenhum. Resolve para nada: badge transparente, foco sem cor, botão branco com texto branco |
| **um CTA sólido** | dois `--primary`/`--punch`/`.ppl-fab` na mesma superfície (DS-07). Vale por superfície: um drawer aberto tem o próprio CTA |
| **um pêssego** | dois pêssegos na mesma tela — classe (`--punch`, `.ppl-nav__count`) ou `"contador"` no JSON da nav. Dois horizontes não apontam |
| **contraste** | os 38 pares versionados recalculados a partir do `tokens.css` de hoje, nos dois temas. A dívida conhecida é nomeada e **não pode piorar** |
| **nome aposentado** | um nome da v5 ou do console de volta, em qualquer arquivo — inclusive na documentação, de onde ele volta para o código pela mão de quem copiou o exemplo |
| **ícones em sincronia** | `src/ppl-compass-icons.js` editado à mão — a próxima geração reverteria a edição em silêncio |
| **smoke de teclado** | `Tab` sem armadilha, foco preso no modal, `Esc` que fecha sem confirmar, foco de volta no gatilho |
| **dist/ e SRI** | `dist/` que não é o que o fonte gera, ou hash documentado que não bate — a página de quem consome pararia de carregar |

### Dívida de contraste, nomeada

Dois semânticos de base ficam abaixo de AA como texto e estão listados no `lint.mjs`:
`--ppl-success` (4,19:1 sobre o dia) e `--ppl-warning` (3,19:1 sobre branco). O design system
resolve isto sem trocar o hex: os dois são usados **só como ícone e ponto**, onde o mínimo é 3:1
(WCAG 1.4.11); texto usa a variante `-strong`, que mede 6,6:1 e 5,4:1. A checagem mede os dois a
cada execução e **reprova se algum piorar**.

A v6B pagou uma dívida da v5: `--ppl-ink-faint` ficou em `#736C86`, 4,7:1 sobre o dia, e a
hierarquia de texto continuou com os seus níveis — o que a paleta anterior dizia ser impossível.

### Validar antes de publicar

| Página | Aponta para | Serve para |
|---|---|---|
| `index.html` | `dist/` | a documentação — 22 páginas, exemplo vivo e código |
| `demo/gallery.html` | `../dist/` | ver todos os componentes do commit aberto |
| `demo/proof-local.html` | `../dist/` | validar o **conteúdo** antes de publicar |
| `demo/proof.html` | o CDN | validar a **entrega** depois de publicar |
| `.preview/*.html` | `../dist/` | ver os templates antes de a tag existir |

Se a local aprova e a do CDN reprova, o problema é entrega. Se a local reprova, é o pacote —
nem adianta publicar.

```bash
python -m http.server 8777
# http://localhost:8777/demo/gallery.html
```

### Publicar

```bash
node scripts/build.mjs
node scripts/sri.mjs              # cole os hashes aqui, em demo/proof.html e em templates/*.html
git add -A && git commit -m "release: v0.5.0 - alvorada"
git tag v0.5.0 && git push origin main --tags
```

O hash cobre o **byte exato** de cada arquivo: qualquer mudança, inclusive num comentário, gera
um hash novo. Regere **antes** de criar a tag, nunca depois.

---

## Hashes SRI

| Arquivo | Tamanho | `integrity` (v0.5.0) |
|---|---|---|
| `ppl-compass-components.css` | 63.8 KB | `sha384-kQwgkN7zArVCRe7GqsqFnUChvalavq4DsTzFsRjFiVM+BEVlR9ccW1twOxF623lc` |
| `ppl-compass-icons.js` | 25.1 KB | `sha384-K7HJQ+0th6kgYPtM02Ac4GpT4x/2JVA8oI33rClJ/XEdNIkGmSK+Z4IkMfyJqcHb` |
| `ppl-compass-nofonts.css` | 82.6 KB | `sha384-1040uRV5GY0SgCGewJd796aUlh25ettD01DZ4jcKWT3Ix/7L/FqB11t4Klkisj6h` |
| `ppl-compass-tokens.css` | 17.9 KB | `sha384-Gryj4HeDw/EnuSPTyCYp/WEbWvlmk1EuZRPqbb58yf0e0K9gD8NI1WDAnI/MBB9m` |
| `ppl-compass.css` | 85.4 KB | `sha384-GtiX78xFYEvnHF3D6PbfEwl0OQsFnkaZk2usuHomx/JyFUtN4JfSQgI7T/iZREoh` |
| `ppl-compass.js` | 63.5 KB | `sha384-I1G8vAmXzfvEHSYLoCYHp0xUu3aWq2EIv8WBNscMn68emHFPkI1mPdDgoua8PYGO` |

---

## Licença

[MIT](LICENSE). As fontes redistribuídas — Sora, Manrope e JetBrains Mono — seguem a
**SIL Open Font License 1.1**; ver [NOTICE.md](NOTICE.md).
