'use client'

import { useState, useEffect } from 'react'

interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor: string
    borderColor: string
  }[]
}

export function AnalyticsCharts() {
  const [chartData, setChartData] = useState<ChartData | null>(null)

  useEffect(() => {
    // Simular datos enterprise
    setChartData({
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Propiedades Vendidas',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgba(59, 130, 246, 1)'
        },
        {
          label: 'Leads Generados',
          data: [25, 30, 15, 20, 18, 22],
          backgroundColor: 'rgba(16, 185, 129, 0.5)',
          borderColor: 'rgba(16, 185, 129, 1)'
        }
      ]
    })
  }, [])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Ventas */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ventas Mensuales</h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-gray-600">Gráfico de ventas</p>
            <p className="text-sm text-gray-500">Integración con Chart.js pendiente</p>
          </div>
        </div>
      </div>

      {/* Gráfico de Leads */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Leads por Fuente</h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
          <div className="text-center">
            <div className="text-4xl mb-2">📈</div>
            <p className="text-gray-600">Gráfico de leads</p>
            <p className="text-sm text-gray-500">Integración con Chart.js pendiente</p>
          </div>
        </div>
      </div>

      {/* Métricas Adicionales */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversión por Canal</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">WhatsApp</span>
            <div className="flex items-center">
              <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <span className="text-sm font-medium">75%</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Website</span>
            <div className="flex items-center">
              <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <span className="text-sm font-medium">60%</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Referidos</span>
            <div className="flex items-center">
              <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
              <span className="text-sm font-medium">45%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Propiedades */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Propiedades Más Vistas</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <div>
              <p className="font-medium">Casa en Santo Domingo</p>
              <p className="text-sm text-gray-600">Santo Domingo</p>
            </div>
            <span className="text-sm font-medium text-blue-600">1,247 vistas</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <div>
              <p className="font-medium">Apartamento Punta Cana</p>
              <p className="text-sm text-gray-600">Punta Cana</p>
            </div>
            <span className="text-sm font-medium text-blue-600">892 vistas</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <div>
              <p className="font-medium">Villa en Bávaro</p>
              <p className="text-sm text-gray-600">Bávaro</p>
            </div>
            <span className="text-sm font-medium text-blue-600">654 vistas</span>
          </div>
        </div>
      </div>
    </div>
  )
}