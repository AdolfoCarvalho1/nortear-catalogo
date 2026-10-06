# Oficina — curso online (redação publicitária)

Referência: grade de curso de escola independente (padrão de "syllabus + matrícula" do styles.refero.design), consultada em 2026-02
Propósito: vender uma turma de 6 semanas para quem escreve no trabalho e quer escrever melhor, ou quer entrar na área. A tarefa do visitante é ler a ementa real, se reconhecer no nivelamento e reservar uma das 12 vagas.

## Tipografia

Display: Candara, peso 700, entrelinha 1.02–1.32. Usada em h1 (2.15–3.6rem), h2 (1.65–2.4rem), nomes de módulo (1.0625–1.2rem), nomes dos instrutores, nome da trilha no resultado do quiz e na manchete corrigida da abertura. `letter-spacing` -0.025em só nos títulos grandes; zero nos pequenos.
Leitura: Lato, 400/700, 1.0625rem, entrelinha 1.62, medida 65–75ch (títulos de seção limitados a 26ch, textos corridos a 68–76ch).
Números: **todo** dado operacional é Lato com `font-variant-numeric: tabular-nums` — carga horária, duração de aula, notas de módulo, datas, preços, contadores do painel. A família de display nunca carrega número de dado; só os quatro números de prova da faixa de métricas.

## Papéis de cor

Tela e superfícies: papel `#FBF8F2` como chão da página; papel-2 `#F3EEE4` na única passagem pautada (a grade) e no rodapé; branco `#FFFFFF` nas folhas soltas (correção da abertura, aviso de prazo, painel de carga, quiz, resultado, garantia, fecho); tinta `#14161B` na faixa dos instrutores, que é a única faixa escura da página.
Texto e ações: tinta `#14161B` no corpo; tinta-70 `#4B4E56` em texto secundário pequeno (7,2–8,5:1); tinta-60 `#6E7178` em placeholder e micro-rótulo (4,6–4,9:1); tinta-45 `#85878E` só em ornamento, ícone e filete (nunca em texto pequeno). Azul-caneta `#3B4FD8` é ação, link, número de módulo e o que é conteúdo: 6,0:1 sobre papel e 6,4:1 com texto branco em cima. Amarelo marca-texto `#E9B32C` **nunca** é cor de texto: é fundo de realce (`#FBF0CE` com tinta por cima, 16:1) e marca de urgência em `#A97C10` quando precisa de 3:1 como elemento de interface (as 12 casas de vaga). Sobre a tinta, o azul-claro `#B4BEFF` substitui o azul (10,3:1) e o papel-fraco `#C9C6BE` substitui o cinza.
Regra do sistema: azul = o que se aprende, amarelo = quando. O amarelo só aparece onde há prazo, data, vaga ou entrega de exercício — data da próxima turma, fechamento das inscrições, as 12 casas de vaga, o horário dos encontros, o prazo do exercício dentro de cada módulo, a data no resultado do quiz e a data no formulário. Nenhum botão, nenhum link e nenhum título usa amarelo.

## Layout

Largura de conteúdo: `min(100% - 2.25rem, 72rem)`; coluna de leitura entre 52ch e 76ch; no desktop a grade do curso é `1fr + 17rem` (painel de carga preso com `position: sticky` a 5.5rem), o investimento é `1.35fr + 0.9fr` e o fecho é `1fr + 27rem`.
Ritmo de espaçamento: seções em `clamp(3.25rem, 7vw, 5.75rem)`; grupos internos em 0.5 / 0.85 / 1.4rem; hairlines de 1px `#E2DCCF` separando linhas de lista em vez de cartões empilhados.
Componentes: botão (raio 6px, altura mínima 2.9rem, 2.75rem na versão pequena, azul cheio ou vazio com borda `#CFC8B8`); folha (raio 6px, borda de 1px e sombra de 2px de desfoque — papel não flutua); linha de grade de módulo (número em azul à esquerda da margem desenhada, título, meta em tabular, barra de carga de cinco casas e seta); barra de carga (cinco casas iguais, as cheias contam as aulas do módulo: 27 casas cheias somam as 27 aulas do curso); campo de formulário (raio 0, só a linha de base em `#85878E`, porque a ficha é preenchida à mão); acordeão de módulo animado com `grid-template-rows: 0fr → 1fr`, sem medição em JS.

## Movimento

Um único momento autoral, na abertura: a caneta azul corrige a manchete do exercício da semana 1. Seis trechos são riscados em sequência (scaleX, 150 ms de intervalo), a frase nova entra, o verbo ganha sublinhado e a nota da professora aparece por último — 1,7 s no total, uma vez, na primeira dobra. O resto do movimento é funcional: o acordeão abre, as barras crescem por transform, o painel pisca em azul-fundo **o número que mudou** e o quiz entra a cada passo. Nenhuma seção repete a mesma entrada.

## Regras de uso

Quando usar: amarelo só em prazo, data, vaga, entrega e contagem de dias; azul em ação, link, número de aula e métrica de conteúdo; papel-2 apenas na grade e no rodapé; superfície escura apenas na seção de instrutores, nunca no fecho; cartão só quando o conteúdo é uma folha de verdade (correção, aviso, painel, ficha, resultado).
Quando não usar: não colocar texto cinza dentro do marca-texto (a tinta dentro do realce é sempre a mais escura); não usar amarelo como cor de texto em nenhuma hipótese; não dar sombra difusa a folha com borda de 1px; não transformar a grade em cartões com ícone — ela é uma lista, e a barra de carga é o desenho; não repetir a animação de riscar em outra seção.

## Decisões em aberto

- O nome do curso (Oficina) e os nomes dos professores são de demonstração; a marca real define se o display continua sendo Candara ou vira a fonte da escola.
- Datas fixas (9 de março, 6 de março) com contagem de dias calculada no navegador: em produção as datas vêm do sistema de turmas, e a contagem precisa vir da mesma fonte — o HTML estático diz "9 de março" mesmo quando o JS rola a data para o ano seguinte.
- Preço, juros do parcelamento e vagas remanescentes são textos fixos: precisam de uma fonte única (planilha ou CRM) antes de publicar.
- O quiz recomenda trilha por regra determinística no cliente. Se a escola quiser registrar as respostas para marketing, isso exige backend e uma política de privacidade — hoje nada sai do navegador.
- Falta decidir se a turma estendida de 9 semanas terá preço próprio ou seguirá o mesmo valor da turma padrão, como está escrito aqui.
