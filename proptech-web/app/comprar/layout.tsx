import type { Metadata } from 'next';
import { generateSearchPageSchema } from '../../lib/seo/schemaExtended';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Comprar Propiedades en República Dominicana | HabitatPro RD - IA Emocional',
  description: 'Encuentra tu casa ideal en RD con IA emocional. Búsqueda inteligente, calculadoras hipotecarias y asesoría legal CONFOTUR. Más de 500+ propiedades disponibles en Santo Domingo, Punta Cana, Santiago y más.',
  keywords: 'comprar casa rd, propiedades república dominicana, vivienda santo domingo, inmobiliaria rd, casas en venta, comprar apartamento santo domingo, propiedades punta cana, bienes raíces rd',
  openGraph: {
    title: 'Comprar Propiedades en República Dominicana | HabitatPro RD',
    description: 'Encuentra tu casa ideal con IA emocional y herramientas legales completas',
    url: 'https://habitatprord.com/comprar',
    siteName: 'HabitatPro RD',
    locale: 'es_DO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Comprar Propiedades en RD | HabitatPro',
    description: 'Encuentra tu casa ideal con IA emocional',
  },
  alternates: {
    canonical: 'https://habitatprord.com/comprar',
  },
};

export default function ComprarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schema = generateSearchPageSchema('buy');

  return (
    <>
      <Script
        id="comprar-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {children}
    </>
  );
}

