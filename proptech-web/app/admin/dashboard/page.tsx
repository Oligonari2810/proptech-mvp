'use client';

import { useState, useEffect } from 'react';
import MetricsCards from '@/components/admin/MetricsCards';
import PropertiesTable from '@/components/admin/PropertiesTable';
import UsersManagement from '@/components/admin/UsersManagement';
import AnalyticsCharts from '@/components/admin/AnalyticsCharts';

interface DashboardData {
  totalProperties: number;
  activeUsers: number;
  totalRevenue: number;
  conversionRate: number;
}

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalProperties: 0,
    activeUsers: 0,
    totalRevenue: 0,
    conversionRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Simular datos del dashboard (integrar con APIs reales después)
        setDashboardData({
          totalProperties: 6, // De la API properties
          activeUsers: 3,
          totalRevenue: 125000,
          conversionRate: 12.5
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Cargando Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
          <p className="text-gray-600 mt-2">
            Gestión completa de la plataforma HabitatPro
          </p>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Métricas */}
        <MetricsCards data={dashboardData} />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gráficos */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Analytics
            </h2>
            <AnalyticsCharts />
          </div>

          {/* Gestión de Usuarios */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Gestión de Usuarios
            </h2>
            <UsersManagement />
          </div>
        </div>

        {/* Tabla de Propiedades */}
        <div className="mt-8">
          <PropertiesTable />
        </div>
      </div>
    </div>
  );
}
