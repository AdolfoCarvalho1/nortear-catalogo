# Costa & Vilela — imobiliária boutique

Referência: ficha de estilo “editorial impresso / papel quente” do styles.refero.design (consultado em 2026-02)
Propósito: comprador de alto padrão da Grande Vitória e do litoral do Espírito Santo — muitas vezes de fora do
estado — que precisa decidir quais imóveis valem uma viagem antes de marcar visita. Tarefa da página: qualificar a
carteira (bairro, tipo, preço, quartos, exclusividade) e entregar a ficha completa de cada imóvel, com planta baixa
desenhada na visita técnica, números exatos de condomínio e IPTU e uma linha honesta sobre o estado do imóvel.

## Tipografia

Display: `"Palatino Linotype", "Sitka Text", Georgia, serif`, peso 400 e 700, `letter-spacing` de -0.015em a -0.03em.
Usa em h1 (clamp 2,1rem–3,6rem, entrelinha 1,04), h2 de seção (1,6–2,4rem), títulos de ficha (h3), nome do sócio,
título do painel e na linha da promessa, em itálico. Nenhum sobrescrito acima de título.

Leitura e interface: `"Lato", "Segoe UI", Calibri, Arial, sans-serif`, corpo 1,0625rem/1,62, medida de 68ch no texto
corrido e 62ch nos blocos de estado. Áreas, preços, metragens, IPTU, contagem de imóveis e códigos usam Lato com
`font-variant-numeric: tabular-nums`; rótulo de dado é caixa alta de 0,6875rem com `letter-spacing` 0,07em.
Não há monoespaçada em nenhum ponto do modelo.

## Papéis de cor

Tela e superfícies: papel quente `#F7F4EE` é o chão da página; `#EFEAE1` é a superfície secundária (filtros, bloco
de estado, faixa de números, recados); `#FFFFFF` existe **só** na prancha — a folha de desenho —, no painel lateral e
nos campos do formulário. O desenho é feito em papel branco sobre a página em papel quente: a diferença entre os dois
papéis é o que faz a prancha parecer uma folha apoiada na mesa.

Texto e ações: tinta grafite-azulada `#22262B` (14,9:1 no papel) para todo texto; `#565B60` para texto secundário,
rótulos e placeholder (6,2:1 — atende 4,5:1 inclusive em corpo pequeno); `#8B8F93` fica restrito ao mobiliário do
desenho e a marcas não textuais. Filetes em `#DFD8CC`.

Dois acentos, com papéis que não se misturam:
- **petróleo `#1F4E5F`** (8,2:1 no papel) marca **só** o que está disponível e **só** as ações: botões, links de ação,
  o ponto de “Disponível para visita”, o foco visível do teclado, a pena que desenha a prancha e o `::selection`.
  Nunca é usado como enfeite de seção.
- **latão `#C4A47C`** marca **só** o que é exclusivo da carteira: o selo de exclusividade, o selo de recém-chegado, o
  “não anunciada em portais” e as três marcas cheias do gráfico de recusa. Como latão puro não passa de 2,1:1, o texto
  do selo usa `#6E5530` (5,8:1 sobre `#F2E9DA`) e o latão fica no filete de 1px e no fundo `#F2E9DA`.

Na faixa escura (`#22262B`), o texto é `#EDEAE4` e o secundário é `#A7AEB3` — cinza tingido do azul do grafite,
nunca cinza puro.

## Layout

Largura de conteúdo: `min(100% - 2rem, 78rem)` (1216px em desktop; 358px a 390px). Medida de leitura entre 62ch e 68ch.
Duas colunas de ficha em desktop (≥62rem), uma em mobile. A abertura é 1fr/1,05fr com a prancha à direita.

Ritmo de espaçamento: seções com `clamp(3rem, 6vw, 5.5rem)` de respiro vertical; grupos internos com 0,9rem de gap;
filetes separando linhas de dado a cada 0,42rem de padding. A página alterna uma passagem **densa** (o índice da
carteira, em linhas tipográficas) e uma passagem **quieta** (as oito fichas com desenho), e depois uma faixa escura.

Componentes:
- **Prancha** — folha branca com filete de 1px, código do imóvel em caixa alta, selo de latão à direita, desenho
  centralizado em caixa de 240px (mobile) a 320px (desktop) de altura e pé com metragem e tipo de planta. Raio 0.
  Os rótulos das plantas são desenhados em 10 unidades no sistema do desenho, o que dá de 9px a 12px na tela — é o
  tamanho mínimo em que “CIRCULAÇÃO” e “QUARTO 2” continuam legíveis sem virar texto de interface.
- **Ficha** — separada por um filete de 1px em tinta no topo (não é cartão: não tem fundo nem caixa). Traz a prancha,
  o título acionável, o ponto de disponibilidade, o preço, a lista de dados em `dl`, o bloco de estado honesto e duas
  ações reais. As duas coberturas duplex, cuja planta tem dois pavimentos lado a lado, usam a ficha larga: ocupam as
  duas colunas e o desenho fica com a metade da página, que é o que ele precisa para ser lido.
- **Índice** — cabeçalho de colunas + linhas-botão de largura total, grade de 6 colunas em desktop e 3 áreas em
  mobile, com contagem viva em `aria-live`.
- **Botão** — o único raio do sistema: 3px. Sólido em petróleo (ação principal), vazio com filete (ação secundária) e
  em texto sublinhado (ação terciária). Estados de hover, ativo, foco e desabilitado (com `cursor: not-allowed`).
- **Campos** — raio 0, fundo branco, filete de 1px, foco em petróleo com contorno de 2px. `select` com seta em SVG
  data-URI. Checkbox com `accent-color` em petróleo e área de toque de 2,9rem.
- **Painel lateral** — 544px (100% em mobile), fundo branco, entrada por `transform`, véu em `rgba(34,38,43,.45)`,
  foco preso, `Esc` fecha e o foco volta ao elemento de origem.

## Movimento

Um único momento autoral: **a prancha sendo desenhada**. Quando cada desenho entra na viewport, a planta é revelada
da esquerda para a direita por um `clip-path` de 1,05s e uma pena de 1px em petróleo atravessa a folha marcando a
frente do traço — o gesto do corretor desenhando o imóvel. A mesma mecânica acontece quando o painel abre, com a
planta clonada. Fora disso, só transições de estado (hover, foco, abertura do painel, reescrita das linhas do índice).
`prefers-reduced-motion: reduce` desliga animação, transição e rolagem suave — e, se o JavaScript falhar, a classe
`js` é removida e os desenhos aparecem imediatamente, sem nada escondido.

## Regras de uso

- Petróleo e latão não trocam de papel. Se um elemento não é “disponível/ação” nem “exclusivo da carteira”, ele é
  tinta sobre papel.
- Prancha é sempre branca; qualquer outra superfície é papel quente. Nunca as duas no mesmo bloco.
- Raio 0 em tudo que é folha, filete, campo e selo; 3px exclusivamente em botão.
- O bloco de estado é obrigatório em toda ficha, inclusive quando o imóvel precisa de obra: é o que sustenta a
  promessa da carteira.
- A planta é o primeiro elemento de cada imóvel. Se um dia houver foto, ela entra depois do desenho, nunca no lugar.
- Não acrescentar planos, pacotes ou tabela de preços de serviço: os valores em R$ desta página são os imóveis e os
  honorários (avaliação R$ 0, anúncio R$ 0, comissão de 6% na venda).

## Decisões em aberto

- Sem rede nesta máquina, não há foto de imóvel: a planta baixa virou a imagem principal e o modelo assume isso como
  conceito. Com fotos reais do cliente, definir se a prancha continua sozinha na ficha ou se entra uma faixa de fotos
  abaixo dela.
- As quatro plantas foram conferidas por medição (34 arcos de porta batidos contra os vãos e as folhas, todos os
  rótulos dentro da área do desenho, nada fora do viewBox) e a abertura foi vista renderizada a 1440px. A captura de
  página inteira e de 390px não pôde ser refeita nesta sessão porque o Chrome é bloqueado pelo sandbox daqui
  (`platform_channel` e crashpad sem permissão); o mobile foi revisado à mão — grades de 3 áreas no índice, alvos de
  44px, nenhum contêiner com largura intrínseca capaz de estourar a coluna.
- Quatro plantas cobrem oito fichas (duas delas são `planta tipo`, o que é comum em bairros verticais de Vitória). Em
  produção, cada imóvel precisa do seu próprio desenho — a estrutura em `<symbol>` + `<use>` já está pronta para isso.
- A escala gráfica de 5 m está desenhada dentro de cada planta, com 1 unidade = 5 cm. Se o cliente quiser plantas
  fora de escala, a barra precisa sair do desenho.
- O filtro de busca atua no índice; a seção de fichas mostra sempre a carteira inteira. Se o cliente preferir que o
  filtro esconda fichas, é uma linha de JavaScript — mas aí o estado vazio precisa de outro desenho.
- Ficaram fora, por não haver conteúdo real: mapa da região, tempo de deslocamento entre imóveis e área de atuação por
  bairro. Todos os três caberiam entre a abertura e os números.
