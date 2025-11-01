'use client';

import React from 'react';
import { TaxCalculationRD } from '../../lib/legal/types';

interface Props {
  calculation: TaxCalculationRD;
}

export function TaxBreakdown({ calculation }: Props) {
  const { resultados, precioPropiedad } = calculation;

  if (precioPropiedad <= 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <div className="text-gray-400 text-6xl mb-4">🧮</div>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          Calculadora de Impuestos RD
        </h3>
        <p className="text-gray-500">
          Ingresa el precio de la propiedad para calcular los impuestos aplicables
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg p-6 h-fit">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        💰 Desglose de Costos
      </h3>

      {/* Resumen Principal */}
      <div className="bg-white rounded-lg p-4 mb-4 shadow-sm border">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Precio propiedad:</span>
          <span className="font-semibold">RD$ {precioPropiedad.toLocaleString('es-DO')}</span>
        </div>
        <div className="flex justify-between items-center text-lg font-bold text-green-600 border-t pt-2 mt-2">
          <span>TOTAL A PAGAR:</span>
          <span>RD$ {resultados.total.toLocaleString('es-DO')}</span>
        </div>
        <div className="text-sm text-gray-500 mt-2">
          Incremento de RD$ {(resultados.total - precioPropiedad).toLocaleString('es-DO')} en impuestos y gastos
        </div>
      </div>

      {/* Desglose Detallado */}
      <div className="space-y-3">
        {resultados.desglose.map((item, index) => (
          <div key={index} className={`p-3 rounded-lg border ${
            item.obligatorio ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex justify-between items-start">
              <div>
                <span className="font-semibold text-gray-800">{item.concepto}</span>
                {item.porcentaje && (
                  <span className="ml-2 text-sm text-gray-600">({item.porcentaje})</span>
                )}
              </div>
              <span className="font-semibold text-gray-800">
                RD$ {item.monto.toLocaleString('es-DO')}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{item.descripcion}</p>
            {!item.obligatorio && (
              <span className="inline-block mt-1 text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                Opcional
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Ahorro Potencial */}
      {calculation.tipoTransaccion === 'compra' && !calculation.primeraVenta && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center">
            <span className="text-green-600 text-lg mr-2">💡</span>
            <span className="text-sm text-green-700">
              <strong>Ahorro identificado:</strong> Al comprar propiedad usada evitas ITBIS del 16%
            </span>
          </div>
        </div>
      )}

      {/* Disclaimer Legal */}
      <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
        <p className="text-xs text-orange-700">
          <strong>Nota:</strong> Esta calculadora proporciona estimaciones basadas en las leyes 
          dominicanas vigentes. Los valores pueden variar según el municipio y circunstancias 
          específicas. Consulte con un abogado especializado para cálculos exactos.
        </p>
      </div>
    </div>
  );
}

