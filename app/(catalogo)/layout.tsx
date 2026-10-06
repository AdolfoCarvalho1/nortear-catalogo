import type { Metadata, Viewport } from 'next';
import './globals.css';
import Revelar from './components/Revelar';

export const metadata: Metadata = {
  title: {
    default: 'Catálogo de modelos de site — Nortear Estúdio',
    template: '%s — Nortear Estúdio'
  },
  description:
    'Dez modelos de site completos, um para cada tipo de negócio, com preço fechado a partir de R$ 300. Escolha o modelo, a gente adapta para a sua marca.',
  applicationName: 'Nortear Estúdio',
  authors: [{ name: 'Nortear Estúdio' }],
  keywords: ['criação de sites', 'modelos de site', 'site para empresa', 'catálogo de sites', 'São Paulo'],
  icons: {
    icon: [
      {
        url:
          'data:image/svg+xml,' +
          encodeURIComponent(
            "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' fill='#0F1B2D'/><path d='M16 7l7 9-7 9-7-9z' fill='#D6431E'/></svg>"
          ),
        type: 'image/svg+xml'
      }
    ]
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Nortear Estúdio',
    title: 'Catálogo de modelos de site — Nortear Estúdio',
    description: 'Dez modelos de site completos, um para cada tipo de negócio. A partir de R$ 300.'
  },
  robots: { index: true, follow: true }
};

export const viewport: Viewport = {
  themeColor: '#F7F5F0',
  width: 'device-width',
  initialScale: 1
};

export default function LayoutCatalogo({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <Revelar />
      </body>
    </html>
  );
}

