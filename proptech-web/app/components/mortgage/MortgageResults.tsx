'use client';

import React from 'react';
import { MortgageCalculation } from '@/app/lib/mortgage/types';

interface Props {
  calculation: MortgageCalculation;
}

export function MortgageResults({ calculation }: Props) {
  const { resultados, precioPropiedad, montoFinanciar, enganche, banco } = calculation;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        💰 Resultados del Cálculo
      </h2>

      {/* Resumen Principal */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6 border border-blue-200">
        <div className="text-center mb-4">
          <p className="text-sm text-gray-600 mb-1">Cuota Mensual</p>
          <p className="text-4xl font-bold text-blue-700">
            RD$ {resultados.cuotaMensual.toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Desglose de Información */}
      <div className="space-y-4">
        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <span className="text-gray-600">Precio de la Propiedad:</span>
          <span className="font-semibold text-gray-800">RD$ {precioPropiedad.toLocaleString('es-DO')}</span>
        </div>

        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <span className="text-gray-600">Enganche ({(enganche / precioPropiedad * 100).toFixed(0)}%):</span>
          <span className="font-semibold text-gray-800">RD$ {enganche.toLocaleString('es-DO')}</span>
        </div>

        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <span className="text-gray-600">Monto a Financiar:</span>
          <span className="font-semibold text-gray-800">RD$ {montoFinanciar.toLocaleString('es-DO')}</span>
        </div>

        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <span className="text-gray-600">Tasa Anual:</span>
          <span className="font-semibold text-gray-800">{calculation.tasaAnual.toFixed(2)}%</span>
        </div>

        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <span className="text-gray-600">Plazo:</span>
          <span className="font-semibold text-gray-800">{calculation.plazoAnos} años ({calculation.plazoAnos * 12} meses)</span>
        </div>

        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <span className="text-gray-600">Total a Pagar:</span>
          <span className="font-semibold text-gray-800">RD$ {resultados.totalPago.toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>

        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <span className="text-gray-600">Total en Intereses:</span>
          <span className="font-semibold text-red-600">RD$ {resultados.totalIntereses.toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200 mt-4">
          <p className="text-sm text-yellow-800">
            <strong>💡 Nota:</strong> Estos cálculos son estimaciones basadas en las tasas de interés proporcionadas. 
            Las tasas reales pueden variar según tu perfil crediticio y las políticas del banco. 
            Consulta directamente con {banco} para obtener una cotización oficial.
          </p>
        </div>
      </div>
    </div>
  );
}

