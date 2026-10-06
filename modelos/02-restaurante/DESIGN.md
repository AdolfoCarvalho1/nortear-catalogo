# Mesa 12 — restaurante autoral

Referência: registro de estilo do styles.refero.design indicado no briefing do catálogo — direção "papel de menu impresso" (consultado em 2026-02). O briefing não trouxe URL própria; a direção veio descrita em mundo, paleta e tipografia.
Propósito: dono de restaurante com menu próprio avaliando se este modelo serve para a casa dele — e, do lado do cliente final, quem quer jantar e precisa entender o menu, o preço e reservar em menos de um minuto.

## Tipografia

Display: Georgia 400 (nunca bold pesado) — h1 em `clamp(2.9rem, 6.6vw, 4.75rem)` com entrelinha 0.98 e entreletra -0.03em; h2 de seção em `clamp(1.75rem, 3.2vw, 2.5rem)`, entrelinha 1.15, entreletra -0.02em; nomes de prato em 1.3125rem; promessa da abertura em itálico a `clamp(1.35rem, 2.6vw, 1.85rem)`. A itálico de Georgia também carrega as linhas de origem e a nota da noite.
Leitura: Lato 400, 1.0625rem, entrelinha 1.65, medida de 68ch (`--leitura`). Rótulos de campo e de coluna em Lato 700, 0.75rem, caixa alta, entreletra 0.14em em `--tinta-70`. Números e preços sempre com `font-variant-numeric: tabular-nums`. Sem monoespaçada em nenhum ponto.

## Papéis de cor

Tela e superfícies: `--papel #F4EDE2` é o fundo da página inteira; `--papel-2 #EBE2D3` marca duas faixas (a ficha de números e a passagem quieta da casa); `--branco #FFFDF9` é sempre uma folha sobre o papel — carta da abertura, cartão de prato, comanda de preços, painel de reserva, recibo e o bloco de aviso do menu. Raios 0 em tudo; a separação é feita por filete de 1px (`--filete #D9CFBE`).
Texto e ações: `--tinta #1C1A15` no texto corrido (14,9:1 sobre o papel), `--tinta-70 #4A463D` no secundário (8,1:1), `--tinta-35 #A9A296` só em filetes fortes e traço de ícone — nunca em texto, porque 2,2:1 não passa em WCAG AA em nenhum tamanho. `--barro #B4552A` aparece apenas em preço, botão de ação, estado ativo do tempo aberto, mensagem de erro e estado de esgotado; sobre papel o barro tem 4,23:1, então todo preço em barro ou vive em superfície branca (4,84:1) ou está em corpo ≥ 24px, como na adega. `--oliva #6E7A4A` marca só o que é da estação, sempre sobre branco (4,55:1) ou em lista da carta. `--vinho #6B2A2E` é usado em um único lugar: o rótulo "Harmonização" quando a taça é vinho — nos tempos sem álcool o mesmo rótulo fica em `--tinta-70`, e a cor comunica a diferença.

## Layout

Largura de conteúdo: `.tela` com `max-width: 76.5rem` e `padding-inline: 1.25rem` — 1.184px de texto em tela larga, 350px em 390px, sem rolagem lateral. Colunas assimétricas por seção — abertura 1.05fr / 25rem, reserva 1fr / 27rem, casa 1.35fr / 20rem, onde ficamos 1fr / 24rem. O cartão de prato usa quatro colunas: número (2,5rem), nome e ingredientes (1fr), a margem de origem (14rem) e a lane do ícone (1,6rem); a margem é separada por filete vertical e, abaixo de 62rem, cai para baixo de um filete horizontal. O detalhe do prato repete a mesma malha, com o texto na coluna 2 e a harmonização na coluna da margem — o olho desce sempre pela mesma linha. Os filetes internos das margens são desenhados por `::before` (1px, sem `border`), para que o inset medido seja o do texto e não o da caixa.
Ritmo de espaçamento: degraus fixos `--e1 0.5rem`, `--e2 1rem`, `--e3 1.5rem`, `--e4 2.5rem`, `--e5 4rem`; seções em três passos literais — 3,5rem, 5rem a partir de 48rem e 6,5rem a partir de 75rem. Linhas de lista (vinhos, perguntas, dados, horários) sempre com 1,1rem a 1,75rem de inset vertical. Grupos apertados (nome e ingredientes a 0,4rem), separação generosa entre seções; o título de seção tem sempre mais espaço acima do que abaixo.
Componentes: botão retangular com 1px de borda e sem raio (barro para a ação, contorno para a ação secundária, papel-2 com tinta-70 no estado desabilitado); campo e select com borda de 1px em `--tinta-70` sobre a folha branca, mínimo de 2,9rem de altura; cartão de prato branco com filete; comanda de preços em linhas de 1px; `<details>` para os sete tempos e para as perguntas. Nenhum cartão aninhado: dentro do cartão de prato e do painel de reserva só existem filetes e texto.

## Movimento

Um único momento autoral, o serviço: ao abrir um tempo, o filete interno se estica da esquerda para a direita em 0,5s e os blocos do detalhe sobem em sequência (60/130/200/270ms). O botão "Abrir todos os 7 tempos" dispara os sete em cascata de 90ms, como um serviço correndo a mesa. Fora disso a página não anima na entrada — é papel impresso, não slideshow. Com `prefers-reduced-motion: reduce`, tudo abre de uma vez, sem animação e sem cascata.

## Regras de uso

Use barro só quando o elemento pede decisão ou dinheiro: preço, botão de reserva, tempo aberto, erro de campo, prato que mudou hoje. Nunca pinte títulos, ícones decorativos ou fundos de seção com ele. Use oliva apenas para o que está no auge — se a informação não for de safra, ela é tinta. Mantenha 0 de raio: no dia em que um canto arredondado entrar, o mundo deixa de ser papel. A margem de origem à direita do prato é obrigatória em pratos novos: é ela que substitui a foto. Densidade: o menu é a passagem densa; a casa e o chef é a passagem quieta, com capitular e entrelinha maior — não acrescente blocos operacionais ali.

## Decisões em aberto

O briefing pedia `--tinta-35` para "filetes e rótulos"; rótulos migraram para `--tinta-70` porque o detector de contraste reprova qualquer texto em `--tinta-35`. O preço em barro sobre papel fica em 4,23:1: passou a viver em superfície branca na carta e na comanda, e em corpo de 25px na adega — se o restaurante quiser preços pequenos sobre o creme, será preciso escurecer o barro. O detector do Impeccable fica com dois apontamentos que o briefing fixa de propósito: `[cream-palette]` (o creme `#F4EDE2` é o mundo pedido, não um reflexo de categoria) e `[overused-font]` (Lato é a voz de leitura definida no briefing, e resolve nesta máquina sem rede). Também em aberto: se o menu vegetariano terá seção própria em vez de uma linha na comanda, e se a adega vai precisar de filtro por taça/garrafa quando passar de seis rótulos.
