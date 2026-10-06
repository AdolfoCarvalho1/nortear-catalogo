/* ============================================================
   Compara a fidelidade da migração: estático × Next.

   Para cada modelo, carrega as duas versões na MESMA viewport e compara
   medidas de layout e conteúdo. Divergência de altura ou de contagem de
   elementos significa que a migração mudou o desenho — e isso é um defeito.

   Uso:
     node scripts/comparar.mjs                 (todos os modelos migrados)
     node scripts/comparar.mjs saas-ia         (um modelo)
     node scripts/comparar.mjs --largura 390
   ============================================================ */

import { spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PERFIL = join(RAIZ, '.chrome-perfil', String(process.pid));
const PORTA_CDP = Number(process.env.CDP_PORTA || 9335 + (process.pid % 60));
const BASE = process.env.BASE_NEXT || 'http://127.0.0.1:4321';

const CHROME = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
].find(existsSync);

if (!CHROME) {
  console.error('Nenhum Chrome/Edge encontrado.');
  process.exit(1);
}

const argv = process.argv.slice(2);
const pegar = (nome, padrao) => {
  const i = argv.indexOf('--' + nome);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : padrao;
};
const largura = Number(pegar('largura', 1440));
const ids = argv.filter((a) => !a.startsWith('--') && a !== String(largura));

const { MODELOS } = createRequire(import.meta.url)(join(RAIZ, 'assets', 'modelos-data.js'));

const alvos = ids.length ? MODELOS.filter((m) => ids.includes(m.id)) : MODELOS;

mkdirSync(PERFIL, { recursive: true });

/* ---------- Chrome ---------- */
const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--no-sandbox', '--no-first-run',
  '--no-default-browser-check', '--disable-extensions', '--disable-sync',
  '--hide-scrollbars', '--force-device-scale-factor=1',
  '--remote-debugging-port=' + PORTA_CDP,
  '--user-data-dir=' + PERFIL,
  'about:blank'
], { stdio: 'ignore', windowsHide: true });

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

async function subir() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORTA_CDP}/json/version`);
      if (r.ok) return;
    } catch {
      /* ainda subindo */
    }
    await esperar(250);
  }
  throw new Error('Chrome não abriu a porta de depuração');
}

class Cdp {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pendentes = new Map();
    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pendentes.has(msg.id)) {
        const { ok, falha } = this.pendentes.get(msg.id);
        this.pendentes.delete(msg.id);
        msg.error ? falha(new Error(msg.error.message)) : ok(msg.result);
      }
    });
  }
  enviar(method, params = {}) {
    const id = ++this.id;
    return new Promise((ok, falha) => {
      this.pendentes.set(id, { ok, falha });
      this.ws.send(JSON.stringify({ id, method, params }));
      setTimeout(() => {
        if (this.pendentes.has(id)) {
          this.pendentes.delete(id);
          falha(new Error('timeout em ' + method));
        }
      }, 45000);
    });
  }
  fechar() {
    this.ws.close();
  }
}

async function novaAba() {
  const r = await fetch(`http://127.0.0.1:${PORTA_CDP}/json/new?about:blank`, { method: 'PUT' });
  const aba = await r.json();
  const ws = new WebSocket(aba.webSocketDebuggerUrl);
  await new Promise((ok, falha) => {
    ws.addEventListener('open', ok, { once: true });
    ws.addEventListener('error', falha, { once: true });
  });
  const cdp = new Cdp(ws);
  cdp.abaId = aba.id;
  return cdp;
}

/* ---------- Medição ---------- */
const MEDIR = `(() => {
  const conta = (s) => document.querySelectorAll(s).length;
  const texto = (s) => (document.querySelector(s)?.textContent ?? '').replace(/\\s+/g, ' ').trim();
  /* Mede cada seção do <main> em separado: quando a altura total diverge, é
     aqui que se vê QUAL seção mudou. */
  const secoes = [...document.querySelectorAll('main > section, main > div')].map((s) => ({
    cls: (s.className || s.tagName).toString().split(' ')[0],
    h: Math.round(s.getBoundingClientRect().height)
  }));
  return {
    altura: document.documentElement.scrollHeight,
    larguraDoc: document.documentElement.scrollWidth,
    rolagemLateral: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    h1: texto('h1'),
    titulo: document.title,
    lang: document.documentElement.lang,
    secoes: conta('main section'),
    h2: conta('main h2'),
    h3: conta('main h3'),
    botoes: conta('button'),
    links: conta('a'),
    campos: conta('input, select, textarea'),
    listas: conta('ul li'),
    svgs: conta('svg'),
    paragrafos: conta('p'),
    textoTotal: document.body.innerText.replace(/\\s+/g, ' ').trim().length,
    imagensQuebradas: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).length,
    /* Estado das interações: se o script não ligou, isto fica vazio. */
    falasNoTerminal: conta('#fluxo .fala'),
    sugestoes: conta('#sugestoes button'),
    linhasNoConsole: conta('#console-log > div'),
    secoesDetalhe: secoes
  };
})()`;

async function medir(cdp, url) {
  await cdp.enviar('Page.enable');
  await cdp.enviar('Runtime.enable');
  await cdp.enviar('Emulation.setDeviceMetricsOverride', {
    width: largura,
    height: 900,
    deviceScaleFactor: 1,
    mobile: largura < 700
  });
  await cdp.enviar('Page.navigate', { url });
  await esperar(1800);
  await cdp.enviar('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
  });
  await esperar(400);
  const r = await cdp.enviar('Runtime.evaluate', { expression: MEDIR, returnByValue: true });
  return r.result.value;
}

/* ---------- Execução ---------- */
await subir();

const linhas = [];
let divergentes = 0;

for (const m of alvos) {
  const estatico = pathToFileURL(join(RAIZ, m.arquivo)).href;
  const next = `${BASE}${m.rota}`;

  const cdpA = await novaAba();
  const cdpB = await novaAba();

  try {
    const a = await medir(cdpA, estatico);
    const b = await medir(cdpB, next);

    const chaves = [
      'altura', 'h1', 'secoes', 'h2', 'h3', 'botoes', 'links', 'campos',
      'listas', 'svgs', 'paragrafos', 'falasNoTerminal', 'sugestoes', 'linhasNoConsole'
    ];
    const diferencas = chaves.filter((k) => {
      if (k === 'altura') return Math.abs(a.altura - b.altura) > 4; // 4px de folga
      return a[k] !== b[k];
    });

    const ok = diferencas.length === 0 && !b.rolagemLateral && b.imagensQuebradas === 0;
    if (!ok) divergentes++;

    /* Quando a altura diverge, mostra o mapa de seções para localizar. */
    let mapaSecoes = '';
    if (diferencas.includes('altura')) {
      const nomes = new Set([...a.secoesDetalhe, ...b.secoesDetalhe].map((s) => s.cls));
      const linhas = [...nomes]
        .map((cls) => {
          const ha = a.secoesDetalhe.find((s) => s.cls === cls)?.h ?? 0;
          const hb = b.secoesDetalhe.find((s) => s.cls === cls)?.h ?? 0;
          return Math.abs(ha - hb) > 3 ? `       ${cls.padEnd(18)} ${ha} → ${hb}  (${hb - ha > 0 ? '+' : ''}${hb - ha})` : null;
        })
        .filter(Boolean);
      if (linhas.length) mapaSecoes = '\n     seções que mudaram:\n' + linhas.join('\n');
    }

    linhas.push({ id: m.id, ok, diferencas, a, b });

    console.log(
      `${ok ? 'ok  ' : 'DIFF'} ${m.id.padEnd(14)} altura ${a.altura}→${b.altura} · ` +
        `h2 ${a.h2}→${b.h2} · botões ${a.botoes}→${b.botoes} · campos ${a.campos}→${b.campos} · ` +
        `svg ${a.svgs}→${b.svgs} · terminal ${a.falasNoTerminal}→${b.falasNoTerminal} · ` +
        `console ${a.linhasNoConsole}→${b.linhasNoConsole}` +
        (b.rolagemLateral ? ' · ROLAGEM LATERAL' : '') +
        (b.imagensQuebradas ? ` · ${b.imagensQuebradas} imagem(ns) quebrada(s)` : '') +
        (diferencas.length ? `\n     ${diferencas.map((k) => `${k}: ${a[k]} → ${b[k]}`).join('\n     ')}` : '') +
        mapaSecoes
    );
  } catch (e) {
    console.log(`ERRO ${m.id}: ${e.message}`);
    divergentes++;
  } finally {
    cdpA.fechar();
    cdpB.fechar();
    await fetch(`http://127.0.0.1:${PORTA_CDP}/json/close/${cdpA.abaId}`).catch(() => {});
    await fetch(`http://127.0.0.1:${PORTA_CDP}/json/close/${cdpB.abaId}`).catch(() => {});
  }
}

console.log(
  `\n${alvos.length - divergentes}/${alvos.length} rotas idênticas ao estático em ${largura}px` +
    (divergentes ? ` — ${divergentes} divergente(s)` : '')
);

chrome.kill();
process.exit(divergentes ? 1 : 0);

