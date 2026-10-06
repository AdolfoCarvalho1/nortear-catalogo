# Modelos — índice de construção

Dez modelos, um por nicho. Cada pasta tem `index.html`, `estilo.css`, `modelo.json` e `DESIGN.md`.

| # | id | pasta | nicho | mundo visual | interativo principal | status |
|---|----|-------|-------|--------------|----------------------|--------|
| 01 | saas-ia | `01-saas-ia` | SaaS de IA | obsidiana, mono, sala de controle | terminal que responde citando fontes | construído e verificado |
| 02 | restaurante | `02-restaurante` | Restaurante autoral | papel de menu, terracota | menu degustação + reserva | construído e verificado |
| 03 | advocacia | `03-advocacia` | Advocacia empresarial | papel timbrado, azul-tinta | índice de áreas + triagem de caso | construído e verificado |
| 04 | arquitetura | `04-arquitetura` | Arquitetura e interiores | prancheta, traço grafite | trilho de pranchas + estimador | construído e verificado |
| 05 | fitness | `05-fitness` | Personal trainer | quadro de academia, limão elétrico | montador de plano + diário de série | construído e verificado |
| 06 | clinica | `06-clinica` | Clínica de estética | consultório claro, rosé e sálvia | agendamento por procedimento | construído e verificado |
| 07 | imobiliaria | `07-imobiliaria` | Imobiliária boutique | portfólio de carteira, petróleo | busca com filtros + painel do imóvel | construído e verificado |
| 08 | curso | `08-curso` | Curso online | caderno de oficina, azul e marca-texto | quiz de nivelamento + grade | construído e verificado |
| 09 | moda | `09-moda` | Moda autoral | lookbook de ateliê, preto e branco | sacola com estoque por tamanho | construído e verificado |
| 10 | estudio | `10-estudio` | Estúdio criativo | cartaz colado, preto e laranja | manifesto letra por letra + orçamentador | construído e verificado |

## Documentos

- `README.md` — como usar o catálogo, o que trocar antes de mostrar a um cliente, o que é fictício.
- `PRODUCT.md` — verdade do produto: público, promessas, restrições, o que não pode ser inventado.
- `docs/CONTRATO-CRAFT.md` — piso de qualidade e proibições que valem para os dez modelos.
- `docs/BRIEFINGS.md` — o mundo visual, as referências e o interativo de cada modelo, com a semente da rodada de direção.
- `modelos/<pasta>/DESIGN.md` — o sistema de cada modelo, escrito a partir do que foi construído.

## Verificação executada

- Captura em 1440px e 390px dos 10 modelos: **nenhuma rolagem lateral**, nenhum erro de console.
- `node scripts/detectar.mjs`: anti-padrões triados por modelo. Os achados de contraste foram corrigidos
  (nos modelos 01 e 06 a cor de ação foi escurecida para passar 4,5:1 com texto branco).
- Achados mantidos de propósito, com o motivo no `DESIGN.md` de cada modelo: paleta creme onde o mundo é
  papel (02, 04, 07, 08), Lato como voz de leitura (02, 05, 06, 07, 08, 09) e textura de papel pautado (08).

## Como refazer

```powershell
node scripts/capturar-cdp.mjs --todos --largura 1440 --thumbs   # prévias do catálogo
node scripts/capturar-cdp.mjs --todos --largura 390 --pagina    # página inteira em mobile
node scripts/detectar.mjs                                       # anti-padrões
npm run verificar                              # as 11 rotas em 1440 e 390
```

Os comandos que abrem o Chrome precisam rodar fora de sandbox restrito (o Chrome usa named pipes entre
processos e é bloqueado em modo confinado). As capturas ficam em `assets/thumbs/` e `.impeccable/review/`.

