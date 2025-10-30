'use client';

import { useState } from 'react';
import { X, Check, XCircle } from 'lucide-react';
import Image from 'next/image';

interface Property {
  id: number | string;
  title: string;
  price: number;
  location: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  images?: string[];
  description?: string;
  features?: string[];
  [key: string]: any;
}

interface PropertyComparatorProps {
  properties: Property[];
  onRemove?: (id: number | string) => void;
  maxProperties?: number;
}

export default function PropertyComparator({ 
  properties, 
  onRemove,
  maxProperties = 3 
}: PropertyComparatorProps) {
  const [selectedProperties, setSelectedProperties] = useState<Property[]>(
    properties.slice(0, maxProperties)
  );

  const removeProperty = (id: number | string) => {
    setSelectedProperties(prev => prev.filter(p => p.id !== id));
    if (onRemove) onRemove(id);
  };

  const calculateScore = (property: Property): number => {
    let score = 50; // Base score
    
    // Precio (más bajo = mejor score, pero relativo)
    const avgPrice = selectedProperties.reduce((sum, p) => sum + p.price, 0) / selectedProperties.length;
    if (property.price < avgPrice) score += 10;
    else if (property.price > avgPrice * 1.2) score -= 10;

    // Área (más grande = mejor)
    if (property.area) {
      const avgArea = selectedProperties.reduce((sum, p) => (sum + (p.area || 0)), 0) / selectedProperties.length;
      if (property.area > avgArea) score += 10;
    }

    // Características
    if (property.features && property.features.length > 0) {
      score += property.features.length * 2;
    }

    return Math.max(0, Math.min(100, score));
  };

  const getFeatureList = (property: Property): string[] => {
    const features: string[] = [];
    if (property.bedrooms) features.push(`${property.bedrooms} Dormitorios`);
    if (property.bathrooms) features.push(`${property.bathrooms} Baños`);
    if (property.area) features.push(`${property.area} m²`);
    if (property.features) features.push(...property.features);
    return features;
  };

  const allFeatures = Array.from(
    new Set(selectedProperties.flatMap(p => getFeatureList(p)))
  );

  if (selectedProperties.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-600 mb-4">No hay propiedades para comparar</p>
        <p className="text-sm text-gray-500">
          Selecciona propiedades desde el listado para compararlas
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Comparador de Propiedades</h2>
          <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
            {selectedProperties.length} propiedad{selectedProperties.length !== 1 ? 'es' : ''}
          </span>
        </div>
      </div>

      {/* Tabla de comparación */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-48">Característica</th>
              {selectedProperties.map((property) => (
                <th key={property.id} className="px-4 py-3 text-center text-sm font-semibold text-gray-700 relative min-w-[250px]">
                  <button
                    onClick={() => removeProperty(property.id)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-600 transition-colors"
                    aria-label="Remover de comparación"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="mt-6">
                    {property.images && property.images[0] ? (
                      <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-2">
                        <Image
                          src={property.images[0]}
                          alt={property.title}
                          fill
                          className="object-cover"
                          sizes="250px"
                          unoptimized={property.images[0]?.startsWith('https://via.placeholder')}
                        />
                      </div>
                    ) : (
                      <div className="w-full aspect-video bg-gray-200 rounded-lg mb-2 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">Sin imagen</span>
                      </div>
                    )}
                    <p className="font-semibold text-gray-900 text-sm">{property.title}</p>
                    <p className="text-xs text-gray-500">{property.location}</p>
                    <div className="mt-2 inline-block">
                      <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2 py-1 rounded">
                        Score: {calculateScore(property)}/100
                      </span>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {/* Precio */}
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-700">Precio</td>
              {selectedProperties.map((property) => {
                const isBest = property.price === Math.min(...selectedProperties.map(p => p.price));
                return (
                  <td key={property.id} className={`px-4 py-3 text-center ${isBest ? 'bg-green-50' : ''}`}>
                    <div className="flex items-center justify-center gap-2">
                      <span className={`text-lg font-bold ${isBest ? 'text-green-700' : 'text-gray-900'}`}>
                        ${property.price.toLocaleString()}
                      </span>
                      {isBest && <Check className="w-5 h-5 text-green-600" />}
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* Características comunes */}
            {allFeatures.map((feature) => (
              <tr key={feature} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-700">{feature}</td>
                {selectedProperties.map((property) => {
                  const hasFeature = getFeatureList(property).includes(feature);
                  return (
                    <td key={property.id} className="px-4 py-3 text-center">
                      {hasFeature ? (
                        <Check className="w-6 h-6 text-green-600 mx-auto" />
                      ) : (
                        <XCircle className="w-6 h-6 text-gray-300 mx-auto" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}

            {/* Descripción (truncada) */}
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-700">Descripción</td>
              {selectedProperties.map((property) => (
                <td key={property.id} className="px-4 py-3 text-sm text-gray-600">
                  {property.description 
                    ? `${property.description.substring(0, 100)}${property.description.length > 100 ? '...' : ''}`
                    : 'Sin descripción'}
                </td>
              ))}
            </tr>

            {/* Acción */}
            <tr className="bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-700">Acción</td>
              {selectedProperties.map((property) => (
                <td key={property.id} className="px-4 py-3 text-center">
                  <a
                    href={`/properties/${property.id}`}
                    className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm"
                  >
                    Ver Detalles
                  </a>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer con resumen */}
      <div className="bg-gray-50 p-4 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Precio promedio:</p>
            <p className="font-semibold text-gray-900">
              ${(selectedProperties.reduce((sum, p) => sum + p.price, 0) / selectedProperties.length).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Mejor valor:</p>
            <p className="font-semibold text-gray-900">
              {selectedProperties.reduce((best, p) => 
                calculateScore(p) > calculateScore(best) ? p : best
              ).title}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Rango de precio:</p>
            <p className="font-semibold text-gray-900">
              ${Math.min(...selectedProperties.map(p => p.price)).toLocaleString()} - ${Math.max(...selectedProperties.map(p => p.price)).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

