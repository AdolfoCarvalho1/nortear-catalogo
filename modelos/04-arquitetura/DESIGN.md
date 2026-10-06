# Ateliê Horizonte — arquitetura e interiores

Referência: prancheta de obra (desenho técnico autoral). Sem URL de style externo — o mundo foi construído a partir do
briefing do modelo 04, não de um registro do styles.refero.design.
Propósito: convencer o dono de um terreno em Minas Gerais de que este estúdio projeta a partir do lote e do uso. A tarefa
do visitante é ver seis obras desenhadas, entender o processo em quatro etapas com prazo e peça, e estimar os honorários
por m² antes de escrever.

## Tipografia

Display: `"Constantia", "Sitka Text", Georgia, serif`, peso **400** sempre — serif de traço firme não pede negrito.
`h1` em `clamp(2.4rem, 5.4vw, 4.1rem)` / entrelinha 1.02 / `letter-spacing` −0.02em / `text-wrap: balance` / `max-width: 15ch`.
`h2` de seção em `clamp(1.75rem, 3.4vw, 2.75rem)`. Título de prancha em 1.5rem. Nunca abaixo de 1.2rem.
Leitura: `"Corbel", "Candara", "Segoe UI", sans-serif`, 1.0625rem / entrelinha 1.62. Medida de 60–72ch
(`.secao__cabeca p` 68ch, `.pergunta p` 72ch, `.escritorio__texto p` 70ch).
Técnica: `"Cascadia Mono", Consolas, monospace` em 0.8125rem, `letter-spacing: 0.02em`. **Só** onde há medida, ficha,
número ou memória de cálculo: número da prancha, cota dentro do SVG, carimbo, ficha técnica, contador do trilho,
faixa de honorários. Rótulo de formulário usa a mono em 0.6875rem sem caixa alta.

## Papéis de cor

Tela e superfícies: `--prancheta #EDEAE4` é a mesa (fundo da página); `--prancheta-2 #E3DFD7` é a faixa de dados e o
painel da calculadora; `--papel #FBFAF7` é a folha (prancha mestra, cada prancha do trilho, campos, carimbos);
`--grafite #16181A` é a faixa escura do processo e o fecho; `--filete #CFCAC1` são os fios de 1px;
`--pedra #8C8B84` faz cota, seta, travessão de lista e **borda de controle** (3,3:1 sobre papel — passa como elemento
de interface, não como texto).
Texto e ações: `--grafite` sobre `--prancheta` = 14,8:1. `--grafite-70 #45474A` é o texto secundário = 7,8:1.
`--telha #B0563A` é execução e ação: preenchimento do botão (texto `--papel` sobre ele = 4,7:1), plano "em obra" nos
desenhos, anel de foco, borda da prancha aberta. Duas derivações existem só para o telha sobreviver como **texto
pequeno**: `--telha-escuro #9A4A30` (5,4:1 sobre prancheta) para o rótulo de estágio, o tipo de publicação e a faixa de
prazo; `--telha-claro #D98A6C` (6,6:1 sobre grafite) para o número de etapa na faixa escura. `--prancheta-70 #A9A69F`
é o secundário sobre grafite = 7,3:1. `--grafite-45 #77797C` (3,6:1) **não** carrega texto legível: só placeholder e
traço fino de desenho.

## Layout

Largura de conteúdo: `80rem` de teto, com o recuo lateral de 1.25rem morando no `padding` de cada faixa (`.tela` é
`width: 100%; max-width: 80rem`). Assim toda faixa com fundo tem recuo real e o conteúdo fica alinhado entre seções.
Ritmo de espaçamento: 1.25rem entre elementos de um grupo; 2.25–2.5rem entre blocos; seções com 3rem no celular e
5.5rem no desktop — sempre mais espaço acima do título do que abaixo dele. Grid de colunas de 4.5rem desenhado com
`repeating-linear-gradient` de 1px atrás da seção de projetos (a prancheta).
Componentes: **botão** retangular (raio 0), 2.875rem de altura mínima, telha cheio para ação primária e contorno
`--pedra` para secundária. **Prancha** é folha de papel com borda de 1px, número em mono, nome em serif, uma linha de
decisão e a elevação em SVG; nada de canto arredondado. **Cota** é traço de 1px com seta triangular em `--pedra` e
rótulo em mono. **Ficha técnica** é `<dl>` com rótulo em mono 0.6875rem e valor em Corbel 0.9375rem. **Tabela** de
honorários com fio de 1px, e no celular empilha em blocos com o rótulo da coluna em `data-rotulo` — sem rolagem lateral.

## Movimento

Um só momento, e ele significa a coisa certa: **o desenho sendo traçado**. Quando a seção de projetos entra na tela, as
seis elevações se desenham sozinhas — `stroke-dashoffset` de 1400 a 0 em 1.1s, com 110ms de atraso entre pranchas, e os
planos preenchidos (`--prancheta-2`, `--telha`) aparecem por opacidade depois do traço. A mesma ideia governa a memória
de cálculo do estimador: as nove linhas entram uma a uma (70ms), como quem preenche a prancheta à mão. Nada mais na
página se revela por rolagem — a prancheta não desbota ao aparecer. Com `prefers-reduced-motion: reduce` as duas coisas
ficam instantâneas e o desenho nunca nasce escondido (regra explícita no fim do CSS).

## Regras de uso

O telha é caro: use em **execução** (estágio "em obra", plano do desenho em obra) e em **ação** (botão primário, foco,
prancha aberta). Nunca como decoração de seção, nunca em título, nunca em ícone solto. "Entregue" é grafite cheio;
"em projeto" é pedra tracejada — o mesmo tracejado do desenho da Reforma Santa Tereza, onde o existente é o que fica.
A mono não opina: se o texto não é medida, ficha ou número, ele é Corbel — dentro da ficha técnica só a "decisão
principal" volta para a Corbel, porque ali é frase, não dado. A faixa escura é o corte da prancheta: uma no meio, para
o processo, e uma no fim, para o fecho — nunca duas seguidas, e nunca uma terceira. Densidade: a seção de projetos é a
passagem densa (seis desenhos, seis fichas); o escritório é a passagem quieta (três parágrafos e um carimbo de números).

## Decisões em aberto

- **A paleta do briefing não passa em texto pequeno.** `--telha #B0563A` sobre `--prancheta` mede 4,1:1 e `--pedra
  #8C8B84` mede 2,9:1: os dois ficam abaixo de 4,5:1 exigido pelo contrato para texto corrido. Resolvi com duas
  derivações de telha documentadas acima e tirando a pedra do papel de texto (ela faz cota, fio e borda). Se o cliente
  aceitar mexer no hex, `#9A4A30` deveria substituir o telha na paleta oficial.
- **O detector do Impeccable marca `cream-palette`** para o fundo `#EDEAE4`, e marca `repeating-stripes-gradient` para o
  grid de colunas da prancheta. Os dois são exigência literal do briefing (paleta exata e grid de 1px em `--filete`),
  então mantive e registro o conflito. Também acusa 39 travessões no corpo do texto: as fichas técnicas e as linhas de
  cota usam "—" como separador de dado, não como pausa de prosa.
- O desenho é a imagem do modelo, e desenho autoral não tem foto: falta decidir se, na versão do cliente, as elevações
  viram pranchas escaneadas do escritório ou continuam sendo SVG gerado. Hoje são SVG — escalam, imprimem e não pesam.
- Os seis projetos, o acervo, os prêmios e o registro no CAU são inventados para a demonstração. Nada foi verificado
  contra obra real, e o rodapé diz isso.
