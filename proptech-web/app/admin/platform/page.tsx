'use client';

import React from 'react';

export default function PlatformAdminPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Plataforma</h1>
        <p className="text-gray-600 mb-8">Panel operativo para CTO/Administrador.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <a href="/admin/analytics" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-gray-900 mb-1">📊 Analítica del portal</h3>
            <p className="text-sm text-gray-600">Tráfico, rendimiento y conversión</p>
          </a>

          <a href="/admin/users" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-gray-900 mb-1">👥 Gestión de usuarios</h3>
            <p className="text-sm text-gray-600">Roles, acceso y actividad</p>
          </a>

          <a href="/admin/metricas" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-gray-900 mb-1">📈 Métricas operativas</h3>
            <p className="text-sm text-gray-600">KPIs clave del negocio</p>
          </a>

          <a href="/admin/crm" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-gray-900 mb-1">🏷️ CRM</h3>
            <p className="text-sm text-gray-600">Leads y automatización</p>
          </a>

          <a href="/admin/settings" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-gray-900 mb-1">⚙️ Configuración</h3>
            <p className="text-sm text-gray-600">Preferencias de la plataforma</p>
          </a>
        </div>
      </div>
    </div>
  );
}


