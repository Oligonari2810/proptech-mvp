'use client';

import { useState } from 'react';

export default function MarketAlerts() {
  const [enabled, setEnabled] = useState(true);
  const [minDrop, setMinDrop] = useState(5);
  const [watchLocation, setWatchLocation] = useState('Santo Domingo');
  const [status, setStatus] = useState<string | null>(null);

  const save = async () => {
    setStatus('Guardando...');
    await new Promise((r) => setTimeout(r, 800));
    setStatus('✅ Configuración guardada');
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Alertas de Mercado</h2>
          <p className="text-sm text-gray-600">Recibe alertas de cambios de precio y tendencias.</p>
        </div>
        {status && <span className="text-sm text-gray-700">{status}</span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-2">
          <input id="enabled" type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
          <label htmlFor="enabled" className="text-sm text-gray-800">Activar alertas</label>
        </div>
        <div>
          <label className="block text-sm mb-1 text-gray-700">Caída mínima de precio (%)</label>
          <input type="number" value={minDrop} onChange={(e) => setMinDrop(parseInt(e.target.value) || 0)} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label className="block text-sm mb-1 text-gray-700">Ubicación</label>
          <input type="text" value={watchLocation} onChange={(e) => setWatchLocation(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={save} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Guardar</button>
        <button onClick={() => setStatus('🔔 Enviaremos un ejemplo pronto')} className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200">Enviar ejemplo</button>
      </div>
    </div>
  );
}


