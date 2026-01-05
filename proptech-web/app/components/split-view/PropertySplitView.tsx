'use client';

import { useEffect, useState } from 'react';
import OriginalPropertyCard from '../ui/PropertyCard';
import RedesignPropertyCard from '../redesign/PropertyCard';
import { MapCluster } from '../MapCluster';

interface Property {
  id: string | number;
  title: string;
  price: number;
  location: string;
  latitude?: number;
  longitude?: number;
  // compat: algunos endpoints/fixtures usan lat/lng
  lat?: number;
  lng?: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  images?: string[];
  features?: string[];
  operation?: string;
}

interface PropertySplitViewProps {
  properties: Property[];
  useRedesign?: boolean;
  onPropertySelect?: (property: Property) => void;
  onSelectionChange?: (property: Property | null) => void;
  initialSelectedId?: string;
}

export default function PropertySplitView({ 
  properties, 
  useRedesign = false,
  onPropertySelect,
  onSelectionChange,
  initialSelectedId
}: PropertySplitViewProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [viewMode, setViewMode] = useState<'split' | 'list' | 'map'>('split');

  const getCoords = (p: Property): { latitude: number; longitude: number } | null => {
    const lat = p.latitude ?? p.lat;
    const lng = p.longitude ?? p.lng;
    if (typeof lat !== 'number' || typeof lng !== 'number') return null;
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    return { latitude: lat, longitude: lng };
  };

  useEffect(() => {
    if (!initialSelectedId) return;
    const found = properties.find((p) => String(p.id) === String(initialSelectedId));
    if (found) setSelectedProperty(found);
  }, [initialSelectedId, properties]);

  // Filtrar propiedades con coordenadas para el mapa
  const mapProperties = properties
    .map((p) => {
      const coords = getCoords(p);
      if (!coords) return null;
      return { ...p, ...coords };
    })
    .filter(Boolean) as Array<Property & { latitude: number; longitude: number }>;

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    onSelectionChange?.(property);
    if (onPropertySelect) {
      onPropertySelect(property);
    }
    // Scroll a la propiedad en la lista
    const element = document.getElementById(`property-${property.id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('ring-2', 'ring-blue-500', 'ring-offset-2');
      setTimeout(() => {
        element.classList.remove('ring-2', 'ring-blue-500', 'ring-offset-2');
      }, 2000);
    }
  };

  const clearSelection = () => {
    setSelectedProperty(null);
    onSelectionChange?.(null);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Toolbar de vistas */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Vista:</span>
          <button
            onClick={() => setViewMode('split')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              viewMode === 'split' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Dividida
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Lista
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              viewMode === 'map' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Mapa
          </button>
        </div>
        <div className="text-sm text-gray-600">
          {properties.length} propiedades encontradas
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex overflow-hidden">
        {/* Vista Split */}
        {viewMode === 'split' && (
          <>
            {/* Lista - 40% */}
            <div className="w-2/5 border-r border-gray-200 overflow-y-auto">
              <div className="p-4 space-y-4">
                {properties.length === 0 ? (
                  <div className="text-center text-gray-500 py-12">
                    <p>No se encontraron propiedades</p>
                  </div>
                ) : (
                  properties.map((property) => (
                    <div
                      key={property.id}
                      id={`property-${property.id}`}
                      onClick={() => handlePropertyClick(property)}
                      className={`cursor-pointer transition-all ${
                        selectedProperty?.id === property.id 
                          ? 'ring-2 ring-blue-500 ring-offset-2' 
                          : 'hover:shadow-md'
                      }`}
                    >
                      {useRedesign ? (
                        <RedesignPropertyCard property={property} onClick={() => {}} />
                      ) : (
                        <OriginalPropertyCard
                          id={String(property.id)}
                          title={property.title}
                          price={property.price}
                          location={property.location}
                          bedrooms={property.bedrooms}
                          area={property.area}
                        />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Mapa - 60% */}
            <div className="w-3/5 h-full relative">
              {mapProperties.length > 0 ? (
                <div className="h-full w-full">
                  <MapCluster 
                    properties={mapProperties as any}
                    listings={mapProperties as any}
                  />
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <p className="text-lg mb-2">📍</p>
                    <p>No hay propiedades con coordenadas</p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Vista Solo Lista */}
        {viewMode === 'list' && (
          <div className="w-full overflow-y-auto">
            <div className="container mx-auto px-4 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <div key={property.id} onClick={() => handlePropertyClick(property)} className="cursor-pointer">
                    {useRedesign ? (
                      <RedesignPropertyCard property={property} onClick={() => {}} />
                    ) : (
                      <OriginalPropertyCard
                        id={String(property.id)}
                        title={property.title}
                        price={property.price}
                        location={property.location}
                        bedrooms={property.bedrooms}
                        area={property.area}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Vista Solo Mapa */}
        {viewMode === 'map' && (
          <div className="w-full h-full">
            {mapProperties.length > 0 ? (
              <MapCluster 
                properties={mapProperties as any}
                listings={mapProperties as any}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <p className="text-lg mb-2">📍</p>
                  <p>No hay propiedades con coordenadas</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Panel de detalles (opcional - slide desde abajo) */}
      {selectedProperty && viewMode !== 'list' && (
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 max-h-48 overflow-y-auto shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg">{selectedProperty.title}</h3>
              <p className="text-gray-600">{selectedProperty.location}</p>
              <p className="text-xl font-bold text-blue-600 mt-1">
                ${selectedProperty.price.toLocaleString()}
              </p>
            </div>
            <button
              onClick={clearSelection}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

