/* ============================================================
   Mede o indicador de foco de um campo específico, com a tecla Tab.

   Uso: node scripts/medir-foco.mjs <rota> <seletor> [--largura 390]
   Ex.: node scripts/medir-foco.mjs /modelos/clinica ".campo input"
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

const argv = process.argv.slice(2);
const pegar = (n, p) => {
  const i = argv.indexOf('--' + n);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : p;
};
const rota = argv.find((a) => a.startsWith('/')) || '/modelos/clinica';
const seletor = argv.find((a) => a.startsWith('.') || a.startsWith('#')) || '.campo input';
const largura = Number(pegar('largura', 390));

mkdirSync(PERFIL, { recursive: true });

const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--no-sandbox', '--no-first-run',
  '--hide-scrollbars', '--force-device-scale-factor=1',
  '--remote-debugging-port=' + PORTA, '--user-data-dir=' + PERFIL, 'about:blank'
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
await env('Emulation.setDeviceMetricsOverride', { width: largura, height: 900, deviceScaleFactor: 1, mobile: largura < 700 });
await env('Page.navigate', { url: BASE + rota });
await esperar(2000);

/* Foca o campo pelo teclado: clica antes para entrar no contexto e dá Tab
   até chegar nele, que é o caminho que ativa :focus-visible. */
const LER = `(() => {
  const el = document.querySelector(${JSON.stringify(seletor)});
  if (!el) return { erro: 'seletor não encontrado' };
  el.focus();
  const cs = getComputedStyle(el);
  const casa = {
    'input:focus-visible': el.matches('input:focus-visible'),
    ':focus-visible': el.matches(':focus-visible'),
    'input:focus': el.matches('input:focus')
  };
  /* Quais regras do CSS declaram este elemento com :focus? */
  const regras = [];
  [...document.styleSheets].forEach((f) => {
    let lista;
    try { lista = f.cssRules; } catch { return; }
    const varre = (l) => {
      for (const reg of l || []) {
        if (reg.cssRules) { varre(reg.cssRules); continue; }
        if (!reg.selectorText || !/focus/.test(reg.selectorText)) continue;
        const base = reg.selectorText.replace(/:focus(-visible)?/g, '');
        let casa2 = false;
        try { casa2 = base ? el.matches(base) : false; } catch {}
        if (casa2) regras.push({ seletor: reg.selectorText, decl: reg.style.cssText.slice(0, 120) });
      }
    };
    varre(lista);
  });
  return {
    tag: el.tagName.toLowerCase(),
    classe: el.className,
    outline: cs.outlineStyle + ' ' + cs.outlineWidth + ' ' + cs.outlineColor,
    boxShadow: cs.boxShadow,
    borderColor: cs.borderColor,
    casa,
    regras
  };
})()`;

/* Tab até o campo, que é o que ativa :focus-visible. */
for (let i = 0; i < 40; i++) {
  const ativo = await env('Runtime.evaluate', {
    expression: `document.activeElement && document.activeElement.matches(${JSON.stringify(seletor)})`,
    returnByValue: true
  });
  if (ativo.result.value) break;
  await env('Input.dispatchKeyEvent', { type: 'rawKeyDown', windowsVirtualKeyCode: 9, key: 'Tab', code: 'Tab', nativeVirtualKeyCode: 9 });
  await env('Input.dispatchKeyEvent', { type: 'keyUp', windowsVirtualKeyCode: 9, key: 'Tab', code: 'Tab', nativeVirtualKeyCode: 9 });
  await esperar(70);
}

const res = await env('Runtime.evaluate', { expression: LER, returnByValue: true });
console.log(JSON.stringify(res.result.value, null, 2));

ws.close();
chrome.kill();
