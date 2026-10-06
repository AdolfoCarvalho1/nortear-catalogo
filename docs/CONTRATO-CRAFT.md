# Contrato de craft — modelos do catálogo Nortear Estúdio

Leia este arquivo inteiro antes de escrever qualquer linha. Ele é o piso de qualidade dos 10 modelos.
O modelo **01-saas-ia** (`modelos/01-saas-ia/index.html` + `estilo.css`) é a referência construída: leia os dois
arquivos antes de começar e iguale ou supere o nível de acabamento dele.

---

## 1. O que é cada modelo

Um site de uma página, completo, em pt-BR, para um tipo de negócio real, que será vendido por um catálogo de agência.
O visitante é um **dono de negócio brasileiro** avaliando se aquilo serve para ele. Ele precisa entender em 5 segundos
o que é o negócio, o que ele oferece e qual é o próximo passo.

Modo: **Persuade**. O site vende. A página é o produto.

## 2. Estrutura obrigatória

```
<!DOCTYPE html> <html lang="pt-BR"> <head>
  charset, viewport, <title>, meta description, meta theme-color,
  <link rel="stylesheet" href="estilo.css">, favicon em data-URI SVG
</head>
<body>
  <a class="pular" href="#...">Pular para o conteúdo</a>
  <header> — marca + nav (5 âncoras) + botão de ação principal
  <main>
    1. ABERTURA — o produto/serviço demonstrando algo, não uma frase genérica
    2. uma faixa de números/prova (números reais do domínio, não "99% de satisfação")
    3. seção principal do domínio (menu / áreas / projetos / planos / imóveis / grade / coleção)
    4. um controle interativo que funciona de verdade (ver §5)
    5. preços, planos ou orçamento com valores em R$
    6. prova ou processo (como funciona, antes e depois, etapas)
    7. perguntas frequentes (<details>, a primeira aberta)
    8. fecho com formulário validado
  </main>
  <footer> — inclui SEMPRE o link <a href="../index.html">Voltar ao catálogo de modelos</a>
            e a linha "Demonstração de catálogo. Nome, preços e textos são fictícios."
  <script> — IIFE, vanilla, sem dependências
</body>
```

## 3. Sistema visual — regras duras

Cada modelo tem **um mundo próprio**, derivado da referência indicada no seu briefing. Componha como diretor de arte.

**Proibido (não é preferência, é veto):**
- Texto com gradiente (`background-clip: text`).
- Vidro/blur como decoração. `backdrop-filter` só no cabeçalho fixo, e olhe lá.
- `border-left` ou `border-right` colorida acima de 1px em cartões, itens de lista ou avisos.
- Sombra dura de deslocamento (`box-shadow: 4px 4px 0`) fora de mundo explicitamente neobrutalista.
- Cartões do mesmo tamanho com ícone + título + texto como estrutura da página. Cartão aninhado em cartão: nunca.
- Faixa de métrica genérica: número grande, rótulo pequeno, três estatísticas e um acento. (A faixa de números é
  permitida **só** se os números forem específicos do domínio e vierem com a unidade e o contexto reais.)
- Sobrescrito/eyebrow acima de título ("NOSSO DIFERENCIAL", "SOBRE NÓS"). O título carrega o próprio peso.
- Numeração de seção (01/02/03) sem significado real.
- Glifos Unicode ou emoji no lugar de ícone. Ícone é SVG desenhado, traço 1.6–2, `fill:none`, `stroke:currentColor`.
- Monoespaçada como fantasia de "técnico" fora de código, dado ou medida.
- Fonte de sistema genérica (Arial, Impact, Segoe UI) como voz de display de um mundo próprio. Use as famílias
  indicadas no briefing.
- `clip-path` de muitos vértices fazendo o papel de uma imagem que deveria existir.

**Obrigatório:**
- Contraste: texto corrido e placeholder ≥ 4,5:1; texto grande ≥ 3:1. Em superfície colorida, o texto secundário é
  tingido daquele matiz — nunca cinza puro.
- Profundidade: se houver sombra, com deslocamento e desfoque suave.
- Espaçamento: grupos apertados, separação generosa, **mais espaço acima de um título do que abaixo**.
- Tipo: medida de leitura 65–75ch; display no máximo 6rem; `letter-spacing` nunca abaixo de -0.04em; degraus de
  tamanho e peso óbvios; `text-wrap: balance` em títulos.
- Superfícies do navegador vestidas pelo sistema: `::selection`, `caret-color`, scrollbar (Firefox + WebKit),
  `:focus-visible`, `text-underline-offset`. Isso é o sinal mais barato de página construída e o que mais falta.
- Estados reais: hover, focus, ativo, desabilitado, erro, vazio. Botão nenhum sem ação.
- `prefers-reduced-motion: reduce` desliga toda animação.
- Um único momento de movimento autoral, orquestrado — não a mesma entrada em todas as seções.
- Ícones: SVG inline, traço consistente.
- Mobile: desenhado primeiro para 390px. Alvos de toque ≥ 44px. Nada de rolagem horizontal.
- Imagens: **não existe rede nesta máquina**. Nada de `<img src="http...">`. Toda imagem é CSS/SVG autoral
  (gradiente, padrão, ilustração em SVG inline, composição tipográfica). Isso não é limitação a esconder: é o mundo.
  Nada de `<img>` quebrada; se usar `<img>`, o `src` é um data-URI SVG.

## 4. Conteúdo — escreva de verdade

- Copy pt-BR específica do domínio. Nada de "lorem ipsum", nada de "Solução inovadora para o seu negócio".
- Nomes próprios brasileiros plausíveis (pessoas, bairros, pratos, ruas, produtos). Nada de "João Silva".
- Preços em R$ com formato brasileiro: `R$ 1.890`, `R$ 89/mês`, `a partir de R$ 240`.
- Dados brasileiros: telefone `(11) 90000-0000`, CEP `01310-100`, cidade e bairro reais.
- Rotule o que é fictício no rodapé. Números de prova devem ser plausíveis e específicos, não redondos.
- Todo controle nomeia a própria ação ("Reservar mesa", "Calcular meu plano", "Buscar imóveis").

## 5. O controle interativo — o coração do modelo

Cada modelo tem **um** controle que funciona de verdade, em JS puro, e que um comprador vai testar na frente do
cliente. Ele deve ter estado vazio, estado de carregando, resultado e erro. Exemplos por modelo estão no briefing.
Regras:
- Funciona por teclado (Tab, Enter, Espaço, setas quando fizer sentido).
- `aria-live` onde o resultado muda.
- Nunca usa `alert()`, `confirm()` nem `prompt()`.
- Nada de `fetch`, `localStorage` bloqueado, ou qualquer coisa que falhe em `file://`. Só estado em memória.

## 6. Código

- Um `estilo.css` por modelo, com variáveis CSS próprias (`:root`), comentado por bloco com o porquê do mundo.
- Um `<script>` IIFE no fim do HTML. `'use strict'`. Sem `var` solto em escopo global, sem dependência externa.
- HTML semântico: `header`, `nav`, `main`, `section`, `article`, `footer`, `details`, `label` ligado a `input`.
- Sem `!important` (exceto `prefers-reduced-motion` se necessário).
- Comentários em português, curtos, explicando decisão — não o óbvio.

## 7. Verificação antes de entregar

1. Abra o arquivo no Chrome headless e **olhe a captura** (o comando está em §8). Não presuma: veja.
2. Rode `node scripts/detectar.mjs <pasta-do-modelo>` e corrija o que ele apontar.
3. Confira à mão: contraste, foco visível por teclado, 390px sem rolagem lateral, nenhum texto cortado,
   nenhum botão morto, nenhum `<img>` quebrado.
4. Corrija tudo numa rodada só e recapture uma vez. Duas rodadas é o teto — não fique polindo em loop.

## 8. Comandos

```powershell
# captura 1440x990 (topo da página) — o PNG é a prévia usada no catálogo
node scripts/capturar-cdp.mjs <id-do-modelo> --largura 1440 --thumbs

# captura de página inteira + mobile 390px, para inspeção
node scripts/capturar-cdp.mjs <id-do-modelo> --largura 390 --pagina

# detector de anti-padrões do Impeccable
node scripts/detectar.mjs <pasta-do-modelo>
```

## 9. DESIGN.md do modelo

Depois de construir, escreva `modelos/<pasta>/DESIGN.md` com **o que foi construído**, não o que se pretendia.
Formato (baseado no template do styles.refero.design):

```markdown
# <Nome do modelo> — <nicho>

Referência: <URL do style do refero> (consultado em 2026-02)
Propósito: <público e tarefa>

## Tipografia
Display: <família, peso, tamanho, entrelinha, onde usa>
Leitura: <família, peso, tamanho, entrelinha, medida>

## Papéis de cor
Tela e superfícies: <valores e onde aplicam>
Texto e ações: <valores e requisitos de contraste>

## Layout
Largura de conteúdo: <valor ou faixa>
Ritmo de espaçamento: <gaps repetidos, não medidas soltas>
Componentes: <botão, campo, cartão, tabela — o que os define>

## Movimento
<o momento autoral e o que ele significa>

## Regras de uso
<quando usar e quando não usar certas cores, superfícies, densidade>

## Decisões em aberto
<o que a referência não podia dizer sobre este negócio>
```

## 10. O que faz este trabalho parecer barato (evite)

- A mesma abertura em todos os modelos: título à esquerda, botão, três cartões embaixo.
- Acento colorido espalhado por toda a página em vez de reservado para ação e estado.
- Cantos arredondados iguais em tudo, sombra igual em tudo, 8px de raio por hábito.
- Seções com a mesma altura e o mesmo ritmo, sem uma passagem densa e uma passagem quieta.
- Texto de apoio explicando o que a imagem deveria mostrar.
- "Saiba mais" repetido seis vezes. Cada link diz para onde leva.

Se em algum momento você se pegar escrevendo o layout padrão da categoria, pare e refaça a seção a partir do
mundo indicado no seu briefing.

