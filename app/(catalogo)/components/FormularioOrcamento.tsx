'use client';

import { useEffect, useRef, useState } from 'react';
import { AGENCIA, MODELOS, PACOTES, brl } from '@/app/data/catalogo';

type Campos = 'nome' | 'empresa' | 'email' | 'whats' | 'modelo' | 'pacote';

const REGRAS: Record<Campos, (v: string) => string> = {
  nome: (v) => (v.trim().length >= 2 ? '' : 'Escreva pelo menos 2 letras.'),
  empresa: (v) => (v.trim().length >= 2 ? '' : 'Diga o nome do negócio ou a cidade.'),
  email: (v) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
      ? ''
      : 'Confira o e-mail: falta algo como nome@dominio.com.br.',
  whats: (v) => (v.replace(/\D/g, '').length >= 10 ? '' : 'Inclua o DDD, com 10 ou 11 números.'),
  modelo: (v) => (v ? '' : 'Escolha um modelo — pode ser o mais parecido.'),
  pacote: (v) => (v ? '' : 'Escolha um pacote.')
};

const VAZIO: Record<Campos, string> = {
  nome: '',
  empresa: '',
  email: '',
  whats: '',
  modelo: '',
  pacote: ''
};

function mascaraTelefone(valor: string): string {
  const d = valor.replace(/\D/g, '').slice(0, 11);
  if (d.length > 10) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length > 6) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  if (d.length > 2) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return d;
}

/**
 * Formulário de orçamento.
 *
 * Valida de verdade e monta o escopo na tela, mas não envia para servidor
 * nenhum — é uma demonstração. Para receber os pedidos, troque o bloco do
 * `setTimeout` por uma chamada a um endpoint (Formspree, Resend, webhook).
 */
export default function FormularioOrcamento() {
  const [valores, setValores] = useState<Record<Campos, string>>(VAZIO);
  const [erros, setErros] = useState<Record<Campos, string>>(VAZIO);
  const [enviando, setEnviando] = useState(false);
  const [recibo, setRecibo] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  /* Os botões "Quero este" e "Escolher pacote" preenchem os selects.
     Sem isso o visitante teria que reescolher o que já clicou. */
  useEffect(() => {
    const aoClicar = (ev: MouseEvent) => {
      const alvo = (ev.target as HTMLElement)?.closest('[data-modelo], [data-pacote]') as HTMLElement | null;
      if (!alvo) return;
      if (alvo.dataset.modelo) setValores((v) => ({ ...v, modelo: alvo.dataset.modelo! }));
      if (alvo.dataset.pacote) setValores((v) => ({ ...v, pacote: alvo.dataset.pacote! }));
      document.getElementById('nome')?.focus({ preventScroll: true });
    };
    document.addEventListener('click', aoClicar);
    return () => document.removeEventListener('click', aoClicar);
  }, []);

  const definir = (campo: Campos, valor: string) => {
    setValores((v) => ({ ...v, [campo]: valor }));
    if (erros[campo]) setErros((e) => ({ ...e, [campo]: REGRAS[campo](valor) }));
  };

  const validar = (campo: Campos) => {
    const msg = REGRAS[campo](valores[campo]);
    setErros((e) => ({ ...e, [campo]: msg }));
    return !msg;
  };

  const enviar = (ev: React.FormEvent) => {
    ev.preventDefault();
    const campos = Object.keys(REGRAS) as Campos[];
    const resultados = campos.map((c) => ({ campo: c, ok: validar(c) }));
    const invalido = resultados.find((r) => !r.ok);
    if (invalido) {
      formRef.current?.querySelector<HTMLElement>(`[name="${invalido.campo}"]`)?.focus();
      return;
    }

    setEnviando(true);
    const modelo = MODELOS.find((m) => m.id === valores.modelo);
    const pacote = PACOTES.find((p) => p.id === valores.pacote);

    /* Ponto de integração: aqui entraria o fetch para o seu endpoint. */
    setTimeout(() => {
      setEnviando(false);
      setRecibo(
        `Prontinho, ${valores.nome.trim().split(' ')[0]}. Numa versão publicada, este pedido chegaria por e-mail agora: ` +
          `modelo ${modelo?.nome} (${modelo?.nicho}), pacote ${pacote?.nome} — ${brl(pacote?.preco ?? 0)}, ` +
          `prazo de ${pacote?.prazo}.`
      );
    }, 550);
  };

  const campo = (nome: Campos, rotulo: string, extra: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div className={`campo${erros[nome] ? ' campo--erro' : ''}`} data-campo={nome}>
      <label htmlFor={nome}>{rotulo}</label>
      <input
        id={nome}
        name={nome}
        value={valores[nome]}
        onChange={(e) => definir(nome, e.target.value)}
        onBlur={() => validar(nome)}
        aria-invalid={Boolean(erros[nome])}
        {...extra}
      />
      <span className="campo__erro" data-erro={nome}>
        {erros[nome]}
      </span>
    </div>
  );

  return (
    <form className="contato" ref={formRef} onSubmit={enviar} noValidate>
      {recibo && (
        <div className="contato__ok" role="status">
          <strong>{recibo.split('. ')[0]}.</strong>
          <br />
          {recibo.split('. ').slice(1).join('. ')}
        </div>
      )}

      <div className="contato__linha">
        {campo('nome', 'Seu nome', { type: 'text', autoComplete: 'name', placeholder: 'Como podemos te chamar' })}
        {campo('empresa', 'Negócio', {
          type: 'text',
          autoComplete: 'organization',
          placeholder: 'Nome do negócio ou cidade'
        })}
      </div>

      <div className="contato__linha">
        {campo('email', 'E-mail', { type: 'email', autoComplete: 'email', placeholder: 'voce@negocio.com.br' })}
        <div className={`campo${erros.whats ? ' campo--erro' : ''}`} data-campo="whats">
          <label htmlFor="whats">WhatsApp</label>
          <input
            id="whats"
            name="whats"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="(11) 90000-0000"
            value={valores.whats}
            onChange={(e) => definir('whats', mascaraTelefone(e.target.value))}
            onBlur={() => validar('whats')}
            aria-invalid={Boolean(erros.whats)}
          />
          <span className="campo__erro" data-erro="whats">
            {erros.whats}
          </span>
        </div>
      </div>

      <div className="contato__linha">
        <div className={`campo${erros.modelo ? ' campo--erro' : ''}`} data-campo="modelo">
          <label htmlFor="modelo">Modelo de interesse</label>
          <select
            id="modelo"
            name="modelo"
            value={valores.modelo}
            onChange={(e) => definir('modelo', e.target.value)}
            onBlur={() => validar('modelo')}
            aria-invalid={Boolean(erros.modelo)}
          >
            <option value="">Escolha um modelo</option>
            {MODELOS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.numero} · {m.nome} — {m.nicho}
              </option>
            ))}
          </select>
          <span className="campo__erro" data-erro="modelo">
            {erros.modelo}
          </span>
        </div>

        <div className={`campo${erros.pacote ? ' campo--erro' : ''}`} data-campo="pacote">
          <label htmlFor="pacote">Pacote</label>
          <select
            id="pacote"
            name="pacote"
            value={valores.pacote}
            onChange={(e) => definir('pacote', e.target.value)}
            onBlur={() => validar('pacote')}
            aria-invalid={Boolean(erros.pacote)}
          >
            <option value="">Escolha um pacote</option>
            {PACOTES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome} — {brl(p.preco)}
              </option>
            ))}
          </select>
          <span className="campo__erro" data-erro="pacote">
            {erros.pacote}
          </span>
        </div>
      </div>

      <div className="campo" data-campo="recado">
        <label htmlFor="recado">O que precisa acontecer no site</label>
        <textarea
          id="recado"
          name="recado"
          placeholder="Ex.: quero reserva de mesa online e um menu que eu mesma consiga trocar."
        />
        <span className="campo__erro" data-erro="recado" />
      </div>

      <div className="abertura__acoes">
        <button className="botao" type="submit" disabled={enviando}>
          {enviando ? 'Montando o escopo…' : 'Receber escopo e valor'}
        </button>
        <span className="contato__aviso">
          Nada é enviado para servidor nenhum: este catálogo é uma demonstração.
        </span>
      </div>

      <ul className="contato__aviso" style={{ display: 'grid', gap: '0.4rem', marginTop: '0.5rem' }}>
        <li>
          WhatsApp <strong>{AGENCIA.whatsapp}</strong>
        </li>
        <li>
          E-mail <strong>{AGENCIA.email}</strong>
        </li>
        <li>{AGENCIA.cidade}</li>
      </ul>
    </form>
  );
}
