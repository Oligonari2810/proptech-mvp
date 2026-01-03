'use client';

import { useEffect, useState } from 'react';

interface Stats {
  totalProperties: number;
  totalUsers: number;
  activeLeads: number;
  monthlyGrowth: number;
  conversionRate: number;
}

export default function PortalStatistics() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const base = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    const load = async () => {
      try {
        const res = await fetch(`${base}/api/analytics/portal-stats`, { cache: 'no-store' });
        const data = await res.json();
        if (!cancelled) {
          setStats(data);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) setError('No se pudieron cargar estadísticas');
      }
    };
    load();
    const id = setInterval(load, 30000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {error && <div className="col-span-5 text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded px-3 py-2">{error}</div>}
      <Stat label="Propiedades" value={stats?.totalProperties ?? 0} />
      <Stat label="Usuarios" value={stats?.totalUsers ?? 0} />
      <Stat label="Leads activos" value={stats?.activeLeads ?? 0} />
      <Stat label="Crec. mensual" value={`${(stats?.monthlyGrowth ?? 0).toFixed(1)}%`} />
      <Stat label="Conversión" value={`${(stats?.conversionRate ?? 0).toFixed(1)}%`} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="text-sm text-gray-600">{label}</div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  );
}


