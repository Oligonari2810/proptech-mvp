import { LoadingOptimized, PageLoading, SectionLoading } from '../components/LoadingOptimized';
import { MortgageCalculatorRD } from '../components/mortgage/MortgageCalculatorRD';
import { generateToolSchema } from '../../lib/seo/schemaExtended';
import type { Metadata } from 'next';
import Script from 'next/script';

// Page debe ser dinámica para evitar prerender
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Calculadora Hipotecaria RD - HabitatPro | Bancos República Dominicana',
  description: 'Calcula tu cuota mensual, intereses y compara opciones de financiamiento con los principales bancos de República Dominicana (BanReservas, Popular, BHD, Scotiabank, Santander). Tabla de amortización completa y comparación de tasas.',
  keywords: 'calculadora hipotecaria RD, préstamo hipotecario República Dominicana, tasa de interés hipoteca, cuota mensual RD, bancos RD hipotecas, banreservas hipoteca, popular hipoteca, bhd hipoteca',
  openGraph: {
    title: 'Calculadora Hipotecaria RD - HabitatPro',
    description: 'Calcula tu hipoteca con tasas de interés de bancos dominicanos',
    type: 'website',
  },
};

const mortgageSchema = generateToolSchema('mortgage');

export default function CalculadoraHipotecariaPage() {
  return (
    <>
      <Script
        id="mortgage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mortgageSchema) }}
      />
      <div className="min-h-screen bg-gray-50 py-12">
        <MortgageCalculatorRD />
      </div>
    </>
  );
}

