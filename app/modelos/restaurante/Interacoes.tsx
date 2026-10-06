'use client';

import { useEffect } from 'react';

/**
 * Interações do modelo 02 — Mesa 12.
 *
 * O script veio do modelo estático (era um IIFE no fim do <body>) e continua
 * sendo o mesmo código: ele consulta o DOM renderizado pelo React e liga os
 * controles. A guarda `mesa12Ligado` impede ligação dupla quando o React
 * remonta o componente em desenvolvimento.
 *
 * O que ele faz: o serviço abre os 7 tempos em sequência (contador e estado dos
 * botões acompanham), a conferência da praça troca o tempo 2, a reserva valida
 * data/horário/pessoas/telefone e emite o recibo, e o aviso do próximo menu
 * valida nome e e-mail.
 */
export default function Interacoes() {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (document.documentElement.dataset.mesa12Ligado === 'sim') return;
    document.documentElement.dataset.mesa12Ligado = 'sim';
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

  const DIAS = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
  const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

  /* Data local a partir de "aaaa-mm-dd": evita o fuso do parser UTC. */
  function dataLocal(valor: string) {
    const p = valor.split('-');
    return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
  }
  function hojeZero() {
    const h = new Date();
    h.setHours(0, 0, 0, 0);
    return h;
  }
  function isoLocal(d: Date) {
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + dia;
  }
  function porExtenso(valor: string) {
    const d = dataLocal(valor);
    return DIAS[d.getDay()] + ', ' + d.getDate() + ' de ' + MESES[d.getMonth()] + ' de ' + d.getFullYear();
  }
  function horaBonita(v: string) {
    return v.replace(':00', 'h').replace(':', 'h');
  }
  function telefoneMascarado(v: string) {
    const d = v.replace(/\D/g, '').slice(0, 11);
    if (!d) return '';
    if (d.length <= 2) return '(' + d;
    if (d.length <= 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
    if (d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
    return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
  }

  /* =========================================================
     1. O serviço — o menu degustação que abre tempo por tempo
     ========================================================= */
  const tempos = $$<HTMLDetailsElement>('.tempo');
  const contador = $('#contador')!;
  const praca = $('#praca')!;
  const btnTodos = $<HTMLButtonElement>('#btn-todos')!;
  const btnPraca = $<HTMLButtonElement>('#btn-praca')!;
  let servindo = false;
  let pracaConferida = false;

  function quantosAbertos() {
    return tempos.filter((t) => t.open).length;
  }

  function atualizarContador() {
    const n = quantosAbertos();
    const total = tempos.length;
    if (n === 0) contador.textContent = 'Nenhum tempo aberto. Abra um prato para ver a técnica, os ingredientes do dia e a harmonização.';
    else if (n === total) contador.textContent = 'Os 7 tempos abertos. O menu inteiro está à vista — feche o que já leu.';
    else contador.textContent = n + ' de ' + total + ' tempos abertos.';
    if (servindo) return;
    const todos = n === total;
    btnTodos.textContent = todos ? 'Fechar todos os tempos' : 'Abrir todos os 7 tempos';
    btnTodos.setAttribute('aria-expanded', String(todos));
  }

  tempos.forEach((t) => {
    t.addEventListener('toggle', atualizarContador);
  });

  /* O momento autoral da casa: os tempos abrem em sequência, como um serviço. */
  btnTodos.addEventListener('click', () => {
    if (servindo) return;
    const abrir = quantosAbertos() < tempos.length;
    servindo = true;
    btnTodos.disabled = true;

    if (!abrir) {
      tempos.forEach((t) => { t.open = false; });
      servindo = false;
      btnTodos.disabled = false;
      atualizarContador();
      return;
    }

    btnTodos.textContent = 'Abrindo os 7 tempos…';
    const passo = reduzido ? 0 : 90;
    tempos.forEach((t, i) => {
      t.style.setProperty('--atraso', (reduzido ? 0 : i * passo) + 'ms');
      setTimeout(() => { t.open = true; }, i * passo);
    });
    setTimeout(() => {
      servindo = false;
      btnTodos.disabled = false;
      atualizarContador();
    }, tempos.length * passo + 160);
  });

  /* Estado de erro do controle: um tempo que não vem do produtor hoje. */
  btnPraca.addEventListener('click', () => {
    if (btnPraca.disabled) return;
    btnPraca.disabled = true;
    btnPraca.textContent = 'Conferindo com a praça…';
    setTimeout(() => {
      const agora = new Date();
      const hh = agora.getHours() + 'h' + String(agora.getMinutes()).padStart(2, '0');
      btnPraca.disabled = false;
      btnPraca.textContent = pracaConferida ? 'Conferir de novo' : 'Conferir o que chegou hoje';
      if (pracaConferida) {
        praca.textContent = 'Praça conferida de novo às ' + hh + ': nada mudou desde a primeira conferência.';
        return;
      }
      pracaConferida = true;
      praca.textContent = 'Praça conferida às ' + hh + ': seis tempos saem como estão escritos. O atum não veio — o barco não saiu de Ubatuba com o mar grosso, e o tempo 2 sai hoje com pescada-amarela do mesmo pescador.';
      $('#aviso-2')!.hidden = false;
      $('#troca-2')!.hidden = false;
    }, 600);
  });

  atualizarContador();

  /* =========================================================
     2. Reserva com validação real (tudo em memória)
     ========================================================= */
  const form = $<HTMLFormElement>('#form-reserva')!;
  const recibo = $('#recibo')!;
  const campoData = $<HTMLInputElement>('#data')!;
  const campoHorario = $<HTMLSelectElement>('#horario')!;
  const campoPessoas = $<HTMLSelectElement>('#pessoas')!;
  const campoNome = $<HTMLInputElement>('#nome')!;
  const campoTelefone = $<HTMLInputElement>('#telefone')!;
  const campoRestricao = $<HTMLSelectElement>('#restricao')!;
  const campoOutro = $<HTMLInputElement>('#restricao-outro')!;
  const avisoReserva = $('#aviso-reserva')!;
  const btnReservar = $<HTMLButtonElement>('#btn-reservar')!;
  const textoReciboVazio = recibo.innerHTML;

  campoData.min = isoLocal(hojeZero());

  const regras: Record<string, (v: string) => string> = {
    data: (v) => {
      if (!v) return 'Escolha a data do jantar. Abrimos de quinta a sábado.';
      const d = dataLocal(v);
      if (d < hojeZero()) return 'Essa data já passou. Escolha uma quinta, sexta ou sábado a partir de hoje.';
      if (d.getDay() < 4) return 'Abrimos de quinta a sábado. Escolha uma dessas datas.';
      return '';
    },
    horario: (v) => {
      return v ? '' : 'Escolha o horário de entrada, entre 19h e 21h.';
    },
    pessoas: (v) => {
      const n = parseInt(v, 10);
      if (!n) return 'Diga quantas pessoas vêm.';
      if (n > 6) return 'Para ' + n + ' pessoas a mesa é fechada por telefone: ligue (11) 90000-0000.';
      return '';
    },
    nome: (v) => {
      return v.trim().length >= 2 ? '' : 'Escreva o nome de quem reserva, com pelo menos 2 letras.';
    },
    telefone: (v) => {
      const d = v.replace(/\D/g, '');
      if (d.length < 10) return 'O telefone precisa de DDD e número — 10 dígitos no mínimo. Exemplo: (11) 90000-0000.';
      return '';
    },
    restricao: (v) => {
      return v ? '' : 'Escolha uma opção. Se não houver restrição, marque "Nenhuma".';
    },
    'restricao-outro': (v) => {
      if (campoRestricao.value !== 'outro') return '';
      return v.trim().length >= 3 ? '' : 'Conte em uma linha o que a cozinha precisa saber.';
    }
  };

  function validar(nome: string) {
    const input = $<HTMLInputElement>(`[name="${nome}"]`);
    if (!input) return true;
    const msg = regras[nome](input.value);
    const caixa = $(`[data-campo="${nome}"]`);
    caixa!.classList.toggle('campo--erro', Boolean(msg));
    $(`[data-erro="${nome}"]`)!.textContent = msg;
    input.setAttribute('aria-invalid', String(Boolean(msg)));
    return !msg;
  }

  Object.keys(regras).forEach((nome) => {
    const input = $<HTMLInputElement>(`[name="${nome}"]`)!;
    input.addEventListener('blur', () => { validar(nome); });
    input.addEventListener('input', () => {
      if ($(`[data-campo="${nome}"]`)!.classList.contains('campo--erro')) validar(nome);
    });
    input.addEventListener('change', () => {
      if ($(`[data-campo="${nome}"]`)!.classList.contains('campo--erro')) validar(nome);
    });
  });

  /* Máscara do telefone: o número se formata enquanto se digita. */
  campoTelefone.addEventListener('input', () => {
    campoTelefone.value = telefoneMascarado(campoTelefone.value);
  });

  /* Restrição "outro" abre o campo de texto; vegetariano lembra o preço. */
  campoRestricao.addEventListener('change', () => {
    const outro = campoRestricao.value === 'outro';
    const caixaOutro = $('[data-campo="restricao-outro"]')!;
    caixaOutro.hidden = !outro;
    if (!outro) {
      campoOutro.value = '';
      caixaOutro.classList.remove('campo--erro');
      $('[data-erro="restricao-outro"]')!.textContent = '';
    } else {
      campoOutro.focus();
    }
    $('#dica-restricao')!.hidden = campoRestricao.value !== 'vegetariano';
  });

  /* Aviso de sábado cheio: estado de aviso, nunca de erro. */
  function checarAviso() {
    const data = campoData.value;
    const hora = campoHorario.value;
    if (!data || !hora || regras.data(data)) { avisoReserva.hidden = true; return; }
    const d = dataLocal(data);
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

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const ok = Object.keys(regras).map(validar).every(Boolean);
    if (!ok) {
      const primeiro = $<HTMLInputElement>('.campo--erro input, .campo--erro select');
      if (primeiro) primeiro.focus();
      return;
    }
    const rotulo = btnReservar.textContent;
    btnReservar.disabled = true;
    btnReservar.textContent = 'Verificando disponibilidade…';
    setTimeout(() => {
      btnReservar.disabled = false;
      btnReservar.textContent = rotulo;
      mostrarRecibo();
    }, 600);
  });

  function mostrarRecibo() {
    const pessoas = parseInt(campoPessoas.value, 10);
    const rotuloPessoas = pessoas === 1 ? '1 pessoa' : pessoas + ' pessoas';
    let restricao = campoRestricao.options[campoRestricao.selectedIndex].textContent ?? '';
    if (campoRestricao.value === 'outro' && campoOutro.value.trim()) {
      restricao = 'Outro — ' + campoOutro.value.trim();
    }
    const menu = campoRestricao.value === 'vegetariano'
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

  function escapar(t: string) {
    return String(t).replace(/[&<>"]/g, (c) => {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' } as Record<string, string>)[c];
    });
  }

  /* Um único listener no recibo: o botão é recriado a cada reserva. */
  recibo.addEventListener('click', (e) => {
    if (!(e.target as Element).closest('#btn-nova')) return;
    form.hidden = false;
    form.reset();
    $$('.campo--erro', form).forEach((c) => { c.classList.remove('campo--erro'); });
    $$('.campo__erro', form).forEach((c) => { c.textContent = ''; });
    $$('[aria-invalid]', form).forEach((c) => c.setAttribute('aria-invalid', 'false'));
    $('[data-campo="restricao-outro"]')!.hidden = true;
    $('#dica-restricao')!.hidden = true;
    avisoReserva.hidden = true;
    recibo.removeAttribute('tabindex');
    recibo.innerHTML = textoReciboVazio;
    campoData.min = isoLocal(hojeZero());
    campoData.focus();
  });

  /* =========================================================
     3. Aviso do próximo menu — o formulário do fecho
     ========================================================= */
  const formAviso = $<HTMLFormElement>('#form-aviso')!;
  const recadoAviso = $('#recado-aviso')!;

  const regrasAviso: Record<string, (v: string) => string> = {
    'aviso-nome': (v) => { return v.trim().length >= 2 ? '' : 'Escreva seu nome, com pelo menos 2 letras.'; },
    'aviso-email': (v) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Confira o e-mail: falta algo como nome@exemplo.com.br.';
    }
  };

  function validarAviso(nome: string) {
    const input = $<HTMLInputElement>(`[name="${nome}"]`)!;
    const msg = regrasAviso[nome](input.value);
    const caixa = $(`[data-campo="${nome}"]`)!;
    caixa.classList.toggle('campo--erro', Boolean(msg));
    $(`[data-erro="${nome}"]`)!.textContent = msg;
    input.setAttribute('aria-invalid', String(Boolean(msg)));
    return !msg;
  }

  Object.keys(regrasAviso).forEach((nome) => {
    const input = $<HTMLInputElement>(`[name="${nome}"]`)!;
    input.addEventListener('blur', () => { validarAviso(nome); });
    input.addEventListener('input', () => {
      if ($(`[data-campo="${nome}"]`)!.classList.contains('campo--erro')) validarAviso(nome);
    });
  });

  formAviso.addEventListener('submit', (e) => {
    e.preventDefault();
    const ok = Object.keys(regrasAviso).map(validarAviso).every(Boolean);
    if (!ok) {
      const primeiro = $<HTMLInputElement>('.campo--erro input', formAviso);
      if (primeiro) primeiro.focus();
      recadoAviso.textContent = '';
      return;
    }
    const botao = $<HTMLButtonElement>('#btn-aviso')!;
    const rotulo = botao.textContent;
    botao.disabled = true;
    botao.textContent = 'Anotando…';
    setTimeout(() => {
      botao.disabled = false;
      botao.textContent = rotulo;
      recadoAviso.textContent = 'Anotado, ' + $<HTMLInputElement>('#aviso-nome')!.value.trim().split(' ')[0]
        + '. Em 19 de março você recebe o menu de outono em ' + $<HTMLInputElement>('#aviso-email')!.value.trim() + '.';
      formAviso.reset();
    }, 600);
  });
}
