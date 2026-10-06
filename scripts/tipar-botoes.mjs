/* ============================================================
   Acrescenta type="button" onde o markup traz <button> sem type.

   Dentro de <form> o padrão do HTML é submit. Hoje nenhum destes botões
   está em formulário, então não há bug — é risco latente se o markup mudar.
   O tipo explícito é a defesa barata.

   Aplica nos dois lados: a página do Next e o HTML estático, que é o baseline
   do teste de fidelidade.

   Uso: node scripts/tipar-botoes.mjs [--conferir]
   ============================================================ */

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const conferir = process.argv.includes('--conferir');

/**
 * Insere `type="button"` em toda tag <button ...> que não declare type.
 * Cuida de tag em várias linhas: mexe só na tag de abertura.
 */
function tipar(html) {
  let quantos = 0;
  const saida = html.replace(/<button\b([^>]*)>/g, (tag, atributos) => {
    if (/\btype\s*=/.test(atributos)) return tag;
    quantos++;
    return `<button type="button"${atributos}>`;
  });
  return { saida, quantos };
}

const alvos = [
  ...readdirSync(join(RAIZ, 'app', 'modelos'), { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => join(RAIZ, 'app', 'modelos', d.name, 'page.tsx')),
  join(RAIZ, 'app', '(catalogo)', 'page.tsx'),
  ...readdirSync(join(RAIZ, 'modelos'), { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => join(RAIZ, 'modelos', d.name, 'index.html'))
].filter(existsSync);

let total = 0;
let arquivos = 0;

for (const arquivo of alvos) {
  const atual = readFileSync(arquivo, 'utf8');
  const { saida, quantos } = tipar(atual);
  const rel = arquivo.replace(RAIZ + '\\', '');

  if (conferir) {
    if (quantos > 0) {
      console.log(`  ${quantos} sem type · ${rel}`);
      total += quantos;
    }
    continue;
  }

  if (quantos > 0) {
    writeFileSync(arquivo, saida, 'utf8');
    console.log(`  ${quantos} botão(ões) tipado(s) · ${rel}`);
    total += quantos;
    arquivos++;
  }
}

if (conferir) {
  console.log(total ? `\n${total} botão(ões) sem type` : '\ntodos os botões têm type');
  process.exit(total ? 1 : 0);
}

console.log(`\n${total} botão(ões) em ${arquivos} arquivo(s)`);
