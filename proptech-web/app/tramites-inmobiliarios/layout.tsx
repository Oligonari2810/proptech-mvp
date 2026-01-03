import type { Metadata } from 'next';
import { generateToolSchema } from '../../lib/seo/schemaExtended';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Trámites Inmobiliarios Guiados República Dominicana | HabitatPro',
  description: 'Guía paso a paso para trámites inmobiliarios en RD: compra-venta, permisos de construcción, inversión turística CONFOTUR. Documentos necesarios, costos y plazos explicados.',
  keywords: 'trámites inmobiliarios rd, compra venta propiedades rd, permisos construcción rd, confotur trámites, procedimientos inmobiliarios rd',
  openGraph: {
    title: 'Trámites Inmobiliarios Guiados RD | HabitatPro',
    description: 'Guía paso a paso para trámites inmobiliarios en República Dominicana',
    url: 'https://habitatprord.com/tramites-inmobiliarios',
    type: 'website',
  },
  alternates: {
    canonical: 'https://habitatprord.com/tramites-inmobiliarios',
  },
};

export default function TramitesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schema = generateToolSchema('tramites');

  return (
    <>
      {schema && (
        <Script
          id="tramites-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      {children}
    </>
  );
}

