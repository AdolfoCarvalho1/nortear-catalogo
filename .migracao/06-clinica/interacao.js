
(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =========================================================
     DADOS — oito procedimentos, o que está incluso e quem faz
     ========================================================= */
  var PROCEDIMENTOS = [
    {
      id: 'limpeza', nome: 'Limpeza de pele profunda', curto: 'Limpeza de pele',
      duracao: 60, sessoes: [1, 1], intervaloDias: 45, desconforto: 1, preco: 220,
      objetivo: 'limpeza|textura',
      quem: ['camila', 'taina'],
      resolve: 'Remove comedão e cisto de queratina, desobstrui o poro e reduz a inflamação de pele oleosa ou acneica. É a porta de entrada de quase todo protocolo.',
      incluso: 'Limpeza e higienização, extração manual, máscara calmante, protetor ao final e orientação de cuidado em casa.',
      naoIndicado: 'Acne inflamatória aguda em crise, herpes labial ativo, queimadura solar recente ou isotretinoína nos últimos 6 meses.',
      evitar: 'Vir sem maquiagem e sem ácido aplicado nas últimas 24 h.',
      sessaoRepetida: 'Sua sessão de retorno é mais curta: 45 min, com foco na área que voltou a obstruir.'
    },
    {
      id: 'peeling', nome: 'Peeling de ácido mandélico', curto: 'Peeling mandélico',
      duracao: 50, sessoes: [4, 4], intervaloDias: 15, desconforto: 2, preco: 280,
      objetivo: 'tom|textura',
      quem: ['helena', 'camila'],
      resolve: 'Clareia mancha pós-acne e melasma superficial, afina a camada de células mortas e melhora a textura. É o ácido mais tolerado por pele sensível e com tendência a mancha.',
      incluso: 'Limpeza prévia, anestesia tópica se você pedir, neutralização, máscara de reparo e orientação pós com ácido suspenso por 3 dias.',
      naoIndicado: 'Gestação ou amamentação, herpes ativo, pele lesionada por outro ácido nos últimos 15 dias, exposição solar intensa nos últimos 7 dias ou histórico de quelóide.',
      evitar: 'Suspender ácido e vitamina C em casa 3 dias antes e evitar sol 7 dias antes.',
      sessaoRepetida: 'Sessão de manutenção: 35 min, com concentração menor de ácido e retorno em 30 dias.'
    },
    {
      id: 'micro', nome: 'Microagulhamento com drug delivery', curto: 'Microagulhamento',
      duracao: 75, sessoes: [3, 3], intervaloDias: 30, desconforto: 3, preco: 520,
      objetivo: 'tom|textura|firmeza',
      quem: ['helena'],
      resolve: 'Estimula colágeno para cicatriz de acne, poro dilatado, linha fina e flacidez inicial, com aplicação de ativos que só entram na pele por essa via.',
      incluso: 'Limpeza, anestesia tópica de 30 min, agulha estéril descartável, ativos de drug delivery, máscara calmante e orientação pós com ácido e vitamina C suspensos por 5 dias.',
      naoIndicado: 'Acne inflamatória ativa na área, herpes ativo, isotretinoína nos últimos 6 meses, anticoagulante em dose plena, doença autoimune em atividade ou gestação.',
      evitar: 'Suspender ácido 3 dias antes, vir sem maquiagem e sem sol nas últimas 48 h.',
      sessaoRepetida: 'Sessão de retorno: 60 min, com agulha de profundidade menor e retorno em 30 dias.'
    },
    {
      id: 'luz', nome: 'Luz intensa pulsada para manchas', curto: 'Luz intensa pulsada',
      duracao: 40, sessoes: [3, 5], intervaloDias: 21, desconforto: 2, preco: 480,
      objetivo: 'tom|textura',
      quem: ['helena'],
      resolve: 'Clareia melasma, lentigo solar, mancha de sol e vermelhidão de rosácea. Exige fototipo compatível: em pele mais escura o risco de mancha nova sobe.',
      incluso: 'Limpeza, gel condutor, proteção ocular, anestesia tópica se necessário, compressa fria ao final e protetor solar FPS 50 para levar.',
      naoIndicado: 'Exposição solar nos últimos 14 dias, bronzeado artificial, isotretinoína nos últimos 6 meses, gestação, epilepsia fotossensível ou lesão de pele não diagnosticada na área.',
      evitar: 'Nada de sol 7 dias antes, sem autobronzeador há 14 dias, vir sem maquiagem.',
      sessaoRepetida: 'Retorno de manutenção: 30 min, com fluência menor e retorno em 30 dias.'
    },
    {
      id: 'toxina', nome: 'Toxina botulínica', curto: 'Toxina botulínica',
      duracao: 30, sessoes: [1, 1], intervaloDias: 120, desconforto: 2, preco: 1290,
      objetivo: 'firmeza',
      quem: ['helena'],
      resolve: 'Suaviza linha de expressão da testa, glabela e pés de galinha. Não preenche ruga parada: onde já existe sulco em repouso, o resultado é parcial.',
      incluso: 'Avaliação de mímica facial, antissepsia, anestesia tópica, aplicação com agulha fina, retoque de 30 dias e retorno de 6 meses para reavaliar.',
      naoIndicado: 'Gestação ou amamentação, doença neuromuscular como miastenia ou ELA, alergia a albumina, infecção ativa no local ou uso de aminoglicosídeo.',
      evitar: 'Não deitar por 4 h depois, evitar academia e sauna por 24 h, não massagear a área.',
      sessaoRepetida: 'Retoque de 30 dias: 20 min, sem custo, para acertar o que ficou assimétrico.'
    },
    {
      id: 'preenchimento', nome: 'Preenchimento de ácido hialurônico', curto: 'Preenchimento',
      duracao: 60, sessoes: [1, 1], intervaloDias: 365, desconforto: 3, preco: 1690,
      objetivo: 'firmeza',
      quem: ['helena'],
      resolve: 'Devolve volume a sulco nasolabial, olheira funda, lábio e contorno de mandíbula. Todo preenchimento daqui é reversível com hialuronidase.',
      incluso: 'Avaliação de face com marcação prévia, anestesia tópica, produto com registro Anvisa, retorno de 30 dias, compressa fria e orientação de cuidados.',
      naoIndicado: 'Gestação, infecção ou herpes ativo na área, doença autoimune em atividade, anticoagulante sem liberação médica ou histórico de reação a preenchedor permanente.',
      evitar: 'Suspender anti-inflamatório e anticoagulante com liberação médica 3 dias antes; vir sem maquiagem.',
      sessaoRepetida: 'Retorno de 30 dias: 30 min, para avaliar integração do produto e completar se faltou volume.'
    },
    {
      id: 'skinbooster', nome: 'Skinbooster', curto: 'Skinbooster',
      duracao: 45, sessoes: [2, 2], intervaloDias: 30, desconforto: 2, preco: 980,
      objetivo: 'firmeza|textura',
      quem: ['helena', 'marina'],
      resolve: 'Hidrata a pele em profundidade e melhora a qualidade do tecido: pele fina, opaca e com linha fina de desidratação. Não muda volume nem contorno.',
      incluso: 'Antissepsia, anestesia tópica, aplicação de ácido hialurônico não reticulado, máscara calmante e retorno em 30 dias.',
      naoIndicado: 'Infecção ativa na área, herpes labial recorrente sem profilaxia, gestação, doença autoimune em atividade ou alergia conhecida a hialuronidase.',
      evitar: 'Suspender ácido 3 dias antes, vir sem maquiagem, evitar sauna por 48 h.',
      sessaoRepetida: 'Sessão de manutenção: 35 min, com produto em menor volume e retorno em 30 dias.'
    },
    {
      id: 'criolipolise', nome: 'Criolipólise', curto: 'Criolipólise',
      duracao: 90, sessoes: [1, 2], intervaloDias: 60, desconforto: 2, preco: 750,
      objetivo: 'gordura',
      quem: ['taina', 'camila'],
      resolve: 'Reduz gordura localizada em flank, abdômen e região submentoniana com resfriamento controlado. Não é tratamento de peso nem de flacidez de pele.',
      incluso: 'Medida de dobra cutânea, aplicação com membrana de proteção, massagem manual ao final e retorno de 60 dias com nova medida.',
      naoIndicado: 'Crioglobulinemia, anemia falciforme ou outra hemoglobinopatia, hérnia na área, marca-passo próximo ao aplicador, gestação, obesidade grau II ou III ou pele em flacidez acentuada.',
      evitar: 'Vir com a área sem creme e sem depilação nas 24 h anteriores.',
      sessaoRepetida: 'Segunda sessão na mesma área: 90 min, com nova medida de dobra antes de aplicar.'
    }
  ];

  var PROFISSIONAIS = [
    { id: 'helena', nome: 'Dra. Helena Bastos', papel: 'dermatologista', iniciais: 'HB' },
    { id: 'camila', nome: 'Camila Prado', papel: 'esteticista', iniciais: 'CP' },
    { id: 'marina', nome: 'Enf. Marina Kiel', papel: 'enfermeira', iniciais: 'MK' },
    { id: 'taina', nome: 'Tainá Bonfim', papel: 'esteticista', iniciais: 'TB' }
  ];

  function acharProc(id) {
    for (var i = 0; i < PROCEDIMENTOS.length; i++) { if (PROCEDIMENTOS[i].id === id) return PROCEDIMENTOS[i]; }
    return null;
  }
  function acharProf(id) {
    for (var i = 0; i < PROFISSIONAIS.length; i++) { if (PROFISSIONAIS[i].id === id) return PROFISSIONAIS[i]; }
    return null;
  }
  function reais(v) { return 'R$ ' + v.toLocaleString('pt-BR'); }
  function nSessoes(p) { return p.sessoes[0] === p.sessoes[1] ? String(p.sessoes[0]) : p.sessoes[0] + ' a ' + p.sessoes[1]; }
  function rotuloSessoes(p) {
    var n = p.sessoes[0] === p.sessoes[1] ? p.sessoes[0] : p.sessoes[0] + ' a ' + p.sessoes[1];
    return n + (p.sessoes[1] === 1 ? ' sessão' : ' sessões');
  }
  function totalProtocolo(p) {
    var min = p.preco * p.sessoes[0];
    var max = p.preco * p.sessoes[1];
    return min === max ? reais(min) : reais(min) + ' a ' + reais(max);
  }
  function duracaoTexto(min) {
    if (min < 60) return min + ' min';
    var h = Math.floor(min / 60), m = min % 60;
    return m ? h + ' h ' + m + ' min' : h + ' h';
  }

  /* =========================================================
     1. Filtro de procedimentos por objetivo
     ========================================================= */
  var recado = $('#filtro-recado');
  $$('.filtro__op').forEach(function (b) {
    b.addEventListener('click', function () {
      var alvo = b.dataset.filtro;
      $$('.filtro__op').forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
      var visiveis = 0;
      $$('.proc__item').forEach(function (item) {
        var mostra = alvo === 'todos' || item.dataset.objetivo.split('|').indexOf(alvo) !== -1;
        item.hidden = !mostra;
        if (mostra) visiveis++;
      });
      recado.textContent = alvo === 'todos'
        ? 'Mostrando os 8 procedimentos.'
        : 'Mostrando ' + visiveis + (visiveis === 1 ? ' procedimento' : ' procedimentos') + ' para este objetivo.';
    });
  });

  /* =========================================================
     2. Comparador de protocolos
     ========================================================= */
  var selA = $('#comp-a'), selB = $('#comp-b'), saidaComp = $('#comp-saida');

  PROCEDIMENTOS.forEach(function (p) {
    [selA, selB].forEach(function (sel) {
      var o = document.createElement('option');
      o.value = p.id;
      o.textContent = p.nome;
      sel.appendChild(o);
    });
  });

  function escala(nivel) {
    var marcas = '';
    for (var i = 1; i <= 5; i++) {
      marcas += '<i class="' + (i <= nivel ? 'on' : '') + '" style="height:' + (0.4 + i * 0.16) + 'rem"></i>';
    }
    return '<span class="escala" role="img" aria-label="Desconforto ' + nivel + ' de 5">' + marcas + '</span>';
  }

  function comparar() {
    var a = acharProc(selA.value), b = acharProc(selB.value);

    if (!a && !b) {
      saidaComp.innerHTML = '<p class="comparador__vazio">Nenhum procedimento selecionado. Escolha os dois campos acima para montar a comparação.</p>';
      return;
    }
    if (!a || !b) {
      var so = a || b;
      saidaComp.innerHTML = '<p class="comparador__vazio">Falta escolher o segundo procedimento. Já está selecionado: <b>' + so.nome
        + '</b> — ' + rotuloSessoes(so) + ', ' + duracaoTexto(so.duracao) + ' por sessão, ' + reais(so.preco) + ' a sessão.</p>';
      return;
    }
    if (a.id === b.id) {
      saidaComp.innerHTML = '<p class="comparador__vazio">Você escolheu o mesmo procedimento nos dois campos. Troque um deles para ver a diferença.</p>';
      return;
    }

    var linhas = [
      ['Duração por sessão', duracaoTexto(a.duracao), duracaoTexto(b.duracao)],
      ['Sessões típicas', rotuloSessoes(a), rotuloSessoes(b)],
      ['Intervalo entre sessões', a.intervaloDias + ' dias', b.intervaloDias + ' dias'],
      ['Preço por sessão', reais(a.preco), reais(b.preco)],
      ['Total estimado do protocolo', totalProtocolo(a), totalProtocolo(b)],
      ['Desconforto', escala(a.desconforto), escala(b.desconforto)],
      ['Quem aplica', a.quem.map(function (q) { return acharProf(q).nome; }).join(' · '), b.quem.map(function (q) { return acharProf(q).nome; }).join(' · ')]
    ];

    var html = '<table class="tabela-comp"><caption class="visualmente-oculto">Comparação entre ' + a.nome + ' e ' + b.nome + '</caption><thead><tr><th scope="col">Protocolo</th><th scope="col">' + a.nome + '</th><th scope="col">' + b.nome + '</th></tr></thead><tbody>';
    linhas.forEach(function (l) {
      html += '<tr><th scope="row">' + l[0] + '</th><td>' + l[1] + '</td><td>' + l[2] + '</td></tr>';
    });
    html += '</tbody></table>';

    var ta = a.preco * a.sessoes[0], tb = b.preco * b.sessoes[0];
    var prazoA = (a.sessoes[0] - 1) * a.intervaloDias, prazoB = (b.sessoes[0] - 1) * b.intervaloDias;
    var diff = ta === tb ? 'Os dois protocolos começam com o mesmo custo estimado.'
      : '<b>' + (ta > tb ? a.nome : b.nome) + '</b> custa ' + reais(Math.abs(ta - tb)) + ' mais no protocolo mínimo.';
    html += '<p class="comparador__delta">' + diff
      + ' Em prazo: ' + (a.sessoes[0] === 1 ? 'sessão única' : prazoA + ' dias entre a primeira e a última sessão de ' + a.curto.toLowerCase())
      + ', contra ' + (b.sessoes[0] === 1 ? 'sessão única' : prazoB + ' dias de ' + b.curto.toLowerCase()) + '.</p>';

    saidaComp.innerHTML = html;
  }

  selA.addEventListener('change', comparar);
  selB.addEventListener('change', comparar);
  comparar();

  /* =========================================================
     3. Agendamento — procedimento, profissional, dia, horário
     ========================================================= */
  var form = $('#form-agenda');
  var caixaErroGeral = $('#erro-geral');
  var opsProc = $('#ops-procedimento');
  var opsProf = $('#ops-profissional');
  var resumoProc = $('#resumo-procedimento');
  var campoData = $('#data');
  var caixaHorarios = $('#horarios');
  var orientacao = $('#orientacao');
  var recibo = $('#recibo');
  var btnAgendar = $('#btn-agendar');
  var estado = { procedimento: '', profissional: '', data: '', horario: '', antes: '' };

  /* Opções de procedimento */
  PROCEDIMENTOS.forEach(function (p) {
    var l = document.createElement('label');
    l.className = 'op';
    l.innerHTML = '<input type="radio" name="procedimento" value="' + p.id + '">'
      + '<span><b>' + p.nome + '</b><small>' + duracaoTexto(p.duracao) + ' · ' + rotuloSessoes(p) + ' · ' + reais(p.preco) + ' por sessão</small></span>';
    opsProc.appendChild(l);
  });

  /* Profissionais: só aparece quem faz o procedimento escolhido */
  function montarProfissionais(p) {
    opsProf.innerHTML = '';
    if (!p) {
      opsProf.innerHTML = '<p class="vazio">Escolha o procedimento para ver quem aplica.</p>';
      estado.profissional = '';
      return;
    }
    p.quem.forEach(function (q) {
      var prof = acharProf(q);
      var l = document.createElement('label');
      l.className = 'op op--curta';
      l.innerHTML = '<input type="radio" name="profissional" value="' + prof.id + '">'
        + '<span>' + prof.nome + '<small>' + prof.papel + '</small></span>';
      if (estado.profissional === prof.id) l.querySelector('input').checked = true;
      opsProf.appendChild(l);
    });
    if (p.quem.length === 1) {
      opsProf.querySelector('input').checked = true;
      estado.profissional = p.quem[0];
    }
    if (estado.profissional && p.quem.indexOf(estado.profissional) === -1) {
      estado.profissional = '';
      $$('input[name="profissional"]').forEach(function (i) { i.checked = false; });
    }
  }

  /* Datas: mínimo amanhã, sem domingo e sem segunda */
  function amanha() {
    var d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 1);
    return d;
  }
  function paraISO(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function deISO(s) {
    var partes = s.split('-');
    return new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]));
  }
  var DIA = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
  var min = amanha();
  campoData.min = paraISO(min);
  campoData.value = '';

  function validarData(iso) {
    if (!iso) return 'Escolha o dia da sessão.';
    var d = deISO(iso);
    if (isNaN(d.getTime())) return 'Data inválida. Use o formato dia/mês/ano.';
    var hoje = new Date(); hoje.setHours(0, 0, 0, 0);
    if (d <= hoje) return 'Precisamos de um dia a partir de amanhã para confirmar com a profissional.';
    if (d.getDay() === 0) return 'Domingo a clínica está fechada. O próximo dia útil é terça-feira.';
    if (d.getDay() === 1) return 'Segunda-feira é o dia de esterilização e organização das salas — não atendemos. Escolha de terça a sábado.';
    return '';
  }

  /* Horários: terça a sexta 9h–19h; sábado 9h–13h. Grade muda com a duração. */
  var OCUPADOS = [0, 3, 6, 9, 12];
  function gerarHorarios(iso, duracao) {
    var d = deISO(iso);
    var sabado = d.getDay() === 6;
    var abre = 9 * 60, fecha = sabado ? 13 * 60 : 19 * 60;
    var passo = duracao > 60 ? 60 : duracao > 40 ? 45 : 30;
    var lista = [];
    for (var t = abre; t + duracao <= fecha; t += passo) {
      var h = Math.floor(t / 60), m = t % 60;
      lista.push({ texto: String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0'), min: t });
    }
    return lista;
  }

  function pintarHorarios() {
    var p = acharProc(estado.procedimento);
    /* trocar de procedimento ou de dia não deve apagar o horário já escolhido
       quando ele continua existindo na grade nova */
    var anterior = estado.horario;
    caixaHorarios.innerHTML = '';
    estado.horario = '';
    if (!p) {
      caixaHorarios.innerHTML = '<p class="vazio">Escolha o procedimento primeiro: a grade muda conforme a duração da sessão.</p>';
      return;
    }
    if (!estado.data) {
      caixaHorarios.innerHTML = '<p class="vazio">Escolha um dia útil na agenda para ver os horários livres.</p>';
      return;
    }
    var erro = validarData(estado.data);
    if (erro) {
      caixaHorarios.innerHTML = '<p class="vazio">Sem grade de horários neste dia. Escolha de terça a sábado, a partir de amanhã.</p>';
      return;
    }
    var sabado = deISO(estado.data).getDay() === 6;
    var lista = gerarHorarios(estado.data, p.duracao);
    var disponiveis = 0;
    lista.forEach(function (h, i) {
      var ocupado = OCUPADOS.indexOf(i) !== -1;
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'horario';
      b.dataset.hora = h.texto;
      b.innerHTML = '<span>' + h.texto + '</span><small>' + (ocupado ? 'ocupado' : 'livre') + '</small>';
      if (ocupado) { b.disabled = true; } else { disponiveis++; }
      b.addEventListener('click', function () {
        $$('.horario', caixaHorarios).forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
        estado.horario = h.texto;
        limparErro('horario');
      });
      if (!ocupado && anterior === h.texto) { b.setAttribute('aria-pressed', 'true'); estado.horario = h.texto; }
      caixaHorarios.appendChild(b);
    });
    var resumo = document.createElement('p');
    resumo.className = 'horarios__resumo';
    resumo.textContent = disponiveis + (disponiveis === 1 ? ' horário livre' : ' horários livres')
      + (sabado ? ' · sábado a clínica fecha às 13h' : '') + ' · sessão de ' + duracaoTexto(p.duracao) + '.';
    caixaHorarios.appendChild(resumo);
  }

  /* Estado de carregando ao trocar o dia — simula consultar a agenda */
  var consulta = 0;
  function carregarHorarios(iso) {
    caixaHorarios.innerHTML = '';
    for (var i = 0; i < 8; i++) {
      var s = document.createElement('span');
      s.className = 'horario horario--carregando';
      caixaHorarios.appendChild(s);
    }
    var aviso = document.createElement('p');
    aviso.className = 'horarios__resumo';
    aviso.textContent = 'Consultando a agenda das 3 salas…';
    caixaHorarios.appendChild(aviso);
    /* uma consulta nova cancela a anterior: sem isso a resposta antiga
       sobrescreve a grade do dia que está na tela */
    clearTimeout(consulta);
    consulta = setTimeout(function () {
      if (estado.data === iso) pintarHorarios();
    }, reduzido ? 60 : 520);
  }

  /* Orientação conforme "já fez antes?" */
  function pintarOrientacao() {
    var p = acharProc(estado.procedimento);
    if (!estado.antes || !p) { orientacao.hidden = true; orientacao.innerHTML = ''; return; }
    orientacao.hidden = false;
    if (estado.antes === 'sim') {
      orientacao.className = 'orientacao orientacao--retorno';
      orientacao.innerHTML = '<b>Retorno registrado no prontuário</b>'
        + '<p>' + p.sessaoRepetida + ' Como você já conhece o procedimento, a anestesia tópica é opcional — diga na recepção se quiser.</p>';
    } else {
      orientacao.className = 'orientacao orientacao--primeira';
      orientacao.innerHTML = '<b>Orientação pré-procedimento · primeira vez</b>'
        + '<ul>'
        + '<li>Evite sol e câmera de bronzeamento 7 dias antes.</li>'
        + '<li>Suspenda ácido, retinol e vitamina C em casa 3 dias antes.</li>'
        + '<li>Venha sem maquiagem e sem creme na área.</li>'
        + '<li>' + p.evitar + '</li>'
        + '</ul>'
        + '<p class="orientacao__clinic"><b>Contraindicações deste procedimento:</b> ' + p.naoIndicado + '</p>';
    }
  }

  /* Erros */
  function marcarErro(chave, msg) {
    var alvo = $('[data-erro="' + chave + '"]');
    if (alvo) alvo.textContent = msg || '';
    var campo = $('[data-campo="' + chave + '"]') || $('.campo:has([data-erro="' + chave + '"])');
    if (campo) campo.classList.toggle('campo--erro', Boolean(msg));
    var input = $('[name="' + chave + '"]');
    if (input) input.setAttribute('aria-invalid', String(Boolean(msg)));
    return !msg;
  }
  function limparErro(chave) { marcarErro(chave, ''); }

  /* Eventos do procedimento */
  opsProc.addEventListener('change', function (e) {
    if (e.target.name !== 'procedimento') return;
    estado.procedimento = e.target.value;
    var p = acharProc(estado.procedimento);
    resumoProc.innerHTML = '<b>' + p.nome + '</b> · ' + duracaoTexto(p.duracao) + ' de sessão · ' + rotuloSessoes(p)
      + ' · ' + reais(p.preco) + ' por sessão · total estimado do protocolo ' + totalProtocolo(p)
      + '. <span class="resumo__incluso">Incluso: ' + p.incluso + '</span>';
    montarProfissionais(p);
    pintarOrientacao();
    limparErro('procedimento');
    if (estado.data) carregarHorarios(estado.data); else pintarHorarios();
  });

  opsProf.addEventListener('change', function (e) {
    if (e.target.name !== 'profissional') return;
    estado.profissional = e.target.value;
    limparErro('profissional');
  });

  campoData.addEventListener('change', function () {
    estado.data = campoData.value;
    var erro = validarData(estado.data);
    marcarErro('data', erro);
    if (erro) { estado.data = ''; pintarHorarios(); return; }    var d = deISO(estado.data);
    $('#dica-data').textContent = DIA[d.getDay()] + ', ' + d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })
      + ' · a clínica atende nesse dia.';
    carregarHorarios(estado.data);
  });

  $$('input[name="antes"]').forEach(function (r) {
    r.addEventListener('change', function () {
      estado.antes = r.value;
      pintarOrientacao();
      limparErro('antes');
    });
  });

  /* Máscara de telefone brasileira: (48) 90000-0000 ou (48) 3000-0000 */
  var fone = $('#fone');
  fone.addEventListener('input', function () {
    var n = fone.value.replace(/\D/g, '').slice(0, 11);
    var out = n;
    if (n.length > 2) out = '(' + n.slice(0, 2) + ') ' + n.slice(2);
    if (n.length > 6) {
      var corte = n.length > 10 ? 7 : 6;
      out = '(' + n.slice(0, 2) + ') ' + n.slice(2, corte) + '-' + n.slice(corte);
    }
    fone.value = out;
    if (fone.closest('.campo').classList.contains('campo--erro')) validarFone();
  });

  function validarFone() {
    var n = fone.value.replace(/\D/g, '');
    if (!n) return marcarErro('fone', 'Deixe um telefone para confirmarmos o horário.');
    if (n.length < 10) return marcarErro('fone', 'Faltam dígitos: informe DDD e número, como (48) 90000-0000.');
    if (n.length === 11 && n[2] !== '9') return marcarErro('fone', 'Celular com 11 dígitos precisa começar com 9 depois do DDD.');
    return marcarErro('fone', '');
  }
  function validarNome() {
    var v = $('#nome').value.trim();
    if (v.length < 3) return marcarErro('nome', 'Escreva seu nome como está no documento.');
    if (v.indexOf(' ') === -1) return marcarErro('nome', 'Inclua o sobrenome: usamos para localizar seu prontuário.');
    return marcarErro('nome', '');
  }

  $('#nome').addEventListener('blur', validarNome);
  $('#nome').addEventListener('input', function () {
    if ($('[data-campo="nome"]').classList.contains('campo--erro')) validarNome();
  });
  fone.addEventListener('blur', validarFone);

  /* Envio */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    caixaErroGeral.hidden = true;
    var p = acharProc(estado.procedimento);
    var faltas = [];

    if (!p) faltas.push(marcarErro('procedimento', 'Escolha o procedimento que você quer agendar.') ? '' : 'procedimento');
    if (!estado.profissional) faltas.push(marcarErro('profissional', p ? 'Escolha entre ' + p.quem.map(function (q) { return acharProf(q).nome; }).join(' e ') + '.' : 'Escolha a profissional.') ? '' : 'profissional');
    var erroData = validarData(estado.data || campoData.value);
    if (erroData) faltas.push(marcarErro('data', erroData) ? '' : 'data');
    if (!estado.horario) faltas.push(marcarErro('horario', 'Escolha um horário livre na grade acima.') ? '' : 'horário');
    if (!validarNome()) faltas.push('nome');
    if (!validarFone()) faltas.push('telefone');
    if (!estado.antes) faltas.push(marcarErro('antes', 'Responda se você já fez esse procedimento — isso muda a orientação da sessão.') ? '' : 'procedimento anterior');

    faltas = faltas.filter(Boolean);
    var ok = faltas.length === 0;

    if (!ok) {
      caixaErroGeral.hidden = false;
      caixaErroGeral.innerHTML = '<b>Faltou ' + faltas.length + (faltas.length === 1 ? ' informação' : ' informações') + ' para confirmar:</b> '
        + faltas.join(', ') + '.';
      var primeiro = $('.campo--erro input') || $('[data-erro="procedimento"]');
      if (primeiro) primeiro.focus();
      return;
    }

    btnAgendar.disabled = true;
    btnAgendar.textContent = 'Confirmando com a agenda…';
    form.setAttribute('aria-busy', 'true');

    setTimeout(function () {
      var d = deISO(estado.data);
      var dataLonga = d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      var prof = acharProf(estado.profissional);
      var nome = $('#nome').value.trim().split(' ')[0];
      var orient = estado.antes === 'sim'
        ? '<li>' + p.sessaoRepetida + '</li><li>Retorno marcado para daqui a 30 dias.</li>'
        : '<li>Evite sol 7 dias antes e suspenda ácido 3 dias antes.</li><li>Venha sem maquiagem na área.</li><li>' + p.evitar + '</li>';

      recibo.hidden = false;
      recibo.innerHTML = '<h3>Agendamento confirmado, ' + nome + '.</h3>'
        + '<dl class="recibo__lista">'
        + '<div><dt>Procedimento</dt><dd>' + p.nome + '</dd></div>'
        + '<div><dt>Profissional</dt><dd>' + prof.nome + ' · ' + prof.papel + '</dd></div>'
        + '<div><dt>Data</dt><dd>' + dataLonga + '</dd></div>'
        + '<div><dt>Horário</dt><dd>' + estado.horario + ' · duração de ' + duracaoTexto(p.duracao) + '</dd></div>'
        + '<div><dt>Valor</dt><dd>' + reais(p.preco) + ' por sessão · protocolo de ' + rotuloSessoes(p) + ': ' + totalProtocolo(p) + '</dd></div>'
        + '<div><dt>Confirmação</dt><dd>Ligamos para ' + fone.value + ' em até 48 h.</dd></div>'
        + '</dl>'
        + '<div class="recibo__bloco"><b>Antes da sessão</b><ul>' + orient + '</ul></div>'
        + '<p class="recibo__politica">Remarcação até 24 h antes, sem custo, por telefone. Depois disso a sessão é cobrada em 50 %. Falta sem aviso conta como sessão realizada.</p>'
        + '<button class="botao botao--vazio" type="button" id="btn-outro">Agendar outro</button>';

      btnAgendar.disabled = false;
      btnAgendar.textContent = 'Confirmar agendamento';
      form.setAttribute('aria-busy', 'false');

      $('#btn-outro').addEventListener('click', function () {
        form.reset();
        estado = { procedimento: '', profissional: '', data: '', horario: '', antes: '' };
        resumoProc.textContent = 'Nenhum procedimento escolhido ainda.';
        orientacao.hidden = true;
        montarProfissionais(null);
        pintarHorarios();
        $('#dica-data').textContent = 'A clínica atende de terça a sábado. Escolha uma data a partir de amanhã.';
        $$('[data-erro]').forEach(function (el) { el.textContent = ''; });
        $$('.campo--erro').forEach(function (el) { el.classList.remove('campo--erro'); });
        caixaErroGeral.hidden = true;
        recibo.hidden = true;
        recibo.innerHTML = '';
        campoData.focus();
      });

      recibo.scrollIntoView({ block: 'nearest', behavior: reduzido ? 'auto' : 'smooth' });
      recibo.focus();
    }, reduzido ? 120 : 900);
  });

  montarProfissionais(null);
  pintarHorarios();

  /* =========================================================
     4. Fecho — pedido de retorno por e-mail
     ========================================================= */
  var regras = {
    'c-nome': function (v) { return v.trim().length >= 3 ? '' : 'Escreva pelo menos o seu primeiro nome.'; },
    'c-email': function (v) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) return 'Confira o e-mail: falta algo como nome@provedor.com.br.';
      return '';
    },
    'c-queixa': function (v) {
      if (v.trim().length < 15) return 'Descreva em uma frase o que incomoda — ajuda a dermatologista a responder melhor.';
      return '';
    }
  };

  function validarContato(chave) {
    var input = $('[name="' + chave + '"]');
    var msg = regras[chave](input.value);
    var campo = $('[data-campo="' + chave + '"]');
    campo.classList.toggle('campo--erro', Boolean(msg));
    $('[data-erro="' + chave + '"]').textContent = msg;
    input.setAttribute('aria-invalid', String(Boolean(msg)));
    return !msg;
  }

  Object.keys(regras).forEach(function (chave) {
    var input = $('[name="' + chave + '"]');
    input.addEventListener('blur', function () { validarContato(chave); });
    input.addEventListener('input', function () {
      if ($('[data-campo="' + chave + '"]').classList.contains('campo--erro')) validarContato(chave);
    });
  });

  $('#form-contato').addEventListener('submit', function (e) {
    e.preventDefault();
    /* valida todos os campos, não só até o primeiro erro */
    var resultados = Object.keys(regras).map(validarContato);
    if (resultados.indexOf(false) !== -1) {
      var primeiro = $('.campo--erro input, .campo--erro textarea');
      if (primeiro) primeiro.focus();
      return;
    }
    var botao = $('#btn-contato');
    botao.disabled = true;
    botao.textContent = 'Enviando…';
    setTimeout(function () {
      var caixa = $('#recado');
      caixa.hidden = false;
      caixa.innerHTML = '<b>Recebemos o seu pedido.</b><span>A Dra. Helena responde em até 48 h em '
        + $('#c-email').value.trim() + ' com o próximo passo do seu caso. Se não for caso de procedimento aqui, ela diz isso também.</span>';
      botao.disabled = false;
      botao.textContent = 'Pedir retorno da dermatologista';
      caixa.scrollIntoView({ block: 'nearest', behavior: reduzido ? 'auto' : 'smooth' });
    }, reduzido ? 150 : 700);
  });

  /* =========================================================
     5. Régua de tempo — o momento autoral da página
     A linha se desenha e cada marco chega na ordem dos dias.
     ========================================================= */
  var regua = $('#regua');
  if (regua && 'IntersectionObserver' in window) {
    regua.classList.add('regua--preparada');
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (!en.isIntersecting) return;
        regua.classList.add('regua--viva');
        obs.unobserve(en.target);
      });
    }, { threshold: 0.25 });
    obs.observe(regua);
  }
})();
