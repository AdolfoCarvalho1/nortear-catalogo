/* Lista o texto real dos elementos que o CSS deixa em caixa alta,
   para achar os rótulos longos demais. Uso: node scripts/caixa-alta.mjs <pasta> */
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pasta = process.argv[2] || 'modelos/06-clinica';
const css = readFileSync(join(RAIZ, pasta, 'estilo.css'), 'utf8');
const html = readFileSync(join(RAIZ, pasta, 'index.html'), 'utf8');

/* Seletores que recebem text-transform: uppercase */
const seletores = [];
const blocos = css.match(/[^{}]+\{[^}]*\}/g) || [];
blocos.forEach((b) => {
  if (!/text-transform:\s*uppercase/.test(b)) return;
  const sel = b.split('{')[0].trim();
  sel.split(',').forEach((s) => {
    const t = s.trim();
    if (t && !t.startsWith('@') && !t.includes(':')) seletores.push(t.replace(/^\./, ''));
  });
});

const unicos = [...new Set(seletores)];
console.log('classes em caixa alta:', unicos.length);

/* Para cada classe, pega o conteúdo dos elementos no HTML */
const longos = [];
unicos.forEach((classe) => {
  const re = new RegExp(`class="[^"]*\\b${classe.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b[^"]*"[^>]*>([^<]{25,120})<`, 'g');
  let m;
  while ((m = re.exec(html))) {
    const texto = m[1].replace(/\s+/g, ' ').trim();
    if (texto.length >= 30) longos.push({ classe, chars: texto.length, texto: texto.slice(0, 80) });
  }
});

longos.sort((a, b) => b.chars - a.chars);
console.log(`\ntrechos com 30+ caracteres em caixa alta: ${longos.length}`);
longos.slice(0, 20).forEach((l) => console.log(`  ${String(l.chars).padStart(3)}  .${l.classe.padEnd(22)} ${l.texto}`));
