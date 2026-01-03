import type { Metadata } from 'next';
import { generateSearchPageSchema } from '../../lib/seo/schemaExtended';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Inversión Inmobiliaria República Dominicana | HabitatPro - CONFOTUR',
  description: 'Oportunidades de inversión inmobiliaria en RD. Guía CONFOTUR, calculadoras financieras, asesoría legal. Invierte en Punta Cana, Bávaro, Santo Domingo con beneficios fiscales.',
  keywords: 'inversión inmobiliaria rd, confotur inversión extranjera, inversión turística rd, propiedades inversión punta cana, inversión bienes raíces rd',
  openGraph: {
    title: 'Inversión Inmobiliaria RD | HabitatPro',
    description: 'Inversiones inmobiliarias con beneficios CONFOTUR en República Dominicana',
    url: 'https://habitatprord.com/invertir',
    type: 'website',
  },
  alternates: {
    canonical: 'https://habitatprord.com/invertir',
  },
};

export default function InvertirLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schema = generateSearchPageSchema('invest');

  return (
    <>
      <Script
        id="invertir-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {children}
    </>
  );
}

