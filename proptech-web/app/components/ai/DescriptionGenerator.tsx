'use client';

import { useState } from 'react';

export default function DescriptionGenerator({ propertyData, onDescriptionGenerated }: { propertyData: any; onDescriptionGenerated: (d: string) => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError(null);
      const base = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      const res = await fetch(`${base}/api/ai/describe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(propertyData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Error IA descripción');
      onDescriptionGenerated(data.description || '');
    } catch (e) {
      setError('No se pudo generar la descripción');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button onClick={handleGenerate} disabled={loading} className="px-3 py-2 border rounded hover:bg-gray-50 text-sm">
        {loading ? 'Generando…' : '🪄 Generar Descripción Automática'}
      </button>
      {error && <div className="text-xs text-red-600">{error}</div>}
    </div>
  );
}



