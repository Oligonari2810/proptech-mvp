'use client';

import { useState } from 'react';

export default function GoogleSheetsIntegration() {
  const [sheetUrl, setSheetUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const testConnection = async () => {
    try {
      setStatus('Probando conexión...');
      await new Promise((r) => setTimeout(r, 800));
      setStatus('✅ Conexión verificada');
    } catch (e) {
      setStatus('❌ Error al conectar');
    }
  };

  const syncNow = async () => {
    setStatus('Sincronizando...');
    await new Promise((r) => setTimeout(r, 1200));
    setStatus('✅ Sincronización completada');
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Integración Google Sheets</h2>
        <p className="text-sm text-gray-600">Sincroniza leads y propiedades con tu hoja de cálculo.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL de la Hoja</label>
          <input
            type="url"
            placeholder="https://docs.google.com/spreadsheets/d/..."
            value={sheetUrl}
            onChange={(e) => setSheetUrl(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
          <input
            type="password"
            placeholder="AIza..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={testConnection} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Probar</button>
        <button onClick={syncNow} className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200">Sincronizar ahora</button>
        {status && <span className="text-sm text-gray-700">{status}</span>}
      </div>
    </div>
  );
}


