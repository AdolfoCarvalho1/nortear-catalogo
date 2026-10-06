/* ============================================================
   Gera a página de um modelo já convertido.

   Uso: node scripts/gerar-pagina.mjs <pasta> <Componente> [<ArquivoInteracoes>]
   Ex.: node scripts/gerar-pagina.mjs 01-saas-ia PaginaCopiloto Interacoes

   Lê .migracao/<pasta>/corpo.jsx.txt (produzido por extrair-modelo.mjs) e
   escreve app/modelos/<slug>/page.tsx.
   ============================================================ */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const [pasta, componente, arquivoInteracoes] = process.argv.slice(2);

if (!pasta || !componente) {
  console.error('Uso: node scripts/gerar-pagina.mjs <pasta> <Componente> [<ArquivoInteracoes>]');
  process.exit(1);
}

const fonte = join(RAIZ, '.migracao', pasta, 'corpo.jsx.txt');
if (!existsSync(fonte)) {
  console.error('Não encontrei', fonte, '— rode extrair-modelo.mjs primeiro.');
  process.exit(1);
}

const { MODELOS } = await import('../app/data/catalogo.ts').catch(() => ({ MODELOS: null }));
const jsx = readFileSync(fonte, 'utf8').trimEnd();

/* O rodapé de cada modelo volta para o catálogo. No estático o link era
   `../index.html`; no Next o catálogo é a rota `/`. A troca é feita aqui, e não
   no arquivo estático, porque aquele continua sendo o baseline do teste de
   fidelidade — mudar o href lá também funcionaria, mas o baseline deve
   permanecer intocado. */
const jsxAjustado = jsx.replace(/href="\.\.\/index\.html"/g, 'href="/"');

const linhas = jsxAjustado.split(/\r?\n/).map((l) => (l.trim() ? '      ' + l : ''));

const cabeca = `${arquivoInteracoes ? `import ${arquivoInteracoes} from './${arquivoInteracoes}';\n` : ''}
/**
 * ${pasta} — markup convertido do modelo estático.
 *
 * As classes e a estrutura são as originais: o desenho não mudou na migração
 * para Next. O CSS do modelo é importado no layout da rota.
 */
export default function ${componente}() {
  return (
    <>
${arquivoInteracoes ? `      <${arquivoInteracoes} />` : ''}`;

const pe = `    </>
  );
}
`;

const destinoDir = join(RAIZ, 'app', 'modelos', pasta.replace(/^\d+-/, ''));
mkdirSync(destinoDir, { recursive: true });
const destino = join(destinoDir, 'page.tsx');
writeFileSync(destino, `${cabeca}\n${linhas.join('\n')}\n${pe}`, 'utf8');

const kB = Math.round(readFileSync(destino).length / 1024);
console.log(`${destino.replace(RAIZ + '\\', '')} — ${kB} kB, ${linhas.length} linhas`);
