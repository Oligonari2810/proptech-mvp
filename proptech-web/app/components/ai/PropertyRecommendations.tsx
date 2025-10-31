'use client';

import { useEffect, useState } from 'react';
import OriginalPropertyCard from '../ui/PropertyCard';

interface Recommendation {
  propertyId: string | number;
  title?: string;
  price?: number;
  location?: string;
  similarityScore?: number;
}

export default function PropertyRecommendations({ propertyId }: { propertyId: string | number }) {
  const [items, setItems] = useState<Recommendation[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
        const res = await fetch(`${base}/api/ai/recommend`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ property_id: propertyId, limit: 5 })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Error recomendador');
        setItems(data.recommendations || []);
        setError(null);
      } catch (e) {
        setError('No se pudieron cargar recomendaciones');
        setItems([]);
      }
    };
    if (propertyId) load();
  }, [propertyId]);

  if (error) return <div className="text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded px-3 py-2">{error}</div>;
  if (items.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">🚀 Propiedades Similares</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((rec) => (
          <OriginalPropertyCard
            key={rec.propertyId}
            id={String(rec.propertyId)}
            title={rec.title || 'Propiedad sugerida'}
            price={rec.price || 0}
            location={rec.location || ''}
          />
        ))}
      </div>
    </div>
  );
}



