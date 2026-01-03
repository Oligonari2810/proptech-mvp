import type { Metadata } from 'next';
import { generatePropertySchema } from '../../../lib/seo/schemaExtended';

/**
 * Genera metadata dinámica para páginas de propiedades
 */
export async function generatePropertyMetadata(
  property: {
    id: number;
    title: string;
    description?: string;
    price: number;
    location: string;
    images?: string[];
    property_type?: string;
    bedrooms?: number;
    bathrooms?: number;
    area?: number;
  }
): Promise<Metadata> {
  const title = `${property.title} | ${property.location} | HabitatPro RD`;
  const description = property.description || 
    `Propiedad ${property.property_type || ''} en ${property.location}. ${property.bedrooms ? property.bedrooms + ' dormitorios, ' : ''}${property.bathrooms ? property.bathrooms + ' baños' : ''}. Precio: RD$ ${property.price.toLocaleString()}`;

  return {
    title,
    description: description.substring(0, 160),
    keywords: `propiedad ${property.location}, ${property.property_type}, vivienda ${property.location}, comprar ${property.location}`,
    openGraph: {
      title: `${property.title} - HabitatPro RD`,
      description: `Propiedad en ${property.location}. RD$ ${property.price.toLocaleString()}`,
      images: property.images && property.images.length > 0 
        ? property.images.map(img => (img.startsWith('http') ? img : `https://habitatprord.com${img}`))
        : ['https://habitatprord.com/images/default-property.jpg'],
      url: `https://habitatprord.com/properties/${property.id}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: property.title,
      description: `Propiedad en ${property.location}`,
    },
    alternates: {
      canonical: `https://habitatprord.com/properties/${property.id}`,
    },
  };
}

/**
 * Genera schema markup para una propiedad
 */
export function generatePropertySchemaMarkup(property: {
  id: number;
  title: string;
  description?: string;
  price: number;
  location: string;
  images?: string[];
  property_type?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
}) {
  return generatePropertySchema(property);
}

