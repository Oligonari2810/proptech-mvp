import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Guía CONFOTUR Inversión Extranjera RD | HabitatPro - Beneficios Fiscales',
  description: 'Guía completa CONFOTUR para inversión extranjera en República Dominicana. Beneficios fiscales, exenciones ITBIS, impuesto transferencia y procedimientos. Ley 158-01 explicada.',
  keywords: 'confotur rd, inversión extranjera rd, ley 158-01, beneficios fiscales turismo rd, inversión turística confotur, exenciones impuestos rd',
  openGraph: {
    title: 'Guía CONFOTUR Inversión Extranjera RD | HabitatPro',
    description: 'Guía completa CONFOTUR para inversión extranjera en República Dominicana',
    url: 'https://habitatprord.com/confotur',
    type: 'website',
  },
  alternates: {
    canonical: 'https://habitatprord.com/confotur',
  },
};

export default function ConfoturLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

