'use client';

import { useEffect, useState } from 'react';

interface Valuation {
  estimatedValue: number;
  confidence: number; // 0..1
  priceRange?: { min?: number; max?: number };
}

export default function ValueEstimator({ property }: { property: any }) {
  const [valuation, setValuation] = useState<Valuation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const estimateValue = async () => {
      try {
        setLoading(true);
        const base = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
        const res = await fetch(`${base}/api/ai/valuation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(property)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Error IA valuation');
        setValuation(data);
        setError(null);
      } catch (e) {
        setError('No se pudo calcular el valor estimado');
        setValuation(null);
      } finally {
        setLoading(false);
      }
    };

    if (property) estimateValue();
  }, [property]);

  if (loading) return <div className="bg-white p-4 rounded-lg border">Calculando valor…</div>;
  if (error || !valuation) return <div className="bg-white p-4 rounded-lg border text-red-600">{error || 'Error en valoración'}</div>;

  return (
    <div className="bg-white p-4 rounded-lg shadow border">
      <h3 className="text-lg font-bold mb-2">💎 Valor Estimado por IA</h3>
      <div className="text-2xl font-bold text-green-600">
        ${valuation.estimatedValue?.toLocaleString()}
      </div>
      <div className="text-sm text-gray-600 mt-1">
        Confianza: {(valuation.confidence * 100).toFixed(0)}%
      </div>
      {valuation.priceRange && (
        <div className="text-xs text-gray-500 mt-2">
          Rango: ${valuation.priceRange?.min?.toLocaleString() || '-'} - ${valuation.priceRange?.max?.toLocaleString() || '-'}
        </div>
      )}
    </div>
  );
}


