
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =========================================================
     1. O momento autoral — a caneta azul corrigindo a manchete
     ========================================================= */
  var caixaCorrecao = $('#correcao');

  function corrigir() {
    if (!caixaCorrecao) return;
    $$('.risco', caixaCorrecao).forEach(function (r, i) {
      r.style.transitionDelay = (i * 150) + 'ms';
    });
    caixaCorrecao.classList.add('corrigida');
  }

  if (reduzido || !caixaCorrecao) {
    if (caixaCorrecao) caixaCorrecao.classList.add('corrigida');
  } else {
    caixaCorrecao.classList.add('vai-corrigir');
    setTimeout(corrigir, 420);
  }

  /* =========================================================
     2. Prazo vivo — quanto falta para o fechamento da turma
     ========================================================= */
  function proximaOcorrencia(mes, dia) {
    var hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    var alvo = new Date(hoje.getFullYear(), mes - 1, dia);
    if (alvo < hoje) alvo = new Date(hoje.getFullYear() + 1, mes - 1, dia);
    return { alvo: alvo, hoje: hoje };
  }

  (function contagem() {
    var campo = $('#contagem');
    if (!campo) return;
    var d = proximaOcorrencia(3, 6);
    var dias = Math.round((d.alvo - d.hoje) / 86400000);
    var texto;
    if (dias === 0) texto = 'As inscrições fecham hoje, às 23h59.';
    else if (dias === 1) texto = 'Falta 1 dia para o fechamento das inscrições.';
    else if (dias <= 45) texto = 'Faltam ' + dias + ' dias para o fechamento das inscrições.';
    else texto = 'Inscrições abertas: a turma fecha em 6 de março, ou antes, se as 12 vagas acabarem.';
    campo.textContent = texto + ' Turma de terça, 20h, por 6 semanas.';
  }());

  /* =========================================================
     3. Grade — acordeões que somam carga horária de verdade
     ========================================================= */
  var modulos = $$('.modulo');
  var TOTAIS = { modulos: modulos.length, aulas: 0, horas: 0 };
  modulos.forEach(function (m) {
    TOTAIS.aulas += parseInt(m.dataset.aulas, 10);
    TOTAIS.horas += parseInt(m.dataset.horas, 10);
  });

  var elModulos = $('#p-modulos');
  var elAulas = $('#p-aulas');
  var elHoras = $('#p-horas');
  var elBarra = $('#p-barra');
  var elBarraCaixa = $('#p-barra-caixa');
  var elNota = $('#p-nota');
  var btnAbrir = $('#abrir-tudo');
  var btnFechar = $('#fechar-tudo');

  function piscar(el) {
    if (reduzido) return;
    el.classList.add('mudou');
    setTimeout(function () { el.classList.remove('mudou'); }, 420);
  }

  var jaResumiu = false;

  function resumo() {
    var abertos = 0, aulas = 0, horas = 0;
    modulos.forEach(function (m) {
      var corpo = $('.modulo__corpo', m);
      if (corpo.classList.contains('aberto')) {
        abertos++;
        aulas += parseInt(m.dataset.aulas, 10);
        horas += parseInt(m.dataset.horas, 10);
      }
    });

    elModulos.textContent = abertos;
    elAulas.textContent = aulas;
    elHoras.textContent = horas;
    if (jaResumiu) { piscar(elModulos); piscar(elAulas); piscar(elHoras); }
    jaResumiu = true;

    var pct = TOTAIS.horas ? horas / TOTAIS.horas : 0;
    elBarra.style.transform = 'scaleX(' + pct + ')';
    elBarraCaixa.setAttribute('aria-label', horas + ' de ' + TOTAIS.horas + ' horas visíveis, ' + Math.round(pct * 100) + '% da carga do curso');

    var texto;
    if (abertos === 0) {
      texto = 'Nenhum módulo aberto. Nada visível ainda: 0 de ' + TOTAIS.aulas + ' aulas e 0 de ' + TOTAIS.horas + ' horas.';
    } else if (abertos === TOTAIS.modulos) {
      texto = 'Curso inteiro aberto: ' + TOTAIS.aulas + ' aulas e ' + TOTAIS.horas + ' horas, ' + TOTAIS.modulos + ' módulos.';
    } else {
      texto = abertos + (abertos === 1 ? ' módulo aberto' : ' módulos abertos') + ': ' + aulas + ' de '
        + TOTAIS.aulas + ' aulas e ' + horas + ' de ' + TOTAIS.horas + ' horas visíveis.';
    }
    elNota.textContent = texto;

    btnAbrir.disabled = abertos === TOTAIS.modulos;
    btnFechar.disabled = abertos === 0;
  }

  function abrir(modulo, sim) {
    var botao = $('.modulo__botao', modulo);
    var corpo = $('.modulo__corpo', modulo);
    corpo.classList.toggle('aberto', sim);
    botao.setAttribute('aria-expanded', String(sim));
    modulo.classList.toggle('modulo--aberto', sim);
  }

  modulos.forEach(function (m) {
    var botao = $('.modulo__botao', m);
    botao.addEventListener('click', function () {
      abrir(m, botao.getAttribute('aria-expanded') !== 'true');
      resumo();
    });
  });

  btnAbrir.addEventListener('click', function () {
    modulos.forEach(function (m) { abrir(m, true); });
    resumo();
  });
  btnFechar.addEventListener('click', function () {
    modulos.forEach(function (m) { abrir(m, false); });
    resumo();
  });

  resumo();

  /* =========================================================
     4. Quiz de nivelamento — recomenda trilha de verdade
     ========================================================= */
  var PERGUNTAS = [
    {
      id: 'experiencia',
      titulo: 'Você já escreveu texto para vender alguma coisa?',
      ajuda: 'Vale anúncio de rede social, e-mail de loja, catálogo, post de propaganda, proposta comercial.',
      opcoes: [
        { id: 'nunca', rotulo: 'Nunca escrevi', nota: 'nem para mim, nem no trabalho' },
        { id: 'algumas', rotulo: 'Algumas vezes', nota: 'já escrevi, mas sem método nenhum' },
        { id: 'trabalho', rotulo: 'Trabalho com isso', nota: 'escrever para vender faz parte do meu trabalho' }
      ]
    },
    {
      id: 'tempo',
      titulo: 'Quanto tempo por semana você tem para o curso?',
      ajuda: 'Conte o encontro ao vivo, a leitura e a escrita do exercício. Seja realista: é isso que decide a sua trilha.',
      opcoes: [
        { id: 'ate2', rotulo: 'Até 2 horas', nota: 'duas horas por semana, no máximo' },
        { id: '3a5', rotulo: 'De 3 a 5 horas', nota: 'dá para encaixar, mas com disciplina' },
        { id: 'mais5', rotulo: 'Mais de 5 horas', nota: 'consigo manter 6 ou 7 horas tranquilamente' }
      ]
    },
    {
      id: 'objetivo',
      titulo: 'O que você quer ao final das seis semanas?',
      ajuda: 'Escolha o que mais pesa hoje. A recomendação muda por causa desta resposta.',
      opcoes: [
        { id: 'trabalho', rotulo: 'Escrever melhor no meu trabalho', nota: 'e-mail, proposta, apresentação, post' },
        { id: 'portifolio', rotulo: 'Montar portfólio para entrar na área', nota: 'quero ser redatora ou redator' },
        { id: 'time', rotulo: 'Melhorar o que a minha equipe já escreve', nota: 'eu reviso o texto dos outros' }
      ]
    }
  ];

  var TRILHAS = {
    coletiva: {
      nome: 'Oficina · turma coletiva, 6 semanas',
      preco: 'R$ 1.290 à vista · 12x de R$ 129 (total R$ 1.548)',
      carga: 'cerca de 7 h por semana — 1h30 de encontro, 1h30 de leitura e umas 4 h de escrita',
      turma: '9 de março',
      vagas: '8 de 12 vagas',
      opcao: 'coletiva'
    },
    estendida: {
      nome: 'Oficina · turma estendida, 9 semanas',
      preco: 'R$ 1.290 à vista · 12x de R$ 129 (total R$ 1.548) — mesmo preço, mesmo conteúdo',
      carga: 'cerca de 4 h 40 por semana — a mesma ementa espalhada em 9 semanas',
      turma: '16 de março',
      vagas: '10 de 12 vagas',
      opcao: 'estendida'
    },
    mentoria: {
      nome: 'Oficina + 4 mentorias individuais',
      preco: 'R$ 2.480 à vista · 12x de R$ 248 (total R$ 2.976)',
      carga: 'cerca de 8 h por semana nas semanas com mentoria, 7 h nas outras',
      turma: '9 de março',
      vagas: '6 vagas com mentoria',
      opcao: 'mentoria'
    },
    corporativa: {
      nome: 'Turma fechada para a sua equipe',
      preco: 'a partir de R$ 6.900 para até 12 pessoas, com ementa montada com você',
      carga: 'definida com você, entre 6 e 10 semanas, no horário da equipe',
      turma: 'primeira conversa em até 48 h',
      vagas: '2 turmas fechadas por mês',
      opcao: 'corporativa'
    }
  };

  function decidir(r) {
    var e = r.experiencia, t = r.tempo, o = r.objetivo;
    if (e === 'trabalho' && t === 'mais5' && o === 'time') return 'corporativa';
    if (t === 'ate2') return 'estendida';
    if (o === 'time' && e === 'trabalho') return 'mentoria';
    if (o === 'portifolio' && e === 'trabalho') return 'mentoria';
    if (e === 'trabalho' && t === 'mais5') return 'mentoria';
    return 'coletiva';
  }

  function explicar(chave, r) {
    if (chave === 'corporativa') {
      return 'Você já escreve para vender, tem mais de 5 horas por semana e o que quer melhorar é o texto do time — não o seu. Pagar uma turma coletiva para reencontrar o básico seria desperdício: o que a sua equipe precisa é de uma ementa montada sobre os textos que ela já escreve. Mande três exemplos reais (um anúncio, um e-mail, uma página) e a Bia monta a turma em cima disso, com os seus problemas no lugar dos exemplos genéricos. Se o seu caso for se aperfeiçoar primeiro e multiplicar depois, a Oficina com mentoria individual custa menos da metade e resolve em quatro encontros.';
    }
    if (chave === 'estendida') {
      var extra = r.objetivo === 'time'
        ? ' Sobre o time: com 2 horas por semana, o caminho é você fazer a Oficina primeiro e levar o método pronto para a equipe depois — revisar texto dos outros sem ter firmado o seu costuma dar errado.'
        : '';
      return 'Com até 2 horas por semana, a turma padrão não fecha, e é melhor dizer isso agora: são 42 horas em 6 semanas, cerca de 7 horas por semana entre encontro, leitura e exercício. A turma estendida espalha exatamente a mesma ementa, com os mesmos professores e a mesma correção individual, em 9 semanas — cerca de 4h40 por semana, mesmo preço. Se nem isso couber no seu mês, o honesto é esperar a turma de maio em vez de pagar para não conseguir entregar.' + extra;
    }
    if (chave === 'mentoria') {
      if (r.objetivo === 'portifolio') {
        return 'Você já escreve para vender no trabalho e o seu objetivo é portfólio. A turma coletiva entrega as três peças, mas portfólio é decisão individual: o que entra, o que sai e como defender cada peça muda de pessoa para pessoa. Nas quatro mentorias você monta o portfólio com a Bia olhando o seu material e ensaia a defesa de cada peça antes da entrevista. É a trilha mais cara das três — e a que costuma virar contratação mais rápido.';
      }
      return 'Você já escreve por profissão e tem mais de 5 horas por semana: a turma coletiva vai passar rápido por coisas que você já faz sem pensar. Nas quatro mentorias individuais o trabalho é sobre o seu texto — o que você escreveu nos últimos meses, o que trava e o que revisar. Você pode fazer as duas coisas juntas: a Oficina pela ementa completa e a mentoria pelo seu material.';
    }
    if (r.objetivo === 'portifolio') {
      return 'Você começa do zero e quer entrar na área: é exatamente para isso que a turma coletiva foi montada. Os módulos 1 a 5 constroem o método e o módulo 6 fecha as três peças do portfólio, com a simulação de entrevista do Tomás. Cinco horas por semana bastam para acompanhar, e o nivelamento garante que você não fique no grupo de quem já escreve por profissão.';
    }
    if (r.objetivo === 'time') {
      return 'Você quer melhorar o texto da equipe e ainda está firmando o seu. A turma coletiva é a trilha certa: o módulo 5, de revisão, é o que se traduz direto para revisar texto dos outros — e você termina com o vocabulário e os critérios na mão, o que muda a conversa com o time. Se depois disso a equipe inteira precisar, existe a turma fechada.';
    }
    return 'Você quer escrever melhor no trabalho e tem tempo para acompanhar: a turma coletiva é a trilha certa. São seis semanas com um exercício corrigido por semana, sempre sobre um briefing real, e o método serve tanto para um e-mail de cobrança quanto para uma página de vendas. Cinco horas por semana é o bastante para acompanhar sem correr.';
  }

  var respostas = {};
  var passo = 0;
  var enviando = false;
  var palco = $('#quiz-palco');
  var elPasso = $('#quiz-passo');
  var elBarraQuiz = $('#quiz-barra');
  var elBarraQuizCaixa = $('#quiz-barra-caixa');
  var elErro = $('#quiz-erro');
  var btnVoltar = $('#quiz-voltar');
  var btnSeguir = $('#quiz-seguir');
  var elResultado = $('#quiz-resultado');

  function limparErro() {
    elErro.hidden = true;
    elErro.textContent = '';
  }

  function renderPergunta() {
    var p = PERGUNTAS[passo];
    var escolhida = respostas[p.id];
    var html = '<h3 class="quiz__pergunta" id="quiz-pergunta">' + p.titulo + '</h3>'
      + '<p class="quiz__ajuda">' + p.ajuda + '</p>'
      + '<div class="quiz__opcoes" role="group" aria-labelledby="quiz-pergunta">';
    p.opcoes.forEach(function (o) {
      var marcada = escolhida === o.id;
      html += '<button class="opcao" type="button" data-opcao="' + o.id + '" aria-pressed="' + marcada + '">'
        + '<span class="opcao__pino" aria-hidden="true"></span>'
        + '<span class="opcao__texto"><b>' + o.rotulo + '</b><small>' + o.nota + '</small></span>'
        + '</button>';
    });
    html += '</div>';
    palco.innerHTML = html;
    if (!reduzido) {
      palco.classList.remove('quiz__palco--entra');
      void palco.offsetWidth;
      palco.classList.add('quiz__palco--entra');
    }

    elPasso.textContent = 'Pergunta ' + (passo + 1) + ' de 3';
    elBarraQuiz.style.transform = 'scaleX(' + ((passo + 1) / 3) + ')';
    elBarraQuizCaixa.setAttribute('aria-valuenow', String(passo + 1));
    btnVoltar.disabled = passo === 0;
    btnSeguir.disabled = false;
    btnSeguir.textContent = passo === 2 ? 'Ver minha trilha' : 'Continuar';

    $$('.opcao', palco).forEach(function (b) {
      b.addEventListener('click', function () {
        $$('.opcao', palco).forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
        respostas[p.id] = b.dataset.opcao;
        limparErro();
        $('.quiz__opcoes', palco).classList.remove('quiz__opcoes--erro');
      });
    });
  }

  function mostrarResultado() {
    var chave = decidir(respostas);
    var t = TRILHAS[chave];
    var porque = explicar(chave, respostas);
    elResultado.innerHTML = '<div class="veredito">'
      + '<p class="veredito__rotulo">Trilha recomendada para as suas respostas</p>'
      + '<h3 class="veredito__nome">' + t.nome + '</h3>'
      + '<p class="veredito__porque">' + porque + '</p>'
      + '<dl class="veredito__dados">'
      + '<div><dt>carga semanal real</dt><dd>' + t.carga + '</dd></div>'
      + '<div><dt>investimento</dt><dd>' + t.preco + '</dd></div>'
      + '<div><dt>próxima turma</dt><dd><span class="marca">' + t.turma + '</span></dd></div>'
      + '<div><dt>vagas</dt><dd><span class="marca">' + t.vagas + '</span></dd></div>'
      + '</dl>'
      + '<div class="veredito__acoes">'
      + '<button class="botao" type="button" id="veredito-vaga">Garantir minha vaga nesta trilha</button>'
      + '<button class="botao botao--vazio" type="button" id="veredito-refazer">Refazer o quiz</button>'
      + '</div>'
      + '<p class="miudo">Vaga reservada por 48 h depois do envio do formulário. Dá para trocar de trilha na conversa de nivelamento, sem taxa.</p>'
      + '</div>';

    $('#veredito-vaga').addEventListener('click', function () {
      var select = $('#trilha');
      select.value = t.opcao;
      document.getElementById('vaga').scrollIntoView({ behavior: reduzido ? 'auto' : 'smooth', block: 'start' });
      setTimeout(function () { select.focus({ preventScroll: true }); }, reduzido ? 0 : 620);
    });
    $('#veredito-refazer').addEventListener('click', reiniciar);
  }

  function reiniciar() {
    respostas = {};
    passo = 0;
    enviando = false;
    elResultado.innerHTML = '';
    limparErro();
    renderPergunta();
    btnSeguir.disabled = false;
  }

  btnSeguir.addEventListener('click', function () {
    if (enviando) return;
    var p = PERGUNTAS[passo];
    if (!respostas[p.id]) {
      elErro.textContent = 'Escolha uma das três respostas para continuar.';
      elErro.hidden = false;
      var grupo = $('.quiz__opcoes', palco);
      if (grupo) grupo.classList.add('quiz__opcoes--erro');
      var primeiro = $('.opcao', palco);
      if (primeiro) primeiro.focus();
      return;
    }
    limparErro();
    if (passo < 2) {
      passo++;
      renderPergunta();
      return;
    }
    enviando = true;
    btnSeguir.disabled = true;
    btnVoltar.disabled = true;
    var espera = reduzido ? 120 : 900;
    palco.innerHTML = '<div class="quiz__carregando" role="status">'
      + '<p><b>Lendo as suas três respostas e cruzando com as turmas abertas…</b></p>'
      + '<span class="linha-carregando" aria-hidden="true"></span>'
      + '</div>';
    elPasso.textContent = 'Montando a recomendação';
    elBarraQuiz.style.transform = 'scaleX(1)';
    setTimeout(function () {
      enviando = false;
      btnSeguir.disabled = true;
      btnSeguir.textContent = 'Ver minha trilha';
      btnVoltar.disabled = false;
      palco.innerHTML = '<p class="quiz__fechado">Você respondeu as três perguntas. A recomendação está logo abaixo — e você pode refazer o quiz a qualquer momento.</p>';
      mostrarResultado();
      if (!reduzido) elResultado.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, espera);
  });

  btnVoltar.addEventListener('click', function () {
    if (enviando || passo === 0) return;
    passo--;
    elResultado.innerHTML = '';
    limparErro();
    renderPergunta();
  });

  renderPergunta();

  /* =========================================================
     5. Formulário com validação real
     ========================================================= */
  var regras = {
    nome: function (v) { return v.trim().length >= 2 ? '' : 'Escreva pelo menos 2 letras do seu nome.'; },
    email: function (v) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) return 'Confira o e-mail: falta algo como nome@empresa.com.br.';
      return '';
    },
    whatsapp: function (v) {
      var n = v.replace(/\D/g, '');
      if (n.length < 10) return 'Escreva o WhatsApp com DDD, como (11) 90000-0000.';
      if (n.length > 11) return 'Tem dígito a mais — o número brasileiro tem 10 ou 11.';
      return '';
    },
    trilha: function (v) { return v ? '' : 'Escolha qual turma você quer.'; },
    recado: function () { return ''; }
  };

  function validar(nome) {
    var campo = $('[name="' + nome + '"]');
    if (!campo) return true;
    var msg = regras[nome](campo.value);
    $('[data-campo="' + nome + '"]').classList.toggle('campo--erro', Boolean(msg));
    $('[data-erro="' + nome + '"]').textContent = msg;
    campo.setAttribute('aria-invalid', String(Boolean(msg)));
    return !msg;
  }

  Object.keys(regras).forEach(function (nome) {
    var campo = $('[name="' + nome + '"]');
    campo.addEventListener('blur', function () { validar(nome); });
    campo.addEventListener('input', function () {
      if ($('[data-campo="' + nome + '"]').classList.contains('campo--erro')) validar(nome);
    });
    campo.addEventListener('change', function () { validar(nome); });
  });

  $('#form-vaga').addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = Object.keys(regras).map(validar).every(Boolean);
    if (!ok) {
      var primeiro = $('.campo--erro input, .campo--erro select');
      if (primeiro) primeiro.focus();
      return;
    }
    var botao = $('#btn-vaga');
    var textoOriginal = botao.textContent;
    botao.disabled = true;
    botao.textContent = 'Reservando…';
    var nome = $('#nome').value.trim().split(' ')[0];
    var email = $('#email').value.trim();
    var opcao = $('#trilha option:checked').textContent;
    setTimeout(function () {
      var caixa = $('#recado-ok');
      caixa.hidden = false;
      caixa.innerHTML = '<b>Vaga reservada no seu nome, ' + nome + '.</b>'
        + '<span>Trilha escolhida: ' + opcao + '. Em uma versão publicada, o link de pagamento e o contrato chegariam agora em '
        + email + ', com a vaga bloqueada por 48 horas e o nivelamento no mesmo e-mail.</span>';
      botao.disabled = false;
      botao.textContent = textoOriginal;
      caixa.scrollIntoView({ block: 'nearest', behavior: reduzido ? 'auto' : 'smooth' });
    }, reduzido ? 200 : 700);
  });
}());
