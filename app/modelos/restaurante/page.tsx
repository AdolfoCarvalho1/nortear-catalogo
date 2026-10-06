import Interacoes from './Interacoes';

/**
 * 02-restaurante — markup convertido do modelo estático.
 *
 * As classes e a estrutura são as originais: o desenho não mudou na migração
 * para Next. O CSS do modelo é importado no layout da rota.
 */
export default function PaginaMesa12() {
  return (
    <>
      <Interacoes />
      <a className="pular" href="#conteudo">Pular para o conteúdo</a>

      <header className="cabecalho">
        <div className="tela cabecalho__interno">
          <a className="marca" href="#topo">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="8.2" /><circle cx="12" cy="12" r="4.4" /></svg>
            <b>Mesa 12</b><span>Cambuci · SP</span>
          </a>
          <nav className="nav" aria-label="Navegação principal">
            <a href="#menu">Menu da estação</a>
            <a href="#reserva">Reserva</a>
            <a href="#casa">A casa</a>
            <a href="#adega">Adega</a>
            <a href="#onde">Onde ficamos</a>
          </nav>
          <a className="botao botao--pequeno" href="#reserva">Reservar mesa</a>
        </div>
      </header>

      <main id="conteudo">

        {/* ============ ABERTURA: a casa mostra o menu, não a promessa ============ */}
        <section className="abertura" id="topo">
          <div className="tela abertura__grade">
            <div className="abertura__texto">
              <h1>Mesa 12</h1>
              <p className="abertura__promessa">Menu que muda com a estação. A casa não muda.</p>
              <p className="abertura__meta">Cozinha autoral brasileira numa esquina do Cambuci, em São Paulo. Jantar de quinta a sábado, das 19h às 23h30. Vinte e oito lugares, uma cozinha aberta no meio da sala.</p>
              <div className="abertura__acoes">
                <a className="botao" href="#reserva">Reservar mesa</a>
                <a className="link" href="#menu">Ver o menu da estação
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 12h15M13 6l6 6-6 6" /></svg>
                </a>
              </div>
              <p className="abertura__nota">O menu é fechado: sete tempos, sem escolha no dia. Restrição alimentar se avisa na reserva.</p>
            </div>

            {/* A carta impressa: o produto demonstrado, não descrito */}
            <aside className="carta" aria-labelledby="carta-titulo">
              <p className="carta__titulo" id="carta-titulo">Menu de verão · 7 tempos</p>
              <p className="carta__preco">R$ 290 <small>por pessoa</small></p>
              <dl className="carta__linhas">
                <div><dt>Harmonização, 5 taças</dt><dd>R$ 190</dd></div>
                <div><dt>Menu vegetariano</dt><dd>R$ 240</dd></div>
                <div><dt>Sem álcool, 5 taças</dt><dd>R$ 120</dd></div>
              </dl>
              <div className="carta__auge">
                <p className="carta__rotulo">
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 20V9" /><path d="M12 12.5c0-4.1 3.1-7.2 7.2-7.2 0 4.1-3.1 7.2-7.2 7.2z" /><path d="M12 16c0-2.9-2.4-5.2-5.3-5.2 0 2.9 2.4 5.2 5.3 5.2z" /></svg>
                  No auge esta semana
                </p>
                <ul className="carta__lista">
                  <li>atum da costa de Ubatuba</li>
                  <li>pupunha da safra nova, de Pariquera-Açu</li>
                  <li>tangerina cravo do Vale do Ribeira</li>
                </ul>
              </div>
              <p className="carta__rodape">O menu trocou 24 vezes desde 2019. A próxima troca é no primeiro dia do outono, 20 de março.</p>
            </aside>
          </div>
        </section>

        {/* ============ FICHA DA CASA: números com unidade e contexto ============ */}
        <section className="ficha" aria-label="A casa em números">
          <div className="tela ficha__grade">
            <div className="ficha__item">
              <b>28 lugares</b>
              <span>Duas mesas de seis, o resto de dois e quatro. Ninguém senta de costas para a cozinha.</span>
            </div>
            <div className="ficha__item">
              <b>7 tempos</b>
              <span>Cerca de duas horas e meia à mesa, do ovo curado ao sorvete de leite.</span>
            </div>
            <div className="ficha__item">
              <b>desde 2019</b>
              <span>Mesma esquina, mesma dona na cozinha todas as noites de serviço.</span>
            </div>
            <div className="ficha__item">
              <b>12 produtores</b>
              <span>Num raio de 90 km: Mairiporã, Jundiaí, Parelheiros, Vale do Ribeira.</span>
            </div>
            <div className="ficha__item">
              <b>24 trocas</b>
              <span>De menu desde a abertura. A próxima entra no primeiro dia do outono.</span>
            </div>
          </div>
        </section>

        {/* ============ MENU DA ESTAÇÃO: a passagem densa ============ */}
        <section className="secao secao--menu" id="menu">
          <div className="tela">
            <div className="secao__cabeca">
              <h2>Sete tempos, escritos na quarta à noite, depois que a praça fecha.</h2>
              <p>A cozinha compra de 12 produtores e escreve o menu em cima do que chegou. Abra um tempo para ver a técnica, tudo o que entra no prato e a taça que a casa sugere.</p>
            </div>

            <div className="servico">
              <div className="servico__estado">
                <p className="servico__contador" id="contador" aria-live="polite">Nenhum tempo aberto. Abra um prato para ver a técnica, os ingredientes do dia e a harmonização.</p>
                <p className="servico__praca" id="praca" aria-live="polite">A praça ainda não foi conferida hoje. O que não vem do produtor sai do menu antes do serviço.</p>
              </div>
              <div className="servico__acoes">
                <button className="botao botao--vazio botao--pequeno" type="button" id="btn-todos" aria-expanded="false" aria-controls="lista-tempos">Abrir todos os 7 tempos</button>
                <button className="botao botao--vazio botao--pequeno" type="button" id="btn-praca">Conferir o que chegou hoje</button>
              </div>
            </div>

            <ol className="tempos" id="lista-tempos">

              <li>
                <details className="tempo" id="tempo-1">
                  <summary>
                    <span className="tempo__numero">1</span>
                    <span className="tempo__principal">
                      <span className="tempo__nome">Ovo caipira curado, creme de milho queimado, farofa de castanha</span>
                      <span className="tempo__ingredientes">ovo caipira curado · milho queimado · castanha-do-pará</span>
                      <span className="tempo__estacao">milho no auge até o fim de fevereiro</span>
                    </span>
                    <span className="tempo__margem">
                      <span className="tempo__origem">Ovos da Granja Santa Fé, em Mairiporã. Milho verde da feira do Cambuci, comprado na quinta de manhã.</span>
                    </span>
                    <span className="mais" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M4 12h16" /><path className="mais__v" d="M12 4v16" /></svg></span>
                  </summary>
                  <div className="tempo__detalhe">
                    <div className="tempo__bloco">
                      <p className="rotulo">Como é feito</p>
                      <p>A gema cura 40 minutos no sal e no açúcar mascavo e vai à mesa mole. O milho assa inteiro na brasa até a casca queimar, e o creme sai do que ficou colado na espiga. A farofa leva castanha-do-pará torrada na hora e manteiga de garrafa.</p>
                    </div>
                    <div className="tempo__bloco">
                      <p className="rotulo">Tudo o que entra no prato</p>
                      <p>ovo caipira, sal, açúcar mascavo, milho verde, manteiga de garrafa, castanha-do-pará, cebolinha do quintal, pimenta-do-reino moída na hora.</p>
                    </div>
                    <div className="tempo__bloco tempo__bloco--margem">
                      <p className="rotulo rotulo--vinho">Harmonização</p>
                      <p>Espumante brut nature de Pinto Bandeira, na Serra Gaúcha: 30 meses de autólise e nenhum açúcar no licor. A acidez corta a gema.</p>
                    </div>
                  </div>
                </details>
              </li>

              <li>
                <details className="tempo" id="tempo-2">
                  <summary>
                    <span className="tempo__numero">2</span>
                    <span className="tempo__principal">
                      <span className="tempo__nome">Atum da costa de Ubatuba, lentilha de Itaoca, tangerina cravo</span>
                      <span className="tempo__ingredientes">atum · lentilha de Itaoca · tangerina cravo</span>
                      <span className="tempo__estacao">atum no auge até meados de março</span>
                    </span>
                    <span className="tempo__margem">
                      <span className="tempo__origem">Atum pescado na costa de Ubatuba na quarta. Lentilha do sítio de Itaoca, no Vale do Ribeira, colhida em janeiro.</span>
                      <span className="tempo__aviso" id="aviso-2" hidden>mudou hoje: pescada-amarela da mesma costa</span>
                    </span>
                    <span className="mais" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M4 12h16" /><path className="mais__v" d="M12 4v16" /></svg></span>
                  </summary>
                  <div className="tempo__detalhe">
                    <div className="tempo__bloco">
                      <p className="rotulo">Como é feito</p>
                      <p>O peixe chega inteiro na quarta e é porcionado na hora. A telha de sal grosso sela as laterais em 40 segundos e o centro sai rosado. A lentilha de Itaoca cozinha em caldo de casca de tangerina e vai fria, com azeite de ervas.</p>
                    </div>
                    <div className="tempo__bloco">
                      <p className="rotulo">Tudo o que entra no prato</p>
                      <p>atum, lentilha de Itaoca, tangerina cravo, sal grosso, azeite de oliva do Vale do Ribeira, erva-doce, folhas de mostarda da horta de Parelheiros.</p>
                    </div>
                    <div className="tempo__bloco tempo__bloco--margem">
                      <p className="rotulo rotulo--vinho">Harmonização</p>
                      <p>Riesling itálico do Vale dos Vinhedos. Pede acidez, não madeira: o vinho é fermentado em inox e engarrafado em dezembro.</p>
                    </div>
                    <p className="troca" id="troca-2" hidden>
                      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9" /><path d="M12 7.5v5.5M12 16.2v.6" /></svg>
                      <span><b>Hoje este tempo sai diferente.</b> O barco não saiu na quarta, com mar grosso na costa. A cozinha substitui o atum por pescada-amarela do mesmo pescador, e mantém a lentilha e a tangerina. Nada muda no preço.</span>
                    </p>
                  </div>
                </details>
              </li>

              <li>
                <details className="tempo" id="tempo-3">
                  <summary>
                    <span className="tempo__numero">3</span>
                    <span className="tempo__principal">
                      <span className="tempo__nome">Tucunaré na brasa, leite de tucupi, jambu</span>
                      <span className="tempo__ingredientes">tucunaré · tucupi · jambu</span>
                    </span>
                    <span className="tempo__margem">
                      <span className="tempo__origem">Tucunaré de cativeiro em Registro, no Vale do Ribeira. Tucupi de Manacapuru, no Amazonas, comprado uma vez por mês.</span>
                    </span>
                    <span className="mais" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M4 12h16" /><path className="mais__v" d="M12 4v16" /></svg></span>
                  </summary>
                  <div className="tempo__detalhe">
                    <div className="tempo__bloco">
                      <p className="rotulo">Como é feito</p>
                      <p>Brasa de lenha de eucalipto, quatro minutos de cada lado, pele para baixo e uma única virada. O tucupi reduz com alho e chicória até engrossar. O jambu passa 20 segundos na água fervente, só para tirar o formigamento da folha crua.</p>
                    </div>
                    <div className="tempo__bloco">
                      <p className="rotulo">Tudo o que entra no prato</p>
                      <p>tucunaré, tucupi, alho, chicória, jambu, limão-taiti, farinha de mandioca fresca de Registro, pimenta-de-cheiro.</p>
                    </div>
                    <div className="tempo__bloco tempo__bloco--margem">
                      <p className="rotulo rotulo--vinho">Harmonização</p>
                      <p>Laranja de uva Goethe, de Urussanga, em Santa Catarina: oito dias de maceração na casca e um amargor leve que acompanha o tucupi.</p>
                    </div>
                  </div>
                </details>
              </li>

              <li>
                <details className="tempo" id="tempo-4">
                  <summary>
                    <span className="tempo__numero">4</span>
                    <span className="tempo__principal">
                      <span className="tempo__nome">Pupunha na brasa, creme de castanha-de-caju, ervas do quintal</span>
                      <span className="tempo__ingredientes">pupunha · castanha-de-caju · ervas do quintal</span>
                      <span className="tempo__estacao">pupunha da safra nova, colhida na segunda</span>
                    </span>
                    <span className="tempo__margem">
                      <span className="tempo__origem">Pupunha de Pariquera-Açu, no Vale do Ribeira. Ervas da horta de Parelheiros, colhidas na manhã do serviço.</span>
                    </span>
                    <span className="mais" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M4 12h16" /><path className="mais__v" d="M12 4v16" /></svg></span>
                  </summary>
                  <div className="tempo__detalhe">
                    <div className="tempo__bloco">
                      <p className="rotulo">Como é feito</p>
                      <p>A pupunha cozinha seis horas na água com sal e termina 20 minutos na brasa, para a casca pegar fumaça. O creme é de castanha-de-caju torrada, batida com caldo de cogumelo. As ervas entram cruas, sem tempero além de azeite e flor de sal.</p>
                    </div>
                    <div className="tempo__bloco">
                      <p className="rotulo">Tudo o que entra no prato</p>
                      <p>pupunha, castanha-de-caju, cogumelo paris, cebola, manjericão, estragão, hortelã, azeite, pimenta biquinho em conserva da casa.</p>
                    </div>
                    <div className="tempo__bloco tempo__bloco--margem">
                      <p className="rotulo">Sem álcool</p>
                      <p>Kombucha de jabuticaba feita aqui, com oito dias de fermentação, servida na taça fria. É um dos dois tempos que não levam vinho.</p>
                    </div>
                  </div>
                </details>
              </li>

              <li>
                <details className="tempo" id="tempo-5">
                  <summary>
                    <span className="tempo__numero">5</span>
                    <span className="tempo__principal">
                      <span className="tempo__nome">Queijo canastra de 6 meses, mel de laranjeira, pão de fermentação natural</span>
                      <span className="tempo__ingredientes">queijo canastra · mel de laranjeira · pão de 36 horas</span>
                    </span>
                    <span className="tempo__margem">
                      <span className="tempo__origem">Queijo da Serra da Canastra, curado seis meses pelo produtor. Mel do apiário da Serra do Japi, em Jundiaí. Pão do forno da casa.</span>
                    </span>
                    <span className="mais" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M4 12h16" /><path className="mais__v" d="M12 4v16" /></svg></span>
                  </summary>
                  <div className="tempo__detalhe">
                    <div className="tempo__bloco">
                      <p className="rotulo">Como é feito</p>
                      <p>O queijo é cortado em lascas grossas e vai à brasa por um minuto, só para amolecer por dentro. O mel aquece com pimenta-rosa e escorre na hora. O pão sai do forno às 18h, com 36 horas de fermentação natural e farinha do moinho de Itu.</p>
                    </div>
                    <div className="tempo__bloco">
                      <p className="rotulo">Tudo o que entra no prato</p>
                      <p>queijo canastra curado 6 meses, mel de laranjeira, pimenta-rosa, pão de fermentação natural, farinha do moinho de Itu, azeite de oliva.</p>
                    </div>
                    <div className="tempo__bloco tempo__bloco--margem">
                      <p className="rotulo rotulo--vinho">Harmonização</p>
                      <p>Chardonnay do Vale dos Vinhedos, fermentado em barrica velha, de terceiro uso. A madeira aparece como textura, não como gosto.</p>
                    </div>
                  </div>
                </details>
              </li>

              <li>
                <details className="tempo" id="tempo-6">
                  <summary>
                    <span className="tempo__numero">6</span>
                    <span className="tempo__principal">
                      <span className="tempo__nome">Costela de manga bovina, 12 horas no forno a lenha, purê de mandioquinha defumada</span>
                      <span className="tempo__ingredientes">costela de manga · mandioquinha defumada · cebola queimada</span>
                    </span>
                    <span className="tempo__margem">
                      <span className="tempo__origem">Boi de pasto de São José do Barreiro, no Vale do Paraíba. Mandioquinha de Cunha, da safra que entrou em janeiro.</span>
                    </span>
                    <span className="mais" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M4 12h16" /><path className="mais__v" d="M12 4v16" /></svg></span>
                  </summary>
                  <div className="tempo__detalhe">
                    <div className="tempo__bloco">
                      <p className="rotulo">Como é feito</p>
                      <p>A costela entra no forno às 5h da manhã com sal grosso e sai às 17h: 12 horas de lenha de eucalipto, entre 110 °C e 120 °C. A mandioquinha cozinha no vapor da própria lenha e o purê leva cebola queimada na brasa e manteiga de garrafa.</p>
                    </div>
                    <div className="tempo__bloco">
                      <p className="rotulo">Tudo o que entra no prato</p>
                      <p>costela de manga bovina, sal grosso, mandioquinha, cebola, manteiga de garrafa, tomilho do quintal, caldo de osso reduzido por seis horas.</p>
                    </div>
                    <div className="tempo__bloco tempo__bloco--margem">
                      <p className="rotulo rotulo--vinho">Harmonização</p>
                      <p>Pinot noir de São Roque, o tinto mais leve da carta, feito a 60 km daqui. É o que a casa abre para a carne mais pesada do menu.</p>
                    </div>
                  </div>
                </details>
              </li>

              <li>
                <details className="tempo" id="tempo-7">
                  <summary>
                    <span className="tempo__numero">7</span>
                    <span className="tempo__principal">
                      <span className="tempo__nome">Sorvete de leite com doce de abóbora e pecan</span>
                      <span className="tempo__ingredientes">leite da fazenda · abóbora cabotiá · pecan</span>
                      <span className="tempo__estacao">abóbora cabotiá no fim da safra</span>
                    </span>
                    <span className="tempo__margem">
                      <span className="tempo__origem">Leite da Fazenda Boa Vista, em Joanópolis, entregue três vezes por semana. Pecan de Itapeva, no sudoeste paulista.</span>
                    </span>
                    <span className="mais" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M4 12h16" /><path className="mais__v" d="M12 4v16" /></svg></span>
                  </summary>
                  <div className="tempo__detalhe">
                    <div className="tempo__bloco">
                      <p className="rotulo">Como é feito</p>
                      <p>O sorvete é de leite integral e gema caipira, sem estabilizante: sai da máquina e vai direto para a mesa. A abóbora cozinha com rapadura e canela até virar doce, e a pecan torra com sal e mel antes de quebrar em cima.</p>
                    </div>
                    <div className="tempo__bloco">
                      <p className="rotulo">Tudo o que entra no prato</p>
                      <p>leite integral, gema caipira, açúcar, abóbora cabotiá, rapadura, canela-do-ceilão, pecan, mel de laranjeira, flor de sal.</p>
                    </div>
                    <div className="tempo__bloco tempo__bloco--margem">
                      <p className="rotulo">Sem álcool</p>
                      <p>Café da Mogiana, coado na hora, ou a kombucha de jabuticaba da casa. Quem quiser fecha com meia taça de chenin blanc do Vale do Loire.</p>
                    </div>
                  </div>
                </details>
              </li>
            </ol>

            {/* A comanda: preço por pessoa, na superfície branca onde o barro tem contraste */}
            <div className="comanda">
              <div className="comanda__linha">
                <span className="comanda__nome">Menu degustação, 7 tempos</span>
                <span className="comanda__obs">Servido para a mesa inteira, do primeiro ao último tempo.</span>
                <b className="comanda__preco">R$ 290</b>
              </div>
              <div className="comanda__linha">
                <span className="comanda__nome">Harmonização, 5 taças</span>
                <span className="comanda__obs">Cinco vinhos para sete tempos; os outros dois saem com bebida da casa.</span>
                <b className="comanda__preco">R$ 190</b>
              </div>
              <div className="comanda__linha">
                <span className="comanda__nome">Menu vegetariano</span>
                <span className="comanda__obs">Montado no dia, com o que a horta mandou. Avise na reserva.</span>
                <b className="comanda__preco">R$ 240</b>
              </div>
              <div className="comanda__linha">
                <span className="comanda__nome">Sem álcool, 5 taças</span>
                <span className="comanda__obs">Kombucha, sucos fermentados na casa e café da Mogiana no fim.</span>
                <b className="comanda__preco">R$ 120</b>
              </div>
              <p className="comanda__nota">Preços por pessoa. Serviço de 10% à parte. Crianças a partir de 10 anos fazem o menu completo — não temos menu infantil nem cadeirão.</p>
            </div>
          </div>
        </section>

        {/* ============ RESERVA: o controle principal ============ */}
        <section className="secao secao--reserva" id="reserva">
          <div className="tela reserva__grade">
            <div className="reserva__texto">
              <h2>A casa abre de quinta a sábado. A mesa fica sua por duas horas e meia.</h2>
              <p>O serviço começa às 19h e a última entrada é às 21h. Quem chega às 21h ainda pega os sete tempos, com a cozinha um pouco mais corrida.</p>
              <ul className="fatos">
                <li><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9" /><path d="M12 7v5.3l3.6 2.1" /></svg><span><b>Confirmação em até 2 horas</b>, por WhatsApp, no número que você deixar aqui.</span></li>
                <li><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20 6.5 9.6 17 4 11.4" /></svg><span><b>Cancelamento sem custo até 24 horas antes.</b> Depois disso a casa cobra R$ 90 por lugar — é o que já está na praça.</span></li>
                <li><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 4h4l2 5-2.4 1.6a12.5 12.5 0 0 0 5.8 5.8L16 14l5 2v4a2 2 0 0 1-2.2 2A17 17 0 0 1 3 6.2 2 2 0 0 1 5 4z" /></svg><span><b>Sete ou oito pessoas, ou a casa fechada para um grupo:</b> só por telefone, no (11) 90000-0000.</span></li>
              </ul>
            </div>

            <div className="reserva__painel">
              <form id="form-reserva" className="formulario" noValidate>
                <div className="campo__par">
                  <div className="campo" data-campo="data">
                    <label htmlFor="data">Data do jantar</label>
                    <input id="data" name="data" type="date" required aria-describedby="erro-data" />
                    <span className="campo__erro" id="erro-data" data-erro="data"></span>
                  </div>
                  <div className="campo" data-campo="horario">
                    <label htmlFor="horario">Horário de entrada</label>
                    <select id="horario" name="horario" required aria-describedby="erro-horario">
                      <option value="">Escolha o horário</option>
                      <option value="19:00">19h</option>
                      <option value="19:30">19h30</option>
                      <option value="20:00">20h</option>
                      <option value="20:30">20h30</option>
                      <option value="21:00">21h</option>
                    </select>
                    <span className="campo__erro" id="erro-horario" data-erro="horario"></span>
                  </div>
                </div>

                <div className="campo__par">
                  <div className="campo" data-campo="pessoas">
                    <label htmlFor="pessoas">Quantas pessoas</label>
                    <select id="pessoas" name="pessoas" required aria-describedby="erro-pessoas">
                      <option value="">Escolha</option>
                      <option value="1">1 pessoa</option>
                      <option value="2">2 pessoas</option>
                      <option value="3">3 pessoas</option>
                      <option value="4">4 pessoas</option>
                      <option value="5">5 pessoas</option>
                      <option value="6">6 pessoas</option>
                      <option value="7">7 pessoas</option>
                      <option value="8">8 pessoas</option>
                    </select>
                    <span className="campo__erro" id="erro-pessoas" data-erro="pessoas"></span>
                  </div>
                  <div className="campo" data-campo="nome">
                    <label htmlFor="nome">Nome de quem reserva</label>
                    <input id="nome" name="nome" type="text" autoComplete="name" placeholder="Helena Bittencourt" required aria-describedby="erro-nome" />
                    <span className="campo__erro" id="erro-nome" data-erro="nome"></span>
                  </div>
                </div>

                <div className="campo" data-campo="telefone">
                  <label htmlFor="telefone">Telefone com DDD</label>
                  <input id="telefone" name="telefone" type="tel" inputMode="tel" autoComplete="tel" placeholder="(11) 90000-0000" required aria-describedby="erro-telefone dica-telefone" />
                  <span className="campo__dica" id="dica-telefone">É por aqui que a confirmação chega, no WhatsApp.</span>
                  <span className="campo__erro" id="erro-telefone" data-erro="telefone"></span>
                </div>

                <div className="campo" data-campo="restricao">
                  <label htmlFor="restricao">Restrição alimentar</label>
                  <select id="restricao" name="restricao" required aria-describedby="erro-restricao">
                    <option value="">Escolha uma opção</option>
                    <option value="nenhuma">Nenhuma</option>
                    <option value="vegetariano">Vegetariano</option>
                    <option value="sem-gluten">Sem glúten</option>
                    <option value="alergia-frutos-do-mar">Alergia a frutos do mar</option>
                    <option value="outro">Outro</option>
                  </select>
                  <span className="campo__dica" id="dica-restricao" hidden>O menu vegetariano é R$ 240 por pessoa, montado no dia com o que a horta mandou.</span>
                  <span className="campo__erro" id="erro-restricao" data-erro="restricao"></span>
                </div>

                <div className="campo" data-campo="restricao-outro" hidden>
                  <label htmlFor="restricao-outro">O que a cozinha precisa saber</label>
                  <input id="restricao-outro" name="restricao-outro" type="text" placeholder="Intolerância a lactose, sem carne vermelha…" aria-describedby="erro-restricao-outro" />
                  <span className="campo__erro" id="erro-restricao-outro" data-erro="restricao-outro"></span>
                </div>

                <p className="aviso" id="aviso-reserva" aria-live="polite" hidden></p>

                <button className="botao botao--largo" type="submit" id="btn-reservar">Reservar mesa</button>
                <p className="miudo">Demonstração: nenhum dado sai desta página. Nada é enviado, nada é guardado.</p>
              </form>

              {/* aria-live fica no container que já existe: o texto é trocado, não escondido */}
              <div className="recibo" id="recibo" aria-live="polite">
                <p className="recibo__vazio">Nenhuma reserva pedida ainda. Escolha data, horário e número de pessoas — a casa responde pelo WhatsApp em até 2 horas.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ============ A CASA E O CHEF: a passagem quieta ============ */}
        <section className="secao secao--casa" id="casa">
          <div className="tela casa__grade">
            <div className="casa__texto">
              <h2>Uma cozinha de bairro que resolveu não mudar de endereço.</h2>
              <p className="casa__abre">A Mesa 12 abriu em 2019 numa esquina do Cambuci, entre uma oficina e uma casa de tintas, onde antes funcionava um bar de esquina com sinuca. Nara Bittencourt, que cozinha todas as noites, passou três anos no Recôncavo Baiano, dois anos numa cozinha de bairro em Lisboa e voltou para São Paulo com uma ideia simples: escrever o menu depois de comprar, e não o contrário.</p>
              <p>O forno a lenha foi levantado no primeiro ano, com tijolo refratário e barro, e acende às 14h de toda quinta. É ele que faz a costela de 12 horas do sexto tempo e o pão de fermentação natural que sai às 18h. A lenha é de eucalipto de reflorestamento, de um sítio em Suzano.</p>
              <p>Bruno Cavalcanti, sócio e responsável pela sala, escolhe a carta com a cozinha e compra de 12 produtores num raio de 90 km: ovos em Mairiporã, ervas em Parelheiros, mel na Serra do Japi, peixe na costa de Ubatuba, queijo na Canastra. Quando um deles não entrega, o prato muda — e o menu é reescrito na quarta à noite, à mão, antes de ser impresso.</p>
            </div>

            <aside className="noite" aria-labelledby="noite-titulo">
              <p className="noite__titulo" id="noite-titulo">A noite, tempo por tempo</p>
              <ol className="noite__lista">
                <li><b>19h</b><span>A casa abre. A primeira taça da harmonização sai na mesa.</span></li>
                <li><b>19h30</b><span>Primeiro tempo. A cozinha serve todos ao mesmo tempo, por mesa.</span></li>
                <li><b>21h</b><span>Última entrada da noite. Quem chega agora pega os sete tempos.</span></li>
                <li><b>22h30</b><span>Sobremesa, café da Mogiana e a conta, se você quiser ir.</span></li>
                <li><b>23h30</b><span>A cozinha fecha. A sala fica aberta até a última mesa sair.</span></li>
              </ol>
              <p className="noite__nota">Chegue com 10 minutos de folga: o primeiro tempo não espera.</p>
            </aside>
          </div>
        </section>

        {/* ============ ADEGA ============ */}
        <section className="secao secao--adega" id="adega">
          <div className="tela">
            <div className="secao__cabeca">
              <h2>Seis rótulos que ficam. O resto da carta gira com o menu.</h2>
              <p>Bruno prova às segundas, com a cozinha do lado, e só entra na carta o que aguenta o tucupi, a brasa e o queijo curado. Estes seis estão aqui desde a abertura ou entraram para não sair.</p>
            </div>

            <ol className="vinhos">
              <li>
                <div className="vinho__topo">
                  <h3>Terra Fria · brut nature</h3>
                  <b className="vinho__preco">R$ 260</b>
                </div>
                <p className="vinho__ficha">Pinto Bandeira, Serra Gaúcha · espumante · 30 meses em garrafa</p>
                <p className="vinho__razao">É a primeira taça da harmonização. Sem açúcar no licor, corta a gema curada do primeiro tempo e limpa a boca para o peixe.</p>
              </li>
              <li>
                <div className="vinho__topo">
                  <h3>Alto Benedito · riesling itálico</h3>
                  <b className="vinho__preco">R$ 185</b>
                </div>
                <p className="vinho__ficha">Vale dos Vinhedos, Serra Gaúcha · branco seco · fermentado em inox</p>
                <p className="vinho__razao">Acidez alta para o tucunaré com tucupi. É o vinho que mais sai em taça, e o que a casa abre quando alguém diz que não gosta de branco.</p>
              </li>
              <li>
                <div className="vinho__topo">
                  <h3>Estância Colina · pinot noir</h3>
                  <b className="vinho__preco">R$ 240</b>
                </div>
                <p className="vinho__ficha">São Roque, São Paulo · tinto leve · 8 meses em barrica de segundo uso</p>
                <p className="vinho__razao">O único paulista da carta, feito a 60 km daqui. A casa traz a cada safra, e é o tinto que a cozinha pede para a costela de 12 horas.</p>
              </li>
              <li>
                <div className="vinho__topo">
                  <h3>Ponte Alta · laranja de uva Goethe</h3>
                  <b className="vinho__preco">R$ 230</b>
                </div>
                <p className="vinho__ficha">Urussanga, Santa Catarina · vinho de maceração · 8 dias com a casca</p>
                <p className="vinho__razao">Entrou para acompanhar o tucupi e ficou: o amargor leve da casca conversa com o jambu sem apagar o peixe. Servido a 12 °C.</p>
              </li>
              <li>
                <div className="vinho__topo">
                  <h3>Bodega Del Sur · malbec de altitude</h3>
                  <b className="vinho__preco">R$ 320</b>
                </div>
                <p className="vinho__ficha">Valle de Uco, Mendoza, Argentina · tinto · 1.100 m de altitude</p>
                <p className="vinho__razao">O importado mais pedido da casa. Fruta madura e tanino macio para quem quer um tinto maior que o pinot e não quer sair do Brasil para pagar menos.</p>
              </li>
              <li>
                <div className="vinho__topo">
                  <h3>Domaine Les Causses · chenin blanc</h3>
                  <b className="vinho__preco">R$ 390</b>
                </div>
                <p className="vinho__ficha">Vale do Loire, França · branco · colheita de outubro de 2022</p>
                <p className="vinho__razao">Fica na carta pela sobremesa: metade seca, metade doce, é o que a casa serve em meia taça para fechar a noite sem doce demais.</p>
              </li>
            </ol>

            <p className="adega__nota">Taça avulsa a partir de R$ 48. Quem quiser trazer o próprio vinho paga R$ 90 de rolha, e o Bruno abre na mesa. Garrafa fechada para levar sai com 20% sobre o preço da carta.</p>
          </div>
        </section>

        {/* ============ PERGUNTAS ============ */}
        <section className="secao secao--duvidas" id="duvidas">
          <div className="tela">
            <div className="secao__cabeca">
              <h2>O que perguntam antes de reservar.</h2>
            </div>
            <div className="perguntas">
              <details className="pergunta" open>
                <summary>Preciso escolher o que vou comer?<span className="mais" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M4 12h16" /><path className="mais__v" d="M12 4v16" /></svg></span></summary>
                <p>Não. O menu é fechado, sete tempos, e muda conforme o que os produtores entregam. Quem não come alguma coisa avisa na reserva: a cozinha refaz o tempo sem aquele ingrediente ou troca o prato inteiro. O menu vegetariano é montado no dia, a R$ 240 por pessoa.</p>
              </details>
              <details className="pergunta">
                <summary>Quanto tempo dura o jantar?<span className="mais" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M4 12h16" /><path className="mais__v" d="M12 4v16" /></svg></span></summary>
                <p>Cerca de duas horas e meia, do primeiro ao último tempo. A cozinha serve todos ao mesmo tempo e não acelera o ritmo da mesa. Reservas às 21h fazem o menu inteiro, com a sobremesa perto das 23h.</p>
              </details>
              <details className="pergunta">
                <summary>Dá para levar criança?<span className="mais" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M4 12h16" /><path className="mais__v" d="M12 4v16" /></svg></span></summary>
                <p>A partir de 10 anos, com o menu completo. Não temos menu infantil, cadeirão nem cadeira de rodas na sala — o prédio é de 1948 e a entrada tem dois degraus. Avise na reserva e a equipe ajuda na chegada.</p>
              </details>
              <details className="pergunta">
                <summary>Como funciona a harmonização?<span className="mais" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M4 12h16" /><path className="mais__v" d="M12 4v16" /></svg></span></summary>
                <p>São cinco taças para sete tempos, por R$ 190: os tempos 4 e 7 saem com bebida da casa, sem álcool. Quem não bebe faz a versão sem álcool por R$ 120, com kombucha e sucos fermentados aqui dentro. Também dá para pedir taças avulsas durante a noite.</p>
              </details>
              <details className="pergunta">
                <summary>Consigo estacionar no Cambuci?<span className="mais" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M4 12h16" /><path className="mais__v" d="M12 4v16" /></svg></span></summary>
                <p>A casa tem convênio com o estacionamento da Rua do Lavapés, a 80 metros da porta, por R$ 25 a noite inteira. Na porta há duas vagas para embarque e desembarque, e a rua é tranquila depois das 22h.</p>
              </details>
              <details className="pergunta">
                <summary>Vocês fecham a casa para um grupo?<span className="mais" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M4 12h16" /><path className="mais__v" d="M12 4v16" /></svg></span></summary>
                <p>Sim, às segundas, terças e quartas, quando a casa não abre ao público. São 28 lugares, menu fechado e carta enxuta, com orçamento por pessoa. Escreva para oi@mesa12.com.br contando a data e o número de pessoas.</p>
              </details>
            </div>
          </div>
        </section>

        {/* ============ ONDE FICAMOS: fecho com formulário validado ============ */}
        <section className="secao secao--onde" id="onde">
          <div className="tela onde__grade">
            <div className="onde__texto">
              <h2>Rua Clímaco Barbosa, 412 — Cambuci, São Paulo.</h2>
              <p className="onde__lead">Uma porta estreita entre a oficina e a casa de tintas, com uma lâmpada acesa em cima. Não tem letreiro grande: é a porta com o número 12 pintado à mão.</p>
              <dl className="onde__dados">
                <div>
                  <dt>Horário</dt>
                  <dd>Quinta a sábado, das 19h às 23h30. Fechado de domingo a quarta, quando a casa só abre para grupos fechados.</dd>
                </div>
                <div>
                  <dt>Telefone e WhatsApp</dt>
                  <dd><a href="tel:+5511900000000">(11) 90000-0000</a> · oi@mesa12.com.br</dd>
                </div>
                <div>
                  <dt>Como chegar</dt>
                  <dd>12 minutos a pé da estação São Joaquim, na Linha 1-Azul. Os ônibus 4113-10 e 5106-10 param na esquina da Rua do Lavapés. Estacionamento conveniado a 80 metros, R$ 25 a noite.</dd>
                </div>
                <div>
                  <dt>CEP</dt>
                  <dd>01523-000 · Cambuci, São Paulo — SP</dd>
                </div>
              </dl>

              {/* Mapa desenhado: a imagem deste mundo é traço, não foto */}
              <svg className="mapa" viewBox="0 0 360 210" role="img" aria-labelledby="mapa-titulo">
                <title id="mapa-titulo">Mapa esquemático do quarteirão: a Mesa 12 fica na Rua Clímaco Barbosa, esquina com a Rua do Lavapés, no Cambuci.</title>
                <path className="mapa__rua" d="M6 52 354 34" />
                <path className="mapa__rua" d="M104 6 104 204" />
                <path className="mapa__rua mapa__rua--principal" d="M6 126 354 118" />
                <path className="mapa__rua" d="M40 206 322 158" />
                <rect className="mapa__quadra" x="132" y="66" width="86" height="36" />
                <rect className="mapa__quadra" x="236" y="58" width="62" height="44" />
                <rect className="mapa__quadra" x="24" y="140" width="58" height="34" />
                <rect className="mapa__casa" x="97" y="119" width="14" height="14" />
                <rect className="mapa__estacionamento" x="97" y="152" width="14" height="14" />
                <text className="mapa__rotulo" x="176" y="24">Rua do Cambuci</text>
                <text className="mapa__rotulo" transform="translate(96 152) rotate(-90)" x="0" y="0">Rua do Lavapés</text>
                <text className="mapa__rotulo mapa__rotulo--forte" x="186" y="142">Rua Clímaco Barbosa</text>
                <text className="mapa__rotulo" x="46" y="200">Av. Lins de Vasconcelos</text>
                <text className="mapa__rotulo" x="120" y="114">Mesa 12 · nº 412</text>
                <text className="mapa__rotulo" x="120" y="164">estacionamento conveniado</text>
                <path className="mapa__escala" d="M282 198h40" />
                <text className="mapa__rotulo" x="282" y="192">100 m</text>
              </svg>
            </div>

            <div className="aviso-menu">
              <h3 className="aviso-menu__titulo">Receber o menu da próxima estação</h3>
              <p className="aviso-menu__texto">O menu de outono entra em 20 de março. A gente escreve um e-mail na véspera, com os sete tempos e os produtores da estação. Nada além disso.</p>
              <form id="form-aviso" className="formulario" noValidate>
                <div className="campo" data-campo="aviso-nome">
                  <label htmlFor="aviso-nome">Seu nome</label>
                  <input id="aviso-nome" name="aviso-nome" type="text" autoComplete="name" placeholder="Helena" aria-describedby="erro-aviso-nome" />
                  <span className="campo__erro" id="erro-aviso-nome" data-erro="aviso-nome"></span>
                </div>
                <div className="campo" data-campo="aviso-email">
                  <label htmlFor="aviso-email">E-mail</label>
                  <input id="aviso-email" name="aviso-email" type="email" autoComplete="email" placeholder="helena@exemplo.com.br" aria-describedby="erro-aviso-email" />
                  <span className="campo__erro" id="erro-aviso-email" data-erro="aviso-email"></span>
                </div>
                <button className="botao botao--largo" type="submit" id="btn-aviso">Quero receber o menu</button>
                <p className="recado" id="recado-aviso" aria-live="polite"></p>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="rodape">
        <div className="tela rodape__grade">
          <p><strong>Mesa 12</strong> · cozinha autoral brasileira · Rua Clímaco Barbosa, 412, Cambuci, São Paulo · (11) 90000-0000</p>
          <p>Demonstração de catálogo. Nome, preços e textos são fictícios.</p>
          <p><a href="/">Voltar ao catálogo de modelos</a></p>
        </div>
      </footer>
    </>
  );
}
