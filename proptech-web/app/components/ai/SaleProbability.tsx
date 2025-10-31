"use client";

import { useEffect, useState } from 'react';

interface PropertyLike {
  id?: number | string;
  price?: number;
  area?: number;
  bedrooms?: number;
}

interface SaleProbabilityResponse {
  saleProbability?: { [k: string]: number };
  estimatedDaysOnMarket?: number;
  factors?: { factor: string; impact: string }[];
  error?: string;
}

export default function SaleProbability({ property }: { property: PropertyLike }) {
  const [data, setData] = useState<SaleProbabilityResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://proptech-mvp-1.onrender.com';
        const res = await fetch(`${backendUrl}/api/ai/sale-probability`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            price: property.price,
            area: property.area,
            bedrooms: property.bedrooms,
          }),
        });
        const json = (await res.json()) as SaleProbabilityResponse;
        setData(json);
      } catch (e) {
        setData({ error: (e as Error).message });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [property?.price, property?.area, property?.bedrooms]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Probabilidad de venta (IA)</h3>
      {loading ? (
        <p className="text-gray-600">Calculando...</p>
      ) : data?.error ? (
        <p className="text-red-600">{data.error}</p>
      ) : (
        <div className="space-y-3">
          {data?.saleProbability && (
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(data.saleProbability).map(([k, v]) => (
                <div key={k} className="text-center">
                  <p className="text-sm text-gray-600">{k}</p>
                  <p className="font-semibold text-gray-900">{Math.round(v * 100)}%</p>
                </div>
              ))}
            </div>
          )}
          {typeof data?.estimatedDaysOnMarket === 'number' && (
            <p className="text-sm text-gray-700">Días estimados en mercado: <span className="font-semibold">{data.estimatedDaysOnMarket}</span></p>
          )}
          {data?.factors && data.factors.length > 0 && (
            <div>
              <p className="text-sm text-gray-600 mb-2">Factores:</p>
              <ul className="list-disc pl-5 text-sm text-gray-700">
                {data.factors.slice(0, 4).map((f, i) => (
                  <li key={i}>{f.factor} – {f.impact}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


