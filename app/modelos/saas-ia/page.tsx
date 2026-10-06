import Interacoes from './Interacoes';

/**
 * 01-saas-ia — markup convertido do modelo estático.
 *
 * As classes e a estrutura são as originais: o desenho não mudou na migração
 * para Next. O CSS do modelo é importado no layout da rota.
 */
export default function PaginaCopiloto() {
  return (
    <>
      <Interacoes />
      <a className="pular" href="#produto">Pular para o produto</a>

      <header className="cabecalho">
        <div className="tela cabecalho__interno">
          <a className="marca" href="#topo">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 18l8-12 8 12z" fill="#5B7CFA" /><circle cx="12" cy="18" r="1.6" fill="#E9EBF0" /></svg>
            <b>copiloto</b><span>/ plataforma</span>
          </a>
          <nav className="nav" aria-label="Navegação principal">
            <a href="#produto">Produto</a>
            <a href="#console">Console</a>
            <a href="#planos">Planos</a>
            <a href="#seguranca">Segurança</a>
            <a href="#duvidas">Dúvidas</a>
          </nav>
          <a className="botao botao--pequeno" href="#teste">Testar 14 dias</a>
        </div>
      </header>

      <main id="topo">

        {/* ================= ABERTURA: o produto respondendo ================= */}
        <section className="abertura">
          <div className="tela abertura__grade">
            <div>
              <h1>Pergunte em português. A resposta vem com a <mark>fonte citada</mark>.</h1>
              <p className="abertura__linha">→ conectado a e-mail, contrato, CRM e ticket, sem resposta inventada</p>
              <div className="abertura__texto">
                <p>O Copiloto lê o que a sua empresa já escreveu — e-mail, contrato, ticket, planilha, ata — e responde na hora, mostrando de onde tirou cada frase. Sem resposta inventada, sem "acho que é isso".</p>
                <div className="abertura__acoes">
                  <a className="botao" href="#teste">Testar 14 dias grátis</a>
                  <a className="botao botao--vazio" href="#console">Ver o console</a>
                </div>
                <ul className="abertura__prova">
                  <li>Dados hospedados no Brasil</li>
                  <li>Conecta em 5 dias</li>
                  <li>Sem treinar modelo com o seu conteúdo</li>
                </ul>
              </div>
            </div>

            <div className="terminal" id="terminal">
              <div className="terminal__barra">
                <span className="terminal__pontos" aria-hidden="true"><i></i><i></i><i></i></span>
                <span>copiloto · sessão de demonstração</span>
                <div className="terminal__abas" role="tablist" aria-label="Canais de demonstração">
                  <button type="button" role="tab" aria-selected="true" data-canal="operacoes">Operações</button>
                  <button type="button" role="tab" aria-selected="false" data-canal="juridico">Jurídico</button>
                  <button type="button" role="tab" aria-selected="false" data-canal="financeiro">Financeiro</button>
                </div>
              </div>
              <div className="terminal__fluxo" id="fluxo" role="log" aria-live="polite" aria-label="Conversa de demonstração"></div>
              <div className="terminal__sugestoes" id="sugestoes"></div>
              <form className="terminal__entrada" id="entrada">
                <label className="rotulo" htmlFor="pergunta" style={{ gridColumn: "1/-1" }}>Sua pergunta</label>
                <textarea id="pergunta" rows={1} placeholder="Escreva uma pergunta sobre a operação…" aria-describedby="dica-terminal"></textarea>
                <button className="botao" type="submit" id="enviar">Perguntar</button>
                <span className="miudo" id="dica-terminal" style={{ gridColumn: "1/-1" }}>Demonstração com dados fictícios. Nada sai do seu navegador.</span>
              </form>
            </div>
          </div>
        </section>

        {/* ================= NÚMEROS ================= */}
        <section className="numeros" aria-label="Resultados declarados por clientes">
          <div className="tela numeros__grade">
            <div className="numero revelar"><b>41 s</b><span>tempo médio até a primeira resposta útil</span></div>
            <div className="numero revelar"><b>2.480</b><span>documentos indexados por workspace, em média</span></div>
            <div className="numero revelar"><b>96 %</b><span>das respostas com fonte verificável no teste cego</span></div>
            <div className="numero revelar"><b>5 dias</b><span>da assinatura ao primeiro time usando</span></div>
          </div>
        </section>

        {/* ================= COMO FUNCIONA ================= */}
        <section className="secao" id="produto">
          <div className="tela">
            <div className="secao__cabeca revelar">
              <h2>Três passos entre o caos dos arquivos e uma resposta confiável.</h2>
              <p>Você não troca de sistema nem migra nada. O Copiloto lê onde a informação já está e mantém o índice atualizado sozinho.</p>
            </div>
            <div className="passos revelar">
              <article className="passo">
                <span className="passo__n">PASSO 01</span>
                <h3>Conecta as fontes</h3>
                <p>Google Workspace, Microsoft 365, Slack, CRM, pasta de rede e banco de tickets. Cada conector guarda a permissão original: quem não podia ler o arquivo, não recebe a resposta.</p>
                <p><code>copiloto connect --source crm</code></p>
              </article>
              <article className="passo">
                <span className="passo__n">PASSO 02</span>
                <h3>Indexa com contexto</h3>
                <p>O conteúdo é quebrado em trechos, ligado a quem escreveu, quando e sobre qual cliente. A busca entende apelido de projeto, sigla interna e nome antigo de contrato.</p>
                <p><code>copiloto index --scope vendas/2026</code></p>
              </article>
              <article className="passo">
                <span className="passo__n">PASSO 03</span>
                <h3>Responde citando</h3>
                <p>Toda frase vem com o trecho original, o autor e a data. Se a base não cobre a pergunta, o Copiloto diz que não sabe e sugere quem na empresa sabe.</p>
                <p><code>copiloto ask "prazo do contrato Alvorada"</code></p>
              </article>
            </div>
          </div>
        </section>

        {/* ================= CONSOLE ================= */}
        <section className="secao" id="console">
          <div className="tela">
            <div className="secao__cabeca revelar">
              <h2>O console onde o time inteiro trabalha.</h2>
              <p>Não é uma caixa de chat solta: cada resposta vira um registro, com responsável, prazo e trilha de auditoria. Escolha um módulo para ver o que ele faz.</p>
            </div>

            <div className="console revelar">
              <div className="console__menu" role="tablist" aria-label="Módulos do console">
                <button type="button" role="tab" aria-selected="true" data-modulo="conectores">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7V4M15 7V4M7 7h10v6a5 5 0 01-10 0z" /><path d="M12 18v3" /></svg>
                  <span><b>Conectores</b><small>12 fontes</small></span>
                </button>
                <button type="button" role="tab" aria-selected="false" data-modulo="respostas">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16v10H8l-4 4z" /><path d="M8 10h8M8 13h5" /></svg>
                  <span><b>Respostas</b><small>com fonte</small></span>
                </button>
                <button type="button" role="tab" aria-selected="false" data-modulo="auditoria">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h9l5 5v11H5z" /><path d="M14 4v5h5M8 13h8M8 16h5" /></svg>
                  <span><b>Auditoria</b><small>quem perguntou o quê</small></span>
                </button>
                <button type="button" role="tab" aria-selected="false" data-modulo="guardrails">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z" /><path d="M9 12l2 2 4-4" /></svg>
                  <span><b>Guardrails</b><small>limites por área</small></span>
                </button>
              </div>

              <div className="console__painel">
                <div className="console__topo">
                  <span className="vivo" id="console-estado">conectado</span>
                  <span id="console-titulo">conectores ativos neste workspace</span>
                  <span style={{ marginLeft: "auto" }} id="console-hora">--:--:--</span>
                </div>
                <div className="console__log" id="console-log" role="log" aria-live="polite"></div>
                <div className="console__rodape">
                  <p id="console-nota">Permissões herdadas da fonte original. Nada é copiado para fora do seu tenant.</p>
                  <button className="botao botao--vazio botao--pequeno" type="button" id="rodar">Rodar verificação</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= PLANOS ================= */}
        <section className="secao" id="planos">
          <div className="tela">
            <div className="secao__cabeca revelar">
              <h2>Preço por pessoa que pergunta, não por token.</h2>
              <p>Sem cobrança por volume de mensagem e sem taxa de implantação. Você cancela quando quiser e leva o índice embora.</p>
            </div>
            <div className="planos revelar">
              <article className="plano">
                <h3>Time</h3>
                <div className="plano__preco">R$ 49 <small>/ pessoa · mês</small></div>
                <p className="plano__para">Para um time validar a ideia sem projeto de TI.</p>
                <ul className="plano__lista">
                  <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l5 5L20 6" /></svg>Até 25 pessoas</li>
                  <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l5 5L20 6" /></svg>5 conectores à escolha</li>
                  <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l5 5L20 6" /></svg>Histórico de 90 dias</li>
                  <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l5 5L20 6" /></svg>Suporte por e-mail</li>
                </ul>
                <a className="botao botao--vazio" href="#teste">Começar no Time</a>
              </article>

              <article className="plano plano--destaque">
                <span className="plano__selo">Mais escolhido</span>
                <h3>Empresa</h3>
                <div className="plano__preco">R$ 89 <small>/ pessoa · mês</small></div>
                <p className="plano__para">Para operação inteira, com regra por área e auditoria.</p>
                <ul className="plano__lista">
                  <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l5 5L20 6" /></svg>Pessoas ilimitadas</li>
                  <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l5 5L20 6" /></svg>Todos os conectores + API</li>
                  <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l5 5L20 6" /></svg>Guardrails por área e por cliente</li>
                  <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l5 5L20 6" /></svg>Trilha de auditoria completa</li>
                  <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l5 5L20 6" /></svg>SSO, SCIM e revisão de acesso</li>
                </ul>
                <a className="botao" href="#teste">Testar 14 dias</a>
              </article>

              <article className="plano">
                <h3>Regulado</h3>
                <div className="plano__preco">Sob consulta</div>
                <p className="plano__para">Para banco, saúde e jurídico com exigência de residência de dados.</p>
                <ul className="plano__lista">
                  <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l5 5L20 6" /></svg>Instalação na sua nuvem ou on-premise</li>
                  <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l5 5L20 6" /></svg>Modelo dedicado, sem compartilhamento</li>
                  <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l5 5L20 6" /></svg>Relatório de impacto e DPIA assinado</li>
                  <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l5 5L20 6" /></svg>Gerente técnico nomeado</li>
                </ul>
                <a className="botao botao--vazio" href="#teste">Falar com engenharia</a>
              </article>
            </div>
          </div>
        </section>

        {/* ================= SEGURANÇA ================= */}
        <section className="secao" id="seguranca">
          <div className="tela seguranca">
            <div className="revelar">
              <div className="secao__cabeca">
                <h2>Segurança descrita em fatos, não em adjetivos.</h2>
                <p>É a primeira pergunta de todo comprador e a razão de metade das objeções. Aqui está a resposta completa, sem pedir reunião.</p>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                <span className="selo">LGPD · dados no Brasil</span>
                <span className="selo">ISO 27001 em auditoria</span>
                <span className="selo">Criptografia AES-256</span>
                <span className="selo">SSO SAML e SCIM</span>
              </div>
            </div>
            <ul className="seguranca__lista revelar">
              <li><b>O seu conteúdo não treina modelo.</b><span>Contrato de não-treinamento por padrão. Nenhum dado de cliente entra em ajuste de modelo, nem de forma agregada.</span></li>
              <li><b>Permissão herdada, nunca ampliada.</b><span>O Copiloto responde dentro da permissão que a pessoa já tinha na fonte. Revogar acesso na fonte revoga a resposta em até 5 minutos.</span></li>
              <li><b>Retenção que você define.</b><span>Índice de 7, 90 ou 365 dias, por workspace. Exclusão a pedido em até 48 horas, com comprovante.</span></li>
              <li><b>Trilha de auditoria exportável.</b><span>Cada pergunta, fonte citada e resposta fica registrada com autor e horário, em CSV ou via API, para o seu compliance ler.</span></li>
            </ul>
          </div>
        </section>

        {/* ================= DÚVIDAS ================= */}
        <section className="secao" id="duvidas">
          <div className="tela">
            <div className="secao__cabeca revelar">
              <h2>O que perguntam antes de assinar.</h2>
            </div>
            <div className="perguntas revelar">
              <details className="pergunta" open>
                <summary>Funciona com a bagunça que a gente já tem?</summary>
                <p>Funciona — desde que a bagunça esteja em algum lugar digital. Pastas de rede, planilhas antigas, thread de Slack e PDF assinado entram. O que não entra é o que só existe na cabeça de alguém: para isso o Copiloto aponta quem provavelmente sabe.</p>
              </details>
              <details className="pergunta">
                <summary>Quanto tempo até estar rodando de verdade?</summary>
                <p>Cinco dias úteis para o primeiro time, em média, contando a conexão das fontes. Workspaces com mais de 10 mil documentos ou exigência de instalação própria levam de 3 a 5 semanas.</p>
              </details>
              <details className="pergunta">
                <summary>Preciso de projeto de TI?</summary>
                <p>Nos planos Time e Empresa, não. Um administrador autoriza os conectores em uma tela e o resto é autoatendimento. No plano Regulado a instalação é feita com o seu time de infraestrutura.</p>
              </details>
              <details className="pergunta">
                <summary>E se a resposta estiver errada?</summary>
                <p>Cada frase traz a fonte ao lado; se a fonte não sustentar a frase, o erro é visível em segundos. Perguntas sem cobertura na base recebem "não encontrei isso na sua base" em vez de uma resposta plausível.</p>
              </details>
              <details className="pergunta">
                <summary>Como cancelo?</summary>
                <p>Um clique no painel. Você recebe um export completo do índice e do histórico em formato aberto e o workspace é apagado em 30 dias.</p>
              </details>
            </div>
          </div>
        </section>

        {/* ================= TESTE ================= */}
        <section className="fecho" id="teste">
          <div className="tela fecho__caixa">
            <h2>Conecte uma fonte e faça a primeira pergunta hoje.</h2>
            <p>14 dias com o plano Empresa liberado, sem cartão. Um engenheiro acompanha a conexão das fontes na primeira semana.</p>
            <div className="recado-ok" id="recado-ok" hidden role="status"></div>
            <form id="form-teste" noValidate>
              <div className="linha">
                <div className="campo" data-campo="nome">
                  <label htmlFor="nome">Seu nome</label>
                  <input id="nome" name="nome" type="text" autoComplete="name" placeholder="Ana Ribeiro" required />
                  <span className="campo__erro" data-erro="nome"></span>
                </div>
                <div className="campo" data-campo="empresa">
                  <label htmlFor="empresa">Empresa</label>
                  <input id="empresa" name="empresa" type="text" autoComplete="organization" placeholder="Alvorada Log" required />
                  <span className="campo__erro" data-erro="empresa"></span>
                </div>
              </div>
              <div className="campo" data-campo="email">
                <label htmlFor="email">E-mail corporativo</label>
                <input id="email" name="email" type="email" autoComplete="email" placeholder="ana@alvorada.com.br" required />
                <span className="campo__erro" data-erro="email"></span>
              </div>
              <div className="campo" data-campo="tamanho">
                <label htmlFor="tamanho">Quantas pessoas vão perguntar</label>
                <input id="tamanho" name="tamanho" type="text" inputMode="numeric" placeholder="35" required />
                <span className="campo__erro" data-erro="tamanho"></span>
              </div>
              <button className="botao" type="submit" id="btn-teste">Liberar o teste</button>
              <p className="miudo">Ao enviar, você concorda em receber um contato sobre o teste. Nada é compartilhado com terceiros.</p>
            </form>
          </div>
        </section>
      </main>

      <footer className="rodape">
        <div className="tela rodape__grade">
          <p><strong>copiloto</strong> · plataforma de resposta corporativa · CNPJ 00.000.000/0001-00</p>
          <p>Demonstração de catálogo. Empresa, números e depoimentos são fictícios.</p>
          <p><a href="/">Voltar ao catálogo de modelos</a></p>
        </div>
      </footer>
    </>
  );
}
