/* ============================================================
   Valida duas métricas da auditoria que deram resultado suspeito:
   leitura de regras CSS (tokens) e detecção de foco visível.

   Uso: node scripts/checar-metricas.mjs
   ============================================================ */

import { spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PERFIL = join(RAIZ, '.chrome-perfil', String(process.pid));
const PORTA = Number(process.env.CDP_PORTA || 9335 + (process.pid % 60));
const BASE = process.env.BASE_NEXT || 'http://127.0.0.1:4321';

const CHROME = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
].find(existsSync);

mkdirSync(PERFIL, { recursive: true });

const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--no-sandbox', '--no-first-run',
  '--hide-scrollbars', '--remote-debugging-port=' + PORTA,
  '--user-data-dir=' + PERFIL, 'about:blank'
], { stdio: 'ignore', windowsHide: true });

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
for (let i = 0; i < 60; i++) {
  try {
    const r = await fetch(`http://127.0.0.1:${PORTA}/json/version`);
    if (r.ok) break;
  } catch {
    /* subindo */
  }
  await esperar(250);
}

const r = await fetch(`http://127.0.0.1:${PORTA}/json/new?about:blank`, { method: 'PUT' });
const aba = await r.json();
const ws = new WebSocket(aba.webSocketDebuggerUrl);
await new Promise((ok, f) => {
  ws.addEventListener('open', ok, { once: true });
  ws.addEventListener('error', f, { once: true });
});
let id = 0;
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
    const i = ++id;
    pend.set(i, { ok, f });
    ws.send(JSON.stringify({ id: i, method, params }));
  });

await env('Page.enable');
await env('Runtime.enable');
await env('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await env('Page.navigate', { url: BASE + '/' });
await esperar(2000);

const SONDA = `(() => {
  /* 1. As folhas de estilo são legíveis pelo script? */
  const folhas = [...document.styleSheets].map((f) => {
    let regras = null, erro = null;
    try { regras = f.cssRules.length; } catch (e) { erro = e.name; }
    return { href: (f.href || 'inline').split('/').pop(), regras, erro };
  });

  /* 2. Quantas declarações usam var(--token)? Varrendo como string, que não
        depende de ler cssRules. */
  let varNoCss = 0;
  [...document.styleSheets].forEach((f) => {
    try { varNoCss += (f.ownerNode.textContent.match(/var\\(--/g) || []).length; } catch {}
  });

  /* 3. Tokens declarados no :root, lidos pelo valor computado. */
  const cs = getComputedStyle(document.documentElement);
  const declarados = [...document.styleSheets].flatMap((f) => {
    try { return [...f.cssRules]; } catch { return []; }
  }).filter((r) => r.style && /:root|html/.test(r.selectorText || ''))
    .flatMap((r) => [...r.style].filter((p) => p.startsWith('--')));

  /* 4. Foco: um elemento recebe outline ao focar de verdade? */
  const alvo = document.querySelector('a[href="#modelos"], .nav a, a.botao');
  alvo.focus();
  const depois = getComputedStyle(alvo);
  const focoReal = {
    elemento: (alvo.textContent || '').trim().slice(0, 24),
    outlineStyle: depois.outlineStyle,
    outlineWidth: depois.outlineWidth,
    outlineColor: depois.outlineColor,
    boxShadow: depois.boxShadow.slice(0, 40),
    matchesFocusVisible: alvo.matches(':focus-visible')
  };

  /* 5. Quantas regras com :focus existem e como são os seletores. */
  const regrasFoco = [];
  [...document.styleSheets].forEach((f) => {
    let regras;
    try { regras = f.cssRules; } catch { return; }
    const varre = (lista) => {
      for (const r of lista || []) {
        if (r.cssRules) { varre(r.cssRules); continue; }
        if (r.selectorText && /focus/.test(r.selectorText)) regrasFoco.push(r.selectorText);
      }
    };
    varre(regras);
  });

  return { folhas, varNoCss, tokensDeclarados: declarados.length, amostraTokens: declarados.slice(0, 8), focoReal, regrasFoco: [...new Set(regrasFoco)].slice(0, 12) };
})()`;

const res = await env('Runtime.evaluate', { expression: SONDA, returnByValue: true });
console.log(JSON.stringify(res.result.value, null, 2));

ws.close();
chrome.kill();
