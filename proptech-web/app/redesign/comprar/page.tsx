'use client';

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
  description?: string;
  type?: string;
  operation?: string;
  emotional_tags?: string[];
}

export default function RedesignComprarPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // MISMO endpoint que la página original, NUEVA presentación
    const fetchProperties = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://proptech-mvp-1.onrender.com';
        const response = await fetch(`${backendUrl}/api/properties`, { 
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error('API failed');
        }
        
        const data = await response.json();
        setProperties(data.properties || data || []);
        setLoading(false);
      } catch (err) {
        console.log('🔧 Using fallback mock data - Backend unavailable');
        // Datos de fallback idénticos a la página original
        const fallbackData = Array.from({ length: 20 }, (_, i) => ({
          id: `fallback-${i}`,
          title: `Propiedad ${i+1} en Santo Domingo`,
          price: Math.floor(Math.random() * 500000) + 50000,
          location: `Santo Domingo ${i+1}`,
          bedrooms: Math.floor(Math.random() * 4) + 1,
          bathrooms: Math.floor(Math.random() * 3) + 1,
          area: Math.floor(Math.random() * 200) + 80,
          images: [`https://picsum.photos/800/600?random=${i}`],
          features: ['Piscina', 'Estacionamiento', 'Seguridad 24/7'],
          operation: Math.random() > 0.5 ? 'compra' : 'alquiler'
        }));
        setProperties(fallbackData);
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-bg p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-dark-green mb-8">Descubre Propiedades</h1>
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

  if (error) {
    return (
      <div className="min-h-screen bg-warm-bg p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error cargando propiedades</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-bg p-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-dark-green mb-4">
            Encuentra tu Hogar en el Caribe
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Descubre propiedades exclusivas con la nueva experiencia HabitatPro
          </p>
        </div>

        {/* GRID DE PROPIEDADES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <RedesignPropertyCard
              key={property.id}
              property={property}
              onClick={() => {
                console.log('Property clicked:', property.id);
                // TODO: Navegar a página de detalle cuando esté implementada
              }}
            />
          ))}
        </div>

        {/* ESTADO VACÍO */}
        {properties.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏝️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No hay propiedades disponibles
            </h3>
            <p className="text-gray-600">
              Pronto tendremos nuevas propiedades para ti
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

