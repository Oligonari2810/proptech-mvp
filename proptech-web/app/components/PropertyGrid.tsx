'use client'

import React from 'react'
import { useProperties } from '../hooks/useProperties'
import { PropertyCard } from './PropertyCard'

interface PropertyGridProps {
  operation: string
  filters: Record<string, string | number | string[]>
}

export function PropertyGrid({ operation, filters }: PropertyGridProps) {
  const { properties, loading, error } = useProperties(operation, filters)

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-lg">Cargando propiedades reales...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-600 font-semibold mb-2">Error al cargar propiedades</div>
        <div className="text-red-500 text-sm">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
        >
          Reintentar
        </button>
      </div>
    )
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">No se encontraron propiedades</div>
        <div className="text-gray-400 text-sm mt-2">
          {filters.location ? `en ${filters.location}` : 'con los filtros seleccionados'}
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  )
}

