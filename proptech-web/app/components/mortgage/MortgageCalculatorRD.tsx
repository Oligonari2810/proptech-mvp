'use client';

import React, { useState } from 'react';
import { calculateMortgage } from '@/app/lib/mortgage/calculator';
import { dominicanBanks, getRecommendedBank } from '@/app/lib/mortgage/banks';
import { MortgageCalculation } from '@/app/lib/mortgage/types';
import { MortgageResults } from './MortgageResults';
import { AmortizationTable } from './AmortizationTable';
import { BankComparison } from './BankComparison';

export function MortgageCalculatorRD() {
  const [formData, setFormData] = useState({
    precioPropiedad: 0,
    enganche: 20, // % por defecto
    tasaAnual: 11.5, // Tasa promedio RD
    plazoAnos: 20, // Años por defecto
    banco: 'bhd' // Banco por defecto
  });

  const [calculation, setCalculation] = useState<MortgageCalculation | null>(null);
  const [showAmortization, setShowAmortization] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  const handleCalculate = () => {
    try {
      const result = calculateMortgage({
        precioPropiedad: formData.precioPropiedad,
        enganche: formData.enganche,
        tasaAnual: formData.tasaAnual,
        plazoAnos: formData.plazoAnos,
        banco: formData.banco
      });
      setCalculation(result);
      setShowAmortization(false);
      setShowComparison(false);
    } catch (error) {
      console.error('Error calculating mortgage:', error);
      alert(error instanceof Error ? error.message : 'Error al calcular la hipoteca');
    }
  };

  const handleBankChange = (bancoId: string) => {
    const banco = dominicanBanks.find(b => b.id === bancoId);
    if (banco) {
      setFormData({
        ...formData,
        banco: bancoId,
        tasaAnual: banco.tasaRecomendada
      });
    }
  };

  const selectedBank = dominicanBanks.find(b => b.id === formData.banco);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🏦 Calculadora Hipotecaria RD
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Calcula tu cuota mensual, intereses y compara opciones de financiamiento con los principales bancos de República Dominicana
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulario */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            📝 Datos del Préstamo
          </h2>

          <div className="space-y-6">
            {/* Precio Propiedad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio de la Propiedad (DOP)
              </label>
              <input
                type="number"
                value={formData.precioPropiedad || ''}
                onChange={(e) => setFormData({...formData, precioPropiedad: Number(e.target.value)})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: 5,000,000"
                min="0"
                step="10000"
              />
            </div>

            {/* Enganche */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enganche ({formData.enganche}%)
              </label>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={formData.enganche}
                onChange={(e) => setFormData({...formData, enganche: Number(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>50%</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Enganche: RD$ {((formData.precioPropiedad * formData.enganche) / 100).toLocaleString('es-DO')}
              </p>
            </div>

            {/* Banco */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Banco
              </label>
              <select
                value={formData.banco}
                onChange={(e) => handleBankChange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {dominicanBanks.map((bank) => (
                  <option key={bank.id} value={bank.id}>
                    {bank.nombre} ({bank.tasaRecomendada}% anual típica)
                  </option>
                ))}
              </select>
              {selectedBank && (
                <p className="text-xs text-gray-500 mt-1">
                  Tasa: {selectedBank.tasaMinima}% - {selectedBank.tasaMaxima}% anual
                </p>
              )}
            </div>

            {/* Tasa Anual */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tasa Anual ({formData.tasaAnual}%)
              </label>
              <input
                type="range"
                min="8"
                max="18"
                step="0.25"
                value={formData.tasaAnual}
                onChange={(e) => setFormData({...formData, tasaAnual: Number(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>8%</span>
                <span>18%</span>
              </div>
            </div>

            {/* Plazo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plazo ({formData.plazoAnos} años)
              </label>
              <input
                type="range"
                min="5"
                max="30"
                step="5"
                value={formData.plazoAnos}
                onChange={(e) => setFormData({...formData, plazoAnos: Number(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>5 años</span>
                <span>30 años</span>
              </div>
            </div>

            {/* Botón Calcular */}
            <button
              onClick={handleCalculate}
              disabled={formData.precioPropiedad <= 0}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🧮 Calcular Hipoteca
            </button>
          </div>
        </div>

        {/* Resultados */}
        <div className="space-y-6">
          {calculation && (
            <>
              <MortgageResults calculation={calculation} />
              
              {/* Botones de acciones adicionales */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setShowAmortization(!showAmortization)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {showAmortization ? 'Ocultar' : 'Ver'} Tabla de Amortización
                </button>
                <button
                  onClick={() => setShowComparison(!showComparison)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {showComparison ? 'Ocultar' : 'Comparar'} Bancos
                </button>
              </div>

              {showAmortization && calculation && (
                <AmortizationTable amortization={calculation.resultados.amortizacion} />
              )}

              {showComparison && calculation && (
                <BankComparison 
                  montoFinanciar={calculation.montoFinanciar}
                  plazoAnos={calculation.plazoAnos}
                />
              )}
            </>
          )}

          {!calculation && (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <div className="text-gray-400 text-6xl mb-4">🏦</div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Calculadora Hipotecaria RD
              </h3>
              <p className="text-gray-500">
                Ingresa los datos del préstamo para calcular tu cuota mensual e intereses
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

