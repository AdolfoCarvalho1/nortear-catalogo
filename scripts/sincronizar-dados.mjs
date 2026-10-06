/* ============================================================
   Sincroniza a fonte de dados tipada (app/data/catalogo.ts) para a
   cópia CommonJS que os scripts de captura leem (assets/modelos-data.js).

   Existe porque os scripts de Chrome headless rodam fora do bundler e não
   leem TypeScript. Assim a verdade fica em um arquivo só: mude o .ts, rode
   este script, e as duas cópias voltam a bater.

   Uso: node scripts/sincronizar-dados.mjs [--conferir]
        --conferir  não escreve; só diz se estão iguais (útil em CI)
   ============================================================ */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const FONTE = join(RAIZ, 'app', 'data', 'catalogo.ts');
const DESTINO = join(RAIZ, 'assets', 'modelos-data.js');
const conferir = process.argv.includes('--conferir');

/* O Node 22 lê TypeScript com type stripping nativo. */
const { AGENCIA, PACOTES, MANUTENCAO, MODELOS, PROCESSO, PERGUNTAS, brl } = await import(
  pathToFileURL(FONTE).href
);

/* As chaves saem na ordem do tipo, para o diff ficar legível. */
function ordenar(obj, chaves) {
  const saida = {};
  chaves.forEach((k) => {
    if (obj[k] !== undefined) saida[k] = obj[k];
  });
  Object.keys(obj).forEach((k) => {
    if (saida[k] === undefined) saida[k] = obj[k];
  });
  return saida;
}

const CHAVES_MODELO = [
  'id', 'numero', 'nome', 'nicho', 'cliente', 'promessa', 'arquivo', 'rota',
  'preco', 'pacote', 'paleta', 'tipografia', 'mundo', 'destaque', 'secoes', 'melhorPara'
];

/* JSON não serializa função, então o corpo é montado em duas partes:
   os dados em JSON e o `brl` como fonte literal, pendurado antes do fim. */
const dados = JSON.stringify(
  {
    AGENCIA,
    PACOTES,
    MANUTENCAO,
    MODELOS: MODELOS.map((m) => ordenar(m, CHAVES_MODELO)),
    PROCESSO,
    PERGUNTAS
  },
  null,
  2
);

const fimDoObjeto = dados.lastIndexOf('}');
const corpo = `${dados.slice(0, fimDoObjeto).trimEnd()},

    /* Formata em real brasileiro, sem centavos. Vem como fonte porque JSON
       não carrega função — é a mesma implementação de app/data/catalogo.ts. */
    brl: ${brl.toString()}
  }`;

const arquivo = `/* ============================================================
   GERADO AUTOMATICAMENTE — não edite este arquivo.

   A fonte é app/data/catalogo.ts. Depois de mudar lá, rode:
       node scripts/sincronizar-dados.mjs

   Este arquivo existe em CommonJS porque os scripts de captura (Chrome
   headless) rodam fora do bundler e não leem TypeScript.
   ============================================================ */
(function (raiz, fabrica) {
  var api = fabrica();
  raiz.CATALOGO = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  return ${corpo};
});
`;

if (conferir) {
  const atual = readFileSync(DESTINO, 'utf8');
  const igual = atual.trim() === arquivo.trim();
  console.log(igual ? 'ok — as duas cópias estão iguais' : 'DIVERGENTE — rode sem --conferir para sincronizar');
  process.exit(igual ? 0 : 1);
}

writeFileSync(DESTINO, arquivo, 'utf8');
console.log('sincronizado: app/data/catalogo.ts → assets/modelos-data.js');
console.log(`  ${MODELOS.length} modelos · ${PACOTES.length} pacotes · ${PERGUNTAS.length} perguntas`);
