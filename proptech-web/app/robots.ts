import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/dashboard/',
          '/profile/',
          '/auth/',
          '/_next/',
          '/static/',
        ],
      },
      // Permitir específicamente páginas públicas importantes
      {
        userAgent: '*',
        allow: [
          '/',
          '/comprar',
          '/alquilar',
          '/vender',
          '/invertir',
          '/valorar',
          '/contacto',
          '/calculadora-impuestos',
          '/calculadora-hipotecaria',
          '/leyes-inmobiliarias',
          '/tramites-inmobiliarios',
          '/confotur',
          '/mapa',
          '/properties/*',
        ],
      },
    ],
    sitemap: 'https://habitatprord.com/sitemap.xml',
  }
}
