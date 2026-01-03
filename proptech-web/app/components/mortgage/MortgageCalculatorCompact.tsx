'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { calculateMortgage } from '@/app/lib/mortgage/calculator';
import { dominicanBanks } from '@/app/lib/mortgage/banks';
import { MortgageCalculation } from '@/app/lib/mortgage/types';
import { ChevronRight } from 'lucide-react';

interface Props {
  precioPropiedad: number;
  propertyId?: number;
  showFull?: boolean;
}

export function MortgageCalculatorCompact({ precioPropiedad, propertyId, showFull = false }: Props) {
  const [formData, setFormData] = useState({
    precioPropiedad,
    enganche: 20, // % por defecto
    tasaAnual: 11.25, // Tasa BHD (mejor)
    plazoAnos: 20, // Años por defecto
    banco: 'bhd' // Banco por defecto
  });

  const [calculation, setCalculation] = useState<MortgageCalculation | null>(null);

  // Actualizar precio cuando cambie la prop
  React.useEffect(() => {
    setFormData(prev => ({ ...prev, precioPropiedad }));
    // Calcular automáticamente cuando cambia el precio
    if (precioPropiedad > 0) {
      try {
        const result = calculateMortgage({
          precioPropiedad,
          enganche: formData.enganche,
          tasaAnual: formData.tasaAnual,
          plazoAnos: formData.plazoAnos,
          banco: formData.banco
        });
        setCalculation(result);
      } catch (error) {
        console.error('Error calculating mortgage:', error);
      }
    }
  }, [precioPropiedad]);

  React.useEffect(() => {
    if (formData.precioPropiedad > 0) {
      try {
        const result = calculateMortgage(formData);
        setCalculation(result);
      } catch (error) {
        console.error('Error calculating mortgage:', error);
      }
    }
  }, [formData]);

  if (precioPropiedad <= 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">🏦 Calculadora Hipotecaria</h3>
        <p className="text-sm text-gray-600">Ingresa el precio de la propiedad para calcular la hipoteca</p>
      </div>
    );
  }

  const handleChange = (key: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">🏦 Calculadora Hipotecaria</h3>
        <Link
          href="/calculadora-hipotecaria"
          className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          Ver completa <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Configuración rápida */}
      {showFull && (
        <div className="space-y-3 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Enganche ({formData.enganche}%)</label>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={formData.enganche}
              onChange={(e) => handleChange('enganche', Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Plazo ({formData.plazoAnos} años)</label>
            <input
              type="range"
              min="5"
              max="30"
              step="5"
              value={formData.plazoAnos}
              onChange={(e) => handleChange('plazoAnos', Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Banco</label>
            <select
              value={formData.banco}
              onChange={(e) => {
                const banco = dominicanBanks.find(b => b.id === e.target.value);
                if (banco) {
                  handleChange('banco', e.target.value);
                  handleChange('tasaAnual', banco.tasaRecomendada);
                }
              }}
              className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500"
            >
              {dominicanBanks.map((bank) => (
                <option key={bank.id} value={bank.id}>
                  {bank.nombre} ({bank.tasaRecomendada}%)
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Resultados compactos */}
      {calculation && (
        <div className="space-y-3">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
            <p className="text-xs text-gray-600 mb-1">Cuota Mensual</p>
            <p className="text-2xl font-bold text-blue-700">
              RD$ {calculation.resultados.cuotaMensual.toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-600">Enganche:</span>
              <span className="font-medium text-gray-900">RD$ {calculation.enganche.toLocaleString('es-DO')}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-600">A Financiar:</span>
              <span className="font-medium text-gray-900">RD$ {calculation.montoFinanciar.toLocaleString('es-DO')}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-600">Tasa Anual:</span>
              <span className="font-medium text-gray-900">{calculation.tasaAnual.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-600">Plazo:</span>
              <span className="font-medium text-gray-900">{calculation.plazoAnos} años</span>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-gray-600">Total a Pagar:</span>
              <span className="font-semibold text-gray-900">
                RD$ {calculation.resultados.totalPago.toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-600">Total Intereses:</span>
              <span className="font-semibold text-red-600">
                RD$ {calculation.resultados.totalIntereses.toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      )}

      <Link
        href="/calculadora-hipotecaria"
        className="mt-4 block text-center text-xs text-blue-600 hover:text-blue-800 underline"
      >
        Ver tabla de amortización y comparar bancos →
      </Link>
    </div>
  );
}

