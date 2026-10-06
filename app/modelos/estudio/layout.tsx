import type { Metadata, Viewport } from 'next';
import '@/modelos/10-estudio/estilo.css';

export const metadata: Metadata = {
  title: 'Ruído — estúdio de identidade no Rio de Janeiro',
  description:
    'Estúdio de branding em Botafogo, Rio de Janeiro. Identidade, embalagem, motion e sistema de marca para empresas de 30 a 500 pessoas. 74 marcas desde 2016.',
  openGraph: {
    title: 'Ruído — estúdio de identidade no Rio de Janeiro',
    description:
      'Estúdio de branding em Botafogo, Rio de Janeiro. Identidade, embalagem, motion e sistema de marca para empresas de 30 a 500 pessoas.',
    locale: 'pt_BR',
    type: 'website'
  },
  icons: {
    icon: [
      {
        url:
          'data:image/svg+xml,' +
          encodeURIComponent(
            "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' fill='#0A0A0A'/><rect x='4' y='4' width='24' height='24' fill='none' stroke='#F2F0EB' stroke-width='2.4'/><rect x='4' y='19' width='24' height='5' fill='#E8541F'/></svg>"
          ),
        type: 'image/svg+xml'
      }
    ]
  }
};

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
  width: 'device-width',
  initialScale: 1
};

export default function LayoutRuido({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
