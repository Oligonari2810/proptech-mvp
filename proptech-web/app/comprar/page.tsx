"use client";

import { useEffect, useState } from 'react';
import { MapCluster } from '../components/MapCluster';
import { PropertyCard as OriginalPropertyCard } from '../components/PropertyCard';
import RedesignPropertyCard from '../components/redesign/PropertyCard';

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

export default function ComprarPage() {
  const [properties, setProperties] = useState<ListingProperty[]>([]);
  const [useRedesign, setUseRedesign] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://proptech-mvp-1.onrender.com';
        const res = await fetch(`${backendUrl}/api/properties`, { cache: 'no-store' });
        if (!res.ok) throw new Error('API failed');
        const data = await res.json();
        setProperties((data.properties || []) as ListingProperty[]);
      } catch (_e) {
        // Fallback
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
        setProperties(fallback as unknown as ListingProperty[]);
      }
    };
    load();

    // Feature flag: env o localStorage
    try {
      const byEnv = process.env.NEXT_PUBLIC_REDESIGN_ENABLED === 'true';
      const byLocal = typeof window !== 'undefined' && localStorage.getItem('redesign-enabled') === 'true';
      setUseRedesign(!!(byEnv || byLocal));
    } catch {}
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {useRedesign ? '🏝️ Descubre Propiedades Premium' : 'Encuentra tu Propiedad Ideal'}
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Filtros</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Precio Máximo</label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                    <option>Hasta $100,000</option>
                    <option>Hasta $250,000</option>
                    <option>Hasta $500,000</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Habitaciones</label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                    <option>Cualquiera</option>
                    <option>1+</option>
                    <option>2+</option>
                    <option>3+</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <MapCluster properties={properties as any} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property: ListingProperty) => (
                useRedesign ? (
                  <RedesignPropertyCard key={property.id} property={property} onClick={() => {}} />
                ) : (
                  <OriginalPropertyCard key={property.id} property={property as any} />
                )
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Toggle de prueba - se puede retirar tras validación */}
      <div className="fixed bottom-4 right-4 bg-white p-3 rounded-lg shadow-lg border">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={useRedesign}
            onChange={(e) => {
              setUseRedesign(e.target.checked);
              try { localStorage.setItem('redesign-enabled', e.target.checked.toString()); } catch {}
            }}
          />
          <span className="text-sm">🎨 Rediseño Caribbean Chic</span>
        </label>
      </div>
    </div>
  );
}
