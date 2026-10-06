import type { Metadata, Viewport } from 'next';
import '@/modelos/01-saas-ia/estilo.css';

export const metadata: Metadata = {
  title: 'Copiloto — a IA que responde com o contexto da sua empresa',
  description:
    'Copiloto conecta e-mail, CRM, contratos e tickets e responde com a fonte citada. Implantação em 5 dias, dados no Brasil, LGPD.',
  openGraph: {
    title: 'Copiloto — a IA que responde com o contexto da sua empresa',
    description:
      'Copiloto conecta e-mail, CRM, contratos e tickets e responde com a fonte citada. Implantação em 5 dias, dados no Brasil, LGPD.',
    locale: 'pt_BR',
    type: 'website'
  },
  icons: {
    icon: [
      {
        url:
          'data:image/svg+xml,' +
          encodeURIComponent(
            "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='#3A5BE0'/><path d='M9 20l7-9 7 9z' fill='#08090C'/></svg>"
          ),
        type: 'image/svg+xml'
      }
    ]
  }
};

export const viewport: Viewport = {
  themeColor: '#08090C',
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
export default function LayoutCopiloto({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
