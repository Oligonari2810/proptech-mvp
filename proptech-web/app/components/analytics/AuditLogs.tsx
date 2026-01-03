'use client';

import { useEffect, useState } from 'react';

interface LogItem {
  id: string;
  action: string;
  timestamp: string;
  user?: string;
  details?: string;
}

export default function AuditLogs() {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
        const res = await fetch(`${base}/api/monitoring/audit-logs`, { cache: 'no-store' });
        const data = await res.json();
        setLogs(data.logs || data || []);
      } catch (e) {
        setError('No se pudieron cargar logs');
      }
    };
    load();
  }, []);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-semibold mb-3">Logs de Auditoría</h3>
      {error && <div className="text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded px-3 py-2 mb-3">{error}</div>}
      {logs.length === 0 ? (
        <p className="text-sm text-gray-500">Sin actividad reciente</p>
      ) : (
        <ul className="space-y-2 text-sm">
          {logs.map((l) => (
            <li key={l.id} className="flex items-center justify-between border-b last:border-b-0 py-2">
              <div>
                <div className="font-medium text-gray-900">{l.action}</div>
                <div className="text-gray-500">{l.details}</div>
              </div>
              <div className="text-gray-500">{new Date(l.timestamp).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


