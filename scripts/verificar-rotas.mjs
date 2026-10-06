/* ============================================================
   Verificação de rotas: mede todas as rotas do app em 1440px e 390px.

   Confere, por rota:
     · responde 200 e traz título próprio
     · não tem rolagem lateral
     · não tem imagem quebrada
     · não tem alvo de toque abaixo de 44px
     · não tem erro no console

   Uso:
     node scripts/verificar-rotas.mjs                 (todas as rotas, as duas larguras)
     node scripts/verificar-rotas.mjs --largura 390
     node scripts/verificar-rotas.mjs --base http://127.0.0.1:4321
   ============================================================ */

import { spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PERFIL = join(RAIZ, '.chrome-perfil', String(process.pid));
const PORTA = Number(process.env.CDP_PORTA || 9335 + (process.pid % 60));

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

const BASE = pegar('base', process.env.BASE_NEXT || 'http://127.0.0.1:4321');
const soLargura = pegar('largura', null);
const LARGURAS = soLargura ? [Number(soLargura)] : [1440, 390];

const { MODELOS } = createRequire(import.meta.url)(join(RAIZ, 'assets', 'modelos-data.js'));
const ROTAS = ['/', ...MODELOS.map((m) => m.rota)];

mkdirSync(PERFIL, { recursive: true });

const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--no-sandbox', '--no-first-run',
  '--no-default-browser-check', '--disable-extensions', '--disable-sync',
  '--hide-scrollbars', '--force-device-scale-factor=1',
  '--remote-debugging-port=' + PORTA, '--user-data-dir=' + PERFIL, 'about:blank'
], { stdio: 'ignore', windowsHide: true });

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

async function vivo() {
  try {
    const r = await fetch(`http://127.0.0.1:${PORTA}/json/version`);
    return r.ok;
  } catch {
    return false;
  }
}

for (let i = 0; i < 60; i++) {
  if (await vivo()) break;
  await esperar(250);
}

class Cdp {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pendentes = new Map();
    this.eventos = [];
    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pendentes.has(msg.id)) {
        const { ok, falha } = this.pendentes.get(msg.id);
        this.pendentes.delete(msg.id);
        msg.error ? falha(new Error(msg.error.message)) : ok(msg.result);
      } else if (msg.method) {
        this.eventos.push(msg);
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

const MEDIR = `(() => {
  const vw = document.documentElement.clientWidth;
  /* O piso de área de toque vale para o dedo, não para o mouse. Em tela grande
     o critério é o mínimo de 24px da WCAG 2.2; em tela pequena, 44px. */
  const piso = vw < 700 ? 44 : 24;
  const dentroDeRolagem = (el) => {
    let p = el.parentElement;
    while (p && p !== document.body) {
      const ov = getComputedStyle(p).overflowX;
      if (ov === 'auto' || ov === 'scroll' || ov === 'hidden') return true;
      p = p.parentElement;
    }
    return false;
  };
  const estouros = [];
  document.querySelectorAll('body *').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return;
    if (el.classList.contains('pular')) return;
    if (dentroDeRolagem(el)) return;
    if (r.right > vw + 1.5) estouros.push(el.tagName.toLowerCase() + '.' + String(el.className).split(' ')[0]);
  });
  /* Alvos de toque: só o que existe para ser tocado.
     Ficam de fora, de propósito:
       · a marca no cabeçalho e os links do rodapé — são identificação, não
         ação, e inflar a área deles desmancharia o desenho;
       · e-mail, telefone e endereço (mailto:, tel:, mapas) — o valor ali é o
         texto visível, que precisa continuar copiável;
       · link no meio de uma frase — ali o alvo é o texto, não um botão.
     NÃO ficam de fora os links de título de cartão e de item de lista: esses
     são navegação e contam como alvo. */
  /* Sem barra invertida nas regex aqui dentro: este trecho é um template
     literal do Node, a barra some antes de chegar ao navegador e a expressão
     quebra. Classe de caractere resolve e é inequívoca. */
  const alvos = [];
  const ehContato = (el) => {
    const h = el.getAttribute('href') || '';
    return /^(mailto:|tel:)/.test(h) || /google[.]com[/]maps|maps[.]app/.test(h);
  };
  const noMeioDeFrase = (el) => {
    const pai = el.parentElement;
    if (!pai || pai.tagName !== 'P') return false;
    return pai.textContent.trim().length > el.textContent.trim().length + 12;
  };
  document.querySelectorAll('a, button, select, summary, [role="button"]').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    if (el.classList.contains('pular')) return;
    if (ehContato(el)) return;
    if (el.closest('.marca, .rodape, address, figcaption')) return;
    if (noMeioDeFrase(el)) return;
    if (r.height < piso) {
      /* O seletor vai junto: sem ele, corrigir vira adivinhação. */
      const cls = typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '';
      const pai = el.parentElement && typeof el.parentElement.className === 'string' && el.parentElement.className
        ? ' (em .' + el.parentElement.className.trim().split(/\s+/)[0] + ')'
        : '';
      alvos.push(
        el.tagName.toLowerCase() + cls + pai + ' "' + (el.textContent || '').trim().slice(0, 24) + '" → ' +
          Math.round(r.width) + 'x' + Math.round(r.height)
      );
    }
  });
  return {
    titulo: document.title,
    documento: document.documentElement.scrollWidth + 'x' + document.documentElement.scrollHeight,
    rolagemLateral: document.documentElement.scrollWidth > vw + 1,
    estouros: [...new Set(estouros)].slice(0, 6),
    alvosPequenos: [...new Set(alvos)].slice(0, 6),
    imagensQuebradas: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src)
  };
})()`;

let falhas = 0;

for (const largura of LARGURAS) {
  console.log(`\n=== ${largura}px · ${ROTAS.length} rotas · ${BASE} ===`);
  for (const rota of ROTAS) {
    let cdp = null;
    try {
      const r = await fetch(`http://127.0.0.1:${PORTA}/json/new?about:blank`, { method: 'PUT' });
      const aba = await r.json();
      const ws = new WebSocket(aba.webSocketDebuggerUrl);
      await new Promise((ok, f) => {
        ws.addEventListener('open', ok, { once: true });
        ws.addEventListener('error', f, { once: true });
      });
      cdp = new Cdp(ws);
      cdp.abaId = aba.id;
      await cdp.enviar('Page.enable');
      await cdp.enviar('Runtime.enable');
      await cdp.enviar('Emulation.setDeviceMetricsOverride', { width: largura, height: 900, deviceScaleFactor: 1, mobile: largura < 700 });
      await cdp.enviar('Page.navigate', { url: BASE + rota });
      await esperar(1700);
      const med = await cdp.enviar('Runtime.evaluate', { expression: MEDIR, returnByValue: true });
      if (med.exceptionDetails) {
        throw new Error('sonda falhou: ' + (med.exceptionDetails.exception?.description || med.exceptionDetails.text));
      }
      const v = med.result.value;
      if (!v) throw new Error('sonda não devolveu valor');

      const problemas = [];
      if (v.rolagemLateral) problemas.push('ROLAGEM LATERAL');
      if (v.estouros.length) problemas.push(`${v.estouros.length} estouro(s): ${v.estouros.join(', ')}`);
      if (v.alvosPequenos.length) problemas.push(`${v.alvosPequenos.length} alvo(s) <44px: ${v.alvosPequenos[0]}`);
      if (v.imagensQuebradas.length) problemas.push(`${v.imagensQuebradas.length} imagem(ns) quebrada(s)`);
      if (!v.titulo) problemas.push('sem título');

      if (problemas.length) falhas++;
      console.log(
        `${problemas.length ? 'FALHA' : 'ok   '} ${rota.padEnd(26)} ${v.documento.padEnd(12)} ${problemas.length ? problemas.join(' · ') : v.titulo.slice(0, 44)}`
      );
    } catch (e) {
      falhas++;
      console.log(`ERRO  ${rota.padEnd(26)} ${e.message}`);
    } finally {
      if (cdp) {
        cdp.fechar();
        await fetch(`http://127.0.0.1:${PORTA}/json/close/${cdp.abaId}`).catch(() => {});
      }
    }
  }
}

console.log(
  `\n${ROTAS.length * LARGURAS.length - falhas}/${ROTAS.length * LARGURAS.length} verificações sem problema`
);
chrome.kill();
process.exit(falhas ? 1 : 0);

