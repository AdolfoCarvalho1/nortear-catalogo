/* ============================================================
   Diagnóstico do catálogo: o que existe no DOM renderizado e por
   que um elemento pode estar invisível.
   Uso: node scripts/diagnosticar.mjs [arquivo] [largura]
   ============================================================ */

import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PERFIL = join(RAIZ, '.chrome-perfil');
mkdirSync(PERFIL, { recursive: true });

const CHROME = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
].find(existsSync);

const arquivo = process.argv[2] || 'index.html';
const largura = Number(process.argv[3]) || 1440;

const origem = resolve(RAIZ, arquivo);
const temp = join(dirname(origem), '__diag.html');

const sonda = `
<script>
window.addEventListener('load', function () {
  setTimeout(function () {
    var alvos = ['.modelo', '#grade > li', '#tabela-corpo tr', '#pacotes article', '#perguntas details', '#processo-lista article', '.revelar'];
    var out = {};
    alvos.forEach(function (s) {
      var els = document.querySelectorAll(s);
      var visiveis = 0, invisiveis = [];
      els.forEach(function (el) {
        var cs = getComputedStyle(el);
        var r = el.getBoundingClientRect();
        var op = parseFloat(cs.opacity);
        if (op > 0.9 && r.height > 0) visiveis++;
        else invisiveis.push({
          cls: (typeof el.className === 'string' ? el.className : ''),
          opacity: cs.opacity, h: Math.round(r.height), w: Math.round(r.width),
          display: cs.display, visibility: cs.visibility
        });
      });
      out[s] = { total: els.length, visiveis: visiveis, invisiveis: invisiveis.slice(0, 4) };
    });
    out._html = {
      gradeFilhos: (document.querySelector('#grade') || {}).children ? document.querySelector('#grade').children.length : -1,
      linhasTabela: (document.querySelector('#tabela-corpo') || {}).children ? document.querySelector('#tabela-corpo').children.length : -1,
      pacotes: (document.querySelector('#pacotes') || {}).children ? document.querySelector('#pacotes').children.length : -1,
      perguntas: (document.querySelector('#perguntas') || {}).children ? document.querySelector('#perguntas').children.length : -1
    };
    var pre = document.createElement('pre');
    pre.textContent = 'DIAG_JSON:' + JSON.stringify(out);
    document.body.appendChild(pre);
  }, 1500);
});
<\/script>`;

/* A sonda entra DEPOIS do último </script>, nunca no meio: um <script> colado
   antes de </body> cai dentro de um <script type="module"> aberto e quebra o
   parse do módulo inteiro — foi o que fez o catálogo parecer vazio. */
const html = readFileSync(origem, 'utf8');
const pos = html.lastIndexOf('</body>');
const corte = html.lastIndexOf('</script>', pos);
const ponto = corte >= 0 && corte < pos ? corte + '</script>'.length : pos;
const comSonda = html.slice(0, ponto) + '\n' + sonda + '\n' + html.slice(ponto);
writeFileSync(temp, comSonda, 'utf8');

const dom = await new Promise((ok) => {
  const p = spawn(CHROME, [
    '--headless=new', '--disable-gpu', '--no-sandbox',
    `--window-size=${largura},900`, '--force-device-scale-factor=1',
    '--virtual-time-budget=6000', '--no-first-run', '--no-default-browser-check',
    '--user-data-dir=' + PERFIL, '--dump-dom', pathToFileURL(temp).href
  ], { stdio: ['ignore', 'pipe', 'ignore'], windowsHide: true });
  let s = '';
  p.stdout.on('data', (d) => { s += d.toString(); });
  const t = setTimeout(() => p.kill(), 60000);
  p.on('exit', () => { clearTimeout(t); ok(s); });
});

unlinkSync(temp);

const m = dom.match(/DIAG_JSON:(\{.*?\})<\/pre>/s);
if (!m) { console.log('sonda não respondeu; tamanho do DOM:', dom.length); process.exit(1); }
const r = JSON.parse(m[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'));

console.log(`arquivo: ${arquivo} @ ${largura}px`);
console.log('contagens:', JSON.stringify(r._html));
console.log('');
Object.entries(r).filter(([k]) => k !== '_html').forEach(([sel, v]) => {
  console.log(`${sel} → ${v.total} no DOM, ${v.visiveis} visíveis`);
  v.invisiveis.forEach((i) => console.log(`    invisível: .${i.cls} opacity ${i.opacity} ${i.w}x${i.h} display ${i.display}`));
});
