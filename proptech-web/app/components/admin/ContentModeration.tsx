'use client';

import { useEffect, useState } from 'react';

interface PendingItem {
  propertyId: number;
  title?: string;
  status: string;
}

export default function ContentModeration() {
  const [items, setItems] = useState<PendingItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
        const res = await fetch(`${base}/api/admin/pending-moderation`, { cache: 'no-store' });
        const data = await res.json();
        setItems(data.items || []);
      } catch (e) {
        setError('No se pudieron cargar elementos de moderación');
      }
    };
    load();
  }, []);

  const moderate = async (propertyId: number, action: 'approve' | 'reject') => {
    try {
      const base = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      await fetch(`${base}/api/admin/moderate/${propertyId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      setItems(prev => prev.filter(p => p.propertyId !== propertyId));
    } catch (_e) {
      // mantener UI estable, opcionalmente mostrar aviso
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-semibold mb-3">Moderación de Contenido</h3>
      {error && <div className="text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded px-3 py-2 mb-3">{error}</div>}
      {items.length === 0 ? (
        <p className="text-sm text-gray-500">Sin elementos pendientes</p>
      ) : (
        <ul className="space-y-2 text-sm">
          {items.map((it) => (
            <li key={it.propertyId} className="flex items-center justify-between border-b last:border-b-0 py-2">
              <div>
                <div className="font-medium text-gray-900">#{it.propertyId} — {it.title || 'Propiedad'}</div>
                <div className="text-gray-500">Estado: {it.status}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => moderate(it.propertyId, 'approve')} className="px-3 py-1 border rounded hover:bg-gray-50">Aprobar</button>
                <button onClick={() => moderate(it.propertyId, 'reject')} className="px-3 py-1 border rounded hover:bg-gray-50">Rechazar</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


