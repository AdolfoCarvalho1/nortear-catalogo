'use client';

import { useMemo, useState } from 'react';
import { MODELOS, brl, faixaDe, type Faixa } from '@/app/data/catalogo';

type Filtro = 'todos' | Faixa;

const FILTROS: { id: Filtro; rotulo: string }[] = [
  { id: 'todos', rotulo: 'Todos os 10' },
  { id: 'essencial', rotulo: 'Até R$ 300' },
  { id: 'profissional', rotulo: 'Até R$ 900' },
  { id: 'sobmedida', rotulo: 'Linha sob medida' }
];

/**
 * A grade de modelos.
 *
 * Os dez cartões são renderizados no servidor dentro deste componente cliente,
 * e o filtro apenas alterna uma classe — filtrar não desmonta cartão nenhum,
 * então a prévia não recarrega e o estado da página não se perde.
 */
export default function GradeModelos() {
  const [filtro, setFiltro] = useState<Filtro>('todos');

  const visiveis = useMemo(
    () => (filtro === 'todos' ? MODELOS.length : MODELOS.filter((m) => faixaDe(m) === filtro).length),
    [filtro]
  );

  return (
    <>
      <div className="filtros revelar" role="group" aria-label="Filtrar modelos por faixa de preço">
        {FILTROS.map((f) => (
          <button
            key={f.id}
            className="filtro"
            type="button"
            aria-pressed={filtro === f.id}
            onClick={() => setFiltro(f.id)}
          >
            {f.rotulo}
          </button>
        ))}
        <span className="filtros__contagem" aria-live="polite">
          {visiveis} {visiveis === 1 ? 'modelo' : 'modelos'}
        </span>
      </div>

      <ul className="grade" id="grade">
        {MODELOS.map((m) => {
          const escondido = filtro !== 'todos' && faixaDe(m) !== filtro;
          return (
            <li key={m.id} className={`modelo revelar${escondido ? ' oculto' : ''}`} data-faixa={faixaDe(m)}>
              <div className="modelo__quadro">
                {/* Prévia estática capturada do modelo rodando em 1440x990. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/thumbs/${m.id}.png`}
                  alt={`Prévia do modelo ${m.nome}, para ${m.nicho.toLowerCase()}`}
                  loading="lazy"
                  width={1440}
                  height={990}
                  decoding="async"
                />
                <span className="modelo__numero" aria-hidden="true">
                  {m.numero}
                </span>
              </div>

              <div className="modelo__corpo">
                <div className="modelo__topo">
                  <span className="modelo__nicho">{m.nicho}</span>
                  <span className="modelo__preco">{brl(m.preco)}</span>
                </div>
                <h3>{m.nome}</h3>
                <p className="modelo__promessa">{m.promessa}</p>
                <p className="modelo__destaque">
                  <b>O que ele tem de próprio</b>
                  {m.destaque}
                </p>
                <div className="amostra" title="Paleta do modelo">
                  {m.paleta.map((cor) => (
                    <i key={cor} style={{ background: cor }} />
                  ))}
                  <span>{m.tipografia}</span>
                </div>
                <div className="modelo__rodape">
                  <a className="botao botao--pequeno" href={m.rota}>
                    Abrir o modelo
                  </a>
                  <a
                    className="botao botao--pequeno botao--vazio"
                    href="#orcamento"
                    data-modelo={m.id}
                  >
                    Quero este
                  </a>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
