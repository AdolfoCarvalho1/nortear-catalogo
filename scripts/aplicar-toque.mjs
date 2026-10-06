/* ============================================================
   Aplica o piso de área de toque no estilo.css de cada modelo.

   O bloco fica embutido no arquivo de cada modelo, entre marcadores, para o
   CSS continuar autossuficiente (o Next importa o estilo.css direto, e a
   versão estática também). A fonte do bloco é assets/toque.css: mude lá e
   rode este script para propagar aos dez.

   Uso: node scripts/aplicar-toque.mjs [--conferir]
   ============================================================ */

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const FONTE = join(RAIZ, 'assets', 'toque.css');
const DIR = join(RAIZ, 'modelos');

const INICIO = '/* >>> piso de área de toque (gerado de assets/toque.css) >>> */';
const FIM = '/* <<< piso de área de toque <<< */';

const conferir = process.argv.includes('--conferir');

/* A fonte tem um comentário de cabeçalho; o que entra no modelo é só o bloco
   @media, com uma linha explicando de onde veio. */
const fonte = readFileSync(FONTE, 'utf8');
const blocoMedia = fonte.slice(fonte.indexOf('@media'));

const trecho = `${INICIO}
/* Em telas pequenas, todo alvo interativo tem 44px de altura. Gerado de
   assets/toque.css por scripts/aplicar-toque.mjs — não edite aqui. */
${blocoMedia.trimEnd()}
${FIM}
`;

let alterados = 0;
let divergentes = 0;

for (const pasta of readdirSync(DIR, { withFileTypes: true }).filter((d) => d.isDirectory())) {
  const arquivo = join(DIR, pasta.name, 'estilo.css');
  if (!existsSync(arquivo)) continue;

  const atual = readFileSync(arquivo, 'utf8');
  const i = atual.indexOf(INICIO);
  const f = atual.indexOf(FIM);

  let novo;
  if (i >= 0 && f > i) {
    novo = atual.slice(0, i) + trecho + atual.slice(f + FIM.length + 1);
  } else {
    novo = atual.trimEnd() + '\n\n' + trecho;
  }

  if (conferir) {
    if (novo.trim() !== atual.trim()) {
      divergentes++;
      console.log(`DIVERGENTE ${pasta.name}`);
    }
    continue;
  }

  if (novo !== atual) {
    writeFileSync(arquivo, novo, 'utf8');
    alterados++;
    console.log(`ok ${pasta.name}`);
  }
}

if (conferir) {
  console.log(divergentes ? `${divergentes} modelo(s) fora de sincronia` : 'todos em sincronia');
  process.exit(divergentes ? 1 : 0);
}

console.log(`\n${alterados} estilo.css atualizado(s)`);
