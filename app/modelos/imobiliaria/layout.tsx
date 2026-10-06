import type { Metadata, Viewport } from 'next';
import '@/modelos/07-imobiliaria/estilo.css';

export const metadata: Metadata = {
  title: 'Costa & Vilela — 38 imóveis visitados na Grande Vitória',
  description:
    'Imobiliária boutique em Vitória: 38 imóveis na carteira, todos visitados por um dos sócios antes de entrar no site. Ficha completa, planta baixa e dossiê antes da visita.',
  openGraph: {
    title: 'Costa & Vilela — 38 imóveis visitados na Grande Vitória',
    description:
      'Imobiliária boutique em Vitória: 38 imóveis na carteira, todos visitados por um dos sócios antes de entrar no site. Ficha completa, planta baixa e dossiê antes da visita.',
    locale: 'pt_BR',
    type: 'website'
  },
  icons: {
    icon: [
      {
        url:
          'data:image/svg+xml,' +
          encodeURIComponent(
            "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' fill='#F7F4EE'/><g fill='none' stroke='#1F4E5F' stroke-width='2'><path d='M6 6h20v20H6z'/><path d='M6 19h9M15 19v7'/></g><rect x='21' y='9' width='5' height='5' fill='#C4A47C'/></svg>"
          ),
        type: 'image/svg+xml'
      }
    ]
  }
};

export const viewport: Viewport = {
  themeColor: '#F7F4EE',
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
export default function LayoutCostaVilela({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
