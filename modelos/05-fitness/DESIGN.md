# Forja — personal trainer e studio de treino

Referência: mundo fixado no briefing do modelo 05 (quadro de anotações de academia, chão escuro, giz e um limão elétrico).
Nenhum style record do styles.refero.design foi consultado: a máquina está sem rede e o briefing já trazia paleta e par
tipográfico fechados. Se houver um record de referência para este nicho, ele ainda não foi nomeado aqui.
Propósito: fazer o dono de negócio (e o adulto de 30 a 50 anos que já tentou academia) entender, em cinco segundos, que
este studio mede o treino — e que o próximo passo é a avaliação de 60 min. A página prova o método mostrando números, não
falando de resultados.

## Tipografia

Display: **Bahnschrift SemiCondensed** 600, caixa alta, entrelinha 0.96–1.02, `letter-spacing` +0.008em a +0.012em
(nunca negativo em caixa alta). h1 `clamp(2.25rem, 5.4vw, 3.9rem)` com quebra forçada em duas frases; h2
`clamp(1.75rem, 3.6vw, 2.9rem)`; medida da faixa de números até 4rem — o teto de 6rem do contrato não é alcançado.
h3 e h4 saem da caixa alta (1.25–1.5rem, entrelinha 1.12): caixa alta longa em subtítulo foi flagrada pelo detector de
anti-padrões e derrubada de propósito.
Números medidos: **Bahnschrift** com `font-variant-numeric: tabular-nums`, sempre com a unidade em corpo pequeno ao lado
(+38 **kg**, 1.284 **séries**, −7,4 **cm**) e sempre com a frase que diz o que aquilo mede. Carga inteira escreve
inteira: 80 kg, não 80,0 kg.

Leitura: **Lato** 400, 1.0625rem / 1.62, medida de 60 a 74ch nos blocos corridos. Rótulo: Lato 700, 0.75rem, caixa alta,
`letter-spacing` 0.09–0.1em. Interface (perguntas frequentes, botões, campos) também em Lato — a voz condensada fica
reservada para título de seção e número.

## Papéis de cor

Tela e superfícies: `--chao #111214` carrega a página inteira (abertura, medidas, resultados, oficina, valores, dúvidas).
`--superficie #191B1E` é o que está levantado: o quadro do gráfico, os quatro painéis da oficina, a folha da tabela e as
caixas de ciclo/aviso dentro deles. `--superficie-2 #212429` aparece em **uma** seção inteira (o acompanhamento) e no
rodapé da tabela. `--linha #2C3037` desenha filete de 1px; `--linha-forte #3C414A` desenha borda de painel e a linha de
base do gráfico.

Texto e ações: `--giz #F5F3EF` no texto (17,9:1 sobre o chão). `--giz-70 #B9B7B2` no secundário (9,4:1 no chão, 8,6:1
sobre superfície). `--giz-45 #7C8188` no rótulo **apenas sobre o chão**, onde mede 4,83:1; sobre `--superficie` o mesmo
cinza cai para 4,4:1 e reprova em texto pequeno — ali entra `--giz-70` (regra escrita no topo do CSS e conferida pelo
detector). `--limao #D6F94B` é medida, progresso e ação (14,4:1 sobre superfície), com `--limao-fundo #2A3312` para o
estado marcado e `--limao-tinta #303813` para o texto secundário sobre a faixa de limão (10,3:1). `--alerta` fica nas
caixas de aviso do montador; `--erro` em borda e mensagem de campo.

## Layout

Largura de conteúdo: 76rem de conteúdo + duas calhas de 1,125rem. A calha mora no próprio `.tela`
(`max-width: 78.25rem; padding-inline: 1.125rem`), então nada encosta na borda. Nas faixas de cor (a seção quieta e a
faixa de limão) a calha sobe para a faixa **só a partir de 78.25rem**, quando o conteúdo já bateu no limite de 76rem —
antes disso ela ficaria dobrada e desalinharia a margem em relação às outras seções.

Ritmo de espaçamento: seções com 3rem (≥62rem: 6rem) em cima e embaixo; cabeça de seção 1,75rem/2,5rem abaixo do título —
sempre mais espaço acima do título do que abaixo; etapas e itens de preço 1,75rem/2,75rem; gaps internos em degraus de
0.5 / 0.6 / 0.85 / 1.1rem. Nada de valor solto: os mesmos degraus se repetem em todos os componentes.

Componentes:
- **Botão** — raio 4px, altura 2.9rem (2.4rem na versão pequena), limão cheio na ação primária e contorno na secundária;
  hover clareia; `[disabled]` cai para 50% e o cursor vira `progress`.
- **Campo** — fundo `--chao` com filete `--linha-forte` e rótulo em caixa alta; erro troca o filete por `--erro`, escreve
  a mensagem abaixo do campo e marca `aria-invalid`.
- **Opção segmentada** (radio) — caixa de 2.9rem, marcada em `--limao-fundo` com filete limão. O input é invisível por
  cima do rótulo, então o anel de foco é desenhado no rótulo por `:has()` com alternativa em classe, para não depender só
  do seletor novo.
- **Tabela** — é a própria folha (sem cartão em volta): fundo `--superficie`, filetes de 1px, números tabulares e a
  variação em limão. Abaixo de 66rem vira bloco empilhado, com o nome da coluna vindo de `data-rotulo` no `::before`;
  seis colunas de número não cabem em 390px sem cortar texto.
- **Gráfico de barras** — desenhado em CSS: barra com filete de 1px e sem preenchimento, e só a barra que está sendo lida
  preenchida de limão. Aparece na abertura (14 semanas de carga) e no diário de série (sessão anterior contra hoje).

## Movimento

Um único momento autoral: na abertura, as 14 barras do quadro crescem da linha de base para cima, 42ms entre uma e
outra, como quem anota o quadro semana a semana — e a última, que é a semana que está sendo lida, é a única em limão.
Nenhuma seção tem revelação por rolagem; o resto do movimento é de estado: as duas barras do diário crescem em
`transform: scaleX` (não em `width`, que custa layout) quando o volume é calculado, e o ícone de cada pergunta gira 45°
ao abrir. Em `prefers-reduced-motion: reduce` um bloco único desliga animação e transição com `!important` — a exceção
prevista no contrato —, e o gráfico aparece já desenhado.

## Regras de uso

- **Limão nunca é decoração.** Só número medido (as três anotações da faixa, o volume do diário, o delta de cada ficha, a
  contagem de séries), progresso (a barra lida, a série com subtotal fechado) e ação (botão primário, opção marcada,
  foco, ícone de "inclui" no que a proposta entrega). O quadro de valores **não** usa limão em nenhum preço: dinheiro é
  giz, medida é limão.
- **Uma faixa de limão na página inteira**, no fecho, com texto escuro. **Uma seção inteira em `--superficie-2`**, o
  acompanhamento.
- **Uma passagem densa** (a tabela de resultados, com seis fichas, três medidas e média) e **uma passagem quieta** (as
  quatro etapas, com respiro grande e pouca tinta).
- Raio de 4px em botão, campo, opção, painel e aviso. Nada de pílula, nada de cartão aninhado, nada de sombra colorida.
- Nenhuma fotografia: o material visual é o gráfico de barras, o filete de 1px e a tipografia condensada.
- `--giz-45` não pisa em superfície levantada; ali o secundário é `--giz-70`.

## Decisões em aberto

- O quadro de valores foi fixado em sessões de **45 min** porque o ajuste de ±10% do briefing precisa de uma base: 45 min
  é o meio (30 min −10%, 60 min +10%). Se o studio vender 60 min como padrão, os quatro preços sobem 10% e o texto do
  campo "tempo de sessão" troca de sinal.
- O híbrido usa pesos 60/40 entre a tabela presencial e a online. É a única constante arbitrária do cálculo e está
  escrita na memória da proposta, à vista do visitante — trocar o peso é trocar uma linha do script.
- O ciclo de 8 semanas só aparece em "correr 10 km" e em "ganhar força com 3x ou mais"; todas as outras combinações
  seguem o ciclo de 6 semanas do studio.
- O aviso de que não há fidelidade, a avaliação de R$ 180 abatida da primeira mensalidade e o preço da sessão avulsa são
  decisões comerciais plausíveis, não dados do cliente: precisam de confirmação antes de publicar.
- Regra que ficou de fora por falta de espaço na página: reposição de feriado e lista de espera aparecem só em uma linha
  do rodapé informativo e na resposta "E se eu faltar uma semana?".
- **Verificação visual pendente.** As capturas por Chrome headless (`capturar.mjs` e `inspecionar.mjs`) falharam neste
  ambiente por bloqueio de sandbox: o Chrome não consegue abrir o canal de plataforma do Mojo
  (`FATAL: platform_channel.cc:112 Check failed: Acesso negado (0x5)`), então nenhum PNG foi gerado — inclusive em
  `--single-process`. A revisão foi feita por leitura de código, por cálculo de larguras a 390px e pelo detector de
  anti-padrões. Recapturar assim que a execução do Chrome for permitida.
