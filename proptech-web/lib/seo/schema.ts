// Re-exportar schemas extendidos para mantener compatibilidad
export { 
  organizationSchema,
  generateHomepageSchemas,
  generatePropertySchema,
  generateToolSchema,
} from './schemaExtended'

export const generateOrganizationSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    'name': 'HabitatPro RD',
    'description': 'Plataforma inmobiliaria con valoración inteligente HabitaScore para propiedades en República Dominicana',
    'url': 'https://habitatprord.com',
    'logo': 'https://habitatprord.com/logo.png',
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': 'Santo Domingo',
      'addressRegion': 'Distrito Nacional',
      'addressCountry': 'DO'
    },
    'contactPoint': {
      '@type': 'ContactPoint',
      'telephone': '+1-809-123-4567',
      'contactType': 'customer service',
      'areaServed': 'DO',
      'availableLanguage': 'es'
    },
    'sameAs': [
      'https://www.facebook.com/habitatprord',
      'https://www.instagram.com/habitatprord'
    ]
  }
}

export const generateBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': item.url
    }))
  }
}
