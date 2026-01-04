"use client";

// Page debe ser dinámica para evitar prerender
export const dynamic = 'force-dynamic';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useToast } from '../components/ToastNotification';
import { VoiceSearch } from '../components/VoiceSearch';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import SmartFilters from '../components/search/SmartFilters';
import PropertySplitView from '../components/split-view/PropertySplitView';
import { EmotionalSearchChatbot } from '../components/ai/EmotionalSearchChatbot';
import PropertyRecommendations from '../components/ai/PropertyRecommendations';
import PropertyComparator from '../components/comparator/PropertyComparator';
import { LoadingOptimized, PageLoading } from '../components/LoadingOptimized';

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

function ComprarInner() {
  const { addToast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [allProperties, setAllProperties] = useState<ListingProperty[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<ListingProperty[]>([]);
  const [useRedesign, setUseRedesign] = useState(false);
  const [filters, setFilters] = useState<FilterState>({});
  const [loading, setLoading] = useState(true);

  const filtersFromQuery = useCallback((sp: { get: (k: string) => string | null }) => {
    const num = (v: string | null) => {
      if (!v) return undefined;
      const n = Number(v);
      return Number.isFinite(n) ? n : undefined;
    };
    const features: string[] = [];
    if ((sp.get('has_pool') || '').toLowerCase() === 'true') features.push('Piscina');
    if ((sp.get('has_garage') || '').toLowerCase() === 'true') features.push('Garaje');
    if ((sp.get('has_elevator') || '').toLowerCase() === 'true') features.push('Ascensor');

    return {
      minPrice: num(sp.get('min_price')),
      maxPrice: num(sp.get('max_price')),
      bedrooms: num(sp.get('bedrooms')),
      bathrooms: num(sp.get('bathrooms')),
      minArea: num(sp.get('min_surface')),
      maxArea: num(sp.get('max_surface')),
      location: sp.get('location') || undefined,
      propertyType: sp.get('property_type') || undefined,
      features: features.length ? features : undefined,
    } satisfies FilterState;
  }, []);

  const queryFromFilters = useCallback((f: FilterState) => {
    const params = new URLSearchParams();
    // Fuente de verdad: URL. Mantenemos operation fijo en /comprar.
    params.set('operation', 'compra');
    if (f.minPrice != null) params.set('min_price', String(f.minPrice));
    if (f.maxPrice != null) params.set('max_price', String(f.maxPrice));
    if (f.bedrooms != null) params.set('bedrooms', String(f.bedrooms));
    if (f.bathrooms != null) params.set('bathrooms', String(f.bathrooms));
    if (f.minArea != null) params.set('min_surface', String(f.minArea));
    if (f.maxArea != null) params.set('max_surface', String(f.maxArea));
    if (f.location) params.set('location', f.location);
    if (f.propertyType) params.set('property_type', f.propertyType);

    const feats = f.features || [];
    if (feats.includes('Piscina')) params.set('has_pool', 'true');
    if (feats.includes('Garaje')) params.set('has_garage', 'true');
    if (feats.includes('Ascensor')) params.set('has_elevator', 'true');

    return params;
  }, []);

  // Cargar propiedades del backend
  const loadProperties = useCallback(async (sp?: { toString: () => string }) => {
    setLoading(true);
    try {
      const params = new URLSearchParams(sp?.toString() || '');
      // CRÍTICO: Filtrar por operation=compra (siempre)
      params.set('operation', 'compra');

      const queryString = params.toString();
      const url = `/api/backend/api/properties${queryString ? `?${queryString}` : ''}`;
      
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error('API failed');
      
      const data = await res.json();
      let props = (data.properties || data || []) as ListingProperty[];
      // Enriquecer propiedades sin coordenadas con coords de demo por ubicación
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
            // Fallback al centro de Santo Domingo si no coincide
            (p as any).latitude = 18.4861;
            (p as any).longitude = -69.9312;
          }
        }
        return p;
      });
      setAllProperties(props);
      setFilteredProperties(props);
    } catch (_e) {
      // Fallback con datos de ejemplo
      const fallback = Array.from({ length: 20 }, (_, i) => ({
        id: `fallback-${i}`,
        title: `Propiedad ${i+1} en Santo Domingo`,
        price: Math.floor(Math.random() * 500000) + 50000,
        location: `Santo Domingo ${i+1}`,
        latitude: 18.4861 + (Math.random() - 0.5) * 0.1,
        longitude: -69.9312 + (Math.random() - 0.5) * 0.1,
        bedrooms: Math.floor(Math.random() * 4) + 1,
        bathrooms: Math.floor(Math.random() * 3) + 1,
        area: Math.floor(Math.random() * 200) + 80,
        images: [`https://picsum.photos/800/600?random=${i}`],
        features: ['Piscina', 'Estacionamiento', 'Seguridad 24/7']
      }));
      setAllProperties(fallback as unknown as ListingProperty[]);
      setFilteredProperties(fallback as unknown as ListingProperty[]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // URL es la fuente de verdad: parsea filtros y carga
    const parsed = filtersFromQuery(searchParams);
    setFilters(parsed);
    loadProperties(searchParams);
    
    // Feature flag: env o localStorage
    try {
      const byEnv = process.env.NEXT_PUBLIC_REDESIGN_ENABLED === 'true';
      const byLocal = typeof window !== 'undefined' && localStorage.getItem('redesign-enabled') === 'true';
      setUseRedesign(!!(byEnv || byLocal));
    } catch {}
  }, [loadProperties, searchParams, filtersFromQuery]);

  // Aplicar filtros
  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    const qs = queryFromFilters(newFilters);
    router.replace(`/comprar?${qs.toString()}`);
  }, [router, queryFromFilters]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header con Filtros */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              {useRedesign ? '🏝️ Descubre Propiedades Premium' : 'Encuentra tu Propiedad Ideal'}
            </h1>
            
            {/* Toggle de rediseño */}
            <div className="flex items-center gap-3">
              <Link
                href={`/map?${queryFromFilters(filters).toString()}`}
                className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Ver en mapa
              </Link>
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
          </div>
          
          {/* Filtros Inteligentes */}
          
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
              // Integrar con filtros existentes
              handleFilterChange({ ...filters, location: text });
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

      {/* Split View */}
      <div className="flex-1">
        {loading ? (
          <PageLoading message="Cargando propiedades..." />
        ) : (
          <div className="relative h-full">
            <PropertySplitView
              properties={filteredProperties}
              useRedesign={useRedesign}
              onPropertySelect={(property) => {
                console.log('Property selected:', property);
              }}
            />
            <div className="hidden lg:block absolute top-4 right-4 z-10 w-96">
              <div className="bg-white/90 backdrop-blur rounded-xl shadow-card p-4 border">
                <h3 className="text-md font-semibold text-gray-900 mb-3">Recomendadas para ti</h3>
                {/* Usamos la primera propiedad como referencia si existe */}
                {filteredProperties.length > 0 ? (
                  <PropertyRecommendations propertyId={Number(filteredProperties[0].id)} />
                ) : (
                  <p className="text-sm text-gray-600">Aplica filtros para obtener recomendaciones.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chatbot de IA Emocional */}
      <EmotionalSearchChatbot 
        showSuggestions={true}
        onPropertySelect={(property) => {
          // Redirigir a la página de detalle de la propiedad
          window.location.href = `/properties/${property.id}`;
        }}
      />
    </div>
  );
}

export default function ComprarPage() {
  // Next.js requiere Suspense boundary cuando se usa useSearchParams en page
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <ComprarInner />
    </Suspense>
  );
}
