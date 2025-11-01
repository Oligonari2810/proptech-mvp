'use client';

import { TaxCalculatorRD } from '../components/legal/TaxCalculatorRD';

export default function CalculadoraImpuestosPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🧮 Calculadora de Impuestos Inmobiliarios
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Calcula todos los impuestos, gastos notariales y costos asociados a transacciones 
            inmobiliarias en República Dominicana según las leyes vigentes.
          </p>
        </div>

        <TaxCalculatorRD />

        {/* Información Adicional */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="text-3xl mb-3">⚖️</div>
            <h3 className="font-semibold text-gray-800 mb-2">Base Legal</h3>
            <p className="text-sm text-gray-600">
              Todos los cálculos están basados en las leyes dominicanas vigentes y actualizadas.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="text-3xl mb-3">💰</div>
            <h3 className="font-semibold text-gray-800 mb-2">Estimaciones Precisas</h3>
            <p className="text-sm text-gray-600">
              Obtén un desglose detallado de todos los costos asociados a tu transacción.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="text-3xl mb-3">📞</div>
            <h3 className="font-semibold text-gray-800 mb-2">Asesoría Profesional</h3>
            <p className="text-sm text-gray-600">
              Consulta con nuestros abogados especializados para cálculos exactos y personalizados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

