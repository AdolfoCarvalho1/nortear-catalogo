/* ============================================================
   Mede foco com TECLADO de verdade.

   `.focus()` programático não ativa `:focus-visible` — por isso a auditoria
   anterior acusou 426 elementos "sem indicador de foco", o que era falso.
   Aqui a tecla Tab é enviada pelo protocolo, que é o caminho real do usuário,
   e o indicador é lido do estilo computado depois de cada Tab.

   Uso: node scripts/auditar-foco.mjs [--largura 1440] [--paradas 30]
   ============================================================ */

import { spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
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
const largura = Number(pegar('largura', 1440));
const paradas = Number(pegar('paradas', 25));

const { MODELOS } = createRequire(import.meta.url)(join(RAIZ, 'assets', 'modelos-data.js'));
const ROTAS = ['/', ...MODELOS.map((m) => m.rota)];

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

class Cdp {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pendentes = new Map();
    ws.addEventListener('message', (ev) => {
      const m = JSON.parse(ev.data);
      if (m.id && this.pendentes.has(m.id)) {
        const { ok, falha } = this.pendentes.get(m.id);
        this.pendentes.delete(m.id);
        m.error ? falha(new Error(m.error.message)) : ok(m.result);
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
      }, 30000);
    });
  }
  fechar() {
    this.ws.close();
  }
}

/* Lê o indicador do elemento que está com o foco agora.
   Indicador de foco não é só `outline`: os campos destes modelos usam
   `outline: none` com anel de `box-shadow`, e alguns usam a própria borda
   mudando de cor. As três formas contam. Para a borda, o que decide é a
   diferença em relação ao estado de repouso — medir só "tem borda" acusaria
   todo campo, porque campo sempre tem borda. */
const LER_FOCO = `(() => {
  const el = document.activeElement;
  if (!el || el === document.body) return null;
  const cs = getComputedStyle(el);
  const temOutline = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0;
  const temSombra = cs.boxShadow !== 'none';

  /* Compara com o repouso: tira o foco, lê a borda, devolve o foco. */
  const bordaComFoco = cs.borderColor;
  const larguraComFoco = cs.borderWidth;
  let bordaMudou = false;
  try {
    el.blur();
    const repouso = getComputedStyle(el);
    bordaMudou = repouso.borderColor !== bordaComFoco || repouso.borderWidth !== larguraComFoco;
    el.focus();
  } catch { /* elemento sem foco programável */ }

  return {
    el: (el.textContent || el.getAttribute('aria-label') || el.getAttribute('placeholder') || el.tagName).trim().slice(0, 32) || el.tagName.toLowerCase(),
    tag: el.tagName.toLowerCase(),
    ident: el.id ? '#' + el.id : el.name ? '[name=' + el.name + ']' : el.getAttribute('type') ? '[' + el.getAttribute('type') + ']' : '',
    tipo: el.getAttribute('type') || el.tagName.toLowerCase(),
    focusVisible: el.matches(':focus-visible'),
    temOutline, temSombra, bordaMudou,
    marca: temOutline ? cs.outlineStyle + ' ' + cs.outlineWidth + ' ' + cs.outlineColor
      : temSombra ? 'anel ' + cs.boxShadow.slice(0, 44)
      : bordaMudou ? 'borda ' + bordaComFoco
      : 'nada',
    visivel: temOutline || temSombra || bordaMudou
  };
})()`;

const resumo = [];

for (const rota of ROTAS) {
  const r = await fetch(`http://127.0.0.1:${PORTA}/json/new?about:blank`, { method: 'PUT' });
  const aba = await r.json();
  const ws = new WebSocket(aba.webSocketDebuggerUrl);
  await new Promise((ok, f) => {
    ws.addEventListener('open', ok, { once: true });
    ws.addEventListener('error', f, { once: true });
  });
  const cdp = new Cdp(ws);
  const semIndicador = [];
  let comIndicador = 0;
  try {
    await cdp.enviar('Page.enable');
    await cdp.enviar('Runtime.enable');
    await cdp.enviar('Emulation.setDeviceMetricsOverride', {
      width: largura, height: 900, deviceScaleFactor: 1, mobile: largura < 700
    });
    await cdp.enviar('Page.navigate', { url: BASE + rota });
    await esperar(1900);

    for (let i = 0; i < paradas; i++) {
      await cdp.enviar('Input.dispatchKeyEvent', {
        type: 'rawKeyDown', windowsVirtualKeyCode: 9, key: 'Tab', code: 'Tab', nativeVirtualKeyCode: 9
      });
      await cdp.enviar('Input.dispatchKeyEvent', {
        type: 'keyUp', windowsVirtualKeyCode: 9, key: 'Tab', code: 'Tab', nativeVirtualKeyCode: 9
      });
      /* O estilo de foco precisa de um quadro para assentar; com 90ms o
         input[type=date] do Chrome ainda aparecia sem o anel. */
      await esperar(200);
      const med = await cdp.enviar('Runtime.evaluate', { expression: LER_FOCO, returnByValue: true });
      const v = med.result.value;
      if (!v) continue;
      if (v.visivel) comIndicador++;
      else semIndicador.push(`${v.tag}${v.ident} tipo=${v.tipo} fv=${v.focusVisible} (${v.marca})`);
    }

    resumo.push({ rota, comIndicador, semIndicador });
    console.log(
      `${semIndicador.length ? 'FALHA' : 'ok   '} ${rota.padEnd(26)} ${comIndicador}/${paradas} paradas com indicador visível` +
        (semIndicador.length ? ` · sem indicador: ${semIndicador.slice(0, 2).join(' | ')}` : '')
    );
  } catch (e) {
    console.log(`ERRO  ${rota}: ${e.message}`);
  } finally {
    cdp.fechar();
    await fetch(`http://127.0.0.1:${PORTA}/json/close/${aba.id}`).catch(() => {});
  }
}

const total = resumo.reduce((a, r) => a + r.comIndicador + r.semIndicador.length, 0);
const comIndicador = resumo.reduce((a, r) => a + r.comIndicador, 0);
console.log(`\n${comIndicador}/${total} paradas de Tab com indicador de foco visível`);

chrome.kill();



