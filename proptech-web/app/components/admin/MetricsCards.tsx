'use client'

import { useState, useEffect } from 'react'

interface Metric {
  title: string
  value: string | number
  change: string
  trend: 'up' | 'down' | 'neutral'
  icon: string
}

export function MetricsCards() {
  const [metrics, setMetrics] = useState<Metric[]>([])

  useEffect(() => {
    // Simular datos enterprise
    setMetrics([
      {
        title: 'Propiedades Activas',
        value: '1,247',
        change: '+12%',
        trend: 'up',
        icon: '🏠'
      },
      {
        title: 'Leads Generados',
        value: '3,456',
        change: '+8%',
        trend: 'up',
        icon: '📞'
      },
      {
        title: 'Conversión',
        value: '4.2%',
        change: '+0.3%',
        trend: 'up',
        icon: '📈'
      },
      {
        title: 'Ingresos Mensuales',
        value: '$45,678',
        change: '+15%',
        trend: 'up',
        icon: '💰'
      }
    ])
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{metric.title}</p>
              <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
            </div>
            <div className="text-2xl">{metric.icon}</div>
          </div>
          <div className="mt-4 flex items-center">
            <span className={`text-sm font-medium ${
              metric.trend === 'up' ? 'text-green-600' : 
              metric.trend === 'down' ? 'text-red-600' : 
              'text-gray-600'
            }`}>
              {metric.change}
            </span>
            <span className="text-sm text-gray-500 ml-2">vs mes anterior</span>
          </div>
        </div>
      ))}
    </div>
  )
}