import {
  AGENCIA,
  MANUTENCAO,
  MODELOS,
  PACOTES,
  PERGUNTAS,
  PROCESSO,
  brl
} from '@/app/data/catalogo';
import GradeModelos from './components/GradeModelos';
import FormularioOrcamento from './components/FormularioOrcamento';

/* Estrutura de dados para o Google: cada modelo é um serviço do catálogo. */
const DADOS_ESTRUTURADOS = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Catálogo de modelos de site — Nortear Estúdio',
  itemListElement: MODELOS.map((m, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'Service',
      name: `${m.nome} — ${m.nicho}`,
      description: m.destaque,
      offers: { '@type': 'Offer', price: m.preco, priceCurrency: 'BRL' }
    }
  }))
};

export default function PaginaCatalogo() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(DADOS_ESTRUTURADOS) }}
      />

      <a className="pular" href="#modelos">
        Pular para os modelos
      </a>

      <header className="cabecalho">
        <div className="tela cabecalho__interno">
          <a className="marca" href="#topo">
            <span className="marca__pilha" aria-hidden="true" />
            Nortear Estúdio
            <small>catálogo 2026</small>
          </a>
          <nav className="nav" aria-label="Seções do catálogo">
            <a href="#modelos">Modelos</a>
            <a href="#comparar">Comparar</a>
            <a href="#precos">Preços</a>
            <a href="#processo">Como funciona</a>
            <a href="#duvidas">Dúvidas</a>
          </nav>
          <a className="botao botao--pequeno" href="#orcamento">
            Pedir orçamento
          </a>
        </div>
      </header>

      <main id="topo">
        {/* ============ ABERTURA ============ */}
        <section className="abertura">
          <div className="tela abertura__grade">
            <h1>
              Dez modelos de site prontos. Escolha o seu e a gente veste com a <em>sua marca</em>.
            </h1>
            <div className="abertura__texto">
              <p>
                Cada modelo abaixo é um site inteiro, navegável, feito para um tipo de negócio específico. Você não
                compra um tema: compra a estrutura, o texto e o comportamento já resolvidos — e recebe adaptado com as
                suas cores, sua tipografia e o seu conteúdo.
              </p>
              <div className="abertura__acoes">
                <a className="botao" href="#modelos">
                  Ver os 10 modelos
                </a>
                <a className="botao botao--vazio" href="#precos">
                  Preços e prazos
                </a>
              </div>
              <p className="abertura__nota">
                A partir de R$ 300 · publicação em 5 dias úteis · o site fica no seu nome
              </p>
            </div>
          </div>
        </section>

        <div className="faixa" aria-hidden="true">
          <div className="faixa__trilho">
            {[0, 1].map((volta) => (
              <span key={volta} style={{ display: 'contents' }}>
                <span>10 nichos diferentes</span>
                <span>Preço fechado antes de começar</span>
                <span>Feito primeiro para o celular</span>
                <span>Sem mensalidade obrigatória</span>
                <span>Você fica dono do domínio e do código</span>
              </span>
            ))}
          </div>
        </div>

        {/* ============ MODELOS ============ */}
        <section className="secao" id="modelos">
          <div className="tela">
            <div className="secao__cabeca revelar">
              <h2>Os dez modelos, um por tipo de negócio.</h2>
              <p>
                Abra qualquer um deles e navegue de verdade: os menus abrem, os filtros filtram, os formulários validam.
                O que você vê é o que vai ao ar — só trocando o conteúdo pelo seu.
              </p>
            </div>

            <GradeModelos />

            <p className="abertura__nota" style={{ marginTop: '1.5rem' }}>
              Preços de implantação do modelo, com o seu conteúdo aplicado. Textos e fotos produzidos por nós entram no
              pacote Sob medida.
            </p>
          </div>
        </section>

        {/* ============ COMPARAR ============ */}
        <section className="secao secao--papel2" id="comparar">
          <div className="tela">
            <div className="secao__cabeca revelar">
              <h2>Comparar lado a lado.</h2>
              <p>
                A mesma informação para os dez, sem letra miúda: para quem serve, o que ele resolve e quanto custa para
                colocar no ar.
              </p>
            </div>
            <div className="tabela-envolucro revelar">
              <table>
                <caption>
                  Preços de implantação. Todos os modelos incluem versão para celular, formulário de contato e SEO
                  básico.
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Modelo</th>
                    <th scope="col">Nicho</th>
                    <th scope="col">O que ele resolve</th>
                    <th scope="col">Destaque técnico</th>
                    <th scope="col">Pacote</th>
                    <th scope="col">Implantação</th>
                  </tr>
                </thead>
                <tbody>
                  {MODELOS.map((m) => (
                    <tr key={m.id}>
                      <th scope="row">
                        <a href={m.rota}>{m.nome}</a>
                      </th>
                      <td>{m.nicho}</td>
                      <td>{m.melhorPara.join(' · ')}</td>
                      <td>{m.destaque}</td>
                      <td>{m.pacote}</td>
                      <td className="num">{brl(m.preco)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ============ PREÇOS ============ */}
        <section className="secao" id="precos">
          <div className="tela">
            <div className="secao__cabeca revelar">
              <h2>Três pacotes. O modelo é o mesmo, muda o quanto você quer pronto.</h2>
              <p>
                O valor é fechado antes de começar e não muda no meio do caminho. Escolhido o modelo, você decide só o
                nível de acabamento.
              </p>
            </div>

            <div className="pacotes revelar">
              {PACOTES.map((p) => (
                <article key={p.id} className={`pacote${p.destaque ? ' pacote--destaque' : ''}`}>
                  {p.destaque && <span className="pacote__selo">Mais escolhido</span>}
                  <h3>{p.nome}</h3>
                  <div className="pacote__preco">
                    {brl(p.preco)} <small>implantação</small>
                  </div>
                  <p className="pacote__para">{p.para}</p>
                  <ul className="pacote__lista">
                    {p.inclui.map((i) => (
                      <li key={i}>{i}</li>
                    ))}
                  </ul>
                  <ul className="pacote__lista pacote__lista--nao">
                    {p.naoInclui.map((i) => (
                      <li key={i}>{i}</li>
                    ))}
                  </ul>
                  <p className="pacote__prazo">Prazo: {p.prazo} após o conteúdo</p>
                  <a
                    className={`botao${p.destaque ? '' : ' botao--vazio'}`}
                    href="#orcamento"
                    data-pacote={p.id}
                  >
                    Escolher {p.nome}
                  </a>
                </article>
              ))}
            </div>

            <div className="secao__cabeca revelar" style={{ marginTop: '3.5rem' }}>
              <h2>Manutenção, só se você quiser.</h2>
              <p>
                Nenhum pacote exige mensalidade. Hospedagem e domínio ficam no seu nome, pagos direto por você —
                normalmente entre R$ 40 e R$ 90 por mês. Se preferir não cuidar disso, temos duas opções.
              </p>
            </div>

            <div className="pacotes revelar">
              {MANUTENCAO.opcoes.map((o) => (
                <article key={o.nome} className="pacote">
                  <h3>{o.nome}</h3>
                  <div className="pacote__preco">
                    {brl(o.preco)} <small>por mês</small>
                  </div>
                  <p className="pacote__para">{o.desc}</p>
                  <p className="pacote__prazo">{MANUTENCAO.nome} · cancelamento a qualquer momento</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============ PROCESSO ============ */}
        <section className="secao secao--papel2" id="processo">
          <div className="tela">
            <div className="secao__cabeca revelar">
              <h2>Do primeiro contato ao site no ar.</h2>
              <p>
                Quatro etapas, sem reunião que não decide nada. Você acompanha tudo por WhatsApp e aprova em duas telas.
              </p>
            </div>
            <div className="processo revelar">
              {PROCESSO.map((e) => (
                <article key={e.etapa} className="etapa">
                  <span className="etapa__n">{e.etapa}</span>
                  <h3>{e.nome}</h3>
                  <p>{e.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============ DÚVIDAS ============ */}
        <section className="secao" id="duvidas">
          <div className="tela">
            <div className="secao__cabeca revelar">
              <h2>Perguntas que sempre aparecem.</h2>
              <p>Se a sua não estiver aqui, pergunte direto no orçamento — respondemos no mesmo dia útil.</p>
            </div>
            <div className="perguntas revelar">
              {PERGUNTAS.map((p, i) => (
                <details key={p.q} className="pergunta" open={i === 0}>
                  <summary>{p.q}</summary>
                  <p className="pergunta__resposta">{p.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ============ ORÇAMENTO ============ */}
        <section className="fecho" id="orcamento">
          <div className="tela fecho__grade">
            <div>
              <h2>Diga qual modelo chamou atenção e a gente devolve o escopo.</h2>
              <p>
                Em até um dia útil você recebe o que está incluso, o prazo e o valor fechado. Sem proposta genérica e sem
                compromisso de seguir.
              </p>
            </div>
            <FormularioOrcamento />
          </div>
        </section>
      </main>

      <footer className="rodape">
        <div className="tela rodape__grade">
          <div>
            <strong>Nortear Estúdio</strong>
            <p style={{ marginTop: '0.5rem' }}>Catálogo de modelos de site · edição 2026</p>
          </div>
          <div>
            <strong>Modelos</strong>
            <ul style={{ marginTop: '0.75rem' }}>
              {MODELOS.map((m) => (
                <li key={m.id}>
                  <a href={m.rota}>
                    {m.numero} · {m.nome}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <strong>Catálogo</strong>
            <ul style={{ marginTop: '0.75rem' }}>
              <li>
                <a href="#comparar">Comparar modelos</a>
              </li>
              <li>
                <a href="#precos">Preços e pacotes</a>
              </li>
              <li>
                <a href="#processo">Como funciona</a>
              </li>
              <li>
                <a href="#duvidas">Dúvidas frequentes</a>
              </li>
              <li>
                <a href="#orcamento">Pedir orçamento</a>
              </li>
            </ul>
          </div>
          <p className="rodape__nota">
            {AGENCIA.nota} Todos os nomes de negócio, preços, textos e imagens dos modelos são material de demonstração,
            criados para este catálogo.
          </p>
        </div>
      </footer>
    </>
  );
}
