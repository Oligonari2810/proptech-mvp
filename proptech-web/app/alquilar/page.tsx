import { LoadingOptimized, PageLoading, SectionLoading } from '../components/LoadingOptimized';
"use client";

// Page debe ser dinámica para evitar prerender
export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback } from 'react';
import { useToast } from '../components/ToastNotification';
import { VoiceSearch } from '../components/VoiceSearch';
import SmartFilters from '../components/search/SmartFilters';
import PropertySplitView from '../components/split-view/PropertySplitView';

interface ListingProperty {
  id: string | number;
  title: string;
  price: number;
  location: string;
  latitude?: number;
  longitude?: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  images?: string[];
  features?: string[];
  operation?: string;
}

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

export default function AlquilarPage() {
  const { addToast } = useToast();
  const [allProperties, setAllProperties] = useState<ListingProperty[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<ListingProperty[]>([]);
  const [useRedesign, setUseRedesign] = useState(false);
  const [filters, setFilters] = useState<FilterState>({});
  const [loading, setLoading] = useState(true);

  const loadProperties = useCallback(async (filterParams?: FilterState) => {
    setLoading(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://proptech-mvp-1.onrender.com';

      const params = new URLSearchParams();
      // CRÍTICO: Filtrar por operation=alquiler
      params.append('operation', 'alquiler');
      if (filterParams?.minPrice) params.append('min_price', filterParams.minPrice.toString());
      if (filterParams?.maxPrice) params.append('max_price', filterParams.maxPrice.toString());
      if (filterParams?.bedrooms) params.append('bedrooms', filterParams.bedrooms.toString());
      if (filterParams?.bathrooms) params.append('bathrooms', filterParams.bathrooms.toString());
      if (filterParams?.minArea) params.append('min_surface', filterParams.minArea.toString());
      if (filterParams?.maxArea) params.append('max_surface', filterParams.maxArea.toString());
      if (filterParams?.location) params.append('location', filterParams.location);
      if (filterParams?.propertyType) params.append('property_type', filterParams.propertyType);

      if (filterParams?.features) {
        if (filterParams.features.includes('Piscina')) params.append('has_pool', 'true');
        if (filterParams.features.includes('Garaje')) params.append('has_garage', 'true');
        if (filterParams.features.includes('Ascensor')) params.append('has_elevator', 'true');
      }

      const queryString = params.toString();
      const url = `${backendUrl}/api/properties${queryString ? `?${queryString}` : ''}`;

      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error('API failed');

      const data = await res.json();
      let props = (data.properties || data || []) as ListingProperty[];
      const locationToCoords: Record<string, { lat: number; lng: number }> = {
        'Santo Domingo': { lat: 18.4861, lng: -69.9312 },
        'Punta Cana': { lat: 18.5820, lng: -68.4055 },
        'Santiago': { lat: 19.4517, lng: -70.6970 },
        'La Romana': { lat: 18.4273, lng: -68.9728 },
        'Bávaro': { lat: 18.7052, lng: -68.4509 },
      };
      props = props.map((p) => {
        const hasCoords = (p as any).latitude && (p as any).longitude;
        if (!hasCoords) {
          const match = locationToCoords[p.location as string];
          if (match) {
            (p as any).latitude = match.lat;
            (p as any).longitude = match.lng;
          } else {
            (p as any).latitude = 18.4861;
            (p as any).longitude = -69.9312;
          }
        }
        return p;
      });
      setAllProperties(props);
      setFilteredProperties(props);
    } catch (_e) {
      const fallback = Array.from({ length: 20 }, (_, i) => ({
        id: `fallback-rent-${i}`,
        title: `Alquiler ${i+1} en Santo Domingo`,
        price: Math.floor(Math.random() * 2000) + 400,
        location: `Santo Domingo ${i+1}`,
        latitude: 18.4861 + (Math.random() - 0.5) * 0.1,
        longitude: -69.9312 + (Math.random() - 0.5) * 0.1,
        bedrooms: Math.floor(Math.random() * 4) + 1,
        bathrooms: Math.floor(Math.random() * 3) + 1,
        area: Math.floor(Math.random() * 200) + 80,
        images: [`https://picsum.photos/800/600?random=${i+100}`],
        features: ['Cocina equipada', 'Amueblado']
      }));
      setAllProperties(fallback as unknown as ListingProperty[]);
      setFilteredProperties(fallback as unknown as ListingProperty[]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProperties();
    try {
      const byEnv = process.env.NEXT_PUBLIC_REDESIGN_ENABLED === 'true';
      const byLocal = typeof window !== 'undefined' && localStorage.getItem('redesign-enabled') === 'true';
      setUseRedesign(!!(byEnv || byLocal));
    } catch {}
  }, [loadProperties]);

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    loadProperties(newFilters);
  }, [loadProperties]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Propiedades en Alquiler</h1>

            <div className="bg-white p-2 rounded-lg shadow-sm border">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useRedesign}
                  onChange={(e) => {
                    setUseRedesign(e.target.checked);
                    try { localStorage.setItem('redesign-enabled', e.target.checked.toString()); } catch {}
                  }}
                />
                <span className="text-sm">🎨 Rediseño</span>
              </label>
            </div>
          </div>

          
        {/* Voice Search Integration */}
        <div className="mb-4 flex items-center gap-2">
          <VoiceSearch
            onResult={(text) => {
              addToast({
                type: 'success',
                title: 'Voz reconocida',
                message: `Buscando: "${text}"`,
                duration: 2000,
              });
              // Integrar con búsqueda existente
              if (typeof handleSearch === 'function') {
                handleSearch({ query: text });
              }
            }}
            onError={(error) => {
              addToast({
                type: 'error',
                title: 'Error en búsqueda por voz',
                message: error,
                duration: 4000,
              });
            }}
          />
        </div>

<SmartFilters onFilterChange={handleFilterChange} initialFilters={filters} />
        </div>
      </div>

      <div className="flex-1">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <LoadingOptimized type="spinner" size="md" />
              <p className="text-gray-600">Cargando propiedades...</p>
            </div>
          </div>
        ) : (
          <PropertySplitView
            properties={filteredProperties}
            useRedesign={useRedesign}
            onPropertySelect={(property) => {
              console.log('Property selected:', property);
            }}
          />
        )}
      </div>
    </div>
  );
}
