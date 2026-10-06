/* Mede os filhos de uma seção nas duas versões, para localizar divergência.
   Uso: node scripts/detalhe-secao.mjs saas-ia "#produto" [--largura 1440] */

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PERFIL = join(RAIZ, '.chrome-perfil', String(process.pid));
const PORTA = Number(process.env.CDP_PORTA || 9335 + (process.pid % 60));
const BASE = process.env.BASE_NEXT || 'http://127.0.0.1:4321';

const CHROME = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
].find(existsSync);

const argv = process.argv.slice(2);
const seletor = argv.find((a) => a.startsWith('#') || a.startsWith('.')) || '#produto';
const id = argv.find((a) => !a.startsWith('--') && !a.startsWith('#') && !a.startsWith('.') && !/^\d+$/.test(a));
const iLarg = argv.indexOf('--largura');
const largura = iLarg >= 0 ? Number(argv[iLarg + 1]) : 1440;

const { MODELOS } = createRequire(import.meta.url)(join(RAIZ, 'assets', 'modelos-data.js'));
const modelo = MODELOS.find((m) => m.id === id) || MODELOS[0];

const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
  '--force-device-scale-factor=1', '--remote-debugging-port=' + PORTA,
  '--user-data-dir=' + PERFIL, 'about:blank'
], { stdio: 'ignore', windowsHide: true });

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

for (let i = 0; i < 60; i++) {
  try {
    const r = await fetch(`http://127.0.0.1:${PORTA}/json/version`);
    if (r.ok) break;
  } catch {
    /* subindo */
  }
  await wait(250);
}

const MEDIR = `(() => {
  const alvo = document.querySelector(${JSON.stringify(seletor)});
  if (!alvo) return { erro: 'seletor não encontrado' };
  const k = getComputedStyle(alvo);
  const props = ['paddingTop', 'paddingBottom', 'marginTop', 'marginBottom', 'gap', 'display', 'gridTemplateColumns', 'height', 'minHeight', 'boxSizing', 'fontSize', 'lineHeight'];
  const out = {};
  props.forEach((p) => { out[p] = k[p]; });
  const r = alvo.getBoundingClientRect();
  out._rect = { h: Math.round(r.height), w: Math.round(r.width) };
  const h2 = alvo.querySelector('h2');
  if (h2) {
    const q = getComputedStyle(h2);
    out._h2 = { h: Math.round(h2.getBoundingClientRect().height), fs: q.fontSize, lh: q.lineHeight, mb: q.marginBottom, mt: q.marginTop };
  }
  const p = alvo.querySelector('p');
  if (p) {
    const q = getComputedStyle(p);
    out._p = { h: Math.round(p.getBoundingClientRect().height), fs: q.fontSize, lh: q.lineHeight, mb: q.marginBottom, mt: q.marginTop };
  }
  return out;
})()`;

async function medir(url) {
  const r = await fetch(`http://127.0.0.1:${PORTA}/json/new?about:blank`, { method: 'PUT' });
  const aba = await r.json();
  const ws = new WebSocket(aba.webSocketDebuggerUrl);
  await new Promise((ok, f) => {
    ws.addEventListener('open', ok, { once: true });
    ws.addEventListener('error', f, { once: true });
  });
  let idm = 0;
  const pend = new Map();
  ws.addEventListener('message', (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pend.has(m.id)) {
      const { ok, f } = pend.get(m.id);
      pend.delete(m.id);
      m.error ? f(new Error(m.error.message)) : ok(m.result);
    }
  });
  const env = (method, params = {}) =>
    new Promise((ok, f) => {
      const i = ++idm;
      pend.set(i, { ok, f });
      ws.send(JSON.stringify({ id: i, method, params }));
    });
  await env('Page.enable');
  await env('Runtime.enable');
  await env('Emulation.setDeviceMetricsOverride', { width: largura, height: 900, deviceScaleFactor: 1, mobile: largura < 700 });
  await env('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await env('Page.navigate', { url });
  await wait(2200);
  const res = await env('Runtime.evaluate', { expression: MEDIR, returnByValue: true });
  ws.close();
  await fetch(`http://127.0.0.1:${PORTA}/json/close/${aba.id}`).catch(() => {});
  return res.result.value;
}

const A = await medir(pathToFileURL(join(RAIZ, modelo.arquivo)).href);
const B = await medir(`${BASE}${modelo.rota}`);

console.log(`${modelo.id} · ${seletor} @ ${largura}px\n`);
if (A.erro || B.erro) {
  console.log('erro na medição:', A.erro || B.erro);
} else {
  const chaves = new Set([...Object.keys(A), ...Object.keys(B)]);
  [...chaves].forEach((k) => {
    const va = JSON.stringify(A[k]);
    const vb = JSON.stringify(B[k]);
    if (va !== vb) console.log(`≠ ${k.padEnd(20)} ${va}\n  ${' '.repeat(20)} ${vb}`);
    else console.log(`= ${k.padEnd(20)} ${va}`);
  });
}

chrome.kill();

