'use client'

import { useState } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Home, 
  DollarSign, 
  Clock, 
  Target,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  phone?: string
  license: string
  agency: string
}

interface Stats {
  totalProperties: number
  activeProperties: number
  totalLeads: number
  convertedLeads: number
  monthlyRevenue: number
  avgResponseTime: number
}

interface BrokerStatsProps {
  user: User
  stats: Stats
}

export function BrokerStats({ user, stats }: BrokerStatsProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month')

  const conversionRate = stats.totalLeads > 0 ? (stats.convertedLeads / stats.totalLeads) * 100 : 0
  const avgRevenuePerLead = stats.convertedLeads > 0 ? stats.monthlyRevenue / stats.convertedLeads : 0

  const performanceMetrics = [
    {
      title: 'Propiedades Totales',
      value: stats.totalProperties,
      change: '+12%',
      changeType: 'positive' as const,
      icon: Home,
      color: 'blue'
    },
    {
      title: 'Propiedades Activas',
      value: stats.activeProperties,
      change: '+8%',
      changeType: 'positive' as const,
      icon: Activity,
      color: 'green'
    },
    {
      title: 'Total Leads',
      value: stats.totalLeads,
      change: '+23%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'purple'
    },
    {
      title: 'Leads Convertidos',
      value: stats.convertedLeads,
      change: '+15%',
      changeType: 'positive' as const,
      icon: Target,
      color: 'orange'
    },
    {
      title: 'Tasa de Conversión',
      value: `${conversionRate.toFixed(1)}%`,
      change: '+2.3%',
      changeType: 'positive' as const,
      icon: BarChart3,
      color: 'indigo'
    },
    {
      title: 'Ingresos Mensuales',
      value: `${stats.monthlyRevenue.toLocaleString()}€`,
      change: '+18%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'emerald'
    },
    {
      title: 'Tiempo Respuesta Promedio',
      value: `${stats.avgResponseTime}h`,
      change: '-0.5h',
      changeType: 'positive' as const,
      icon: Clock,
      color: 'red'
    },
    {
      title: 'Ingreso por Lead',
      value: `${avgRevenuePerLead.toLocaleString()}€`,
      change: '+5%',
      changeType: 'positive' as const,
      icon: PieChart,
      color: 'yellow'
    }
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      purple: 'bg-purple-50 text-purple-600',
      orange: 'bg-orange-50 text-orange-600',
      indigo: 'bg-indigo-50 text-indigo-600',
      emerald: 'bg-emerald-50 text-emerald-600',
      red: 'bg-red-50 text-red-600',
      yellow: 'bg-yellow-50 text-yellow-600'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Estadísticas de Rendimiento</h2>
          <p className="text-gray-600 mt-1">
            Métricas clave de tu actividad como broker
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">Esta Semana</option>
            <option value="month">Este Mes</option>
            <option value="quarter">Este Trimestre</option>
          </select>
        </div>
      </div>

      {/* Performance Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric, index) => {
          const IconComponent = metric.icon
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${getColorClasses(metric.color)}`}>
                  <IconComponent className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                {metric.changeType === 'positive' ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`ml-2 text-sm font-medium ${
                  metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.change}
                </span>
                <span className="ml-2 text-sm text-gray-500">vs mes anterior</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ingresos por Mes</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Gráfico de ingresos</p>
              <p className="text-sm text-gray-400">(Integrar con librería de gráficos)</p>
            </div>
          </div>
        </div>

        {/* Leads Conversion Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversión de Leads</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Gráfico de conversión</p>
              <p className="text-sm text-gray-400">(Integrar con librería de gráficos)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Broker Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Broker</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Datos Personales</h4>
            <div className="space-y-2">
              <p><span className="font-medium">Nombre:</span> {user.name}</p>
              <p><span className="font-medium">Email:</span> {user.email}</p>
              <p><span className="font-medium">Teléfono:</span> {user.phone}</p>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Información Profesional</h4>
            <div className="space-y-2">
              <p><span className="font-medium">Licencia:</span> {user.license}</p>
              <p><span className="font-medium">Agencia:</span> {user.agency}</p>
              <p><span className="font-medium">Estado:</span> <span className="text-green-600">Activo</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
