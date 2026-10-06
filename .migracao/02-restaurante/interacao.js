
(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var DIAS = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
  var MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

  /* Data local a partir de "aaaa-mm-dd": evita o fuso do parser UTC. */
  function dataLocal(valor) {
    var p = valor.split('-');
    return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
  }
  function hojeZero() {
    var h = new Date();
    h.setHours(0, 0, 0, 0);
    return h;
  }
  function isoLocal(d) {
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var dia = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + dia;
  }
  function porExtenso(valor) {
    var d = dataLocal(valor);
    return DIAS[d.getDay()] + ', ' + d.getDate() + ' de ' + MESES[d.getMonth()] + ' de ' + d.getFullYear();
  }
  function horaBonita(v) {
    return v.replace(':00', 'h').replace(':', 'h');
  }
  function telefoneMascarado(v) {
    var d = v.replace(/\D/g, '').slice(0, 11);
    if (!d) return '';
    if (d.length <= 2) return '(' + d;
    if (d.length <= 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
    if (d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
    return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
  }

  /* =========================================================
     1. O serviço — o menu degustação que abre tempo por tempo
     ========================================================= */
  var tempos = $$('.tempo');
  var contador = $('#contador');
  var praca = $('#praca');
  var btnTodos = $('#btn-todos');
  var btnPraca = $('#btn-praca');
  var servindo = false;
  var pracaConferida = false;

  function quantosAbertos() {
    return tempos.filter(function (t) { return t.open; }).length;
  }

  function atualizarContador() {
    var n = quantosAbertos();
    var total = tempos.length;
    if (n === 0) contador.textContent = 'Nenhum tempo aberto. Abra um prato para ver a técnica, os ingredientes do dia e a harmonização.';
    else if (n === total) contador.textContent = 'Os 7 tempos abertos. O menu inteiro está à vista — feche o que já leu.';
    else contador.textContent = n + ' de ' + total + ' tempos abertos.';
    if (servindo) return;
    var todos = n === total;
    btnTodos.textContent = todos ? 'Fechar todos os tempos' : 'Abrir todos os 7 tempos';
    btnTodos.setAttribute('aria-expanded', String(todos));
  }

  tempos.forEach(function (t) {
    t.addEventListener('toggle', atualizarContador);
  });

  /* O momento autoral da casa: os tempos abrem em sequência, como um serviço. */
  btnTodos.addEventListener('click', function () {
    if (servindo) return;
    var abrir = quantosAbertos() < tempos.length;
    servindo = true;
    btnTodos.disabled = true;

    if (!abrir) {
      tempos.forEach(function (t) { t.open = false; });
      servindo = false;
      btnTodos.disabled = false;
      atualizarContador();
      return;
    }

    btnTodos.textContent = 'Abrindo os 7 tempos…';
    var passo = reduzido ? 0 : 90;
    tempos.forEach(function (t, i) {
      t.style.setProperty('--atraso', (reduzido ? 0 : i * passo) + 'ms');
      setTimeout(function () { t.open = true; }, i * passo);
    });
    setTimeout(function () {
      servindo = false;
      btnTodos.disabled = false;
      atualizarContador();
    }, tempos.length * passo + 160);
  });

  /* Estado de erro do controle: um tempo que não vem do produtor hoje. */
  btnPraca.addEventListener('click', function () {
    if (btnPraca.disabled) return;
    btnPraca.disabled = true;
    btnPraca.textContent = 'Conferindo com a praça…';
    setTimeout(function () {
      var agora = new Date();
      var hh = agora.getHours() + 'h' + String(agora.getMinutes()).padStart(2, '0');
      btnPraca.disabled = false;
      btnPraca.textContent = pracaConferida ? 'Conferir de novo' : 'Conferir o que chegou hoje';
      if (pracaConferida) {
        praca.textContent = 'Praça conferida de novo às ' + hh + ': nada mudou desde a primeira conferência.';
        return;
      }
      pracaConferida = true;
      praca.textContent = 'Praça conferida às ' + hh + ': seis tempos saem como estão escritos. O atum não veio — o barco não saiu de Ubatuba com o mar grosso, e o tempo 2 sai hoje com pescada-amarela do mesmo pescador.';
      $('#aviso-2').hidden = false;
      $('#troca-2').hidden = false;
    }, 600);
  });

  atualizarContador();

  /* =========================================================
     2. Reserva com validação real (tudo em memória)
     ========================================================= */
  var form = $('#form-reserva');
  var recibo = $('#recibo');
  var campoData = $('#data');
  var campoHorario = $('#horario');
  var campoPessoas = $('#pessoas');
  var campoNome = $('#nome');
  var campoTelefone = $('#telefone');
  var campoRestricao = $('#restricao');
  var campoOutro = $('#restricao-outro');
  var avisoReserva = $('#aviso-reserva');
  var btnReservar = $('#btn-reservar');
  var textoReciboVazio = recibo.innerHTML;

  campoData.min = isoLocal(hojeZero());

  var regras = {
    data: function (v) {
      if (!v) return 'Escolha a data do jantar. Abrimos de quinta a sábado.';
      var d = dataLocal(v);
      if (d < hojeZero()) return 'Essa data já passou. Escolha uma quinta, sexta ou sábado a partir de hoje.';
      if (d.getDay() < 4) return 'Abrimos de quinta a sábado. Escolha uma dessas datas.';
      return '';
    },
    horario: function (v) {
      return v ? '' : 'Escolha o horário de entrada, entre 19h e 21h.';
    },
    pessoas: function (v) {
      var n = parseInt(v, 10);
      if (!n) return 'Diga quantas pessoas vêm.';
      if (n > 6) return 'Para ' + n + ' pessoas a mesa é fechada por telefone: ligue (11) 90000-0000.';
      return '';
    },
    nome: function (v) {
      return v.trim().length >= 2 ? '' : 'Escreva o nome de quem reserva, com pelo menos 2 letras.';
    },
    telefone: function (v) {
      var d = v.replace(/\D/g, '');
      if (d.length < 10) return 'O telefone precisa de DDD e número — 10 dígitos no mínimo. Exemplo: (11) 90000-0000.';
      return '';
    },
    restricao: function (v) {
      return v ? '' : 'Escolha uma opção. Se não houver restrição, marque "Nenhuma".';
    },
    'restricao-outro': function (v) {
      if (campoRestricao.value !== 'outro') return '';
      return v.trim().length >= 3 ? '' : 'Conte em uma linha o que a cozinha precisa saber.';
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
    input.addEventListener('change', function () {
      if ($('[data-campo="' + nome + '"]').classList.contains('campo--erro')) validar(nome);
    });
  });

  /* Máscara do telefone: o número se formata enquanto se digita. */
  campoTelefone.addEventListener('input', function () {
    campoTelefone.value = telefoneMascarado(campoTelefone.value);
  });

  /* Restrição "outro" abre o campo de texto; vegetariano lembra o preço. */
  campoRestricao.addEventListener('change', function () {
    var outro = campoRestricao.value === 'outro';
    var caixaOutro = $('[data-campo="restricao-outro"]');
    caixaOutro.hidden = !outro;
    if (!outro) {
      campoOutro.value = '';
      caixaOutro.classList.remove('campo--erro');
      $('[data-erro="restricao-outro"]').textContent = '';
    } else {
      campoOutro.focus();
    }
    $('#dica-restricao').hidden = campoRestricao.value !== 'vegetariano';
  });

  /* Aviso de sábado cheio: estado de aviso, nunca de erro. */
  function checarAviso() {
    var data = campoData.value;
    var hora = campoHorario.value;
    if (!data || !hora || regras.data(data)) { avisoReserva.hidden = true; return; }
    var d = dataLocal(data);
    if (d.getDay() === 6 && hora === '20:00') {
      avisoReserva.hidden = false;
      avisoReserva.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16.2v.6"/></svg>'
        + '<span><b>Sábado às 20h é o horário mais cheio da casa.</b> A mesa costuma sair com 20 a 30 minutos de espera na porta. Às 19h ou às 21h ela sai na hora — se preferir manter as 20h, a gente guarda assim mesmo.</span>';
    } else {
      avisoReserva.hidden = true;
    }
  }
  campoData.addEventListener('change', checarAviso);
  campoHorario.addEventListener('change', checarAviso);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = Object.keys(regras).map(validar).every(Boolean);
    if (!ok) {
      var primeiro = $('.campo--erro input, .campo--erro select');
      if (primeiro) primeiro.focus();
      return;
    }
    var rotulo = btnReservar.textContent;
    btnReservar.disabled = true;
    btnReservar.textContent = 'Verificando disponibilidade…';
    setTimeout(function () {
      btnReservar.disabled = false;
      btnReservar.textContent = rotulo;
      mostrarRecibo();
    }, 600);
  });

  function mostrarRecibo() {
    var pessoas = parseInt(campoPessoas.value, 10);
    var rotuloPessoas = pessoas === 1 ? '1 pessoa' : pessoas + ' pessoas';
    var restricao = campoRestricao.options[campoRestricao.selectedIndex].textContent;
    if (campoRestricao.value === 'outro' && campoOutro.value.trim()) {
      restricao = 'Outro — ' + campoOutro.value.trim();
    }
    var menu = campoRestricao.value === 'vegetariano'
      ? 'Menu vegetariano, R$ 240 por pessoa.'
      : (campoRestricao.value === 'nenhuma' ? 'Menu degustação de 7 tempos, R$ 290 por pessoa.' : 'Menu degustação de 7 tempos, R$ 290 por pessoa, com a restrição acima avisada à cozinha.');

    form.hidden = true;
    recibo.innerHTML = '<p class="recibo__selo">Mesa pedida</p>'
      + '<p class="recibo__titulo">Mesa para ' + rotuloPessoas + ', ' + porExtenso(campoData.value) + ', às ' + horaBonita(campoHorario.value) + '.</p>'
      + '<dl class="recibo__dados">'
      + '<div><dt>Nome</dt><dd>' + escapar(campoNome.value.trim()) + '</dd></div>'
      + '<div><dt>Telefone</dt><dd>' + escapar(campoTelefone.value) + '</dd></div>'
      + '<div><dt>Pessoas</dt><dd>' + rotuloPessoas + '</dd></div>'
      + '<div><dt>Restrição alimentar</dt><dd>' + escapar(restricao) + '</dd></div>'
      + '<div><dt>Menu</dt><dd>' + escapar(menu) + '</dd></div>'
      + '</dl>'
      + '<p class="recibo__nota">A confirmação chega por WhatsApp no ' + escapar(campoTelefone.value) + ' em até 2 horas. Se precisar mudar, responda a mensagem: até 24 horas antes não há custo.</p>'
      + '<button class="botao botao--vazio" type="button" id="btn-nova">Fazer outra reserva</button>';
    recibo.setAttribute('tabindex', '-1');
    recibo.focus({ preventScroll: false });
    recibo.scrollIntoView({ block: 'nearest', behavior: reduzido ? 'auto' : 'smooth' });
  }

  function escapar(t) {
    return String(t).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  /* Um único listener no recibo: o botão é recriado a cada reserva. */
  recibo.addEventListener('click', function (e) {
    if (!e.target.closest('#btn-nova')) return;
    form.hidden = false;
    form.reset();
    $$('.campo--erro', form).forEach(function (c) { c.classList.remove('campo--erro'); });
    $$('.campo__erro', form).forEach(function (c) { c.textContent = ''; });
    $$('[aria-invalid]', form).forEach(function (c) { c.setAttribute('aria-invalid', 'false'); });
    $('[data-campo="restricao-outro"]').hidden = true;
    $('#dica-restricao').hidden = true;
    avisoReserva.hidden = true;
    recibo.removeAttribute('tabindex');
    recibo.innerHTML = textoReciboVazio;
    campoData.min = isoLocal(hojeZero());
    campoData.focus();
  });

  /* =========================================================
     3. Aviso do próximo menu — o formulário do fecho
     ========================================================= */
  var formAviso = $('#form-aviso');
  var recadoAviso = $('#recado-aviso');

  var regrasAviso = {
    'aviso-nome': function (v) { return v.trim().length >= 2 ? '' : 'Escreva seu nome, com pelo menos 2 letras.'; },
    'aviso-email': function (v) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Confira o e-mail: falta algo como nome@exemplo.com.br.';
    }
  };

  function validarAviso(nome) {
    var input = $('[name="' + nome + '"]');
    var msg = regrasAviso[nome](input.value);
    var caixa = $('[data-campo="' + nome + '"]');
    caixa.classList.toggle('campo--erro', Boolean(msg));
    $('[data-erro="' + nome + '"]').textContent = msg;
    input.setAttribute('aria-invalid', String(Boolean(msg)));
    return !msg;
  }

  Object.keys(regrasAviso).forEach(function (nome) {
    var input = $('[name="' + nome + '"]');
    input.addEventListener('blur', function () { validarAviso(nome); });
    input.addEventListener('input', function () {
      if ($('[data-campo="' + nome + '"]').classList.contains('campo--erro')) validarAviso(nome);
    });
  });

  formAviso.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = Object.keys(regrasAviso).map(validarAviso).every(Boolean);
    if (!ok) {
      var primeiro = $('.campo--erro input', formAviso);
      if (primeiro) primeiro.focus();
      recadoAviso.textContent = '';
      return;
    }
    var botao = $('#btn-aviso');
    var rotulo = botao.textContent;
    botao.disabled = true;
    botao.textContent = 'Anotando…';
    setTimeout(function () {
      botao.disabled = false;
      botao.textContent = rotulo;
      recadoAviso.textContent = 'Anotado, ' + $('#aviso-nome').value.trim().split(' ')[0]
        + '. Em 19 de março você recebe o menu de outono em ' + $('#aviso-email').value.trim() + '.';
      formAviso.reset();
    }, 600);
  });
})();
