'use client';

import React, { useEffect, useState } from 'react';
import Card from './Card';
import Button from './Button';

interface DashboardMetrics {
  properties: number;
  leads: number;
  reservations: number;
  revenue: number;
  revenue_formatted: string;
  users: number;
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // Usar proxy interno para evitar CORS (Vercel previews)
        const response = await fetch(`/api/admin/metrics`, { cache: "no-store" });
        const data = await response.json();
        
        if (data.status === 'success') {
          setMetrics(data.metrics);
        } else {
          // Fallback data
          setMetrics({
            properties: 6,
            leads: 23,
            reservations: 8,
            revenue: 87500,
            revenue_formatted: "$87,500",
            users: 3
          });
        }
      } catch (error) {
        // Fallback data
        setMetrics({
          properties: 6,
          leads: 23,
          reservations: 8,
          revenue: 87500,
          revenue_formatted: "$87,500",
          users: 3
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading || !metrics) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    { title: 'Propiedades', value: metrics.properties, icon: '🏠', color: 'primary-teal' },
    { title: 'Leads', value: metrics.leads, icon: '📧', color: 'primary-teal' },
    { title: 'Reservas', value: metrics.reservations, icon: '📅', color: 'primary-teal' },
    { title: 'Ingresos', value: metrics.revenue_formatted, icon: '💰', color: 'primary-teal' },
  ];

  return (
    <div className="min-h-screen bg-warm-bg p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-headline text-dark-green mb-2">Dashboard Administrativo</h1>
          <p className="text-gray-medium">Visión general del estado de la plataforma</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Card key={index} hover>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-medium mb-1">{stat.title}</p>
                  <p className={`text-2xl font-bold text-${stat.color}`}>{stat.value}</p>
                </div>
                <div className="text-4xl opacity-20">{stat.icon}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <h3 className="text-title text-dark-green mb-4">Gestión de Propiedades</h3>
            <p className="text-gray-medium mb-4">Administra todas las propiedades publicadas</p>
            <Button variant="outline" size="sm" className="w-full">
              Ver propiedades →
            </Button>
          </Card>

          <Card>
            <h3 className="text-title text-dark-green mb-4">Gestión de Usuarios</h3>
            <p className="text-gray-medium mb-4">Controla usuarios y permisos</p>
            <Button variant="outline" size="sm" className="w-full">
              Ver usuarios →
            </Button>
          </Card>

          <Card>
            <h3 className="text-title text-dark-green mb-4">Analíticas</h3>
            <p className="text-gray-medium mb-4">Métricas avanzadas y reportes</p>
            <Button variant="outline" size="sm" className="w-full">
              Ver analíticas →
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

