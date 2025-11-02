import { MortgageCalculatorRD } from '../components/mortgage/MortgageCalculatorRD';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Calculadora Hipotecaria RD - HabitatPro',
  description: 'Calcula tu cuota mensual, intereses y compara opciones de financiamiento con los principales bancos de República Dominicana (BanReservas, Popular, BHD, Scotiabank, etc.)',
  keywords: 'calculadora hipotecaria RD, préstamo hipotecario República Dominicana, tasa de interés hipoteca, cuota mensual RD, bancos RD hipotecas',
};

export default function CalculadoraHipotecariaPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <MortgageCalculatorRD />
    </div>
  );
}

