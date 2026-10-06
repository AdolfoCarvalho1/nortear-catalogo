# Auditoria técnica — Impeccable `/audit`

Escopo: 11 rotas do app Next (`/` + 10 modelos), medidas em **1440px** e **390px**.
Método: Chrome via CDP, com sonda que mede contraste WCAG real, foco por tecla Tab, rótulos,
semântica, alt, movimento, custo de render, tokens e alvos de toque. O detector do Impeccable
fechou a dimensão de integridade.

Reproduzir:

```bash
npm run build && npx next start -p 4321
node scripts/auditar.mjs --largura 1440     # dimensões 1 a 4
node scripts/auditar.mjs --largura 390
node scripts/auditar-foco.mjs --largura 390 # foco com tecla de verdade
npm run detectar                            # dimensão 5
```

---

## Audit Health Score

| # | Dimensão | Nota | Achado principal |
|---|----------|------|------------------|
| 1 | Acessibilidade | **4** | 3.077 trechos de texto medidos, zero abaixo do piso; foco por teclado em **275/275** paradas |
| 2 | Performance | **4** | 745 nós de DOM em média, profundidade 16, zero transição de layout, zero `will-change` |
| 3 | Theming | **4** | 41 tokens declarados, 335 usos de `var()`; 169 estilos inline, todos dados (altura de barra, largura de traço) |
| 4 | Responsivo | **4** | Zero rolagem lateral nas 11 rotas × 2 larguras; zero alvo abaixo do piso |
| 5 | Integridade | **4** | Um token inexistente, uma colisão de classe e um rótulo não associado — os três corrigidos; zero botão sem `type` |
| **Total** | | **20/20** | **Excellent** |

**Nenhum achado aberto.** Os três itens P3 da primeira passada foram resolvidos na passada de polish
e estão registrados abaixo, na seção de correções.

---

## Veredito de integridade

**Passa.** A implementação expressa um sistema coerente e específico do produto, e não um template
genérico. Evidência verificada:

- Cada modelo tem paleta, tipografia, raio, sombra e movimento próprios, com `DESIGN.md` descrevendo
  o que foi construído — dez mundos visuais distintos, não dez recolors.
- Os controles são específicos do domínio: terminal que cita fonte (01), menu degustação (02),
  triagem com protocolo (03), prancha com desenho técnico (04), diário de série (05), agenda clínica
  (06), planta baixa em SVG (07), grade com carga horária (08), sacola com estoque por tamanho (09),
  orçamentador com regras de negócio (10).
- O detector aponta 1 a 2 itens por modelo, todos triados e justificados no `DESIGN.md` do modelo
  (paleta creme onde o mundo é papel, Lato como voz de leitura) ou falso positivo de heurística
  (`cramped-padding` não resolve `clamp()`, `gpt-thin-border-wide-shadow` lê o valor declarado e não
  o computado).

---

## Achados corrigidos nesta rodada

### [P1] Token inexistente derrubava o foco e o estado ativo — modelo 06

- **Local:** `modelos/06-clinica/estilo.css`, linha 74 e mais 6 usos
- **Categoria:** Theming / Acessibilidade
- **Impacto:** `--rose-forte` era usado em 7 lugares e **nunca declarado**. O `outline: 2px solid
  var(--rose-forte)` ficava inválido e o navegador descartava a declaração inteira: **nenhum
  elemento da página tinha indicador de foco**. O mesmo token quebrava a borda do cartão de
  abertura, o fundo do filtro ativo e a cor do preço.
- **WCAG:** 2.4.7 (foco visível), 1.4.3 (contraste)
- **Correção:** substituído pelo token de ação do modelo (`--rose`, `#8E5F49`), que passa 4,5:1 com
  texto branco.
- **Comando sugerido:** `/impeccable polish`

### [P1] Colisão de nome de classe tornava o link da marca quase intocável — modelo 07

- **Local:** `modelos/07-imobiliaria/estilo.css` linha 536 e `index.html` (5 ícones de FAQ)
- **Categoria:** Responsivo
- **Impacto:** o ícone +/− do acordeão e o **link da marca no cabeçalho** usavam a mesma classe
  `.marca`. A regra do ícone (`width: 1rem; height: 1rem`) vencia a do link, e o link do cabeçalho
  ficava com **16×16px** — alvo de toque impossível, em qualquer tela.
- **WCAG:** 2.5.8 (tamanho do alvo)
- **Correção:** ícone renomeado para `.sinal` no CSS, no HTML estático e no `page.tsx`. O link da
  marca passou a 134×44px.
- **Comando sugerido:** `/impeccable adapt`

### [P2] Cinco contrastes abaixo do piso

- **Local:** `assets/catalogo.css` (`--tinta-60`, `--sinal`), `modelos/08-curso/estilo.css`
  (`--tinta-60`), `modelos/10-estudio/estilo.css` (palavra não acesa)
- **Categoria:** Acessibilidade
- **Impacto:** texto secundário do catálogo em 4,01:1 na faixa (mínimo 4,5), selo branco sobre
  laranja em 4,49:1, botão desabilitado em 4,23:1, e a palavra ainda não acesa do manifesto em
  1,82:1 — esta última ilegível para baixa visão enquanto a animação não chega nela.
- **WCAG:** 1.4.3
- **Correção:** valores recalculados com `scripts/contraste.mjs` para atingir o alvo com folga
  (`#636B7A`, `#CC3D1A`, `#666970`) e um token novo `--apagado: #5E5E5E` (3,05:1, o piso de texto
  grande) para o estado não aceso — sem tocar em `--grafite`, que também é fio e preenchimento.
- **Comando sugerido:** `/impeccable colorize`

### [P2] Campo sem rótulo acessível — modelo 05

- **Local:** `app/modelos/fitness/page.tsx` linha 390
- **Categoria:** Acessibilidade
- **Impacto:** o `input[type=range]` de frequência tinha `legend` no `fieldset`, mas nada ligava os
  dois. Leitor de tela anunciava "controle deslizante, 3" sem dizer de quê.
- **WCAG:** 1.3.1, 4.1.2
- **Correção:** `id` no `legend` e `aria-labelledby` no input, nos dois lados (o estático é o baseline).
- **Comando sugerido:** `/impeccable clarify`

### [P3] Botões sem `type` explícito — 7 ocorrências · **resolvido**

- **Local:** `app/modelos/saas-ia/page.tsx` e `modelos/01-saas-ia/index.html` (as abas do terminal e do console)
- **Categoria:** Integridade
- **Impacto:** dentro de `<form>`, o padrão do HTML é `submit`. Nenhum desses está em formulário, então
  não havia bug; era risco latente se o markup mudasse.
- **Correção:** `type="button"` explícito nos 14 botões (7 no Next, 7 no estático), por
  `scripts/tipar-botoes.mjs`. Os botões criados por script já declaravam o tipo.
- **Comando:** `/impeccable harden`

### [P3] `input[type=date]` sem indicador em todo caminho de teclado · **resolvido**

- **Local:** `modelos/02-restaurante/estilo.css` e `modelos/06-clinica/estilo.css`
- **Categoria:** Acessibilidade
- **Impacto:** o controle de data nativo do Chrome não marca `:focus-visible` em todos os caminhos de
  navegação por teclado. Onde ele não marca, o campo ficava sem nenhum sinal de foco.
- **WCAG:** 2.4.7
- **Correção:** regra de `:focus` ao lado da de `:focus-visible`, garantindo o indicador sempre — a
  borda muda de cor e, no 06, o anel de `box-shadow` aparece. O `:focus-visible` continua sendo o
  caminho preferido; o `:focus` é a rede.
- **Comando:** `/impeccable adapt`

### [P3] `DESIGN.md` do modelo 06 · **não era problema**

- O relatório anterior dizia que o documento ainda descrevia `--rose-forte`. Ao abrir o arquivo, ele
  **não menciona esse token em lugar nenhum** — a afirmação estava errada e foi retirada.

---

## Falsos positivos que validei e descartei

Registro isto porque um relatório que não separa o que mediu do que supôs não serve para decidir.

| Achado | Por que não é problema |
|---|---|
| "426 de 566 focáveis sem indicador de foco" | **Medição errada.** A sonda lia `outline` no estado de repouso; foco não estava aplicado em nada. Com a tecla Tab real: **273/275 paradas com indicador**. |
| `input#data` (tipo `date`) sem anel em 2 rotas | **Meu detector estava errado**, não o campo: ele só aceitava `outline` ou `box-shadow`, e o indicador ali é a **borda** mudando de cor. Passou a comparar a borda com o estado de repouso. Com isso, e com a regra de `:focus` que acrescentei, o foco ficou em 275/275. |
| "tokens declarados: 0" | **Medição errada.** `CSSStyleDeclaration` não enumera custom properties, e `ownerNode.textContent` de um `<link>` é vazio. Lendo `cssText` das regras: **41 tokens, 335 usos**. |
| `--atraso` e `--w` "não declarados" | Definidos em runtime por `setProperty` nos scripts de interação. Uso legítimo. |
| `cramped-padding` em 11 seções do 06 | Heurística não resolve `clamp()`. As seções têm `clamp(3rem, 6.5vw, 5.5rem)` de respiro. |
| `gpt-thin-border-wide-shadow` no 06 | Lê o valor declarado, não o computado. O desfoque real é 30px, abaixo do limite. |
| "larguras fixas maiores que a viewport: 16" em 390px | São `width` de SVG e de barras de gráfico dentro de contêiner com `overflow` — não geram rolagem, e a verificação confirma zero rolagem lateral. |

---

## Padrões e questões sistêmicas

1. **O mesmo nome de classe em dois papéis** apareceu em dois modelos (`.marca` no 07, `.marca` no 08
   como marca-texto). É o risco de BEM aplicado pela metade: o bloco precisa ser único no documento.
   Vale uma varredura de nomes repetidos quando um modelo novo for criado.
2. **Tokens usados sem declaração** só apareceram no 06, mas o erro é silencioso por natureza — o
   navegador descarta a declaração sem avisar. O `scripts/auditar.mjs` agora reporta isso.
3. **Os arquivos estáticos e o Next compartilham o mesmo CSS**, então toda correção de acessibilidade
   entra nos dois. Foi o que manteve a fidelidade em 10/10 idênticas depois das correções.

---

## O que está funcionando bem

- **Contraste:** 3.077 trechos medidos nas 11 rotas, **zero abaixo do piso**, com a razão calculada
  sobre o fundo efetivo (misturando camadas translúcidas), não sobre o fundo declarado.
- **Movimento:** 11/11 rotas têm regra de `prefers-reduced-motion`, e nenhuma usa o "mata tudo" de
  0,01ms — o estado final é preservado.
- **Foco:** anel de 2px com `outline-offset`, e os campos usam anel de `box-shadow` como reforço.
- **Semântica:** um `h1` por rota, zero salto de nível de título, zero `div` com `onclick`,
  `header`/`nav`/`main`/`footer` presentes em todas.
- **Imagens:** 10 prévias, todas com `alt`, `width`/`height` e `loading="lazy"` quando abaixo da dobra.
- **Performance:** zero transição de propriedade de layout, zero `will-change` (que é hint, não base),
  profundidade de DOM 16.
- **Rede:** zero requisição externa — o desenho é SVG autoral e a tipografia resolve na máquina.

---

## Ações recomendadas

Nada pendente. Os três itens P3 da primeira passada foram resolvidos:

1. ~~`/impeccable harden`~~ — feito: `type="button"` explícito nos 14 botões, e indicador de foco
   garantido nos campos de data.
2. ~~`/impeccable polish`~~ — feito nesta passada: nomes de classe repetidos entre papéis diferentes
   eliminados, e todo token usado tem declaração (o auditor confere).
3. ~~`/impeccable document`~~ — não era necessário: o `DESIGN.md` do 06 não citava o token removido.

## Estado depois do polish

| Verificação | Resultado |
|---|---|
| `npm run auditar` (1440 e 390) | contraste **0 falhas** · alvos **0 abaixo do piso** · rolagem **nenhuma** |
| `npm run auditar:foco` | **275/275** paradas de Tab com indicador visível |
| `npm run verificar` | **22/22** rotas sem problema |
| `npm run fidelidade` | **10/10** idênticas ao estático, em 1440px e 390px |
| `npm run interacao` | **8/8** fluxos funcionando |
| `tsc --noEmit` · `next build` | limpo · 13 rotas estáticas |
