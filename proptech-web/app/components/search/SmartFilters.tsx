'use client';

import { useState } from 'react';

interface FilterState {
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  minArea?: number;
  maxArea?: number;
  location?: string;
  propertyType?: string;
  features?: string[];
}

interface SmartFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  initialFilters?: FilterState;
}

export default function SmartFilters({ onFilterChange, initialFilters = {} }: SmartFiltersProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const cleared = {};
    setFilters(cleared);
    onFilterChange(cleared);
  };

  const activeFiltersCount = Object.values(filters).filter(v => v !== undefined && v !== '' && (!Array.isArray(v) || v.length > 0)).length;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header colapsable */}
      <div 
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Filtros Inteligentes</h2>
          {activeFiltersCount > 0 && (
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          {isExpanded ? '▲' : '▼'}
        </button>
      </div>

      {/* Contenido de filtros */}
      {isExpanded && (
        <div className="p-4 border-t border-gray-200 space-y-4">
          {/* Precio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rango de Precio
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Mínimo"
                value={filters.minPrice || ''}
                onChange={(e) => handleFilterChange('minPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
              <input
                type="number"
                placeholder="Máximo"
                value={filters.maxPrice || ''}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* Ubicación */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ubicación
            </label>
            <input
              type="text"
              placeholder="Ej: Santo Domingo, Distrito Nacional"
              value={filters.location || ''}
              onChange={(e) => handleFilterChange('location', e.target.value || undefined)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>

          {/* Dormitorios y Baños */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dormitorios
              </label>
              <select
                value={filters.bedrooms || ''}
                onChange={(e) => handleFilterChange('bedrooms', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">Cualquiera</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Baños
              </label>
              <select
                value={filters.bathrooms || ''}
                onChange={(e) => handleFilterChange('bathrooms', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">Cualquiera</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>
          </div>

          {/* Área */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Área (m²)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Mínimo"
                value={filters.minArea || ''}
                onChange={(e) => handleFilterChange('minArea', e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
              <input
                type="number"
                placeholder="Máximo"
                value={filters.maxArea || ''}
                onChange={(e) => handleFilterChange('maxArea', e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* Tipo de Propiedad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Propiedad
            </label>
            <select
              value={filters.propertyType || ''}
              onChange={(e) => handleFilterChange('propertyType', e.target.value || undefined)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="">Todos</option>
              <option value="apartment">Apartamento</option>
              <option value="house">Casa</option>
              <option value="local">Local</option>
              <option value="land">Terreno</option>
            </select>
          </div>

          {/* Características */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Características
            </label>
            <div className="flex flex-wrap gap-2">
              {['Piscina', 'Garaje', 'Jardín', 'Terraza', 'Ascensor', 'Seguridad 24/7'].map((feature) => (
                <button
                  key={feature}
                  onClick={() => {
                    const currentFeatures = filters.features || [];
                    const newFeatures = currentFeatures.includes(feature)
                      ? currentFeatures.filter(f => f !== feature)
                      : [...currentFeatures, feature];
                    handleFilterChange('features', newFeatures.length > 0 ? newFeatures : undefined);
                  }}
                  className={`px-3 py-1 text-sm rounded-md border transition-colors ${
                    (filters.features || []).includes(feature)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                  }`}
                >
                  {feature}
                </button>
              ))}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-2 pt-2 border-t border-gray-200">
            <button
              onClick={clearFilters}
              className="flex-1 px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Limpiar Filtros
            </button>
            <button
              onClick={() => setIsExpanded(false)}
              className="flex-1 px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              Aplicar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

