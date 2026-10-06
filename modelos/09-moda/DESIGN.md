# Trama — Moda autoral

Referência: mundo construído a partir do briefing do modelo 09 do catálogo Nortear Estúdio (lookbook de ateliê, branco de estúdio / preto de passarela), consultado em 2026-02.
Propósito: vender roupa autoral feminina em pequena tiragem para uma mulher de 28 a 45 anos que compra pouco e bem. A página tem uma tarefa só: mostrar a peça com honestidade (tecido, tamanho, estoque, prazo) e levar à sacola. Vende por critério, não por urgência.

## Tipografia

Display: `"Franklin Gothic Medium", "Franklin Gothic", "Segoe UI", Arial, sans-serif`. Grotesca condensada em caixa alta, entreletra aberta (0,03em a 0,14em) — linguagem de passarela, não de cartaz. Onde usa: marca no cabeçalho (1,25rem), «TRAMA» da abertura (`clamp(3.5rem, 13vw, 6rem)`, teto de 6rem), a promessa em frase no mesmo corpo display (`clamp(1.15rem, 2.6vw, 1.75rem)`, sem caixa alta — é subtítulo, não cartaz), títulos de seção (`clamp(1.6rem, 3.6vw, 2.6rem)`), nome das peças (1,15rem), número dos passos (2rem) e as frases de produção na faixa de números (`clamp(1.1rem, 2vw, 1.5rem)`).
Leitura: `"Lato", "Segoe UI", Calibri, Arial, sans-serif`, 400. Corpo a 1,0625rem/1,68; texto secundário a 0,9375rem; medida de 58 a 72ch nos blocos corridos (o ateliê usa 68ch). Rótulos técnicos — código da peça, tecido, tamanho, preço, legendas, filtros — em Lato 0,75rem, caixa alta, `letter-spacing: 0.12em`. Exceção deliberada: o **preço** usa o mesmo tratamento de rótulo, mas em 1rem, porque é o dado que decide a compra e a 0,75rem ele desaparecia na grade densa. Todos os números da página (preços, estoque, medidas, frete, cronômetro da reserva) usam `font-variant-numeric: tabular-nums`.

## Papéis de cor

Tela e superfícies: `--branco #FFFFFF` carrega a página; `--papel #FAF9F7` marca as passagens de leitura (medidas, cuidados) e a faixa de números; `--filete #E4E2DE` é o único fio, sempre 1px; `--areia-fundo #F2EFE9` é o fundo de todo desenho técnico e da faixa de matéria-prima.
Texto e ações: `--tinta #0D0D0D` em texto, fio e botão (19,4:1); `--tinta-70 #4A4A4A` em texto secundário (8,9:1 no branco, 7,7:1 no areia-fundo); `--tinta-45 #8A8A8A` **só em traço de desenho técnico** (costura e vinco), nunca em texto — 3,5:1 não passa AA.
Reservas, e são exclusivas: `--vinho #8E2F3C` marca **só** o que está acabando ou esgotado (última peça, esgotado, lista de espera, tamanho riscado e erro de estoque). `--areia #B9AE9C` marca **só** tecido e matéria-prima — bordas da faixa de matéria-prima, amostra de trama, fios dos desenhos. Nada mais na página usa essas duas cores; não existe terceiro acento, nem "cor de sucesso" verde.
Fecho e rodapé: preto `--tinta` de ponta a ponta, texto branco e secundário em `color-mix(in srgb, #FFF 76%, #0D0D0D)` — cinza tingido do próprio preto, nunca cinza puro. Onde o vinho não teria contraste (2,4:1 sobre preto), o erro de formulário é sinalizado por borda de 2px branca, fundo a 8% e mensagem em branco: estado distinguível sem depender de matiz.

## Layout

Largura de conteúdo: `min(100% - 1.25rem, 78rem)` de `.tela`, dentro de faixas que recuam 0,625rem nas laterais — 20px de respiro em qualquer tela, de 390px a 1440px.
Ritmo de espaçamento: 0,625rem (recuo lateral) · 0,9rem (`--inset`, usado nos recuos internos das faixas) · 1,25rem (respiro curto) · 2rem (separação de blocos) · `clamp(3.5rem, 8vw, 6.5rem)` (altura de seção) · `clamp(4.5rem, 11vw, 9rem)` (passagem quieta do ateliê). Sempre mais espaço acima de um título do que abaixo.
Grade: 1, 2 ou 4 colunas — nunca 3, para a última linha ficar cheia também com filtro ativo. Cada peça desenha a própria moldura de 1px e recua 1px sobre a vizinha, então as linhas internas coincidem exatamente: 1px em toda a grade, sem bloco de fundo aparecendo quando uma linha fica incompleta.
Componentes: **botão** é retângulo sem raio (0), 2,9rem de altura, caixa alta 0,75rem com 0,12em, tinta cheia ou vazio de fio — nenhum botão tem sombra. **Campo** é fio de 1px, sem raio, 3rem de altura, `select` com seta em SVG. **Peça** é a unidade do lookbook: desenho em SVG sobre areia-fundo, código no canto, ficha com tecido, modelagem, tamanhos com estoque, disponibilidade honesta e preço. **Tabela** usa só fio horizontal, cabeçalho em caixa alta e `caption` em frase. Tudo com raio 0 e sem sombra: a hierarquia vem de fio, espaço e tipografia.

## Movimento

Um único momento autoral: **o desenho se traça**. Ao entrar na tela, a silhueta de cada peça é desenhada como num papel de moldes (`stroke-dashoffset` de 1,15s, escalonado por cartão) e só então as costuras e vincos aparecem em fade de 0,7s. A peça da abertura se traça sozinha ao carregar, 240ms depois. É o gesto do ateliê — o molde antes da roupa — e é o único movimento de entrada da página: nenhuma seção tem fade genérico. Fora dele, só transições de estado (hover, foco, `aria-pressed`) entre 0,16s e 0,2s. `prefers-reduced-motion: reduce` desliga tudo, e o desenho aparece pronto.

## Regras de uso

Vinho só com palavra de escassez na mesma linha ("última peça", "esgotado", "lista de espera") — nunca como cor de destaque, nunca no botão, nunca em título. Areia só encostada em tecido ou matéria-prima; se um elemento não fala de fio, ele não é areia. Tinta-45 não vira texto. A grade é sempre densa e uniforme; o ateliê é sempre quieto, com muito ar e texto corrido — as duas passagens não se misturam. Nada de cantos arredondados, nada de sombra, nada de moldura no desenho, nada de foto: o desenho técnico é a imagem da marca. Lato é escolha obrigatória do briefing do modelo (família verificada na máquina de demonstração, sem rede) — o detector do Impeccable sinaliza a família como comum; a decisão é mantida e documentada aqui, porque um modelo de catálogo precisa abrir igual em qualquer máquina offline.

## Decisões em aberto

O briefing não dizia se a sacola deveria ser lateral ou uma página própria; escolhemos painel lateral para o teste acontecer sem sair da coleção. Não há decisão sobre meio de pagamento real: o botão "Finalizar pedido" monta o resumo em tela e diz, em texto, que seguiria para o checkout numa versão publicada. A reserva de 30 minutos é real na interface e fictícia no negócio — não há servidor. Preço de peça sob encomenda (+25%) e frete grátis acima de R$ 900 são afirmações comerciais de demonstração, marcadas como fictícias no rodapé.
