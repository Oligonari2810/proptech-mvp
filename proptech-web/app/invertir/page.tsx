"use client";

import { Suspense, useEffect, useState, useCallback } from 'react';
import { LoadingOptimized, PageLoading, SectionLoading } from '../components/LoadingOptimized';
import { useToast } from '../components/ToastNotification';
import { VoiceSearch } from '../components/VoiceSearch';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import SmartFilters from '../components/search/SmartFilters';
import PropertySplitView from '../components/split-view/PropertySplitView';
import SavedSearchesMenu from '../components/search/SavedSearchesMenu';
import { SaveSearchButton } from '../components/SaveSearchButton';

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

function InvertirInner() {
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

  const selectedIdFromQuery = (searchParams.get('selected') || '').trim() || undefined;

  const queryFromFilters = useCallback((f: FilterState) => {
    const params = new URLSearchParams();
    params.set('operation', 'inversion');
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

  const loadProperties = useCallback(async (sp?: { toString: () => string }) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      const fromUrl = new URLSearchParams(sp?.toString() || '');
      for (const [k, v] of fromUrl.entries()) params.set(k, v);
      // Consistencia: /invertir = inversion
      params.set('operation', 'inversion');

      const queryString = params.toString();
      const url = `/api/backend/api/properties${queryString ? `?${queryString}` : ''}`;

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
        id: `fallback-invest-${i}`,
        title: `Inversión ${i+1} en Santo Domingo`,
        price: Math.floor(Math.random() * 600000) + 80000,
        location: `Santo Domingo ${i+1}`,
        latitude: 18.4861 + (Math.random() - 0.5) * 0.1,
        longitude: -69.9312 + (Math.random() - 0.5) * 0.1,
        bedrooms: Math.floor(Math.random() * 4) + 1,
        bathrooms: Math.floor(Math.random() * 3) + 1,
        area: Math.floor(Math.random() * 200) + 80,
        images: [`https://picsum.photos/800/600?random=${i+200}`],
        features: ['Rentabilidad', 'Alta demanda']
      }));
      setAllProperties(fallback as unknown as ListingProperty[]);
      setFilteredProperties(fallback as unknown as ListingProperty[]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const parsed = filtersFromQuery(searchParams);
    setFilters(parsed);
    loadProperties(searchParams);
    try {
      const byEnv = process.env.NEXT_PUBLIC_REDESIGN_ENABLED === 'true';
      const byLocal = typeof window !== 'undefined' && localStorage.getItem('redesign-enabled') === 'true';
      setUseRedesign(!!(byEnv || byLocal));
    } catch {}
  }, [loadProperties, searchParams, filtersFromQuery]);

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    const qs = queryFromFilters(newFilters);
    router.replace(`/invertir?${qs.toString()}`);
  }, [router, queryFromFilters]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Oportunidades de Inversión</h1>

            <div className="flex items-center gap-4">
              <SavedSearchesMenu />
              <SaveSearchButton href={`/invertir?${queryFromFilters(filters).toString()}`} defaultName="Invertir" />
              <Link
                href={`/map?${queryFromFilters(filters).toString()}`}
                className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Ver en mapa
              </Link>
              <Link
                href="/confotur"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
              >
                <span>🏖️</span>
                <span>Guía CONFOTUR</span>
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
          
          {/* Banner Informativo CONFOTUR */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <span className="text-3xl">🏖️</span>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-1">
                  Inversiones Turísticas en RD
                </h3>
                <p className="text-sm text-gray-700 mb-2">
                  ¿Planeas una inversión inmobiliaria turística? Consulta nuestra guía completa de trámites 
                  con <strong>CONFOTUR</strong> (Consejo Nacional de Fomento del Turismo) y accede a beneficios 
                  fiscales según la <strong>Ley 158-01</strong>.
                </p>
                <Link
                  href="/confotur"
                  className="text-blue-600 hover:text-blue-800 font-semibold text-sm inline-flex items-center gap-1"
                >
                  Ver guía CONFOTUR →
                </Link>
              </div>
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
            initialSelectedId={selectedIdFromQuery}
            onSelectionChange={(property) => {
              const params = new URLSearchParams(searchParams.toString());
              if (property) params.set('selected', String(property.id));
              else params.delete('selected');
              router.replace(`/invertir?${params.toString()}`);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default function InvertirPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <InvertirInner />
    </Suspense>
  );
}
