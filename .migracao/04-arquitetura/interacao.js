
(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =========================================================
     1. TRILHO DE PRANCHAS
     Rolagem nativa com scroll-snap; o teclado move o foco de
     prancha em prancha e cada prancha abre a própria ficha.
     ========================================================= */
  var trilho = $('#trilho');
  var pranchas = $$('.prancha', trilho);
  var contador = $('#trilho-contador');
  var btAntes = $('#trilho-antes');
  var btDepois = $('#trilho-depois');
  var atual = 0;
  var total = pranchas.length;
  var viaPonteiro = false;   /* o foco veio de um clique, não do teclado */
  var pularFoco = false;     /* estamos devolvendo o foco de propósito */

  function indiceVisivel() {
    var esq = trilho.scrollLeft;
    var dir = esq + trilho.clientWidth;
    var melhor = 0;
    var maior = -1;
    pranchas.forEach(function (p, i) {
      var visivel = Math.min(p.offsetLeft + p.offsetWidth, dir) - Math.max(p.offsetLeft, esq);
      if (visivel > maior) { maior = visivel; melhor = i; }
    });
    return melhor;
  }

  function escreverContador(i) {
    contador.textContent = 'prancha ' + (i + 1) + ' de ' + total;
  }

  function atualizarBarra(i) {
    atual = i;
    escreverContador(i);
    btAntes.disabled = i === 0;
    btDepois.disabled = i === total - 1;
    pranchas.forEach(function (p, n) {
      if (n === i) { p.setAttribute('data-atual', 'sim'); } else { p.removeAttribute('data-atual'); }
    });
  }

  function centralizar(i) {
    var p = pranchas[i];
    var alvo = p.offsetLeft - (trilho.clientWidth - p.offsetWidth) / 2;
    if (typeof trilho.scrollTo === 'function') {
      trilho.scrollTo({ left: alvo, behavior: reduzido ? 'auto' : 'smooth' });
    } else {
      trilho.scrollLeft = alvo;
    }
  }

  function irPara(i, focar) {
    i = Math.max(0, Math.min(total - 1, i));
    centralizar(i);
    atualizarBarra(i);
    if (focar) {
      var b = $('.prancha__abrir', pranchas[i]);
      if (b) { b.focus({ preventScroll: true }); }
    }
  }

  /* Abre a ficha: foco e clique expandem, Escape recolhe. */
  function abrir(prancha, abrirFicha) {
    var botao = $('.prancha__abrir', prancha);
    var painel = $('.prancha__completa', prancha);
    if (!botao || !painel) { return; }
    painel.hidden = !abrirFicha;
    botao.setAttribute('aria-expanded', String(abrirFicha));
    prancha.setAttribute('data-aberta', String(abrirFicha));
  }

  function recolherTodas(exceto) {
    pranchas.forEach(function (p) { if (p !== exceto) { abrir(p, false); } });
  }

  pranchas.forEach(function (p) {
    var botao = $('.prancha__abrir', p);
    var fechar = $('.prancha__fechar', p);

    botao.addEventListener('click', function () {
      var expandida = botao.getAttribute('aria-expanded') === 'true';
      recolherTodas(p);
      abrir(p, !expandida);
    });

    /* Foco também abre — mas só quando o foco vem do teclado.
       Sem a guarda, o foco do clique abriria a ficha e o clique
       seguinte fecharia na mesma batida. */
    p.addEventListener('focusin', function () {
      if (viaPonteiro || pularFoco) { return; }
      recolherTodas(p);
      abrir(p, true);
    });

    if (fechar) {
      fechar.addEventListener('click', function () {
        pularFoco = true;
        abrir(p, false);
        botao.focus({ preventScroll: true });
        window.setTimeout(function () { pularFoco = false; }, 0);
      });
    }

    p.addEventListener('click', function (e) {
      if (e.target.closest('button, a, summary, input, label')) { return; }
      recolherTodas(p);
      abrir(p, true);
    });
  });

  var quadro = 0;
  trilho.addEventListener('scroll', function () {
    if (quadro) { return; }
    quadro = window.requestAnimationFrame(function () {
      quadro = 0;
      var i = indiceVisivel();
      if (i !== atual) { atualizarBarra(i); }
    });
  }, { passive: true });

  /* Marca a origem do foco: ponteiro ou teclado. */
  trilho.addEventListener('pointerdown', function () { viaPonteiro = true; }, true);
  document.addEventListener('keydown', function () { viaPonteiro = false; }, true);

  btAntes.addEventListener('click', function () { irPara(atual - 1, true); });
  btDepois.addEventListener('click', function () { irPara(atual + 1, true); });

  $('#projetos').addEventListener('keydown', function (e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') { return; }
    if (e.key === 'ArrowRight') { e.preventDefault(); irPara(atual + 1, true); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); irPara(atual - 1, true); }
    else if (e.key === 'Home') { e.preventDefault(); irPara(0, true); }
    else if (e.key === 'End') { e.preventDefault(); irPara(total - 1, true); }
    else if (e.key === 'Escape') { recolherTodas(null); }
  });

  atualizarBarra(0);

  /* O desenho sendo traçado — o único movimento autoral do modelo. */
  var projetos = $('#projetos');
  function desenhar() {
    pranchas.forEach(function (p, i) {
      p.style.setProperty('--atraso', (i * 0.11) + 's');
      p.classList.add('desenhou');
    });
  }
  if (reduzido || !('IntersectionObserver' in window)) {
    desenhar();
  } else {
    var obsDesenho = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (!en.isIntersecting) { return; }
        desenhar();
        obsDesenho.disconnect();
      });
    }, { threshold: 0.12 });
    obsDesenho.observe(projetos);
    window.setTimeout(function () { desenhar(); obsDesenho.disconnect(); }, 2200);
  }

  /* =========================================================
     2. ESTIMADOR DE HONORÁRIOS
     Tabela interna do ateliê. A memória de cálculo é mostrada
     inteira: é ela que dá credibilidade ao número.
     ========================================================= */
  var TABELA = {
    residencial: { rotulo: 'Residencial', projeto: 180, obra: 4800, base: 5 },
    interiores: { rotulo: 'Interiores', projeto: 140, obra: 3200, base: 4 },
    comercial: { rotulo: 'Comercial', projeto: 210, obra: 5400, base: 6 },
    reforma: { rotulo: 'Reforma', projeto: 120, obra: 2900, base: 3 }
  };

  function fatorArea(area) {
    if (area <= 120) { return 0.6; }
    if (area <= 250) { return 1; }
    if (area <= 500) { return 1.35; }
    return 1.7;
  }

  function reais(v) {
    return 'R$ ' + Math.round(v).toLocaleString('pt-BR', { maximumFractionDigits: 0 });
  }

  function metros(v) {
    return v.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) + ' m²';
  }

  function paraNumero(texto) {
    var t = String(texto).replace(/[^\d.,]/g, '');
    if (!t) { return NaN; }
    if (t.indexOf(',') > -1) { return parseFloat(t.replace(/\./g, '').replace(',', '.')); }
    if ((t.match(/\./g) || []).length > 1) { return parseFloat(t.replace(/\./g, '')); }
    if (/\.\d{3}$/.test(t)) { return parseFloat(t.replace(/\./g, '')); }
    return parseFloat(t);
  }

  var caixa = $('#estimador-caixa');
  var campoArea = $('#area');
  var erroArea = $('#area-erro');
  var btnCalcular = $('#btn-calcular');
  var saidaTitulo = $('#saida-titulo');
  var saidaFaixa = $('#saida-faixa');
  var saidaMemoria = $('#saida-memoria');
  var saidaNota = $('#saida-nota');
  var temporizador = 0;

  function limparSaida() {
    saidaFaixa.innerHTML = '';
    saidaMemoria.innerHTML = '';
    saidaNota.textContent = '';
  }

  function linhaMemoria(rotulo, valor) {
    var div = document.createElement('div');
    var dt = document.createElement('dt');
    var dd = document.createElement('dd');
    dt.textContent = rotulo;
    dd.textContent = valor;
    div.appendChild(dt);
    div.appendChild(dd);
    return div;
  }

  function semSaida(titulo, nota) {
    limparSaida();
    saidaTitulo.textContent = titulo;
    saidaNota.textContent = nota;
  }

  function marcarErro(msg) {
    caixa.setAttribute('data-estado', 'erro');
    campoArea.setAttribute('aria-invalid', 'true');
    erroArea.textContent = msg;
    semSaida('memória de cálculo', 'Corrija a área para o ateliê calcular a faixa.');
  }

  function limparErro() {
    campoArea.removeAttribute('aria-invalid');
    erroArea.textContent = '';
  }

  function calcular(area, tipo) {
    var t = TABELA[tipo];
    var honorario = area * t.projeto;
    var custoObra = area * t.obra;
    var comObra = $('input[name="acompanhamento"]:checked').value === 'obra';
    var acompanhamento = comObra ? custoObra * 0.06 : 0;
    var subtotal = honorario + acompanhamento;
    var mesesProjeto = Math.max(2, Math.round(t.base * fatorArea(area)));
    var mesesObra = Math.max(6, Math.round(mesesProjeto * 1.8));

    return {
      tipo: t, area: area, comObra: comObra,
      honorario: honorario, custoObra: custoObra, acompanhamento: acompanhamento,
      subtotal: subtotal, min: subtotal * 0.85, max: subtotal * 1.15,
      mesesProjeto: mesesProjeto, mesesObra: mesesObra,
      mesesTotal: mesesProjeto + (comObra ? mesesObra : 0)
    };
  }

  function pintarResultado(d) {
    limparSaida();
    caixa.setAttribute('data-estado', 'resultado');
    saidaTitulo.textContent = 'memória de cálculo';

    var faixa = document.createElement('div');
    faixa.className = 'faixa-honorarios';
    var rotulo = document.createElement('p');
    rotulo.className = 'mono';
    rotulo.textContent = 'faixa estimada de honorários ±15%';
    var valores = document.createElement('p');
    valores.className = 'faixa-honorarios__valores';
    var b1 = document.createElement('b');
    var meio = document.createElement('i');
    var b2 = document.createElement('b');
    b1.textContent = reais(d.min);
    meio.textContent = 'a';
    b2.textContent = reais(d.max);
    valores.appendChild(b1);
    valores.appendChild(meio);
    valores.appendChild(b2);
    var prazo = document.createElement('p');
    prazo.className = 'mono faixa-honorarios__prazo';
    prazo.textContent = 'prazo estimado: ' + d.mesesTotal + ' meses'
      + (d.comObra ? ' (projeto executivo ' + d.mesesProjeto + ' + obra ' + d.mesesObra + ')' : ' (projeto executivo)');
    faixa.appendChild(rotulo);
    faixa.appendChild(valores);
    faixa.appendChild(prazo);
    saidaFaixa.appendChild(faixa);

    var linhas = [
      ['área de intervenção', metros(d.area)],
      ['tipo de projeto', d.tipo.rotulo],
      ['honorário de projeto executivo', metros(d.area) + ' × ' + reais(d.tipo.projeto) + '/m² = ' + reais(d.honorario)],
      ['custo de obra estimado', metros(d.area) + ' × ' + reais(d.tipo.obra) + '/m² = ' + reais(d.custoObra)],
      ['acompanhamento de obra (6%)', d.comObra ? '6% × ' + reais(d.custoObra) + ' = ' + reais(d.acompanhamento) : 'não contratado = R$ 0'],
      ['honorários antes da faixa', reais(d.honorario) + ' + ' + reais(d.acompanhamento) + ' = ' + reais(d.subtotal)],
      ['faixa final', reais(d.min) + ' a ' + reais(d.max)],
      ['prazo do projeto executivo', d.mesesProjeto + ' meses'],
      ['prazo de obra' + (d.comObra ? ' acompanhada' : ' (referência)'), d.mesesObra + ' meses']
    ];

    linhas.forEach(function (l, i) {
      var el = linhaMemoria(l[0], l[1]);
      if (!reduzido) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(3px)';
        window.setTimeout(function () {
          el.style.transition = 'opacity .3s ease, transform .3s ease';
          el.style.opacity = '1';
          el.style.transform = 'none';
        }, 40 + i * 70);
      }
      saidaMemoria.appendChild(el);
    });

    if (d.area > 2000) {
      var aviso = document.createElement('p');
      aviso.className = 'saida__aviso';
      aviso.textContent = 'Acima de 2.000 m² o ateliê não trabalha por tabela: um projeto desse porte precisa de conversa, equipe dedicada e proposta própria.';
      saidaFaixa.appendChild(aviso);
      caixa.setAttribute('data-estado', 'aviso');
    }

    saidaNota.textContent = 'Faixa estimada sobre a área informada. O valor final depende do escopo: declividade, disciplinas complementares, tombamento e distância da obra.';
  }

  function pintarAviso(area) {
    limparSaida();
    caixa.setAttribute('data-estado', 'aviso');
    saidaTitulo.textContent = 'fora da faixa de atendimento';
    var aviso = document.createElement('p');
    aviso.className = 'saida__aviso saida__aviso--forte';
    aviso.textContent = 'O ateliê não atende projetos abaixo de 40 m². Para ' + metros(area)
      + ' não há honorário de projeto executivo a estimar — e não vamos inventar um número só para preencher a tela.';
    var dica = document.createElement('p');
    dica.className = 'saida__nota';
    dica.textContent = 'Se for um ambiente único dentro de uma obra maior, ou uma consultoria pontual de 1 a 2 visitas, escreva pelo formulário: isso sai por hora, não por m².';
    saidaFaixa.appendChild(aviso);
    saidaNota.textContent = 'A tabela por m² começa em 40 m². Abaixo disso o custo fixo de levantamento e desenho não fecha.';
    saidaFaixa.appendChild(dica);
  }

  function enviar(e) {
    e.preventDefault();
    window.clearTimeout(temporizador);

    if ($('input[name="acompanhamento"]:checked') === null) {
      $('input[name="acompanhamento"]').checked = true;
    }

    var area = paraNumero(campoArea.value);
    if (isNaN(area) || area <= 0) {
      marcarErro('Escreva a área em metros quadrados, só números. Exemplo: 412 ou 1.240.');
      campoArea.focus();
      return;
    }
    if (area > 20000) {
      marcarErro('Esse número parece grande demais para uma área em m². Confira antes de calcular.');
      campoArea.focus();
      return;
    }

    limparErro();
    var tipo = $('input[name="tipo"]:checked').value;

    caixa.setAttribute('data-estado', 'carregando');
    btnCalcular.disabled = true;
    btnCalcular.textContent = 'Calculando…';
    saidaTitulo.textContent = 'memória de cálculo';
    limparSaida();
    var esperando = document.createElement('p');
    esperando.className = 'saida__nota mono';
    esperando.textContent = 'levantando a tabela de 2026…';
    saidaFaixa.appendChild(esperando);

    temporizador = window.setTimeout(function () {
      btnCalcular.disabled = false;
      btnCalcular.textContent = 'Calcular honorários';

      if (area < 40) {
        pintarAviso(area);
        return;
      }
      pintarResultado(calcular(area, tipo));
    }, reduzido ? 60 : 640);
  }

  $('#form-estimador').addEventListener('submit', enviar);

  $('#form-estimador').addEventListener('reset', function () {
    window.clearTimeout(temporizador);
    window.setTimeout(function () {
      limparErro();
      caixa.setAttribute('data-estado', 'vazio');
      btnCalcular.disabled = false;
      btnCalcular.textContent = 'Calcular honorários';
      semSaida('memória de cálculo', 'Preencha a área e o tipo de projeto. A conta aparece aqui linha por linha, com o valor de cada m².');
    }, 0);
  });

  campoArea.addEventListener('input', function () {
    if (campoArea.getAttribute('aria-invalid') === 'true') { limparErro(); }
  });

  /* Estado inicial: vazio, com a explicação do que vai aparecer. */
  semSaida('memória de cálculo', 'Preencha a área e o tipo de projeto. A conta aparece aqui linha por linha, com o valor de cada m².');

  /* =========================================================
     3. FORMULÁRIO — FALAR SOBRE UM TERRENO
     ========================================================= */
  var regras = {
    nome: function (v) {
      if (v.trim().length < 2) { return 'Escreva pelo menos duas letras.'; }
      return '';
    },
    email: function (v) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) { return 'Confira o e-mail: falta algo como nome@exemplo.com.br.'; }
      return '';
    },
    cidade: function (v) {
      if (v.trim().length < 2) { return 'Diga a cidade do terreno.'; }
      return '';
    },
    areaterreno: function (v) {
      var n = paraNumero(v);
      if (isNaN(n) || n <= 0) { return 'Diga a área do terreno em m², só números.'; }
      if (n < 40) { return 'Abaixo de 40 m² o ateliê não atende — escreva mesmo assim se for consultoria pontual.'; }
      return '';
    },
    etapa: function (v) {
      if (!v) { return 'Escolha em que ponto você está.'; }
      return '';
    },
    recado: function (v) {
      if (v.trim().length < 15) { return 'Conte um pouco mais: cinco linhas ajudam mais que uma frase.'; }
      return '';
    }
  };

  function validar(nome) {
    var campo = $('[name="' + nome + '"]');
    if (!campo) { return true; }
    var msg = regras[nome](campo.value);
    var caixaCampo = $('[data-campo="' + nome + '"]');
    caixaCampo.classList.toggle('campo--erro', Boolean(msg));
    $('[data-erro="' + nome + '"]').textContent = msg;
    campo.setAttribute('aria-invalid', String(Boolean(msg)));
    return !msg;
  }

  Object.keys(regras).forEach(function (nome) {
    var campo = $('[name="' + nome + '"]');
    campo.addEventListener('blur', function () { validar(nome); });
    campo.addEventListener('input', function () {
      if ($('[data-campo="' + nome + '"]').classList.contains('campo--erro')) { validar(nome); }
    });
    campo.addEventListener('change', function () {
      if ($('[data-campo="' + nome + '"]').classList.contains('campo--erro')) { validar(nome); }
    });
  });

  $('#form-terreno').addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = Object.keys(regras).map(validar).every(Boolean);
    if (!ok) {
      var primeiro = $('.campo--erro input, .campo--erro select, .campo--erro textarea');
      if (primeiro) { primeiro.focus(); }
      return;
    }

    var botao = $('#btn-terreno');
    botao.disabled = true;
    botao.textContent = 'Enviando…';

    window.setTimeout(function () {
      var recado = $('#recado-ok');
      var primeiroNome = $('#nome').value.trim().split(' ')[0];
      var etapa = $('#etapa').options[$('#etapa').selectedIndex].text;
      recado.hidden = false;
      recado.innerHTML = '<b>Recebemos o seu terreno, ' + primeiroNome + '.</b>'
        + '<span>Em uma versão publicada, a resposta chegaria em ' + $('#email').value.trim()
        + ' em até dois dias úteis, com a leitura de ' + $('#cidade').value.trim()
        + ' e o que faz sentido para o seu caso (' + etapa.toLowerCase() + ').</span>';
      botao.disabled = false;
      botao.textContent = 'Enviar sobre o terreno';
      recado.scrollIntoView({ block: 'nearest', behavior: reduzido ? 'auto' : 'smooth' });
    }, reduzido ? 100 : 620);
  });
})();
