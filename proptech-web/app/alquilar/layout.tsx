import type { Metadata } from 'next';
import { generateSearchPageSchema } from '../../lib/seo/schemaExtended';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Alquiler de Apartamentos en RD | HabitatPro - Plataforma Inmobiliaria',
  description: 'Alquila apartamentos en República Dominicana. Búsqueda por ubicación, precio y características. IA emocional para encontrar tu hogar ideal. Más de 200+ opciones de alquiler.',
  keywords: 'alquiler apartamentos rd, alquiler santo domingo, casas alquiler república dominicana, alquiler temporal rd, apartamentos alquiler capital rd',
  openGraph: {
    title: 'Alquiler de Apartamentos en RD | HabitatPro',
    description: 'Alquila apartamentos con IA emocional en República Dominicana',
    url: 'https://habitatprord.com/alquilar',
    type: 'website',
  },
  alternates: {
    canonical: 'https://habitatprord.com/alquilar',
  },
};

export default function AlquilarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schema = generateSearchPageSchema('rent');

  return (
    <>
      <Script
        id="alquilar-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {children}
    </>
  );
}

