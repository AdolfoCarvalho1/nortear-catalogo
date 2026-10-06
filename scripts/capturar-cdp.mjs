/* ============================================================
   Captura de verdade — Chrome DevTools Protocol, sem dependência.
   Node 22 traz WebSocket nativo; o Chrome é aberto com
   --remote-debugging-port e controlado por CDP.

   Uso:
     node scripts/capturar-cdp.mjs <id> [--largura 390] [--pagina]
     node scripts/capturar-cdp.mjs --todos [--largura 1440] [--pagina]
     node scripts/capturar-cdp.mjs --url <caminho-ou-url> --saida <arquivo.png>

   Opções:
     --largura <px>   largura da viewport (padrão 1440)
     --altura <px>    altura da viewport (padrão 900; ignorada com --pagina)
     --pagina         captura a página inteira (captureBeyondViewport)
     --saida <arq>    caminho do PNG (só com --url)
     --thumbs         grava em assets/thumbs/<id>.png (padrão para modelos)
   ============================================================ */

import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PERFIL = join(RAIZ, '.chrome-perfil', String(process.pid));
const PORTA = Number(process.env.CDP_PORTA || 9335 + (process.pid % 60));

const CHROME = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
].find(existsSync);

if (!CHROME) { console.error('Nenhum Chrome/Edge encontrado.'); process.exit(1); }

/* ---------- argumentos ---------- */
const argv = process.argv.slice(2);
const pegar = (nome, padrao) => {
  const i = argv.indexOf('--' + nome);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : padrao;
};
const temFlag = (nome) => argv.includes('--' + nome);

const largura = Number(pegar('largura', 1440));
const altura = Number(pegar('altura', 900));
const paginaInteira = temFlag('pagina');
const urlDireta = pegar('url', null);
const saidaDireta = pegar('saida', null);
const paraThumbs = temFlag('thumbs');
const todos = temFlag('todos');
const medir = pegar('medir', null);

const { MODELOS } = createRequire(import.meta.url)(join(RAIZ, 'assets', 'modelos-data.js'));

let alvos;
if (urlDireta) {
  const url = /^https?:|^file:/.test(urlDireta) ? urlDireta : pathToFileURL(resolve(RAIZ, urlDireta)).href;
  const saida = saidaDireta ? resolve(RAIZ, saidaDireta) : join(RAIZ, 'assets', 'thumbs', 'captura.png');
  alvos = [{ id: 'avulso', url, saida }];
} else {
  const ids = argv.filter((a) => !a.startsWith('--') && MODELOS.some((m) => m.id === a));
  const escolhidos = todos || !ids.length ? MODELOS : MODELOS.filter((m) => ids.includes(m.id));
  alvos = escolhidos.map((m) => ({
    id: m.id,
    url: pathToFileURL(join(RAIZ, m.arquivo)).href,
    saida: paraThumbs || !saidaDireta
      ? join(RAIZ, 'assets', 'thumbs', `${m.id}.png`)
      : resolve(RAIZ, saidaDireta)
  }));
}

mkdirSync(join(RAIZ, 'assets', 'thumbs'), { recursive: true });
mkdirSync(PERFIL, { recursive: true });

/* ---------- sobe o Chrome ---------- */
const chrome = spawn(CHROME, [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--no-first-run',
  '--no-default-browser-check',
  '--disable-extensions',
  '--disable-sync',
  '--hide-scrollbars',
  '--force-device-scale-factor=1',
  '--remote-debugging-port=' + PORTA,
  '--user-data-dir=' + PERFIL,
  'about:blank'
], { stdio: 'ignore', windowsHide: true });

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

async function versao() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORTA}/json/version`);
      if (r.ok) return await r.json();
    } catch { /* ainda subindo */ }
    await esperar(250);
  }
  throw new Error('Chrome não abriu a porta de depuração');
}

const info = await versao();

/* ---------- cliente CDP mínimo ---------- */
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
      }, 45000);
    });
  }
  fechar() { this.ws.close(); }
}

async function novaAba() {
  const r = await fetch(`http://127.0.0.1:${PORTA}/json/new?about:blank`, { method: 'PUT' });
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

async function fecharAba(cdp) {
  cdp.fechar();
  try { await fetch(`http://127.0.0.1:${PORTA}/json/close/${cdp.abaId}`); } catch { /* ignora */ }
}

/* ---------- captura ---------- */
const MEDIDAS = `(() => {
  const vw = document.documentElement.clientWidth;
  /* Rolagem horizontal intencional (trilhos, abas, carrosséis) não é defeito:
     só conta como estouro o que não tem um ancestral rolável. */
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
    if (r.right > vw + 1.5 || r.left < -1.5) {
      const nome = el.tagName.toLowerCase() + (typeof el.className === 'string' && el.className
        ? '.' + el.className.trim().split(/\\s+/).slice(0, 2).join('.') : '');
      estouros.push(nome + ' → left ' + Math.round(r.left) + ', right ' + Math.round(r.right) + ' (vw ' + vw + ')');
    }
  });
  /* Alvos de toque: caixas de seleção e rádio contam pelo rótulo, não pelo quadradinho. */
  const alvosToque = [];
  document.querySelectorAll('a, button, select, summary, [role="button"]').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    if (el.classList.contains('pular')) return;
    if (r.height < 40 || r.width < 24) {
      const nome = el.tagName.toLowerCase() + (el.textContent ? ' "' + el.textContent.trim().slice(0, 22) + '"' : '');
      alvosToque.push(nome + ' → ' + Math.round(r.width) + 'x' + Math.round(r.height));
    }
  });
  return {
    janela: window.innerWidth,
    cliente: vw,
    documento: document.documentElement.scrollWidth,
    alturaDocumento: document.documentElement.scrollHeight,
    rolagemHorizontal: document.documentElement.scrollWidth > vw + 1,
    estouros: [...new Set(estouros)].slice(0, 20),
    alvosToque: [...new Set(alvosToque)].slice(0, 20),
    titulo: document.title,
    h1: (document.querySelector('h1') || {}).textContent?.trim().slice(0, 100) || '(sem h1)',
    imagensQuebradas: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src)
  };
})()`;

const relatorio = [];

for (const alvo of alvos) {
  const cdp = await novaAba();
  try {
    await cdp.enviar('Page.enable');
    await cdp.enviar('Runtime.enable');
    await cdp.enviar('Emulation.setDeviceMetricsOverride', {
      width: largura,
      height: altura,
      deviceScaleFactor: 1,
      mobile: largura < 700
    });
    /* Captura de página inteira com movimento reduzido: assim o que depende de
       animação de entrada já está no estado final e a imagem não mente. */
    if (paginaInteira) {
      await cdp.enviar('Emulation.setEmulatedMedia', {
        features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
      });
    }
    await cdp.enviar('Page.navigate', { url: alvo.url });
    await esperar(1400);

    /* Na captura de página inteira, percorre a página para assentar as revelações.
       Na captura do topo, não rola: a imagem tem que mostrar a dobra inicial. */
    if (paginaInteira) {
      await cdp.enviar('Runtime.evaluate', {
        expression: `(async () => {
          const passo = window.innerHeight * 0.8;
          for (let y = 0; y < document.documentElement.scrollHeight; y += passo) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 90));
          }
          window.scrollTo(0, 0);
          await new Promise((r) => setTimeout(r, 400));
        })()`,
        awaitPromise: true
      });
    } else {
      await cdp.enviar('Runtime.evaluate', { expression: 'window.scrollTo(0, 0)' });
      await esperar(500);
    }

    const medida = await cdp.enviar('Runtime.evaluate', { expression: MEDIDAS, returnByValue: true });
    const r = medida.result.value;
    relatorio.push({ id: alvo.id, ...r });

    /* --medir "sel1,sel2": largura computada de uma cadeia de seletores. */
    if (medir) {
      const sels = medir.split(',').map((s) => s.trim()).filter(Boolean);
      const det = await cdp.enviar('Runtime.evaluate', {
        expression: `(() => {
          const sels = ${JSON.stringify(sels)};
          return sels.map((s) => {
            const el = document.querySelector(s);
            if (!el) return { sel: s, erro: 'não encontrado' };
            const cs = getComputedStyle(el);
            const b = el.getBoundingClientRect();
            return { sel: s, left: Math.round(b.left), right: Math.round(b.right),
              largura: Math.round(b.width), altura: Math.round(b.height),
              width: cs.width, height: cs.height, minWidth: cs.minWidth, minHeight: cs.minHeight, maxWidth: cs.maxWidth,
              padding: cs.paddingLeft + '/' + cs.paddingRight, display: cs.display,
              alignItems: cs.alignItems, boxSizing: cs.boxSizing,
              flex: cs.flex, flexShrink: cs.flexShrink, flexBasis: cs.flexBasis, overflow: cs.overflow,
              posicao: cs.position, cols: cs.gridTemplateColumns, ovx: cs.overflowX };
          });
        })()`,
        returnByValue: true
      });
      console.log(`\n  --- ${alvo.id}: cadeia de largura ---`);
      det.result.value.forEach((i) => {
        if (i.erro) { console.log(`  ${i.sel} → ${i.erro}`); return; }
        console.log(
          `  ${i.sel}\n     left ${i.left} right ${i.right} ${i.largura}x${i.altura} | ` +
            `width:${i.width} minW:${i.minWidth} maxW:${i.maxWidth} | ` +
            `height:${i.height} minH:${i.minHeight} | pad ${i.padding} | ${i.display} / ${i.alignItems} / ${i.boxSizing} | ` +
            `flex ${i.flex} shrink ${i.flexShrink} basis ${i.flexBasis} | pos ${i.posicao} | ov ${i.overflow} | cols ${i.cols} | ovx ${i.ovx}`
        );
      });
    }

    /* Recorte: sempre na largura da viewport. Um trilho horizontal não deve
       alargar a imagem nem deixar faixa morta ao lado. */
    const alturaConteudo = Math.min(r.alturaDocumento, 20000);
    const shot = await cdp.enviar('Page.captureScreenshot', {
      format: 'png',
      fromSurface: true,
      optimizeForSpeed: false,
      clip: {
        x: 0,
        y: 0,
        width: largura,
        height: paginaInteira ? alturaConteudo : altura,
        scale: 1
      },
      captureBeyondViewport: paginaInteira
    });
    mkdirSync(dirname(alvo.saida), { recursive: true });
    writeFileSync(alvo.saida, Buffer.from(shot.data, 'base64'));
    const kb = Math.round(Buffer.from(shot.data, 'base64').length / 1024);
    console.log(`ok   ${alvo.id} @ ${largura}px${paginaInteira ? ' (página inteira)' : ''} → ${alvo.saida.replace(RAIZ + '\\', '')} (${kb} kB)`);
  } catch (e) {
    console.log(`ERRO ${alvo.id}: ${e.message}`);
  } finally {
    await fecharAba(cdp);
  }
}

/* ---------- relatório ---------- */
console.log('\n--- medidas ---');
for (const r of relatorio) {
  console.log(`\n${r.id} · ${r.titulo}`);
  console.log(`  viewport ${r.cliente} · documento ${r.documento}x${r.alturaDocumento} · rolagem lateral: ${r.rolagemHorizontal ? 'SIM ⚠' : 'não'}`);
  console.log(`  h1: ${r.h1}`);
  if (r.estouros?.length) {
    console.log(`  estourando a viewport (${r.estouros.length}):`);
    r.estouros.forEach((e) => console.log('    - ' + e));
  }
  if (r.alvosToque?.length) {
    console.log(`  alvos pequenos (${r.alvosToque.length}):`);
    r.alvosToque.forEach((e) => console.log('    - ' + e));
  }
  if (r.imagensQuebradas?.length) console.log(`  imagens quebradas: ${r.imagensQuebradas.join(', ')}`);
}

chrome.kill();
process.exit(0);




