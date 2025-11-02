'use client';

// Page debe ser dinámica para evitar prerender
export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import PropertyComparator from '../../components/comparator/PropertyComparator';
import Link from 'next/link';

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
}

function ComparatorContent() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const propertyIds = searchParams.get('ids')?.split(',').map(id => parseInt(id)).filter(Boolean);
    
    if (propertyIds && propertyIds.length > 0) {
      loadProperties(propertyIds);
    } else {
      // Si no hay IDs, intentar cargar del localStorage
      const savedIds = typeof window !== 'undefined' 
        ? localStorage.getItem('comparator_properties')?.split(',')
        : null;
      
      if (savedIds) {
        loadProperties(savedIds.map(id => parseInt(id)).filter(Boolean));
      } else {
        setLoading(false);
      }
    }
  }, [searchParams]);

  const loadProperties = async (ids: (number | string)[]) => {
    setLoading(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://proptech-mvp-1.onrender.com';
      
      const promises = ids.map(id => 
        fetch(`${backendUrl}/api/properties/${id}`).then(res => res.json())
      );
      
      const results = await Promise.all(promises);
      const loadedProperties = results
        .map(result => result.property || result)
        .filter(Boolean);
      
      setProperties(loadedProperties);
    } catch (err) {
      console.error('Error loading properties:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (id: number | string) => {
    const updated = properties.filter(p => p.id !== id);
    setProperties(updated);
    
    if (typeof window !== 'undefined') {
      const ids = updated.map(p => p.id.toString()).join(',');
      if (ids) {
        localStorage.setItem('comparator_properties', ids);
      } else {
        localStorage.removeItem('comparator_properties');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando propiedades...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link 
            href="/comprar"
            className="text-indigo-600 hover:text-indigo-700 text-sm"
          >
            ← Volver al listado
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">
            Comparar Propiedades
          </h1>
        </div>

        {properties.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 mb-4">No hay propiedades seleccionadas para comparar</p>
            <Link
              href="/comprar"
              className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Ir al listado
            </Link>
          </div>
        ) : (
          <PropertyComparator 
            properties={properties}
            onRemove={handleRemove}
            maxProperties={5}
          />
        )}
      </div>
    </div>
  );
}

export default function ComparatorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando comparador...</p>
        </div>
      </div>
    }>
      <ComparatorContent />
    </Suspense>
  );
}

