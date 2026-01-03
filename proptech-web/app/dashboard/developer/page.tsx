'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import NextAuthRoleGuard from '../../components/auth/NextAuthRoleGuard';

interface Project {
  id: number;
  name: string;
  location: string;
  status: string;
  units_total: number;
  units_sold: number;
  progress_percentage: number;
  total_value: number;
}

interface DeveloperMetrics {
  total_projects: number;
  active_projects: number;
  total_units: number;
  units_sold: number;
  total_revenue: number;
}

export default function DeveloperDashboard() {
  const { data: session } = useSession();
  const [metrics, setMetrics] = useState<DeveloperMetrics | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://proptech-mvp-1.onrender.com';
      
      // En producción, esto debería ser /api/developer/projects
      // Por ahora simulamos datos
      const mockProjects: Project[] = [
        {
          id: 1,
          name: 'Residencial Las Palmas',
          location: 'Santo Domingo Este',
          status: 'En construcción',
          units_total: 120,
          units_sold: 45,
          progress_percentage: 38,
          total_value: 36000000
        },
        {
          id: 2,
          name: 'Torres del Caribe',
          location: 'Punta Cana',
          status: 'Pre-venta',
          units_total: 200,
          units_sold: 67,
          progress_percentage: 33,
          total_value: 80000000
        }
      ];

      setMetrics({
        total_projects: mockProjects.length,
        active_projects: mockProjects.filter(p => p.status !== 'Completado').length,
        total_units: mockProjects.reduce((sum, p) => sum + p.units_total, 0),
        units_sold: mockProjects.reduce((sum, p) => sum + p.units_sold, 0),
        total_revenue: mockProjects.reduce((sum, p) => sum + (p.total_value * (p.units_sold / p.units_total)), 0)
      });

      setProjects(mockProjects);
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <NextAuthRoleGuard allowedRoles={['developer', 'admin']}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Desarrollador</h1>
            <p className="mt-2 text-gray-600">
              Gestiona tus proyectos inmobiliarios
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando proyectos...</p>
            </div>
          ) : (
            <>
              {/* Métricas principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Proyectos Totales</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {metrics?.total_projects || 0}
                      </p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <span className="text-2xl">🏗️</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {metrics?.active_projects || 0} activos
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Unidades Totales</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {metrics?.total_units || 0}
                      </p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <span className="text-2xl">🏢</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {metrics?.units_sold || 0} vendidas
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Tasa de Venta</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {metrics && metrics.total_units > 0
                          ? Math.round((metrics.units_sold / metrics.total_units) * 100)
                          : 0}%
                      </p>
                    </div>
                    <div className="p-3 bg-yellow-100 rounded-full">
                      <span className="text-2xl">📈</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Ingresos Totales</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        ${((metrics?.total_revenue || 0) / 1000000).toFixed(1)}M
                      </p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-full">
                      <span className="text-2xl">💰</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Proyectos */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Mis Proyectos</h2>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                    + Nuevo Proyecto
                  </button>
                </div>
                <div className="p-6">
                  {projects.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">No tienes proyectos registrados</p>
                      <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                        Crear primer proyecto
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {projects.map((project) => (
                        <div
                          key={project.id}
                          className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                              <p className="text-sm text-gray-600">{project.location}</p>
                            </div>
                            <span className={`px-3 py-1 text-xs rounded-full ${
                              project.status === 'En construcción' 
                                ? 'bg-blue-100 text-blue-800'
                                : project.status === 'Pre-venta'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {project.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-600">Unidades Totales</p>
                              <p className="text-lg font-semibold">{project.units_total}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Unidades Vendidas</p>
                              <p className="text-lg font-semibold text-green-600">{project.units_sold}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Progreso</p>
                              <p className="text-lg font-semibold">{project.progress_percentage}%</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Valor Total</p>
                              <p className="text-lg font-semibold">${(project.total_value / 1000000).toFixed(1)}M</p>
                            </div>
                          </div>

                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-indigo-600 h-2 rounded-full"
                              style={{ width: `${project.progress_percentage}%` }}
                            ></div>
                          </div>

                          <div className="mt-4 flex gap-2">
                            <button className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                              Ver Detalles
                            </button>
                            <button className="px-4 py-2 text-sm bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200">
                              Gestionar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </NextAuthRoleGuard>
  );
}

