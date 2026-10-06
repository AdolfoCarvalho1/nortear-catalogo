
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =========================================================
     1. Terminal vivo — roteiro por canal
     ========================================================= */
  var ROTEIRO = {
    operacoes: {
      saudacao: 'Conectado a 4 fontes: Google Workspace, CRM, Slack e pasta de rede. 2.481 documentos indexados.',
      sugestoes: [
        'Qual o prazo de entrega combinado com a Alvorada?',
        'Quem aprovou o desconto da proposta 4471?',
        'O que ficou pendente da reunião de terça?'
      ],
      respostas: [
        {
          pergunta: 'Qual o prazo de entrega combinado com a Alvorada?',
          resposta: 'O prazo combinado com a Alvorada Log é de 18 dias úteis a partir da aprovação da proposta, com tolerância de 3 dias para atraso de insumo. A multa por atraso é de 0,4% ao dia, limitada a 8% do valor.',
          fontes: [
            ['Contrato 2026/114 · cláusula 7.2', 'PDF assinado', 'há 12 dias'],
            ['E-mail "Revisão de cronograma"', 'Ana Ribeiro', 'há 6 dias'],
            ['Ata da reunião de kickoff', 'SharePoint', 'há 9 dias']
          ]
        },
        {
          pergunta: 'Quem aprovou o desconto da proposta 4471?',
          resposta: 'O desconto de 12% da proposta 4471 foi aprovado por dois diretores, com a condição de antecipar o primeiro pagamento para o dia 5. A alçada usada foi a de desconto comercial até 15%.',
          fontes: [
            ['Thread "Aprovação 4471"', 'Slack · #comercial', 'há 21 dias'],
            ['Proposta 4471 v3', 'CRM', 'há 22 dias'],
            ['Política de alçadas v9', 'Google Drive', 'há 4 meses']
          ]
        },
        {
          pergunta: 'O que ficou pendente da reunião de terça?',
          resposta: 'Três pendências ficaram com o time de operações: revisar o SLA de manutenção, confirmar o técnico residente em Campinas e enviar o relatório de horas até sexta. A revisão do SLA está marcada para a próxima terça.',
          fontes: [
            ['Ata "Comitê de operações"', 'Google Docs', 'há 3 dias'],
            ['Backlog de tarefas', 'Jira', 'atualizado hoje']
          ]
        }
      ]
    },
    juridico: {
      saudacao: 'Conectado a 3 fontes: pasta de contratos, e-mail jurídico e diário oficial. 1.204 documentos indexados.',
      sugestoes: [
        'Tem cláusula de renovação automática no contrato da Serra Azul?',
        'Qual o foro eleito nos contratos de 2026?',
        'Quais contratos vencem nos próximos 60 dias?'
      ],
      respostas: [
        {
          pergunta: 'Tem cláusula de renovação automática no contrato da Serra Azul?',
          resposta: 'Sim. O contrato da Serra Azul renova automaticamente por 12 meses, salvo denúncia com 60 dias de antecedência. A notificação precisa ser por carta com aviso de recebimento, não vale e-mail.',
          fontes: [
            ['Contrato Serra Azul · cláusula 11.4', 'PDF assinado', 'há 8 meses'],
            ['Parecer interno 22/2026', 'Jurídico', 'há 2 meses']
          ]
        },
        {
          pergunta: 'Qual o foro eleito nos contratos de 2026?',
          resposta: 'Nos 34 contratos de 2026, o foro eleito é a comarca de São Paulo, com exceção de dois contratos com o setor público, que seguem o foro da sede do órgão contratante.',
          fontes: [
            ['Índice de contratos 2026', 'Planilha', 'atualizado há 5 dias'],
            ['Contrato 2026/091 · cláusula 14.1', 'PDF assinado', 'há 3 meses']
          ]
        },
        {
          pergunta: 'Quais contratos vencem nos próximos 60 dias?',
          resposta: 'Quatro contratos vencem nos próximos 60 dias, somando R$ 1,42 milhão em receita recorrente. Dois têm renovação automática e dois exigem aditivo com 30 dias de antecedência.',
          fontes: [
            ['Índice de contratos 2026', 'Planilha', 'atualizado há 5 dias'],
            ['Alerta de vencimento', 'Copiloto', 'gerado agora']
          ]
        }
      ]
    },
    financeiro: {
      saudacao: 'Conectado a 3 fontes: ERP, conciliação bancária e notas fiscais. 3.870 lançamentos indexados.',
      sugestoes: [
        'Por que a margem do cliente Ipê caiu no trimestre?',
        'Qual nota fiscal ainda não foi conciliada?',
        'Quanto ficou de horas não faturadas em maio?'
      ],
      respostas: [
        {
          pergunta: 'Por que a margem do cliente Ipê caiu no trimestre?',
          resposta: 'A margem do Ipê caiu 6,1 pontos no trimestre. O motivo principal é o reajuste de frete não repassado, que sozinho explica 4,3 pontos. O restante vem de 118 horas extras de suporte não faturadas.',
          fontes: [
            ['DRE por cliente · 2º tri', 'ERP', 'fechado há 9 dias'],
            ['Reajuste de tabela de frete', 'Contrato do fornecedor', 'há 3 meses'],
            ['Apontamento de horas', 'Sistema interno', 'atualizado hoje']
          ]
        },
        {
          pergunta: 'Qual nota fiscal ainda não foi conciliada?',
          resposta: 'Existem duas notas pendentes: a 8841, de R$ 18.400, sem baixa bancária, e a 8852, de R$ 7.230, com valor pago menor que o emitido em R$ 230.',
          fontes: [
            ['Conciliação bancária', 'Extrato Itaú', 'atualizado hoje'],
            ['Notas emitidas', 'ERP', 'atualizado hoje']
          ]
        },
        {
          pergunta: 'Quanto ficou de horas não faturadas em maio?',
          resposta: 'Maio fechou com 341 horas não faturadas, equivalentes a R$ 61.380 na tabela vigente. Metade está em três clientes com contrato de escopo fechado.',
          fontes: [
            ['Relatório de horas', 'Sistema interno', 'fechado há 20 dias'],
            ['Tabela de preços 2026', 'Google Drive', 'há 5 meses']
          ]
        }
      ]
    }
  };

  var fluxo = $('#fluxo');
  var sugestoesCaixa = $('#sugestoes');
  var entrada = $('#entrada');
  var campo = $('#pergunta');
  var botaoEnviar = $('#enviar');
  var canalAtual = 'operacoes';
  var ocupado = false;

  function rolar() { fluxo.scrollTop = fluxo.scrollHeight; }

  function criarFala(classe, texto) {
    var d = document.createElement('div');
    d.className = 'fala fala--' + classe;
    d.innerHTML = '<span class="fala__quem">' + (classe === 'eu' ? 'você' : 'copiloto') + '</span>'
      + '<p class="fala__texto"></p>';
    fluxo.appendChild(d);
    var p = $('.fala__texto', d);
    p.textContent = texto || '';
    return p;
  }

  function escrever(p, texto, aoTerminar) {
    if (reduzido) { p.textContent = texto; aoTerminar && aoTerminar(); rolar(); return; }
    var i = 0;
    var cursor = document.createElement('span');
    cursor.className = 'fala__cursor';
    p.after(cursor);
    var t = setInterval(function () {
      i += 3;
      p.textContent = texto.slice(0, i);
      rolar();
      if (i >= texto.length) {
        clearInterval(t);
        p.textContent = texto;
        cursor.remove();
        aoTerminar && aoTerminar();
        rolar();
      }
    }, 16);
  }

  function mostrarFontes(lista) {
    var caixa = document.createElement('div');
    caixa.className = 'fontes';
    caixa.innerHTML = '<span class="fala__quem">fontes usadas</span>';
    lista.forEach(function (f, i) {
      var item = document.createElement('div');
      item.className = 'fontes__item';
      item.style.animationDelay = (i * 90) + 'ms';
      item.innerHTML = '<b>' + f[0] + '</b><span>' + f[1] + '</span><span>' + f[2] + '</span>';
      caixa.appendChild(item);
    });
    fluxo.appendChild(caixa);
    rolar();
  }

  function responder(pergunta) {
    var dados = ROTEIRO[canalAtual];
    var achado = null;
    dados.respostas.forEach(function (r) {
      if (!achado && (r.pergunta.toLowerCase() === pergunta.toLowerCase()
        || pergunta.toLowerCase().indexOf(r.pergunta.toLowerCase().slice(0, 22)) === 0)) achado = r;
    });
    var generica = {
      pergunta: pergunta,
      resposta: 'Não encontrei isso na base conectada deste workspace. As fontes ligadas agora cobrem contrato, e-mail, ata e CRM. Para esta pergunta, quem provavelmente sabe é a Ana Ribeiro, que respondeu sobre o mesmo assunto há 6 dias.',
      fontes: [['Busca sem resultado', '3.870 trechos verificados', 'agora']]
    };
    var r = achado || generica;

    ocupado = true;
    botaoEnviar.disabled = true;
    botaoEnviar.textContent = 'Buscando…';
    var espera = reduzido ? 0 : 520;
    setTimeout(function () {
      var p = criarFala('ele', '');
      escrever(p, r.resposta, function () {
        mostrarFontes(r.fontes);
        ocupado = false;
        botaoEnviar.disabled = false;
        botaoEnviar.textContent = 'Perguntar';
      });
    }, espera);
  }

  function carregarCanal(canal) {
    canalAtual = canal;
    var dados = ROTEIRO[canal];
    fluxo.innerHTML = '';
    var p = criarFala('ele', '');
    escrever(p, dados.saudacao);
    sugestoesCaixa.innerHTML = '';
    dados.sugestoes.forEach(function (s) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = s;
      b.addEventListener('click', function () { perguntar(s); });
      sugestoesCaixa.appendChild(b);
    });
  }

  function perguntar(texto) {
    if (ocupado || !texto.trim()) return;
    criarFala('eu', texto.trim());
    campo.value = '';
    ajustarAltura();
    responder(texto.trim());
  }

  function ajustarAltura() {
    campo.style.height = 'auto';
    campo.style.height = Math.min(campo.scrollHeight, 112) + 'px';
  }

  entrada.addEventListener('submit', function (e) {
    e.preventDefault();
    perguntar(campo.value);
  });
  campo.addEventListener('input', ajustarAltura);
  campo.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      perguntar(campo.value);
    }
  });

  $$('.terminal__abas button').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('.terminal__abas button').forEach(function (o) { o.setAttribute('aria-selected', String(o === b)); });
      carregarCanal(b.dataset.canal);
    });
  });

  carregarCanal('operacoes');
  ajustarAltura();

  /* =========================================================
     2. Console — quatro módulos com verificação executável
     ========================================================= */
  var MODULOS = {
    conectores: {
      titulo: 'conectores ativos neste workspace',
      nota: 'Permissões herdadas da fonte original. Nada é copiado para fora do seu tenant.',
      linhas: [
        ['09:41:02', 'Google Workspace', 'ok', '2.104 documentos · permissão herdada'],
        ['09:41:03', 'CRM (Pipedrive)', 'ok', '318 negócios · somente leitura'],
        ['09:41:04', 'Slack · 42 canais', 'ok', '11.902 mensagens · canais privados excluídos'],
        ['09:41:06', 'Pasta de rede \\\\fileserver\\contratos', 'ok', '561 PDFs · OCR aplicado em 47 digitalizações'],
        ['09:41:09', 'Diário oficial', 'aviso', 'sem atualização desde ontem 23:10'],
        ['09:41:11', 'Índice incremental', 'info', 'concluído · 41 s · 0 falhas']
      ],
      rodar: [
        ['--:--:--', 'verificação de permissão', 'info', 'comparando 3.101 ACLs com a origem'],
        ['--:--:--', 'divergências encontradas', 'ok', '0 divergências'],
        ['--:--:--', 'reindexação incremental', 'ok', '18 trechos atualizados']
      ]
    },
    respostas: {
      titulo: 'respostas dos últimos 7 dias',
      nota: 'Toda resposta sem fonte suficiente é marcada como não respondida, nunca completada por suposição.',
      linhas: [
        ['09:12:44', 'perguntas respondidas', 'ok', '1.284'],
        ['09:12:45', 'com pelo menos uma fonte citada', 'ok', '1.284 (100 %)'],
        ['09:12:45', 'sem cobertura na base', 'aviso', '37 · encaminhadas para responsável'],
        ['09:12:46', 'tempo mediano de resposta', 'info', '41 s'],
        ['09:12:47', 'respostas editadas por humano', 'info', '62 (4,8 %)'],
        ['09:12:48', 'perguntas mais repetidas', 'info', '"prazo do contrato", "quem aprovou", "status do chamado"']
      ],
      rodar: [
        ['--:--:--', 'teste cego de fidelidade', 'info', '40 perguntas sorteadas contra a base'],
        ['--:--:--', 'resultado', 'ok', '38 sustentadas pela fonte · 2 corrigidas'],
        ['--:--:--', 'falsos positivos', 'ok', '0']
      ]
    },
    auditoria: {
      titulo: 'trilha de auditoria · exportável em CSV',
      nota: 'Retenção configurada em 365 dias para este workspace. Exportação leva menos de 2 minutos.',
      linhas: [
        ['08:55:10', 'ana.ribeiro@alvorada.com.br', 'info', 'perguntou sobre cláusula de multa · 3 fontes'],
        ['09:02:31', 'marcos.tavares@alvorada.com.br', 'info', 'perguntou sobre margem do cliente Ipê · 3 fontes'],
        ['09:18:07', 'externo · consultoria', 'aviso', 'acesso negado · fora do escopo do projeto'],
        ['09:24:52', 'juliana.prado@alvorada.com.br', 'info', 'exportou relatório de horas · registrado'],
        ['09:30:00', 'revisão trimestral de acessos', 'ok', '12 permissões removidas automaticamente'],
        ['09:33:19', 'administrador', 'info', 'alterou retenção de 90 para 365 dias']
      ],
      rodar: [
        ['--:--:--', 'varredura de acesso indevido', 'info', 'cruzando 4.912 consultas com ACLs'],
        ['--:--:--', 'resultado', 'ok', 'nenhum acesso fora de permissão'],
        ['--:--:--', 'exportação de teste', 'ok', 'CSV de 4.912 linhas em 1 min 12 s']
      ]
    },
    guardrails: {
      titulo: 'limites por área, cliente e assunto',
      nota: 'Guardrails rodam antes da resposta: o que é bloqueado nunca chega a ser gerado.',
      linhas: [
        ['10:01:00', 'Financeiro · faixa salarial', 'ok', 'bloqueado para toda a empresa'],
        ['10:01:01', 'Jurídico · minuta em negociação', 'ok', 'visível só para 4 pessoas nomeadas'],
        ['10:01:02', 'Comercial · tabela de desconto', 'aviso', 'liberado até 15 %, acima pede aprovação'],
        ['10:01:04', 'Cliente Ipê · contrato e margem', 'ok', 'restrito ao time da conta'],
        ['10:01:05', 'Documentos pessoais (RH)', 'ok', 'fora do índice'],
        ['10:01:07', 'Assuntos sensíveis por palavra', 'info', '18 regras ativas · 0 falsos bloqueios hoje']
      ],
      rodar: [
        ['--:--:--', 'teste de vazamento entre áreas', 'info', '60 perguntas cruzadas entre 4 áreas'],
        ['--:--:--', 'resultado', 'ok', '0 vazamentos · 2 bloqueios corretos'],
        ['--:--:--', 'revisão das regras', 'info', 'próxima revisão sugerida em 30 dias']
      ]
    }
  };

  var log = $('#console-log');
  var tituloConsole = $('#console-titulo');
  var notaConsole = $('#console-nota');
  var horaConsole = $('#console-hora');
  var botaoRodar = $('#rodar');
  var moduloAtual = 'conectores';

  function hora() {
    var d = new Date();
    return [d.getHours(), d.getMinutes(), d.getSeconds()]
      .map(function (n) { return String(n).padStart(2, '0'); }).join(':');
  }

  function imprimir(linhas, atrasoBase) {
    linhas.forEach(function (l, i) {
      var div = document.createElement('div');
      div.innerHTML = '<time>' + (l[0] === '--:--:--' ? hora() : l[0]) + '</time>'
        + '<span class="' + l[2] + '">' + l[1] + ' — ' + l[3] + '</span>';
      if (reduzido) {
        log.appendChild(div);
      } else {
        div.style.opacity = '0';
        div.style.transform = 'translateY(4px)';
        log.appendChild(div);
        setTimeout(function () {
          div.style.transition = 'opacity .35s ease, transform .35s ease';
          div.style.opacity = '1';
          div.style.transform = 'none';
        }, atrasoBase + i * 110);
      }
    });
    log.scrollTop = log.scrollHeight;
  }

  function carregarModulo(chave) {
    moduloAtual = chave;
    var m = MODULOS[chave];
    tituloConsole.textContent = m.titulo;
    notaConsole.textContent = m.nota;
    horaConsole.textContent = hora();
    log.innerHTML = '';
    imprimir(m.linhas, 0);
  }

  $$('.console__menu button').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('.console__menu button').forEach(function (o) { o.setAttribute('aria-selected', String(o === b)); });
      carregarModulo(b.dataset.modulo);
    });
  });

  botaoRodar.addEventListener('click', function () {
    botaoRodar.disabled = true;
    botaoRodar.textContent = 'Rodando…';
    var m = MODULOS[moduloAtual];
    imprimir(m.rodar, 0);
    setTimeout(function () {
      botaoRodar.disabled = false;
      botaoRodar.textContent = 'Rodar verificação';
    }, reduzido ? 200 : 1400);
  });

  carregarModulo('conectores');

  /* =========================================================
     3. Formulário com validação real
     ========================================================= */
  var regras = {
    nome: function (v) { return v.trim().length >= 2 ? '' : 'Escreva pelo menos 2 letras.'; },
    empresa: function (v) { return v.trim().length >= 2 ? '' : 'Diga o nome da empresa.'; },
    email: function (v) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) return 'Confira o e-mail: falta algo como nome@empresa.com.br.';
      if (/@(gmail|hotmail|outlook|yahoo|bol)\./i.test(v)) return 'Use o e-mail corporativo — é o que libera o teste.';
      return '';
    },
    tamanho: function (v) {
      var n = parseInt(v.replace(/\D/g, ''), 10);
      if (!n) return 'Diga quantas pessoas vão usar.';
      if (n < 3) return 'O plano mínimo atende 3 pessoas.';
      if (n > 20000) return 'Para mais de 20 mil pessoas, fale com engenharia.';
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

  $('#form-teste').addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = Object.keys(regras).map(validar).every(Boolean);
    if (!ok) {
      var primeiro = $('.campo--erro input');
      if (primeiro) primeiro.focus();
      return;
    }
    var botao = $('#btn-teste');
    botao.disabled = true;
    botao.textContent = 'Liberando…';
    setTimeout(function () {
      var caixa = $('#recado-ok');
      caixa.hidden = false;
      caixa.innerHTML = '<b>Teste liberado para ' + $('#nome').value.trim().split(' ')[0] + '.</b>'
        + '<span>Em uma versão publicada, o convite chegaria agora em ' + $('#email').value.trim()
        + ' com o workspace de ' + $('#empresa').value.trim() + ' já criado e os conectores prontos para autorizar.</span>';
      botao.disabled = false;
      botao.textContent = 'Liberar o teste';
      caixa.scrollIntoView({ block: 'nearest', behavior: reduzido ? 'auto' : 'smooth' });
    }, 600);
  });

  /* =========================================================
     4. Revelação orquestrada
     ========================================================= */
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('visivel');
        obs.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    $$('.revelar').forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i % 3, 2) * 80 + 'ms';
      obs.observe(el);
    });
  } else {
    $$('.revelar').forEach(function (el) { el.classList.add('visivel'); });
  }

  var relogio = setInterval(function () { horaConsole.textContent = hora(); }, 1000);
  window.addEventListener('pagehide', function () { clearInterval(relogio); });
})();
