'use client';

import { useEffect } from 'react';

/**
 * Interações do modelo 07 — Costa & Vilela.
 *
 * O script veio do modelo estático: o `classList.add('js')` que o <head>
 * original roda antes de tudo (o CSS das plantas depende dessa classe) mais o
 * IIFE que consulta o DOM renderizado pelo React e liga os controles. A guarda
 * impede ligação dupla quando o React remonta o componente.
 *
 * O que ele faz: busca com filtros, contagem viva e ordenação; painel lateral
 * com foco preso; dossiê com carregamento passo a passo; validação do
 * formulário de avaliação; e as pranchas sendo desenhadas ao entrar na tela.
 */
export default function Interacoes() {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (document.documentElement.dataset.costaVilelaLigado === 'sim') return;
    document.documentElement.dataset.costaVilelaLigado = 'sim';
    ligar();
  }, []);

  return null;
}

/* O script original entra aqui, sem alteração de comportamento. */
function ligar() {
  const $ = <T extends Element = HTMLElement>(s: string, c?: ParentNode) =>
    ((c || document) as ParentNode).querySelector(s) as T | null;
  const $$ = <T extends Element = HTMLElement>(s: string, c?: ParentNode) =>
    Array.prototype.slice.call(((c || document) as ParentNode).querySelectorAll(s)) as T[];
  const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* O CSS do modelo esconde as plantas sem esta classe: ela é a primeira
     coisa do script original, no <head>, e continua sendo. */
  document.documentElement.classList.add('js');

  try {

  /* =========================================================
     1. A carteira lida do próprio HTML — uma fonte só.
     Nada de duplicar os oito imóveis dentro do script.
     ========================================================= */
  type Imovel = {
    el: HTMLElement;
    codigo: string;
    tipo: string;
    tipoNome: string;
    bairro: string;
    cidade: string;
    endereco: string;
    area: number;
    quartos: number;
    suites: number;
    vagas: number;
    andar: string;
    preco: number;
    condominio: number;
    iptu: number;
    exclusivo: boolean;
    selo: string;
    chegada: string;
    registro: string;
    vistoria: string;
    docs: string[];
  };

  const IMOVEIS: Imovel[] = $$('.ficha').map(function (el) {
    const d = el.dataset;
    return {
      el: el,
      codigo: d.codigo!,
      tipo: d.tipo!,
      tipoNome: d.tipoNome!,
      bairro: d.bairro!,
      cidade: d.cidade!,
      endereco: d.endereco!,
      area: Number(d.area),
      quartos: Number(d.quartos),
      suites: Number(d.suites),
      vagas: Number(d.vagas),
      andar: d.andar!,
      preco: Number(d.preco),
      condominio: Number(d.condominio),
      iptu: Number(d.iptu),
      exclusivo: d.exclusivo === 'true',
      selo: d.selo || '',
      chegada: d.chegada!,
      registro: d.registro!,
      vistoria: d.vistoria!,
      docs: d.docs ? d.docs.split(';') : []
    };
  });

  function brl(n: number) { return 'R$ ' + n.toLocaleString('pt-BR'); }
  function dataBR(iso: string) {
    const p = iso.split('-');
    return p[2] + '/' + p[1] + '/' + p[0];
  }
  function porCodigo(codigo: string) {
    let achado: Imovel | null = null;
    IMOVEIS.forEach(function (i) { if (i.codigo === codigo) achado = i; });
    return achado as Imovel | null;
  }

  /* =========================================================
     2. Busca: filtros, contagem viva, ordenação e estado vazio
     ========================================================= */
  const lista = $('#indice-lista') as HTMLElement;
  const contagem = $('#contagem') as HTMLElement;
  const ativos = $('#ativos') as HTMLElement;
  const vazio = $('#vazio') as HTMLElement;
  const vazioResumo = $('#vazio-resumo') as HTMLElement;
  const filtros = {
    bairro: $('#f-bairro') as HTMLSelectElement,
    tipo: $('#f-tipo') as HTMLSelectElement,
    faixa: $('#f-faixa') as HTMLSelectElement,
    quartos: $('#f-quartos') as HTMLSelectElement,
    ordem: $('#f-ordem') as HTMLSelectElement,
    exclusivo: $('#f-exclusivo') as HTMLInputElement
  };
  const botaoLimpar = $('#limpar') as HTMLButtonElement;

  function faixaCasa(preco: number, faixa: string) {
    if (!faixa) return true;
    const partes = faixa.split('-');
    return preco >= Number(partes[0]) && preco <= Number(partes[1]);
  }

  function filtroAtivo() {
    return Boolean(filtros.bairro.value || filtros.tipo.value || filtros.faixa.value
      || filtros.quartos.value || filtros.exclusivo.checked);
  }

  function resumoFiltros() {
    const partes: string[] = [];
    if (filtros.bairro.value) partes.push(filtros.bairro.options[filtros.bairro.selectedIndex].text.split(' · ')[0]);
    if (filtros.tipo.value) partes.push(filtros.tipo.options[filtros.tipo.selectedIndex].text.toLowerCase());
    if (filtros.faixa.value) partes.push(filtros.faixa.options[filtros.faixa.selectedIndex].text.toLowerCase());
    if (filtros.quartos.value) partes.push(filtros.quartos.value + ' quartos ou mais');
    if (filtros.exclusivo.checked) partes.push('só imóveis com exclusividade');
    return partes.join(' · ');
  }

  function aplicar() {
    const achados = IMOVEIS.filter(function (i) {
      if (filtros.bairro.value && i.bairro !== filtros.bairro.value) return false;
      if (filtros.tipo.value && i.tipo !== filtros.tipo.value) return false;
      if (!faixaCasa(i.preco, filtros.faixa.value)) return false;
      if (filtros.quartos.value && i.quartos < Number(filtros.quartos.value)) return false;
      if (filtros.exclusivo.checked && !i.exclusivo) return false;
      return true;
    });

    const ordem = filtros.ordem.value;
    achados.sort(function (a, b) {
      if (ordem === 'preco-asc') return a.preco - b.preco;
      if (ordem === 'preco-desc') return b.preco - a.preco;
      if (ordem === 'area-desc') return b.area - a.area;
      return a.chegada < b.chegada ? 1 : -1;
    });

    lista.innerHTML = '';
    achados.forEach(function (i) {
      const li = document.createElement('li');
      const botao = document.createElement('button');
      botao.type = 'button';
      botao.className = 'linha';
      botao.setAttribute('data-abrir', i.codigo);
      botao.setAttribute('aria-label', 'Abrir a ficha do ' + i.codigo + ' — ' + i.tipoNome + ' em ' + i.bairro
        + ', ' + brl(i.preco));

      const celulas: [string, string, string?][] = [
        ['codigo', i.codigo],
        ['imovel', i.tipoNome + ' · ' + i.bairro + ' · ' + i.cidade,
          (i.exclusivo ? 'Exclusividade Costa & Vilela' : 'Na carteira desde ' + dataBR(i.chegada))],
        ['area', i.area + ' m²'],
        ['dorm', i.quartos + ' · ' + i.suites + ' · ' + i.vagas],
        ['preco', brl(i.preco), i.condominio ? 'condomínio ' + brl(i.condominio) + '/mês' : 'sem condomínio']
      ];
      celulas.forEach(function (c) {
        const span = document.createElement('span');
        span.className = 'celula celula--' + c[0];
        span.textContent = c[1];
        if (c[2]) {
          const small = document.createElement('small');
          small.textContent = c[2];
          if (c[0] === 'imovel' && i.exclusivo) small.className = 'celula__selo';
          span.appendChild(small);
        }
        botao.appendChild(span);
      });
      const seta = document.createElement('span');
      seta.className = 'celula--seta';
      seta.innerHTML = '<svg class="ico" aria-hidden="true" focusable="false"><use href="#ico-seta" xlink:href="#ico-seta"/></svg>';
      botao.appendChild(seta);

      li.appendChild(botao);
      lista.appendChild(li);
    });

    const total = IMOVEIS.length;
    const n = achados.length;
    contagem.textContent = n + ' de ' + total + ' imóveis';
    ativos.textContent = filtroAtivo()
      ? 'Filtros ativos: ' + resumoFiltros() + '.'
      : 'Carteira inteira, na ordem em que chegou.';
    vazio.hidden = n !== 0;
    botaoLimpar.disabled = !filtroAtivo();

    if (n === 0) {
      vazioResumo.textContent = 'Busca registrada: ' + resumoFiltros() + '.';
    }

    if (!reduzido) {
      $$('.linha', lista).forEach(function (l, idx) {
        l.style.animation = 'entrarLinha .34s cubic-bezier(.16,1,.3,1) ' + Math.min(idx * 40, 240) + 'ms backwards';
      });
    }
  }

  (Object.keys(filtros) as (keyof typeof filtros)[]).forEach(function (chave) {
    filtros[chave].addEventListener('change', aplicar);
  });

  botaoLimpar.addEventListener('click', function () {
    filtros.bairro.value = '';
    filtros.tipo.value = '';
    filtros.faixa.value = '';
    filtros.quartos.value = '';
    filtros.exclusivo.checked = false;
    filtros.ordem.value = 'recente';
    aplicar();
    filtros.bairro.focus();
  });

  aplicar();

  /* =========================================================
     3. Painel lateral: foco preso, Esc fecha, foco volta
     ========================================================= */
  const painel = $('#painel') as HTMLElement;
  const veu = $('#veu') as HTMLElement;
  const corpo = $('#painel-corpo') as HTMLElement;
  const painelCodigo = $('#painel-codigo') as HTMLElement;
  const painelTitulo = $('#painel-titulo') as HTMLElement;
  const botaoFechar = $('#painel-fechar') as HTMLButtonElement;
  let focoAnterior: Element | null = null;
  let temporizadores: number[] = [];

  function limparTemporizadores() {
    temporizadores.forEach(function (t) { window.clearTimeout(t); });
    temporizadores = [];
  }

  function listaDossie(i: Imovel) {
    const itens = [
      'Matrícula atualizada — ' + i.registro,
      'Certidão negativa de ônus reais, ações e tributos federais',
      'IPTU de 2026 quitado — ' + brl(i.iptu) + '/ano',
      'Laudo de vistoria do corretor, assinado em ' + i.vistoria
    ];
    if (i.condominio) itens.splice(2, 0, 'Convenção, ata da última assembleia e balanço do condomínio');
    if (i.tipo === 'casa' || i.tipo === 'casa de condomínio') itens.splice(3, 0, 'Projeto aprovado na prefeitura e certidão de inexistência de débitos');
    return itens.concat(i.docs);
  }

  function montarPainel(i: Imovel) {
    painelCodigo.textContent = i.codigo;
    painelTitulo.textContent = i.tipoNome + ' em ' + i.bairro + ', ' + i.cidade;

    const ficha = i.el;
    const prancha = $('.prancha', ficha)!.cloneNode(true) as HTMLElement;
    const estado = $('.estado', ficha)!.cloneNode(true) as HTMLElement;
    /* A prancha clonada também é desenhada ao abrir o painel. */
    const desenhoClonado = $('.prancha__desenho', prancha);
    if (desenhoClonado) desenhoClonado.classList.add('desenhada');

    let html = '';
    html += '<div class="painel__selo">' + (i.selo ? '<span class="selo-latao">' + i.selo + '</span>' : '<span class="selo-petroleo">Disponível para visita</span>') + '</div>';
    html += '<div class="painel__prancha"></div>';
    html += '<p class="painel__preco"><b>' + brl(i.preco) + '</b><span>' + (i.condominio ? 'condomínio ' + brl(i.condominio) + '/mês' : 'sem condomínio') + ' · IPTU ' + brl(i.iptu) + '/ano</span></p>';
    html += '<dl class="dados dados--painel">'
      + '<div><dt>Área</dt><dd>' + i.area + ' m²</dd></div>'
      + '<div><dt>Quartos</dt><dd>' + i.quartos + ' · ' + i.suites + (i.suites === 1 ? ' suíte' : ' suítes') + '</dd></div>'
      + '<div><dt>Vagas</dt><dd>' + i.vagas + '</dd></div>'
      + '<div><dt>Configuração</dt><dd>' + i.andar + '</dd></div>'
      + '<div><dt>Endereço</dt><dd>' + i.endereco + '</dd></div>'
      + '<div><dt>Na carteira desde</dt><dd>' + dataBR(i.chegada) + '</dd></div>'
      + '</dl>';
    corpo.innerHTML = html;

    $('.painel__prancha', corpo)!.appendChild(prancha);
    const blocoEstado = document.createElement('div');
    blocoEstado.className = 'painel__estado';
    blocoEstado.appendChild(estado);
    corpo.appendChild(blocoEstado);

    const dossie = document.createElement('div');
    dossie.className = 'dossie';
    const itens = listaDossie(i);
    let dHtml = '<h3>O que vem no dossiê deste imóvel</h3><ul>';
    itens.forEach(function () {
      dHtml += '<li><svg class="ico" aria-hidden="true" focusable="false"><use href="#ico-check" xlink:href="#ico-check"/></svg><span></span></li>';
    });
    dHtml += '</ul><div class="progresso" id="progresso" hidden aria-live="polite"></div>'
      + '<p class="dossie__recado" id="dossie-recado" hidden role="status"></p>'
      + '<div class="painel__acoes">'
      + '<button class="botao" type="button" id="painel-agendar">Agendar visita ao ' + i.codigo + '</button>'
      + '<button class="botao botao--vazio" type="button" id="painel-dossie">Baixar dossiê</button>'
      + '</div>';
    dossie.innerHTML = dHtml;
    const alvos = $$('.dossie li span', dossie);
    itens.forEach(function (t, idx) { alvos[idx].textContent = t; });
    corpo.appendChild(dossie);

    $('#painel-agendar', corpo)!.addEventListener('click', function () {
      fecharPainel();
      agendar(i.codigo);
    });
    $('#painel-dossie', corpo)!.addEventListener('click', function () {
      baixarDossie(i, itens.length);
    });
  }

  function focaveis() {
    return $$('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])', painel)
      .filter(function (el) { return !(el as HTMLElement & { disabled?: boolean }).disabled && el.offsetParent !== null; });
  }

  function abrirPainel(codigo: string, origem?: Element | null) {
    const i = porCodigo(codigo);
    if (!i) return;
    limparTemporizadores();
    focoAnterior = origem || document.activeElement;
    montarPainel(i);
    veu.hidden = false;
    painel.hidden = false;
    document.body.classList.add('painel-aberto');
    requestAnimationFrame(function () {
      veu.classList.add('veu--visivel');
      painel.classList.add('painel--aberto');
    });
    botaoFechar.focus();
  }

  function fecharPainel() {
    if (painel.hidden) return;
    limparTemporizadores();
    veu.classList.remove('veu--visivel');
    painel.classList.remove('painel--aberto');
    document.body.classList.remove('painel-aberto');
    const espera = reduzido ? 0 : 240;
    temporizadores.push(window.setTimeout(function () {
      painel.hidden = true;
      veu.hidden = true;
    }, espera));
    if (focoAnterior && document.contains(focoAnterior)) (focoAnterior as HTMLElement).focus();
  }

  document.addEventListener('click', function (e) {
    const alvo = (e.target as Element).closest('[data-abrir]') as HTMLElement | null;
    if (alvo) { abrirPainel(alvo.getAttribute('data-abrir')!, alvo); return; }
    const agendarAlvo = (e.target as Element).closest('[data-agendar]') as HTMLElement | null;
    if (agendarAlvo) agendar(agendarAlvo.getAttribute('data-agendar')!);
  });

  botaoFechar.addEventListener('click', fecharPainel);
  veu.addEventListener('click', fecharPainel);
  document.addEventListener('keydown', function (e) {
    if (painel.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); fecharPainel(); return; }
    if (e.key !== 'Tab') return;
    const lista2 = focaveis();
    if (!lista2.length) return;
    const primeiro = lista2[0];
    const ultimo = lista2[lista2.length - 1];
    /* Se o foco escapou para a página atrás do painel, ele volta. */
    if (!painel.contains(document.activeElement)) { e.preventDefault(); primeiro.focus(); return; }
    if (e.shiftKey && document.activeElement === primeiro) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primeiro.focus(); }
  });

  /* =========================================================
     4. Baixar dossiê: carregamento de verdade, sem fetch
     ========================================================= */
  function baixarDossie(i: Imovel, total: number) {
    const botao = $('#painel-dossie', corpo) as HTMLButtonElement | null;
    const progresso = $('#progresso', corpo) as HTMLElement | null;
    const recado = $('#dossie-recado', corpo) as HTMLElement | null;
    if (!botao || botao.disabled) return;
    botao.disabled = true;
    botao.textContent = 'Montando o dossiê…';
    recado!.hidden = true;
    progresso!.hidden = false;
    progresso!.innerHTML = '';
    const passos = [
      'Conferindo matrícula e certidões no registro',
      'Anexando IPTU, planta e laudo de vistoria',
      'Fechando o PDF e contando as páginas'
    ];
    const passo = reduzido ? 120 : 620;
    passos.forEach(function (texto, idx) {
      temporizadores.push(window.setTimeout(function () {
        const p = document.createElement('p');
        p.textContent = (idx + 1) + '/' + passos.length + ' · ' + texto;
        progresso!.appendChild(p);
      }, passo * (idx + 1)));
    });
    temporizadores.push(window.setTimeout(function () {
      progresso!.hidden = true;
      recado!.hidden = false;
      recado!.innerHTML = '<b>O dossiê do ' + i.codigo + ' reúne ' + total + ' documentos.</b>'
        + '<span>Em uma versão publicada, ele chegaria em PDF no seu e-mail em até 2 minutos, com a matrícula e o laudo de vistoria assinados. Nesta demonstração nada sai do navegador — peça o dossiê no formulário abaixo e um dos sócios envia à mão.</span>';
      botao.disabled = false;
      botao.textContent = 'Baixar dossiê';
    }, passo * (passos.length + 1) + (reduzido ? 120 : 320)));
  }

  /* =========================================================
     5. Formulário: validação, pré-seleção do imóvel e do filtro
     ========================================================= */
  const selectInteresse = $('#interesse') as HTMLSelectElement;
  IMOVEIS.forEach(function (i) {
    const op = document.createElement('option');
    op.value = i.codigo;
    op.textContent = i.codigo + ' — ' + i.tipoNome + ' em ' + i.bairro + ', ' + brl(i.preco);
    selectInteresse.appendChild(op);
  });

  const mensagem = $('#mensagem') as HTMLTextAreaElement;

  function agendar(codigo: string) {
    const i = porCodigo(codigo);
    if (!i) return;
    selectInteresse.value = codigo;
    mensagem.value = 'Quero agendar uma visita ao ' + i.codigo + ' — ' + i.tipoNome + ' em ' + i.bairro
      + ', ' + i.area + ' m², ' + brl(i.preco) + '.';
    $('#avaliar')!.scrollIntoView({ block: 'start', behavior: reduzido ? 'auto' : 'smooth' });
    const form = $('#form-avaliar') as HTMLFormElement;
    form.classList.add('form--destacado');
    temporizadores.push(window.setTimeout(function () { form.classList.remove('form--destacado'); }, 1400));
    $('#nome')!.focus({ preventScroll: true });
  }

  $('#vazio-contato')!.addEventListener('click', function () {
    mensagem.value = 'Nenhum imóvel casou com a minha busca (' + resumoFiltros()
      + '). Avise-me quando entrar um parecido na carteira.';
    $('#avaliar')!.scrollIntoView({ block: 'start', behavior: reduzido ? 'auto' : 'smooth' });
    $('#nome')!.focus({ preventScroll: true });
  });

  const regras: Record<string, (v: string) => string> = {
    nome: function (v) {
      const partes = v.trim().split(/\s+/);
      if (partes.length < 2 || partes[0].length < 2) return 'Escreva nome e sobrenome — é assim que a avaliação é assinada.';
      return '';
    },
    telefone: function (v) {
      const n = v.replace(/\D/g, '');
      if (n.length < 10) return 'Coloque o DDD junto do número, como (27) 99245-0180.';
      if (n.length > 11) return 'Número maior que o esperado: confira o DDD.';
      return '';
    },
    email: function (v) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) return 'Confira o e-mail: falta algo como nome@exemplo.com.br.';
      return '';
    },
    bairro: function (v) {
      if (v.trim().length < 3) return 'Diga o bairro do imóvel — é o que define os comparáveis.';
      return '';
    },
    tipo: function (v) {
      if (!v) return 'Escolha o tipo de imóvel.';
      return '';
    },
    area: function (v) {
      const n = parseInt(v.replace(/\D/g, ''), 10);
      if (!n) return 'Diga a área aproximada, em m².';
      if (n < 20) return 'Abaixo de 20 m² não temos comparável na Grande Vitória.';
      if (n > 5000) return 'Acima de 5.000 m² a avaliação é feita por perícia — fale com a Helena.';
      return '';
    }
  };

  function validar(nome: string) {
    const input = $('[name="' + nome + '"]') as HTMLInputElement | null;
    if (!input) return true;
    const msg = regras[nome](input.value);
    const caixa = $('[data-campo="' + nome + '"]');
    caixa!.classList.toggle('campo--erro', Boolean(msg));
    $('[data-erro="' + nome + '"]')!.textContent = msg;
    input.setAttribute('aria-invalid', String(Boolean(msg)));
    return !msg;
  }

  Object.keys(regras).forEach(function (nome) {
    const input = $('[name="' + nome + '"]') as HTMLInputElement | null;
    /* Liga cada erro ao seu campo: quem usa leitor de tela ouve a mensagem. */
    const erro = $('[data-erro="' + nome + '"]') as HTMLElement | null;
    if (erro && input) {
      erro.id = 'erro-' + nome;
      input.setAttribute('aria-describedby', erro.id);
    }
    input!.addEventListener('blur', function () { validar(nome); });
    input!.addEventListener('change', function () { validar(nome); });
    input!.addEventListener('input', function () {
      if ($('[data-campo="' + nome + '"]')!.classList.contains('campo--erro')) validar(nome);
    });
  });

  $('#form-avaliar')!.addEventListener('submit', function (e) {
    e.preventDefault();
    const ok = Object.keys(regras).map(validar).every(Boolean);
    if (!ok) {
      const primeiro = $('.campo--erro input, .campo--erro select') as HTMLElement | null;
      if (primeiro) primeiro.focus();
      return;
    }
    const botao = $('#btn-avaliar') as HTMLButtonElement;
    botao.disabled = true;
    botao.textContent = 'Enviando…';
    temporizadores.push(window.setTimeout(function () {
      const caixa = $('#recado-ok') as HTMLElement;
      const nome = ($('#nome') as HTMLInputElement).value.trim().split(' ')[0];
      const interesse = selectInteresse.value
        ? ' Já anotamos o interesse no ' + selectInteresse.value + ' e a visita entra na frente.'
        : '';
      caixa.hidden = false;
      caixa.innerHTML = '<b>Recebemos os dados do imóvel em ' + ($('#bairro') as HTMLInputElement).value.trim() + ', ' + nome + '.</b>'
        + '<span>Em uma versão publicada, a avaliação por escrito chegaria em até 3 dias úteis em '
        + ($('#email') as HTMLInputElement).value.trim() + ', assinada por Helena Costa (CRECI-ES 3.482-J), com os comparáveis da região.'
        + interesse + '</span>';
      botao.disabled = false;
      botao.textContent = 'Pedir avaliação do meu imóvel';
      caixa.scrollIntoView({ block: 'nearest', behavior: reduzido ? 'auto' : 'smooth' });
    }, reduzido ? 200 : 700));
  });

  /* =========================================================
     6. Movimento autoral: a prancha sendo desenhada
     ========================================================= */
  const desenhaveis = $$('.ficha .prancha__desenho, .prancha--hero .prancha__desenho');
  const revelarTudo = function () {
    desenhaveis.forEach(function (d) { d.classList.add('desenhada'); });
  };
  if (reduzido) {
    revelarTudo();
  } else if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add('desenhada');
        obs.unobserve(entrada.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.15 });
    desenhaveis.forEach(function (d) { obs.observe(d); });
    /* Rede de segurança: se o observador não disparar, o desenho aparece. */
    window.setTimeout(revelarTudo, 6000);
  } else {
    revelarTudo();
  }

  window.addEventListener('pagehide', limparTemporizadores);
  } catch (erro) {
    /* Se qualquer coisa falhar aqui, a página volta ao estado sem JS:
       as plantas aparecem e nenhum conteúdo fica escondido. */
    document.documentElement.classList.remove('js');
    if (window.console && console.error) console.error('Falha no script do modelo 07:', erro);
  }
}
