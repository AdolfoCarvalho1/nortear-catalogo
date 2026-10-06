# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 16 (App Router, TypeScript, npm), com React 19. As 13 rotas são pré-renderizadas como
estáticas no build, então o site carrega sem servidor de aplicação e publica em qualquer hospedagem.
Cada modelo tem root layout próprio, porque são dez identidades visuais distintas: um layout
compartilhado faria o CSS de um vazar nos outros. Os dados vivem em `app/data/catalogo.ts`, tipados;
`assets/modelos-data.js` é gerado dele para os scripts de verificação, que rodam fora do bundler. Sem
CDN e sem dependência de rede em tempo de execução — o desenho é SVG autoral e a tipografia resolve
na máquina.

## Users

- Primary: the agency owner/operator (the user) presenting website models to prospective small and mid-sized Brazilian business clients in a live sales conversation or a forwarded link.
- Secondary: the prospective client — owner or marketing lead of a Brazilian business (restaurant, law office, architecture studio, gym, clinic, real-estate broker, online course, fashion retail, SaaS startup, creative studio) evaluating whether a given model fits their business and budget.

## Product Purpose

A sales catalog ("catálogo de venda") of ten complete, distinct website models. Each model is a working, production-grade single-page website for one real market niche, presented inside a catalog that lets a prospect compare models, understand what is included, see the price range in BRL, and choose a package. Success means a prospect can pick a model and a package in one sitting without the agency having to explain the visual direction from scratch.

## Positioning

Ten genuinely different visual worlds built from real, inspectable design references rather than ten recolors of one template. Every model is a complete page with working controls, real pt-BR copy for its own market, its own type pairing, palette, motion and states — and each one ships with a DESIGN.md that documents the system, so the client's future content can be added without breaking the design.

## Operating Context

- Market: Brazil. All copy, prices, packages and calls to action in pt-BR; prices in R$ (BRL); Brazilian formats for phone, CNPJ-style data, CEP and dates.
- Sold as a service: the agency adapts the chosen model to the client's real content, domain, hosting and analytics.
- Reviewed on desktop and on a phone, often by forwarding a link. Desde a migração o demo roda por `npm run dev` ou por um servidor do build; o HTML estático original fica em `modelos/` e `estatico/` como baseline do desenho e referência do teste de fidelidade.
- Sem dependência de rede em tempo de execução: a imagem é autoral (CSS/SVG/arte procedural), a tipografia é local, nenhum CDN.

## Capabilities and Constraints

- Ten models, each a self-contained page with its own stylesheet and script: 01 SaaS/IA, 02 restaurante autoral, 03 advocacia, 04 arquitetura, 05 personal trainer/studio, 06 clínica de estética, 07 imobiliária, 08 curso online, 09 e-commerce de moda autoral, 10 estúdio criativo.
- Each model carries: responsive layout (mobile-first, verified at 390 and 1440), working interactive controls (no dead buttons), form validation and states, keyboard focus, themed selection/caret/scrollbar, and one authored motion moment.
- Catalog page: browsable index of the ten models with real preview thumbnails, what is included per model, package/pricing table in R$, comparison and a contact/checkout path.
- Constraint: no network at runtime. Imagery must be authored (CSS/SVG/generated procedural art) — no stock photos, no remote assets.
- Constraint: fonts must resolve on the demo machine; the chosen families are Windows-resident and shipped with fallbacks for other machines.
- Explicitly undecided: final agency brand name for the catalog itself (a working name is used and marked as replaceable), payment/checkout provider, hosting provider, and whether the client wants a bilingual version later.

## Brand Commitments

- Working agency name for the catalog: **Nortear Estúdio** (marked replaceable; the user has not confirmed a final name).
- Language and voice: pt-BR, direct, commercial, no hype, no emoji, no exclamation-mark stacking; the catalog sells by showing the work.
- Prices shown are the catalog's own commercial claims and are authored as illustrative starting ranges, labeled as such; no fabricated client logos, testimonials attributed to real companies, or benchmark numbers.

## Evidence on Hand

- Real design references from styles.refero.design (colors, typography character, surface strategy per style record) used as the source material for each model's world. These are inspiration records, not brand guides, and no reference brand is named as a client.
- Ten niche-specific content sets authored at production fidelity (menu items, practice areas, listings, course modules, product names, price ranges) — all synthetic, labeled synthetic in the catalog's fine print.
- Absent and must not be fabricated: real client names, real project photos, real testimonials, real certifications, real address/CNPJ, real press.

## Product Principles

1. Show, never describe: the model itself is the pitch; every section must work as a live demo, not a screenshot of one.
2. Ten worlds, one craft floor: distinction lives in palette, type, composition and material — never in quality. No model is the "cheap" one.
3. The price is part of the design: packages, what is included, and the next step are always findable in seconds.
4. pt-BR truth: every word, price and format belongs to the Brazilian market the catalog sells into.
5. Documented to hand over: a model without its DESIGN.md is unfinished, because the client's team will add content to it next month.

## Accessibility & Inclusion

- Every model: body text contrast ≥ 4.5:1, large text ≥ 3:1, visible keyboard focus, semantic landmarks and headings, labeled controls, `prefers-reduced-motion` respected, touch targets ≥ 44px on mobile.
