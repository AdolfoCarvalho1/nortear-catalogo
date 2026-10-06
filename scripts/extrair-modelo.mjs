/* ============================================================
   Extrai o <body> e o <script> de um modelo estático e converte o
   markup para JSX. É o passo mecânico da migração para Next: o
   desenho não muda, só o formato do arquivo.

   Uso:
     node scripts/extrair-modelo.mjs 01-saas-ia            (relatório)
     node scripts/extrair-modelo.mjs 01-saas-ia --gravar   (escreve em .migracao/)
   ============================================================ */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pasta = process.argv[2];
const gravar = process.argv.includes('--gravar');

if (!pasta) {
  console.error('Informe a pasta do modelo, ex.: 01-saas-ia');
  process.exit(1);
}

const origem = join(RAIZ, 'modelos', pasta, 'index.html');
if (!existsSync(origem)) {
  console.error('Não encontrei', origem);
  process.exit(1);
}

const html = readFileSync(origem, 'utf8');

/* ---------- 1. Separar as partes ---------- */
const corpo = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? '';

/* Alguns modelos têm mais de um <script>: um curto que liga a classe `js`
   (o CSS depende dela para não esconder conteúdo sem JS) e o principal.
   Os dois precisam ir para o módulo de interação, na ordem original. */
const scripts = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
const script = scripts.join('\n\n');
if (!script) console.warn('AVISO: nenhum <script> encontrado — o modelo pode depender de JS e não ter.');

const titulo = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? '';
const descricao = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i)?.[1]?.trim() ?? '';
const cor = html.match(/<meta\s+name="theme-color"\s+content="([^"]*)"/i)?.[1]?.trim() ?? '#ffffff';

if (!corpo) {
  console.error('Não achei o <body> em', origem);
  process.exit(1);
}

/* O corpo inclui os <script> no fim; eles saem do JSX e viram o módulo. */
const corpoSemScript = corpo.replace(/<script[\s\S]*?<\/script>/gi, '').trim();

/* ---------- 2. Converter HTML em JSX ---------- */
const VAZIOS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr'
]);

/* Campos que o React trata como controlados.
   `checked` sem `onChange` faz o React marcar o campo como somente-leitura: o
   navegador ignora o clique e a interação morre (aconteceu com os filtros do
   modelo 09). O HTML original já traz o estado inicial no atributo, então o
   certo é `defaultChecked`, que renderiza o mesmo `checked` e devolve o clique.
   `value` em input NÃO entra aqui: no React ele é o valor controlado, mas os
   scripts destes modelos leem `.value` do DOM e escrevem direto, o que segue
   funcionando — converter mudaria o comportamento. */
const CONTROLADOS = { checked: 'defaultChecked' };

/* Atributos que trocam de nome em React. */
const ATRIBUTOS = {
  class: 'className',
  for: 'htmlFor',
  tabindex: 'tabIndex',
  readonly: 'readOnly',
  maxlength: 'maxLength',
  minlength: 'minLength',
  autocomplete: 'autoComplete',
  autofocus: 'autoFocus',
  autoplay: 'autoPlay',
  enctype: 'encType',
  novalidate: 'noValidate',
  colspan: 'colSpan',
  rowspan: 'rowSpan',
  cellpadding: 'cellPadding',
  cellspacing: 'cellSpacing',
  usemap: 'useMap',
  contenteditable: 'contentEditable',
  spellcheck: 'spellCheck',
  crossorigin: 'crossOrigin',
  datetime: 'dateTime',
  accesskey: 'accessKey',
  inputmode: 'inputMode',
  enterkeyhint: 'enterKeyHint',
  'accept-charset': 'acceptCharset',
  srcset: 'srcSet'
};

/* Atributos que o React tipa como número e que, no HTML destes modelos, vêm
   como número em texto. `max` e `min` ficam de fora: em input de data o valor
   é string e converter quebraria o campo. */
const NUMERICOS = new Set([
  'rows', 'cols', 'size', 'maxlength', 'minlength', 'tabindex',
  'span', 'start', 'high', 'low', 'optimum', 'marginwidth', 'marginheight'
]);

/* Estes aceitam número negativo (tabIndex="-1" é o caso comum). */
const NUMERICOS_COM_SINAL = new Set(['tabindex', 'start']);

/* O React tipa os aria-value* como número. */
const ARIA_NUMERICO = new Set(['aria-valuemin', 'aria-valuemax', 'aria-valuenow']);

/* Atributos SVG em kebab-case que o React aceita como estão (são válidos em JSX
   apenas se o React os repassar; os camelCase abaixo são os que mudam). */
const SVG_ATRIBUTOS = {
  'stroke-width': 'strokeWidth',
  'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin',
  'stroke-dasharray': 'strokeDasharray',
  'stroke-dashoffset': 'strokeDashoffset',
  'stroke-miterlimit': 'strokeMiterlimit',
  'stroke-opacity': 'strokeOpacity',
  'fill-rule': 'fillRule',
  'fill-opacity': 'fillOpacity',
  'clip-rule': 'clipRule',
  'clip-path': 'clipPath',
  'stop-color': 'stopColor',
  'stop-opacity': 'stopOpacity',
  'text-anchor': 'textAnchor',
  'dominant-baseline': 'dominantBaseline',
  'marker-end': 'markerEnd',
  'marker-start': 'markerStart',
  'marker-mid': 'markerMid',
  'vector-effect': 'vectorEffect',
  'shape-rendering': 'shapeRendering',
  'paint-order': 'paintOrder',
  'font-family': 'fontFamily',
  'font-size': 'fontSize',
  'font-weight': 'fontWeight',
  'letter-spacing': 'letterSpacing',
  'preserveaspectratio': 'preserveAspectRatio',
  'viewbox': 'viewBox',
  'gradientunits': 'gradientUnits',
  'patternunits': 'patternUnits',
  'patterncontentunits': 'patternContentUnits',
  'xlink:href': 'xlinkHref'
};

/* Converte o valor de um atributo para a forma que o JSX aceita.
   JSX não usa escape de barra invertida em string de atributo: se o valor tem
   aspas, o delimitador muda em vez de escapar. */
function citar(valor) {
  if (!valor.includes('"')) return `"${valor}"`;
  if (!valor.includes("'")) return `'${valor}'`;
  // Tem os dois: aspa dupla vira entidade, que o JSX resolve no parse.
  return `"${valor.replace(/"/g, '&quot;')}"`;
}

function valorJsx(nome, valor) {
  // style="a:b; c:d"  ->  style={{ a: "b", c: "d" } as React.CSSProperties}
  if (nome === 'style') {
    let temCustom = false;
    const props = valor
      .split(';')
      .map((d) => d.trim())
      .filter(Boolean)
      .map((d) => {
        const i = d.indexOf(':');
        if (i < 0) return null;
        const bruta = d.slice(0, i).trim();
        /* Custom property (`--i`) não vira camelCase: ela é uma string, não um
           identificador. Sem isto, `--i` sai como `-I` e o JSX não compila. */
        if (bruta.startsWith('--')) {
          temCustom = true;
          return `"${bruta}": ${citar(d.slice(i + 1).trim())}`;
        }
        const chave = bruta.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        return `${chave}: ${citar(d.slice(i + 1).trim())}`;
      })
      .filter(Boolean);
    /* O tipo CSSProperties não declara custom properties: sem o cast, o TS
       recusa a chave "--i". */
    const cast = temCustom ? ' as React.CSSProperties' : '';
    return `{{ ${props.join(', ')} }${cast}}`;
  }
  return citar(valor);
}

function converterAbertura(tag) {
  // <div class="x" data-y="z">
  const m = tag.match(/^<([a-zA-Z][\w:-]*)([\s\S]*?)(\/?)>$/);
  if (!m) return tag;
  const [, nomeBruto, resto, barra] = m;
  const nome = nomeBruto;
  const atributos = [];

  const reAtributo = /([a-zA-Z_:][\w:.-]*)(?:\s*=\s*("([^"]*)"|'([^']*)'))?/g;
  let a;
  while ((a = reAtributo.exec(resto))) {
    const bruto = a[1];
    const temValor = a[2] !== undefined;
    const valor = a[3] ?? a[4] ?? '';
    const brutoMin = bruto.toLowerCase();
    const chave =
      CONTROLADOS[brutoMin] ??
      ATRIBUTOS[brutoMin] ??
      SVG_ATRIBUTOS[brutoMin] ??
      bruto;

    if (!temValor) {
      // Atributo sem valor: em JSX booleano vale true, exceto os que aceitam string vazia.
      atributos.push(`${chave}`);
      continue;
    }
    // Atributo numérico sai como expressão, não como string.
    if (NUMERICOS.has(brutoMin) || ARIA_NUMERICO.has(brutoMin)) {
      const limpo = valor.trim();
      const ok = NUMERICOS_COM_SINAL.has(brutoMin) ? /^-?\d+$/.test(limpo) : /^\d+$/.test(limpo);
      if (ok) {
        atributos.push(`${chave}={${limpo}}`);
        continue;
      }
    }
    atributos.push(`${chave}=${valorJsx(brutoMin, valor)}`);
  }

  const fechamento = VAZIOS.has(nome.toLowerCase()) ? ' /' : barra ? ' /' : '';
  const espaco = atributos.length ? ' ' + atributos.join(' ') : '';
  return `<${nome}${espaco}${fechamento}>`;
}

function htmlParaJsx(entrada) {
  /* Comentários HTML saem de cena ANTES da proteção de chaves: dentro de um
     comentário JSX as chaves não podem ser escapadas, senão `{/*` vira
     `{"{"}/*` e o comentário deixa de ser comentário. */
  const comentarios = [];
  let saida = entrada.replace(/<!--([\s\S]*?)-->/g, (_, texto) => {
    comentarios.push(texto.replace(/\*\//g, '*\\/').replace(/\s+/g, ' ').trim());
    return `\u0000COMENTARIO${comentarios.length - 1}\u0000`;
  });

  // Tags: só as de abertura precisam de conversão; as de fechamento ficam iguais.
  saida = saida.replace(/<[a-zA-Z][^>]*>/g, (tag) => {
    if (tag.startsWith('</')) return tag;
    if (tag.startsWith('<!')) return tag;
    return converterAbertura(tag);
  });

  // Entidades que o JSX não interpreta: ele quer o caractere literal.
  saida = saida
    .replace(/&nbsp;/g, '\u00a0')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  /* Tudo que nós mesmos geramos com chave — objetos `style={{ ... }}` e
     atributos numéricos como `rows={1}` — sai de cena numa passada só, antes
     do escape de chaves. Em duas passadas, a segunda protegia o que a primeira
     já tinha escapado, e o resultado não compilava. */
  const gerados = [];
  saida = saida.replace(/style=\{\{[\s\S]*?\}\}|=\{-?\d+\}/g, (bloco) => {
    gerados.push(bloco);
    return `\u0000GERADO${gerados.length - 1}\u0000`;
  });

  // Chaves soltas em texto quebrariam o JSX.
  saida = saida.replace(/\{/g, '{"{"}').replace(/\}/g, '{"}"}');

  // Devolve comentários e blocos gerados já no formato JSX.
  saida = saida.replace(/\u0000COMENTARIO(\d+)\u0000/g, (_, i) => `{/* ${comentarios[Number(i)]} */}`);
  saida = saida.replace(/\u0000GERADO(\d+)\u0000/g, (_, i) => gerados[Number(i)]);

  return saida;
}

const jsx = htmlParaJsx(corpoSemScript);

/* ---------- 3. Relatório ---------- */
const contaTags = (s) => (s.match(/<[a-zA-Z][\w:-]*/g) || []).length;
const suspeitos = [];
if (/\bclass=/.test(jsx)) suspeitos.push('sobrou class= (deveria ser className=)');
if (/\bfor=/.test(jsx)) suspeitos.push('sobrou for= (deveria ser htmlFor=)');
if (/<img(?![^>]*\/>)/.test(jsx)) suspeitos.push('<img> sem fechamento');
if (/<input(?![^>]*\/>)/.test(jsx)) suspeitos.push('<input> sem fechamento');
if (/<br(?![^>]*\/>)/.test(jsx)) suspeitos.push('<br> sem fechamento');
if (/style="/.test(jsx)) suspeitos.push('sobrou style="..." (deveria ser objeto)');

console.log(`modelo:     ${pasta}`);
console.log(`título:     ${titulo}`);
console.log(`descrição:  ${descricao.slice(0, 70)}…`);
console.log(`theme-color: ${cor}`);
console.log(`tags no corpo: ${contaTags(corpoSemScript)} → JSX com ${contaTags(jsx)}`);
console.log(`script de interação: ${script.split('\n').length} linhas`);
console.log(`tamanho: ${Math.round(corpoSemScript.length / 1024)} kB de HTML → ${Math.round(jsx.length / 1024)} kB de JSX`);
console.log(suspeitos.length ? `\nATENÇÃO:\n  - ${suspeitos.join('\n  - ')}` : '\nconversão sem suspeitas');

if (gravar) {
  const destino = join(RAIZ, '.migracao', pasta);
  mkdirSync(destino, { recursive: true });
  writeFileSync(join(destino, 'corpo.jsx.txt'), jsx, 'utf8');
  writeFileSync(join(destino, 'interacao.js'), script, 'utf8');
  writeFileSync(
    join(destino, 'meta.json'),
    JSON.stringify({ titulo, descricao, cor, pasta }, null, 2),
    'utf8'
  );
  console.log(`\ngravado em .migracao/${pasta}/ (corpo.jsx.txt, interacao.js, meta.json)`);
}


