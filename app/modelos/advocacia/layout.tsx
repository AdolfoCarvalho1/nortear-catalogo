import type { Metadata, Viewport } from 'next';
import '@/modelos/03-advocacia/estilo.css';

export const metadata: Metadata = {
  title: 'Fontes & Prado — advocacia empresarial em São Paulo',
  description:
    'Sociedade de advogados em São Paulo para contratos, societário, trabalhista empresarial, regulatório e recuperação de crédito. 14 advogados, 6 sócios, desde 2004. Primeira resposta em até 4 horas úteis.',
  openGraph: {
    title: 'Fontes & Prado — advocacia empresarial em São Paulo',
    description:
      'Sociedade de advogados em São Paulo para contratos, societário, trabalhista empresarial, regulatório e recuperação de crédito. 14 advogados, 6 sócios, desde 2004. Primeira resposta em até 4 horas úteis.',
    locale: 'pt_BR',
    type: 'website'
  },
  icons: {
    icon: [
      {
        url:
          'data:image/svg+xml,' +
          encodeURIComponent(
            "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' fill='#FFFFFF'/><rect width='32' height='3' fill='#9A7B4F'/><rect x='6' y='10' width='20' height='2' fill='#101A2B'/><rect x='6' y='16' width='14' height='2' fill='#5A6B82'/><rect x='6' y='22' width='17' height='2' fill='#5A6B82'/></svg>"
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
export default function LayoutFontesPrado({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
