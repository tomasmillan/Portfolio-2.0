// path: ./config/middlewares.ts

export default [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          // Añade tu URL de Vercel aquí para permitir iframes (PDFs, etc.)
          'frame-ancestors': ["'self'", 'https://portfolio-20-production-96a6.up.railway.app', 'https://portfolio-2-0-tan-seven.vercel.app'], 
          'frame-src': ["'self'", 'https://portfolio-20-production-96a6.up.railway.app', 'data:', 'https://portfolio-2-0-tan-seven.vercel.app'], 
          'img-src': ["'self'", 'data:', 'blob:', 'https:', 'http:'], 
          'script-src': ["'self'", 'https:', 'http:', "'unsafe-inline'", "'unsafe-eval'"],
          'connect-src': ["'self'", "https:", "http:"],
        },
      },
    },
  },
// Este es el middleware de CORS, también necesita tu URL de Vercel
   {
    name: 'strapi::cors',
    config: {
      enabled: true,
      headers: '*',
      origin: [
        'https://portfolio-2-0-tan-seven.vercel.app', // Tu frontend en Vercel
        'https://portfolio-20-production-96a6.up.railway.app', // Tu propio admin de Strapi en Railway
      ],
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];