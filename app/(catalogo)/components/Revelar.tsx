'use client';

import { useEffect } from 'react';

/**
 * Revelação por rolagem, uma vez por página.
 *
 * A regra que importa: conteúdo nunca pode ficar invisível. Por isso o
 * destino da âncora é revelado na hora, há uma rede de segurança depois de
 * 1,2s para o que já está na tela, e a impressão revela tudo. Sem isso, quem
 * chega por link direto (#precos) ou imprime vê seções em branco.
 */
export default function Revelar() {
  useEffect(() => {
    const elementos = Array.from(document.querySelectorAll<HTMLElement>('.revelar'));
    if (!elementos.length) return;

    const revelarDentro = (alvo: Element | null) => {
      if (!alvo) return;
      if (alvo.classList.contains('revelar')) alvo.classList.add('visivel');
      alvo.querySelectorAll<HTMLElement>('.revelar').forEach((el) => el.classList.add('visivel'));
      alvo.closest('.revelar')?.classList.add('visivel');
    };

    const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduzido || !('IntersectionObserver' in window)) {
      elementos.forEach((el) => el.classList.add('visivel'));
    } else {
      const observador = new IntersectionObserver(
        (entradas) => {
          entradas.forEach((e) => {
            if (!e.isIntersecting) return;
            e.target.classList.add('visivel');
            observador.unobserve(e.target);
          });
        },
        { rootMargin: '0px 0px -6% 0px', threshold: 0.05 }
      );

      elementos.forEach((el, i) => {
        el.style.transitionDelay = `${Math.min(i % 4, 3) * 70}ms`;
        observador.observe(el);
      });

      if (location.hash) revelarDentro(document.querySelector(location.hash));

      const aoClicar = (ev: MouseEvent) => {
        const link = (ev.target as HTMLElement)?.closest('a[href^="#"]');
        const href = link?.getAttribute('href');
        if (href && href.length > 1) revelarDentro(document.querySelector(href));
      };
      document.addEventListener('click', aoClicar);

      const rede = window.setTimeout(() => {
        elementos
          .filter((el) => !el.classList.contains('visivel'))
          .forEach((el) => {
            const r = el.getBoundingClientRect();
            if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('visivel');
          });
      }, 1200);

      const aoImprimir = () => elementos.forEach((el) => el.classList.add('visivel'));
      window.addEventListener('beforeprint', aoImprimir);

      return () => {
        observador.disconnect();
        document.removeEventListener('click', aoClicar);
        window.removeEventListener('beforeprint', aoImprimir);
        window.clearTimeout(rede);
      };
    }
  }, []);

  return null;
}
