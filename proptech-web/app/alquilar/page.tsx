'use client'

import React, { useState } from 'react'
import { PropertyGrid } from '../components/PropertyGrid'

export default function AlquilarPage() {
  const [filters, setFilters] = useState({
    type: '',
    max_price: '',
    min_bedrooms: '',
    location: ''
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Llaves para empezar tu historia</h1>
          <p className="text-gray-600 mt-2">
            Tu próximo hogar te está esperando con las mejores condiciones y calidez humana
          </p>
        </div>

        {/* Filtros Específicos para Alquiler */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Filtros de Alquiler</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
              <select 
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos</option>
                <option value="apartamento">Apartamento</option>
                <option value="casa">Casa</option>
                <option value="estudio">Estudio</option>
                <option value="piso">Piso</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Precio Máximo/mes</label>
              <select 
                value={filters.max_price}
                onChange={(e) => setFilters(prev => ({ ...prev, max_price: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sin límite</option>
                <option value="500">€500</option>
                <option value="800">€800</option>
                <option value="1000">€1,000</option>
                <option value="1200">€1,200</option>
                <option value="1500">€1,500+</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dormitorios</label>
              <select 
                value={filters.min_bedrooms}
                onChange={(e) => setFilters(prev => ({ ...prev, min_bedrooms: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Cualquiera</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Zona</label>
              <input 
                type="text"
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Barrio, ciudad..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-500">
              {filters.max_price && `Precio hasta €${filters.max_price}/mes`}
              {filters.min_bedrooms && ` • ${filters.min_bedrooms}+ dormitorios`}
              {filters.location && ` • En ${filters.location}`}
            </div>
            <button 
              onClick={() => setFilters({
                type: '',
                max_price: '',
                min_bedrooms: '',
                location: ''
              })}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Limpiar filtros
            </button>
          </div>
        </div>

        {/* Grid de propiedades de ALQUILER reales */}
        <div>
          <PropertyGrid operation="alquiler" filters={filters} />
        </div>
      </div>
    </div>
  )
}
