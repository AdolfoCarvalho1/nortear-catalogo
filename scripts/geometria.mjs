/* ============================================================
   Compara a GEOMETRIA de cada bloco entre estático e Next.

   A captura por pixel diz que há diferença; esta ferramenta diz onde.
   Mede a caixa de cada seletor e lista os que mudaram de posição ou tamanho.

   Uso: node scripts/geometria.mjs saas-ia [--largura 1440]
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

const argv = process.argv.slice(2);
const pegar = (nome, padrao) => {
  const i = argv.indexOf('--' + nome);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : padrao;
};
const largura = Number(pegar('largura', 1440));
const id = argv.find((a) => !a.startsWith('--') && !/^\d+$/.test(a));

const { MODELOS } = createRequire(import.meta.url)(join(RAIZ, 'assets', 'modelos-data.js'));
const modelo = MODELOS.find((m) => m.id === id);
if (!modelo) {
  console.error('Modelo não encontrado:', id);
  process.exit(1);
}

mkdirSync(PERFIL, { recursive: true });

const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--no-sandbox', '--no-first-run',
  '--no-default-browser-check', '--hide-scrollbars', '--force-device-scale-factor=1',
  '--remote-debugging-port=' + PORTA_CDP, '--user-data-dir=' + PERFIL, 'about:blank'
], { stdio: 'ignore', windowsHide: true });

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

async function subir() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORTA_CDP}/json/version`);
      if (r.ok) return;
    } catch {
      /* subindo */
    }
    await esperar(250);
  }
  throw new Error('Chrome não abriu a porta');
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

const MEDIR = `(() => {
  const alvos = [...document.querySelectorAll('header, main > *, main > * > *, footer, form, .terminal, .numeros, .planos, .passos, .console, .seguranca, .perguntas')];
  return alvos.map((el, i) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return {
      i,
      tag: el.tagName.toLowerCase(),
      cls: (typeof el.className === 'string' ? el.className : '').split(' ').filter(Boolean).slice(0, 2).join('.'),
      id: el.id || '',
      top: Math.round(r.top + window.scrollY),
      altura: Math.round(r.height),
      largura: Math.round(r.width),
      mt: cs.marginTop,
      mb: cs.marginBottom,
      pt: cs.paddingTop,
      pb: cs.paddingBottom
    };
  });
})()`;

async function medir(cdp, url) {
  await cdp.enviar('Page.enable');
  await cdp.enviar('Runtime.enable');
  await cdp.enviar('Emulation.setDeviceMetricsOverride', {
    width: largura, height: 900, deviceScaleFactor: 1, mobile: largura < 700
  });
  await cdp.enviar('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
  });
  await cdp.enviar('Page.navigate', { url });
  await esperar(2200);
  const r = await cdp.enviar('Runtime.evaluate', { expression: MEDIR, returnByValue: true });
  return r.result.value;
}

await subir();

const cdpA = await novaAba();
const cdpB = await novaAba();

try {
  const a = await medir(cdpA, pathToFileURL(join(RAIZ, modelo.arquivo)).href);
  const b = await medir(cdpB, `${BASE}${modelo.rota}`);

  console.log(`comparando ${modelo.id} @ ${largura}px — ${a.length} blocos no estático, ${b.length} no Next\n`);

  const n = Math.max(a.length, b.length);
  let iguais = 0;
  const problemas = [];

  for (let i = 0; i < n; i++) {
    const x = a[i];
    const y = b[i];
    if (!x || !y) {
      problemas.push(`  [${i}] só existe em ${x ? 'estático' : 'Next'}: ${(x ?? y).tag}.${(x ?? y).cls}`);
      continue;
    }
    const dTop = y.top - x.top;
    const dAlt = y.altura - x.altura;
    const dLar = y.largura - x.largura;
    if (Math.abs(dTop) > 1 || Math.abs(dAlt) > 1 || Math.abs(dLar) > 1) {
      problemas.push(
        `  [${i}] ${x.tag}${x.cls ? '.' + x.cls : ''}${x.id ? '#' + x.id : ''}` +
          `  top ${x.top}→${y.top} (${dTop > 0 ? '+' : ''}${dTop})` +
          `  altura ${x.altura}→${y.altura} (${dAlt > 0 ? '+' : ''}${dAlt})` +
          (Math.abs(dLar) > 1 ? `  largura ${x.largura}→${y.largura} (${dLar > 0 ? '+' : ''}${dLar})` : '') +
          (x.mt !== y.mt ? `  margin-top ${x.mt}→${y.mt}` : '') +
          (x.pt !== y.pt ? `  padding-top ${x.pt}→${y.pt}` : '')
      );
    } else {
      iguais++;
    }
  }

  console.log(`${iguais}/${n} blocos idênticos`);
  if (problemas.length) {
    console.log(`\n${problemas.length} bloco(s) divergente(s):`);
    problemas.slice(0, 30).forEach((p) => console.log(p));
    if (problemas.length > 30) console.log(`  ... e mais ${problemas.length - 30}`);
  }
} finally {
  cdpA.fechar();
  cdpB.fechar();
  await fetch(`http://127.0.0.1:${PORTA_CDP}/json/close/${cdpA.abaId}`).catch(() => {});
  await fetch(`http://127.0.0.1:${PORTA_CDP}/json/close/${cdpB.abaId}`).catch(() => {});
  chrome.kill();
}

