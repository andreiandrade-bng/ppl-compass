#!/usr/bin/env node
/**
 * lint.mjs — as checagens de higiene do repositório.
 *
 * Roda só aqui, em PR. Não toca em nada que o consumidor baixa: R3 é sobre o
 * consumidor, não sobre nós.
 *
 *   node scripts/lint.mjs              confere o repositório
 *   node scripts/lint.mjs --autoteste  confere as CHECAGENS
 *
 * Sobre o `--autoteste`: cada regra é rodada contra uma entrada que ela TEM que
 * reprovar. Um lint que parou de morder é pior do que lint nenhum — o repositório
 * segue verde e a garantia virou decoração, sem que ninguém perceba. Ele roda no
 * CI antes do lint de verdade, e é o que sustenta o "reprovam de verdade" da
 * Fase 4 do PLANO.
 */
import { readdir, readFile } from 'node:fs/promises';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { conferir } from './invariantes.mjs';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');

/* ══════════════════════════════════════════════════════════════════════════
 * Utilidades
 * ═══════════════════════════════════════════════════════════════════════ */

async function listar(dir, base = raiz) {
  const saida = [];
  let itens;
  try {
    itens = await readdir(dir, { withFileTypes: true });
  } catch {
    return saida;
  }
  for (const item of itens) {
    if (item.name.startsWith('.') || item.name === 'node_modules') continue;
    const caminho = join(dir, item.name);
    if (item.isDirectory()) saida.push(...(await listar(caminho, base)));
    else saida.push(relative(base, caminho).split('\\').join('/'));
  }
  return saida;
}

/** Tira do HTML o que não é marcação da tela: script, JSON de config e comentário. */
function soMarcacao(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');
}

/** Separa a página das superfícies modais — cada uma é uma tela por si. */
function superficies(html) {
  const modais = [];
  const semModais = html.replace(
    /<div class="ppl-drawer"[\s\S]*?\n<\/div>/g,
    (bloco) => { modais.push(bloco); return ''; },
  );
  return { pagina: semModais, modais };
}

const contar = (texto, agulha) => texto.split(agulha).length - 1;

/* ══════════════════════════════════════════════════════════════════════════
 * 1 · TOKEN REFERENCIADO ≠ TOKEN DEFINIDO
 * --------------------------------------------------------------------------
 * Pega a classe inteira do problema que produziu os quatro órfãos do console
 * (`docs/01` §8): `--color-people-veu` e companhia eram referenciados e nunca
 * definidos, então resolviam para NADA — badge transparente, foco sem cor,
 * botão branco com texto branco. Nenhum deles quebrava o build; todos
 * quebravam a tela, em silêncio.
 * ═══════════════════════════════════════════════════════════════════════ */
async function checarTokens(arquivos, ler) {
  const definidos = new Set();
  const referenciados = new Map();          // token → onde apareceu primeiro

  for (const rel of arquivos) {
    if (!/\.(css|js|html)$/.test(rel)) continue;
    const texto = await ler(rel);
    for (const m of texto.matchAll(/(--ppl-[a-z0-9-]+)\s*:/g)) definidos.add(m[1]);
    for (const m of texto.matchAll(/var\(\s*(--ppl-[a-z0-9-]+)/g)) {
      if (!referenciados.has(m[1])) referenciados.set(m[1], rel);
    }
  }

  const erros = [];
  for (const [token, onde] of referenciados) {
    if (!definidos.has(token)) {
      erros.push(`${token} é referenciado em ${onde} e nunca definido — resolve para nada.`);
    }
  }

  const ociosos = [...definidos].filter((t) => !referenciados.has(t));
  return { erros, nota: ociosos.length ? `${ociosos.length} tokens definidos e não referenciados` : null };
}

/* ══════════════════════════════════════════════════════════════════════════
 * 2 · UM CTA SÓLIDO POR SUPERFÍCIE · NO MÁXIMO UM PÊSSEGO
 * --------------------------------------------------------------------------
 * DS-07 e design-system.md §2.1/§3.1. Vale por SUPERFÍCIE, não por arquivo: um
 * drawer aberto cobre a página e tem o próprio CTA — contar os dois juntos
 * acusaria o padrão certo de errado.
 *
 * O pêssego é a luz do horizonte e só existe sobre a noite: o contador de
 * Pendências na sidebar (o único pêssego do console) e o botão de bater ponto
 * do app no tema escuro. Dois na mesma tela e a luz deixa de apontar.
 *
 * A galeria fica de fora: ela é um catálogo de componentes, não uma tela. Todo
 * botão dela existe para ser olhado, não para ser clicado como decisão.
 *
 * O que sai de `<script>` também fica de fora — o Wizard desenha o próprio
 * "Avançar", e ele nunca divide a tela com outro CTA sólido.
 * ═══════════════════════════════════════════════════════════════════════ */
const CTA_SOLIDO = ['ppl-btn--primary', 'ppl-btn--punch', 'ppl-fab'];
const PESSEGO = ['ppl-btn--punch', 'ppl-nav__count'];

/** Os contadores do JSON da navegação: cada um vira uma pílula pêssego. */
function contadoresDaNav(html) {
  let n = 0;
  for (const m of html.matchAll(/<script type="application\/json">([\s\S]*?)<\/script>/g)) {
    n += (m[1].match(/"contador"\s*:/g) || []).length;
  }
  return n;
}

async function checarTelas(arquivos, ler) {
  const erros = [];

  for (const rel of arquivos) {
    if (!rel.startsWith('templates/') || !rel.endsWith('.html')) continue;
    const bruto = await ler(rel);
    const { pagina, modais } = superficies(soMarcacao(bruto));
    const contadores = contadoresDaNav(bruto);

    for (const [nome, html] of [['a página', pagina], ...modais.map((m, i) => [`o modal ${i + 1}`, m])]) {
      const ctas = CTA_SOLIDO.reduce((n, c) => n + contar(html, c), 0);
      if (ctas > 1) {
        erros.push(`${rel}: ${ctas} CTAs sólidos em ${nome}. Um por superfície (DS-07) — com dois, a tela não diz qual é a decisão.`);
      }
      const pessego = PESSEGO.reduce((n, c) => n + contar(html, c), 0) + (nome === 'a página' ? contadores : 0);
      if (pessego > 1) {
        erros.push(`${rel}: ${pessego} elementos pêssego em ${nome}. No máximo um — o pêssego é a luz do horizonte, e dois horizontes não apontam.`);
      }
    }
  }
  return { erros, nota: null };
}

/* ══════════════════════════════════════════════════════════════════════════
 * 3 · CONTRASTE DOS PARES VERSIONADOS
 * --------------------------------------------------------------------------
 * Os pares de `docs/01` §6 estão anotados na documentação como razões fixas.
 * Anotação não segura ninguém: quem trocar um token deixa a anotação para trás
 * e a razão continua escrita, errada, no documento. Aqui os pares são resolvidos
 * a partir do `tokens.css` de hoje e recalculados.
 *
 * O tema escuro é conferido montando a paleta clara e sobrepondo o bloco
 * `[data-theme="dark"]` — que é exatamente o que o navegador faz.
 * ═══════════════════════════════════════════════════════════════════════ */
const PARES = [
  // Dia — o shell inteiro.
  ['claro', '--ppl-ink', '--ppl-surface', 4.5, 'título sobre a superfície dominante'],
  ['claro', '--ppl-ink-body', '--ppl-surface', 4.5, 'corpo sobre card'],
  ['claro', '--ppl-ink-soft', '--ppl-surface', 4.5, 'rótulo e descrição — o mais usado do sistema'],
  ['claro', '--ppl-ink-faint', '--ppl-surface', 4.5, 'caption e metadado sobre card'],
  ['claro', '--ppl-ink', '--ppl-surface-app', 4.5, 'título sobre o dia'],
  ['claro', '--ppl-ink-soft', '--ppl-surface-app', 4.5, 'rótulo sobre o dia'],
  ['claro', '--ppl-ink-faint', '--ppl-surface-app', 4.5, 'caption sobre o dia'],
  ['claro', '--ppl-ink-body', '--ppl-surface-subtle', 4.5, 'corpo sobre painel'],
  ['claro', '--ppl-ink-soft', '--ppl-surface-muted', 4.5, 'rótulo de coluna'],
  ['claro', '--ppl-primary-fg', '--ppl-primary', 4.5, 'rótulo do botão primário'],
  ['claro', '--ppl-primary', '--ppl-surface', 4.5, 'texto roxo do badge "ativo" e do vazado'],
  ['claro', '--ppl-strong', '--ppl-primary-soft', 4.5, 'texto do badge "admitido" sobre tonal'],
  ['claro', '--ppl-strong', '--ppl-primary-tint', 4.5, 'texto do badge "transferido"'],
  ['claro', '--ppl-link', '--ppl-surface-app', 4.5, 'link em texto corrido'],
  ['claro', '--ppl-success-strong', '--ppl-surface-app', 4.5, 'texto de sucesso'],
  ['claro', '--ppl-warning-strong', '--ppl-surface', 4.5, 'texto de atenção'],
  ['claro', '--ppl-danger-strong', '--ppl-surface', 4.5, 'texto de erro'],
  ['claro', '--ppl-neutral', '--ppl-neutral-soft', 4.5, 'badge "desligado"'],
  ['claro', '--ppl-focus-ring', '--ppl-surface', 3, 'anel de foco (WCAG 1.4.11)'],
  // A sidebar é sempre noite.
  ['claro', '--ppl-on-dark', '--ppl-nav-base', 4.5, 'item de navegação sobre a base da sidebar'],
  ['claro', '--ppl-on-dark-soft', '--ppl-nav-base', 4.5, 'rótulo de grupo sobre a base'],
  ['claro', '--ppl-on-dark', '--ppl-night', 4.5, 'texto sobre a noite'],
  ['claro', '--ppl-ink', '--ppl-peach', 4.5, 'número do contador pêssego'],
  ['claro', '--ppl-lilac', '--ppl-nav-base', 3, 'anel de foco sobre a sidebar'],
  // Noite — o tema escuro.
  ['escuro', '--ppl-ink', '--ppl-surface', 4.5, 'título no escuro'],
  ['escuro', '--ppl-ink-body', '--ppl-surface', 4.5, 'corpo no escuro'],
  ['escuro', '--ppl-ink-soft', '--ppl-surface', 4.5, 'rótulo no escuro'],
  ['escuro', '--ppl-ink-faint', '--ppl-surface-app', 4.5, 'caption no escuro'],
  ['escuro', '--ppl-primary-fg', '--ppl-primary', 4.5, 'texto tinta sobre o lilás'],
  ['escuro', '--ppl-primary', '--ppl-surface', 4.5, 'texto lilás sobre card escuro'],
  ['escuro', '--ppl-link', '--ppl-surface-app', 4.5, 'link no escuro'],
  ['escuro', '--ppl-strong', '--ppl-primary-soft', 4.5, 'badge tonal no escuro'],
  ['escuro', '--ppl-success-strong', '--ppl-surface', 4.5, 'texto de sucesso no escuro'],
  ['escuro', '--ppl-warning-strong', '--ppl-surface', 4.5, 'texto de atenção no escuro'],
  ['escuro', '--ppl-danger-strong', '--ppl-surface', 4.5, 'texto de erro no escuro'],
  ['escuro', '--ppl-neutral', '--ppl-neutral-soft', 4.5, 'badge "desligado" no escuro'],
  ['escuro', '--ppl-punch-fg', '--ppl-punch-bg', 4.5, 'texto do botão de bater ponto à noite (pêssego)'],
  ['escuro', '--ppl-focus-ring', '--ppl-surface-app', 3, 'anel de foco no escuro'],
];

function hexParaRgb(hex) {
  const h = hex.trim().replace('#', '');
  const c = h.length === 3 ? h.split('').map((x) => x + x).join('') : h;
  if (!/^[0-9a-f]{6}$/i.test(c)) return null;
  return [0, 2, 4].map((i) => parseInt(c.slice(i, i + 2), 16));
}

function luminancia([r, g, b]) {
  const f = (v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function razao(a, b) {
  const [x, y] = [luminancia(a), luminancia(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

/** Remove cada bloco `@media { … }` inteiro, contando chaves — o bloco do
 *  `prefers-color-scheme` redefine os mesmos tokens do claro, e um regex
 *  preguiçoso o deixava passar e sobrescrevia a paleta clara com a escura. */
function semBlocosMedia(css) {
  let saida = '';
  let i = 0;
  while (i < css.length) {
    const inicio = css.indexOf('@media', i);
    if (inicio === -1) { saida += css.slice(i); break; }
    saida += css.slice(i, inicio);
    let j = css.indexOf('{', inicio) + 1;
    let nivel = 1;
    while (j < css.length && nivel > 0) {
      if (css[j] === '{') nivel++;
      else if (css[j] === '}') nivel--;
      j++;
    }
    i = j;
  }
  return saida;
}

/** Lê os blocos de declaração do tokens.css: o claro e o `[data-theme="dark"]`. */
function paletas(css) {
  const claro = new Map();
  const escuro = new Map();

  const blocoEscuro = css.match(/:root\[data-theme="dark"\]\s*\{([\s\S]*?)\n\}/);
  const semEscuro = blocoEscuro ? css.replace(blocoEscuro[0], '') : css;
  const semMedia = semBlocosMedia(semEscuro);

  for (const m of semMedia.matchAll(/(--ppl-[a-z0-9-]+)\s*:\s*([^;]+);/g)) claro.set(m[1], m[2].trim());
  if (blocoEscuro) {
    for (const m of blocoEscuro[1].matchAll(/(--ppl-[a-z0-9-]+)\s*:\s*([^;]+);/g)) escuro.set(m[1], m[2].trim());
  }
  return { claro, escuro };
}

/** Resolve um token até um hex, seguindo as cadeias de `var()`. */
function resolver(token, mapa, profundidade = 0) {
  if (profundidade > 10) return null;
  const bruto = mapa.get(token);
  if (!bruto) return null;
  const ref = bruto.match(/^var\(\s*(--ppl-[a-z0-9-]+)/);
  if (ref) return resolver(ref[1], mapa, profundidade + 1);
  return hexParaRgb(bruto);
}

/**
 * DÍVIDA CONHECIDA — pares que hoje NÃO atingem AA.
 *
 * Na v6B os dois semânticos de base (`--ppl-success`, `--ppl-warning`) ficam
 * abaixo de AA como TEXTO — e o design system resolve isto sem trocar o hex:
 * texto usa a variante `-strong`, o hex de base fica para ícone e ponto, onde
 * o mínimo é 3:1 (WCAG 1.4.11). Listar é melhor do que baixar o limite em
 * silêncio: a checagem continua medindo e reprova se qualquer um PIORAR.
 */
const DIVIDA = [
  ['claro', '--ppl-success', '--ppl-surface-app', 4.19, 'ícone e ponto de sucesso — texto usa --ppl-success-strong'],
  ['claro', '--ppl-warning', '--ppl-surface', 3.19, 'ícone e ponto de atenção — texto usa --ppl-warning-strong'],
];

async function checarContraste(_arquivos, ler) {
  const css = await ler('src/tokens.css');
  const { claro, escuro } = paletas(css);
  const mapas = { claro, escuro: new Map([...claro, ...escuro]) };

  const erros = [];
  const medir = (tema, frente, fundo) => {
    const a = resolver(frente, mapas[tema]);
    const b = resolver(fundo, mapas[tema]);
    return a && b ? razao(a, b) : null;
  };

  for (const [tema, frente, fundo, minimo, papel] of PARES) {
    const r = medir(tema, frente, fundo);
    if (r === null) {
      erros.push(`${tema}: não foi possível resolver ${frente} sobre ${fundo} até uma cor.`);
    } else if (r < minimo) {
      erros.push(`${tema}: ${frente} sobre ${fundo} = ${r.toFixed(2)}:1, abaixo de ${minimo}:1 — ${papel}.`);
    }
  }

  /* A dívida não precisa melhorar aqui, mas não pode piorar. */
  const pendentes = [];
  for (const [tema, frente, fundo, teto, papel] of DIVIDA) {
    const r = medir(tema, frente, fundo);
    if (r === null) {
      erros.push(`${tema}: não foi possível resolver ${frente} sobre ${fundo} até uma cor.`);
    } else if (r < teto - 0.005) {
      erros.push(
        `${tema}: ${frente} sobre ${fundo} caiu para ${r.toFixed(2)}:1 (era ${teto}:1) — ${papel}. ` +
        'A dívida de contraste pode ser paga, nunca aumentada.',
      );
    } else {
      pendentes.push(`${frente} ${r.toFixed(2)}:1`);
    }
  }

  const nota = `${PARES.length} pares em AA · dívida conhecida: ${pendentes.join(', ')}`;
  return { erros, nota };
}

/* ══════════════════════════════════════════════════════════════════════════
 * 4 · NENHUM NOME LEGADO VOLTOU
 * --------------------------------------------------------------------------
 * O `build.mjs` já reprova em `src/`, `templates/` e `demo/`. Aqui a varredura
 * é do repositório inteiro — README, workflow, script —, porque um nome
 * aposentado que sobrevive na documentação volta para o código pela mão de
 * quem copiou o exemplo.
 * ═══════════════════════════════════════════════════════════════════════ */
/** O que o navegador recebe. Fora daqui, só as regras de nome valem. */
const ENTREGUE = /^(src|templates|demo)\/|^(README|NOTICE)\.md$|^index\.html$/;

async function checarNomes(arquivos, ler) {
  const erros = [];
  for (const rel of arquivos) {
    if (!/\.(css|js|mjs|html|md|yml|yaml|json)$/.test(rel)) continue;
    /* O spec de design cita os nomes aposentados de propósito: é a tabela de/para. */
    if (rel.startsWith('docs/superpowers/')) continue;
    const achados = conferir(await ler(rel), rel, { entregue: ENTREGUE.test(rel) });
    for (const a of achados) erros.push(`${a.rotulo}:${a.linha}  ${a.motivo}\n      ${a.trecho}`);
  }
  return { erros, nota: null };
}

/* ══════════════════════════════════════════════════════════════════════════
 * O AUTOTESTE — cada regra contra uma entrada que ela TEM que reprovar
 * ═══════════════════════════════════════════════════════════════════════ */
const CASOS = [
  {
    nome: 'token referenciado e nunca definido',
    checagem: checarTokens,
    arquivos: { 'src/x.css': '.a { color: var(--ppl-nunca-definido); }' },
  },
  {
    nome: 'dois CTAs sólidos na mesma superfície',
    checagem: checarTelas,
    arquivos: { 'templates/x.html': '<button class="ppl-btn ppl-btn--primary">a</button><button class="ppl-btn ppl-btn--primary">b</button>' },
  },
  {
    nome: 'dois elementos pêssego na mesma superfície',
    checagem: checarTelas,
    arquivos: { 'templates/y.html': '<button class="ppl-btn ppl-btn--punch">a</button><span class="ppl-nav__count">1</span>' },
  },
  {
    nome: 'dois contadores pêssego no JSON da navegação',
    checagem: checarTelas,
    arquivos: { 'templates/z.html': '<aside data-ppl-nav><script type="application/json">{"itens":[{"contador":1},{"contador":2}]}</script></aside>' },
  },
  {
    nome: 'par de contraste abaixo de AA',
    checagem: checarContraste,
    arquivos: { 'src/tokens.css': ':root {\n  --ppl-ink: #cccccc;\n  --ppl-surface: #ffffff;\n}' },
  },
  {
    nome: 'dívida de contraste piorando',
    checagem: checarContraste,
    arquivos: { 'src/tokens.css': ':root {\n  --ppl-warning: #e0c890;\n  --ppl-surface: #ffffff;\n}' },
  },
  {
    nome: 'nome aposentado de volta',
    checagem: checarNomes,
    arquivos: { 'README.md': '.people-bento { color: red; }' },
  },
];

async function autoteste() {
  console.log('\n  Autoteste — cada regra contra uma entrada que ela tem que reprovar:\n');
  let falhou = false;
  for (const caso of CASOS) {
    const nomes = Object.keys(caso.arquivos);
    const { erros } = await caso.checagem(nomes, async (rel) => caso.arquivos[rel] ?? '');
    if (erros.length) {
      console.log(`  ✓ reprovou: ${caso.nome}`);
    } else {
      console.log(`  ✗ PASSOU BATIDO: ${caso.nome}`);
      falhou = true;
    }
  }
  if (falhou) {
    console.error('\n✗ Uma checagem parou de morder. Ela não está mais garantindo nada.\n');
    process.exit(1);
  }
  console.log(`\n✓ As ${CASOS.length} regras reprovam de verdade.\n`);
}

/* ══════════════════════════════════════════════════════════════════════════ */
const CHECAGENS = [
  ['token definido', checarTokens],
  ['um CTA sólido, um pêssego', checarTelas],
  ['contraste dos pares versionados', checarContraste],
  ['nenhum nome aposentado', checarNomes],
];

async function rodar() {
  const arquivos = await listar(raiz);
  const ler = (rel) => readFile(join(raiz, rel), 'utf8');

  let total = 0;
  for (const [nome, checagem] of CHECAGENS) {
    const { erros, nota } = await checagem(arquivos, ler);
    if (erros.length) {
      total += erros.length;
      console.log(`\n  ✗ ${nome}`);
      for (const e of erros) console.log(`      ${e}`);
    } else {
      console.log(`  ✓ ${nome}${nota ? `  (${nota})` : ''}`);
    }
  }

  if (total) {
    console.error(`\n✗ lint reprovado — ${total} ${total === 1 ? 'violação' : 'violações'}.\n`);
    process.exit(1);
  }
  console.log('\n✓ Nenhuma violação.\n');
}

if (process.argv.includes('--autoteste')) await autoteste();
else await rodar();
