import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vender Propiedad en República Dominicana | HabitatPro Brokers',
  description: 'Vende tu propiedad rápido y seguro. Sistema de reputación verificada, featured listings y herramientas para brokers. ¡Llega a más compradores con IA emocional!',
  keywords: 'vender propiedad rd, inmobiliarias brokers, vender casa santo domingo, publicar propiedad rd, vender apartamento rd',
  openGraph: {
    title: 'Vender Propiedad en RD | HabitatPro',
    description: 'Vende tu propiedad con herramientas avanzadas y IA emocional',
    url: 'https://habitatprord.com/vender',
    type: 'website',
  },
  alternates: {
    canonical: 'https://habitatprord.com/vender',
  },
};

export default function VenderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

