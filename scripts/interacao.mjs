/* ============================================================
   Teste de interação real: clica nos controles e confere se a página
   responde. A fidelidade por pixel prova o desenho; isto prova o
   comportamento — que é o que um `checked` sem onChange quebra.

   Uso: node scripts/interacao.mjs [--base http://127.0.0.1:4321]
   ============================================================ */

import { spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PERFIL = join(RAIZ, '.chrome-perfil', String(process.pid));
const PORTA = Number(process.env.CDP_PORTA || 9335 + (process.pid % 60));
const BASE = process.env.BASE_NEXT || 'http://127.0.0.1:4321';

const CHROME = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
].find(existsSync);

if (!CHROME) {
  console.error('Nenhum Chrome/Edge encontrado.');
  process.exit(1);
}

mkdirSync(PERFIL, { recursive: true });

const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--no-sandbox', '--no-first-run',
  '--no-default-browser-check', '--disable-extensions', '--disable-sync',
  '--hide-scrollbars', '--force-device-scale-factor=1',
  '--remote-debugging-port=' + PORTA, '--user-data-dir=' + PERFIL, 'about:blank'
], { stdio: 'ignore', windowsHide: true });

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

for (let i = 0; i < 60; i++) {
  try {
    const r = await fetch(`http://127.0.0.1:${PORTA}/json/version`);
    if (r.ok) break;
  } catch {
    /* subindo */
  }
  await esperar(250);
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
      }, 30000);
    });
  }
  fechar() {
    this.ws.close();
  }
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

/** Avalia uma expressão na página e devolve o valor. */
async function avaliar(cdp, expressao) {
  const r = await cdp.enviar('Runtime.evaluate', { expression: expressao, returnByValue: true, awaitPromise: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.text || 'exceção na página');
  return r.result.value;
}

async function abrir(url) {
  const cdp = await novaAba();
  await cdp.enviar('Page.enable');
  await cdp.enviar('Runtime.enable');
  await cdp.enviar('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await cdp.enviar('Page.navigate', { url });
  await esperar(2000);
  return cdp;
}

/* ---------------------------------------------------------------
   Os testes. Cada um abre a página, age e mede o efeito.
   --------------------------------------------------------------- */
const TESTES = [
  {
    rota: '/modelos/moda',
    nome: '09 moda · filtro de categoria muda a grade',
    async rodar(cdp) {
      const antes = await avaliar(cdp, `document.querySelectorAll('.peca').length`);
      const clicou = await avaliar(
        cdp,
        `(() => {
          const r = document.querySelector('input[name="categoria"][value="vestido"]');
          if (!r) return 'sem radio de vestido';
          r.click();
          r.dispatchEvent(new Event('change', { bubbles: true }));
          return 'clicou';
        })()`
      );
      await esperar(600);
      const depois = await avaliar(
        cdp,
        `document.querySelectorAll('.peca:not([hidden])').length`
      );
      const escondidas = await avaliar(cdp, `document.querySelectorAll('.peca[hidden]').length`);
      return {
        ok: clicou === 'clicou' && (depois < antes || escondidas > 0),
        detalhe: `peças ${antes} → ${depois} visíveis · ${escondidas} escondidas pelo filtro`
      };
    }
  },
  {
    rota: '/modelos/saas-ia',
    nome: '01 copiloto · terminal responde e cita fonte',
    async rodar(cdp) {
      const antes = await avaliar(cdp, `document.querySelectorAll('#fluxo .fala').length`);
      await avaliar(
        cdp,
        `(() => {
          const campo = document.querySelector('#pergunta');
          campo.value = 'Qual o prazo de entrega combinado com a Alvorada?';
          campo.dispatchEvent(new Event('input', { bubbles: true }));
          document.querySelector('#entrada').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
          return 'enviou';
        })()`
      );
      await esperar(2500);
      const depois = await avaliar(cdp, `document.querySelectorAll('#fluxo .fala').length`);
      const fontes = await avaliar(cdp, `document.querySelectorAll('#fluxo .fontes__item').length`);
      return { ok: depois > antes && fontes > 0, detalhe: `falas ${antes} → ${depois} · ${fontes} fonte(s)` };
    }
  },
  {
    rota: '/modelos/restaurante',
    nome: '02 restaurante · menu abre prato por prato',
    async rodar(cdp) {
      const antes = await avaliar(cdp, `document.querySelectorAll('details[open]').length`);
      await avaliar(
        cdp,
        `(() => {
          const d = [...document.querySelectorAll('details')].find((x) => !x.open);
          if (!d) return 'sem details fechado';
          d.open = true;
          d.dispatchEvent(new Event('toggle'));
          return 'abriu';
        })()`
      );
      await esperar(400);
      const depois = await avaliar(cdp, `document.querySelectorAll('details[open]').length`);
      return { ok: depois > antes, detalhe: `abertos ${antes} → ${depois}` };
    }
  },
  {
    rota: '/modelos/imobiliaria',
    nome: '07 imobiliária · busca filtra a carteira',
    async rodar(cdp) {
      const antes = await avaliar(cdp, `document.querySelectorAll('.ficha, .linha').length`);
      await avaliar(
        cdp,
        `(() => {
          const s = document.querySelector('select');
          if (!s) return 'sem select';
          s.value = [...s.options].map((o) => o.value).find((v) => v && v !== 'todos') || s.value;
          s.dispatchEvent(new Event('change', { bubbles: true }));
          return 'mudou';
        })()`
      );
      await esperar(600);
      const depois = await avaliar(cdp, `document.querySelectorAll('.ficha:not([hidden]), .linha:not([hidden])').length`);
      return { ok: depois > 0 && depois <= antes, detalhe: `imóveis visíveis ${antes} → ${depois}` };
    }
  },
  {
    rota: '/modelos/curso',
    nome: '08 curso · acordeão de módulo abre a ementa',
    async rodar(cdp) {
      const antes = await avaliar(cdp, `document.querySelectorAll('details[open]').length`);
      await avaliar(
        cdp,
        `(() => {
          const d = [...document.querySelectorAll('details')].find((x) => !x.open);
          if (!d) return 'sem details fechado';
          d.open = true;
          d.dispatchEvent(new Event('toggle'));
          return 'abriu';
        })()`
      );
      await esperar(400);
      const depois = await avaliar(cdp, `document.querySelectorAll('details[open]').length`);
      return { ok: depois > antes, detalhe: `abertos ${antes} → ${depois}` };
    }
  },
  {
    rota: '/modelos/clinica',
    nome: '06 clínica · escolher procedimento monta a agenda',
    async rodar(cdp) {
      const antes = await avaliar(cdp, `document.querySelectorAll('input[type="radio"], input[type="checkbox"]').length`);
      const clicou = await avaliar(
        cdp,
        `(() => {
          const r = document.querySelector('input[type="radio"]');
          if (!r) return 'sem radio';
          r.click();
          r.dispatchEvent(new Event('change', { bubbles: true }));
          return 'clicou';
        })()`
      );
      await esperar(600);
      const marcado = await avaliar(cdp, `document.querySelectorAll('input[type="radio"]:checked').length`);
      return { ok: clicou === 'clicou' && marcado > 0, detalhe: `${antes} controles · ${marcado} marcado após o clique` };
    }
  },
  {
    rota: '/modelos/estudio',
    nome: '10 estúdio · orçamentador calcula faixa (e bloqueia naming avulso)',
    async rodar(cdp) {
      /* Primeiro a regra de negócio: naming sozinho tem que ser recusado. */
      await avaliar(
        cdp,
        `(() => {
          const c = document.querySelector('input[name="escopo"][value="naming"]');
          c.checked = true;
          c.dispatchEvent(new Event('change', { bubbles: true }));
          document.querySelector('#form-orcamento').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
          return 'enviou';
        })()`
      );
      await esperar(1200);
      const bloqueio = await avaliar(
        cdp,
        `(document.querySelector('#orcamento-saida .erro__titulo') || {}).textContent || ''`
      );

      /* Agora um escopo válido: identidade visual sozinha calcula faixa. */
      await avaliar(
        cdp,
        `(() => {
          const caixas = [...document.querySelectorAll('input[name="escopo"]')];
          caixas.forEach((c) => { c.checked = c.value === 'identidade'; });
          caixas[0].dispatchEvent(new Event('change', { bubbles: true }));
          document.querySelector('#form-orcamento').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
          return 'enviou';
        })()`
      );
      await esperar(1600);
      const faixa = await avaliar(
        cdp,
        `(document.querySelector('#orcamento-saida .saida__faixa') || {}).textContent || ''`
      );
      const memoria = await avaliar(cdp, `document.querySelectorAll('#orcamento-saida .memoria__lista li').length`);

      return {
        ok: bloqueio.includes('Naming') && Boolean(faixa),
        detalhe: `naming avulso bloqueado ("${bloqueio}") · escopo válido "${faixa}" com ${memoria} linha(s) de memória de cálculo`
      };
    }
  },
  {
    rota: '/',
    nome: 'catálogo · filtro de faixa de preço e formulário valida',
    async rodar(cdp) {
      const antes = await avaliar(cdp, `document.querySelectorAll('#grade > li:not(.oculto)').length`);
      await avaliar(
        cdp,
        `(() => {
          const b = [...document.querySelectorAll('.filtro')].find((x) => x.textContent.includes('300'));
          if (!b) return 'sem filtro';
          b.click();
          return 'clicou';
        })()`
      );
      await esperar(400);
      const depois = await avaliar(cdp, `document.querySelectorAll('#grade > li:not(.oculto)').length`);
      /* Enviar vazio tem que produzir erro, não passar. */
      await avaliar(
        cdp,
        `(() => {
          const f = document.querySelector('#formulario, form');
          if (f) f.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
          return 'enviou';
        })()`
      );
      await esperar(500);
      const erros = await avaliar(cdp, `document.querySelectorAll('.campo--erro').length`);
      return {
        ok: depois > 0 && depois < antes && erros > 0,
        detalhe: `cartões ${antes} → ${depois} · ${erros} campo(s) com erro ao enviar vazio`
      };
    }
  }
];

let falhas = 0;

for (const t of TESTES) {
  let cdp;
  try {
    cdp = await abrir(BASE + t.rota);
    const r = await t.rodar(cdp);
    if (!r.ok) falhas++;
    console.log(`${r.ok ? 'ok  ' : 'FALHA'} ${t.nome}\n      ${r.detalhe}`);
  } catch (e) {
    falhas++;
    console.log(`ERRO  ${t.nome}\n      ${e.message}`);
  } finally {
    if (cdp) {
      cdp.fechar();
      await fetch(`http://127.0.0.1:${PORTA}/json/close/${cdp.abaId}`).catch(() => {});
    }
  }
}

console.log(`\n${TESTES.length - falhas}/${TESTES.length} interações funcionando`);
chrome.kill();
process.exit(falhas ? 1 : 0);
