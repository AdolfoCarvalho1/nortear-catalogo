# Guia de migração de um modelo para Next

Você vai migrar **um modelo** de HTML estático para uma rota do app Next deste repositório.
O objetivo é fidelidade total: a página no Next tem que ficar **idêntica** ao estático.
O modelo 01 já foi migrado e serve de referência — leia os arquivos dele antes de começar.

---

## O que já está pronto (não refaça)

- `app/data/catalogo.ts` — dados tipados, com `rota` de cada modelo.
- `app/(catalogo)/` — o catálogo em React (route group com root layout próprio).
- `app/modelos/saas-ia/` — **a referência**: `layout.tsx`, `page.tsx`, `Interacoes.tsx`.
- `scripts/extrair-modelo.mjs` — converte o HTML do modelo em JSX. **Já rodou**: o resultado está em `.migracao/<pasta>/corpo.jsx.txt` e `.migracao/<pasta>/interacao.js`.
- `scripts/gerar-pagina.mjs` — monta o `page.tsx` a partir do JSX convertido.
- `scripts/fidelidade.mjs` e `scripts/geometria.mjs` — provam que a migração não mudou o desenho.

## O que você entrega

Três arquivos em `app/modelos/<slug>/`, onde `<slug>` é o id do modelo sem o número
(ex.: `02-restaurante` → `app/modelos/restaurante/`):

1. `layout.tsx` — root layout da rota: `<html lang="pt-BR">`, metadata, viewport e o `import` do CSS do modelo.
2. `page.tsx` — o markup, gerado pelo script (você não escreve à mão).
3. `Interacoes.tsx` — o script de interação portado para um componente cliente.

**Não edite nada fora da sua pasta.** Não mexa em `app/data/`, `app/(catalogo)/`, nos outros modelos, nem em `scripts/`.

---

## Passo a passo

### 1. Gere o page.tsx

```powershell
node scripts/gerar-pagina.mjs <pasta> <Componente> Interacoes
```

Ex.: `node scripts/gerar-pagina.mjs 02-restaurante PaginaRestaurante Interacoes`

O `<Componente>` segue o padrão `Pagina<Nome>`: `PaginaMesa12`, `PaginaFontesPrado`, `PaginaAtelieHorizonte`,
`PaginaForja`, `PaginaClinica`, `PaginaCostaVilela`, `PaginaOficina`, `PaginaTrama`, `PaginaRuido`.

### 2. Escreva o layout.tsx

Copie a estrutura de `app/modelos/saas-ia/layout.tsx` e troque:

- O `import` do CSS: `import '@/modelos/<pasta>/estilo.css';` (caminho do modelo estático).
- `metadata.title`, `metadata.description` e o `openGraph` — pegue o título e a descrição exatos de
  `.migracao/<pasta>/meta.json` (foram extraídos do HTML original).
- `viewport.themeColor` — a cor de `.migracao/<pasta>/meta.json`.
- O favicon em data-URI: mantenha o mesmo do modelo estático (está no `<link rel="icon">` do
  `modelos/<pasta>/index.html`); só troque as cores se o original usar outras.
- O nome do componente de layout: `Layout<Nome>`.

**Isto é obrigatório:** cada modelo é um root layout independente. Se você importar o CSS do
catálogo ou usar um layout compartilhado, o CSS vaza de um modelo para o outro e o desenho quebra
(foi exatamente o bug que apareceu no modelo 01: a regra de duas colunas do catálogo entrou na
página do modelo e mudou a altura das seções).

### 3. Porte o script para Interacoes.tsx

Abra `.migracao/<pasta>/interacao.js`. É o script original do modelo. Ele **funciona como está**:
consulta o DOM que o React renderizou e liga os controles. Sua tarefa é embrulhar, não reescrever.

Estrutura (copie de `app/modelos/saas-ia/Interacoes.tsx`):

```tsx
'use client';

import { useEffect } from 'react';

export default function Interacoes() {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (document.documentElement.dataset.<modelo>Ligado === 'sim') return; // guarda: não liga duas vezes
    document.documentElement.dataset.<modelo>Ligado = 'sim';
    ligar();
  }, []);

  return null;
}

function ligar() {
  // o corpo do script original, com tipos onde o TS reclamar
}
```

Regras do porte:

- **Preserve o comportamento.** Não "melhore" a lógica, não troque `setTimeout` por outra coisa, não
  mude textos nem prazos. O que está lá foi verificado.
- **Preserve o primeiro `document.documentElement.classList.add('js')`** se existir: o CSS de alguns
  modelos depende dessa classe para não esconder conteúdo.
- **Tipos:** o TS vai reclamar de `querySelector` (retorna `Element | null`) e de `.dataset`. Resolva com
  genéricos e asserções, como no modelo 01:
  ```ts
  const $ = <T extends Element = HTMLElement>(s: string, c: ParentNode = document) => c.querySelector(s) as T | null;
  const $$ = <T extends Element = HTMLElement>(s: string, c: ParentNode = document) => Array.from(c.querySelectorAll(s)) as T[];
  ```
  Para `dataset`, use `(el as HTMLElement).dataset.chave!`.
- **Saída antecipada:** se o script faz `if (!elemento) return;` para não quebrar quando falta um nó,
  mantenha. Isso protege contra erro em hidratação.
- **Nada de `import` no meio do script original.** Se ele usar algo do tipo, traga para o topo.
- **Sem `any` desnecessário**, mas não perca tempo com tipos perfeitos: `tsc --noEmit` tem que passar.

### 4. Verifique

```powershell
npx tsc --noEmit                     # tipos
npx next build                       # build (precisa passar)
```

Com o servidor de produção no ar (`npx next start -p 4321`), prove a fidelidade:

```powershell
node scripts/fidelidade.mjs <id>                  # 1440px: tem que dar IDÊNTICO
node scripts/fidelidade.mjs <id> --largura 390    # 390px:  tem que dar IDÊNTICO
node scripts/geometria.mjs <id>                   # todos os blocos com a mesma geometria
```

Se der `difere` ou `DIFF`, **investigue até ficar idêntico**. As causas prováveis, em ordem:

1. **CSS vazando** — você importou o CSS do catálogo ou o layout não é root layout próprio.
   Confira com `node scripts/detalhe-secao.mjs <id> "<seletor>"`: ele mostra propriedade por propriedade.
2. **Script não ligou** — o componente não é `'use client'`, ou o `useEffect` não rodou, ou a guarda
   está com o nome errado. Veja se o DOM tem o conteúdo que o script deveria criar.
3. **Markup convertido errado** — compare o `page.tsx` com o `modelos/<pasta>/index.html` original.
4. **Atributo numérico ou SVG** — o conversor troca `stroke-width` por `strokeWidth` e `rows="1"` por
   `rows={1}`. Se algo não renderizar, verifique se o atributo saiu na forma certa.

**Não declare sucesso sem ver `IDÊNTICO` nas duas larguras.** Se não conseguir chegar lá, relate
exatamente o que divergiu e o que você tentou — isso vale mais que um "pronto" otimista.

---

## Comandos de referência

```powershell
node scripts/extrair-modelo.mjs <pasta> --gravar    # regera o JSX (não apaga seu Interacoes.tsx)
node scripts/gerar-pagina.mjs <pasta> <Componente> Interacoes
node scripts/fidelidade.mjs <id> [--largura N]      # pixel a pixel contra o estático
node scripts/geometria.mjs <id> [--largura N]       # geometria bloco a bloco
node scripts/detalhe-secao.mjs <id> "<seletor>"     # propriedades computadas de um elemento
npx tsc --noEmit
npx next build
```

## Observações de ambiente

- O Chrome headless precisa rodar **fora de sandbox restrito** (ele usa named pipes entre processos).
  Neste projeto isso já está liberado; se um comando de captura falhar com erro de permissão, relate
  em vez de insistir em variações.
- O servidor `next start -p 4321` já está no ar. Se você mudar código, rode `npx next build` e reinicie
  para que a rota nova apareça.
- Os dados vêm de `assets/modelos-data.js`, gerado a partir de `app/data/catalogo.ts`. Não edite o
  arquivo gerado.
