/* ============================================================
   Mede a largura computada de uma cadeia de seletores, para achar
   de onde vem um estouro de layout.
   Uso: node scripts/medir.mjs <id-do-modelo> <largura> <seletor> [seletor...]
   ============================================================ */

import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PERFIL = join(RAIZ, '.chrome-perfil');
mkdirSync(PERFIL, { recursive: true });

const CHROME = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
].find(existsSync);

const { MODELOS } = createRequire(import.meta.url)(join(RAIZ, 'assets', 'modelos-data.js'));

const [id, larguraArg, ...seletores] = process.argv.slice(2);
const largura = Number(larguraArg) || 390;
const modelo = MODELOS.find((m) => m.id === id);
if (!modelo) { console.error('modelo não encontrado:', id); process.exit(1); }

const origem = join(RAIZ, modelo.arquivo);
const temp = origem.replace(/index\.html$/, '__medir.html');

const sonda = `
<script>
window.addEventListener('load', function () {
  setTimeout(function () {
    var sels = ${JSON.stringify(seletores)};
    var out = [];
    sels.forEach(function (s) {
      var el = document.querySelector(s);
      if (!el) { out.push({ sel: s, erro: 'não encontrado' }); return; }
      var cs = getComputedStyle(el);
      var r = el.getBoundingClientRect();
      out.push({
        sel: s,
        left: Math.round(r.left), right: Math.round(r.right), largura: Math.round(r.width),
        minWidth: cs.minWidth, width: cs.width, maxWidth: cs.maxWidth,
        padding: cs.paddingLeft + ' / ' + cs.paddingRight,
        display: cs.display, gridCols: cs.gridTemplateColumns, overflowX: cs.overflowX
      });
    });
    var pre = document.createElement('pre');
    pre.textContent = 'MEDIR_JSON:' + JSON.stringify({ vw: document.documentElement.clientWidth, doc: document.documentElement.scrollWidth, itens: out });
    document.body.appendChild(pre);
  }, 800);
});
<\/script>`;

writeFileSync(temp, readFileSync(origem, 'utf8').replace('</body>', sonda + '\n</body>'), 'utf8');

const dom = await new Promise((ok) => {
  const p = spawn(CHROME, [
    '--headless=new', '--disable-gpu', '--no-sandbox',
    '--force-device-scale-factor=1',
    '--virtual-time-budget=5000', '--no-first-run', '--no-default-browser-check',
    '--user-data-dir=' + PERFIL, '--dump-dom', pathToFileURL(temp).href
  ], { stdio: ['ignore', 'pipe', 'ignore'], windowsHide: true });
  let s = '';
  p.stdout.on('data', (d) => { s += d.toString(); });
  const t = setTimeout(() => p.kill(), 60000);
  p.on('exit', () => { clearTimeout(t); ok(s); });
});

unlinkSync(temp);

const m = dom.match(/MEDIR_JSON:(\{.*?\})<\/pre>/s);
if (!m) { console.log('sem leitura da sonda'); process.exit(1); }
const r = JSON.parse(m[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'));

console.log(`viewport ${r.vw} · documento ${r.doc}`);
r.itens.forEach((i) => {
  if (i.erro) { console.log(`${i.sel} → ${i.erro}`); return; }
  console.log(`${i.sel}`);
  console.log(`   left ${i.left} right ${i.right} largura ${i.largura} | width:${i.width} min:${i.minWidth} max:${i.maxWidth}`);
  console.log(`   padding ${i.padding} | display ${i.display} | colunas ${i.gridCols} | overflowX ${i.overflowX}`);
});


