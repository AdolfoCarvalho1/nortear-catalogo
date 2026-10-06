'use client';

import { useEffect } from 'react';

/**
 * Interações do modelo 04 — Ateliê Horizonte.
 *
 * O script veio do modelo estático (era um IIFE no fim do <body>) e continua
 * sendo o mesmo código: ele consulta o DOM renderizado pelo React e liga os
 * controles. A guarda impede ligação dupla quando o React remonta o
 * componente em desenvolvimento.
 *
 * O que ele faz: trilho de pranchas com ficha expansível, estimador de
 * honorários com memória de cálculo e validação do formulário de terreno.
 */
export default function Interacoes() {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (document.documentElement.dataset.atelieLigado === 'sim') return;
    document.documentElement.dataset.atelieLigado = 'sim';
    ligar();
  }, []);

  return null;
}

/* O script original entra aqui, sem alteração de comportamento. */
function ligar() {
  const $ = <T extends Element = HTMLElement>(s: string, c?: ParentNode | null) =>
    (c || document).querySelector(s) as T | null;
  const $$ = <T extends Element = HTMLElement>(s: string, c?: ParentNode | null) =>
    Array.prototype.slice.call((c || document).querySelectorAll(s)) as T[];

  const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =========================================================
     1. TRILHO DE PRANCHAS
     Rolagem nativa com scroll-snap; o teclado move o foco de
     prancha em prancha e cada prancha abre a própria ficha.
     ========================================================= */
  const trilho = $('#trilho') as HTMLElement;
  const pranchas = $$('.prancha', trilho);
  const contador = $('#trilho-contador') as HTMLElement;
  const btAntes = $('#trilho-antes') as HTMLButtonElement;
  const btDepois = $('#trilho-depois') as HTMLButtonElement;
  let atual = 0;
  const total = pranchas.length;
  let viaPonteiro = false; /* o foco veio de um clique, não do teclado */
  let pularFoco = false; /* estamos devolvendo o foco de propósito */

  function indiceVisivel() {
    const esq = trilho.scrollLeft;
    const dir = esq + trilho.clientWidth;
    let melhor = 0;
    let maior = -1;
    pranchas.forEach((p, i) => {
      const visivel = Math.min(p.offsetLeft + p.offsetWidth, dir) - Math.max(p.offsetLeft, esq);
      if (visivel > maior) {
        maior = visivel;
        melhor = i;
      }
    });
    return melhor;
  }

  function escreverContador(i: number) {
    contador.textContent = 'prancha ' + (i + 1) + ' de ' + total;
  }

  function atualizarBarra(i: number) {
    atual = i;
    escreverContador(i);
    btAntes.disabled = i === 0;
    btDepois.disabled = i === total - 1;
    pranchas.forEach((p, n) => {
      if (n === i) {
        p.setAttribute('data-atual', 'sim');
      } else {
        p.removeAttribute('data-atual');
      }
    });
  }

  function centralizar(i: number) {
    const p = pranchas[i];
    const alvo = p.offsetLeft - (trilho.clientWidth - p.offsetWidth) / 2;
    if (typeof trilho.scrollTo === 'function') {
      trilho.scrollTo({ left: alvo, behavior: reduzido ? 'auto' : 'smooth' });
    } else {
      trilho.scrollLeft = alvo;
    }
  }

  function irPara(i: number, focar: boolean) {
    i = Math.max(0, Math.min(total - 1, i));
    centralizar(i);
    atualizarBarra(i);
    if (focar) {
      const b = $<HTMLElement>('.prancha__abrir', pranchas[i]);
      if (b) {
        b.focus({ preventScroll: true });
      }
    }
  }

  /* Abre a ficha: foco e clique expandem, Escape recolhe. */
  function abrir(prancha: HTMLElement, abrirFicha: boolean) {
    const botao = $<HTMLElement>('.prancha__abrir', prancha);
    const painel = $<HTMLElement>('.prancha__completa', prancha);
    if (!botao || !painel) {
      return;
    }
    painel.hidden = !abrirFicha;
    botao.setAttribute('aria-expanded', String(abrirFicha));
    prancha.setAttribute('data-aberta', String(abrirFicha));
  }

  function recolherTodas(exceto: HTMLElement | null) {
    pranchas.forEach((p) => {
      if (p !== exceto) {
        abrir(p, false);
      }
    });
  }

  pranchas.forEach((p) => {
    const botao = $<HTMLElement>('.prancha__abrir', p)!;
    const fechar = $<HTMLElement>('.prancha__fechar', p);

    botao.addEventListener('click', () => {
      const expandida = botao.getAttribute('aria-expanded') === 'true';
      recolherTodas(p);
      abrir(p, !expandida);
    });

    /* Foco também abre — mas só quando o foco vem do teclado.
       Sem a guarda, o foco do clique abriria a ficha e o clique
       seguinte fecharia na mesma batida. */
    p.addEventListener('focusin', () => {
      if (viaPonteiro || pularFoco) {
        return;
      }
      recolherTodas(p);
      abrir(p, true);
    });

    if (fechar) {
      fechar.addEventListener('click', () => {
        pularFoco = true;
        abrir(p, false);
        botao.focus({ preventScroll: true });
        window.setTimeout(() => {
          pularFoco = false;
        }, 0);
      });
    }

    p.addEventListener('click', (e) => {
      if ((e.target as Element).closest('button, a, summary, input, label')) {
        return;
      }
      recolherTodas(p);
      abrir(p, true);
    });
  });

  let quadro = 0;
  trilho.addEventListener(
    'scroll',
    () => {
      if (quadro) {
        return;
      }
      quadro = window.requestAnimationFrame(() => {
        quadro = 0;
        const i = indiceVisivel();
        if (i !== atual) {
          atualizarBarra(i);
        }
      });
    },
    { passive: true }
  );

  /* Marca a origem do foco: ponteiro ou teclado. */
  trilho.addEventListener('pointerdown', () => { viaPonteiro = true; }, true);
  document.addEventListener('keydown', () => { viaPonteiro = false; }, true);

  btAntes.addEventListener('click', () => { irPara(atual - 1, true); });
  btDepois.addEventListener('click', () => { irPara(atual + 1, true); });

  ($('#projetos') as HTMLElement).addEventListener('keydown', (e) => {
    const alvo = e.target as HTMLElement;
    if (alvo.tagName === 'INPUT' || alvo.tagName === 'TEXTAREA') {
      return;
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      irPara(atual + 1, true);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      irPara(atual - 1, true);
    } else if (e.key === 'Home') {
      e.preventDefault();
      irPara(0, true);
    } else if (e.key === 'End') {
      e.preventDefault();
      irPara(total - 1, true);
    } else if (e.key === 'Escape') {
      recolherTodas(null);
    }
  });

  atualizarBarra(0);

  /* O desenho sendo traçado — o único movimento autoral do modelo. */
  const projetos = $('#projetos') as HTMLElement;
  function desenhar() {
    pranchas.forEach((p, i) => {
      p.style.setProperty('--atraso', i * 0.11 + 's');
      p.classList.add('desenhou');
    });
  }
  if (reduzido || !('IntersectionObserver' in window)) {
    desenhar();
  } else {
    const obsDesenho = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((en) => {
          if (!en.isIntersecting) {
            return;
          }
          desenhar();
          obsDesenho.disconnect();
        });
      },
      { threshold: 0.12 }
    );
    obsDesenho.observe(projetos);
    window.setTimeout(() => {
      desenhar();
      obsDesenho.disconnect();
    }, 2200);
  }

  /* =========================================================
     2. ESTIMADOR DE HONORÁRIOS
     Tabela interna do ateliê. A memória de cálculo é mostrada
     inteira: é ela que dá credibilidade ao número.
     ========================================================= */
  type Tipo = { rotulo: string; projeto: number; obra: number; base: number };
  type Conta = {
    tipo: Tipo;
    area: number;
    comObra: boolean;
    honorario: number;
    custoObra: number;
    acompanhamento: number;
    subtotal: number;
    min: number;
    max: number;
    mesesProjeto: number;
    mesesObra: number;
    mesesTotal: number;
  };

  const TABELA: Record<string, Tipo> = {
    residencial: { rotulo: 'Residencial', projeto: 180, obra: 4800, base: 5 },
    interiores: { rotulo: 'Interiores', projeto: 140, obra: 3200, base: 4 },
    comercial: { rotulo: 'Comercial', projeto: 210, obra: 5400, base: 6 },
    reforma: { rotulo: 'Reforma', projeto: 120, obra: 2900, base: 3 }
  };

  function fatorArea(area: number) {
    if (area <= 120) {
      return 0.6;
    }
    if (area <= 250) {
      return 1;
    }
    if (area <= 500) {
      return 1.35;
    }
    return 1.7;
  }

  function reais(v: number) {
    return 'R$ ' + Math.round(v).toLocaleString('pt-BR', { maximumFractionDigits: 0 });
  }

  function metros(v: number) {
    return v.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) + ' m²';
  }

  function paraNumero(texto: string) {
    const t = String(texto).replace(/[^\d.,]/g, '');
    if (!t) {
      return NaN;
    }
    if (t.indexOf(',') > -1) {
      return parseFloat(t.replace(/\./g, '').replace(',', '.'));
    }
    if ((t.match(/\./g) || []).length > 1) {
      return parseFloat(t.replace(/\./g, ''));
    }
    if (/\.\d{3}$/.test(t)) {
      return parseFloat(t.replace(/\./g, ''));
    }
    return parseFloat(t);
  }

  const caixa = $('#estimador-caixa') as HTMLElement;
  const campoArea = $('#area') as HTMLInputElement;
  const erroArea = $('#area-erro') as HTMLElement;
  const btnCalcular = $('#btn-calcular') as HTMLButtonElement;
  const saidaTitulo = $('#saida-titulo') as HTMLElement;
  const saidaFaixa = $('#saida-faixa') as HTMLElement;
  const saidaMemoria = $('#saida-memoria') as HTMLElement;
  const saidaNota = $('#saida-nota') as HTMLElement;
  let temporizador = 0;

  function limparSaida() {
    saidaFaixa.innerHTML = '';
    saidaMemoria.innerHTML = '';
    saidaNota.textContent = '';
  }

  function linhaMemoria(rotulo: string, valor: string) {
    const div = document.createElement('div');
    const dt = document.createElement('dt');
    const dd = document.createElement('dd');
    dt.textContent = rotulo;
    dd.textContent = valor;
    div.appendChild(dt);
    div.appendChild(dd);
    return div;
  }

  function semSaida(titulo: string, nota: string) {
    limparSaida();
    saidaTitulo.textContent = titulo;
    saidaNota.textContent = nota;
  }

  function marcarErro(msg: string) {
    caixa.setAttribute('data-estado', 'erro');
    campoArea.setAttribute('aria-invalid', 'true');
    erroArea.textContent = msg;
    semSaida('memória de cálculo', 'Corrija a área para o ateliê calcular a faixa.');
  }

  function limparErro() {
    campoArea.removeAttribute('aria-invalid');
    erroArea.textContent = '';
  }

  function calcular(area: number, tipo: string): Conta {
    const t = TABELA[tipo];
    const honorario = area * t.projeto;
    const custoObra = area * t.obra;
    const comObra = ($('input[name="acompanhamento"]:checked') as HTMLInputElement).value === 'obra';
    const acompanhamento = comObra ? custoObra * 0.06 : 0;
    const subtotal = honorario + acompanhamento;
    const mesesProjeto = Math.max(2, Math.round(t.base * fatorArea(area)));
    const mesesObra = Math.max(6, Math.round(mesesProjeto * 1.8));

    return {
      tipo: t,
      area: area,
      comObra: comObra,
      honorario: honorario,
      custoObra: custoObra,
      acompanhamento: acompanhamento,
      subtotal: subtotal,
      min: subtotal * 0.85,
      max: subtotal * 1.15,
      mesesProjeto: mesesProjeto,
      mesesObra: mesesObra,
      mesesTotal: mesesProjeto + (comObra ? mesesObra : 0)
    };
  }

  function pintarResultado(d: Conta) {
    limparSaida();
    caixa.setAttribute('data-estado', 'resultado');
    saidaTitulo.textContent = 'memória de cálculo';

    const faixa = document.createElement('div');
    faixa.className = 'faixa-honorarios';
    const rotulo = document.createElement('p');
    rotulo.className = 'mono';
    rotulo.textContent = 'faixa estimada de honorários ±15%';
    const valores = document.createElement('p');
    valores.className = 'faixa-honorarios__valores';
    const b1 = document.createElement('b');
    const meio = document.createElement('i');
    const b2 = document.createElement('b');
    b1.textContent = reais(d.min);
    meio.textContent = 'a';
    b2.textContent = reais(d.max);
    valores.appendChild(b1);
    valores.appendChild(meio);
    valores.appendChild(b2);
    const prazo = document.createElement('p');
    prazo.className = 'mono faixa-honorarios__prazo';
    prazo.textContent =
      'prazo estimado: ' +
      d.mesesTotal +
      ' meses' +
      (d.comObra
        ? ' (projeto executivo ' + d.mesesProjeto + ' + obra ' + d.mesesObra + ')'
        : ' (projeto executivo)');
    faixa.appendChild(rotulo);
    faixa.appendChild(valores);
    faixa.appendChild(prazo);
    saidaFaixa.appendChild(faixa);

    const linhas: [string, string][] = [
      ['área de intervenção', metros(d.area)],
      ['tipo de projeto', d.tipo.rotulo],
      [
        'honorário de projeto executivo',
        metros(d.area) + ' × ' + reais(d.tipo.projeto) + '/m² = ' + reais(d.honorario)
      ],
      [
        'custo de obra estimado',
        metros(d.area) + ' × ' + reais(d.tipo.obra) + '/m² = ' + reais(d.custoObra)
      ],
      [
        'acompanhamento de obra (6%)',
        d.comObra ? '6% × ' + reais(d.custoObra) + ' = ' + reais(d.acompanhamento) : 'não contratado = R$ 0'
      ],
      [
        'honorários antes da faixa',
        reais(d.honorario) + ' + ' + reais(d.acompanhamento) + ' = ' + reais(d.subtotal)
      ],
      ['faixa final', reais(d.min) + ' a ' + reais(d.max)],
      ['prazo do projeto executivo', d.mesesProjeto + ' meses'],
      ['prazo de obra' + (d.comObra ? ' acompanhada' : ' (referência)'), d.mesesObra + ' meses']
    ];

    linhas.forEach((l, i) => {
      const el = linhaMemoria(l[0], l[1]);
      if (!reduzido) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(3px)';
        window.setTimeout(() => {
          el.style.transition = 'opacity .3s ease, transform .3s ease';
          el.style.opacity = '1';
          el.style.transform = 'none';
        }, 40 + i * 70);
      }
      saidaMemoria.appendChild(el);
    });

    if (d.area > 2000) {
      const aviso = document.createElement('p');
      aviso.className = 'saida__aviso';
      aviso.textContent =
        'Acima de 2.000 m² o ateliê não trabalha por tabela: um projeto desse porte precisa de conversa, equipe dedicada e proposta própria.';
      saidaFaixa.appendChild(aviso);
      caixa.setAttribute('data-estado', 'aviso');
    }

    saidaNota.textContent =
      'Faixa estimada sobre a área informada. O valor final depende do escopo: declividade, disciplinas complementares, tombamento e distância da obra.';
  }

  function pintarAviso(area: number) {
    limparSaida();
    caixa.setAttribute('data-estado', 'aviso');
    saidaTitulo.textContent = 'fora da faixa de atendimento';
    const aviso = document.createElement('p');
    aviso.className = 'saida__aviso saida__aviso--forte';
    aviso.textContent =
      'O ateliê não atende projetos abaixo de 40 m². Para ' +
      metros(area) +
      ' não há honorário de projeto executivo a estimar — e não vamos inventar um número só para preencher a tela.';
    const dica = document.createElement('p');
    dica.className = 'saida__nota';
    dica.textContent =
      'Se for um ambiente único dentro de uma obra maior, ou uma consultoria pontual de 1 a 2 visitas, escreva pelo formulário: isso sai por hora, não por m².';
    saidaFaixa.appendChild(aviso);
    saidaNota.textContent =
      'A tabela por m² começa em 40 m². Abaixo disso o custo fixo de levantamento e desenho não fecha.';
    saidaFaixa.appendChild(dica);
  }

  function enviar(e: Event) {
    e.preventDefault();
    window.clearTimeout(temporizador);

    if ($('input[name="acompanhamento"]:checked') === null) {
      ($('input[name="acompanhamento"]') as HTMLInputElement).checked = true;
    }

    const area = paraNumero(campoArea.value);
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
    const tipo = ($('input[name="tipo"]:checked') as HTMLInputElement).value;

    caixa.setAttribute('data-estado', 'carregando');
    btnCalcular.disabled = true;
    btnCalcular.textContent = 'Calculando…';
    saidaTitulo.textContent = 'memória de cálculo';
    limparSaida();
    const esperando = document.createElement('p');
    esperando.className = 'saida__nota mono';
    esperando.textContent = 'levantando a tabela de 2026…';
    saidaFaixa.appendChild(esperando);

    temporizador = window.setTimeout(
      () => {
        btnCalcular.disabled = false;
        btnCalcular.textContent = 'Calcular honorários';

        if (area < 40) {
          pintarAviso(area);
          return;
        }
        pintarResultado(calcular(area, tipo));
      },
      reduzido ? 60 : 640
    );
  }

  ($('#form-estimador') as HTMLFormElement).addEventListener('submit', enviar);

  ($('#form-estimador') as HTMLFormElement).addEventListener('reset', () => {
    window.clearTimeout(temporizador);
    window.setTimeout(() => {
      limparErro();
      caixa.setAttribute('data-estado', 'vazio');
      btnCalcular.disabled = false;
      btnCalcular.textContent = 'Calcular honorários';
      semSaida(
        'memória de cálculo',
        'Preencha a área e o tipo de projeto. A conta aparece aqui linha por linha, com o valor de cada m².'
      );
    }, 0);
  });

  campoArea.addEventListener('input', () => {
    if (campoArea.getAttribute('aria-invalid') === 'true') {
      limparErro();
    }
  });

  /* Estado inicial: vazio, com a explicação do que vai aparecer. */
  semSaida(
    'memória de cálculo',
    'Preencha a área e o tipo de projeto. A conta aparece aqui linha por linha, com o valor de cada m².'
  );

  /* =========================================================
     3. FORMULÁRIO — FALAR SOBRE UM TERRENO
     ========================================================= */
  const regras: Record<string, (v: string) => string> = {
    nome: (v) => {
      if (v.trim().length < 2) {
        return 'Escreva pelo menos duas letras.';
      }
      return '';
    },
    email: (v) => {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) {
        return 'Confira o e-mail: falta algo como nome@exemplo.com.br.';
      }
      return '';
    },
    cidade: (v) => {
      if (v.trim().length < 2) {
        return 'Diga a cidade do terreno.';
      }
      return '';
    },
    areaterreno: (v) => {
      const n = paraNumero(v);
      if (isNaN(n) || n <= 0) {
        return 'Diga a área do terreno em m², só números.';
      }
      if (n < 40) {
        return 'Abaixo de 40 m² o ateliê não atende — escreva mesmo assim se for consultoria pontual.';
      }
      return '';
    },
    etapa: (v) => {
      if (!v) {
        return 'Escolha em que ponto você está.';
      }
      return '';
    },
    recado: (v) => {
      if (v.trim().length < 15) {
        return 'Conte um pouco mais: cinco linhas ajudam mais que uma frase.';
      }
      return '';
    }
  };

  function validar(nome: string) {
    const campo = $<HTMLInputElement>(`[name="${nome}"]`);
    if (!campo) {
      return true;
    }
    const msg = regras[nome](campo.value);
    const caixaCampo = $(`[data-campo="${nome}"]`);
    caixaCampo?.classList.toggle('campo--erro', Boolean(msg));
    const erro = $(`[data-erro="${nome}"]`);
    if (erro) {
      erro.textContent = msg;
    }
    campo.setAttribute('aria-invalid', String(Boolean(msg)));
    return !msg;
  }

  Object.keys(regras).forEach((nome) => {
    const campo = $<HTMLInputElement>(`[name="${nome}"]`);
    if (!campo) {
      return;
    }
    campo.addEventListener('blur', () => {
      validar(nome);
    });
    campo.addEventListener('input', () => {
      if ($(`[data-campo="${nome}"]`)?.classList.contains('campo--erro')) {
        validar(nome);
      }
    });
    campo.addEventListener('change', () => {
      if ($(`[data-campo="${nome}"]`)?.classList.contains('campo--erro')) {
        validar(nome);
      }
    });
  });

  ($('#form-terreno') as HTMLFormElement).addEventListener('submit', (e) => {
    e.preventDefault();
    const ok = Object.keys(regras).map(validar).every(Boolean);
    if (!ok) {
      const primeiro = $<HTMLElement>('.campo--erro input, .campo--erro select, .campo--erro textarea');
      if (primeiro) {
        primeiro.focus();
      }
      return;
    }

    const botao = $('#btn-terreno') as HTMLButtonElement;
    botao.disabled = true;
    botao.textContent = 'Enviando…';

    window.setTimeout(
      () => {
        const recado = $('#recado-ok') as HTMLElement;
        const primeiroNome = ($('#nome') as HTMLInputElement).value.trim().split(' ')[0];
        const etapa = ($('#etapa') as HTMLSelectElement).options[
          ($('#etapa') as HTMLSelectElement).selectedIndex
        ].text;
        recado.hidden = false;
        recado.innerHTML =
          '<b>Recebemos o seu terreno, ' +
          primeiroNome +
          '.</b>' +
          '<span>Em uma versão publicada, a resposta chegaria em ' +
          ($('#email') as HTMLInputElement).value.trim() +
          ' em até dois dias úteis, com a leitura de ' +
          ($('#cidade') as HTMLInputElement).value.trim() +
          ' e o que faz sentido para o seu caso (' +
          etapa.toLowerCase() +
          ').</span>';
        botao.disabled = false;
        botao.textContent = 'Enviar sobre o terreno';
        recado.scrollIntoView({ block: 'nearest', behavior: reduzido ? 'auto' : 'smooth' });
      },
      reduzido ? 100 : 620
    );
  });
}
