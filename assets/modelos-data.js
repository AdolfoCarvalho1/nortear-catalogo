/* ============================================================
   GERADO AUTOMATICAMENTE — não edite este arquivo.

   A fonte é app/data/catalogo.ts. Depois de mudar lá, rode:
       node scripts/sincronizar-dados.mjs

   Este arquivo existe em CommonJS porque os scripts de captura (Chrome
   headless) rodam fora do bundler e não leem TypeScript.
   ============================================================ */
(function (raiz, fabrica) {
  var api = fabrica();
  raiz.CATALOGO = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  return {
  "AGENCIA": {
    "nome": "Nortear Estúdio",
    "assinatura": "Sites sob medida para negócios que já sabem o que são.",
    "whatsapp": "+55 11 97000-0000",
    "email": "oi@nortear.studio",
    "cidade": "São Paulo · atendimento remoto no Brasil inteiro",
    "cnpj": "00.000.000/0001-00",
    "nota": "Nome, contato e CNPJ são de exemplo — troque pelos seus antes de publicar."
  },
  "PACOTES": [
    {
      "id": "essencial",
      "nome": "Essencial",
      "preco": 300,
      "prazo": "5 dias úteis",
      "para": "Um modelo do catálogo, com o seu conteúdo.",
      "inclui": [
        "1 modelo do catálogo, 1 página completa",
        "Até 12 blocos de conteúdo ajustados",
        "Identidade aplicada: cores e tipografia da sua marca",
        "Formulário de contato + WhatsApp",
        "SEO básico, título e descrição por seção",
        "Publicação no seu domínio",
        "1 rodada de ajustes"
      ],
      "naoInclui": [
        "Textos escritos por nós",
        "Fotos e vídeos",
        "Integrações com sistemas"
      ],
      "destaque": false
    },
    {
      "id": "profissional",
      "nome": "Profissional",
      "preco": 900,
      "prazo": "10 dias úteis",
      "para": "O modelo adaptado à sua marca, com páginas internas.",
      "inclui": [
        "1 modelo do catálogo, até 5 páginas",
        "Identidade aplicada + variação de paleta própria",
        "Textos revisados e organizados por nós",
        "Blog, portfólio ou catálogo de produtos",
        "Google Analytics e Search Console ligados",
        "Painel simples para você editar textos",
        "3 rodadas de ajustes",
        "30 dias de suporte"
      ],
      "naoInclui": [
        "Produção de fotos",
        "Anúncios pagos"
      ],
      "destaque": true
    },
    {
      "id": "sobmedida",
      "nome": "Sob medida",
      "preco": 1500,
      "prazo": "20 dias úteis",
      "para": "Um mundo visual novo, desenhado só para o seu negócio.",
      "inclui": [
        "Direção de arte própria, feita do zero",
        "Páginas ilimitadas dentro do escopo combinado",
        "Sistema de design documentado (DESIGN.md)",
        "Integrações: CRM, agenda, pagamento, e-mail",
        "Otimização de performance e acessibilidade",
        "Treinamento da sua equipe (2 sessões)",
        "Ajustes ilimitados por 60 dias",
        "90 dias de suporte"
      ],
      "naoInclui": [
        "Mídia paga",
        "Produção audiovisual"
      ],
      "destaque": false
    }
  ],
  "MANUTENCAO": {
    "nome": "Manutenção mensal",
    "opcoes": [
      {
        "nome": "Cuidado",
        "preco": 190,
        "desc": "Hospedagem, backup, atualizações de segurança e 1 hora de ajustes."
      },
      {
        "nome": "Crescimento",
        "preco": 490,
        "desc": "Tudo do Cuidado + 4 horas de ajustes, relatório mensal e melhorias de conversão."
      }
    ]
  },
  "MODELOS": [
    {
      "id": "saas-ia",
      "numero": "01",
      "nome": "Copiloto",
      "nicho": "SaaS de IA",
      "cliente": "Software B2B que vende para times de operação",
      "promessa": "A IA que responde com o contexto da sua empresa.",
      "arquivo": "modelos/01-saas-ia/index.html",
      "rota": "/modelos/saas-ia",
      "preco": 1500,
      "pacote": "Sob medida",
      "paleta": [
        "#08090C",
        "#12141A",
        "#E8EAF0",
        "#3A5BE0"
      ],
      "tipografia": "Cascadia Mono · Segoe UI",
      "mundo": "Sala de controle à meia-noite: superfície obsidiana, um único azul de sinal e o produto funcionando na tela em vez de uma promessa.",
      "destaque": "Terminal vivo: o visitante digita uma pergunta e a resposta é montada com fontes citadas.",
      "secoes": [
        "Prova social em números",
        "Como funciona em 3 passos",
        "Console do produto",
        "Planos em R$",
        "Segurança e LGPD"
      ],
      "melhorPara": [
        "Startup vendendo para empresas",
        "Produto com demo técnica",
        "Time que precisa parecer maduro"
      ]
    },
    {
      "id": "restaurante",
      "numero": "02",
      "nome": "Mesa 12",
      "nicho": "Restaurante autoral",
      "cliente": "Cozinha autoral com menu degustação e reserva",
      "promessa": "Menu que muda com a estação. A casa não muda.",
      "arquivo": "modelos/02-restaurante/index.html",
      "rota": "/modelos/restaurante",
      "preco": 900,
      "pacote": "Profissional",
      "paleta": [
        "#F4EDE2",
        "#1C1A15",
        "#B4552A",
        "#6E7A4A"
      ],
      "tipografia": "Georgia · Lato",
      "mundo": "Papel de menu impresso: creme quente, tinta preta, um barro queimado para o preço e verde-oliva para a estação.",
      "destaque": "Menu degustação que abre prato por prato, com harmonização e preço por pessoa.",
      "secoes": [
        "Menu da estação",
        "Reserva com data e horário",
        "A casa e o chef",
        "Adega",
        "Onde ficamos"
      ],
      "melhorPara": [
        "Restaurante com menu próprio",
        "Bistrô de bairro",
        "Cafeteria de especialidade"
      ]
    },
    {
      "id": "advocacia",
      "numero": "03",
      "nome": "Fontes & Prado",
      "nicho": "Advocacia empresarial",
      "cliente": "Sociedade de advogados com foco em empresas",
      "promessa": "Segurança jurídica para quem decide rápido.",
      "arquivo": "modelos/03-advocacia/index.html",
      "rota": "/modelos/advocacia",
      "preco": 900,
      "pacote": "Profissional",
      "paleta": [
        "#101A2B",
        "#FFFFFF",
        "#9A7B4F",
        "#5A6B82"
      ],
      "tipografia": "Sitka Display · Lato",
      "mundo": "Papel timbrado de sociedade: azul-tinta profundo, branco absoluto, um latão discreto que marca o que é institucional.",
      "destaque": "Áreas de atuação em acordeão que abre o escopo real de cada serviço, com prazo médio.",
      "secoes": [
        "Áreas de atuação",
        "Como conduzimos um caso",
        "Sócios",
        "Publicações",
        "Agendar conversa"
      ],
      "melhorPara": [
        "Advocacia empresarial",
        "Contabilidade e consultoria",
        "Escritório de assessoria regulatória"
      ]
    },
    {
      "id": "arquitetura",
      "numero": "04",
      "nome": "Ateliê Horizonte",
      "nicho": "Arquitetura e interiores",
      "cliente": "Estúdio de arquitetura com obra residencial e comercial",
      "promessa": "Projeto começa no terreno, não no estilo.",
      "arquivo": "modelos/04-arquitetura/index.html",
      "rota": "/modelos/arquitetura",
      "preco": 1500,
      "pacote": "Sob medida",
      "paleta": [
        "#EDEAE4",
        "#16181A",
        "#B0563A",
        "#8C8B84"
      ],
      "tipografia": "Constantia · Corbel",
      "mundo": "Prancheta de obra: papel cinza-claro, traço grafite, um telha queimada para o que está em execução.",
      "destaque": "Projetos em prancha: cada obra abre com ficha técnica, área, ano e estágio.",
      "secoes": [
        "Projetos",
        "Processo em 4 etapas",
        "Escritório",
        "Publicações",
        "Falar sobre um terreno"
      ],
      "melhorPara": [
        "Arquitetura e urbanismo",
        "Design de interiores",
        "Paisagismo e construção"
      ]
    },
    {
      "id": "fitness",
      "numero": "05",
      "nome": "Forja",
      "nicho": "Personal trainer e studio",
      "cliente": "Personal trainer com acompanhamento online e presencial",
      "promessa": "Treino medido. Resultado anotado.",
      "arquivo": "modelos/05-fitness/index.html",
      "rota": "/modelos/fitness",
      "preco": 300,
      "pacote": "Essencial",
      "paleta": [
        "#111214",
        "#F5F3EF",
        "#D6F94B",
        "#7C8188"
      ],
      "tipografia": "Bahnschrift · Lato",
      "mundo": "Quadro de anotações da academia: chão escuro, giz branco, um limão elétrico reservado só para o número que importa.",
      "destaque": "Calculadora de plano que monta a proposta na hora, com frequência e objetivo.",
      "secoes": [
        "Como funciona o acompanhamento",
        "Planos e valores",
        "Calculadora de plano",
        "Resultados anotados",
        "Agendar avaliação"
      ],
      "melhorPara": [
        "Personal trainer",
        "Studio de treino funcional",
        "Consultoria de corrida"
      ]
    },
    {
      "id": "clinica",
      "numero": "06",
      "nome": "Clara",
      "nicho": "Clínica de estética",
      "cliente": "Clínica de dermatologia estética e cuidados de pele",
      "promessa": "Pele cuidada com critério clínico.",
      "arquivo": "modelos/06-clinica/index.html",
      "rota": "/modelos/clinica",
      "preco": 900,
      "pacote": "Profissional",
      "paleta": [
        "#F6F1EC",
        "#2A2622",
        "#8E5F49",
        "#5E6B5F"
      ],
      "tipografia": "Sitka Text · Lato",
      "mundo": "Consultório claro de manhã: linho, madeira clara, um rosé queimado para cuidado e um verde-sálvia para o que é clínico.",
      "destaque": "Agendamento com escolha de procedimento e duração, mostrando o que está incluso.",
      "secoes": [
        "Procedimentos",
        "Como é a avaliação",
        "Antes e depois",
        "Corpo clínico",
        "Agendar horário"
      ],
      "melhorPara": [
        "Dermatologia estética",
        "Odontologia estética",
        "Estúdio de beleza e bem-estar"
      ]
    },
    {
      "id": "imobiliaria",
      "numero": "07",
      "nome": "Costa & Vilela",
      "nicho": "Imobiliária boutique",
      "cliente": "Imobiliária de alto padrão com carteira própria",
      "promessa": "Poucos imóveis. Todos visitáveis hoje.",
      "arquivo": "modelos/07-imobiliaria/index.html",
      "rota": "/modelos/imobiliaria",
      "preco": 900,
      "pacote": "Profissional",
      "paleta": [
        "#F7F4EE",
        "#22262B",
        "#1F4E5F",
        "#C4A47C"
      ],
      "tipografia": "Palatino Linotype · Lato",
      "mundo": "Portfólio de carteira: papel quente, azul-petróleo para o que está disponível, latão para o que é exclusivo.",
      "destaque": "Busca de imóveis com filtros de bairro, faixa de preço e quartos, com resultado imediato.",
      "secoes": [
        "Buscar imóveis",
        "Carteira em destaque",
        "Como conduzimos a visita",
        "Quem somos",
        "Avaliar meu imóvel"
      ],
      "melhorPara": [
        "Imobiliária boutique",
        "Corretor autônomo de alto padrão",
        "Incorporadora pequena"
      ]
    },
    {
      "id": "curso",
      "numero": "08",
      "nome": "Oficina",
      "nicho": "Curso online",
      "cliente": "Escola digital com turmas e certificado",
      "promessa": "Aprender fazendo, com prazo e correção.",
      "arquivo": "modelos/08-curso/index.html",
      "rota": "/modelos/curso",
      "preco": 300,
      "pacote": "Essencial",
      "paleta": [
        "#FBF8F2",
        "#14161B",
        "#3B4FD8",
        "#E9B32C"
      ],
      "tipografia": "Candara · Lato",
      "mundo": "Caderno de oficina: papel morno, caneta azul para o que é conteúdo, amarelo marca-texto para o prazo.",
      "destaque": "Grade do curso com módulos que abrem a ementa e a carga horária real.",
      "secoes": [
        "Grade do curso",
        "Como funcionam as turmas",
        "Instrutores",
        "Perguntas frequentes",
        "Garantir minha vaga"
      ],
      "melhorPara": [
        "Curso online e mentoria",
        "Escola de idiomas ou técnica",
        "Comunidade paga"
      ]
    },
    {
      "id": "moda",
      "numero": "09",
      "nome": "Trama",
      "nicho": "Moda autoral",
      "cliente": "Marca de roupa autoral com produção pequena",
      "promessa": "Peça em pequena tiragem, tecido de verdade.",
      "arquivo": "modelos/09-moda/index.html",
      "rota": "/modelos/moda",
      "preco": 1500,
      "pacote": "Sob medida",
      "paleta": [
        "#FFFFFF",
        "#0D0D0D",
        "#8E2F3C",
        "#B9AE9C"
      ],
      "tipografia": "Franklin Gothic Medium · Lato",
      "mundo": "Lookbook de ateliê: branco de estúdio, preto de passarela, um vinho para o que está esgotando e areia para o tecido.",
      "destaque": "Grade de produtos com tamanhos, tecido e aviso honesto de última peça.",
      "secoes": [
        "Coleção",
        "Peças e tamanhos",
        "Ateliê e tecidos",
        "Cuidados com a peça",
        "Comprar"
      ],
      "melhorPara": [
        "Marca de roupa autoral",
        "Joalheria e acessórios",
        "Design de produto autoral"
      ]
    },
    {
      "id": "estudio",
      "numero": "10",
      "nome": "Ruído",
      "nicho": "Estúdio criativo",
      "cliente": "Agência de branding e identidade visual",
      "promessa": "Marca não se explica. Se reconhece.",
      "arquivo": "modelos/10-estudio/index.html",
      "rota": "/modelos/estudio",
      "preco": 1500,
      "pacote": "Sob medida",
      "paleta": [
        "#0A0A0A",
        "#F2F0EB",
        "#E8541F",
        "#3D3D3D"
      ],
      "tipografia": "Arial Black · Segoe UI",
      "mundo": "Cartaz colado na parede do ateliê: preto absoluto, papel branco, laranja de fita crepe e nada de meia-tinta.",
      "destaque": "Manifesto em cartaz que se monta conforme a rolagem, palavra por palavra.",
      "secoes": [
        "Manifesto",
        "Projetos",
        "Como trabalhamos",
        "Serviços e prazos",
        "Chamar para um projeto"
      ],
      "melhorPara": [
        "Agência de branding",
        "Estúdio de design ou motion",
        "Fotógrafo e diretor de arte"
      ]
    }
  ],
  "PROCESSO": [
    {
      "etapa": "1",
      "nome": "Conversa de 30 minutos",
      "desc": "Entendemos o negócio, o cliente e o que precisa acontecer no site."
    },
    {
      "etapa": "2",
      "nome": "Modelo e proposta",
      "desc": "Você escolhe um modelo do catálogo e recebe o escopo e o valor fechado."
    },
    {
      "etapa": "3",
      "nome": "Conteúdo e identidade",
      "desc": "Você manda textos e fotos; nós aplicamos cor, tipografia e ajustamos o conteúdo."
    },
    {
      "etapa": "4",
      "nome": "Publicação e treino",
      "desc": "Site no ar no seu domínio, com uma sessão gravada de como editar."
    }
  ],
  "PERGUNTAS": [
    {
      "q": "O site fica igual ao modelo do catálogo?",
      "a": "A estrutura e o comportamento, sim. Cor, tipografia, textos e imagens são da sua marca. Se você quiser mudanças de estrutura, isso entra como Sob medida."
    },
    {
      "q": "Eu consigo editar depois?",
      "a": "Nos pacotes Profissional e Sob medida, sim: você recebe um painel simples para trocar textos, preços e fotos. No Essencial, os ajustes passam por nós."
    },
    {
      "q": "Vocês escrevem os textos?",
      "a": "No Profissional e no Sob medida revisamos e organizamos o que você mandar, e escrevemos o que faltar. No Essencial você envia o conteúdo pronto."
    },
    {
      "q": "E as fotos?",
      "a": "Não produzimos fotos, mas indicamos fotógrafos parceiros e adaptamos o layout para o material que você tiver. Nenhum modelo depende de banco de imagens."
    },
    {
      "q": "Quanto tempo leva?",
      "a": "Essencial em 5 dias úteis, Profissional em 10 e Sob medida em 20, contando do recebimento do conteúdo."
    },
    {
      "q": "O site é meu?",
      "a": "Sim. Domínio, hospedagem e código ficam no seu nome. Você pode levar o site para outro fornecedor quando quiser."
    },
    {
      "q": "Funciona no celular e no Google?",
      "a": "Todos os modelos são desenhados primeiro para o celular, com HTML semântico, carregamento rápido e SEO básico configurado."
    },
    {
      "q": "Tem mensalidade?",
      "a": "Só se você quiser manutenção. O site pronto não exige mensalidade: hospedagem e domínio são pagos direto por você, e costumam ficar entre R$ 40 e R$ 90 por mês."
    }
  ],

    /* Formata em real brasileiro, sem centavos. Vem como fonte porque JSON
       não carrega função — é a mesma implementação de app/data/catalogo.ts. */
    brl: (valor        )         =>
  valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
  };
});
