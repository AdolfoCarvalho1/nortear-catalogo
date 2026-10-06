# Copiloto — SaaS de IA

Referência: [Warp](https://styles.refero.design/style/d4c51049-58eb-404a-9fcb-f195928b1c99) (obsidiana em camadas, terminal como artefato de abertura) e [Evervault](https://styles.refero.design/style/03dcd158-bc4d-447b-aaf2-8e522671a109) (escada de elevação escura, acento único). Consultadas em 2026-02. Nenhuma das duas é guia oficial de marca: são registros de referência.
Propósito: convencer diretoria e liderança de operação de que a IA responde com fonte verificável — e provar isso na própria página, não descrever.

## Tipografia

Display: Cascadia Mono · 600 · `clamp(2rem, 3.5vw, 2.75rem)` · entrelinha 1.08 · tracking -0.035em · título de abertura, títulos de seção e todo número medido. A monoespaçada é a voz principal porque o produto **é** uma interface de texto: a resposta vem em mono, com a fonte citada ao lado.
Leitura: Segoe UI · 400 · 17px · entrelinha 1.62 · medida máxima 62ch · texto corrido, parágrafos e rótulos de apoio.
Interface: Segoe UI 600 em botões e navegação; Cascadia Mono 400 em metadados, carimbos de hora, comandos (`copiloto ask "…"`) e no log do console.

## Papéis de cor

Tela e superfícies (quatro degraus, do chão ao que está aceso):
- `#08090C` chão da página — a sala escura.
- `#101319` superfície de painel.
- `#171B23` superfície elevada (terminal, cartões de plano).
- `#1F242E` superfície de barra (topo do terminal, cabeçalho do console).
- `#262C38` / `#39414F` filetes: o primeiro para separação interna, o segundo para borda de controle.

Texto e ações:
- `#E9EBF0` texto principal — 15,8:1 sobre o chão.
- `#A7AEBD` texto secundário — 7,6:1 sobre o chão, tingido do azul, nunca cinza puro.
- `#8B93A3` rótulo e metadado — 5,3:1 sobre o chão e 4,6:1 sobre a superfície elevada.
- `#3A5BE0` azul de ação — 5,4:1 com texto branco. O tom vivo original `#5B7CFA` ficava em 3,7:1 e foi rebaixado a acento decorativo.
- `#93A9FF` azul claro: acento sobre superfície escura (links, realce de trecho citado, cursor do terminal).
- `#4ADE9B` verde de estado vivo (ponto de conexão, item verificado). `#F5A524` aviso. `#F87171` erro de formulário.

## Layout

Largura de conteúdo: `min(100% - 2.5rem, 76rem)`; a partir de 64rem, duas colunas em 1,02fr / 0,98fr na abertura.
Ritmo de espaçamento: 0.5rem entre rótulo e valor; 1.1rem entre parágrafos; 1.75rem entre blocos; seções em `clamp(3.5rem, 7vw, 6rem)`. Mais espaço acima de um título do que abaixo, sempre.
Componentes: raio 6px em botão, campo e cartão; 10px em painel (terminal, console, plano). Botão com borda de 1px na mesma cor do fundo; botão vazio só com filete. Cartão de plano com borda `--linha`, e o plano em destaque troca a borda para o azul de ação — sem sombra dura, sem vidro.

## Movimento

Um momento autoral: a **resposta sendo escrita**. Ao enviar uma pergunta, o texto entra caractere a caractere e, ao terminar, os cartões de fonte aparecem em cascata de 90ms. É o único movimento orquestrado da página; o resto é revelação por rolagem com desfoque curto e `translateY(12px)`.

## Regras de uso

- O azul de ação aparece **só** em ação, estado ativo e link. Nunca como fundo de seção.
- O verde vivo é reservado a estado verificado (conectado, sem divergência). Não é cor de sucesso genérica.
- A monoespaçada nunca é usada para texto corrido: ela é medida, comando e resposta.
- Superfície escura em quatro degraus. Não criar um quinto tom avulso.
- Sem gradiente em texto, sem vidro decorativo, sem sombra colorida de desfoque grande.
- Em 390px a barra do terminal esconde o rótulo de sessão e mantém as abas roláveis; o formulário empilha em uma coluna.

## Decisões em aberto

- A referência não diz como o produto se comporta com base vazia: o roteiro do terminal tem uma resposta de "não encontrei isso na sua base" escrita à mão, que precisa ser validada com o time de produto.
- Números de prova (41s, 2.480 documentos, 96%, 5 dias) são material de demonstração e precisam ser substituídos por medição real antes de publicar.
- O log do console é roteiro fixo. Numa versão publicada ele deve ler telemetria real ou ser removido.
- Ainda não há versão em inglês nem página de documentação; ambas herdariam este sistema sem mudar tokens.
