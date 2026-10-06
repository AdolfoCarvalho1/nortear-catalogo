/* ============================================================
   Fidelidade da migração por PIXEL.

   Captura a mesma página nas duas versões (estática e Next), na mesma
   viewport, e compara os PNGs byte a byte. Se o desenho mudou, a imagem
   muda — é o teste mais honesto que existe para uma migração.

   Uso:
     node scripts/fidelidade.mjs                 (todos os modelos migrados)
     node scripts/fidelidade.mjs saas-ia
     node scripts/fidelidade.mjs --largura 390
   ============================================================ */

import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
/* Perfil e porta por processo: vários agentes capturando ao mesmo tempo no
   mesmo perfil do Chrome derrubam o navegador e geram timeout intermitente. */
const PERFIL = join(RAIZ, '.chrome-perfil', String(process.pid));
const SAIDA = join(RAIZ, '.impeccable', 'fidelidade');
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
const altura = Number(pegar('altura', 900));
const ids = argv.filter((a) => !a.startsWith('--') && !/^\d+$/.test(a));

const { MODELOS } = createRequire(import.meta.url)(join(RAIZ, 'assets', 'modelos-data.js'));
const alvos = ids.length ? MODELOS.filter((m) => ids.includes(m.id)) : MODELOS;

/* Só compara o que já tem rota no Next. */
const migrados = alvos.filter((m) => existsSync(join(RAIZ, 'app', 'modelos', m.id, 'page.tsx')));
const pendentes = alvos.filter((m) => !migrados.includes(m));

mkdirSync(PERFIL, { recursive: true });
rmSync(SAIDA, { recursive: true, force: true });
mkdirSync(SAIDA, { recursive: true });

const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--no-sandbox', '--no-first-run',
  '--no-default-browser-check', '--disable-extensions', '--disable-sync',
  '--hide-scrollbars', '--force-device-scale-factor=1',
  '--remote-debugging-port=' + PORTA_CDP,
  '--user-data-dir=' + PERFIL,
  'about:blank'
], { stdio: 'ignore', windowsHide: true });

let processoChrome = chrome;

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

async function vivo() {
  try {
    const r = await fetch(`http://127.0.0.1:${PORTA_CDP}/json/version`);
    return r.ok;
  } catch {
    return false;
  }
}

async function subir() {
  for (let i = 0; i < 60; i++) {
    if (await vivo()) return;
    await esperar(250);
  }
  throw new Error('Chrome não abriu a porta de depuração');
}

/**
 * Garante que o Chrome está de pé antes de cada modelo.
 *
 * Rodando vários agentes em paralelo, o Chrome headless às vezes morre no meio
 * da varredura (memória). Sem isto, a execução inteira cai e perde o trabalho
 * já feito — melhor reiniciar e seguir.
 */
async function garantirChrome() {
  if (await vivo()) return;
  console.log('   (Chrome caiu — reiniciando)');
  try {
    processoChrome.kill();
  } catch {
    /* já morto */
  }
  await esperar(800);
  processoChrome = spawn(CHROME, [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--no-first-run',
    '--no-default-browser-check', '--disable-extensions', '--disable-sync',
    '--hide-scrollbars', '--force-device-scale-factor=1',
    '--remote-debugging-port=' + PORTA_CDP,
    '--user-data-dir=' + PERFIL,
    'about:blank'
  ], { stdio: 'ignore', windowsHide: true });
  await subir();
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
      }, 60000);
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

/**
 * Captura uma página sempre do mesmo jeito:
 *  - viewport fixa, escala 1
 *  - movimento reduzido (o que depende de animação já está no estado final)
 *  - sem rolar: a imagem é a primeira dobra, o que elimina a variação do
 *    conteúdo animado que fica abaixo dela
 */
async function capturar(cdp, url, destino) {
  await cdp.enviar('Page.enable');
  await cdp.enviar('Runtime.enable');
  await cdp.enviar('Emulation.setDeviceMetricsOverride', {
    width: largura,
    height: altura,
    deviceScaleFactor: 1,
    mobile: largura < 700
  });
  await cdp.enviar('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
  });
  await cdp.enviar('Page.navigate', { url });
  await esperar(2200);
  await cdp.enviar('Runtime.evaluate', { expression: 'window.scrollTo(0, 0)' });
  await esperar(600);
  const shot = await cdp.enviar('Page.captureScreenshot', {
    format: 'png',
    fromSurface: true,
    clip: { x: 0, y: 0, width: largura, height: altura, scale: 1 }
  });
  const buf = Buffer.from(shot.data, 'base64');
  writeFileSync(destino, buf);
  return createHash('sha256').update(buf).digest('hex').slice(0, 16);
}

await subir();

const resultado = [];

for (const m of migrados) {
  await garantirChrome();
  const cdpA = await novaAba();
  const cdpB = await novaAba();
  const cdpC = await novaAba();
  try {
    const urlEstatico = pathToFileURL(join(RAIZ, m.arquivo)).href;

    /* Controle: a mesma página estática capturada duas vezes. Se estas duas
       imagens já diferirem, a página tem conteúdo dinâmico (relógio, texto
       sendo escrito, animação de entrada) e a comparação com o Next precisa
       ser lida com essa folga — não é a migração que mudou o desenho. */
    const controleA = await capturar(cdpA, urlEstatico, join(SAIDA, `${m.id}-controle-a.png`));
    const controleB = await capturar(cdpB, urlEstatico, join(SAIDA, `${m.id}-controle-b.png`));
    const estatico = await capturar(cdpC, urlEstatico, join(SAIDA, `${m.id}-estatico.png`));

    const cdpD = await novaAba();
    let next;
    try {
      next = await capturar(cdpD, `${BASE}${m.rota}`, join(SAIDA, `${m.id}-next.png`));
    } finally {
      cdpD.fechar();
      await fetch(`http://127.0.0.1:${PORTA_CDP}/json/close/${cdpD.abaId}`).catch(() => {});
    }

    const ruido = controleA !== controleB;
    const igual = estatico === next;
    resultado.push({ id: m.id, igual, ruido, estatico, next, controleA, controleB });

    const veredito = igual ? 'IDÊNTICO' : ruido ? 'difere (página tem ruído)' : 'DIFERE ⚠';
    console.log(
      `${veredito.padEnd(26)} ${m.id.padEnd(14)} estático ${estatico} · next ${next}` +
        (ruido ? ` · controle ${controleA}×${controleB} (instável)` : ' · controle estável')
    );
  } catch (e) {
    console.log(`ERRO ${m.id}: ${e.message}`);
    resultado.push({ id: m.id, igual: false, erro: e.message });
  } finally {
    for (const c of [cdpA, cdpB, cdpC]) {
      c.fechar();
      await fetch(`http://127.0.0.1:${PORTA_CDP}/json/close/${c.abaId}`).catch(() => {});
    }
  }
}

const identicos = resultado.filter((r) => r.igual).length;
const instaveis = resultado.filter((r) => r.ruido && !r.igual).length;
const problemas = resultado.filter((r) => !r.igual && !r.ruido).length;

console.log(`\n${identicos}/${migrados.length} com captura idêntica em ${largura}x${altura}`);
if (instaveis) {
  console.log(`${instaveis} com diferença atribuível a conteúdo dinâmico (o controle também variou) — confira a geometria`);
}
if (problemas) console.log(`${problemas} com diferença REAL — investigar`);
if (pendentes.length) console.log(`ainda não migrados: ${pendentes.map((m) => m.id).join(', ')}`);
console.log('imagens em .impeccable/fidelidade/ — compare os pares lado a lado');

processoChrome.kill();
process.exit(problemas ? 1 : 0);


