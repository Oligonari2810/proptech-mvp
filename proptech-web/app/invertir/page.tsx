'use client'

import React, { useState } from 'react'
import { PropertyGrid } from '../components/PropertyGrid'

export default function InvertirPage() {
  const [investmentType, setInvestmentType] = useState('compra')

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Invierte en momentos que perduran</h1>
          <p className="text-gray-600 mt-2">
            Construye tu legado inmobiliario con propiedades de alto valor emocional y económico
          </p>
        </div>

        {/* Selector de Tipo de Inversión */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Tipo de Inversión</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setInvestmentType('compra')}
              className={`p-4 rounded-lg border-2 text-center transition-all ${
                investmentType === 'compra'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300'
              }`}
            >
              <div className="font-semibold">Compra para Revalorización</div>
              <div className="text-sm mt-1">Alta plusvalía a medio plazo</div>
            </button>

            <button
              onClick={() => setInvestmentType('alquiler')}
              className={`p-4 rounded-lg border-2 text-center transition-all ${
                investmentType === 'alquiler'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-green-300'
              }`}
            >
              <div className="font-semibold">Renta por Alquiler</div>
              <div className="text-sm mt-1">Ingresos mensuales estables</div>
            </button>

            <button
              onClick={() => setInvestmentType('oportunidad')}
              className={`p-4 rounded-lg border-2 text-center transition-all ${
                investmentType === 'oportunidad'
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-purple-300'
              }`}
            >
              <div className="font-semibold">Oportunidades Únicas</div>
              <div className="text-sm mt-1">Proyectos especiales</div>
            </button>
          </div>

          {/* Métricas de Inversión */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">8.2%</div>
              <div className="text-sm text-gray-600">Rentabilidad Media</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">+15%</div>
              <div className="text-sm text-gray-600">Revalorización Anual</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">94%</div>
              <div className="text-sm text-gray-600">Ocupación Media</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">2.1 años</div>
              <div className="text-sm text-gray-600">ROI Promedio</div>
            </div>
          </div>
        </div>

        {/* Grid de propiedades de INVERSIÓN reales */}
        <div>
          <PropertyGrid 
            operation={investmentType === 'oportunidad' ? 'compra' : investmentType} 
            filters={{ 
              ...(investmentType === 'oportunidad' && { emotional_tags: ['inversion', 'oportunidad'] })
            }} 
          />
        </div>

        {/* Información Adicional para Inversores */}
        <div className="mt-12 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-xl font-semibold text-blue-900 mb-4">¿Por qué invertir en inmuebles?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <span className="text-blue-600 text-lg">📈</span>
              </div>
              <div>
                <div className="font-semibold text-blue-800">Rentabilidad Estable</div>
                <div className="text-blue-600 text-sm">Histórico de crecimiento constante</div>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <span className="text-blue-600 text-lg">🛡️</span>
              </div>
              <div>
                <div className="font-semibold text-blue-800">Protección Inflación</div>
                <div className="text-blue-600 text-sm">Valor refugio en tiempos inciertos</div>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <span className="text-blue-600 text-lg">💼</span>
              </div>
              <div>
                <div className="font-semibold text-blue-800">Diversificación</div>
                <div className="text-blue-600 text-sm">Reduce riesgo en tu cartera</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
