import type { Metadata, Viewport } from 'next';
import '@/modelos/04-arquitetura/estilo.css';

export const metadata: Metadata = {
  title: 'Ateliê Horizonte — projeto começa no terreno, não no estilo',
  description:
    'Ateliê de arquitetura e interiores em Belo Horizonte desde 2006. Seis obras em prancha com ficha técnica, processo em 4 etapas e honorários por m² calculados na hora.',
  openGraph: {
    title: 'Ateliê Horizonte — projeto começa no terreno, não no estilo',
    description:
      'Ateliê de arquitetura e interiores em Belo Horizonte desde 2006. Seis obras em prancha com ficha técnica, processo em 4 etapas e honorários por m² calculados na hora.',
    locale: 'pt_BR',
    type: 'website'
  },
  icons: {
    icon: [
      {
        url:
          'data:image/svg+xml,' +
          encodeURIComponent(
            "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' fill='#EDEAE4'/><path d='M6 24h20M10 24V13l6-5 6 5v11' fill='none' stroke='#16181A' stroke-width='2'/><path d='M24 8h3v3' fill='none' stroke='#B0563A' stroke-width='2'/></svg>"
          ),
        type: 'image/svg+xml'
      }
    ]
  }
};

export const viewport: Viewport = {
  themeColor: '#EDEAE4',
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
export default function LayoutAtelieHorizonte({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
