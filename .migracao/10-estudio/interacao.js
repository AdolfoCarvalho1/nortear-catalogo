
(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function brl(v) {
    return 'R$ ' + String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
  /* Produto de preço fixo devolve um número só, não uma faixa falsa. */
  function faixa(a, b) { return a === b ? brl(a) : brl(a) + ' a ' + brl(b); }
  function arredondar(v) { return Math.round(v / 500) * 500; }
  function semanas(a, b) {
    if (a === b) return a === 1 ? '1 semana' : a + ' semanas';
    return a + ' a ' + b + ' semanas';
  }
  function criar(tag, classe, texto) {
    var el = document.createElement(tag);
    if (classe) el.className = classe;
    if (texto !== undefined && texto !== null) el.textContent = texto;
    return el;
  }
  /* Linha de catálogo: nome, fio pontilhado e valor. O fio é o que faz a
     tabela parecer impressa em vez de montada em caixa. */
  function linhaValor(nome, valor, classe) {
    var li = criar('li', 'linha' + (classe ? ' ' + classe : ''));
    li.appendChild(criar('span', 'linha__nome', nome));
    var fio = criar('span', 'linha__fio');
    fio.setAttribute('aria-hidden', 'true');
    li.appendChild(fio);
    li.appendChild(criar('span', 'linha__valor num', valor));
    return li;
  }

  /* =========================================================
     1. Manifesto montado palavra por palavra (controle 1)
     Sem JS ou com movimento reduzido, o texto fica inteiro em
     --papel: o manifesto nunca depende do efeito para existir.
     ========================================================= */
  var frase = $('#manifesto-frase');
  if (frase && !semMovimento && 'IntersectionObserver' in window) {
    var palavras = frase.textContent.trim().split(/\s+/);
    frase.textContent = '';
    var nos = palavras.map(function (p, i) {
      var s = criar('span', 'palavra', p);
      frase.appendChild(s);
      if (i < palavras.length - 1) frase.appendChild(document.createTextNode(' '));
      return s;
    });
    frase.classList.add('frase--montada');
    var olhoPalavra = new IntersectionObserver(function (entradas) {
      var atraso = 0;
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.style.transitionDelay = Math.min(atraso * 22, 260) + 'ms';
        e.target.classList.add('palavra--acesa');
        atraso++;
        olhoPalavra.unobserve(e.target);
      });
    }, { rootMargin: '-42% 0px -42% 0px', threshold: 0 });
    nos.forEach(function (n) { olhoPalavra.observe(n); });
  }

  /* =========================================================
     2. Os símbolos se desenham quando entram na tela
     ========================================================= */
  var simbolos = $$('.capa__simbolo');
  if (simbolos.length && !semMovimento && 'IntersectionObserver' in window) {
    document.body.classList.add('desenha');
    var olhoSimbolo = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('desenhado');
        olhoSimbolo.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.3 });
    simbolos.forEach(function (s) { olhoSimbolo.observe(s); });
  }

  /* =========================================================
     3. Navegação: a fita marca a seção onde você está
     ========================================================= */
  var elos = $$('#nav a');
  var secoes = elos.map(function (a) { return $(a.getAttribute('href')); }).filter(Boolean);
  if (secoes.length && 'IntersectionObserver' in window) {
    var dentro = {};
    var olhoSecao = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) { dentro[e.target.id] = e.isIntersecting; });
      var atual = null;
      secoes.forEach(function (s) { if (!atual && dentro[s.id]) atual = s.id; });
      elos.forEach(function (a) {
        if (atual && a.getAttribute('href') === '#' + atual) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    secoes.forEach(function (s) { olhoSecao.observe(s); });
  }

  /* =========================================================
     4. Orçamentador de projeto (controle 2)
     Regras de negócio reais: embalagem exige identidade, naming
     não sai avulso, consultoria não entra no mesmo escopo e
     acima de 500 pessoas o comitê soma 25 %.
     ========================================================= */
  var ITENS = {
    naming: { nome: 'Naming', min: 16000, max: 24000, semMin: 3, semMax: 5 },
    identidade: { nome: 'Identidade visual', min: 22000, max: 34000, semMin: 5, semMax: 8 },
    sistema: { nome: 'Sistema e manual', min: 9000, max: 14000, semMin: 2, semMax: 4 },
    embalagem: { nome: 'Embalagem', min: 16000, max: 28000, semMin: 4, semMax: 6 },
    motion: { nome: 'Motion e vinheta', min: 9000, max: 18000, semMin: 3, semMax: 5 },
    consultoria: { nome: 'Consultoria de sistema', min: 6500, max: 6500, semMin: 2, semMax: 2 }
  };
  var CHAVES = ['naming', 'identidade', 'sistema', 'embalagem', 'motion', 'consultoria'];
  var PACOTE = ['naming', 'identidade', 'sistema'];
  var DESCONTO_PACOTE = 9000;
  var PRAZOS = {
    '3m': { rotulo: 'Tenho 3 meses', semanas: 13 },
    '2m': { rotulo: 'Tenho 2 meses', semanas: 9 },
    '1m': { rotulo: 'Preciso em 1 mês', semanas: 4 },
    'sem': { rotulo: 'Sem pressa', semanas: 0 }
  };
  var PORTES = {
    p30: { rotulo: '30 a 100 pessoas', acrescimo: 0, semanas: 0 },
    p100: { rotulo: '100 a 500 pessoas', acrescimo: 0, semanas: 0 },
    p500: { rotulo: 'Mais de 500 pessoas', acrescimo: 0.25, semanas: 2 }
  };

  var formOrc = $('#form-orcamento');
  var saida = $('#orcamento-saida');
  var botaoCalcular = $('#btn-calcular');
  var marcados = [];
  var prazoAtual = '3m';
  var porteAtual = 'p30';

  function calcular() {
    var itens = marcados.slice();
    var temPacote = PACOTE.every(function (k) { return itens.indexOf(k) > -1; });
    var somaMin = 0;
    var somaMax = 0;
    var maiorSemMin = 0;
    var maiorSemMax = 0;
    itens.forEach(function (k) {
      somaMin += ITENS[k].min;
      somaMax += ITENS[k].max;
      maiorSemMin = Math.max(maiorSemMin, ITENS[k].semMin);
      maiorSemMax = Math.max(maiorSemMax, ITENS[k].semMax);
    });
    var desconto = temPacote ? DESCONTO_PACOTE : 0;
    var baseMin = somaMin - desconto;
    var baseMax = somaMax - desconto;
    var extra = PORTES[porteAtual].semanas;
    var semMin = maiorSemMin + (itens.length - 1) + extra;
    var semMax = maiorSemMax + (itens.length - 1) * 2 + extra;
    /* O pacote roda as três frentes em paralelo: o prazo é o da identidade
       completa publicada na tabela de serviços, não a soma das etapas. */
    if (temPacote) {
      semMin = Math.max(semMin, 8);
      semMax = Math.max(semMax, 12);
    }
    var brutoMin = baseMin * (1 + PORTES[porteAtual].acrescimo);
    var brutoMax = baseMax * (1 + PORTES[porteAtual].acrescimo);
    return {
      itens: itens,
      pacote: temPacote,
      somaMin: somaMin,
      somaMax: somaMax,
      desconto: desconto,
      baseMin: baseMin,
      baseMax: baseMax,
      acrescimo: PORTES[porteAtual].acrescimo,
      porteValorMin: baseMin * PORTES[porteAtual].acrescimo,
      porteValorMax: baseMax * PORTES[porteAtual].acrescimo,
      brutoMin: brutoMin,
      brutoMax: brutoMax,
      min: arredondar(brutoMin),
      max: arredondar(brutoMax),
      semMin: semMin,
      semMax: semMax,
      porte: porteAtual,
      prazo: prazoAtual
    };
  }

  /* Bloqueios: cada um devolve o texto e as ações que resolvem o problema. */
  function bloqueio(itens) {
    if (!itens.length) return { chave: 'vazio' };
    if (itens.indexOf('consultoria') > -1 && itens.length > 1) {
      return {
        chave: 'misto',
        titulo: 'Consultoria não entra no mesmo escopo.',
        texto: 'Ela é um produto separado: diagnóstico e duas sessões com o time, R$ 6.500, para organizar o que você já tem. Misturada com um projeto de identidade, ela vira reunião sem dono, e a gente prefere não vender isso.',
        acoes: [
          { rotulo: 'Deixar só a consultoria', tipo: 'so-consultoria' },
          { rotulo: 'Tirar a consultoria do escopo', tipo: 'sem-consultoria' }
        ]
      };
    }
    if (itens.length === 1 && itens[0] === 'naming') {
      return {
        chave: 'naming-avulso',
        titulo: 'Naming avulso a gente não faz.',
        texto: 'Um nome entregue sozinho não se sustenta: ele precisa do desenho e das regras para virar marca. O caminho é a identidade completa, que junta naming, logo, sistema e manual numa frente só, e sai mais barata que contratar as três separadas.',
        acoes: [{ rotulo: 'Montar a identidade completa', tipo: 'pacote' }]
      };
    }
    if (itens.indexOf('embalagem') > -1 && itens.indexOf('identidade') === -1) {
      return {
        chave: 'embalagem',
        titulo: 'Embalagem só entra com identidade visual.',
        texto: 'Rótulo é aplicação de sistema, não desenho solto. Sem a identidade marcada, a embalagem vira um exercício bonito que não conversa com o resto da marca, e a gráfica cobra a reimpressão.',
        acoes: [{ rotulo: 'Marcar identidade visual também', tipo: 'com-identidade' }]
      };
    }
    return { chave: 'ok' };
  }

  function aplicarAcao(tipo) {
    var caixas = $$('input[name="escopo"]');
    caixas.forEach(function (c) {
      if (tipo === 'so-consultoria') c.checked = c.value === 'consultoria';
      else if (tipo === 'sem-consultoria') { if (c.value === 'consultoria') c.checked = false; }
      else if (tipo === 'pacote') c.checked = PACOTE.indexOf(c.value) > -1;
      else if (tipo === 'com-identidade') { if (c.value === 'identidade') c.checked = true; }
    });
    lerEscopo();
    calcularEmostrar();
  }

  function estadoVazio() {
    saida.setAttribute('aria-busy', 'false');
    saida.innerHTML = '';
    saida.appendChild(criar('p', 'rotulo', 'Faixa de investimento'));
    saida.appendChild(criar('p', 'saida__vazio', 'Nenhum item marcado ainda. Marque o que você precisa e a faixa aparece aqui, com a conta linha por linha.'));
    var dica = criar('ul', 'saida__dica');
    dica.appendChild(criar('li', null, 'Identidade completa: a partir de R$ 38.000, em 8 a 12 semanas'));
    dica.appendChild(criar('li', null, 'Embalagem depende da identidade: rótulo é aplicação de sistema'));
    dica.appendChild(criar('li', null, 'Consultoria de sistema: R$ 6.500, sozinha, em 2 semanas'));
    saida.appendChild(dica);
  }

  function estadoErro(b) {
    saida.setAttribute('aria-busy', 'false');
    saida.innerHTML = '';
    var caixa = criar('div', 'erro');
    caixa.appendChild(criar('p', 'rotulo', 'Escopo não fecha'));
    caixa.appendChild(criar('p', 'erro__titulo', b.titulo));
    caixa.appendChild(criar('p', 'erro__texto', b.texto));
    var acoes = criar('div', 'erro__acoes');
    b.acoes.forEach(function (a) {
      var bt = criar('button', 'botao botao--pequeno', a.rotulo);
      bt.type = 'button';
      bt.addEventListener('click', function () { aplicarAcao(a.tipo); });
      acoes.appendChild(bt);
    });
    caixa.appendChild(acoes);
    saida.appendChild(caixa);
    saida.focus();
  }

  function estadoCarregando() {
    saida.setAttribute('aria-busy', 'true');
    saida.innerHTML = '';
    saida.appendChild(criar('p', 'rotulo', 'Faixa de investimento'));
    var cx = criar('div', 'carregando');
    cx.appendChild(criar('p', 'carregando__texto', 'Somando o escopo e conferindo o prazo…'));
    cx.appendChild(criar('span', 'carregando__fita'));
    saida.appendChild(cx);
  }

  function estadoResultado(r) {
    saida.setAttribute('aria-busy', 'false');
    saida.innerHTML = '';
    saida.appendChild(criar('p', 'rotulo', 'Faixa de investimento'));
    saida.appendChild(criar('p', 'saida__faixa num', faixa(r.min, r.max)));
    saida.appendChild(criar('p', 'saida__prazo',
      'Prazo estimado: ' + semanas(r.semMin, r.semMax) + ' · ' + r.itens.length +
      (r.itens.length === 1 ? ' item no escopo' : ' itens no escopo')));

    var lista = criar('ul', 'composicao');
    r.itens.forEach(function (k) {
      lista.appendChild(linhaValor(ITENS[k].nome, faixa(ITENS[k].min, ITENS[k].max)));
    });
    if (r.desconto) lista.appendChild(linhaValor('Desconto de pacote', '− ' + brl(r.desconto), 'linha--desconto'));
    if (r.acrescimo) lista.appendChild(linhaValor('Complexidade de stakeholders (+25 %)', '+ ' + brl(r.porteValorMin) + ' a ' + brl(r.porteValorMax), 'linha--soma'));
    saida.appendChild(lista);
    /* Sem o manual, o pacote sai pelo mesmo preço: é mais honesto avisar
       do que deixar o cliente descobrir depois. */
    if (!r.pacote && r.itens.indexOf('naming') > -1 && r.itens.indexOf('identidade') > -1 && r.itens.indexOf('sistema') === -1) {
      saida.appendChild(criar('p', 'saida__nota', 'Sistema e manual entra no mesmo pacote: marque o item ao lado e a faixa continua a mesma, com o manual de 60 a 90 páginas e os arquivos abertos incluídos.'));
    }

    var memoria = criar('details', 'memoria');
    memoria.open = true;
    memoria.appendChild(criar('summary', null, 'Memória de cálculo'));
    var passos = criar('ol', 'memoria__lista');
    var nomes = r.itens.map(function (k) { return ITENS[k].nome; });
    passos.appendChild(criar('li', null,
      'Soma mínima: ' + nomes.map(function (k) { return brl(ITENS[k].min); }).join(' + ') + ' = ' + brl(r.somaMin)));
    passos.appendChild(criar('li', null,
      'Soma máxima: ' + nomes.map(function (k) { return brl(ITENS[k].max); }).join(' + ') + ' = ' + brl(r.somaMax)));
    if (r.desconto) {
      passos.appendChild(criar('li', null,
        'Pacote identidade completa (naming, logo, sistema e manual numa frente só): ' + brl(r.somaMin) + ' − ' + brl(r.desconto) + ' = ' + brl(r.baseMin) + ' no mínimo, ' + brl(r.somaMax) + ' − ' + brl(r.desconto) + ' = ' + brl(r.baseMax) + ' no máximo.'));
    }
    passos.appendChild(criar('li', null,
      'Prazo: a etapa mais longa pede ' + semanas(Math.max.apply(null, r.itens.map(function (k) { return ITENS[k].semMin; })), Math.max.apply(null, r.itens.map(function (k) { return ITENS[k].semMax; }))) +
      '; cada item a mais soma 1 semana de revisão no mínimo e 2 no máximo.'));
    if (r.pacote) {
      passos.appendChild(criar('li', null,
        'No pacote as três frentes rodam em paralelo: o prazo é o da identidade completa publicada na tabela, ' + semanas(r.semMin, r.semMax) + '.'));
    }
    if (r.acrescimo) {
      passos.appendChild(criar('li', null,
        'Acima de 500 pessoas a marca passa por comitê, jurídico e compliance: o que era uma aprovação vira quatro. O acréscimo de 25 % paga esse tempo de alinhamento: ' +
        brl(r.baseMin) + ' → ' + brl(r.baseMin * 1.25) + ' e ' + brl(r.baseMax) + ' → ' + brl(r.baseMax * 1.25) + '. O prazo também sobe 2 semanas, já contadas acima.'));
    }
    if (r.min !== Math.round(r.brutoMin) || r.max !== Math.round(r.brutoMax)) {
      passos.appendChild(criar('li', null, 'Faixa comercial arredondada para os R$ 500 mais próximos: ' + faixa(r.min, r.max) + '.'));
    }
    memoria.appendChild(passos);
    saida.appendChild(memoria);

    var pedido = PRAZOS[r.prazo].semanas;
    if (pedido && r.semMin > pedido) {
      var aviso = criar('div', 'aviso');
      aviso.appendChild(criar('span', 'aviso__fita'));
      aviso.appendChild(criar('p', 'aviso__titulo', r.prazo === '1m' && r.itens.length > 2
        ? 'Um mês não é possível com mais de dois itens.'
        : 'O seu prazo é menor do que o escopo pede.'));
      aviso.appendChild(criar('p', 'aviso__texto', r.prazo === '1m' && r.itens.length > 2
        ? 'Cada frente precisa de duas a três semanas só de aprovação sua, e elas não cabem em quatro semanas. Com esse escopo o prazo real é de ' + semanas(r.semMin, r.semMax) + '. Cabe reduzir o escopo ou começar pela consultoria de sistema (R$ 6.500, 2 semanas) enquanto a identidade não entra.'
        : 'Você pediu ' + PRAZOS[r.prazo].rotulo.toLowerCase().replace('tenho ', '').replace('preciso em ', '') + ' e este escopo pede ' + semanas(r.semMin, r.semMax) + '. Cabe reduzir o escopo ou usar a consultoria de sistema (R$ 6.500) como primeiro passo.'));
      saida.appendChild(aviso);
    }

    var acoes = criar('div', 'saida__acoes');
    var enviar = criar('button', 'botao', 'Enviar esse escopo');
    enviar.type = 'button';
    enviar.id = 'btn-enviar-escopo';
    enviar.addEventListener('click', function () { enviarEscopo(r); });
    acoes.appendChild(enviar);
    saida.appendChild(acoes);
    saida.appendChild(criar('p', 'miudo', 'Mudou alguma coisa acima? Recalcule: a faixa acompanha o escopo, não a conversa.'));
  }

  function enviarEscopo(r) {
    var texto = [
      'Escopo: ' + r.itens.map(function (k) { return ITENS[k].nome; }).join(', ') + '.',
      'Faixa calculada: ' + faixa(r.min, r.max) + '.',
      'Prazo estimado: ' + semanas(r.semMin, r.semMax) + '.',
      'Porte da empresa: ' + PORTES[r.porte].rotulo + '.',
      'Prazo desejado: ' + PRAZOS[r.prazo].rotulo + '.'
    ].join('\n');
    var campo = $('#mensagem');
    var atual = campo.value.trim();
    campo.value = atual ? atual + '\n\n' + texto : texto;
    $('#escopo-resumo').textContent = r.itens.length + (r.itens.length === 1 ? ' item · ' : ' itens · ') + faixa(r.min, r.max) + ' · ' + semanas(r.semMin, r.semMax);
    $('#escopo-anexado').hidden = false;
    $('#contato').scrollIntoView({ behavior: semMovimento ? 'auto' : 'smooth', block: 'start' });
    $('#nome').focus({ preventScroll: true });
  }

  function lerEscopo() {
    marcados = $$('input[name="escopo"]:checked').map(function (c) { return c.value; });
    var radios = $('input[name="prazo"]:checked');
    if (radios) prazoAtual = radios.value;
    var rp = $('input[name="porte"]:checked');
    if (rp) porteAtual = rp.value;
  }

  function marcarErros(itens) {
    $$('input[name="escopo"]').forEach(function (c) {
      var problematico = false;
      if (itens.indexOf('consultoria') > -1 && itens.length > 1) problematico = c.checked;
      else if (itens.length === 1 && itens[0] === 'naming') problematico = c.value === 'naming';
      else if (itens.indexOf('embalagem') > -1 && itens.indexOf('identidade') === -1) problematico = c.value === 'embalagem';
      var etiqueta = c.closest('.escolha');
      if (etiqueta) etiqueta.classList.toggle('escolha--erro', problematico);
      c.setAttribute('aria-invalid', problematico ? 'true' : 'false');
    });
  }

  function calcularEmostrar() {
    lerEscopo();
    var b = bloqueio(marcados);
    if (b.chave === 'vazio') {
      marcarErros([]);
      estadoVazio();
      return;
    }
    if (b.chave !== 'ok') {
      marcarErros(marcados);
      estadoErro(b);
      return;
    }
    marcarErros([]);
    estadoCarregando();
    var espera = semMovimento ? 0 : 480;
    window.setTimeout(function () { estadoResultado(calcular()); }, espera);
  }

  formOrc.addEventListener('submit', function (e) {
    e.preventDefault();
    botaoCalcular.disabled = true;
    botaoCalcular.textContent = 'Calculando…';
    calcularEmostrar();
    window.setTimeout(function () {
      botaoCalcular.disabled = false;
      botaoCalcular.textContent = 'Calcular faixa de investimento';
    }, semMovimento ? 60 : 560);
  });

  /* Trocar um item depois do resultado avisa que a faixa envelheceu. */
  $$('input[name="escopo"], input[name="prazo"], input[name="porte"]').forEach(function (c) {
    c.addEventListener('change', function () {
      lerEscopo();
      var jaTemResultado = $('.saida__faixa', saida) || $('.erro', saida);
      if (!jaTemResultado) return;
      var aviso = $('.saida__velho', saida);
      if (!aviso) {
        var p = criar('p', 'saida__velho', 'Escopo mudou desde o último cálculo. Toque em “Calcular faixa de investimento” para atualizar.');
        saida.insertBefore(p, saida.firstChild ? saida.firstChild.nextSibling : null);
      }
    });
  });

  $('#btn-remover-escopo').addEventListener('click', function () {
    $('#mensagem').value = '';
    $('#escopo-anexado').hidden = true;
    $('#escopo-resumo').textContent = '';
  });

  /* O estado vazio do orçamentador já está no HTML: reescrever a região viva
     ao carregar só renderia um anúncio inútil no leitor de tela. */

  /* =========================================================
     5. Formulário com validação real
     ========================================================= */
  var regras = {
    nome: function (v) { return v.trim().length >= 2 ? '' : 'Escreva pelo menos 2 letras do seu nome.'; },
    empresa: function (v) { return v.trim().length >= 2 ? '' : 'Diga o nome da empresa.'; },
    email: function (v) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) return 'Confira o e-mail: falta algo como nome@empresa.com.br.';
      return '';
    },
    mensagem: function (v) {
      if (v.trim().length < 15) return 'Escreva pelo menos uma frase sobre o que você precisa.';
      return '';
    }
  };

  function validar(nome) {
    var input = $('[name="' + nome + '"]');
    if (!input) return true;
    var msg = regras[nome](input.value);
    var caixa = $('[data-campo="' + nome + '"]');
    caixa.classList.toggle('campo--erro', Boolean(msg));
    $('[data-erro="' + nome + '"]').textContent = msg;
    input.setAttribute('aria-invalid', String(Boolean(msg)));
    return !msg;
  }

  Object.keys(regras).forEach(function (nome) {
    var input = $('[name="' + nome + '"]');
    input.addEventListener('blur', function () { validar(nome); });
    input.addEventListener('input', function () {
      if ($('[data-campo="' + nome + '"]').classList.contains('campo--erro')) validar(nome);
    });
  });

  $('#form-contato').addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = Object.keys(regras).map(validar).every(Boolean);
    if (!ok) {
      var primeiro = $('.campo--erro input, .campo--erro textarea');
      if (primeiro) primeiro.focus();
      return;
    }
    var botao = $('#btn-contato');
    botao.disabled = true;
    botao.textContent = 'Enviando…';
    window.setTimeout(function () {
      var caixa = $('#recado-ok');
      var primeiro = $('#nome').value.trim().split(' ')[0];
      caixa.hidden = false;
      caixa.innerHTML = '';
      caixa.appendChild(criar('b', null, 'Recebido, ' + primeiro + '.'));
      caixa.appendChild(criar('span', null, 'Em uma versão publicada, a resposta chegaria agora em ' + $('#email').value.trim() +
        ' com uma faixa, um prazo e o nome de quem conduz o projeto. A gente lê toda mensagem na terça e na quinta.'));
      botao.disabled = false;
      botao.textContent = 'Chamar para um projeto';
      caixa.scrollIntoView({ block: 'nearest', behavior: semMovimento ? 'auto' : 'smooth' });
    }, semMovimento ? 60 : 600);
  });
})();
