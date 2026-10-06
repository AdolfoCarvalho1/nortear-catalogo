import type { Metadata, Viewport } from 'next';
import '@/modelos/06-clinica/estilo.css';

export const metadata: Metadata = {
  title: 'Clara — pele cuidada com critério clínico | dermatologia estética em Florianópolis',
  description:
    'Clínica Clara: dermatologia estética no Centro de Florianópolis. Cada protocolo começa com avaliação dermatológica e termina com alta. Oito procedimentos com duração, sessões, preço por sessão e contraindicações à vista.',
  openGraph: {
    title: 'Clara — pele cuidada com critério clínico | dermatologia estética em Florianópolis',
    description:
      'Clínica Clara: dermatologia estética no Centro de Florianópolis. Cada protocolo começa com avaliação dermatológica e termina com alta. Oito procedimentos com duração, sessões, preço por sessão e contraindicações à vista.',
    locale: 'pt_BR',
    type: 'website'
  },
  icons: {
    icon: [
      {
        url:
          'data:image/svg+xml,' +
          encodeURIComponent(
            "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='7' fill='#F6F1EC'/><circle cx='16' cy='16' r='9' fill='none' stroke='#B98A76' stroke-width='2'/><path d='M16 7v18' stroke='#5E6B5F' stroke-width='2'/></svg>"
          ),
        type: 'image/svg+xml'
      }
    ]
  }
};

export const viewport: Viewport = {
  themeColor: '#F6F1EC',
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
export default function LayoutClinica({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
