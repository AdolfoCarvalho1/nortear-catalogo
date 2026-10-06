import type { Metadata, Viewport } from 'next';
import '@/modelos/05-fitness/estilo.css';

export const metadata: Metadata = {
  title: 'Forja — personal trainer e studio de treino no Batel, Curitiba',
  description:
    'Studio do personal Rafa Muniz, no Batel: 4 alunos por horário, avaliação de 60 min com 6 testes, plano de 6 semanas e reavaliação medida. Presencial em Curitiba e online com planilha e vídeo.',
  openGraph: {
    title: 'Forja — personal trainer e studio de treino no Batel, Curitiba',
    description:
      'Studio do personal Rafa Muniz, no Batel: 4 alunos por horário, avaliação de 60 min com 6 testes, plano de 6 semanas e reavaliação medida. Presencial em Curitiba e online com planilha e vídeo.',
    locale: 'pt_BR',
    type: 'website'
  },
  icons: {
    icon: [
      {
        url:
          'data:image/svg+xml,' +
          encodeURIComponent(
            "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='4' fill='#111214'/><g fill='#F5F3EF'><rect x='7' y='19' width='4' height='7'/><rect x='14' y='13' width='4' height='13'/></g><rect x='21' y='7' width='4' height='19' fill='#D6F94B'/></svg>"
          ),
        type: 'image/svg+xml'
      }
    ]
  }
};

export const viewport: Viewport = {
  themeColor: '#111214',
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
export default function LayoutForja({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
