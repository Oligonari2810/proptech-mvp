'use client';

import { useState } from 'react';
import NextAuthRoleGuard from '../../components/auth/NextAuthRoleGuard';
import PortalStatistics from '../../components/analytics/PortalStatistics';
import AuditLogs from '../../components/analytics/AuditLogs';
import ContentModeration from '../../components/admin/ContentModeration';
import dynamic from 'next/dynamic';

const LeadHeatmap = dynamic(() => import('../../components/analytics/LeadHeatmap'), { ssr: false });

type TimeRange = '7d' | '30d' | '90d' | '1y';

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');

  return (
    <NextAuthRoleGuard allowedRoles={['admin']}>
      <div className="p-6 space-y-6">
        {/* Header con Time Range Selector */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Analytics & Backoffice</h1>
            <p className="text-gray-600 mt-1">Análisis y métricas de la plataforma</p>
          </div>
          <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
            {(['7d', '30d', '90d', '1y'] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-white text-brand-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {range === '7d' ? '7 días' : range === '30d' ? '30 días' : range === '90d' ? '90 días' : '1 año'}
              </button>
            ))}
          </div>
        </div>

        <PortalStatistics />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">ROI Dashboard</h3>
            <p className="text-sm text-gray-500 mb-2">Ver análisis detallado en Métricas → ROI.</p>
            <a className="inline-block mt-2 text-indigo-600 hover:text-indigo-700 text-sm" href="/admin/metricas/roi">Abrir ROI</a>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-2">
            <h3 className="text-lg font-semibold mb-2 px-2">Mapa de Calor de Leads</h3>
            <LeadHeatmap />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ContentModeration />
          <AuditLogs />
        </div>
      </div>
    </NextAuthRoleGuard>
  );
}


