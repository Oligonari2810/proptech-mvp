'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import NextAuthRoleGuard from '../../components/auth/NextAuthRoleGuard';

interface BrokerMetrics {
  total_properties: number;
  active_properties: number;
  total_leads: number;
  conversion_rate: number;
  monthly_revenue: number;
  pending_tasks: number;
}

interface Property {
  id: number;
  title: string;
  price: number;
  status: string;
  views: number;
  leads: number;
}

export default function BrokerDashboard() {
  const { data: session } = useSession();
  const [metrics, setMetrics] = useState<BrokerMetrics | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://proptech-mvp-1.onrender.com';
      
      // Cargar métricas del broker
      const metricsRes = await fetch(`${backendUrl}/api/admin/metrics`);
      const metricsData = await metricsRes.json();
      
      // Cargar propiedades del broker
      const propsRes = await fetch(`${backendUrl}/api/properties`);
      const propsData = await propsRes.json();
      
      setMetrics({
        total_properties: metricsData.metrics?.properties || 0,
        active_properties: metricsData.metrics?.properties || 0,
        total_leads: metricsData.metrics?.leads || 0,
        conversion_rate: 12.5, // Mock - en producción calcular desde datos reales
        monthly_revenue: metricsData.metrics?.revenue || 0,
        pending_tasks: 5
      });
      
      setProperties((propsData.properties || []).slice(0, 5));
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <NextAuthRoleGuard allowedRoles={['broker', 'admin']}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Broker</h1>
            <p className="mt-2 text-gray-600">
              Bienvenido, {(session?.user as any)?.email || 'Broker'}
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando dashboard...</p>
            </div>
          ) : (
            <>
              {/* Métricas principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Propiedades Totales</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {metrics?.total_properties || 0}
                      </p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <span className="text-2xl">🏠</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {metrics?.active_properties || 0} activas
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Leads Totales</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {metrics?.total_leads || 0}
                      </p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <span className="text-2xl">📊</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Tasa de conversión: {metrics?.conversion_rate || 0}%
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Ingresos del Mes</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        ${(metrics?.monthly_revenue || 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 bg-yellow-100 rounded-full">
                      <span className="text-2xl">💰</span>
                    </div>
                  </div>
                  <p className="text-sm text-green-600 mt-2">
                    +12% vs mes anterior
                  </p>
                </div>
              </div>

              {/* Propiedades recientes */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Mis Propiedades</h2>
                </div>
                <div className="p-6">
                  {properties.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">No tienes propiedades publicadas</p>
                      <a
                        href="/redesign/vender"
                        className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                      >
                        Publicar primera propiedad
                      </a>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {properties.map((property) => (
                        <div
                          key={property.id}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{property.title}</h3>
                            <p className="text-sm text-gray-600">
                              ${property.price.toLocaleString()} • {property.views} vistas • {property.leads} leads
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 text-xs rounded-full ${
                              property.status === 'available' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {property.status}
                            </span>
                            <button className="text-indigo-600 hover:text-indigo-900 text-sm">
                              Ver →
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <a
                  href="/redesign/vender"
                  className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">➕ Publicar Propiedad</h3>
                  <p className="text-sm text-gray-600">Agregar una nueva propiedad al catálogo</p>
                </a>
                <a
                  href="/admin/users"
                  className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">👥 Ver Leads</h3>
                  <p className="text-sm text-gray-600">Gestionar contactos y leads</p>
                </a>
                <a
                  href="/admin/metricas"
                  className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">📊 Analíticas</h3>
                  <p className="text-sm text-gray-600">Ver métricas detalladas</p>
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </NextAuthRoleGuard>
  );
}

