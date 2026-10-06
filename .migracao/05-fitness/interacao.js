
(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var nf = new Intl.NumberFormat('pt-BR');
  var nf1 = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  var brl = function (v) { return 'R$ ' + nf.format(v); };
  /* Carga inteira escreve inteira: 80 kg, não 80,0 kg */
  var carga = function (v) { return v % 1 === 0 ? nf.format(v) : nf1.format(v); };

  /* Ícones desenhados, traço 2 — usados só onde significam algo */
  var ICONE_OK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12.5l5.2 5.2L20 6.6"/></svg>';
  var ICONE_AVISO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8v5M12 16.5v.5M12 4l8 14H4z"/></svg>';

  /* =========================================================
     1. DIÁRIO DE SÉRIE — volume de três séries, comparado
     ========================================================= */
  var EXERCICIOS = {
    agachamento: { nome: 'Agachamento livre', quando: 'há 3 dias', anterior: [[80, 8], [80, 8], [78, 7]] },
    terra: { nome: 'Levantamento terra', quando: 'há 5 dias', anterior: [[92, 6], [92, 6], [90, 5]] },
    supino: { nome: 'Supino reto', quando: 'há 2 dias', anterior: [[60, 10], [62, 8], [62, 8]] }
  };
  var LIMITE = { cargaMin: 1, cargaMax: 500, repsMin: 1, repsMax: 50 };

  var formDiario = $('#form-diario');
  var saidaDiario = $('#saida-diario');
  var selectExercicio = $('#exercicio');
  var refDiario = $('#diario-ref');
  var btnDiario = $('#btn-diario');

  function volumeDe(lista) {
    return lista.reduce(function (t, s) { return t + s[0] * s[1]; }, 0);
  }

  function pintarRef() {
    var ex = EXERCICIOS[selectExercicio.value];
    refDiario.textContent = 'Última sessão registrada de ' + ex.nome.toLowerCase() + ': '
      + ex.quando + ' · 3 séries · ' + nf.format(volumeDe(ex.anterior)) + ' kg de volume.';
  }

  function erroCampo(id, msg) {
    var caixa = $('[data-campo="' + id + '"]');
    var alvo = $('#' + id);
    var saida = $('[data-erro="' + id + '"]');
    if (caixa) caixa.classList.toggle('campo--erro', Boolean(msg));
    if (alvo) alvo.setAttribute('aria-invalid', String(Boolean(msg)));
    if (saida) saida.textContent = msg || '';
    return !msg;
  }

  function lerSerie(i) {
    var carga = $('[name="carga-' + i + '"]').value.trim().replace(',', '.');
    var reps = $('[name="reps-' + i + '"]').value.trim();
    var erros = [];
    var nCarga = parseFloat(carga);
    var nReps = parseFloat(reps);

    if (!carga) erros.push(erroCampo('carga-' + i, 'Informe a carga da série ' + i + '.'));
    else if (isNaN(nCarga)) erros.push(erroCampo('carga-' + i, 'Use só números na carga da série ' + i + '.'));
    else if (nCarga < LIMITE.cargaMin || nCarga > LIMITE.cargaMax) erros.push(erroCampo('carga-' + i, 'A carga da série ' + i + ' precisa ficar entre 1 e 500 kg.'));
    else erros.push(erroCampo('carga-' + i, ''));

    if (!reps) erros.push(erroCampo('reps-' + i, 'Informe as repetições da série ' + i + '.'));
    else if (isNaN(nReps)) erros.push(erroCampo('reps-' + i, 'Use só números nas repetições da série ' + i + '.'));
    else if (Math.round(nReps) !== nReps) erros.push(erroCampo('reps-' + i, 'Repetições é número inteiro: sem meia repetição.'));
    else if (nReps < LIMITE.repsMin || nReps > LIMITE.repsMax) erros.push(erroCampo('reps-' + i, 'As repetições da série ' + i + ' precisam ficar entre 1 e 50.'));
    else erros.push(erroCampo('reps-' + i, ''));

    var valido = erros.every(Boolean);
    var sub = $('#sub-' + i);
    if (valido) {
      sub.textContent = carga(nCarga) + ' × ' + nReps + ' = ' + nf.format(nCarga * nReps) + ' kg';
      sub.classList.add('serie__sub--cheio');
    } else {
      sub.textContent = '—';
      sub.classList.remove('serie__sub--cheio');
    }
    return valido ? { carga: nCarga, reps: nReps } : null;
  }

  function animarBarra(el, pct) {
    el.style.setProperty('--w', pct + '%');
    if (reduzido) { el.style.transform = 'scaleX(1)'; return; }
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () { el.style.transform = 'scaleX(1)'; });
    });
  }

  function montarResultado(series, volume, anterior, ex) {
    var maior = Math.max(volume, anterior);
    var diff = ((volume - anterior) / anterior) * 100;
    var variacao = Math.round(diff);
    var obs, obs2;

    if (variacao > 1) {
      obs = 'Volume ' + variacao + ' % acima da última sessão registrada.';
      obs2 = 'Mesma quantidade de séries, mais carga: é assim que a progressão aparece no diário. O Rafa olharia esse número antes de liberar mais peso na próxima sessão.';
    } else if (variacao < -1) {
      obs = 'Volume ' + Math.abs(variacao) + ' % abaixo da última sessão registrada.';
      obs2 = 'Dia de recarga não é fracasso, mas precisa de motivo escrito: sono curto, alimentação ou semana de recarga programada. Sem o motivo, a queda vira dúvida no fim do ciclo.';
    } else {
      obs = 'Volume praticamente igual ao da última sessão registrada.';
      obs2 = 'Mesmo estímulo, mesma resposta. Se isso se repetir por três sessões seguidas, o plano muda: mais carga, mais repetição ou outro exercício.';
    }

    saidaDiario.innerHTML =
      '<p class="rotulo">Volume total das 3 séries</p>'
      + '<p class="saida__valor"><b>' + nf.format(volume) + '</b><span>kg</span></p>'
      + '<p class="saida__contexto">Soma de carga × repetição das três séries de ' + ex.nome.toLowerCase() + '. Volume é a medida que compara sessões diferentes, mesmo quando a série muda de tamanho.</p>'
      + '<div class="comparacao">'
      + '  <div class="barra"><span class="barra__rot">Última sessão · ' + ex.quando + '<b>' + nf.format(anterior) + ' kg</b></span>'
      + '    <span class="barra__trilho"><i data-pct="' + Math.round((anterior / maior) * 100) + '"></i></span></div>'
      + '  <div class="barra barra--atual"><span class="barra__rot">Hoje<b>' + nf.format(volume) + ' kg</b></span>'
      + '    <span class="barra__trilho"><i data-pct="' + Math.round((volume / maior) * 100) + '"></i></span></div>'
      + '</div>'
      + '<p class="saida__obs">' + obs + '<span>' + obs2 + '</span></p>'
      + '<dl class="memoria">'
      + series.map(function (s, i) {
          return '<div><dt>Série ' + (i + 1) + '</dt><dd>' + carga(s.carga) + ' kg × ' + s.reps
            + ' repetições = ' + nf.format(s.carga * s.reps) + ' kg</dd></div>';
        }).join('')
      + '  <div><dt>Volume de hoje</dt><dd>' + nf.format(volume) + ' kg</dd></div>'
      + '  <div><dt>Última sessão · ' + ex.nome.toLowerCase() + '</dt><dd>' + nf.format(anterior) + ' kg em 3 séries</dd></div>'
      + '  <div><dt>Diferença</dt><dd>' + (diff >= 0 ? '+' : '−') + nf1.format(Math.abs(diff)) + ' %</dd></div>'
      + '</dl>';

    $$('.barra__trilho i', saidaDiario).forEach(function (el) { animarBarra(el, el.dataset.pct); });
  }

  function limparDiario(focar) {
    ['carga-1', 'reps-1', 'carga-2', 'reps-2', 'carga-3', 'reps-3'].forEach(function (id) {
      $('#' + id).value = '';
      erroCampo(id, '');
    });
    ['sub-1', 'sub-2', 'sub-3'].forEach(function (id) {
      $('#' + id).textContent = '—';
      $('#' + id).classList.remove('serie__sub--cheio');
    });
    saidaDiario.removeAttribute('aria-busy');
    saidaDiario.innerHTML = '<p class="vazio"><b>Ainda sem número</b>Lance as três séries ao lado. O volume é a soma de carga × repetição de cada série, e ele só aparece depois que as seis informações estiverem dentro da faixa aceita: carga de 1 a 500 kg e repetições de 1 a 50.</p>';
    if (focar) $('#carga-1').focus();
  }

  formDiario.addEventListener('submit', function (e) {
    e.preventDefault();
    var lidas = [1, 2, 3].map(function (i) { return lerSerie(i); });
    var invalidas = lidas.filter(function (l) { return !l; });

    if (invalidas.length) {
      saidaDiario.innerHTML = '<div class="erro-caixa"><b>Faltou informação</b><p>'
        + (invalidas.length === 1 ? 'Uma série ainda não está dentro da faixa aceita' : invalidas.length + ' séries ainda não estão dentro da faixa aceita')
        + '. Os campos com problema estão marcados ao lado — carga de 1 a 500 kg e repetições de 1 a 50.</p></div>';
      var primeiro = $('.campo--erro input', formDiario);
      if (primeiro) primeiro.focus();
      return;
    }

    var ex = EXERCICIOS[selectExercicio.value];
    var series = lidas.map(function (l) { return [l.carga, l.reps]; });
    var volume = volumeDe(series);
    var anterior = volumeDe(ex.anterior);

    btnDiario.disabled = true;
    btnDiario.textContent = 'Somando…';
    saidaDiario.setAttribute('aria-busy', 'true');
    saidaDiario.innerHTML = '<p class="rotulo">Somando as três séries</p><div class="esqueleto" aria-hidden="true"><span></span><span></span><span></span></div>';

    window.setTimeout(function () {
      montarResultado(series, volume, anterior, ex);
      saidaDiario.removeAttribute('aria-busy');
      btnDiario.disabled = false;
      btnDiario.textContent = 'Calcular volume';
    }, reduzido ? 120 : 520);
  });

  $('#btn-limpar').addEventListener('click', function () { limparDiario(true); });

  selectExercicio.addEventListener('change', function () {
    pintarRef();
    limparDiario(false);
    $('#carga-1').focus();
  });

  ['carga-1', 'reps-1', 'carga-2', 'reps-2', 'carga-3', 'reps-3'].forEach(function (id) {
    var campo = $('#' + id);
    campo.addEventListener('input', function () {
      if ($('[data-campo="' + id + '"]').classList.contains('campo--erro')) {
        var i = id.split('-')[1];
        lerSerie(Number(i));
      }
    });
  });

  pintarRef();

  /* =========================================================
     2. MONTADOR DE PLANO — proposta com memória do cálculo
     ========================================================= */
  var TABELA = {
    presencial: { 2: 620, 3: 820, 4: 1020 },
    online: { 2: 240, 3: 320, 4: 390 }
  };
  var PESO = { presencial: 0.6, online: 0.4 };
  var OBJETIVOS = {
    emagrecer: {
      nome: 'emagrecer',
      enfase: 'condicionamento + acompanhamento de peso',
      incluso: 'Bloco de condicionamento no fim de cada sessão, com 20 min de bike ou remo e a carga anotada.'
    },
    forca: {
      nome: 'ganhar força',
      enfase: 'bloco de força',
      incluso: 'Progressão registrada série por série, com aquecimento de 12 min e teste de 1RM estimado na semana 1.'
    },
    condicionamento: {
      nome: 'melhorar o condicionamento',
      enfase: 'circuito medido',
      incluso: 'Circuito de quatro estações com o tempo de cada rodada medido e comparado ao do ciclo anterior.'
    },
    correr: {
      nome: 'correr 10 km',
      enfase: 'corrida + força',
      incluso: 'Planilha de corrida somada a duas sessões de força por semana, com o pace de cada treino anotado.'
    }
  };
  var NIVEIS = {
    nunca: { nome: 'nunca treinei', incluso: 'As duas primeiras semanas são com barra vazia e carga guiada, sem série até a falha.' },
    asvezes: { nome: 'treino às vezes', incluso: 'Ajuste de execução antes de subir carga, com o vídeo de cada exercício revisto com você.' },
    veterano: { nome: 'treino há mais de um ano', incluso: 'Teste de 1RM estimado na semana 1 e progressão por porcentagem da carga máxima.' }
  };
  var ONDE_ROTULO = { presencial: 'presencial, no studio do Batel', online: 'online, com planilha e vídeo', hibrido: 'híbrido · 60 % da tabela presencial + 40 % da tabela online' };

  var formPlano = $('#form-plano');
  var saidaPlano = $('#saida-plano');
  var btnPlano = $('#btn-plano');
  var campoFreq = $('#frequencia');
  var GRUPOS = [
    { chave: 'objetivo', erro: 'Escolha o objetivo principal — é ele que define a ênfase do plano.' },
    { chave: 'onde', erro: 'Diga onde você vai treinar: presencial, online ou híbrido.' },
    { chave: 'tempo', erro: 'Escolha o tempo que você tem por sessão: 30, 45 ou 60 min.' },
    { chave: 'nivel', erro: 'Diga o seu nível de hoje, mesmo que seja "nunca treinei".' }
  ];
  var FRASES_FREQ = {
    2: 'duas sessões por semana, com pelo menos 48 h entre elas',
    3: 'o formato mais comum no studio, com 48 h de descanso entre as sessões',
    4: 'quatro sessões por semana — a quarta pode ser mais curta, de 30 min'
  };

  function lerRadio(nome) {
    var marcado = $('input[name="' + nome + '"]:checked', formPlano);
    return marcado ? marcado.value : '';
  }

  function marcarOpcao(input) {
    var grupo = input.closest('.grupo');
    if (!grupo) return;
    $$('.opcao', grupo).forEach(function (o) { o.classList.remove('opcao--marcada'); });
    input.closest('.opcao').classList.add('opcao--marcada');
  }

  $$('input[type="radio"]', formPlano).forEach(function (input) {
    input.addEventListener('change', function () {
      marcarOpcao(input);
      var chave = input.name;
      var grupo = $('[data-grupo="' + chave + '"]');
      grupo.classList.remove('grupo--erro');
      grupo.setAttribute('aria-invalid', 'false');
      $('[data-erro-grupo="' + chave + '"]').textContent = '';
    });
  });

  /* O input do opcional é invisível, então o anel de foco precisa
     aparecer no rótulo — inclusive onde :has() não resolver. */
  var viaTeclado = false;
  document.addEventListener('keydown', function () { viaTeclado = true; });
  document.addEventListener('mousedown', function () { viaTeclado = false; });
  formPlano.addEventListener('focusin', function (e) {
    var opcao = e.target.closest && e.target.closest('.opcao');
    if (opcao && viaTeclado) opcao.classList.add('opcao--foco');
  });
  formPlano.addEventListener('focusout', function (e) {
    var opcao = e.target.closest && e.target.closest('.opcao');
    if (opcao) opcao.classList.remove('opcao--foco');
  });

  function valorFreq() {
    var v = Number(campoFreq.value);
    $$('.marcas span').forEach(function (s) { s.setAttribute('data-ativa', String(Number(s.dataset.freq) === v)); });
    $('#freq-saida').innerHTML = '<b>' + v + 'x</b> por semana — ' + FRASES_FREQ[v] + '.';
    return v;
  }
  campoFreq.addEventListener('input', valorFreq);
  valorFreq();

  function precoBase(onde, freq) {
    return onde === 'hibrido'
      ? TABELA.presencial[freq] * PESO.presencial + TABELA.online[freq] * PESO.online
      : TABELA[onde][freq];
  }

  /* 45 min é a sessão padrão; 30 min sai 10 % menos e 60 min 10 % mais */
  function precoFinal(onde, freq, tempo) {
    var pct = tempo === 30 ? -0.1 : tempo === 60 ? 0.1 : 0;
    var base = precoBase(onde, freq);
    var comAjuste = base * (1 + pct);
    return { base: base, pct: pct, comAjuste: comAjuste, final: Math.round(comAjuste / 5) * 5 };
  }

  function calcular(d) {
    var p = precoFinal(d.onde, d.freq, d.tempo);
    var precoPresencial = TABELA.presencial[d.freq];
    var precoOnline = TABELA.online[d.freq];
    var memoria = [];

    /* Ciclo: prova de corrida e bloco de força com 3x ou mais pedem 8 semanas */
    var oito = d.objetivo === 'correr' || (d.objetivo === 'forca' && d.freq >= 3);
    var semanas = oito ? 8 : 6;
    var motivoCiclo = d.objetivo === 'correr'
      ? 'prova de 10 km pede um bloco mais longo que o ciclo padrão do studio'
      : d.objetivo === 'forca'
        ? 'bloco de força com 3x ou mais por semana rende mais com 8 semanas entre testes'
        : 'o ciclo padrão do studio, fechado com a reavaliação';

    var studio = Math.ceil(d.freq / 2);
    var incluso = [
      'Avaliação inicial de 60 min com os 6 testes',
      'Reavaliação com os mesmos testes no fim do ciclo de ' + semanas + ' semanas',
      OBJETIVOS[d.objetivo].incluso,
      NIVEIS[d.nivel].incluso,
      'Planilha do ciclo impressa e digital, com carga, repetição e descanso'
    ];

    if (d.onde === 'presencial') {
      incluso.splice(3, 0, d.freq + ' sessões de ' + d.tempo + ' min por semana no studio, com 4 alunos por horário');
      incluso.push('Correção de execução série por série, com o diário conferido pelo Rafa');
    } else if (d.onde === 'online') {
      incluso.splice(3, 0, d.freq + ' sessões por semana pela planilha, com vídeo de execução de cada exercício');
      incluso.push('Correção em áudio do seu vídeo em até 1 dia útil, com a carga do próximo treino ajustada');
    } else {
      incluso.splice(3, 0, studio + ' sessões no studio e ' + (d.freq - studio) + ' pela planilha, toda semana');
      incluso.push('Correção em áudio nos dias online e correção de execução nos dias de studio');
    }

    memoria.push(['objetivo', OBJETIVOS[d.objetivo].nome + ' · ênfase em ' + OBJETIVOS[d.objetivo].enfase]);
    memoria.push(['nível hoje', NIVEIS[d.nivel].nome]);
    memoria.push(['onde', ONDE_ROTULO[d.onde]]);
    memoria.push(['frequência', d.freq + 'x por semana']);
    memoria.push(['tabela do mês', d.onde === 'hibrido'
      ? nf.format(PESO.presencial * 100) + ' % de ' + brl(precoPresencial) + ' + ' + nf.format(PESO.online * 100) + ' % de ' + brl(precoOnline) + ' = ' + brl(Math.round(p.base)) + '/mês'
      : brl(p.base) + '/mês na tabela ' + (d.onde === 'online' ? 'online' : 'presencial')]);
    memoria.push(['tempo de sessão', d.tempo + ' min · ' + (p.pct === 0
      ? 'sem ajuste: é a sessão padrão'
      : (p.pct > 0 ? '+10 %' : '−10 %') + ' → ' + (p.pct > 0 ? '+' : '−') + brl(Math.round(Math.abs(p.comAjuste - p.base))))]);
    memoria.push(['subtotal', brl(Math.round(p.comAjuste)) + '/mês']);
    memoria.push(['arredondamento', (p.final === Math.round(p.comAjuste) ? 'sem mudança · ' : brl(Math.round(p.comAjuste)) + ' → ') + brl(p.final) + '/mês, em múltiplo de 5']);
    memoria.push(['ciclo recomendado', semanas + ' semanas · ' + motivoCiclo]);

    var avisos = [];
    if (d.onde === 'presencial' && d.freq === 4 && d.tempo === 60) {
      avisos.push('Presencial 4x por semana com sessão de 60 min é o formato mais apertado da agenda: <b>o studio tem apenas 2 vagas nesse formato</b>. Se as duas estiverem ocupadas, a proposta vira híbrido — 2 dias no studio e 2 pela planilha — ou entra numa lista de espera que costuma andar em 3 semanas.');
    }
    if (d.onde === 'online' && d.objetivo === 'correr') {
      avisos.push('Para correr 10 km, a <b>consultoria de corrida sai por R$ 320/mês</b> — '
        + (320 < p.final
          ? 'mais barata que este plano online de ' + brl(p.final) + '/mês, e com '
          : 'um pouco acima deste plano de ' + brl(p.final) + '/mês, mas com ')
        + 'a planilha de corrida ajustada toda semana pelo pace registrado. É o formato que o Rafa recomenda para esse objetivo.');
    }
    if (d.nivel === 'nunca' && d.freq === 4) {
      var dois = precoFinal(d.onde, 2, d.tempo);
      avisos.push('Nunca treinei com 4x por semana: <b>a recomendação é começar com 2x e subir depois do primeiro ciclo</b>, quando tendão e articulação já acompanham o músculo. Nesse formato a proposta ficaria em '
        + brl(dois.final) + '/mês, e a subida para 4x acontece na virada do ciclo, sem taxa de mudança. A conta acima mantém a frequência que você escolheu.');
    }

    return { final: p.final, semanas: semanas, motivoCiclo: motivoCiclo, incluso: incluso, memoria: memoria, avisos: avisos };
  }

  function nomeDoPlano(d) {
    if (d.onde === 'presencial') return 'Studio Forja · ' + d.freq + 'x por semana';
    if (d.onde === 'online') return 'Forja Online · ' + d.freq + 'x por semana';
    return 'Forja Híbrido · ' + d.freq + 'x por semana';
  }

  function montarProposta(d) {
    var r = calcular(d);
    var html = '<div class="proposta">'
      + '<div class="proposta__topo">'
      + '<p class="rotulo">Proposta montada agora</p>'
      + '<h3>' + nomeDoPlano(d) + '</h3>'
      + '<p class="proposta__enfase">' + d.freq + ' sessões de ' + d.tempo + ' min por semana · ênfase em ' + OBJETIVOS[d.objetivo].enfase + '</p>'
      + '</div>'
      + '<p class="proposta__preco"><b>' + brl(r.final) + '</b><span>/mês</span></p>'
      + '<p class="proposta__ciclo"><b>Ciclo recomendado: ' + r.semanas + ' semanas.</b> ' + r.motivoCiclo + '.</p>'
      + '<ul class="proposta__lista">' + r.incluso.map(function (i) { return '<li>' + ICONE_OK + i + '</li>'; }).join('') + '</ul>'
      + '<dl class="memoria">' + r.memoria.map(function (m) {
          return '<div><dt>' + m[0] + '</dt><dd>' + m[1] + '</dd></div>';
        }).join('') + '</dl>';

    if (r.avisos.length) {
      html += '<div class="avisos">' + r.avisos.map(function (a) {
        return '<p class="aviso">' + ICONE_AVISO + '<span>' + a + '</span></p>';
      }).join('') + '</div>';
    }

    html += '<div class="proposta__acoes">'
      + '<a class="botao" href="#agendar" data-plano="' + (d.onde === 'online' ? 'online' : d.onde === 'hibrido' ? 'hibrido' : 'presencial-' + d.freq) + '">Quero esta proposta</a>'
      + '<button class="botao botao--vazio" type="button" id="btn-refazer">Refazer</button>'
      + '</div></div>';

    saidaPlano.innerHTML = html;
  }

  function validarGrupos() {
    var faltando = [];
    GRUPOS.forEach(function (g) {
      var valor = lerRadio(g.chave);
      var grupo = $('[data-grupo="' + g.chave + '"]');
      var erro = $('[data-erro-grupo="' + g.chave + '"]');
      if (!valor) {
        faltando.push(g.erro);
        grupo.classList.add('grupo--erro');
        grupo.setAttribute('aria-invalid', 'true');
        erro.textContent = g.erro;
      } else {
        grupo.classList.remove('grupo--erro');
        grupo.setAttribute('aria-invalid', 'false');
        erro.textContent = '';
      }
    });
    return faltando;
  }

  formPlano.addEventListener('submit', function (e) {
    e.preventDefault();
    var faltando = validarGrupos();

    if (faltando.length) {
      saidaPlano.innerHTML = '<div class="erro-caixa"><b>Falta escolher</b><ul>'
        + faltando.map(function (f) { return '<li>' + f + '</li>'; }).join('')
        + '</ul></div>';
      var primeiro = $('.grupo--erro input', formPlano);
      if (primeiro) primeiro.focus();
      return;
    }

    var d = {
      objetivo: lerRadio('objetivo'),
      onde: lerRadio('onde'),
      freq: Number(campoFreq.value),
      tempo: Number(lerRadio('tempo')),
      nivel: lerRadio('nivel')
    };

    btnPlano.disabled = true;
    btnPlano.textContent = 'Montando…';
    saidaPlano.setAttribute('aria-busy', 'true');
    saidaPlano.innerHTML = '<p class="rotulo">Conferindo agenda e tabela</p><div class="esqueleto" aria-hidden="true"><span></span><span></span><span></span></div>';

    window.setTimeout(function () {
      montarProposta(d);
      saidaPlano.removeAttribute('aria-busy');
      btnPlano.disabled = false;
      btnPlano.textContent = 'Montar meu plano';
    }, reduzido ? 150 : 620);
  });

  saidaPlano.addEventListener('click', function (e) {
    if (e.target.id !== 'btn-refazer') return;
    formPlano.reset();
    $$('.opcao', formPlano).forEach(function (o) { o.classList.remove('opcao--marcada'); });
    $$('.grupo', formPlano).forEach(function (g) {
      g.classList.remove('grupo--erro');
      g.removeAttribute('aria-invalid');
    });
    $$('[data-erro-grupo]', formPlano).forEach(function (p) { p.textContent = ''; });
    valorFreq();
    saidaPlano.innerHTML = '<p class="vazio"><b>Proposta em branco</b>Escolha objetivo, onde, frequência, tempo e nível. A proposta aparece aqui com o valor do mês, o que está incluso, o ciclo recomendado e a conta aberta linha por linha.</p>';
    var primeiro = $('input[name="objetivo"]', formPlano);
    if (primeiro) primeiro.focus();
  });

  /* =========================================================
     3. FORMULÁRIO DE AGENDAMENTO
     ========================================================= */
  var formAgenda = $('#form-agenda');
  var btnAgenda = $('#btn-agenda');
  var recadoOk = $('#recado-ok');

  var REGRAS = {
    nome: function (v) {
      if (v.trim().length < 2) return 'Escreva o nome como você quer ser chamado.';
      return '';
    },
    whatsapp: function (v) {
      var d = v.replace(/\D/g, '');
      if (!d) return 'Sem o WhatsApp não dá para combinar horário.';
      if (d.length < 10 || d.length > 11) return 'Use DDD + número: (41) 90000-0000.';
      return '';
    },
    email: function (v) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) return 'Confira o e-mail: falta algo como nome@email.com.br.';
      return '';
    },
    objetivo: function (v) {
      if (!v) return 'Escolha o objetivo principal.';
      return '';
    },
    onde: function (v) {
      if (!v) return 'Diga onde prefere treinar.';
      return '';
    },
    disponibilidade: function (v) {
      if (v.trim().length < 3) return 'Escreva os dias ou horários que funcionam — é o que define a vaga.';
      return '';
    }
  };

  function validarCampo(nome) {
    var alvo = $('[name="' + nome + '"]', formAgenda);
    if (!alvo) return true;
    var msg = REGRAS[nome](alvo.value);
    var caixa = $('[data-campo="' + nome + '"]', formAgenda);
    if (caixa) caixa.classList.toggle('campo--erro', Boolean(msg));
    alvo.setAttribute('aria-invalid', String(Boolean(msg)));
    $('[data-erro="' + nome + '"]', formAgenda).textContent = msg;
    return !msg;
  }

  Object.keys(REGRAS).forEach(function (nome) {
    var alvo = $('[name="' + nome + '"]', formAgenda);
    alvo.addEventListener('blur', function () { validarCampo(nome); });
    alvo.addEventListener('input', function () {
      if ($('[data-campo="' + nome + '"]', formAgenda).classList.contains('campo--erro')) validarCampo(nome);
    });
    alvo.addEventListener('change', function () { validarCampo(nome); });
  });

  var aceite = $('#aceite');
  aceite.addEventListener('change', function () {
    $('#erro-aceite').textContent = aceite.checked ? '' : 'Precisamos do seu ok para responder no WhatsApp.';
  });

  /* Os botões de plano levam ao formulário já com o plano marcado —
     delegação, porque a proposta é criada depois do carregamento */
  document.addEventListener('click', function (e) {
    var el = e.target.closest ? e.target.closest('[data-plano]') : null;
    if (!el) return;
    var select = $('#plano');
    if (!select) return;
    var existe = $$('option', select).some(function (o) { return o.value === el.dataset.plano; });
    if (existe) select.value = el.dataset.plano;
  });

  formAgenda.addEventListener('submit', function (e) {
    e.preventDefault();
    var nomes = Object.keys(REGRAS);
    var ok = nomes.map(validarCampo).every(Boolean);
    var okAceite = aceite.checked;
    $('#erro-aceite').textContent = okAceite ? '' : 'Precisamos do seu ok para responder no WhatsApp.';
    aceite.setAttribute('aria-invalid', String(!okAceite));

    if (!ok || !okAceite) {
      var primeiro = $('.campo--erro input, .campo--erro select', formAgenda) || (okAceite ? null : aceite);
      if (primeiro) primeiro.focus();
      return;
    }

    btnAgenda.disabled = true;
    btnAgenda.textContent = 'Enviando…';

    window.setTimeout(function () {
      var nome = $('#nome').value.trim().split(' ')[0];
      var objetivo = $('#objetivo');
      var onde = $('#onde');
      var plano = $('#plano');
      var disponibilidade = $('#disponibilidade').value.trim();

      recadoOk.innerHTML = '';
      var titulo = document.createElement('b');
      titulo.textContent = 'Pedido registrado, ' + nome + '.';
      var linha1 = document.createElement('span');
      linha1.textContent = 'O Rafa responde em até 1 dia útil no WhatsApp com três horários de avaliação. '
        + 'Objetivo anotado: ' + objetivo.options[objetivo.selectedIndex].text.toLowerCase()
        + ' · ' + onde.options[onde.selectedIndex].text.toLowerCase()
        + (plano.value ? ' · plano de interesse: ' + plano.options[plano.selectedIndex].text : '')
        + '. Disponibilidade: ' + disponibilidade + '.';
      var linha2 = document.createElement('span');
      linha2.textContent = 'A avaliação dura 60 min, no studio do Batel ou por chamada de vídeo, e a ficha com os seis testes fica com você. '
        + 'Em uma versão publicada, esse pedido chegaria agora no WhatsApp do studio e no seu e-mail.';
      recadoOk.appendChild(titulo);
      recadoOk.appendChild(linha1);
      recadoOk.appendChild(linha2);
      recadoOk.hidden = false;

      btnAgenda.disabled = false;
      btnAgenda.textContent = 'Agendar avaliação';
      recadoOk.scrollIntoView({ block: 'nearest', behavior: reduzido ? 'auto' : 'smooth' });
    }, reduzido ? 150 : 600);
  });
})();
