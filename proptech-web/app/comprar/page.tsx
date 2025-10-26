'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { MapCluster } from '../components/MapCluster';
import { LeadSticky } from '../components/LeadSticky';
import { mockApi } from '../lib/mock-api';

const PropertyMap = dynamic(() => import('@/components/maps/PropertyMap'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">Cargando mapa...</div>
});
import SearchFilters from '@/components/search/SearchFilters';
import PropertyCardWithChat from '@/components/properties/PropertyCardWithChat';
// import { PropertyCard } from '@/components/ui';
// import { PropertyGrid } from '../components/PropertyGrid';

interface Property {
  id: number;
  title: string;
  price: number;
  location: string;
  image: string;
  bedrooms: number;
  bathrooms: number;
  square_meters: number;
  latitude: number;
  longitude: number;
  brokerId: number;
}

export default function ComprarPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [filters, setFilters] = useState({
    type: '',
    min_price: '',
    max_price: '',
    min_bedrooms: '',
    location: ''
  });

  // Cargar propiedades con fallback a mock data
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        // Intentar backend real primero
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://habitatpro-backend.onrender.com';
        const response = await fetch(`${backendUrl}/api/properties/`);
        if (response.ok) {
          const data = await response.json();
          // El backend devuelve un array directo, no un objeto con 'properties'
          const propertiesList = Array.isArray(data) ? data : data.properties || [];
          setProperties(propertiesList);
          setFilteredProperties(propertiesList);
        } else {
          throw new Error('Backend not available');
        }
      } catch (error) {
        // Usar mock data si backend falla
        console.log('Using mock data:', error);
        const data = await mockApi.getListings();
        setProperties(data.listings || []);
        setFilteredProperties(data.listings || []);
      }
    };

    fetchProperties();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePropertyClick = (property: any) => {
    setSelectedProperty(property);
  };

  const handleFiltersChange = (newFilters: Record<string, string>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
    // Aquí se podría implementar la lógica de filtrado
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Encuentra tu hogar, encuentra tu historia</h1>
            <p className="text-gray-600 mt-2">
              {filteredProperties.length} casas esperando por ti
            </p>
          </div>
          
          {/* View Toggle */}
          <div className="flex space-x-2 bg-white rounded-lg p-1 border border-gray-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-md transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-purple-500 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📋 Lista
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-4 py-2 rounded-md transition-colors ${
                viewMode === 'map' 
                  ? 'bg-purple-500 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              🗺️ Mapa
            </button>
          </div>
        </div>

        {/* Filtros de Búsqueda */}
        <SearchFilters onFiltersChange={handleFiltersChange} />

        {/* Contenido Principal */}
        {viewMode === 'map' ? (
          /* Vista Mapa */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <PropertyMap 
                properties={filteredProperties}
                onPropertyClick={handlePropertyClick}
              />
            </div>
            
            {/* Panel de detalles */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {selectedProperty ? 'Detalles de la Propiedad' : 'Selecciona una propiedad'}
              </h3>
              
              {selectedProperty ? (
                <div className="space-y-4">
                  <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Imagen de propiedad</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{selectedProperty.title}</h4>
                    <p className="text-green-600 font-semibold text-xl">
                      ${selectedProperty.price.toLocaleString()}
                    </p>
                    <p className="text-gray-600">{selectedProperty.location}</p>
                    <div className="flex space-x-4 text-sm text-gray-500 mt-2">
                      <span>🛏️ {selectedProperty.bedrooms} hab</span>
                      <span>🚿 {selectedProperty.bathrooms} baños</span>
                      <span>📏 {selectedProperty.square_meters}m²</span>
                    </div>
                  </div>
                  <button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
                    Contactar Broker
                  </button>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <div className="text-4xl mb-2">🏠</div>
                  <p>Haz clic en un marcador del mapa para ver los detalles</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Vista Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCardWithChat
                key={property.id}
                property={{
                  ...property,
                  brokerId: property.brokerId || 1 // Default broker ID
                }}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* WhatsApp Sticky Button */}
      <LeadSticky listingId="comprar" />
    </div>
  );
}
