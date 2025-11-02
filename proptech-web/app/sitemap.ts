import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://habitatprord.com'
  
  // Obtener propiedades dinámicamente
  let properties = []
  try {
    const response = await fetch('https://proptech-mvp-1.onrender.com/api/properties?is_active=true', {
      next: { revalidate: 3600 } // Cache por 1 hora
    })
    const data = await response.json()
    properties = data.properties || data || []
  } catch (error) {
    console.error('Error fetching properties for sitemap:', error)
  }

  // URLs de propiedades dinámicas
  const propertyEntries = properties.slice(0, 1000).map((property: any) => ({
    url: `${baseUrl}/properties/${property.id}`,
    lastModified: property.updated_at ? new Date(property.updated_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Páginas estáticas principales (Priority 1.0 - 0.9)
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ]

  // Páginas clave de navegación (Priority 0.8 - 0.9)
  const keyPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/comprar`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/alquilar`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/vender`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/valorar`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/invertir`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  // Herramientas financieras y legales (Priority 0.8 - 0.9)
  const toolsPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/calculadora-impuestos`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/calculadora-hipotecaria`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/leyes-inmobiliarias`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tramites-inmobiliarios`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/confotur`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]

  // Páginas secundarias (Priority 0.6 - 0.7)
  const secondaryPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/contacto`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/mapa`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/profile`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ]

  // Auth pages (Priority 0.4 - 0.5)
  const authPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/auth/signin`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/auth/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  return [
    ...staticPages,
    ...keyPages,
    ...toolsPages,
    ...secondaryPages,
    ...authPages,
    ...propertyEntries,
  ]
}
