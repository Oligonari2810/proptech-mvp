/**
 * Schema Markup Extendido para SEO Masivo
 * Incluye: Organization, WebSite, SearchAction, RealEstateAgent, FinancialProduct, GovernmentService
 */

const baseUrl = 'https://habitatprord.com'

/**
 * Schema: Organization
 */
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${baseUrl}/#organization`,
  name: 'HabitatPro República Dominicana',
  alternateName: 'HabitatPro RD',
  url: baseUrl,
  logo: {
    '@type': 'ImageObject',
    url: `${baseUrl}/logo.png`,
    width: 512,
    height: 512,
  },
  description: 'Plataforma inmobiliaria con IA emocional para compra y venta de propiedades en República Dominicana. Herramientas legales, calculadoras financieras y sistema de reputación verificada.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Santo Domingo',
    addressRegion: 'Distrito Nacional',
    addressCountry: 'DO',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-809-123-4567',
    contactType: 'customer service',
    areaServed: 'DO',
    availableLanguage: ['es', 'en'],
  },
  sameAs: [
    'https://www.facebook.com/habitatprord',
    'https://www.instagram.com/habitatprord',
    'https://twitter.com/habitatprord',
  ],
}

/**
 * Schema: RealEstateAgent
 */
export const realEstateAgentSchema = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  name: 'HabitatPro RD',
  description: 'Plataforma inmobiliaria con valoración inteligente HabitaScore para propiedades en República Dominicana',
  url: baseUrl,
  logo: `${baseUrl}/logo.png`,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Santo Domingo',
    addressRegion: 'Distrito Nacional',
    addressCountry: 'DO',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-809-123-4567',
    contactType: 'customer service',
    areaServed: 'DO',
    availableLanguage: 'es',
  },
  areaServed: {
    '@type': 'Country',
    name: 'República Dominicana',
  },
  serviceType: 'Real estate services',
}

/**
 * Schema: WebSite con SearchAction
 */
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${baseUrl}/#website`,
  url: baseUrl,
  name: 'HabitatPro República Dominicana',
  description: 'Plataforma inmobiliaria con IA emocional para encontrar tu hogar ideal en República Dominicana',
  publisher: {
    '@id': `${baseUrl}/#organization`,
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${baseUrl}/comprar?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
  inLanguage: 'es-DO',
  alternateName: 'HabitatPro RD',
}

/**
 * Schema: FinancialProduct (para calculadoras)
 */
export const financialProductSchema = {
  '@context': 'https://schema.org',
  '@type': 'FinancialProduct',
  name: 'Calculadora Hipotecaria República Dominicana',
  description: 'Calcula tu hipoteca con tasas de interés de bancos dominicanos. Tabla de amortización y comparación entre instituciones financieras.',
  url: `${baseUrl}/calculadora-hipotecaria`,
  provider: {
    '@id': `${baseUrl}/#organization`,
  },
  areaServed: {
    '@type': 'Country',
    name: 'República Dominicana',
  },
  category: 'Mortgage Calculator',
}

/**
 * Schema: Service (para calculadora de impuestos)
 */
export const taxCalculatorServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Calculadora de Impuestos Inmobiliarios RD',
  description: 'Calcula todos los impuestos y costos según las leyes dominicanas: ITBIS, impuesto de transferencia, gastos notariales y más.',
  url: `${baseUrl}/calculadora-impuestos`,
  provider: {
    '@id': `${baseUrl}/#organization`,
  },
  areaServed: {
    '@type': 'Country',
    name: 'República Dominicana',
  },
  serviceType: 'Tax Calculator',
  category: 'Legal and Tax Services',
}

/**
 * Schema: GovernmentService (para trámites)
 */
export const governmentServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'GovernmentService',
  name: 'Trámites Inmobiliarios Guiados - República Dominicana',
  description: 'Guía paso a paso para trámites inmobiliarios en RD: compra-venta, permisos de construcción, inversión turística CONFOTUR.',
  url: `${baseUrl}/tramites-inmobiliarios`,
  provider: {
    '@id': `${baseUrl}/#organization`,
  },
  areaServed: {
    '@type': 'Country',
    name: 'República Dominicana',
  },
  serviceType: 'Government Information',
  category: 'Real Estate Procedures',
}

/**
 * Schema: Article (para leyes inmobiliarias)
 */
export const lawsArticleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  '@id': `${baseUrl}/leyes-inmobiliarias#article`,
  headline: 'Leyes Inmobiliarias República Dominicana',
  description: 'Base de datos completa de leyes inmobiliarias dominicanas: Ley 173-07, Ley 11-92, CONFOTUR y más.',
  url: `${baseUrl}/leyes-inmobiliarias`,
  publisher: {
    '@id': `${baseUrl}/#organization`,
  },
  datePublished: '2024-01-01',
  dateModified: new Date().toISOString().split('T')[0],
  inLanguage: 'es-DO',
  articleSection: 'Legal Information',
  about: {
    '@type': 'Thing',
    name: 'Leyes Inmobiliarias República Dominicana',
  },
}

/**
 * Generador de Schema para Property (Product + Offer)
 */
export function generatePropertySchema(property: {
  id: number
  title: string
  description?: string
  price: number
  location: string
  images?: string[]
  property_type?: string
  bedrooms?: number
  bathrooms?: number
  area?: number
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${baseUrl}/properties/${property.id}#product`,
    name: property.title,
    description: property.description || property.title,
    image: property.images && property.images.length > 0 
      ? property.images.map((img: string) => (img.startsWith('http') ? img : `${baseUrl}${img}`))
      : [`${baseUrl}/images/default-property.jpg`],
    category: 'Real Estate',
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: 'DOP',
      availability: 'https://schema.org/InStock',
      url: `${baseUrl}/properties/${property.id}`,
      seller: {
        '@id': `${baseUrl}/#organization`,
      },
    },
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Ubicación',
        value: property.location,
      },
      {
        '@type': 'PropertyValue',
        name: 'Tipo de Propiedad',
        value: property.property_type || 'Propiedad',
      },
      ...(property.bedrooms ? [{
        '@type': 'PropertyValue',
        name: 'Dormitorios',
        value: property.bedrooms.toString(),
      }] : []),
      ...(property.bathrooms ? [{
        '@type': 'PropertyValue',
        name: 'Baños',
        value: property.bathrooms.toString(),
      }] : []),
      ...(property.area ? [{
        '@type': 'PropertyValue',
        name: 'Área',
        value: `${property.area} m²`,
      }] : []),
    ],
  }
}

/**
 * Generador de Schema combinado para homepage
 */
export function generateHomepageSchemas() {
  return [
    organizationSchema,
    realEstateAgentSchema,
    websiteSchema,
  ]
}

/**
 * Schema: RealEstateListing (para páginas de búsqueda)
 */
export const realEstateListingSchema = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateListing',
  name: 'Búsqueda de Propiedades en República Dominicana',
  description: 'Plataforma de búsqueda inteligente con IA emocional para encontrar propiedades en República Dominicana',
  url: `${baseUrl}/comprar`,
  areaServed: {
    '@type': 'Country',
    name: 'República Dominicana',
  },
  availableLanguage: 'es',
}

/**
 * Generador de Schema para página de herramienta
 */
export function generateToolSchema(toolType: 'tax' | 'mortgage' | 'laws' | 'tramites') {
  switch (toolType) {
    case 'tax':
      return taxCalculatorServiceSchema
    case 'mortgage':
      return financialProductSchema
    case 'laws':
      return lawsArticleSchema
    case 'tramites':
      return governmentServiceSchema
    default:
      return null
  }
}

/**
 * Generador de Schema para páginas de búsqueda
 */
export function generateSearchPageSchema(pageType: 'buy' | 'rent' | 'sell' | 'invest') {
  const pageNames = {
    buy: { name: 'Comprar Propiedades', url: `${baseUrl}/comprar` },
    rent: { name: 'Alquilar Apartamentos', url: `${baseUrl}/alquilar` },
    sell: { name: 'Vender Propiedades', url: `${baseUrl}/vender` },
    invest: { name: 'Inversión Inmobiliaria', url: `${baseUrl}/invertir` },
  }

  const pageInfo = pageNames[pageType]

  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: `${pageInfo.name} en República Dominicana`,
    description: `Plataforma de búsqueda inteligente con IA emocional para ${pageInfo.name.toLowerCase()} en República Dominicana`,
    url: pageInfo.url,
    areaServed: {
      '@type': 'Country',
      name: 'República Dominicana',
    },
    availableLanguage: 'es',
  }
}

