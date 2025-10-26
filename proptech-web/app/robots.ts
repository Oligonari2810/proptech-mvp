import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/comprar', '/alquilar', '/invertir', '/valorar', '/contacto'],
      disallow: ['/admin', '/api/'],
    },
    sitemap: 'https://habitatprord.com/sitemap.xml',
  }
}
