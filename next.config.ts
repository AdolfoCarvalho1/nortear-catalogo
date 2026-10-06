import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  /* O catálogo abre as prévias de /thumbs/*.png, servidas de public/.
     Os PNG originais vivem em assets/thumbs/ porque os scripts de captura
     (Chrome headless) escrevem lá; `npm run thumbs` copia para public/. */
  images: {
    // As prévias são PNG estáticos locais; não há otimização remota envolvida.
    unoptimized: true
  },

  /* Cabeçalho de segurança: cada modelo é uma página pública que vai ser
     publicada em domínio de cliente. */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }
        ]
      }
    ];
  }
};

export default nextConfig;
