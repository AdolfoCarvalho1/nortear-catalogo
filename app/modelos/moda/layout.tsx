import type { Metadata, Viewport } from 'next';
import '@/modelos/09-moda/estilo.css';

export const metadata: Metadata = {
  title: 'Trama — roupa autoral em pequena tiragem · ateliê em Pinheiros',
  description:
    'Trama faz roupa feminina em pequena tiragem no ateliê em Pinheiros: linho, algodão orgânico, seda e lã. Cada peça entre 30 e 60 unidades, com tecido, tamanhos e estoque à vista.',
  openGraph: {
    title: 'Trama — roupa autoral em pequena tiragem · ateliê em Pinheiros',
    description:
      'Trama faz roupa feminina em pequena tiragem no ateliê em Pinheiros: linho, algodão orgânico, seda e lã. Cada peça entre 30 e 60 unidades, com tecido, tamanhos e estoque à vista.',
    locale: 'pt_BR',
    type: 'website'
  },
  icons: {
    icon: [
      {
        url:
          'data:image/svg+xml,' +
          encodeURIComponent(
            "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' fill='#0D0D0D'/><path d='M8 11h16M16 11v14' stroke='#FFFFFF' stroke-width='2.6' fill='none'/></svg>"
          ),
        type: 'image/svg+xml'
      }
    ]
  }
};

export const viewport: Viewport = {
  themeColor: '#FFFFFF',
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
export default function LayoutTrama({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
