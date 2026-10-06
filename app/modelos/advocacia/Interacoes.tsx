'use client';

import { useEffect } from 'react';

/**
 * Interações do modelo 03 — Fontes & Prado.
 *
 * O script veio do modelo estático (era um IIFE no fim do <body>) e continua
 * sendo o mesmo código: ele consulta o DOM renderizado pelo React e liga os
 * controles. A guarda `fontesPradoLigado` impede ligação dupla quando o React
 * remonta o componente em desenvolvimento.
 *
 * O que ele faz: o índice de áreas abre e fecha por `data-aberto` e filtra por
 * tipo de demanda; a triagem tem 3 passos, com regra de urgência por porte e
 * prazo, emissão de protocolo com área responsável sugerida; o agendamento
 * valida os campos e devolve o recibo com o próximo dia útil.
 */
export default function Interacoes() {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (document.documentElement.dataset.fontesPradoLigado === 'sim') return;
    document.documentElement.dataset.fontesPradoLigado = 'sim';
    ligar();
  }, []);

  return null;
}

/* O script original entra aqui, sem alteração de comportamento. */
function ligar() {
  const $ = <T extends Element = HTMLElement>(s: string, c: ParentNode = document) =>
    c.querySelector(s) as T | null;
  const $$ = <T extends Element = HTMLElement>(s: string, c: ParentNode = document) =>
    Array.from(c.querySelectorAll(s)) as T[];

  const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  type Campo = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
  type Prazo = { estado: string; titulo: string; texto: string };

  const el = (tag: string, classe?: string | null, texto?: string) => {
    const n = document.createElement(tag);
    if (classe) n.className = classe;
    if (texto !== undefined) n.textContent = texto;
    return n;
  };
  const dois = (n: number) => String(n).padStart(2, '0');
  const dataBR = (d: Date) => dois(d.getDate()) + '.' + dois(d.getMonth() + 1) + '.' + d.getFullYear();
  const digitos = (v: string) => (v || '').replace(/\D/g, '');

  /* =========================================================
     1. Índice de áreas — acordeão + filtro por tipo de demanda
     ========================================================= */
  const areas = $$('.area');
  const botoesArea = $$<HTMLButtonElement>('.area__botao');
  const filtros = $$<HTMLButtonElement>('.filtro__botao');
  const estadoAreas = $('#areas-estado')!;
  const vazioAreas = $('#areas-vazio')!;
  const rotuloTipo: Record<string, string> = { todos: 'todos os tipos', contrato: 'demanda de contrato', contencioso: 'demanda de contencioso', regulatorio: 'demanda regulatória' };

  /* O painel abre e fecha só por estado (data-aberto); a animação fica na
     coluna de grade, no CSS, sem medir altura no JS. */
  function definirPainel(painel: HTMLElement, aberto: boolean) { painel.dataset.aberto = aberto ? 'true' : 'false'; }

  botoesArea.forEach((b) => {
    b.addEventListener('click', () => {
      const painel = document.getElementById(b.getAttribute('aria-controls')!)!;
      const aberto = b.getAttribute('aria-expanded') === 'true';
      b.setAttribute('aria-expanded', String(!aberto));
      definirPainel(painel, !aberto);
    });
  });

  function abrirPrimeiraVisivel() {
    const visivel = areas.filter((a) => !a.hidden)[0];
    if (!visivel) return;
    const b = $<HTMLButtonElement>('.area__botao', visivel)!;
    const painel = document.getElementById(b.getAttribute('aria-controls')!)!;
    if (b.getAttribute('aria-expanded') !== 'true') {
      b.setAttribute('aria-expanded', 'true');
      definirPainel(painel, true);
    }
  }

  function contarPorTipo(tipo: string) {
    if (tipo === 'todos') return areas.length;
    return areas.filter((a) => a.dataset.tipos!.split(' ').indexOf(tipo) !== -1).length;
  }

  function filtrar(tipo: string) {
    let mostrando = 0;
    areas.forEach((a) => {
      const casa = tipo === 'todos' || a.dataset.tipos!.split(' ').indexOf(tipo) !== -1;
      a.hidden = !casa;
      if (casa) mostrando++;
      if (!casa) {
        const b = $<HTMLButtonElement>('.area__botao', a)!;
        const painel = document.getElementById(b.getAttribute('aria-controls')!)!;
        if (b.getAttribute('aria-expanded') === 'true') {
          b.setAttribute('aria-expanded', 'false');
          definirPainel(painel, false);
        }
      }
    });
    filtros.forEach((f) => {
      const ativo = f.dataset.filtro === tipo;
      f.setAttribute('aria-pressed', String(ativo));
      const conta = $('.filtro__conta', f);
      if (conta) conta.textContent = String(contarPorTipo(f.dataset.filtro!));
    });
    estadoAreas.textContent = mostrando
      ? 'Mostrando ' + mostrando + ' de ' + areas.length + ' áreas · ' + rotuloTipo[tipo] + '.'
      : 'Nenhuma área para ' + rotuloTipo[tipo] + '.';
    vazioAreas.hidden = mostrando > 0;
    if (mostrando) abrirPrimeiraVisivel();
  }

  filtros.forEach((f) => {
    f.addEventListener('click', () => { filtrar(f.dataset.filtro!); });
  });

  /* =========================================================
     2. Triagem de caso — 3 passos, protocolo, prazos e avisos
     ========================================================= */
  const form = $<HTMLFormElement>('#form-triagem')!;
  const paineis = $$<HTMLFieldSetElement>('.painel', form);
  const protocoloCaixa = $('#protocolo')!;
  const passoConta = $('#passo-conta')!;
  const passoNome = $('#passo-nome')!;
  const barra = $('#progresso-barra')!;
  const marcos = $$<HTMLLIElement>('#trilha li');
  const avisoTriagem = $('#aviso-triagem')!;
  const contador = $('#contador-descricao')!;
  const avisoEmail = $('#aviso-email')!;
  const btnTriagem = $<HTMLButtonElement>('#btn-triagem')!;
  let passoAtual = 1;
  let contadorProtocolo = 0;
  const nomePasso: Record<number, string> = { 1: 'tipo de demanda', 2: 'porte e prazo', 3: 'contato' };

  const GENERICO = /@(gmail|hotmail|outlook|yahoo|bol|live|icloud|uol)\./i;

  const AREA_POR_CHAVE: Record<string, { nome: string; socio: string }> = {
    '1.1': { nome: 'Contratos empresariais', socio: 'Helena Fontes' },
    '1.2': { nome: 'Societário e M&A', socio: 'Helena Fontes' },
    '1.3': { nome: 'Trabalhista empresarial', socio: 'Camila Sarmento' },
    '1.4': { nome: 'Regulatório e compliance', socio: 'Otávio Bittencourt' },
    '1.5': { nome: 'Recuperação de crédito', socio: 'Rafael Prado' },
    '1.6': { nome: 'Contencioso estratégico', socio: 'Rafael Prado' }
  };
  const AREA_POR_DEMANDA: Record<string, string> = { contrato: '1.1', contencioso: '1.6', regulatorio: '1.4', orientacao: '1.1' };
  /* A descrição é lida antes do tipo: quem escreve "acordo de sócios" precisa
     cair no societário, mesmo tendo marcado "contrato" no passo 1. */
  const PALAVRAS: [RegExp, string][] = [
    [/s[óo]cio|quotas|aquisi[çc][ãa]o|holding|incorpora|cis[ãa]o|assembleia|m&a/i, '1.2'],
    [/trabalh|empregad|rescis[ãa]o|horas extras|terceiriz|conven[çc][ãa]o coletiva|pejotiza|sindicato/i, '1.3'],
    [/regulat[óo]ri|compliance|integridade|ag[êe]ncia|aneel|anp|ans|antt|lgpd|consulta p[úu]blica|licita|den[úu]ncia/i, '1.4'],
    [/cobran[çc]a|inadimpl|cr[ée]dito|execu[çc][ãa]o|recupera[çc][ãa]o judicial|t[íi]tulo vencido|protesto/i, '1.5'],
    [/processo|a[çc][ãa]o judicial|liminar|arbitragem|disputa|contencioso|urg[êe]ncia/i, '1.6'],
    [/contrato|fornecimento|presta[çc][ãa]o de servi[çc]o|locac|renegocia|aditivo|distribui[çc][ãa]o|reajuste/i, '1.1']
  ];

  function avisar(texto: string, titulo: string) {
    avisoTriagem.innerHTML = '';
    avisoTriagem.appendChild(el('b', null, titulo));
    avisoTriagem.appendChild(el('p', null, texto));
    avisoTriagem.hidden = false;
  }
  function limparAviso() { avisoTriagem.hidden = true; avisoTriagem.innerHTML = ''; }

  function regraUrgencia(): Prazo | null {
    const porte = form.querySelector<HTMLInputElement>('input[name="porte"]:checked')?.value;
    const urgencia = form.querySelector<HTMLInputElement>('input[name="urgencia"]:checked')?.value;
    if (!porte || !urgencia) return null;
    if (urgencia === '5d' && porte === 'pequena') {
      return {
        estado: 'aviso',
        titulo: 'Não atendemos urgência de 5 dias para MEI ou pequena empresa.',
        texto: 'Somos 14 advogados e a agenda de urgência é reservada a clientes com contrato de acompanhamento. Para o seu caso, o caminho é a Defensoria Pública do Estado de São Paulo (atende quem se enquadra no critério de hipossuficiência), o núcleo de assessoria jurídica da associação comercial da sua região ou a Comissão de Assistência Judiciária da OAB/SP. Você pode seguir com a triagem: registramos o contato sem promessa de prazo.'
      };
    }
    if (urgencia === '5d') {
      return { estado: 'ok', titulo: 'Resposta em até 4 horas úteis.', texto: 'O sócio da área responde no mesmo dia e a reunião de 30 minutos é marcada em até 1 dia útil. Caso que exige peça em 5 dias entra com honorário de urgência 30% acima da tabela do §4, informado antes de qualquer contratação.' };
    }
    if (porte === 'pequena' && urgencia === '30d') {
      return { estado: 'ok', titulo: 'Resposta em até 2 dias úteis.', texto: 'MEI e pequena empresa entram pela agenda de convênios: diagnóstico de escopo em até 7 dias úteis e honorário fechado ao final, sem depósito inicial.' };
    }
    if (porte === 'pequena') {
      return { estado: 'ok', titulo: 'Resposta em até 5 dias úteis.', texto: 'Agenda de convênios para MEI e pequena empresa, com diagnóstico de escopo em até 10 dias úteis e honorário fechado ao final.' };
    }
    if (urgencia === '30d') {
      return { estado: 'ok', titulo: 'Resposta em até 1 dia útil.', texto: 'Diagnóstico de escopo em até 5 dias úteis, com honorário fechado e o sócio responsável nomeado por escrito.' };
    }
    return { estado: 'ok', titulo: 'Resposta em até 3 dias úteis.', texto: 'Sem prazo correndo, o caso entra na fila de diagnóstico: escopo em até 10 dias úteis, com o que precisa ser organizado antes de contratar.' };
  }

  function conferirPasso2(mostrarAviso: boolean, silencioso?: boolean) {
    const porte = form.querySelector<HTMLInputElement>('input[name="porte"]:checked')?.value;
    const urgencia = form.querySelector<HTMLInputElement>('input[name="urgencia"]:checked')?.value;
    const erro = $('[data-erro="passo2"]')!;
    if (!porte || !urgencia) {
      /* Enquanto o cliente ainda está escolhendo, não acusamos erro:
         o aviso só aparece quando ele tenta avançar. */
      if (!silencioso) erro.textContent = !porte ? 'Escolha o porte da empresa.' : 'Escolha o prazo que você tem.';
      return false;
    }
    erro.textContent = '';
    const r = regraUrgencia();
    if (r && r.estado === 'aviso') {
      if (mostrarAviso) avisar(r.texto, r.titulo);
    } else {
      limparAviso();
    }
    return true;
  }

  function mostrarPasso(n: number) {
    passoAtual = n;
    paineis.forEach((p) => { p.hidden = Number(p.dataset.painel) !== n; });
    marcos.forEach((m) => {
      const i = Number(m.dataset.marco);
      m.classList.toggle('concluido', i < n);
      if (i === n) { m.setAttribute('aria-current', 'step'); } else { m.removeAttribute('aria-current'); }
    });
    passoConta.textContent = 'Passo ' + n + ' de 3';
    passoNome.textContent = nomePasso[n];
    barra.style.transform = 'scaleX(' + (n / 3).toFixed(2) + ')';
  }

  $$<HTMLButtonElement>('[data-avancar]').forEach((b) => {
    b.addEventListener('click', () => {
      const destino = Number(b.dataset.avancar);
      if (destino === 2 && passoAtual === 2) return;
      if (passoAtual === 1) {
        const marca = form.querySelector<HTMLInputElement>('input[name="demanda"]:checked');
        const erro = $('[data-erro="demanda"]')!;
        if (!marca) { erro.textContent = 'Escolha o tipo de demanda para continuar.'; return; }
        erro.textContent = '';
      }
      if (passoAtual === 2 && !conferirPasso2(true)) return;
      mostrarPasso(destino);
      const legenda = $<HTMLElement>(`.painel[data-painel="${destino}"] legend`, form);
      if (legenda) { legenda.setAttribute('tabindex', '-1'); legenda.focus({ preventScroll: true }); }
      const topo = $('#triagem');
      if (topo && destino === 2) topo.scrollIntoView({ block: 'start', behavior: reduzido ? 'auto' : 'smooth' });
    });
  });
  $$<HTMLButtonElement>('[data-voltar]').forEach((b) => {
    b.addEventListener('click', () => {
      limparAviso();
      mostrarPasso(Number(b.dataset.voltar));
      const legenda = $<HTMLElement>(`.painel[data-painel="${passoAtual}"] legend`, form);
      if (legenda) { legenda.setAttribute('tabindex', '-1'); legenda.focus({ preventScroll: true }); }
    });
  });

  form.querySelectorAll<HTMLInputElement>('input[name="porte"], input[name="urgencia"]').forEach((i) => {
    i.addEventListener('change', () => { conferirPasso2(true, true); });
  });
  form.querySelectorAll<HTMLInputElement>('input[name="demanda"]').forEach((i) => {
    i.addEventListener('change', () => { $('[data-erro="demanda"]')!.textContent = ''; });
  });

  /* Campos do passo 3 */
  const ROTULO_PORTE: Record<string, string> = { pequena: 'MEI ou pequena (até R$ 4,8 milhões)', media: 'média (R$ 4,8 milhões a R$ 300 milhões)', grande: 'grande (acima de R$ 300 milhões)' };
  const ROTULO_URGENCIA: Record<string, string> = { '5d': 'prazo em até 5 dias', '30d': 'prazo de até 30 dias', sem: 'sem prazo definido' };
  const ROTULO_DEMANDA: Record<string, string> = { contrato: 'Contrato', contencioso: 'Contencioso', regulatorio: 'Regulatório', orientacao: 'Ainda não sei' };

  function validarNome(v: string) {
    const partes = v.trim().split(/\s+/).filter(Boolean);
    if (partes.length < 2 || partes[0].length < 2) return 'Escreva nome e sobrenome.';
    return '';
  }
  function validarEmpresa(v: string) { return v.trim().length >= 2 ? '' : 'Diga o nome da empresa.'; }
  /* Domínio gratuito não é erro: é aviso de que o retorno será por telefone,
     tratado em conferirEmailGenerico(). Aqui só se confere o formato. */
  function validarEmail(v: string) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) return 'Confira o e-mail: falta algo como nome@empresa.com.br.';
    return '';
  }
  function validarTelefone(v: string) {
    const d = digitos(v);
    if (d.length < 10 || d.length > 11) return 'Telefone com DDD: 10 ou 11 dígitos.';
    if (/^(\d)\1+$/.test(d)) return 'Confira o número: todos os dígitos são iguais.';
    return '';
  }
  function validarDescricao(v: string) { return v.trim().length >= 20 ? '' : 'Descreva em pelo menos 20 caracteres: o que está acontecendo e o que você precisa decidir.'; }

  const REGRAS: Record<string, (v: string) => string> = {
    nome: validarNome,
    empresa: validarEmpresa,
    email: validarEmail,
    telefone: validarTelefone,
    area: (v) => (v ? '' : 'Escolha a área de interesse.'),
    turno: (v) => (v ? '' : 'Escolha o melhor horário.'),
    protocolo: (v) => {
      if (!v.trim()) return '';
      return /^FP-\d{4}-\d{4}$/i.test(v.trim()) ? '' : 'O protocolo tem o formato FP-2026-0001. Deixe em branco se não fez a triagem.';
    },
    contexto: (v) => ((!v.trim() || v.trim().length >= 20) ? '' : 'Escreva pelo menos 20 caracteres ou deixe o campo em branco.'),
    descricao: validarDescricao
  };

  const ERRO_ALVO: Record<string, string> = {
    nome: 'nome', empresa: 'empresa', email: 'email', telefone: 'telefone', area: 'area',
    turno: 'turno', protocolo: 'protocolo', contexto: 'contexto', descricao: 'descricao'
  };

  /* O formulário dono do campo é sempre explícito: os dois formulários
     compartilham nome, empresa, e-mail e telefone, e validar o campo do
     outro formulário mostraria o erro na seção errada. */
  function validarCampo(nome: string, formDono?: HTMLFormElement) {
    const f = formDono || form;
    const input = f.querySelector<Campo>(`[name="${nome}"]`);
    if (!input) return true;
    const chave = ERRO_ALVO[nome];
    const alvo = $(`[data-erro="${chave}"]`, f);
    const caixa = input.closest('.campo');
    const msg = REGRAS[nome] ? REGRAS[nome](input.value) : '';
    if (caixa) caixa.classList.toggle('campo--erro', Boolean(msg));
    if (alvo) alvo.textContent = msg;
    input.setAttribute('aria-invalid', String(Boolean(msg)));
    return !msg;
  }

  /* Aviso — não erro — para e-mail genérico: o contato migra para o telefone. */
  function conferirEmailGenerico(input: Campo, caixaAviso: HTMLElement | null, ctx: string) {
    if (!caixaAviso) return;
    const v = input.value.trim();
    if (ctx === 'triagem' && GENERICO.test(v)) {
      caixaAviso.textContent = 'E-mail genérico: o retorno será por telefone, porque a triagem corporativa não aceita domínio gratuito.';
      caixaAviso.hidden = false;
    } else {
      caixaAviso.textContent = '';
      caixaAviso.hidden = true;
    }
  }

  const camposTriagem = ['nome', 'empresa', 'email', 'telefone', 'descricao'];
  camposTriagem.forEach((nome) => {
    const input = form.querySelector<Campo>(`[name="${nome}"]`)!;
    input.addEventListener('blur', () => { validarCampo(nome, form); });
    input.addEventListener('input', () => {
      const caixa = input.closest('.campo');
      if (caixa && caixa.classList.contains('campo--erro')) validarCampo(nome, form);
      if (nome === 'email') conferirEmailGenerico(input, avisoEmail, 'triagem');
      if (nome === 'descricao') {
        const n = input.value.trim().length;
        contador.textContent = n + ' de 20 caracteres' + (n >= 20 ? ' · suficiente' : '');
      }
    });
  });

  function areaSugerida(descricao: string) {
    const texto = descricao || '';
    for (let i = 0; i < PALAVRAS.length; i++) {
      if (PALAVRAS[i][0].test(texto)) return { chave: PALAVRAS[i][1], motivo: 'sugerida pela descrição do caso' };
    }
    const demanda = form.querySelector<HTMLInputElement>('input[name="demanda"]:checked')?.value || 'orientacao';
    return { chave: AREA_POR_DEMANDA[demanda], motivo: 'sugerida pelo tipo de demanda informado no passo 1' };
  }

  function horaAgora() {
    const d = new Date();
    return dois(d.getHours()) + 'h' + dois(d.getMinutes());
  }

  type Dados = {
    demanda: string;
    porte: string;
    urgencia: string;
    nome: string;
    empresa: string;
    email: string;
    telefone: string;
    generico: boolean;
    descricao: string;
    areaChave: string;
    motivo: string;
    prazo: Prazo;
  };

  function montarProtocolo(dados: Dados) {
    contadorProtocolo++;
    const numero = 'FP-2026-' + String(contadorProtocolo).padStart(4, '0');
    const area = AREA_POR_CHAVE[dados.areaChave];
    protocoloCaixa.innerHTML = '';
    protocoloCaixa.classList.add('protocolo--emitido');

    const carimbo = el('div', 'protocolo__carimbo');
    carimbo.appendChild(el('p', 'rotulo', 'Protocolo de triagem'));
    carimbo.appendChild(el('p', 'protocolo__num', numero));
    carimbo.appendChild(el('p', 'protocolo__hora', 'aberto em ' + dataBR(new Date()) + ' às ' + horaAgora() + ' · guarde este número'));
    protocoloCaixa.appendChild(carimbo);

    const resumo = el('dl', 'protocolo__resumo');
    [
      ['Demanda', ROTULO_DEMANDA[dados.demanda]],
      ['Porte', ROTULO_PORTE[dados.porte]],
      ['Prazo', ROTULO_URGENCIA[dados.urgencia]],
      ['Empresa', dados.empresa],
      ['Contato', dados.nome + ' · ' + dados.email],
      ['Telefone', dados.telefone + (dados.generico ? ' · canal preferencial' : '')]
    ].forEach((par) => {
      const div = el('div');
      div.appendChild(el('dt', null, par[0]));
      div.appendChild(el('dd', null, par[1]));
      resumo.appendChild(div);
    });
    protocoloCaixa.appendChild(resumo);

    const descricao = el('div', 'protocolo__descricao');
    descricao.appendChild(el('p', 'rotulo', 'O que foi informado'));
    descricao.appendChild(el('p', null, dados.descricao));
    protocoloCaixa.appendChild(descricao);

    const prazo = el('div', 'protocolo__prazo protocolo__prazo--' + dados.prazo.estado);
    prazo.appendChild(el('b', null, dados.prazo.titulo));
    prazo.appendChild(el('p', null, dados.prazo.texto));
    if (dados.prazo.estado === 'aviso' && dados.urgencia === '5d') {
      const acoes = el('p', 'protocolo__voltar');
      const b = el('button', 'botao botao--vazio botao--pequeno', 'Mudar o prazo informado') as HTMLButtonElement;
      b.type = 'button';
      b.addEventListener('click', () => {
        protocoloCaixa.classList.remove('protocolo--emitido');
        mostrarPasso(2);
        const legenda = $<HTMLElement>('.painel[data-painel="2"] legend', form);
        if (legenda) { legenda.setAttribute('tabindex', '-1'); legenda.focus({ preventScroll: true }); }
      });
      acoes.appendChild(b);
      prazo.appendChild(acoes);
    }
    protocoloCaixa.appendChild(prazo);

    const areaCaixa = el('p', 'protocolo__area');
    areaCaixa.appendChild(document.createTextNode('Área responsável sugerida: '));
    areaCaixa.appendChild(el('b', null, '§' + dados.areaChave + ' ' + area.nome));
    areaCaixa.appendChild(document.createTextNode(' · sócio ' + area.socio + '.'));
    areaCaixa.appendChild(el('small', null, dados.motivo + '. Se a leitura do sócio for outra, ele indica a área correta na primeira resposta.'));
    protocoloCaixa.appendChild(areaCaixa);

    const acoesFinais = el('div', 'protocolo__acoes');
    const nova = el('button', 'botao', 'Nova triagem') as HTMLButtonElement;
    nova.type = 'button';
    nova.addEventListener('click', limparTriagem);
    const imprimir = el('button', 'botao botao--vazio', 'Imprimir protocolo') as HTMLButtonElement;
    imprimir.type = 'button';
    imprimir.addEventListener('click', () => { window.print(); });
    acoesFinais.appendChild(nova);
    acoesFinais.appendChild(imprimir);
    protocoloCaixa.appendChild(acoesFinais);
  }

  function limparTriagem() {
    form.reset();
    /* A série de protocolos continua: limpar a tela não reabre número já emitido. */
    $$('.campo--erro', form).forEach((c) => c.classList.remove('campo--erro'));
    $$('.erro', form).forEach((e) => { e.textContent = ''; });
    $$<Campo>('input, textarea', form).forEach((i) => { i.removeAttribute('aria-invalid'); });
    limparAviso();
    avisoEmail.textContent = '';
    avisoEmail.hidden = true;
    contador.textContent = '0 de 20 caracteres';
    mostrarPasso(1);
    protocoloCaixa.classList.remove('protocolo--emitido');
    protocoloCaixa.innerHTML = '';
    protocoloCaixa.appendChild(el('p', 'rotulo', 'Protocolo de triagem'));
    protocoloCaixa.appendChild(el('p', 'protocolo__vazio', 'Nenhuma triagem em andamento. Ao concluir o passo 3, este papel recebe o número do protocolo, o prazo de resposta e a área responsável sugerida.'));
    const resumo = el('dl', 'protocolo__resumo');
    [['Demanda', '—'], ['Porte', '—'], ['Prazo', '—'], ['Contato', '—']].forEach((par) => {
      const div = el('div');
      div.appendChild(el('dt', null, par[0]));
      div.appendChild(el('dd', null, par[1]));
      resumo.appendChild(div);
    });
    protocoloCaixa.appendChild(resumo);
    protocoloCaixa.appendChild(el('p', 'protocolo__area', 'Área responsável sugerida: —'));
    const legenda = $<HTMLElement>('.painel[data-painel="1"] legend', form);
    if (legenda) { legenda.setAttribute('tabindex', '-1'); legenda.focus({ preventScroll: true }); }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!conferirPasso2(false)) { mostrarPasso(2); return; }
    const ok = ['nome', 'empresa', 'email', 'telefone', 'descricao'].map((n) => validarCampo(n, form)).every(Boolean);
    if (!ok) {
      const primeiro = $<Campo>('.campo--erro input, .campo--erro textarea', form);
      if (primeiro) primeiro.focus();
      return;
    }
    const email = form.querySelector<HTMLInputElement>('[name="email"]')!.value.trim();
    const generico = GENERICO.test(email);
    const descricao = form.querySelector<HTMLTextAreaElement>('[name="descricao"]')!.value.trim();
    const sugestao = areaSugerida(descricao);
    const dados: Dados = {
      demanda: form.querySelector<HTMLInputElement>('input[name="demanda"]:checked')!.value,
      porte: form.querySelector<HTMLInputElement>('input[name="porte"]:checked')!.value,
      urgencia: form.querySelector<HTMLInputElement>('input[name="urgencia"]:checked')!.value,
      nome: form.querySelector<HTMLInputElement>('[name="nome"]')!.value.trim(),
      empresa: form.querySelector<HTMLInputElement>('[name="empresa"]')!.value.trim(),
      email: email,
      telefone: form.querySelector<HTMLInputElement>('[name="telefone"]')!.value.trim(),
      generico: generico,
      descricao: descricao,
      areaChave: sugestao.chave,
      motivo: sugestao.motivo,
      prazo: regraUrgencia()!
    };

    btnTriagem.disabled = true;
    btnTriagem.textContent = 'Gerando protocolo…';
    protocoloCaixa.setAttribute('aria-busy', 'true');
    protocoloCaixa.innerHTML = '';
    protocoloCaixa.appendChild(el('p', 'rotulo', 'Protocolo de triagem'));
    const espera = el('div', 'protocolo__espera');
    espera.appendChild(el('p', null, 'Conferindo área responsável e prazo de resposta…'));
    const trilho = el('div', 'protocolo__trilho');
    trilho.appendChild(el('i'));
    espera.appendChild(trilho);
    protocoloCaixa.appendChild(espera);

    window.setTimeout(() => {
      protocoloCaixa.removeAttribute('aria-busy');
      montarProtocolo(dados);
      btnTriagem.disabled = false;
      btnTriagem.textContent = 'Gerar protocolo';
      protocoloCaixa.focus({ preventScroll: true });
      protocoloCaixa.scrollIntoView({ block: 'nearest', behavior: reduzido ? 'auto' : 'smooth' });
    }, reduzido ? 120 : 900);
  });

  /* Ponte entre o índice de áreas e a triagem: quem achou a área já chega
     no passo 2, com o tipo de demanda marcado. */
  $$<HTMLButtonElement>('[data-triar]').forEach((b) => {
    b.addEventListener('click', () => {
      const tipo = b.dataset.triar!;
      const radio = form.querySelector<HTMLInputElement>(`input[name="demanda"][value="${tipo}"]`);
      if (radio) { radio.checked = true; }
      $('[data-erro="demanda"]')!.textContent = '';
      mostrarPasso(2);
      $('#triagem')!.scrollIntoView({ block: 'start', behavior: reduzido ? 'auto' : 'smooth' });
      const legenda = $<HTMLElement>('.painel[data-painel="2"] legend', form);
      if (legenda) { legenda.setAttribute('tabindex', '-1'); legenda.focus({ preventScroll: true }); }
    });
  });

  /* =========================================================
     3. Formulário de agendamento — validação e recibo
     ========================================================= */
  const formAgendar = $<HTMLFormElement>('#form-agendar')!;
  const camposAgendar = ['nome', 'empresa', 'email', 'telefone', 'area', 'turno', 'protocolo', 'contexto'];
  const avisoEmailAgendar = $('#a-aviso-email')!;

  camposAgendar.forEach((nome) => {
    const input = formAgendar.querySelector<Campo>(`[name="${nome}"]`)!;
    input.addEventListener('blur', () => { validarCampo(nome, formAgendar); });
    input.addEventListener('input', () => {
      const caixa = input.closest('.campo');
      if (caixa && caixa.classList.contains('campo--erro')) validarCampo(nome, formAgendar);
      if (nome === 'email' && GENERICO.test(input.value)) {
        avisoEmailAgendar.textContent = 'Domínio gratuito: a secretaria vai confirmar por telefone antes de enviar o convite.';
        avisoEmailAgendar.hidden = false;
      } else if (nome === 'email') {
        avisoEmailAgendar.textContent = '';
        avisoEmailAgendar.hidden = true;
      }
    });
    input.addEventListener('change', () => {
      const caixa = input.closest('.campo');
      if (caixa && caixa.classList.contains('campo--erro')) validarCampo(nome, formAgendar);
    });
  });

  const DIAS = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
  const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  function proximoDiaUtil() {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    while (d.getDay() === 0 || d.getDay() === 6) { d.setDate(d.getDate() + 1); }
    return d;
  }

  formAgendar.addEventListener('submit', (e) => {
    e.preventDefault();
    const ok = camposAgendar.map((n) => validarCampo(n, formAgendar)).every(Boolean);
    if (!ok) {
      const primeiro = $<Campo>('.campo--erro input, .campo--erro select, .campo--erro textarea', formAgendar);
      if (primeiro) primeiro.focus();
      return;
    }
    const botao = $<HTMLButtonElement>('#btn-agendar')!;
    botao.disabled = true;
    botao.textContent = 'Verificando a agenda…';
    const d = proximoDiaUtil();
    const turno = formAgendar.querySelector<HTMLSelectElement>('[name="turno"]')!.value;
    const janela = turno === 'manha' ? 'das 9h às 12h' : 'das 14h às 18h';
    const nome = formAgendar.querySelector<HTMLInputElement>('[name="nome"]')!.value.trim().split(/\s+/)[0];
    const area = formAgendar.querySelector<HTMLSelectElement>('[name="area"]')!.value;
    const protocolo = formAgendar.querySelector<HTMLInputElement>('[name="protocolo"]')!.value.trim();
    const telefone = formAgendar.querySelector<HTMLInputElement>('[name="telefone"]')!.value.trim();

    window.setTimeout(() => {
      const caixa = $('#recado-ok')!;
      caixa.hidden = false;
      caixa.innerHTML = '';
      caixa.appendChild(el('b', null, nome + ', reservei ' + DIAS[d.getDay()] + ', ' + d.getDate() + ' de ' + MESES[d.getMonth()] + ', ' + janela + '.'));
      const p1 = el('p', null, 'A secretaria confirma por telefone em ' + telefone + ' até o fim do próximo dia útil. Se preferir falar agora, ligue para (11) 3555-4180.');
      caixa.appendChild(p1);
      const p2 = el('p', null, 'Área informada: ' + area + '.' + (protocolo ? ' Protocolo ' + protocolo + ' anexado ao pedido — o sócio entra na conversa com o caso lido.' : ' Sem protocolo: a conversa começa pelo enquadramento do caso.'));
      caixa.appendChild(p2);
      botao.disabled = false;
      botao.textContent = 'Agendar conversa de 30 minutos';
      caixa.scrollIntoView({ block: 'nearest', behavior: reduzido ? 'auto' : 'smooth' });
    }, reduzido ? 150 : 800);
  });

  /* =========================================================
     4. Estado inicial
     ========================================================= */
  mostrarPasso(1);
  filtros.forEach((f) => {
    const conta = $('.filtro__conta', f);
    if (conta) conta.textContent = String(contarPorTipo(f.dataset.filtro!));
  });
}
