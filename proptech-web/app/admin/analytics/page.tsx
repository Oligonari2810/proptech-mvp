'use client';

import NextAuthRoleGuard from '../../components/auth/NextAuthRoleGuard';
import PortalStatistics from '../../components/analytics/PortalStatistics';
import AuditLogs from '../../components/analytics/AuditLogs';
import ContentModeration from '../../components/admin/ContentModeration';
import dynamic from 'next/dynamic';

const LeadHeatmap = dynamic(() => import('../../components/analytics/LeadHeatmap'), { ssr: false });

export default function AnalyticsDashboard() {
  return (
    <NextAuthRoleGuard allowedRoles={['admin']}>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">Analytics & Backoffice</h1>

        <PortalStatistics />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">ROI Dashboard</h3>
            <p className="text-sm text-gray-500">Ver análisis detallado en Métricas → ROI.</p>
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


