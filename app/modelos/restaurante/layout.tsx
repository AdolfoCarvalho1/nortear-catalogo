import type { Metadata, Viewport } from 'next';
import '@/modelos/02-restaurante/estilo.css';

export const metadata: Metadata = {
  title: 'Mesa 12 — menu de estação, 7 tempos, no Cambuci',
  description:
    'Cozinha autoral brasileira no Cambuci, São Paulo. Menu degustação de 7 tempos por R$ 290 por pessoa, 28 lugares, jantar de quinta a sábado. Reserva com data e horário.',
  openGraph: {
    title: 'Mesa 12 — menu de estação, 7 tempos, no Cambuci',
    description:
      'Cozinha autoral brasileira no Cambuci, São Paulo. Menu degustação de 7 tempos por R$ 290 por pessoa, 28 lugares, jantar de quinta a sábado. Reserva com data e horário.',
    locale: 'pt_BR',
    type: 'website'
  },
  icons: {
    icon: [
      {
        url:
          'data:image/svg+xml,' +
          encodeURIComponent(
            "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' fill='#F4EDE2'/><circle cx='16' cy='14' r='6' fill='none' stroke='#1C1A15' stroke-width='2'/><path d='M7 25h18' stroke='#B4552A' stroke-width='2'/></svg>"
          ),
        type: 'image/svg+xml'
      }
    ]
  }
};

export const viewport: Viewport = {
  themeColor: '#F4EDE2',
  width: 'device-width',
  initialScale: 1
};

/**
 * Root layout do modelo.
 *
 * Cada modelo tem o próprio <html>: são dez identidades visuais distintas e
 * cada uma precisa do seu idioma, cor de tema e folha de estilo. Por isso cada
 * rota de modelo é um root layout independente, e não um layout aninhado.
 */
export default function LayoutMesa12({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
