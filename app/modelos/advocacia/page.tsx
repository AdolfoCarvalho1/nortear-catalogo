import Interacoes from './Interacoes';

/**
 * 03-advocacia — markup convertido do modelo estático.
 *
 * As classes e a estrutura são as originais: o desenho não mudou na migração
 * para Next. O CSS do modelo é importado no layout da rota.
 */
export default function PaginaFontesPrado() {
  return (
    <>
      <Interacoes />
      <a className="pular" href="#abertura">Pular para o conteúdo</a>

      <header className="cabecalho">
        <div className="tela cabecalho__interno">
          <a className="marca" href="#topo">
            <span className="marca__monograma" aria-hidden="true">F&P</span>
            <span className="marca__nome">Fontes & Prado</span>
            <span className="marca__oab">OAB/SP 12.345</span>
          </a>
          <nav className="nav" aria-label="Navegação principal">
            <a href="#areas">Áreas de atuação</a>
            <a href="#honorarios">Honorários</a>
            <a href="#socios">Sócios</a>
            <a href="#publicacoes">Publicações</a>
            <a href="#duvidas">Dúvidas</a>
          </nav>
          <a className="botao botao--pequeno" href="#agendar">Agendar conversa</a>
        </div>
      </header>

      <main id="topo">

        {/* ============ ABERTURA — o timbre da sociedade e um entregável de verdade ============ */}
        <section className="abertura" id="abertura">
          <div className="tela">
            <div className="timbre">
              <p className="timbre__nome">Fontes & Prado <span>sociedade de advogados</span></p>
              <p className="timbre__meta">Revisado em 19.02.2026 · responsável pelo conteúdo: H. Fontes · OAB/SP 12.345 · São Paulo</p>
            </div>

            <div className="abertura__grade">
              <div className="abertura__texto">
                <h1>Segurança jurídica para quem decide rápido.</h1>
                <p className="abertura__posicionamento">Assessoramos diretoria e jurídico interno em decisões de contrato, sociedade e relação de trabalho — com prazo escrito na proposta e um sócio responsável nomeado.</p>
                <div className="abertura__acoes">
                  <a className="botao" href="#agendar">Agendar conversa de 30 minutos</a>
                  <a className="link-seta" href="#areas">Ver as 6 áreas de atuação
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
                  </a>
                </div>
                <p className="credenciais">14 advogados · 6 sócios · desde 2004 · OAB/SP 12.345</p>
              </div>

              <figure className="parecer">
                <div className="parecer__timbre">
                  <span>Parecer 2026/041</span>
                  <span>14 páginas</span>
                </div>
                <div className="parecer__corpo">
                  <p className="parecer__classe">Contratos empresariais · índice §1.1</p>
                  <p className="parecer__ementa">Rescisão de contrato de fornecimento por inadimplemento: o que a empresa pode reter e o que precisa devolver</p>
                  <p className="parecer__contexto">Indústria de embalagem, fornecimento contínuo há 41 meses, pedido de rescisão motivada pela contratante. Do diagnóstico ao protocolo da notificação: 12 dias úteis.</p>

                  <table className="risco">
                    <caption>Quadro de risco da rescisão</caption>
                    <thead>
                      <tr><th scope="col">Cláusula</th><th scope="col">Exposição</th><th scope="col">Recomendação</th></tr>
                    </thead>
                    <tbody>
                      <tr><td>7.2 · multa por rescisão</td><td className="risco--alto">R$ 480.000</td><td>questionar a base de cálculo</td></tr>
                      <tr><td>9.1 · retenção de pagamento</td><td className="risco--medio">R$ 62.400</td><td>reter só o incontroverso</td></tr>
                      <tr><td>11.4 · renovação automática</td><td className="risco--baixo">sem exposição</td><td>denunciar em 60 dias</td></tr>
                    </tbody>
                  </table>
                </div>
                <figcaption className="parecer__pe">
                  <span>responsável H. Fontes</span>
                  <span>revisão R. Prado</span>
                  <span>12 dias úteis</span>
                </figcaption>
              </figure>
            </div>

            <p className="abertura__nota">Exemplo de entregável. Cliente, valores e cláusulas alterados; o formato e o prazo são os reais.</p>
          </div>
        </section>

        {/* ============ APURAÇÃO — números do escritório com unidade e período ============ */}
        <section className="numeros" aria-label="Apuração da sociedade">
          <div className="tela">
            <ul className="numeros__grade">
              <li className="numero">
                <b>1.240</b>
                <span>contratos revisados em 2025</span>
                <small>pico em novembro: 168 · menor mês: 71</small>
              </li>
              <li className="numero">
                <b>4 h úteis</b>
                <span>prazo médio da primeira resposta</span>
                <small>medido em 312 solicitações de clientes ativos · jan. 2026</small>
              </li>
              <li className="numero">
                <b>6</b>
                <span>sócios, de 14 advogados</span>
                <small>4 deles à frente das áreas do índice §1</small>
              </li>
              <li className="numero">
                <b>2004</b>
                <span>ano de fundação da sociedade</span>
                <small>22 anos na mesma sede, no Itaim Bibi</small>
              </li>
            </ul>
          </div>
        </section>

        {/* ============ §1 ÁREAS DE ATUAÇÃO — índice em acordeão ============ */}
        <section className="secao" id="areas" aria-labelledby="areas-titulo">
          <div className="tela secao__interno">
            <div className="rail">
              <p className="rail__num"><span aria-hidden="true">§1</span><span className="oculto">Seção 1 — Áreas de atuação</span></p>
              <p className="rail__meta"><span>6 áreas · atualizado em 12.02.2026</span><span>resp. H. Fontes e R. Prado</span></p>
            </div>

            <div className="secao__corpo">
              <h2 id="areas-titulo">O índice do que fazemos — e o que fica de fora.</h2>
              <p className="secao__linha">Cada área abre o escopo real, o prazo médio e o entregável que você recebe. O campo “não fazemos isso” é o mais lido por quem nos procura: quase sempre é ali que a demanda se decide.</p>

              <div className="filtro" role="group" aria-label="Filtrar áreas por tipo de demanda">
                <button type="button" className="filtro__botao" data-filtro="todos" aria-pressed="true">Todos <span className="filtro__conta">6</span></button>
                <button type="button" className="filtro__botao" data-filtro="contrato" aria-pressed="false">Contrato <span className="filtro__conta">4</span></button>
                <button type="button" className="filtro__botao" data-filtro="contencioso" aria-pressed="false">Contencioso <span className="filtro__conta">3</span></button>
                <button type="button" className="filtro__botao" data-filtro="regulatorio" aria-pressed="false">Regulatório <span className="filtro__conta">1</span></button>
                <p className="filtro__estado" id="areas-estado" role="status" aria-live="polite">Mostrando 6 de 6 áreas.</p>
              </div>

              <ol className="indice" id="indice-areas">

                {/* 1.1 */}
                <li className="area" data-tipos="contrato">
                  <h3 className="area__titulo">
                    <button type="button" className="area__botao" id="botao-a1" aria-expanded="true" aria-controls="painel-a1">
                      <span className="area__num">1.1</span>
                      <span className="area__nome">Contratos empresariais</span>
                      <span className="area__prazo">revisão em 5 dias úteis</span>
                      <span className="area__selos"><span className="area__selo">Contrato</span></span>
                      <svg className="area__seta" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
                    </button>
                  </h3>
                  <div className="area__painel" id="painel-a1" role="region" aria-labelledby="botao-a1" data-aberto="true">
                    <div className="escopo">
                      <div className="escopo__coluna">
                        <p className="rotulo">O que entra</p>
                        <ul className="lista lista--entra">
                          <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l5 5L20 6" /></svg>Redação e revisão de fornecimento, distribuição, prestação de serviços e locação comercial</li>
                          <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l5 5L20 6" /></svg>Contrato-padrão da empresa e manual de contratação para o time comercial</li>
                          <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l5 5L20 6" /></svg>Renegociação de cláusula econômica, reajuste, multa e garantia</li>
                          <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l5 5L20 6" /></svg>Notificação extrajudicial e rescisão motivada, com memória de cálculo</li>
                        </ul>
                      </div>
                      <div className="escopo__coluna">
                        <p className="rotulo">O que não entra</p>
                        <ul className="lista lista--nao">
                          <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" /></svg>Contrato de consumo com pessoa física (CDC) — não é a nossa mesa</li>
                          <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" /></svg>Contrato individual de trabalho, que vai para o §1.3</li>
                          <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" /></svg>Locação residencial e contrato de compra e venda de imóvel</li>
                        </ul>
                      </div>
                    </div>
                    <dl className="ficha">
                      <div><dt>Prazo médio</dt><dd>5 dias úteis para contrato-padrão · 12 dias úteis para fornecimento com anexos</dd></div>
                      <div><dt>Entregável</dt><dd>revisão de contrato-padrão em 5 dias úteis, no arquivo .docx com marcas de revisão e um quadro de risco de uma página</dd></div>
                      <div><dt>Responsável</dt><dd>Helena Fontes · sócia · desde 2004</dd></div>
                    </dl>
                    <p className="honesto"><b>Não fazemos isso:</b> não assumimos a negociação por telefone com a outra parte em contrato abaixo de R$ 500 mil. Nesses casos entregamos o roteiro de negociação para o seu time conduzir.</p>
                    <p className="escopo__acao"><button type="button" className="botao botao--vazio botao--pequeno" data-triar="contrato">Levar uma demanda de contrato para a triagem</button></p>
                  </div>
                </li>

                {/* 1.2 */}
                <li className="area" data-tipos="contrato">
                  <h3 className="area__titulo">
                    <button type="button" className="area__botao" id="botao-a2" aria-expanded="false" aria-controls="painel-a2">
                      <span className="area__num">1.2</span>
                      <span className="area__nome">Societário e M&A</span>
                      <span className="area__prazo">acordo de sócios em 10 dias úteis</span>
                      <span className="area__selos"><span className="area__selo">Contrato</span></span>
                      <svg className="area__seta" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
                    </button>
                  </h3>
                  <div className="area__painel" id="painel-a2" role="region" aria-labelledby="botao-a2">
                    <div className="escopo">
                      <div className="escopo__coluna">
                        <p className="rotulo">O que entra</p>
                        <ul className="lista lista--entra">
                          <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l5 5L20 6" /></svg>Acordo de sócios, entrada e saída de sócio, apuração de haveres</li>
                          <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l5 5L20 6" /></svg>Aumento de capital, emissão de quotas e reorganização societária</li>
                          <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l5 5L20 6" /></svg>Due diligence de aquisição de participação até R$ 80 milhões</li>
                          <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l5 5L20 6" /></svg>Governança, conselho consultivo e ata de assembleia com efeito prático</li>
                        </ul>
                      </div>
                      <div className="escopo__coluna">
                        <p className="rotulo">O que não entra</p>
                        <ul className="lista lista--nao">
                          <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" /></svg>Abertura, baixa e alteração de rotina na Junta Comercial</li>
                          <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" /></svg>Holding patrimonial de pessoa física e planejamento sucessório</li>
                          <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" /></svg>Emissão de laudo de avaliação de empresa (valuation)</li>
                        </ul>
                      </div>
                    </div>
                    <dl className="ficha">
                      <div><dt>Prazo médio</dt><dd>10 dias úteis para acordo de sócios · 4 a 8 semanas para due diligence com data room completo</dd></div>
                      <div><dt>Entregável</dt><dd>acordo de sócios com cláusula de saída e apuração de haveres em 10 dias úteis, mais um quadro comparativo do que muda para cada sócio</dd></div>
                      <div><dt>Responsável</dt><dd>Helena Fontes · sócia · desde 2004</dd></div>
                    </dl>
                    <p className="honesto"><b>Não fazemos isso:</b> não emitimos valuation. Trabalhamos sobre o laudo de terceiro ou indicamos três casas que fazem — e dizemos, por escrito, qual premissa do laudo nos parece frágil.</p>
                    <p className="escopo__acao"><button type="button" className="botao botao--vazio botao--pequeno" data-triar="contrato">Levar uma demanda societária para a triagem</button></p>
                  </div>
                </li>

                {/* 1.3 */}
                <li className="area" data-tipos="contrato contencioso">
                  <h3 className="area__titulo">
                    <button type="button" className="area__botao" id="botao-a3" aria-expanded="false" aria-controls="painel-a3">
                      <span className="area__num">1.3</span>
                      <span className="area__nome">Trabalhista empresarial</span>
                      <span className="area__prazo">defesa em 5 dias úteis da citação</span>
                      <span className="area__selos"><span className="area__selo">Contrato</span><span className="area__selo">Contencioso</span></span>
                      <svg className="area__seta" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
                    </button>
                  </h3>
                  <div className="area__painel" id="painel-a3" role="region" aria-labelledby="botao-a3">
                    <div className="escopo">
                      <div className="escopo__coluna">
                        <p className="rotulo">O que entra</p>
                        <ul className="lista lista--entra">
                          <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l5 5L20 6" /></svg>Auditoria de rotina trabalhista: jornada, banco de horas, home office e intervalo</li>
                          <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l5 5L20 6" /></svg>Terceirização e risco de pejotização em contrato de prestação de serviços</li>
                          <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l5 5L20 6" /></svg>Convenção e acordo coletivo, com o sindicato patronal da categoria</li>
                          <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l5 5L20 6" /></svg>Defesa em reclamação trabalhista, acordo em execução e cálculo de exposição</li>
                        </ul>
                      </div>
                      <div className="escopo__coluna">
                        <p className="rotulo">O que não entra</p>
                        <ul className="lista lista--nao">
                          <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" /></svg>Folha, eSocial e recolhimento de encargos — isso é da contabilidade</li>
                          <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" /></svg>Reclamação de empregado contra empresa que não é nossa cliente</li>
                          <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" /></svg>Ação de servidor público e processo administrativo disciplinar</li>
                        </ul>
                      </div>
                    </div>
                    <dl className="ficha">
                      <div><dt>Prazo médio</dt><dd>7 dias úteis para auditoria de uma unidade · 5 dias úteis para a defesa, contados da citação</dd></div>
                      <div><dt>Entregável</dt><dd>parecer de 12 a 20 páginas com matriz de risco por função e o valor estimado de exposição, atualizado com a jurisprudência do TST do trimestre</dd></div>
                      <div><dt>Responsável</dt><dd>Camila Sarmento · sócia · desde 2011</dd></div>
                    </dl>
                    <p className="honesto"><b>Não fazemos isso:</b> não calculamos folha nem assinamos eSocial. Dizemos se a prática que está na folha cria passivo — e o que mudar na rotina antes do próximo trimestre.</p>
                    <p className="escopo__acao"><button type="button" className="botao botao--vazio botao--pequeno" data-triar="contencioso">Levar uma demanda trabalhista para a triagem</button></p>
                  </div>
                </li>

                {/* 1.4 */}
                <li className="area" data-tipos="regulatorio">
                  <h3 className="area__titulo">
                    <button type="button" className="area__botao" id="botao-a4" aria-expanded="false" aria-controls="painel-a4">
                      <span className="area__num">1.4</span>
                      <span className="area__nome">Regulatório e compliance</span>
                      <span className="area__prazo">consulta pública em 15 dias úteis</span>
                      <span className="area__selos"><span className="area__selo">Regulatório</span></span>
                      <svg className="area__seta" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
                    </button>
                  </h3>
                  <div className="area__painel" id="painel-a4" role="region" aria-labelledby="botao-a4">
                    <div className="escopo">
                      <div className="escopo__coluna">
                        <p className="rotulo">O que entra</p>
                        <ul className="lista lista--entra">
                          <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l5 5L20 6" /></svg>Leitura de consulta pública e contribuição formal protocolada na agência</li>
                          <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l5 5L20 6" /></svg>Licença, autorização e renovação junto a ANEEL, ANP, ANTT e ANS</li>
                          <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l5 5L20 6" /></svg>Programa de integridade, canal de denúncia e treinamento da diretoria</li>
                          <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l5 5L20 6" /></svg>Contratação pública pela Lei 14.133 e LGPD na operação, incluindo resposta a incidente</li>
                        </ul>
                      </div>
                      <div className="escopo__coluna">
                        <p className="rotulo">O que não entra</p>
                        <ul className="lista lista--nao">
                          <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" /></svg>Defesa criminal e processo administrativo disciplinar de servidor</li>
                          <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" /></svg>Certificação ISO: apoiamos o mapeamento, não emitimos certificado</li>
                          <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" /></svg>Representação de associação e atuação legislativa</li>
                        </ul>
                      </div>
                    </div>
                    <dl className="ficha">
                      <div><dt>Prazo médio</dt><dd>15 dias úteis para uma contribuição em consulta pública · 20 dias úteis para diagnóstico de integridade de uma operação</dd></div>
                      <div><dt>Entregável</dt><dd>contribuição formal protocolada, com a justificativa técnica anexada, e um resumo de 2 páginas do que a decisão final muda na sua operação</dd></div>
                      <div><dt>Responsável</dt><dd>Otávio Bittencourt · sócio · desde 2014</dd></div>
                    </dl>
                    <p className="honesto"><b>Não fazemos isso:</b> não prometemos resultado em agência reguladora e não mantemos relação que dependa de indicação política. Quando o caso pede trânsito em Brasília, dizemos que não é o nosso terreno.</p>
                    <p className="escopo__acao"><button type="button" className="botao botao--vazio botao--pequeno" data-triar="regulatorio">Levar uma demanda regulatória para a triagem</button></p>
                  </div>
                </li>

                {/* 1.5 */}
                <li className="area" data-tipos="contrato contencioso">
                  <h3 className="area__titulo">
                    <button type="button" className="area__botao" id="botao-a5" aria-expanded="false" aria-controls="painel-a5">
                      <span className="area__num">1.5</span>
                      <span className="area__nome">Recuperação de crédito</span>
                      <span className="area__prazo">execução em 12 dias úteis</span>
                      <span className="area__selos"><span className="area__selo">Contrato</span><span className="area__selo">Contencioso</span></span>
                      <svg className="area__seta" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
                    </button>
                  </h3>
                  <div className="area__painel" id="painel-a5" role="region" aria-labelledby="botao-a5">
                    <div className="escopo">
                      <div className="escopo__coluna">
                        <p className="rotulo">O que entra</p>
                        <ul className="lista lista--entra">
                          <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l5 5L20 6" /></svg>Cobrança extrajudicial e judicial de título vencido e líquido</li>
                          <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l5 5L20 6" /></svg>Execução, monitória e medida de indisponibilidade de bens</li>
                          <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l5 5L20 6" /></svg>Habilitação de crédito em recuperação judicial do devedor</li>
                          <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l5 5L20 6" /></svg>Repactuação com garantia real, aval ou cessão fiduciária</li>
                        </ul>
                      </div>
                      <div className="escopo__coluna">
                        <p className="rotulo">O que não entra</p>
                        <ul className="lista lista--nao">
                          <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" /></svg>Carteira abaixo de R$ 40.000: o custo não fecha e nós avisamos antes</li>
                          <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" /></svg>Cobrança de pessoa física por dívida de consumo</li>
                          <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" /></svg>Compra de carteira de crédito e cobrança por conta própria</li>
                        </ul>
                      </div>
                    </div>
                    <dl className="ficha">
                      <div><dt>Prazo médio</dt><dd>3 dias úteis para a notificação extrajudicial · 12 dias úteis para ajuizar a execução com título líquido</dd></div>
                      <div><dt>Entregável</dt><dd>relatório de recuperabilidade da carteira — quanto dá para recuperar, de quem e em quanto tempo — antes de qualquer proposta de honorário</dd></div>
                      <div><dt>Responsável</dt><dd>Rafael Prado · sócio · desde 2004</dd></div>
                    </dl>
                    <p className="honesto"><b>Não fazemos isso:</b> não cobramos percentual sobre crédito sem garantia e sem patrimônio localizável. Se o relatório mostrar recuperação improvável, você lê isso antes de contratar.</p>
                    <p className="escopo__acao"><button type="button" className="botao botao--vazio botao--pequeno" data-triar="contencioso">Levar uma cobrança para a triagem</button></p>
                  </div>
                </li>

                {/* 1.6 */}
                <li className="area" data-tipos="contencioso">
                  <h3 className="area__titulo">
                    <button type="button" className="area__botao" id="botao-a6" aria-expanded="false" aria-controls="painel-a6">
                      <span className="area__num">1.6</span>
                      <span className="area__nome">Contencioso estratégico</span>
                      <span className="area__prazo">memorando de cenários em 20 dias úteis</span>
                      <span className="area__selos"><span className="area__selo">Contencioso</span></span>
                      <svg className="area__seta" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
                    </button>
                  </h3>
                  <div className="area__painel" id="painel-a6" role="region" aria-labelledby="botao-a6">
                    <div className="escopo">
                      <div className="escopo__coluna">
                        <p className="rotulo">O que entra</p>
                        <ul className="lista lista--entra">
                          <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l5 5L20 6" /></svg>Disputa contratual de valor relevante, com memória de cálculo</li>
                          <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l5 5L20 6" /></svg>Arbitragem em câmara (CAM-CCBC e CAMARB) e escolha de árbitro</li>
                          <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l5 5L20 6" /></svg>Medida de urgência antes da resposta do réu</li>
                          <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l5 5L20 6" /></svg>Disputa entre sócios com pedido de exclusão e responsabilidade de administrador</li>
                        </ul>
                      </div>
                      <div className="escopo__coluna">
                        <p className="rotulo">O que não entra</p>
                        <ul className="lista lista--nao">
                          <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" /></svg>Causa até R$ 150.000: indicamos um parceiro de atuação local</li>
                          <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" /></svg>Família, sucessões e criminal</li>
                          <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" /></svg>Contencioso tributário, que não está neste índice</li>
                        </ul>
                      </div>
                    </div>
                    <dl className="ficha">
                      <div><dt>Prazo médio</dt><dd>5 dias úteis para a medida de urgência · 20 dias úteis para a petição inicial com memória de cálculo</dd></div>
                      <div><dt>Entregável</dt><dd>memorando de estratégia com três cenários, o custo estimado de cada um e o que acontece se a empresa não entrar com a ação</dd></div>
                      <div><dt>Responsável</dt><dd>Rafael Prado · sócio · desde 2004</dd></div>
                    </dl>
                    <p className="honesto"><b>Não fazemos isso:</b> não entramos em causa que não sustentamos em três cenários. Se a leitura for de risco alto e retorno baixo, recomendamos acordo mesmo perdendo o honorário do processo.</p>
                    <p className="escopo__acao"><button type="button" className="botao botao--vazio botao--pequeno" data-triar="contencioso">Levar uma disputa para a triagem</button></p>
                  </div>
                </li>

              </ol>
              <p className="vazio" id="areas-vazio" hidden>Nenhuma área corresponde a esse tipo de demanda. Fale com a secretaria pelo telefone (11) 3555-4180.</p>
            </div>
          </div>
        </section>

        {/* ============ §2 TRIAGEM DE CASO — três passos com protocolo ============ */}
        <section className="secao secao--papel2" id="triagem" aria-labelledby="triagem-titulo">
          <div className="tela secao__interno">
            <div className="rail">
              <p className="rail__num"><span aria-hidden="true">§2</span><span className="oculto">Seção 2 — Triagem de caso</span></p>
              <p className="rail__meta"><span>triagem em 3 passos</span><span>protocolo emitido na hora</span><span>resp. secretaria geral</span></p>
            </div>

            <div className="secao__corpo">
              <h2 id="triagem-titulo">Faça a triagem e receba protocolo, prazo e área responsável.</h2>
              <p className="secao__linha">Três passos, dois minutos. A triagem não substitui a conversa: ela define a área responsável, o prazo de resposta e o que precisamos receber antes de falar com você.</p>

              <div className="triagem">
                <div className="triagem__formulario">
                  <div className="progresso">
                    <p className="progresso__conta" role="status" aria-live="polite"><span id="passo-conta">Passo 1 de 3</span> · <span id="passo-nome">tipo de demanda</span></p>
                    <div className="progresso__trilho" aria-hidden="true"><i id="progresso-barra"></i></div>
                    <ol className="progresso__trilha" id="trilha">
                      <li data-marco="1" aria-current="step">tipo de demanda</li>
                      <li data-marco="2">porte e prazo</li>
                      <li data-marco="3">contato</li>
                    </ol>
                  </div>

                  <form id="form-triagem" noValidate>
                    <fieldset className="painel" data-painel="1">
                      <legend>Que tipo de demanda você tem?</legend>
                      <div className="opcoes">
                        <label className="opcao">
                          <input type="radio" name="demanda" value="contrato" />
                          <span className="opcao__corpo">
                            <span className="opcao__marca" aria-hidden="true"></span>
                            <span className="opcao__texto"><b>Contrato</b><small>fornecimento, prestação de serviços, locação comercial, distribuição, aditivo, renegociação de cláusula</small></span>
                          </span>
                        </label>
                        <label className="opcao">
                          <input type="radio" name="demanda" value="contencioso" />
                          <span className="opcao__corpo">
                            <span className="opcao__marca" aria-hidden="true"></span>
                            <span className="opcao__texto"><b>Contencioso</b><small>disputa contratual, cobrança de título vencido, reclamação trabalhista, arbitragem, medida de urgência</small></span>
                          </span>
                        </label>
                        <label className="opcao">
                          <input type="radio" name="demanda" value="regulatorio" />
                          <span className="opcao__corpo">
                            <span className="opcao__marca" aria-hidden="true"></span>
                            <span className="opcao__texto"><b>Regulatório</b><small>licença e autorização em agência, consulta pública, programa de integridade, contratação pública, LGPD</small></span>
                          </span>
                        </label>
                        <label className="opcao">
                          <input type="radio" name="demanda" value="orientacao" />
                          <span className="opcao__corpo">
                            <span className="opcao__marca" aria-hidden="true"></span>
                            <span className="opcao__texto"><b>Ainda não sei</b><small>preciso de orientação para enquadrar o problema antes de contratar qualquer coisa</small></span>
                          </span>
                        </label>
                      </div>
                      <p className="erro" data-erro="demanda" role="alert"></p>
                      <div className="painel__acoes">
                        <button type="button" className="botao" data-avancar="2">Ver porte e prazo</button>
                      </div>
                    </fieldset>

                    <fieldset className="painel" data-painel="2" hidden>
                      <legend>Qual o porte da empresa e o prazo que você tem?</legend>
                      <div className="campo-grupo">
                        <p className="rotulo" id="rotulo-porte">Porte da empresa</p>
                        <div className="opcoes opcoes--compactas" role="group" aria-labelledby="rotulo-porte">
                          <label className="opcao">
                            <input type="radio" name="porte" value="pequena" />
                            <span className="opcao__corpo">
                              <span className="opcao__marca" aria-hidden="true"></span>
                              <span className="opcao__texto"><b>MEI ou pequena</b><small>até R$ 4,8 milhões de faturamento</small></span>
                            </span>
                          </label>
                          <label className="opcao">
                            <input type="radio" name="porte" value="media" />
                            <span className="opcao__corpo">
                              <span className="opcao__marca" aria-hidden="true"></span>
                              <span className="opcao__texto"><b>Média</b><small>de R$ 4,8 milhões a R$ 300 milhões</small></span>
                            </span>
                          </label>
                          <label className="opcao">
                            <input type="radio" name="porte" value="grande" />
                            <span className="opcao__corpo">
                              <span className="opcao__marca" aria-hidden="true"></span>
                              <span className="opcao__texto"><b>Grande</b><small>acima de R$ 300 milhões, com jurídico interno</small></span>
                            </span>
                          </label>
                        </div>
                      </div>

                      <div className="campo-grupo">
                        <p className="rotulo" id="rotulo-urgencia">Prazo</p>
                        <div className="opcoes opcoes--compactas" role="group" aria-labelledby="rotulo-urgencia">
                          <label className="opcao">
                            <input type="radio" name="urgencia" value="5d" />
                            <span className="opcao__corpo">
                              <span className="opcao__marca" aria-hidden="true"></span>
                              <span className="opcao__texto"><b>Tenho prazo em até 5 dias</b><small>audiência, notificação recebida, prazo contratual correndo</small></span>
                            </span>
                          </label>
                          <label className="opcao">
                            <input type="radio" name="urgencia" value="30d" />
                            <span className="opcao__corpo">
                              <span className="opcao__marca" aria-hidden="true"></span>
                              <span className="opcao__texto"><b>Até 30 dias</b><small>assembleia marcada, renovação de contrato, decisão de diretoria</small></span>
                            </span>
                          </label>
                          <label className="opcao">
                            <input type="radio" name="urgencia" value="sem" />
                            <span className="opcao__corpo">
                              <span className="opcao__marca" aria-hidden="true"></span>
                              <span className="opcao__texto"><b>Sem prazo definido</b><small>quero organizar antes que vire problema</small></span>
                            </span>
                          </label>
                        </div>
                      </div>

                      <p className="erro" data-erro="passo2" role="alert"></p>
                      <div className="aviso" id="aviso-triagem" role="status" aria-live="polite" hidden></div>

                      <div className="painel__acoes">
                        <button type="button" className="botao botao--vazio" data-voltar="1">Voltar</button>
                        <button type="button" className="botao" data-avancar="3">Ver o contato</button>
                      </div>
                    </fieldset>

                    <fieldset className="painel" data-painel="3" hidden>
                      <legend>Quem fala em nome da empresa?</legend>
                      <div className="campos">
                        <div className="campo" data-campo="nome">
                          <label htmlFor="t-nome">Nome e sobrenome</label>
                          <input id="t-nome" name="nome" type="text" autoComplete="name" placeholder="Renata Villela" aria-describedby="erro-nome" />
                          <span className="erro" id="erro-nome" data-erro="nome"></span>
                        </div>
                        <div className="campo" data-campo="empresa">
                          <label htmlFor="t-empresa">Empresa</label>
                          <input id="t-empresa" name="empresa" type="text" autoComplete="organization" placeholder="Metalúrgica Auriverde" aria-describedby="erro-empresa" />
                          <span className="erro" id="erro-empresa" data-erro="empresa"></span>
                        </div>
                        <div className="campo" data-campo="email">
                          <label htmlFor="t-email">E-mail corporativo</label>
                          <input id="t-email" name="email" type="email" autoComplete="email" placeholder="renata@auriverde.com.br" aria-describedby="erro-email aviso-email" />
                          <span className="erro" id="erro-email" data-erro="email"></span>
                          <span className="aviso-campo" id="aviso-email" role="status" aria-live="polite"></span>
                        </div>
                        <div className="campo" data-campo="telefone">
                          <label htmlFor="t-telefone">Telefone com DDD</label>
                          <input id="t-telefone" name="telefone" type="tel" inputMode="tel" autoComplete="tel" placeholder="(11) 98877-1042" aria-describedby="erro-telefone" />
                          <span className="erro" id="erro-telefone" data-erro="telefone"></span>
                        </div>
                      </div>
                      <div className="campo" data-campo="descricao">
                        <label htmlFor="t-descricao">O que está acontecendo</label>
                        <textarea id="t-descricao" name="descricao" rows={4} placeholder="Descreva em duas linhas o que você precisa decidir: contrato, prazo, valor envolvido, o que já foi feito." aria-describedby="erro-descricao contador-descricao"></textarea>
                        <span className="contador" id="contador-descricao">0 de 20 caracteres</span>
                        <span className="erro" id="erro-descricao" data-erro="descricao"></span>
                      </div>

                      <div className="painel__acoes">
                        <button type="button" className="botao botao--vazio" data-voltar="2">Voltar</button>
                        <button type="submit" className="botao" id="btn-triagem">Gerar protocolo</button>
                      </div>
                    </fieldset>
                  </form>
                </div>

                <aside className="protocolo" id="protocolo" aria-live="polite" tabIndex={-1} aria-label="Resultado da triagem">
                  <p className="rotulo">Protocolo de triagem</p>
                  <p className="protocolo__vazio">Nenhuma triagem em andamento. Ao concluir o passo 3, este papel recebe o número do protocolo, o prazo de resposta e a área responsável sugerida.</p>
                  <dl className="protocolo__resumo">
                    <div><dt>Demanda</dt><dd>—</dd></div>
                    <div><dt>Porte</dt><dd>—</dd></div>
                    <div><dt>Prazo</dt><dd>—</dd></div>
                    <div><dt>Contato</dt><dd>—</dd></div>
                  </dl>
                  <p className="protocolo__area">Área responsável sugerida: —</p>
                </aside>
              </div>
            </div>
          </div>
        </section>

        {/* ============ §3 COMO CONDUZIMOS UM CASO ============ */}
        <section className="secao" id="conducao" aria-labelledby="conducao-titulo">
          <div className="tela secao__interno">
            <div className="rail">
              <p className="rail__num"><span aria-hidden="true">§3</span><span className="oculto">Seção 3 — Como conduzimos um caso</span></p>
              <p className="rail__meta"><span>5 etapas · prazos em dias úteis</span><span>resp. sócio indicado na proposta</span></p>
            </div>

            <div className="secao__corpo">
              <h2 id="conducao-titulo">Cinco etapas, cada uma com prazo e entrega escritos.</h2>
              <p className="secao__linha">Você sabe o que recebe em cada etapa antes de ela começar. Se em qualquer ponto concluirmos que não somos o escritório certo, dizemos isso e devolvemos o que foi pago pela etapa não executada.</p>

              <ol className="etapas">
                <li className="etapa">
                  <p className="etapa__num" aria-hidden="true">1</p>
                  <div className="etapa__corpo">
                    <h3>Conversa de 30 minutos com o sócio da área</h3>
                    <p>Não é reunião de apresentação: você descreve a decisão e o sócio diz se ela é jurídica, comercial ou das duas coisas. Sem honorário e sem compromisso.</p>
                    <dl className="ficha">
                      <div><dt>Prazo</dt><dd>agendada em até 1 dia útil · 30 minutos</dd></div>
                      <div><dt>Você recebe</dt><dd>nota de viabilidade de 1 página, com a área responsável e a faixa de honorário, em até 4 horas úteis depois da conversa</dd></div>
                    </dl>
                  </div>
                </li>
                <li className="etapa">
                  <p className="etapa__num" aria-hidden="true">2</p>
                  <div className="etapa__corpo">
                    <h3>Diagnóstico do caso</h3>
                    <p>Lemos o que existe — contrato, e-mail, ata, notificação — e listamos o que falta. É aqui que aparecem os documentos que a empresa não sabia que precisava ter.</p>
                    <dl className="ficha">
                      <div><dt>Prazo</dt><dd>3 a 5 dias úteis</dd></div>
                      <div><dt>Você recebe</dt><dd>memorando de escopo: o que está em jogo, o que falta, os riscos e as alternativas, com o honorário fechado ao final</dd></div>
                    </dl>
                  </div>
                </li>
                <li className="etapa">
                  <p className="etapa__num" aria-hidden="true">3</p>
                  <div className="etapa__corpo">
                    <h3>Proposta de honorários e contrato</h3>
                    <p>A proposta traz o que está fora do escopo em destaque, não em nota de rodapé. Honorário fechado por etapa; despesa de terceiro com aprovação prévia.</p>
                    <dl className="ficha">
                      <div><dt>Prazo</dt><dd>2 dias úteis depois do diagnóstico</dd></div>
                      <div><dt>Você recebe</dt><dd>proposta assinada pelo sócio responsável, com o que não está incluído destacado e a forma de pagamento</dd></div>
                    </dl>
                  </div>
                </li>
                <li className="etapa">
                  <p className="etapa__num" aria-hidden="true">4</p>
                  <div className="etapa__corpo">
                    <h3>Execução com ponto de controle</h3>
                    <p>O caso corre no prazo da área do §1. O que trava quase sempre não é o tribunal: é documento que falta do lado do cliente, e isso aparece no relatório.</p>
                    <dl className="ficha">
                      <div><dt>Prazo</dt><dd>conforme a área · relatório a cada 30 dias</dd></div>
                      <div><dt>Você recebe</dt><dd>relatório com o que foi protocolado, o que está pendente do seu lado e o próximo passo datado</dd></div>
                    </dl>
                  </div>
                </li>
                <li className="etapa">
                  <p className="etapa__num" aria-hidden="true">5</p>
                  <div className="etapa__corpo">
                    <h3>Encerramento e memória do caso</h3>
                    <p>O caso fecha com o que a empresa deve mudar na rotina para não repetir o problema. É a parte que mais reduz o honorário do ano seguinte.</p>
                    <dl className="ficha">
                      <div><dt>Prazo</dt><dd>10 dias úteis após a decisão final</dd></div>
                      <div><dt>Você recebe</dt><dd>dossiê do caso com peças, decisões e a recomendação de rotina, e uma reunião de 1 hora com a diretoria</dd></div>
                    </dl>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </section>

        {/* ============ §4 HONORÁRIOS ============ */}
        <section className="secao secao--papel2" id="honorarios" aria-labelledby="honorarios-titulo">
          <div className="tela secao__interno">
            <div className="rail">
              <p className="rail__num"><span aria-hidden="true">§4</span><span className="oculto">Seção 4 — Honorários</span></p>
              <p className="rail__meta"><span>tabela de referência · janeiro de 2026</span><span>sem custas, taxas e despesas</span></p>
            </div>

            <div className="secao__corpo">
              <h2 id="honorarios-titulo">Tabela de honorários, publicada como ela é.</h2>
              <p className="secao__linha">Valores de referência para 2026, praticados dentro da faixa da tabela da OAB/SP. Honorário fechado é fechado: se o caso crescer por fato novo, emitimos aditivo antes de continuar — nunca depois.</p>

              <ul className="honorarios">
                <li className="honorario">
                  <div className="honorario__nome">
                    <b>Consulta de 30 minutos com o sócio da área</b>
                    <span>primeira conversa, com nota de viabilidade de 1 página em até 4 horas úteis</span>
                  </div>
                  <p className="honorario__valor honorario__valor--isento">sem honorário</p>
                </li>
                <li className="honorario">
                  <div className="honorario__nome">
                    <b>Parecer pontual sobre um caso</b>
                    <span>12 a 20 páginas · 10 dias úteis · inclui reunião de apresentação de 1 hora</span>
                  </div>
                  <p className="honorario__valor">R$ 4.800</p>
                </li>
                <li className="honorario">
                  <div className="honorario__nome">
                    <b>Revisão de contrato-padrão da empresa</b>
                    <span>5 dias úteis · marcas de revisão no .docx · quadro de risco de 1 página</span>
                  </div>
                  <p className="honorario__valor">R$ 2.400</p>
                </li>
                <li className="honorario">
                  <div className="honorario__nome">
                    <b>Acompanhamento mensal (jurídico terceirizado)</b>
                    <span>40 horas por mês · reunião mensal com a diretoria · prazo de 4 horas úteis para resposta</span>
                  </div>
                  <p className="honorario__valor">R$ 6.900<small>/mês</small></p>
                </li>
                <li className="honorario">
                  <div className="honorario__nome">
                    <b>Due diligence de aquisição de participação</b>
                    <span>a partir do valor ao lado · 4 a 8 semanas · relatório de achados por materialidade · red flags em 10 dias úteis</span>
                  </div>
                  <p className="honorario__valor">R$ 38.000</p>
                </li>
                <li className="honorario">
                  <div className="honorario__nome">
                    <b>Condução de contencioso ou arbitragem</b>
                    <span>depósito inicial a partir do valor ao lado, mais 8% do proveito econômico recebido · memorando de 3 cenários · prestação de contas a cada 60 dias</span>
                  </div>
                  <p className="honorario__valor">R$ 9.500<small> + êxito</small></p>
                </li>
              </ul>

              <p className="nota-tabela">Não estão incluídos: custas judiciais, emolumentos, taxas de agência, tradução juramentada, deslocamento fora de São Paulo e honorários de terceiros contratados por indicação sua. Esses valores são apresentados com orçamento prévio e aprovados por escrito.</p>
            </div>
          </div>
        </section>

        {/* ============ §5 SÓCIOS — faixa escura ============ */}
        <section className="faixa-escura" id="socios" aria-labelledby="socios-titulo">
          <div className="tela secao__interno">
            <div className="rail">
              <p className="rail__num"><span aria-hidden="true">§5</span><span className="oculto">Seção 5 — Sócios</span></p>
              <p className="rail__meta"><span>6 sócios · 14 advogados</span><span>desde 2004 · OAB/SP 12.345</span></p>
            </div>

            <div className="secao__corpo">
              <h2 id="socios-titulo">Quem assina o que você recebe.</h2>
              <p className="secao__linha">Dos seis sócios da sociedade, quatro conduzem as áreas do índice do §1. Os outros dois respondem pela administração da sociedade e pela relação com clientes de longa duração. Não há foto neste site porque o retrato que importa é o que cada um escreve.</p>

              <ul className="socios">
                <li className="socio">
                  <p className="socio__retrato" aria-hidden="true">HF</p>
                  <div className="socio__corpo">
                    <h3>Helena Fontes</h3>
                    <p className="socio__ficha">sócia-fundadora · Societário e M&A e Contratos empresariais (§1.1 e §1.2)<br />Direito pela USP · LL.M. em direito societário pela FGV · desde 2004</p>
                    <p className="socio__tese">“Acordo de sócios só protege quem escreveu a cláusula de saída antes de precisar dela.”</p>
                  </div>
                </li>
                <li className="socio">
                  <p className="socio__retrato" aria-hidden="true">RP</p>
                  <div className="socio__corpo">
                    <h3>Rafael Prado</h3>
                    <p className="socio__ficha">sócio · Contencioso estratégico e Recuperação de crédito (§1.5 e §1.6)<br />Direito pela Mackenzie · especialização em processo civil pela PUC-SP · desde 2004</p>
                    <p className="socio__tese">“Antes de propor a ação, eu calculo o que ela custa em caixa e em reputação. Depois disso, a decisão é da diretoria.”</p>
                  </div>
                </li>
                <li className="socio">
                  <p className="socio__retrato" aria-hidden="true">CS</p>
                  <div className="socio__corpo">
                    <h3>Camila Sarmento</h3>
                    <p className="socio__ficha">sócia · Trabalhista empresarial (§1.3)<br />Direito pela PUC-SP · pós-graduação em direito do trabalho pela USP · desde 2011</p>
                    <p className="socio__tese">“Passivo trabalhista se resolve na convenção coletiva e na rotina da fábrica, não no tribunal.”</p>
                  </div>
                </li>
                <li className="socio">
                  <p className="socio__retrato" aria-hidden="true">OB</p>
                  <div className="socio__corpo">
                    <h3>Otávio Bittencourt</h3>
                    <p className="socio__ficha">sócio · Regulatório e compliance (§1.4)<br />Direito pela UnB · LL.M. em direito regulatório pela FGV · desde 2014</p>
                    <p className="socio__tese">“Regulador não premia quem chega depois: a resposta da empresa começa no protocolo da consulta pública.”</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ============ §6 PUBLICAÇÕES ============ */}
        <section className="secao" id="publicacoes" aria-labelledby="publicacoes-titulo">
          <div className="tela secao__interno">
            <div className="rail">
              <p className="rail__num"><span aria-hidden="true">§6</span><span className="oculto">Seção 6 — Publicações</span></p>
              <p className="rail__meta"><span>boletins trimestrais</span><span>5 últimas edições · leitura de 5 a 8 min</span></p>
            </div>

            <div className="secao__corpo">
              <h2 id="publicacoes-titulo">O que escrevemos quando ninguém está pedindo.</h2>
              <p className="secao__linha">Boletins enviados a clientes e a quem pede. Cada um parte de uma decisão real e termina no que muda na minuta, na rotina ou no contrato de quem lê.</p>

              <ul className="boletins">
                <li className="boletim">
                  <p className="boletim__meta">18.02.2026 · área §1.1 · boletim 2026/03 · Helena Fontes · 6 min</p>
                  <h3>Reajuste por índice setorial: o que a decisão de fevereiro muda na sua minuta</h3>
                  <p>O índice da associação setorial voltou a valer como critério de reajuste, desde que a cláusula nomeie a pesquisa. Minutas que dizem apenas “índice oficial” continuam expostas — e a correção custa uma linha.</p>
                </li>
                <li className="boletim">
                  <p className="boletim__meta">04.02.2026 · área §1.2 · boletim 2026/02 · Helena Fontes · 8 min</p>
                  <h3>Due diligence em empresa familiar: os três documentos que sempre faltam</h3>
                  <p>Ata de aprovação de quotas, comprovação de integralização e o acordo de sócios vigente. Em 9 de 10 data rooms que abrimos, pelo menos um dos três não existe — e isso aparece no preço da operação.</p>
                </li>
                <li className="boletim">
                  <p className="boletim__meta">21.01.2026 · área §1.3 · boletim 2026/01 · Camila Sarmento · 5 min</p>
                  <h3>Terceirização depois da reforma: o que ainda chega ao tribunal</h3>
                  <p>A licitude da terceirização é pacífica; a discussão migrou para a fiscalização do contrato — pessoalidade, subordinação e exclusividade na prática. O que derruba empresa não é o contrato, é a rotina descrita pelos prepostos.</p>
                </li>
                <li className="boletim">
                  <p className="boletim__meta">15.01.2026 · área §1.4 · boletim 2025/08 · Otávio Bittencourt · 7 min</p>
                  <h3>Consulta pública da ANEEL 12/2025: o prazo corre e a sua empresa não se manifestou</h3>
                  <p>Quem não contribuiu na consulta discute a regra depois, no processo administrativo, com ônus maior. Explicamos o que uma contribuição técnica precisa conter para ser lida, e o que é descartado na triagem.</p>
                </li>
                <li className="boletim">
                  <p className="boletim__meta">09.12.2025 · área §1.5 · boletim 2025/07 · Rafael Prado · 6 min</p>
                  <h3>Recuperação judicial do seu fornecedor: como não virar credor sem garantia</h3>
                  <p>Crédito com garantia real e título protestado entram em classes diferentes e recebem em momentos diferentes. A diferença se decide no momento da venda, não na assembleia de credores — e quase sempre por uma cláusula de 4 linhas.</p>
                </li>
              </ul>

              <p className="boletins__nota">Os boletins vão por e-mail a clientes e a quem pede: escreva para <a href="mailto:boletins@fontesprado.adv.br">boletins@fontesprado.adv.br</a> com o número da edição. Não usamos a lista para nenhum outro aviso.</p>
            </div>
          </div>
        </section>

        {/* ============ §7 DÚVIDAS ============ */}
        <section className="secao secao--papel2" id="duvidas" aria-labelledby="duvidas-titulo">
          <div className="tela secao__interno">
            <div className="rail">
              <p className="rail__num"><span aria-hidden="true">§7</span><span className="oculto">Seção 7 — Dúvidas</span></p>
              <p className="rail__meta"><span>dúvidas de contratação</span><span>resposta direta do sócio da área</span></p>
            </div>

            <div className="secao__corpo">
              <h2 id="duvidas-titulo">O que perguntam antes de contratar.</h2>
              <div className="perguntas">
                <details className="pergunta" open>
                  <summary>Vocês atendem empresa que não tem jurídico interno?</summary>
                  <p>É metade da nossa carteira. Nesses casos a conversa é com a diretoria ou com o financeiro, e o relatório de 30 dias é escrito para quem não é advogado: o que foi feito, o que vai acontecer e o que a empresa precisa decidir. Se a sua empresa tem contador ou consultoria de rotina, trabalhamos junto — não pedimos exclusividade.</p>
                </details>
                <details className="pergunta">
                  <summary>Como funciona o honorário de contencioso?</summary>
                  <p>Depósito inicial a partir de R$ 9.500 mais 8% sobre o proveito econômico efetivamente recebido. Não cobramos êxito sobre valor que não entrou no caixa, e a prestação de contas é a cada 60 dias, com extrato de andamento e despesas. Se o caso virar acordo, o percentual incide sobre o valor do acordo.</p>
                </details>
                <details className="pergunta">
                  <summary>Em quanto tempo vocês respondem?</summary>
                  <p>Clientes ativos: 4 horas úteis, em média, medida em 312 solicitações em janeiro de 2026. Demanda nova entra na triagem do §2 e recebe prazo conforme porte e urgência — de 4 horas úteis a 5 dias úteis. Ninguém fica sem resposta: se não formos o escritório certo, dizemos e indicamos quem é.</p>
                </details>
                <details className="pergunta">
                  <summary>Vocês atendem fora de São Paulo?</summary>
                  <p>Sim, em contrato, societário e regulatório, com reunião por vídeo e deslocamento combinado por escrito. No contencioso fora do estado de São Paulo atuamos com escritório parceiro local e o sócio responsável continua sendo o nosso — você não fala com dois escritórios.</p>
                </details>
                <details className="pergunta">
                  <summary>Como vocês tratam conflito de interesse?</summary>
                  <p>Antes de aceitar o caso, cruzamos o nome das partes com a nossa base de clientes e de casos encerrados nos últimos 5 anos. Havendo conflito, recusamos ou pedimos a concordância formal das partes envolvidas. A recusa vem por escrito, com o motivo — inclusive quando o cliente é grande.</p>
                </details>
                <details className="pergunta">
                  <summary>O que acontece com os documentos que enviamos?</summary>
                  <p>Ficam em repositório com acesso restrito ao time do caso, com registro de quem abriu cada arquivo. Ao final, devolvemos o dossiê completo e apagamos as vias de trabalho em 90 dias, salvo o que a lei exige guardar por 5 anos. Cliente com política própria de retenção define o prazo no contrato.</p>
                </details>
              </div>
            </div>
          </div>
        </section>

        {/* ============ §8 AGENDAR CONVERSA ============ */}
        <section className="fecho" id="agendar" aria-labelledby="agendar-titulo">
          <div className="tela secao__interno">
            <div className="rail">
              <p className="rail__num"><span aria-hidden="true">§8</span><span className="oculto">Seção 8 — Agendar conversa</span></p>
              <p className="rail__meta"><span>seg a sex, 9h às 19h</span><span>Rua Jerônimo da Veiga, 45 · 9º andar</span><span>Itaim Bibi · São Paulo · CEP 04536-000</span></p>
            </div>

            <div className="secao__corpo">
              <h2 id="agendar-titulo">Agende 30 minutos com o sócio da área.</h2>
              <p className="secao__linha">A conversa é sem honorário e sem compromisso. Se você já fez a triagem do §2, informe o protocolo: o sócio entra na reunião com o caso lido.</p>

              <div className="recado-ok" id="recado-ok" role="status" hidden></div>

              <form id="form-agendar" noValidate>
                <div className="campos campos--dois">
                  <div className="campo" data-campo="nome">
                    <label htmlFor="a-nome">Nome e sobrenome</label>
                    <input id="a-nome" name="nome" type="text" autoComplete="name" placeholder="Renata Villela" aria-describedby="a-erro-nome" />
                    <span className="erro" id="a-erro-nome" data-erro="nome"></span>
                  </div>
                  <div className="campo" data-campo="empresa">
                    <label htmlFor="a-empresa">Empresa</label>
                    <input id="a-empresa" name="empresa" type="text" autoComplete="organization" placeholder="Metalúrgica Auriverde" aria-describedby="a-erro-empresa" />
                    <span className="erro" id="a-erro-empresa" data-erro="empresa"></span>
                  </div>
                  <div className="campo" data-campo="email">
                    <label htmlFor="a-email">E-mail corporativo</label>
                    <input id="a-email" name="email" type="email" autoComplete="email" placeholder="renata@auriverde.com.br" aria-describedby="a-erro-email a-aviso-email" />
                    <span className="erro" id="a-erro-email" data-erro="email"></span>
                    <span className="aviso-campo" id="a-aviso-email" role="status" aria-live="polite"></span>
                  </div>
                  <div className="campo" data-campo="telefone">
                    <label htmlFor="a-telefone">Telefone com DDD</label>
                    <input id="a-telefone" name="telefone" type="tel" inputMode="tel" autoComplete="tel" placeholder="(11) 98877-1042" aria-describedby="a-erro-telefone" />
                    <span className="erro" id="a-erro-telefone" data-erro="telefone"></span>
                  </div>
                  <div className="campo" data-campo="area">
                    <label htmlFor="a-area">Área de interesse</label>
                    <select id="a-area" name="area" aria-describedby="a-erro-area">
                      <option value="">Selecione a área</option>
                      <option>Contratos empresariais (§1.1)</option>
                      <option>Societário e M&A (§1.2)</option>
                      <option>Trabalhista empresarial (§1.3)</option>
                      <option>Regulatório e compliance (§1.4)</option>
                      <option>Recuperação de crédito (§1.5)</option>
                      <option>Contencioso estratégico (§1.6)</option>
                      <option>Ainda não sei — preciso de orientação</option>
                    </select>
                    <span className="erro" id="a-erro-area" data-erro="area"></span>
                  </div>
                  <div className="campo" data-campo="turno">
                    <label htmlFor="a-turno">Melhor horário</label>
                    <select id="a-turno" name="turno" aria-describedby="a-erro-turno">
                      <option value="">Selecione o horário</option>
                      <option value="manha">Manhã, das 9h às 12h</option>
                      <option value="tarde">Tarde, das 14h às 18h</option>
                    </select>
                    <span className="erro" id="a-erro-turno" data-erro="turno"></span>
                  </div>
                </div>

                <div className="campo" data-campo="protocolo">
                  <label htmlFor="a-protocolo">Protocolo da triagem</label>
                  <input id="a-protocolo" name="protocolo" type="text" inputMode="text" placeholder="FP-2026-0001" aria-describedby="a-dica-protocolo a-erro-protocolo" />
                  <span className="dica" id="a-dica-protocolo">Deixe em branco se você não fez a triagem do §2.</span>
                  <span className="erro" id="a-erro-protocolo" data-erro="protocolo"></span>
                </div>

                <div className="campo" data-campo="contexto">
                  <label htmlFor="a-contexto">Contexto do caso</label>
                  <textarea id="a-contexto" name="contexto" rows={3} placeholder="O que precisa ser decidido e até quando." aria-describedby="a-dica-contexto a-erro-contexto"></textarea>
                  <span className="dica" id="a-dica-contexto">Opcional · se escrever, use pelo menos 20 caracteres.</span>
                  <span className="erro" id="a-erro-contexto" data-erro="contexto"></span>
                </div>

                <div className="fecho__acoes">
                  <button className="botao" type="submit" id="btn-agendar">Agendar conversa de 30 minutos</button>
                  <p className="miudo">Ao enviar, você concorda em ser contatado sobre este pedido. Não repassamos dados a terceiros e não usamos a lista para outro assunto.</p>
                </div>
              </form>

              <dl className="contato">
                <div><dt>Telefone</dt><dd><a href="tel:+551135554180">(11) 3555-4180</a> · secretaria, seg a sex, 9h às 19h</dd></div>
                <div><dt>WhatsApp</dt><dd><a href="tel:+5511991842207">(11) 99184-2207</a> · só para agendamento, sem consulta por mensagem</dd></div>
                <div><dt>E-mail</dt><dd><a href="mailto:contato@fontesprado.adv.br">contato@fontesprado.adv.br</a></dd></div>
                <div><dt>Endereço</dt><dd>Rua Jerônimo da Veiga, 45 · 9º andar · Itaim Bibi · São Paulo · CEP 04536-000<br />Metrô Faria Lima (linha 4) a 1 km · estacionamento no prédio com agendamento</dd></div>
              </dl>
            </div>
          </div>
        </section>
      </main>

      <footer className="rodape">
        <div className="tela rodape__grade">
          <div>
            <p className="rodape__marca">Fontes & Prado <span>· sociedade de advogados · OAB/SP 12.345</span></p>
            <p>Rua Jerônimo da Veiga, 45 · 9º andar · Itaim Bibi · São Paulo · CEP 04536-000 · (11) 3555-4180 · CNPJ 00.000.000/0001-00</p>
          </div>
          <div>
            <p>Demonstração de catálogo. Nome, preços e textos são fictícios.</p>
            <p><a href="/">Voltar ao catálogo de modelos</a></p>
          </div>
        </div>
      </footer>
    </>
  );
}
