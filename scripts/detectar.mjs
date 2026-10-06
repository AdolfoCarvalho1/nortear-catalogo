/* ============================================================
   Detector de anti-padrões do Impeccable, por modelo.
   Uso:  node scripts/detectar.mjs [pasta-ou-id ...]
   Sem argumentos: roda nos 10 modelos.

   Obs.: spawnSync com shell:true engolia o stdout do .cmd. Aqui a
   chamada é feita por cmd.exe /c com redirecionamento de saída.
   ============================================================ */

import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CLI = 'C:\\Users\\adolf\\.claude\\skills\\impeccable\\scripts\\impeccable.cmd';
const DIR_MODELOS = join(RAIZ, 'modelos');

if (!existsSync(CLI)) {
  console.error('CLI do Impeccable não encontrado em', CLI);
  process.exit(1);
}

const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const comoJson = process.argv.includes('--json');

const pastas = args.length
  ? args.map((a) => (a.includes('\\') || a.includes('/') ? resolve(a) : join(DIR_MODELOS, a)))
  : readdirSync(DIR_MODELOS, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => join(DIR_MODELOS, d.name));

const resumo = [];

for (const pasta of pastas) {
  if (!existsSync(pasta)) { console.log(`-- ${pasta}: não existe`); continue; }
  const nome = pasta.split(/[\\/]/).pop();

  const r = spawnSync(CLI, ['detect', '--json', pasta], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    windowsHide: true,
    shell: true
  });

  const bruto = ((r.stdout || '') + (r.stderr || '')).trim();

  if (!bruto) {
    console.log(`\n===== ${nome} =====\n(sem saída — código ${r.status})`);
    resumo.push({ modelo: nome, achados: null });
    continue;
  }

  /* Tenta ler o JSON do detector. */
  let dados = null;
  const inicio = bruto.indexOf('{');
  const fim = bruto.lastIndexOf('}');
  if (inicio >= 0 && fim > inicio) {
    try { dados = JSON.parse(bruto.slice(inicio, fim + 1)); } catch { /* não é JSON */ }
  }

  if (!dados) {
    console.log(`\n===== ${nome} =====`);
    console.log(bruto.split(/\r?\n/).slice(0, 40).join('\n'));
    resumo.push({ modelo: nome, achados: null });
    continue;
  }

  /* Normaliza o formato: { findings: [...] } ou { files: [{ findings: [...] }] } */
  let achados = [];
  if (Array.isArray(dados.findings)) achados = dados.findings;
  else if (Array.isArray(dados.files)) achados = dados.files.flatMap((f) => (f.findings || []).map((x) => ({ ...x, file: f.path || f.file })));
  else if (Array.isArray(dados)) achados = dados;
  else if (dados.results) achados = Array.isArray(dados.results) ? dados.results : [];

  const porRegra = {};
  achados.forEach((a) => {
    const regra = a.rule || a.id || a.code || a.type || 'desconhecida';
    porRegra[regra] = (porRegra[regra] || 0) + 1;
  });

  console.log(`\n===== ${nome} ===== ${achados.length} achado(s)`);
  Object.entries(porRegra)
    .sort((a, b) => b[1] - a[1])
    .forEach(([regra, n]) => console.log(`  ${String(n).padStart(3)}  ${regra}`));

  const amostra = achados.slice(0, 6).map((a) => {
    const msg = a.message || a.detail || a.note || '';
    const loc = a.line ? `:${a.line}` : '';
    return `      ${(a.file || '').split(/[\\/]/).pop()}${loc} — ${String(msg).slice(0, 130)}`;
  });
  amostra.forEach((l) => console.log(l));

  if (comoJson) console.log(JSON.stringify(achados, null, 2));

  resumo.push({ modelo: nome, achados: achados.length, porRegra });
}

console.log('\n--- resumo ---');
resumo.forEach((r) => console.log(`${r.modelo.padEnd(18)} ${r.achados === null ? 'sem leitura' : r.achados + ' achado(s)'}`));
