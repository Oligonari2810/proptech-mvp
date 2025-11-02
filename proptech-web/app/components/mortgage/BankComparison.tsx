'use client';

import React from 'react';
import { compareMortgages } from '@/app/lib/mortgage/calculator';
import { dominicanBanks } from '@/app/lib/mortgage/banks';
import { TrendingDown, TrendingUp } from 'lucide-react';

interface Props {
  montoFinanciar: number;
  plazoAnos: number;
}

export function BankComparison({ montoFinanciar, plazoAnos }: Props) {
  const tasas = dominicanBanks.map(bank => ({
    banco: bank.nombre,
    tasaAnual: bank.tasaRecomendada
  }));

  const comparaciones = compareMortgages(montoFinanciar, plazoAnos, tasas);
  const mejorOpcion = comparaciones[0];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-6">
        🏦 Comparación de Bancos
      </h3>

      <div className="space-y-4">
        {/* Mejor Opción Destacada */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-2 border-green-500">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-green-600" />
              <span className="font-bold text-green-800">Mejor Opción</span>
            </div>
            <span className="px-2 py-1 bg-green-600 text-white text-xs font-semibold rounded">
              RECOMENDADO
            </span>
          </div>
          <h4 className="text-lg font-bold text-gray-900 mb-2">{mejorOpcion.banco}</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Tasa Anual</p>
              <p className="font-semibold text-gray-900">{mejorOpcion.tasaAnual.toFixed(2)}%</p>
            </div>
            <div>
              <p className="text-gray-600">Cuota Mensual</p>
              <p className="font-semibold text-gray-900">
                RD$ {mejorOpcion.cuotaMensual.toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Total Intereses</p>
              <p className="font-semibold text-gray-900">
                RD$ {mejorOpcion.totalIntereses.toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        {/* Otras Opciones */}
        <div className="space-y-2">
          {comparaciones.slice(1).map((comp, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{comp.banco}</h4>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-red-500" />
                  <span className="text-xs text-red-600 font-medium">
                    +RD$ {comp.diferenciaMensual.toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/mes
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Tasa</p>
                  <p className="font-medium text-gray-900">{comp.tasaAnual.toFixed(2)}%</p>
                </div>
                <div>
                  <p className="text-gray-600">Cuota</p>
                  <p className="font-medium text-gray-900">
                    RD$ {comp.cuotaMensual.toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Intereses</p>
                  <p className="font-medium text-gray-900">
                    RD$ {comp.totalIntereses.toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Nota Legal */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mt-4">
          <p className="text-xs text-blue-800">
            <strong>ℹ️ Nota:</strong> Las tasas mostradas son estimaciones basadas en tasas típicas de cada banco. 
            Las tasas reales pueden variar según tu perfil crediticio, historial y condiciones específicas del préstamo. 
            Contacta directamente con cada banco para obtener una cotización oficial.
          </p>
        </div>
      </div>
    </div>
  );
}

