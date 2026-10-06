'use client';

import { useEffect } from 'react';

/**
 * Interações do modelo 09 — Trama.
 *
 * O script veio do modelo estático (era um IIFE no fim do <body>) e continua
 * sendo o mesmo código: ele consulta o DOM renderizado pelo React e liga os
 * controles. A guarda `rodou` impede ligação dupla quando o React remonta o
 * componente em desenvolvimento.
 *
 * O que ele faz: o traçado dos desenhos técnicos por stroke-dashoffset, os
 * filtros da coleção, a sacola lateral com estoque, frete, reserva de 30
 * minutos e foco preso (Esc fecha) e o formulário da próxima tiragem.
 */
export default function Interacoes() {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (document.documentElement.dataset.tramaLigado === 'sim') return;
    document.documentElement.dataset.tramaLigado = 'sim';
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
  const reais = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  const TAMANHOS = ['P', 'M', 'G', 'GG'];
  const FRETE_SUDESTE = 32;
  const FRETE_OUTRAS = 48;
  const FRETE_GRATIS = 900;

  /* =========================================================
     1. O desenho se traça — o único momento de movimento do modelo.
     A silhueta é desenhada como num papel de moldes; as costuras
     aparecem depois, quando o traço fecha.
     ========================================================= */
  function tracar(svg: SVGSVGElement | null, atraso: number) {
    if (reduzido || !svg || svg.dataset.tracado) return;
    svg.dataset.tracado = '1';
    const raiz: SVGSVGElement = svg;

    $$<SVGPathElement>('.desenho__silhueta path', raiz).forEach((p, i) => {
      let l = 0;
      try {
        l = p.getTotalLength();
      } catch {
        l = 0;
      }
      if (!l) return;
      p.style.strokeDasharray = l + 1 + ' ' + (l + 1);
      p.style.strokeDashoffset = String(l + 1);
      window.setTimeout(() => {
        p.style.transition = 'stroke-dashoffset 1.15s cubic-bezier(.22,.72,.24,1)';
        p.style.strokeDashoffset = '0';
      }, atraso + i * 110);
    });

    const detalhes = $$<SVGPathElement | SVGCircleElement>(
      '.desenho__costura path, .desenho__costura circle, .desenho__vinco path, .desenho__vinco circle',
      raiz
    );
    detalhes.forEach((p) => {
      p.style.opacity = '0';
    });
    window.setTimeout(
      () => {
        detalhes.forEach((p) => {
          p.style.transition = 'opacity .7s ease';
          p.style.opacity = '1';
        });
      },
      atraso + 620
    );
  }

  tracar($<SVGSVGElement>('.desenho--abertura'), 240);

  if ('IntersectionObserver' in window && !reduzido) {
    const olhoDesenho = new IntersectionObserver(
      (entradas) => {
        let lote = 0;
        entradas.forEach((e) => {
          if (!e.isIntersecting) return;
          tracar($<SVGSVGElement>('.desenho', e.target), lote * 90);
          lote++;
          olhoDesenho.unobserve(e.target);
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.2 }
    );
    $$('.peca').forEach((p) => {
      olhoDesenho.observe(p);
    });
  }

  /* =========================================================
     2. Filtros da coleção — a grade densa filtrada de verdade
     ========================================================= */
  const formFiltros = $<HTMLFormElement>('#filtros')!;
  const grade = $('#grade')!;
  const pecas = $$('.peca');
  const contagem = $('#contagem')!;
  const vazio = $('#vazio')!;

  function escolhido(nome: string) {
    const input = formFiltros.querySelector<HTMLInputElement>('input[name="' + nome + '"]:checked');
    if (!input || !input.value) return null;
    return {
      valor: input.value,
      rotulo: formFiltros.querySelector('label[for="' + input.id + '"]')!.textContent!
    };
  }

  function estoqueDe(el: Element, tam: string) {
    if (TAMANHOS.indexOf(tam) < 0) return 0;
    const b = el.querySelector<HTMLElement>('[data-tam="' + tam + '"]');
    return b ? Number(b.dataset.estoque) : 0;
  }

  function naFaixa(preco: number, faixa: string) {
    if (faixa === 'ate600') return preco <= 600;
    if (faixa === '600a1000') return preco > 600 && preco <= 1000;
    if (faixa === 'acima1000') return preco > 1000;
    return true;
  }

  function aplicar() {
    const cat = escolhido('categoria');
    const tec = escolhido('tecido');
    const tam = escolhido('tamanho');
    const pre = escolhido('preco');
    let visiveis = 0;
    const partes: string[] = [];

    pecas.forEach((el) => {
      let ok = true;
      if (cat && el.dataset.categoria !== cat.valor) ok = false;
      if (ok && tec && el.dataset.tecido !== tec.valor) ok = false;
      if (ok && tam && estoqueDe(el, tam.valor) < 1) ok = false;
      if (ok && pre && !naFaixa(Number(el.dataset.preco), pre.valor)) ok = false;
      el.hidden = !ok;
      if (ok) visiveis++;
    });

    if (cat) partes.push(cat.rotulo.toLowerCase());
    if (tec) partes.push(tec.rotulo.toLowerCase());
    if (tam) partes.push('tamanho ' + tam.valor);
    if (pre) partes.push(pre.rotulo.toLowerCase());

    contagem.textContent =
      visiveis + (visiveis === 1 ? ' peça' : ' peças') + (partes.length ? ' · ' + partes.join(' · ') : ' na coleção');

    vazio.hidden = visiveis > 0;
    grade.hidden = visiveis === 0;
  }

  formFiltros.addEventListener('change', aplicar);
  formFiltros.addEventListener('reset', () => {
    window.setTimeout(aplicar, 0);
  });
  $$('[data-limpar]').forEach((b) => {
    b.addEventListener('click', () => {
      formFiltros.reset();
      window.setTimeout(() => {
        aplicar();
        contagem.scrollIntoView({ block: 'center', behavior: reduzido ? 'auto' : 'smooth' });
      }, 0);
    });
  });
  aplicar();

  /* =========================================================
     3. Sacola lateral — estoque, frete e resumo do pedido
     ========================================================= */
  type Item = {
    chave: string;
    cod: string;
    nome: string;
    tam: string;
    preco: number;
    estoque: number;
    tecido: string;
    qtd: number;
  };

  let sacola: Item[] = [];
  let regiao = 'sudeste';
  let fimReserva = 0;
  let relogio: number | null = null;

  const painel = $('#sacola')!;
  const veu = $('#veu')!;
  const corpo = $('#sacola-corpo')!;
  const pe = $('#sacola-pe')!;
  const contador = $('#contador')!;
  const aviso = $('#aviso-sacola')!;
  const reserva = $('#reserva')!;
  const reservaTempo = $('#reserva-tempo')!;
  const campoRegiao = $<HTMLSelectElement>('#regiao')!;
  let ultimoFoco: HTMLElement | null = null;

  function pecasTxt(n: number) {
    return n === 1 ? '1 peça' : n + ' peças';
  }
  function totalPecas() {
    return sacola.reduce((s, i) => s + i.qtd, 0);
  }
  function subtotal() {
    return sacola.reduce((s, i) => s + i.qtd * i.preco, 0);
  }

  function freteAtual() {
    if (!sacola.length) return 0;
    if (subtotal() >= FRETE_GRATIS) return 0;
    return regiao === 'sudeste' ? FRETE_SUDESTE : FRETE_OUTRAS;
  }

  function achar(chave: string) {
    for (let i = 0; i < sacola.length; i++) {
      if (sacola[i].chave === chave) return sacola[i];
    }
    return null;
  }

  function anunciar(texto: string) {
    aviso.textContent = texto;
  }

  function iniciarReserva() {
    if (fimReserva) return;
    fimReserva = Date.now() + 30 * 60 * 1000;
    reserva.hidden = false;
    if (relogio) window.clearInterval(relogio);
    relogio = window.setInterval(ticar, 1000);
    ticar();
  }

  function encerrarReserva() {
    fimReserva = 0;
    reserva.hidden = true;
    if (relogio) {
      window.clearInterval(relogio);
      relogio = null;
    }
  }

  function ticar() {
    const resta = fimReserva - Date.now();
    if (resta <= 0) {
      sacola = [];
      encerrarReserva();
      render();
      anunciar('A reserva de 30 minutos terminou e a sacola foi liberada.');
      return;
    }
    const m = Math.floor(resta / 60000);
    const s = Math.floor((resta % 60000) / 1000);
    reservaTempo.textContent = m + ':' + String(s).padStart(2, '0');
  }

  function abrirSacola() {
    ultimoFoco = document.activeElement as HTMLElement | null;
    painel.hidden = false;
    veu.hidden = false;
    document.body.classList.add('travado');
    $('#abrir-sacola')!.setAttribute('aria-expanded', 'true');
    $<HTMLElement>('#fechar-sacola')!.focus();
  }

  function fecharSacola() {
    painel.hidden = true;
    veu.hidden = true;
    document.body.classList.remove('travado');
    $('#abrir-sacola')!.setAttribute('aria-expanded', 'false');
    if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus();
  }

  /* Ícones do passo de quantidade: traço, não glifo */
  const ICO_MENOS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12h12"/></svg>';
  const ICO_MAIS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12h12M12 6v12"/></svg>';

  function itemHTML(it: Item) {
    return (
      '<article class="item" data-chave="' +
      it.chave +
      '">' +
      '<div class="item__amostra" aria-hidden="true"><span class="amostra"></span><b>' +
      it.cod +
      '</b></div>' +
      '<div class="item__corpo">' +
      '<h3 class="item__nome">' +
      it.nome +
      '</h3>' +
      '<p class="item__ficha">Tamanho ' +
      it.tam +
      ' · ' +
      it.tecido +
      '</p>' +
      '<div class="item__qtd">' +
      '<button type="button" class="item__passo" data-acao="menos" aria-label="Diminuir a quantidade de ' +
      it.nome +
      ' tamanho ' +
      it.tam +
      '">' +
      ICO_MENOS +
      '</button>' +
      '<input type="number" class="item__num" value="' +
      it.qtd +
      '" min="1" max="' +
      it.estoque +
      '" step="1" inputmode="numeric" aria-label="Quantidade de ' +
      it.nome +
      ' tamanho ' +
      it.tam +
      '">' +
      '<button type="button" class="item__passo" data-acao="mais" aria-label="Aumentar a quantidade de ' +
      it.nome +
      ' tamanho ' +
      it.tam +
      '">' +
      ICO_MAIS +
      '</button>' +
      '</div>' +
      '<p class="item__erro" role="status"></p>' +
      '</div>' +
      '<div class="item__lado">' +
      '<span class="item__preco">' +
      reais.format(it.preco * it.qtd) +
      '</span>' +
      '<button type="button" class="item__remover" data-acao="remover">Remover</button>' +
      '</div>' +
      '</article>'
    );
  }

  function render() {
    const n = totalPecas();
    contador.textContent = String(n);

    if (!sacola.length) {
      corpo.innerHTML =
        '<p class="sacola__vazia">Sua sacola está vazia. As peças ficam reservadas por 30 minutos depois que você escolhe um tamanho.</p>' +
        '<a class="botao botao--vazio" href="#colecao" data-fechar>Ver a coleção</a>';
      pe.hidden = true;
      encerrarReserva();
      return;
    }

    corpo.innerHTML = sacola.map(itemHTML).join('');
    pe.hidden = false;
    iniciarReserva();

    const sub = subtotal();
    const fre = freteAtual();
    $('#subtotal')!.textContent = reais.format(sub);
    $('#frete')!.textContent = fre === 0 ? 'Grátis' : reais.format(fre);
    $('#total')!.textContent = reais.format(sub + fre);
    $('#dica-frete')!.textContent =
      fre === 0 ? 'Frete grátis nesta compra.' : 'Faltam ' + reais.format(FRETE_GRATIS - sub) + ' para o frete grátis.';
  }

  function erroDe(chave: string, texto: string) {
    const item = corpo.querySelector<HTMLElement>('[data-chave="' + chave + '"]');
    if (!item) return;
    const caixa = $('.item__erro', item)!;
    caixa.textContent = texto;
    caixa.classList.add('item__erro--ativo');
    window.setTimeout(() => {
      caixa.classList.remove('item__erro--ativo');
    }, 400);
  }

  function mudar(chave: string, delta: number, absoluto: boolean) {
    const it = achar(chave);
    if (!it) return;
    const novo = absoluto ? delta : it.qtd + delta;

    if (novo < 1) {
      sacola = sacola.filter((i) => i.chave !== chave);
      anunciar(it.nome + ' tamanho ' + it.tam + ' saiu da sacola. ' + pecasTxt(totalPecas()) + ' na sacola.');
      render();
      return;
    }
    if (novo > it.estoque) {
      /* Renderiza antes de escrever o erro: render() reconstrói a lista e
         devolveria o campo ao estoque real, apagando o aviso. */
      render();
      erroDe(chave, 'Restam ' + pecasTxt(it.estoque) + ' no tamanho ' + it.tam + '.');
      anunciar('Não foi possível aumentar: restam ' + pecasTxt(it.estoque) + ' no tamanho ' + it.tam + '.');
      return;
    }
    it.qtd = novo;
    render();
    anunciar(pecasTxt(totalPecas()) + ' na sacola. Subtotal ' + reais.format(subtotal()) + '.');
  }

  corpo.addEventListener('click', (e) => {
    const botao = (e.target as Element).closest<HTMLElement>('button[data-acao]');
    if (botao) {
      const item = botao.closest<HTMLElement>('.item')!;
      const acao = botao.dataset.acao;
      if (acao === 'remover') {
        const it = achar(item.dataset.chave!);
        sacola = sacola.filter((i) => i.chave !== item.dataset.chave);
        if (it) anunciar(it.nome + ' tamanho ' + it.tam + ' saiu da sacola.');
        render();
      } else {
        mudar(item.dataset.chave!, acao === 'mais' ? 1 : -1, false);
      }
      return;
    }
    if ((e.target as Element).closest('[data-fechar]')) fecharSacola();
  });

  corpo.addEventListener('change', (e) => {
    const alvo = e.target as HTMLInputElement;
    if (!alvo.classList.contains('item__num')) return;
    const item = alvo.closest<HTMLElement>('.item')!;
    const it = achar(item.dataset.chave!);
    if (!it) return;
    const valor = parseInt(alvo.value, 10);
    if (!valor || valor < 1) {
      mudar(it.chave, 1, true);
      return;
    }
    if (valor > it.estoque) {
      erroDe(it.chave, 'Restam ' + pecasTxt(it.estoque) + ' no tamanho ' + it.tam + '.');
      alvo.value = String(it.qtd);
      anunciar('Restam ' + pecasTxt(it.estoque) + ' no tamanho ' + it.tam + '.');
      return;
    }
    mudar(it.chave, valor, true);
  });

  /* Adicionar da grade, respeitando o estoque do tamanho escolhido */
  function adicionar(el: HTMLElement, tam: string) {
    const est = estoqueDe(el, tam);
    const cod = el.dataset.cod!;
    const chave = cod + '|' + tam;
    const ja = achar(chave);
    const naSacola = ja ? ja.qtd : 0;
    const caixa = $('.peca__erro', el)!;

    if (naSacola + 1 > est) {
      caixa.textContent =
        est === 0
          ? 'Tamanho ' + tam + ' esgotado.'
          : 'Restam ' + pecasTxt(est) + ' no tamanho ' + tam + (naSacola ? ' — já estão na sua sacola.' : '.');
      anunciar(caixa.textContent);
      return;
    }

    caixa.textContent = '';
    if (ja) {
      ja.qtd += 1;
    } else {
      sacola.push({
        chave: chave,
        cod: cod,
        nome: el.dataset.nome!,
        tam: tam,
        preco: Number(el.dataset.preco),
        estoque: est,
        tecido: $('.peca__tecido b', el)!.textContent! + ' · ' + $('.peca__comp', el)!.textContent!
      } as Item);
    }
    render();
    anunciar(el.dataset.nome + ' tamanho ' + tam + ' entrou na sacola. ' + pecasTxt(totalPecas()) + ' na sacola.');
  }

  grade.addEventListener('click', (e) => {
    const alvo = e.target as Element;
    const tam = alvo.closest<HTMLElement>('.tam');
    if (tam && !(tam as HTMLButtonElement).disabled) {
      const grupo = tam.parentElement!;
      $$('.tam', grupo).forEach((b) => {
        if (!(b as HTMLButtonElement).disabled) b.setAttribute('aria-pressed', String(b === tam));
      });
      const caixaErro = $('.peca__erro', tam.closest<HTMLElement>('.peca')!);
      if (caixaErro) caixaErro.textContent = '';
      return;
    }
    const add = alvo.closest<HTMLElement>('.botao--add');
    if (add) {
      const peca = add.closest<HTMLElement>('.peca')!;
      const escolhidoBtn = $<HTMLElement>('.tam[aria-pressed="true"]', peca);
      const caixa = $('.peca__erro', peca)!;
      if (!escolhidoBtn) {
        caixa.textContent = 'Escolha um tamanho antes de adicionar.';
        const primeiro = $<HTMLElement>('.tam:not(.tam--esgotado)', peca);
        if (primeiro) primeiro.focus();
        return;
      }
      adicionar(peca, escolhidoBtn.dataset.tam!);
      return;
    }
    const espera = alvo.closest<HTMLElement>('[data-espera]');
    if (espera) {
      const cod = espera.dataset.espera!;
      const alvoPeca = $<HTMLInputElement>('#peca')!;
      alvoPeca.value = cod;
      $$('#form-aviso .campo').forEach((c) => {
        c.classList.remove('campo--erro');
      });
      $('#nota-espera')!.textContent =
        'O ' +
        espera.closest<HTMLElement>('.peca')!.dataset.nome +
        ' está esgotado. Deixe seu contato e o ateliê avisa quando a próxima tiragem ficar pronta.';
      $('#avisar')!.scrollIntoView({ block: 'start', behavior: reduzido ? 'auto' : 'smooth' });
      window.setTimeout(
        () => {
          $<HTMLElement>('#nome')!.focus();
        },
        reduzido ? 0 : 420
      );
    }
  });

  /* Finalizar: resumo do pedido em tela */
  $('#finalizar')!.addEventListener('click', () => {
    const sub = subtotal();
    const fre = freteAtual();
    const total = sub + fre;
    /* Parcela mínima de R$ 120, como na seção Como comprar: 6x só quando cabe. */
    const nParcelas = Math.min(6, Math.max(1, Math.floor(total / 120)));
    const parcela = Math.round(total / nParcelas);
    const numero =
      'TR-' +
      String(new Date().getFullYear()).slice(2) +
      String(new Date().getMonth() + 1).padStart(2, '0') +
      '-' +
      String(1000 + Math.floor(Math.random() * 8999));

    corpo.innerHTML =
      '<div class="pedido">' +
      '<p class="pedido__numero">Pedido ' +
      numero +
      '</p>' +
      '<h3 class="pedido__titulo">Resumo do pedido</h3>' +
      '<ul class="pedido__lista">' +
      sacola
        .map((it) => {
          return (
            '<li><span>' +
            it.qtd +
            ' × ' +
            it.nome +
            ' · tamanho ' +
            it.tam +
            '</span><b>' +
            reais.format(it.preco * it.qtd) +
            '</b></li>'
          );
        })
        .join('') +
      '</ul>' +
      '<dl class="resumo">' +
      '<div><dt>Subtotal</dt><dd>' +
      reais.format(sub) +
      '</dd></div>' +
      '<div><dt>Frete · ' +
      campoRegiao.options[campoRegiao.selectedIndex].text +
      '</dt><dd>' +
      (fre === 0 ? 'Grátis' : reais.format(fre)) +
      '</dd></div>' +
      '<div class="resumo__total"><dt>Total</dt><dd>' +
      reais.format(total) +
      '</dd></div>' +
      '</dl>' +
      '<p class="pedido__linha"><b>Pagamento:</b> Pix à vista ou cartão em até ' +
      nParcelas +
      'x de ' +
      reais.format(parcela) +
      ' sem juros.</p>' +
      '<p class="pedido__linha"><b>Envio:</b> em até 3 dias úteis. Troca em 30 dias, primeira troca por conta do ateliê.</p>' +
      '<p class="pedido__aviso">Em uma versão publicada, este botão seguiria para o pagamento no checkout da marca, com Pix e cartão. Aqui a demonstração termina: nada foi cobrado e nenhum dado saiu do seu navegador.</p>' +
      '<div class="pedido__acoes">' +
      '<button type="button" class="botao botao--vazio" id="voltar-sacola">Voltar para a sacola</button>' +
      '<button type="button" class="botao" id="concluir">Concluir e esvaziar</button>' +
      '</div></div>';
    pe.hidden = true;
    anunciar('Resumo do pedido ' + numero + ' na tela. Total ' + reais.format(total) + '.');
    $<HTMLElement>('#voltar-sacola')!.focus();
  });

  corpo.addEventListener('click', (e) => {
    const alvo = e.target as HTMLElement;
    if (alvo.id === 'voltar-sacola') {
      render();
      $<HTMLElement>('#finalizar')!.focus();
    }
    if (alvo.id === 'concluir') {
      sacola = [];
      encerrarReserva();
      render();
      fecharSacola();
      anunciar('Pedido concluído na demonstração. A sacola está vazia.');
    }
  });

  campoRegiao.addEventListener('change', () => {
    regiao = campoRegiao.value;
    render();
    anunciar('Frete recalculado para ' + campoRegiao.options[campoRegiao.selectedIndex].text + '.');
  });

  $('#abrir-sacola')!.addEventListener('click', abrirSacola);
  $('#fechar-sacola')!.addEventListener('click', fecharSacola);
  veu.addEventListener('click', fecharSacola);
  $('#abrir-sacola-2')!.addEventListener('click', abrirSacola);
  $('#abrir-sacola-3')!.addEventListener('click', abrirSacola);
  $('#ir-colecao') && $('#ir-colecao')!.addEventListener('click', fecharSacola);

  document.addEventListener('keydown', (e) => {
    if (painel.hidden) return;
    if (e.key === 'Escape') {
      fecharSacola();
      return;
    }
    if (e.key !== 'Tab') return;
    const focaveis = $$('a[href], button:not([disabled]), input, select, textarea', painel).filter(
      (el) => el.getClientRects().length > 0
    );
    if (!focaveis.length) return;
    const primeiro = focaveis[0];
    const ultimo = focaveis[focaveis.length - 1];
    if (e.shiftKey && document.activeElement === primeiro) {
      e.preventDefault();
      ultimo.focus();
    } else if (!e.shiftKey && document.activeElement === ultimo) {
      e.preventDefault();
      primeiro.focus();
    }
  });

  window.addEventListener('pagehide', () => {
    if (relogio) window.clearInterval(relogio);
  });

  render();

  /* =========================================================
     4. Lista da próxima tiragem — formulário validado
     ========================================================= */
  const regras: Record<string, (v: string) => string> = {
    nome: (v) => (v.trim().length >= 2 ? '' : 'Escreva como você quer ser chamada.'),
    email: (v) => {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) return 'Confira o e-mail: falta algo como nome@email.com.br.';
      return '';
    },
    peca: (v) => (v ? '' : 'Escolha a peça que você quer que volte ao estoque.'),
    tamanho: (v) => (v ? '' : 'Escolha o tamanho que você usa.')
  };

  function validar(nome: string) {
    const campo = $<HTMLInputElement | HTMLSelectElement>('[name="' + nome + '"]');
    if (!campo) return true;
    const msg = regras[nome](campo.value);
    $('[data-campo="' + nome + '"]')!.classList.toggle('campo--erro', Boolean(msg));
    $('[data-erro="' + nome + '"]')!.textContent = msg;
    campo.setAttribute('aria-invalid', String(Boolean(msg)));
    return !msg;
  }

  Object.keys(regras).forEach((nome) => {
    const campo = $<HTMLInputElement | HTMLSelectElement>('[name="' + nome + '"]')!;
    campo.addEventListener('blur', () => {
      validar(nome);
    });
    campo.addEventListener('input', () => {
      if ($('[data-campo="' + nome + '"]')!.classList.contains('campo--erro')) validar(nome);
    });
    campo.addEventListener('change', () => {
      if ($('[data-campo="' + nome + '"]')!.classList.contains('campo--erro')) validar(nome);
    });
  });

  $<HTMLFormElement>('#form-aviso')!.addEventListener('submit', (e) => {
    e.preventDefault();
    const ok = Object.keys(regras).map(validar).every(Boolean);
    if (!ok) {
      const primeiro = $('.campo--erro input, .campo--erro select');
      if (primeiro) primeiro.focus();
      return;
    }
    const botao = $<HTMLButtonElement>('#btn-aviso')!;
    const nome = $<HTMLInputElement>('#nome')!.value.trim().split(' ')[0];
    const campoPeca = $<HTMLSelectElement>('#peca')!;
    const rotulo = campoPeca.options[campoPeca.selectedIndex].text;
    const tam = $<HTMLSelectElement>('#tamanho')!.value;
    const frase =
      campoPeca.value === 'toda'
        ? 'quando a próxima tiragem ficar pronta, com aviso para o tamanho ' + tam
        : 'assim que ' + rotulo + ' voltar ao estoque no tamanho ' + tam;
    botao.disabled = true;
    botao.textContent = 'Anotando…';
    window.setTimeout(
      () => {
        const recado = $('#recado')!;
        recado.hidden = false;
        recado.innerHTML =
          '<b>Pronto, ' +
          nome +
          '. Você está na lista.</b>' +
          '<span>Avisamos em ' +
          $<HTMLInputElement>('#email')!.value.trim() +
          ' ' +
          frase +
          '. Em uma versão publicada, o e-mail sairia de oi@trama.com.br na semana em que a tiragem ficasse pronta.</span>';
        botao.disabled = false;
        botao.textContent = 'Avisar quando voltar';
        $('#nota-espera')!.textContent = '';
        recado.scrollIntoView({ block: 'nearest', behavior: reduzido ? 'auto' : 'smooth' });
      },
      reduzido ? 120 : 600
    );
  });
}
