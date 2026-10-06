# Clara — clínica de estética (dermatologia estética)

Referência: registro de estilo `styles.refero.design` para superfícies claras de saúde (consultado em 2026-02).
Propósito: mulher de 30 a 55 anos, em Florianópolis, que quer tratar pele com seriedade e **não** quer parecer
"plástica". A tarefa da página é tirar a desconfiança antes do preço: mostrar o que cada procedimento resolve,
quanto dura, quantas sessões, o que contraindica e quem aplica — e deixar claro que o protocolo termina com alta.

## Tipografia

**Display:** `"Sitka Text", Constantia, Georgia, serif`, peso 400/600. h1 em `clamp(2.25rem, 4.4vw, 3.25rem)`,
entrelinha 1.1, `text-wrap: balance`; h2 em `clamp(1.7rem, 3.1vw, 2.3rem)`, entrelinha 1.16. Usado na abertura,
nos títulos de seção, no nome das profissionais, nos preços e nos marcos da régua de tempo. Itálico verdadeiro
aparece **uma vez**, em "critério" no h1 — nunca em título inteiro.

**Leitura e interface:** `"Lato", "Segoe UI", Calibri, Arial, sans-serif`, corpo em 1.0625rem/1.64, medida de
leitura entre 62ch e 74ch. A sans também assume os blocos clínicos (etapas da avaliação, dados do procedimento,
recibos) — é ali que o tom fica técnico, com números tabulares.

**Dados:** `font-variant-numeric: tabular-nums` em duração, sessões, intervalo, percentual, preço, horário e
recibo. Não há monoespaçada neste modelo: número de clínica não é código.

**Rótulos:** Lato 0.75rem, caixa alta, `letter-spacing: 0.1em`. Só em rótulo curto — pergunta longa
("Você já fez esse procedimento antes?") vira texto normal em 0.9375rem/600.

## Papéis de cor

**Tela e superfícies:** linho `#F6F1EC` é o chão da página inteira; linho-2 `#EFE8E1` marca as faixas (números,
agendamento, rodapé); papel `#FFFFFF` é o que está sob a luz — cartões de procedimento, painel do formulário,
comparador, régua de tempo. Filete `#E2D9D0` em 1px faz toda a separação.

**O sistema é a separação entre cuidado e clínico:**

- **Cuidado e ação** — rosé queimado. Fundo rosé `#F6EBE4` marca bloco de cuidado (orientação de retorno,
  resposta selecionada). Texto de ação usa `#8E5F49`: o tom claro `#B98A76` do briefing fica em 3,0:1 com branco
  e 2,7:1 sobre linho, então **só serve como fundo, fio e marca gráfica** — nunca como texto pequeno. Botão cheio,
  filtro ativo, horário escolhido e preço usam `#8E5F49` (5,41:1 com branco, 4,82:1 sobre linho).
- **Clínico e protocolo** — verde-sálvia `#5E6B5F` sobre fundo `#E8EDE6`. Marca o que é conduta: etapa da
  avaliação, "Incluso", "Não indicamos se", contraindicação no formulário, recibo, estado válido do campo.
  Texto sobre sálvia usa `#3F4A41` / `#4E5A50` (6,1:1 e 9,2:1), nunca cinza puro.
- **Tinta:** `#2A2622` no texto corrido (13,4:1), `#5C554E` no secundário (6,5:1), `#6E665C` no rótulo (5,0:1).
- **Erro:** `#8E3F32` sobre `#F7E7E2`, com borda `#D9B3A8` — nunca vermelho puro.

Todos os 28 pares de texto/superfície usados na página foram medidos: o menor é 4,82:1 em texto normal e 3,37:1
em texto desabilitado (mínimo 3:1).

## Layout

**Largura de conteúdo:** `min(100% - 2.25rem, 72rem)` — 72rem no desktop, com 1.125rem de respiro lateral no
celular. A grade de procedimento é 1.04fr / 0.96fr em duas colunas a partir de 56rem: nome e o que resolve à
esquerda, dados clínicos e preço à direita. O agendamento é 0.82fr / 1.18fr (explicação estreita, painel largo).

**Ritmo de espaçamento:** seções em `clamp(3.25rem, 7vw, 5.5rem)`; cabeça de seção com 1rem entre título e apoio
e `clamp(1.85rem, 3.5vw, 2.75rem)` antes do conteúdo; grupos internos em 0.9rem–1.25rem; itens de lista de
procedimento com `1.75rem` a `2.5rem` de respiro vertical e filete de 1px entre eles. Sempre mais espaço acima do
título do que abaixo.

**Componentes:**
- **Botão** — 2.9rem de altura (≥ 44px), raio 8px, fundo rosé de ação; a variante vazia tem borda `#CDBFB4`.
- **Campo** — 2.9rem, borda `#CDBFB4`, foco com anel `rgba(185,138,118,.28)`, erro com borda `#8E3F32`.
- **Cartão de procedimento** — raio 8px; a lista é uma folha corrida com filetes, não uma grade de cartões iguais.
- **Comparador** — tabela real (`th` de linha + uma coluna por procedimento), com escala de desconforto desenhada
  em 5 marcas de alturas crescentes, sem estrela e sem emoji.
- **Régua de tempo** — linha de 1px com 4 marcos (dia 0, 15, 45, 90), horizontal no desktop, empilhada no celular.

## Movimento

Um único momento autoral: **a régua de tempo se desenha**. Ao entrar na viewport, a linha cresce da esquerda para
a direita (`scaleX`) e cada marco chega em sequência, no intervalo de 0,15s a 0,9s, na ordem dos dias. O significado
é literal — o tratamento leva 90 dias e a página mostra isso acontecendo. Nada mais na página anima na entrada além
deste bloco. Sem JS, a régua nasce visível: a classe que esconde só é aplicada quando o observer existe.
`prefers-reduced-motion: reduce` desliga animação e transição e mostra a régua já desenhada.

## Regras de uso

- Rosé **nunca** decora: só cuidado, ação e estado escolhido. Se um elemento não é clicável nem acolhedor, ele não
  é rosé.
- Sálvia **nunca** é enfeite: só o que é conduta clínica (protocolo, contraindicação, prescrição, dado do recibo).
  Isso é o que faz a clínica parecer séria sem ficar fria.
- Fundo rosé claro e fundo sálvia claro não aparecem na mesma seção: a página alterna as duas vozes.
- Sombra é sempre difusa e rasa (`0 22px 48px -40px`), nunca dura, nunca colorida. Profundidade vem de luz, não de
  elevação dramática.
- Não usar foto de paciente em nenhuma hipótese: o antes e depois é a régua de tempo e a evolução fica no prontuário.
- Nada de "a partir de": preço por sessão e total estimado do protocolo sempre explícitos.

## Decisões em aberto

- **Endereço e registros são fictícios** (Rua Bocaiúva 000, CRM-SC 000000, RQE 0000, telefones de exemplo). O
  briefing não forneceu dados reais e o rodapé declara a ficção.
- **Agenda é simulada em memória**: os horários ocupados vêm de um padrão fixo (`OCUPADOS`), não de um sistema de
  agendamento. Ligar em agenda real é trabalho de integração, não de layout.
- **Valores de procedimento são plausíveis, não pesquisados**: preço por sessão, número de sessões e desconforto
  foram escritos para demonstração e precisam de validação clínica antes de qualquer uso comercial.
- **Avaliação a R$ 290 com abatimento no primeiro procedimento** e pagamento em até 6 vezes são decisões comerciais
  inventadas para o modelo; a clínica real define as suas.
- **O detector do Impeccable aponta 11 avisos de `cramped-padding`** em seções que têm padding real (`.secao` com
  4,5rem, `.etapas`, `.painel` com 1,75rem): a análise estática não resolve `clamp()` nem considera o padding do
  contentor quando o primeiro filho é um título com margem zero. `comparador` e `painel` foram corrigidos com valor
  fixo e saíram da lista; o restante é falso positivo conhecido. Também ficam 5 avisos de `all-caps-body` — são os
  rótulos curtos de formulário em caixa alta, exigidos pelo briefing (0.75rem, `letter-spacing: 0.1em`) — e os
  avisos de `cream-palette`, `overused-font` (Lato) e `thin-border-wide-shadow`, que são escolhas fixadas no
  briefing: linho quente, Lato para leitura e filete de 1px com sombra muito difusa.
- **Sem captura de tela nesta rodada**: o Chrome headless não abre sob o sandbox desta sessão (`mojo
  platform_channel: Acesso negado`), então a verificação visual foi feita por execução do próprio script da página
  contra um DOM instrumentado (83 asserções de comportamento, estados e recorte de texto) e por medição de
  contraste. Falta uma passada de olho humana em 1440 e 390.
