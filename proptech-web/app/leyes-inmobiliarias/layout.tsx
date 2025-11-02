import type { Metadata } from 'next';
import { generateToolSchema } from '../../lib/seo/schemaExtended';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Leyes Inmobiliarias República Dominicana | HabitatPro - Base Legal Completa',
  description: 'Base de datos completa de leyes inmobiliarias dominicanas: Ley 173-07, Ley 11-92 ITBIS, CONFOTUR, Ley 158-01 y más. Información actualizada y explicada para compradores y vendedores.',
  keywords: 'leyes inmobiliarias rd, ley 173-07, ley 11-92, confotur rd, ley transferencia inmuebles rd, marco legal propiedades rd',
  openGraph: {
    title: 'Leyes Inmobiliarias RD | HabitatPro',
    description: 'Base de datos completa de leyes inmobiliarias dominicanas',
    url: 'https://habitatprord.com/leyes-inmobiliarias',
    type: 'website',
  },
  alternates: {
    canonical: 'https://habitatprord.com/leyes-inmobiliarias',
  },
};

export default function LeyesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schema = generateToolSchema('laws');

  return (
    <>
      {schema && (
        <Script
          id="leyes-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      {children}
    </>
  );
}

