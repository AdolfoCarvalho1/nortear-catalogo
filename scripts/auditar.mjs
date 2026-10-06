/* ============================================================
   Auditoria técnica — Impeccable /audit, dimensões 1 a 5.

   Mede o que dá para medir na página renderizada, em cada rota:
     1. Acessibilidade — contraste real, foco visível, rótulo, semântica, alt
     2. Performance     — nós no DOM, imagens sem dimensão, animação de layout
     3. Theming         — uso de token contra valor fixo, cobertura de cor
     4. Responsivo      — rolagem, alvos de toque, escala de texto
     5. Integridade     — delega ao detector do Impeccable

   Uso: node scripts/auditar.mjs [--largura 1440] [--rota /] [--json]
   ============================================================ */

import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
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

const argv = process.argv.slice(2);
const pegar = (n, p) => {
  const i = argv.indexOf('--' + n);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : p;
};
const largura = Number(pegar('largura', 1440));
const rotaUnica = pegar('rota', null);
const comoJson = argv.includes('--json');

const { MODELOS } = createRequire(import.meta.url)(join(RAIZ, 'assets', 'modelos-data.js'));
const ROTAS = rotaUnica ? [rotaUnica] : ['/', ...MODELOS.map((m) => m.rota)];

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
      const m = JSON.parse(ev.data);
      if (m.id && this.pendentes.has(m.id)) {
        const { ok, falha } = this.pendentes.get(m.id);
        this.pendentes.delete(m.id);
        m.error ? falha(new Error(m.error.message)) : ok(m.result);
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
      }, 40000);
    });
  }
  fechar() {
    this.ws.close();
  }
}

/* ---------------------------------------------------------------
   A sonda. Roda inteira no navegador e devolve um objeto medido.
   --------------------------------------------------------------- */
const SONDA = `(() => {
  const vw = document.documentElement.clientWidth;

  /* ---------- contraste WCAG ---------- */
  const lum = (rgb) => {
    const c = rgb.map((v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const parse = (cor) => {
    const m = cor.match(/rgba?\\(([^)]+)\\)/);
    if (!m) return null;
    const p = m[1].split(',').map((x) => parseFloat(x));
    return { rgb: [p[0], p[1], p[2]], a: p.length > 3 ? p[3] : 1 };
  };
  /* Sobe a árvore até achar um fundo opaco; mistura o que for translúcido. */
  const fundoDe = (el) => {
    let no = el;
    let acumulado = null;
    while (no && no !== document.documentElement) {
      const c = parse(getComputedStyle(no).backgroundColor);
      if (c && c.a > 0) {
        if (!acumulado) acumulado = c.rgb.slice();
        else if (c.a >= 1) { acumulado = c.rgb.slice(); break; }
        else acumulado = acumulado.map((v, i) => Math.round(v * (1 - c.a) + c.rgb[i] * c.a));
        if (c.a >= 1) break;
      }
      no = no.parentElement;
    }
    return acumulado || [255, 255, 255];
  };
  const razao = (a, b) => {
    const la = lum(a), lb = lum(b);
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  };

  const contraste = { falhas: [], checados: 0 };
  const vistos = new Set();
  document.querySelectorAll('body *').forEach((el) => {
    /* Só nós com texto próprio, visível e não decorativo. */
    const texto = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join(' ').trim();
    if (!texto || texto.length < 2) return;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || parseFloat(cs.opacity) < 0.15) return;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    const cor = parse(cs.color);
    if (!cor) return;
    const fundo = fundoDe(el);
    const misturada = cor.a < 1 ? cor.rgb.map((v, i) => Math.round(v * cor.a + fundo[i] * (1 - cor.a))) : cor.rgb;
    const tamanho = parseFloat(cs.fontSize);
    const peso = parseInt(cs.fontWeight, 10) || 400;
    const grande = tamanho >= 24 || (tamanho >= 18.66 && peso >= 700);
    const minimo = grande ? 3 : 4.5;
    const valor = razao(misturada, fundo);
    contraste.checados++;
    const chave = cs.color + '|' + fundo.join(',') + '|' + Math.round(tamanho);
    if (valor < minimo && !vistos.has(chave)) {
      vistos.add(chave);
      contraste.falhas.push({
        texto: texto.slice(0, 46),
        cls: (typeof el.className === 'string' ? el.className : '').split(/\\s+/)[0] || el.tagName.toLowerCase(),
        razao: Math.round(valor * 100) / 100,
        minimo,
        tamanho: Math.round(tamanho),
        cor: cs.color,
        fundo: 'rgb(' + fundo.join(', ') + ')'
      });
    }
  });

  /* ---------- foco visível ----------
     ATENÇÃO: esta checagem é estática e NÃO conclui nada sozinha. O foco não
     está aplicado em nenhum elemento no momento da medição, então ela só
     consegue dizer que não achou regra — e achar regra por texto de seletor é
     frágil. A medição que vale é a de scripts/auditar-foco.mjs, que envia a
     tecla Tab de verdade e lê o estilo do elemento focado. Aqui o número serve
     apenas de indício. */
  const focaveis = [...document.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])')]
    .filter((el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden';
    });
  const semRegraDeclarada = [];
  focaveis.slice(0, 40).forEach((el) => {
    let achou = false;
    for (const folha of document.styleSheets) {
      let regras;
      try { regras = folha.cssRules; } catch { continue; }
      const varre = (lista) => {
        for (const regra of lista || []) {
          if (regra.cssRules) { varre(regra.cssRules); continue; }
          if (!regra.selectorText || !/focus/.test(regra.selectorText)) continue;
          if (!/outline|box-shadow|border|background/.test(regra.style?.cssText || '')) continue;
          const seletor = regra.selectorText.replace(/:focus(-visible)?/g, '');
          try { if (seletor && el.matches(seletor)) { achou = true; return; } } catch { /* seletor composto */ }
        }
      };
      varre(regras);
      if (achou) break;
    }
    if (!achou) semRegraDeclarada.push((el.textContent || el.tagName).trim().slice(0, 30) || el.tagName.toLowerCase());
  });

  /* ---------- rótulo de campo ---------- */
  const campos = [...document.querySelectorAll('input:not([type="hidden"]), select, textarea')];
  const semRotulo = campos.filter((el) => {
    if (el.getAttribute('aria-label') || el.getAttribute('aria-labelledby')) return false;
    if (el.id && document.querySelector('label[for="' + el.id + '"]')) return false;
    if (el.closest('label')) return false;
    return true;
  }).map((el) => (el.name || el.id || el.type || 'campo'));

  /* ---------- semântica ---------- */
  const titulos = [...document.querySelectorAll('h1, h2, h3, h4, h5, h6')].map((h) => Number(h.tagName[1]));
  const saltos = [];
  for (let i = 1; i < titulos.length; i++) {
    if (titulos[i] - titulos[i - 1] > 1) saltos.push('h' + titulos[i - 1] + '→h' + titulos[i]);
  }
  const semantica = {
    h1: titulos.filter((n) => n === 1).length,
    saltos,
    landmarks: {
      header: document.querySelectorAll('header').length,
      nav: document.querySelectorAll('nav').length,
      main: document.querySelectorAll('main').length,
      footer: document.querySelectorAll('footer').length
    },
    divsComoBotao: document.querySelectorAll('div[onclick], span[onclick]').length,
    botoesSemTipo: [...document.querySelectorAll('button')].filter((b) => !b.getAttribute('type')).length
  };

  /* ---------- alt de imagem ---------- */
  const imgs = [...document.images];
  const semAlt = imgs.filter((i) => !i.hasAttribute('alt')).map((i) => i.currentSrc || i.src);
  const altVazio = imgs.filter((i) => i.getAttribute('alt') === '' && !i.getAttribute('aria-hidden')).length;

  /* ---------- movimento ---------- */
  const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const animados = [...document.querySelectorAll('body *')].filter((el) => {
    const cs = getComputedStyle(el);
    return cs.animationName !== 'none' || (cs.transitionDuration !== '0s' && parseFloat(cs.transitionDuration) > 0.4);
  }).length;
  const semReducao = [];
  for (const folha of document.styleSheets) {
    let regras;
    try { regras = folha.cssRules; } catch { continue; }
    for (const regra of regras || []) {
      if (regra.media && /prefers-reduced-motion/.test(regra.conditionText || regra.media.mediaText || '')) {
        semReducao.push('tem');
      }
    }
  }
  const movimento = {
    prefereReduzido: reduzido,
    elementosAnimados: animados,
    temRegraReducao: semReducao.length > 0
  };

  /* ---------- performance ---------- */
  const perf = {
    nos: document.querySelectorAll('*').length,
    profundidade: (() => { let m = 0; document.querySelectorAll('body *').forEach((el) => { let d = 0, n = el; while (n) { d++; n = n.parentElement; } m = Math.max(m, d); }); return m; })(),
    imgsSemDimensao: imgs.filter((i) => !i.getAttribute('width') && !i.getAttribute('height')).length,
    imgsSemLazy: imgs.filter((i) => i.loading !== 'lazy' && i.getBoundingClientRect().top > window.innerHeight).length,
    willChange: [...document.querySelectorAll('body *')].filter((el) => getComputedStyle(el).willChange !== 'auto').length,
    filtros: [...document.querySelectorAll('body *')].filter((el) => {
      const cs = getComputedStyle(el);
      return cs.filter !== 'none' || cs.backdropFilter !== 'none';
    }).length,
    transicoesDeLayout: [...document.querySelectorAll('body *')].filter((el) => {
      const t = getComputedStyle(el).transitionProperty;
      return /width|height|top|left|margin|padding/.test(t);
    }).length,
    folhasDeEstilo: document.styleSheets.length
  };

  /* ---------- theming ----------
     CSSStyleDeclaration não enumera custom properties, então percorrer as
     declarações devolvia zero. E ownerNode.textContent de um <link> é vazio,
     porque o CSS é externo. O caminho que funciona é serializar as regras. */
  const tokens = new Set();
  let varNoCss = 0;
  const somar = (texto) => {
    /* Sem regex aqui: dentro de um template literal a barra invertida some
       antes de chegar ao navegador e a expressão quebra. Dividir por string
       é imune a isso. */
    varNoCss += texto.split('var(--').length - 1;
    texto.split('--').slice(1).forEach((parte) => {
      const nome = parte.split(':')[0].trim();
      /* Sem regex: a barra de \w some no template literal. Teste explícito
         de caractere é imune e igualmente claro. */
      const valido = nome.length > 0 && nome.length < 40 &&
        [...nome].every((c) => (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9') || c === '-');
      if (valido) tokens.add('--' + nome);
    });
  };
  for (const folha of document.styleSheets) {
    let regras;
    try { regras = folha.cssRules; } catch { continue; }
    const varre = (lista) => {
      for (const r of lista || []) {
        /* Testar r.cssRules.length e não r.cssRules: um CSSRuleList vazio é
           truthy, então testar o objeto mandava toda style rule para o
           continue e o texto dela nunca era lido — a contagem dava zero. */
        if (r.cssRules && r.cssRules.length) varre(r.cssRules);
        if (r.cssText) somar(r.cssText);
      }
    };
    varre(regras);
  }
  const estilosInline = [...document.querySelectorAll('[style]')].map((el) => el.getAttribute('style'));
  const coresFixasInline = estilosInline.filter((s) => /#[0-9a-f]{3,8}|rgb/.test(s)).length;
  const theming = {
    tokensDeclarados: tokens.size,
    usosDeToken: varNoCss,
    estilosInline: estilosInline.length,
    coresFixasInline,
    temColorScheme: getComputedStyle(document.documentElement).colorScheme
  };

  /* ---------- responsivo ---------- */
  const piso = vw < 700 ? 44 : 24;
  const alvosPequenos = [...document.querySelectorAll('a[href], button, select, summary, [role="button"]')]
    .filter((el) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return false;
      if (el.classList.contains('pular')) return false;
      const h = el.getAttribute('href') || '';
      if (/^(mailto:|tel:)/.test(h)) return false;
      if (el.closest('.rodape, address, figcaption')) return false;
      const pai = el.parentElement;
      if (pai && pai.tagName === 'P' && pai.textContent.trim().length > el.textContent.trim().length + 12) return false;
      return r.height < piso;
    })
    .map((el) => (el.textContent || '').trim().slice(0, 26) + ' (' + Math.round(el.getBoundingClientRect().height) + 'px)');

  const responsivo = {
    larguraViewport: vw,
    documento: document.documentElement.scrollWidth,
    rolagemLateral: document.documentElement.scrollWidth > vw + 1,
    alvosPequenos,
    largurasFixas: [...document.querySelectorAll('body *')].filter((el) => {
      const w = getComputedStyle(el).width;
      return /px$/.test(w) && parseFloat(w) > vw;
    }).length,
    temMediaQuery: (() => {
      for (const folha of document.styleSheets) {
        let regras;
        try { regras = folha.cssRules; } catch { continue; }
        for (const r of regras || []) if (r.media && /min-width|max-width/.test(r.conditionText || r.media.mediaText || '')) return true;
      }
      return false;
    })()
  };

  return {
    rota: location.pathname,
    titulo: document.title,
    contraste,
    foco: { focaveis: focaveis.length, semRegraDeclarada },
    rotulos: { campos: campos.length, semRotulo },
    semantica,
    alt: { total: imgs.length, semAlt, altVazio },
    movimento,
    perf,
    theming,
    responsivo
  };
})()`;

const resultados = [];

for (const rota of ROTAS) {
  const r = await fetch(`http://127.0.0.1:${PORTA}/json/new?about:blank`, { method: 'PUT' });
  const aba = await r.json();
  const ws = new WebSocket(aba.webSocketDebuggerUrl);
  await new Promise((ok, f) => {
    ws.addEventListener('open', ok, { once: true });
    ws.addEventListener('error', f, { once: true });
  });
  const cdp = new Cdp(ws);
  try {
    await cdp.enviar('Page.enable');
    await cdp.enviar('Runtime.enable');
    await cdp.enviar('Emulation.setDeviceMetricsOverride', {
      width: largura, height: 900, deviceScaleFactor: 1, mobile: largura < 700
    });
    await cdp.enviar('Page.navigate', { url: BASE + rota });
    await esperar(1900);
    const med = await cdp.enviar('Runtime.evaluate', { expression: SONDA, returnByValue: true });
    if (med.exceptionDetails) throw new Error(med.exceptionDetails.exception?.description || 'sonda falhou');
    resultados.push(med.result.value);
    console.log(`medido ${rota}`);
  } catch (e) {
    console.log(`ERRO ${rota}: ${e.message}`);
  } finally {
    cdp.fechar();
    await fetch(`http://127.0.0.1:${PORTA}/json/close/${aba.id}`).catch(() => {});
  }
}

chrome.kill();

/* ---------------------------------------------------------------
   Agregação
   --------------------------------------------------------------- */
const soma = (f) => resultados.reduce((a, r) => a + f(r), 0);
const agregado = {
  largura,
  rotas: resultados.length,
  contraste: {
    checados: soma((r) => r.contraste.checados),
    falhas: resultados.flatMap((r) => r.contraste.falhas.map((f) => ({ ...f, rota: r.rota })))
  },
  foco: {
    focaveis: soma((r) => r.foco.focaveis),
    semRegraDeclarada: resultados.flatMap((r) => r.foco.semRegraDeclarada.map((s) => ({ el: s, rota: r.rota })))
  },
  rotulos: {
    campos: soma((r) => r.rotulos.campos),
    semRotulo: resultados.flatMap((r) => r.rotulos.semRotulo.map((s) => ({ campo: s, rota: r.rota })))
  },
  semantica: {
    h1ForaDeUm: resultados.filter((r) => r.semantica.h1 !== 1).map((r) => ({ rota: r.rota, h1: r.semantica.h1 })),
    saltos: resultados.flatMap((r) => r.semantica.saltos.map((s) => ({ salto: s, rota: r.rota }))),
    semMain: resultados.filter((r) => r.semantica.landmarks.main !== 1).map((r) => r.rota),
    divsComoBotao: soma((r) => r.semantica.divsComoBotao),
    botoesSemTipo: soma((r) => r.semantica.botoesSemTipo)
  },
  alt: {
    total: soma((r) => r.alt.total),
    semAlt: resultados.flatMap((r) => r.alt.semAlt.map((s) => ({ src: s, rota: r.rota }))),
    altVazio: soma((r) => r.alt.altVazio)
  },
  movimento: {
    comRegraDeReducao: resultados.filter((r) => r.movimento.temRegraReducao).length,
    animados: soma((r) => r.movimento.elementosAnimados)
  },
  perf: {
    nos: Math.max(...resultados.map((r) => r.perf.nos)),
    nosMedio: Math.round(soma((r) => r.perf.nos) / resultados.length),
    profundidade: Math.max(...resultados.map((r) => r.perf.profundidade)),
    imgsSemDimensao: soma((r) => r.perf.imgsSemDimensao),
    imgsSemLazy: soma((r) => r.perf.imgsSemLazy),
    willChange: soma((r) => r.perf.willChange),
    filtros: soma((r) => r.perf.filtros),
    transicoesDeLayout: soma((r) => r.perf.transicoesDeLayout)
  },
  theming: {
    tokens: Math.max(...resultados.map((r) => r.theming.tokensDeclarados)),
    usosDeToken: Math.max(...resultados.map((r) => r.theming.usosDeToken)),
    estilosInline: soma((r) => r.theming.estilosInline),
    coresFixasInline: soma((r) => r.theming.coresFixasInline)
  },
  responsivo: {
    rolagemLateral: resultados.filter((r) => r.responsivo.rolagemLateral).map((r) => r.rota),
    alvosPequenos: resultados.flatMap((r) => r.responsivo.alvosPequenos.map((a) => ({ alvo: a, rota: r.rota }))),
    largurasFixas: soma((r) => r.responsivo.largurasFixas),
    todasTemMediaQuery: resultados.every((r) => r.responsivo.temMediaQuery)
  },
  detalhe: resultados
};

if (comoJson) {
  const destino = join(RAIZ, '.impeccable', 'auditoria.json');
  mkdirSync(dirname(destino), { recursive: true });
  writeFileSync(destino, JSON.stringify(agregado, null, 2), 'utf8');
  console.log(`\nJSON em ${destino.replace(RAIZ + '\\', '')}`);
}

/* ---------- impressão ---------- */
console.log(`\n${'='.repeat(70)}\nAUDITORIA — ${agregado.rotas} rotas @ ${largura}px\n${'='.repeat(70)}`);

console.log(`\n1. ACESSIBILIDADE`);
console.log(`   contraste: ${agregado.contraste.checados} trechos medidos, ${agregado.contraste.falhas.length} falha(s)`);
agregado.contraste.falhas.slice(0, 14).forEach((f) =>
  console.log(`     ${f.razao}:1 (min ${f.minimo}) ${f.rota} · .${f.cls} · "${f.texto}" · ${f.cor} sobre ${f.fundo}`)
);
console.log(`   foco: ${agregado.foco.focaveis} focáveis (indício estático — medir com auditar-foco.mjs)`);
agregado.foco.semRegraDeclarada.slice(0, 6).forEach((f) => console.log(`     sem regra achada: ${f.rota} · ${f.el}`));
console.log(`   rótulo: ${agregado.rotulos.campos} campos, ${agregado.rotulos.semRotulo.length} sem rótulo`);
agregado.rotulos.semRotulo.slice(0, 8).forEach((f) => console.log(`     ${f.rota} · ${f.campo}`));
console.log(`   semântica: h1 fora de um em ${agregado.semantica.h1ForaDeUm.length} rota(s), ${agregado.semantica.saltos.length} salto(s) de nível, ${agregado.semantica.divsComoBotao} div-como-botão, ${agregado.semantica.botoesSemTipo} botão sem type`);
agregado.semantica.saltos.slice(0, 8).forEach((s) => console.log(`     ${s.rota} · ${s.salto}`));
console.log(`   alt: ${agregado.alt.total} imagens, ${agregado.alt.semAlt.length} sem alt, ${agregado.alt.altVazio} com alt vazio`);
console.log(`   movimento: ${agregado.movimento.comRegraDeReducao}/${agregado.rotas} rotas com regra de redução, ${agregado.movimento.animados} elementos animados`);

console.log(`\n2. PERFORMANCE`);
console.log(`   DOM: ${agregado.perf.nos} nós no maior, ${agregado.perf.nosMedio} em média, profundidade ${agregado.perf.profundidade}`);
console.log(`   imagens: ${agregado.perf.imgsSemDimensao} sem width/height, ${agregado.perf.imgsSemLazy} abaixo da dobra sem lazy`);
console.log(`   will-change: ${agregado.perf.willChange} · filtros/backdrop: ${agregado.perf.filtros} · transição de layout: ${agregado.perf.transicoesDeLayout}`);

console.log(`\n3. THEMING`);
console.log(`   tokens declarados: ${agregado.theming.tokens} · usos de var(): ${agregado.theming.usosDeToken}`);
console.log(`   estilo inline: ${agregado.theming.estilosInline} (${agregado.theming.coresFixasInline} com cor fixa)`);

console.log(`\n4. RESPONSIVO @ ${largura}px`);
console.log(`   rolagem lateral: ${agregado.responsivo.rolagemLateral.length ? agregado.responsivo.rolagemLateral.join(', ') : 'nenhuma'}`);
console.log(`   alvos abaixo do piso: ${agregado.responsivo.alvosPequenos.length}`);
agregado.responsivo.alvosPequenos.slice(0, 10).forEach((a) => console.log(`     ${a.rota} · ${a.alvo}`));
console.log(`   larguras fixas maiores que a viewport: ${agregado.responsivo.largurasFixas}`);
console.log(`   media queries presentes em todas as rotas: ${agregado.responsivo.todasTemMediaQuery}`);




