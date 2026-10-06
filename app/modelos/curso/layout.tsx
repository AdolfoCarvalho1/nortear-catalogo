import type { Metadata, Viewport } from 'next';
import '@/modelos/08-curso/estilo.css';

export const metadata: Metadata = {
  title: 'Oficina — redação publicitária em 6 semanas, com correção individual',
  description:
    'Oficina é o curso de redação publicitária de Bia Sarmento: 6 semanas, 42 horas, um encontro ao vivo por semana e um exercício corrigido por escrito. Próxima turma em 9 de março, 12 vagas.',
  openGraph: {
    title: 'Oficina — redação publicitária em 6 semanas, com correção individual',
    description:
      'Oficina é o curso de redação publicitária de Bia Sarmento: 6 semanas, 42 horas, um encontro ao vivo por semana e um exercício corrigido por escrito. Próxima turma em 9 de março, 12 vagas.',
    locale: 'pt_BR',
    type: 'website'
  },
  icons: {
    icon: [
      {
        url:
          'data:image/svg+xml,' +
          encodeURIComponent(
            "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='#FBF8F2'/><path d='M11 21l2.5-9 4-4.5 3.5 4L16.5 21z' fill='#3B4FD8'/><rect x='10' y='24' width='12' height='2' rx='1' fill='#E9B32C'/></svg>"
          ),
        type: 'image/svg+xml'
      }
    ]
  }
};

export const viewport: Viewport = {
  themeColor: '#FBF8F2',
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
export default function LayoutOficina({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
