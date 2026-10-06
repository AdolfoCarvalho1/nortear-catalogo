# Fontes & Prado — Advocacia empresarial

Referência: não havia registro de style do refero para este modelo no briefing. O mundo veio da referência declarada —
papel timbrado de sociedade de advogados, parecer numerado, ementa — usada como repertório de composição: filete de
timbre no topo, seção em `§`, coluna de metadados em mono, ementa como título de folha.
Propósito: site de uma sociedade de advocacia empresarial em São Paulo (14 advogados, 6 sócios, desde 2004) para
diretoria e jurídico interno de empresa média. A tarefa do visitante é entender o escopo real do escritório, o prazo
de cada serviço e o honorário de referência, e sair com um protocolo de triagem ou uma conversa agendada.

## Tipografia

Display: **Sitka Display** (fallback Sitka Banner, Constantia, Georgia), pesos 400 e 600, `letter-spacing` entre
-0.015em e -0.028em, `text-wrap: balance` em todo título.
- Timbre da sociedade (cabeçalho da folha): 1,35rem → 1,9rem, entrelinha 1,08.
- H1 (promessa): `clamp(2.35rem, 9vw, 4.5rem)`, entrelinha 1.02, medida máxima de 15ch.
- H2 de seção: `clamp(1.75rem, 3.6vw, 2.6rem)`, entrelinha 1.08, medida máxima de 24ch.
- Linha de índice de área (H3 dentro do acordeão): 1,3rem no celular, 1,45rem a partir de 62rem, entrelinha 1.22 —
  é o único texto de display que quebra em duas linhas dentro de um botão, então não usa a entrelinha de cartaz.
- Ementa do parecer: 1,3rem com entrelinha 1,3.
- Números da apuração: `clamp(2rem, 3.4vw, 2.65rem)`, algarismos tabulares.
- Honorário: nome em 1,15rem, valor em 1,35rem tabular alinhado à direita.
- Tese de sócio: 1,0625rem serif em citação curta — serif não é usado em texto corrido.

Leitura: **Lato** (fallback Segoe UI, Calibri). Corpo 1,0625rem com entrelinha 1,62; abertura de seção 1,125rem com
1,6; texto de apoio 0,9375rem. Medida travada em `--leitura: 68ch` em todo parágrafo corrido (descrição de área,
ficha, resposta de dúvida, boletim).

Dado: **Cascadia Mono** (fallback Consolas), caixa alta com `letter-spacing` 0,02–0,09em. Dois degraus, sem exceção:
**12px** (0,75rem) para metadado que é frase — rail da seção, contexto do número, meta do boletim, hora do protocolo,
dica de campo, contador; **11px** (0,6875rem) para rótulo curto — `dt` de ficha, rótulo de campo, selo de área,
numeração 1.1–1.6. Nada abaixo de 11px. Mono só onde existe dado: prazo, data, OAB/SP, CNPJ, telefone, protocolo,
referência de seção, contadores.

## Papéis de cor

Tela e superfícies:
- `--papel #FFFFFF` é a página. `--papel-2 #F4F6F8` faz as quatro faixas que alternam superfície (apuração, §2
  triagem, §4 honorários, §7 dúvidas, §8 agendamento) e nada mais.
- `--filete #DFE4EA` separa linha de lista e campo; `--filete-forte #C3CBD6` fecha borda de folha, campo e painel.
- Faixa escura `#101A2B` uma única vez na página, no §5 (sócios) — é o corte de superfície entre o parecer claro e a
  leitura final.

Texto e ações:
- `--tinta #101A2B` em título, valor e botão primário — 17,4:1 no branco.
- `--tinta-70 #3C4757` no corpo — 9,4:1.
- `--azul-2 #5A6B82` em metadado, rótulo mono e placeholder — 5,4:1 no branco e 4,8:1 sobre `--papel-2`.
- `--tinta-45 #6E7A8A` só em traço, ícone e estado de hover (4,4:1 — nunca em texto pequeno).
- `--latao #9A7B4F` é institucional e não é cor de texto pequeno: filete de 3px no topo da página, filete de abertura
  do índice e das tabelas, número da seção no rail, selo de área. Em número grande (rail a 2,35rem) rende 3,9:1.
- `--latao-tinta #7E6338` é a versão que aguenta texto pequeno (5,6:1): numeração 1.1–1.6, classe do parecer,
  referência em metadado, link de boletim, aviso de e-mail genérico.
- `--latao-claro #C9A874` (7,7:1) e `--noite-tinta-2 #AEB8C6` (8,7:1) fazem o papel do latão e do cinza dentro da
  faixa escura — texto secundário em superfície escura é tingido, nunca cinza puro.
- Estados: erro `#9B2C28` (7,5:1), aviso `#7A5416` sobre `--latao-fundo #FBF6EC` (6,3:1), confirmação `#1F5C46`.

## Layout

Largura de conteúdo: `--tela: min(100% - 2.5rem, 72rem)` — 350px de conteúdo a 390px de viewport, 1152px a 1440px.
A partir de 62rem toda seção vira grade de duas colunas: **8,5rem** de coluna de metadados (rail com §, prazo,
responsável, atualização) e o corpo, com gap `clamp(2rem, 4vw, 3.5rem)`. Abaixo de 62rem o rail é uma linha mono de
contexto acima do título, com o mesmo filete superior de 1px. A grade de abertura é 1,02fr / 0,98fr em 62rem, com a
folha de parecer à direita.

Ritmo de espaçamento (poucos valores, repetidos):
- Seção: `padding-top` e `padding-bottom` de `clamp(3rem, 6.5vw, 5.5rem)`.
- Dentro do corpo da seção: 1,1rem entre blocos; 1,75rem entre grupos grandes (formulário e folha de protocolo).
- Linha de índice, de honorário, de etapa, de sócio e de boletim: 1,1rem–1,5rem de respiro vertical; a linha é dona do
  próprio filete e do próprio padding, com o alvo de toque de ponta a ponta dentro dela.
- Ficha de metadados: 0,7rem por linha, `dt` mono em coluna de 8,5rem a partir de 40rem.
- Campos: 0,9rem entre campos; 0,3rem entre rótulo, controle, dica e erro.
- Sempre mais espaço acima de um título do que abaixo.

Componentes:
- **Botão** — 2,9rem de altura mínima, raio 2px, `--tinta` sólido no primário, variante vazia com `--filete-forte`;
  a variante pequena também respeita 2,75rem (44px). Nenhum botão sem ação: cada um nomeia o que faz ("Gerar
  protocolo", "Levar uma demanda de contrato para a triagem", "Mudar o prazo informado", "Imprimir protocolo").
- **Linha de índice de área** — grade de cinco colunas em 62rem (número mono, nome serif, prazo mono alinhado à
  direita, selo com filete de latão, seta SVG traço 1,8). No celular empilha em três linhas sob o mesmo número. É
  lista, não cartão: não existe caixa de ícone + título + texto nesta página.
- **Ficha** — `<dl>` de dados, `dt` mono em 11px e `dd` em Lato 0,9375rem. Carrega prazo e entregável em toda a
  página (área, etapa do caso, resultado da triagem, contato).
- **Folha** — superfície branca com 1px `--filete-forte` e filete superior de 1px em latão, sem sombra: papel não
  flutua. Usada duas vezes, no parecer da abertura e no protocolo da triagem.
- **Tabela de risco** — `<table>` real do parecer, `caption` em mono, cabeçalho mono caixa alta, valores tabulares,
  exposição alta/média/baixa em erro/aviso/confirmação.
- **Opção de triagem** — rádio nativo de 1px (focável, com `:focus-visible` desenhado na linha) dentro de `<label>`,
  com marca quadrada de 1,05rem que preenche em latão quando marcada; a linha inteira é o alvo, mínimo de 2,9rem.
- **Protocolo** — folha que nasce vazia, passa por estado de carregando (texto mono + barra de latão pulsando) e
  recebe o resultado: número em mono, resumo em ficha, prazo de resposta e área responsável com o motivo da sugestão.

## Movimento

Um único momento autoral, na entrada, e ele significa o mundo: **o timbre se monta**. O filete de latão de 3px corre
da esquerda para a direita (`scaleX`, 900ms, `cubic-bezier(0.16, 1, 0.3, 1)`), o nome da sociedade assenta aos 240ms,
o H1 aos 340ms, a folha do parecer sobe 10px aos 420ms e o quadro de risco se preenche linha a linha
(900/990/1080ms). Depois disso, nada se apresenta de novo: o que existe é funcional — a abertura do painel de área
por `grid-template-rows` 0fr → 1fr (320ms, sem animar altura de layout), a barra de progresso do passo por
`transform: scaleX` (340ms), a barra de carregamento do protocolo pulsando em opacidade (1,2s) e os estados de botão.
`prefers-reduced-motion: reduce` desliga todas as animações e transições e mantém tudo visível.

## Regras de uso

- O latão é institucional. Se um elemento não é numeração, filete de seção, selo de área ou marca de referência, ele
  não é latão. Ação é tinta; estado é erro/aviso/confirmação; latão nunca "destaca" preço.
- Filete de 3px existe **uma vez** na página: o topo do papel. Toda outra borda é 1px.
- `--papel-2` só existe como faixa que alterna superfície; não se aninha superfície, e não se cria cartão dentro dela.
- A faixa escura aparece uma vez. Corte novo se faz com filete de latão, não com outra faixa escura.
- Mono só em dado, e em dois degraus (12px para frase-metadado, 11px para rótulo curto). Se um texto novo precisa de
  mono para "parecer técnico", ele está no lugar errado.
- Texto corrido não passa de 68ch e não encosta na coluna de metadados; a coluna de metadados nunca recebe parágrafo.
- A numeração §1–§8 e 1.1–1.6 é referenciável e é referenciada: metadado de boletim, resultado da triagem e o campo
  "não fazemos isso" citam a seção. Conteúdo novo atualiza a referência em vez de criar número sem função.
- Raio 2px no máximo, e só em controle. Nada de pílula, nada de cartão arredondado.
- Duas regras do detector estão dispensadas por decisão de briefing, com o motivo no próprio arquivo:
  `side-tab` (o filete de 3px no topo é o timbre, não aba de cartão) e `overused-font` (o par Sitka Display · Lato é
  o definido no briefing e resolve nesta máquina sem rede).

## Verificação

- `scripts/detectar.mjs` → **8 apontamentos, todos `cramped-padding`**, e nenhum de categoria *slop*. Os oito são
  artefato da análise estática, que avalia cada regra isoladamente: as `<section>` acusadas têm
  `clamp(3rem, 6.5vw, 5.5rem)` de respiro contra o próprio filete (o padding está na regra `.secao`, o filete na regra
  `.secao--papel2`, no mesmo elemento); `ol.indice`, `div.perguntas` e as demais têm a primeira linha com 1rem ou mais
  de inset. A rodada de correção baixou de 114 para 8: passou a usar propriedades físicas (o detector não resolve
  `padding-block`/`padding-inline`), a linha de índice assumiu o próprio padding, o rail unificou o filete no topo e os
  selos de área, dicas e rótulos saíram de 10px e de caixa alta longa.
- **Captura e inspeção por Chrome não rodaram nesta sessão**: o sandbox bloqueia o processo do navegador.
  `node scripts/capturar.mjs advocacia` → `ERRO advocacia: chrome saiu com código 4294930433`;
  `node scripts/inspecionar.mjs advocacia` → `desktop 0 kB` e `mobile 0 kB` ("saiu vazio"), e o log de console não pôde
  ser lido (pipe negado). Chamadas diretas ao Chrome devolveram
  `ERROR:chrome\app\chrome_main.cc:204] Multiple targets are not supported in headless mode.` e um log vazio de 0 byte
  quando não havia pipe envolvido — o processo é encerrado pelo sandbox, não por erro de argumento do script.
- No lugar da captura, o `<script>` real da página foi executado fora do navegador contra um DOM de teste, com 37
  verificações, todas passando: inicialização sem exceção; contagens do filtro (6/4/3/1) e troca de filtro fechando a
  linha escondida e abrindo a primeira visível; acordeão abrindo e fechando por `aria-expanded` + `data-aberto`; o
  botão da área levando o tipo de demanda para o passo 2 da triagem; aviso honesto de urgência para MEI/pequena com
  Defensoria citada; erro de nome sem sobrenome, de descrição abaixo de 20 caracteres e de telefone inválido; aviso de
  e-mail genérico; protocolo `FP-2026-0001` e `FP-2026-0002` em série; sugestão de área por palavra-chave
  ("sócios" → §1.2, "cobrança" → §1.5) com o motivo escrito; "Nova triagem" voltando ao passo 1 e limpando a folha;
  recibo do agendamento com dia útil e janela de horário.
- Revisão à mão (sem navegador): contraste calculado de cada par texto/fundo (o menor é 4,8:1, no metadado sobre
  `--papel-2`); balanceamento de todas as tags estruturais do HTML; conferência de que todo `id` citado pelo JS existe;
  as cinco âncoras do menu apontam para seções existentes; nenhum `<img>` remoto; cálculo de largura a 390px item a
  item, que revelou e corrigiu o estouro do cabeçalho (a OAB saiu do cabeçalho no celular) e o alvo de 38px do botão
  pequeno (agora 44px).

## Decisões em aberto

- Telefone, WhatsApp, e-mail, endereço e CNPJ são de demonstração; o domínio `fontesprado.adv.br` é fictício e precisa
  ser substituído antes de publicar.
- O escritório publica faixa de honorário neste modelo por decisão de posicionamento. Na versão real é preciso
  confirmar se a sociedade aceita publicar valores ou se a tabela vira "sob consulta" mantendo o escopo aberto.
- Câmaras arbitrais citadas (CAM-CCBC, CAMARB) e agências reguladoras (ANEEL, ANP, ANTT, ANS) foram escolhidas por
  plausibilidade de mercado; a lista real depende da carteira do cliente.
- Os prazos médios, o volume de 1.240 contratos e a média de 4 horas úteis são números de demonstração e precisam ser
  apurados com o escritório: são eles que sustentam a promessa de prazo na página.
- O aviso honesto de urgência para MEI/pequena empresa (§2) é decisão comercial, não jurídica — a sociedade precisa
  confirmar que quer recusar esse perfil publicamente e indicar Defensoria, associação comercial e OAB/SP pelo nome.
- Os boletins do §6 apontam para um e-mail de assinatura porque não existe acervo em PDF nesta demonstração; com os
  arquivos em mão, cada item deve virar link direto para o PDF, com edição e data no metadado.
- O texto de retenção e descarte de documentos (§7, dúvida sobre LGPD) precisa de revisão do sócio responsável antes de
  ir ao ar — é a única resposta da página com consequência contratual.
- A página não pôde ser conferida em navegador nesta sessão (sandbox). Antes de entregar ao cliente, rodar
  `node scripts/capturar.mjs advocacia` e `node scripts/inspecionar.mjs advocacia` numa máquina sem essa restrição e
  olhar as três imagens.
