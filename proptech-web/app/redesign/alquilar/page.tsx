'use client';

// Page debe ser dinámica para evitar prerender
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import RedesignPropertyCard from '../../components/redesign/PropertyCard';
import '../../styles/redesign/globals.css';
import '../../styles/redesign/theme.css';

interface Property {
  id: number | string;
  title: string;
  price: number;
  location: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  square_meters?: number;
  images?: string[];
  image?: string;
  features?: string[];
  operation?: string;
  emotional_tags?: string[];
}

export default function RedesignAlquilarPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(`/api/backend/api/properties`, { 
          cache: 'no-store',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
          const data = await response.json();
          // Filtrar solo propiedades en alquiler
          const alquilerProps = (data.properties || data || []).filter(
            (p: Property) => p.operation === 'alquiler' || !p.operation
          );
          setProperties(alquilerProps);
        }
      } catch (err) {
        console.log('Using fallback data');
        const fallbackData = Array.from({ length: 12 }, (_, i) => ({
          id: `alquiler-${i}`,
          title: `Propiedad en Alquiler ${i+1}`,
          price: Math.floor(Math.random() * 2000) + 500,
          location: `Santo Domingo ${i+1}`,
          bedrooms: Math.floor(Math.random() * 4) + 1,
          bathrooms: Math.floor(Math.random() * 3) + 1,
          area: Math.floor(Math.random() * 150) + 60,
          images: [`https://picsum.photos/800/600?random=${i + 100}`],
          operation: 'alquiler'
        }));
        setProperties(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-bg p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="redesign-card bg-white p-4 animate-pulse">
                <div className="h-48 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-bg p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-headline text-dark-green mb-4">Propiedades en Alquiler</h1>
          <p className="text-lg text-gray-medium max-w-2xl mx-auto">
            Encuentra el espacio perfecto para empezar tu historia
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <RedesignPropertyCard
              key={property.id}
              property={property}
              onClick={() => console.log('Property clicked:', property.id)}
            />
          ))}
        </div>

        {properties.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔑</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay propiedades disponibles</h3>
          </div>
        )}
      </div>
    </div>
  );
}

