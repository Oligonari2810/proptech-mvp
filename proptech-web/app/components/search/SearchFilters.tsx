'use client';

import { useState } from 'react';
import { Search, Filter, MapPin, Euro } from 'lucide-react';

interface SearchFiltersProps {
  onFiltersChange: (filters: Record<string, string>) => void;
}

interface FilterState {
  type: string;
  min_price: string;
  max_price: string;
  min_bedrooms: string;
  location: string;
  operation: string;
}

export default function SearchFilters({ onFiltersChange }: SearchFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    type: '',
    min_price: '',
    max_price: '',
    min_bedrooms: '',
    location: '',
    operation: 'compra'
  });

  const [isExpanded, setIsExpanded] = useState(false);

  // Tipos de propiedades
  const propertyTypes = [
    { value: '', label: 'Todos los tipos' },
    { value: 'casa', label: 'Casa' },
    { value: 'apartamento', label: 'Apartamento' },
    { value: 'ático', label: 'Ático' },
    { value: 'duplex', label: 'Dúplex' },
    { value: 'loft', label: 'Loft' },
    { value: 'estudio', label: 'Estudio' },
    { value: 'comercial', label: 'Comercial' },
    { value: 'edificio', label: 'Edificio' }
  ];

  // Operaciones
  const operations = [
    { value: 'compra', label: 'Comprar' },
    { value: 'alquiler', label: 'Alquilar' },
    { value: 'inversion', label: 'Inversión' }
  ];

  // Rangos de precios
  const priceRanges = [
    { value: '', label: 'Cualquier precio' },
    { value: '50000', label: 'Hasta 50.000€' },
    { value: '100000', label: 'Hasta 100.000€' },
    { value: '200000', label: 'Hasta 200.000€' },
    { value: '300000', label: 'Hasta 300.000€' },
    { value: '500000', label: 'Hasta 500.000€' },
    { value: '1000000', label: 'Hasta 1.000.000€' }
  ];

  // Dormitorios
  const bedroomOptions = [
    { value: '', label: 'Cualquier tamaño' },
    { value: '1', label: '1+ dormitorios' },
    { value: '2', label: '2+ dormitorios' },
    { value: '3', label: '3+ dormitorios' },
    { value: '4', label: '4+ dormitorios' },
    { value: '5', label: '5+ dormitorios' }
  ];

  // Ubicaciones populares
  const popularLocations = [
    'Madrid Centro',
    'Barcelona Eixample',
    'Valencia Centro',
    'Sevilla Nervión',
    'Bilbao Abando',
    'Granada Centro',
    'Málaga Centro',
    'Zaragoza Centro'
  ];

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      type: '',
      min_price: '',
      max_price: '',
      min_bedrooms: '',
      location: '',
      operation: 'compra'
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '' && value !== 'compra');

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Search className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Filtros de Búsqueda</h2>
            <p className="text-sm text-gray-600">Encuentra la propiedad perfecta</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 font-medium"
            >
              Limpiar filtros
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Filter className="h-4 w-4" />
            <span>{isExpanded ? 'Menos filtros' : 'Más filtros'}</span>
          </button>
        </div>
      </div>

      {/* Filtros básicos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Operación */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Operación
          </label>
          <select
            value={filters.operation}
            onChange={(e) => handleFilterChange('operation', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {operations.map((op) => (
              <option key={op.value} value={op.value}>
                {op.label}
              </option>
            ))}
          </select>
        </div>

        {/* Tipo de propiedad */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo
          </label>
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {propertyTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Precio máximo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Precio máximo
          </label>
          <select
            value={filters.max_price}
            onChange={(e) => handleFilterChange('max_price', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {priceRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        {/* Dormitorios */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dormitorios
          </label>
          <select
            value={filters.min_bedrooms}
            onChange={(e) => handleFilterChange('min_bedrooms', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {bedroomOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filtros expandidos */}
      {isExpanded && (
        <div className="border-t border-gray-200 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Ubicación */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                Ubicación
              </label>
              <input
                type="text"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                placeholder="Madrid, Barcelona, Valencia..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="mt-2 flex flex-wrap gap-1">
                {popularLocations.slice(0, 4).map((location) => (
                  <button
                    key={location}
                    onClick={() => handleFilterChange('location', location)}
                    className={`px-2 py-1 text-xs rounded-full transition-colors ${
                      filters.location === location
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {location}
                  </button>
                ))}
              </div>
            </div>

            {/* Precio mínimo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Euro className="inline h-4 w-4 mr-1" />
                Precio mínimo
              </label>
              <input
                type="number"
                value={filters.min_price}
                onChange={(e) => handleFilterChange('min_price', e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Características adicionales */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Características
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-gray-700">Con garaje</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-gray-700">Con jardín</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-gray-700">Con piscina</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resumen de filtros activos */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Filtros activos:</span>
            {filters.type && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                {propertyTypes.find(t => t.value === filters.type)?.label}
              </span>
            )}
            {filters.max_price && (
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                Hasta {parseInt(filters.max_price).toLocaleString()}€
              </span>
            )}
            {filters.min_bedrooms && (
              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                {filters.min_bedrooms}+ dormitorios
              </span>
            )}
            {filters.location && (
              <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                {filters.location}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
