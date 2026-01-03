'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Calendar,
  MapPin,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Download,
  Filter,
  Eye
} from 'lucide-react'

interface ROIMetrics {
  property_id: string
  property_title: string
  purchase_price: number
  current_value: number
  monthly_rent: number
  expenses: {
    mortgage: number
    maintenance: number
    taxes: number
    insurance: number
    management: number
  }
  roi_calculations: {
    annual_roi: number
    cash_flow_monthly: number
    cash_flow_annual: number
    cap_rate: number
    cash_on_cash: number
    total_return: number
  }
  market_data: {
    price_per_sqm: number
    market_trend: 'up' | 'down' | 'stable'
    days_on_market: number
    comparable_sales: number[]
    neighborhood_growth: number
  }
  projections: {
    year_1: { value: number; roi: number }
    year_3: { value: number; roi: number }
    year_5: { value: number; roi: number }
    year_10: { value: number; roi: number }
  }
}

interface PortfolioSummary {
  total_investment: number
  current_value: number
  total_roi: number
  monthly_cash_flow: number
  annual_cash_flow: number
  average_cap_rate: number
  properties_count: number
  best_performer: string
  worst_performer: string
}

export function ROIDashboard() {
  const [metrics, setMetrics] = useState<ROIMetrics[]>([])
  const [portfolio, setPortfolio] = useState<PortfolioSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'projections' | 'comparisons'>('overview')
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState<'1y' | '3y' | '5y' | '10y'>('5y')

  useEffect(() => {
    const fetchROIData = async () => {
      try {
        // Simular datos de ROI
        const mockMetrics: ROIMetrics[] = [
          {
            property_id: 'prop_1',
            property_title: 'Apartamento Madrid Centro',
            purchase_price: 350000,
            current_value: 385000,
            monthly_rent: 1200,
            expenses: {
              mortgage: 800,
              maintenance: 100,
              taxes: 150,
              insurance: 50,
              management: 120
            },
            roi_calculations: {
              annual_roi: 12.5,
              cash_flow_monthly: 80,
              cash_flow_annual: 960,
              cap_rate: 3.7,
              cash_on_cash: 8.2,
              total_return: 15.8
            },
            market_data: {
              price_per_sqm: 4529,
              market_trend: 'up',
              days_on_market: 45,
              comparable_sales: [380000, 390000, 375000],
              neighborhood_growth: 8.2
            },
            projections: {
              year_1: { value: 395000, roi: 14.2 },
              year_3: { value: 425000, roi: 18.7 },
              year_5: { value: 460000, roi: 24.1 },
              year_10: { value: 580000, roi: 45.2 }
            }
          },
          {
            property_id: 'prop_2',
            property_title: 'Casa Barcelona Norte',
            purchase_price: 450000,
            current_value: 480000,
            monthly_rent: 1500,
            expenses: {
              mortgage: 1000,
              maintenance: 150,
              taxes: 200,
              insurance: 75,
              management: 150
            },
            roi_calculations: {
              annual_roi: 10.8,
              cash_flow_monthly: 75,
              cash_flow_annual: 900,
              cap_rate: 3.1,
              cash_on_cash: 6.7,
              total_return: 13.2
            },
            market_data: {
              price_per_sqm: 4000,
              market_trend: 'stable',
              days_on_market: 62,
              comparable_sales: [475000, 485000, 470000],
              neighborhood_growth: 5.1
            },
            projections: {
              year_1: { value: 490000, roi: 12.1 },
              year_3: { value: 520000, roi: 16.8 },
              year_5: { value: 550000, roi: 21.4 },
              year_10: { value: 680000, roi: 38.9 }
            }
          },
          {
            property_id: 'prop_3',
            property_title: 'Loft Valencia Centro',
            purchase_price: 280000,
            current_value: 320000,
            monthly_rent: 900,
            expenses: {
              mortgage: 600,
              maintenance: 80,
              taxes: 120,
              insurance: 40,
              management: 90
            },
            roi_calculations: {
              annual_roi: 15.2,
              cash_flow_monthly: 70,
              cash_flow_annual: 840,
              cap_rate: 3.8,
              cash_on_cash: 9.1,
              total_return: 18.7
            },
            market_data: {
              price_per_sqm: 4923,
              market_trend: 'up',
              days_on_market: 38,
              comparable_sales: [315000, 325000, 310000],
              neighborhood_growth: 12.3
            },
            projections: {
              year_1: { value: 335000, roi: 17.1 },
              year_3: { value: 365000, roi: 22.8 },
              year_5: { value: 400000, roi: 29.4 },
              year_10: { value: 520000, roi: 52.1 }
            }
          }
        ]

        const mockPortfolio: PortfolioSummary = {
          total_investment: 1080000,
          current_value: 1185000,
          total_roi: 9.7,
          monthly_cash_flow: 225,
          annual_cash_flow: 2700,
          average_cap_rate: 3.5,
          properties_count: 3,
          best_performer: 'Loft Valencia Centro',
          worst_performer: 'Casa Barcelona Norte'
        }

        setMetrics(mockMetrics)
        setPortfolio(mockPortfolio)
      } catch (error) {
        console.error('Error fetching ROI data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchROIData()
  }, [])

  const getROIColor = (roi: number) => {
    if (roi >= 15) return 'text-green-600'
    if (roi >= 10) return 'text-blue-600'
    if (roi >= 5) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />
      case 'stable': return <BarChart3 className="w-4 h-4 text-blue-600" />
      default: return <BarChart3 className="w-4 h-4 text-gray-600" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard ROI Propiedades</h2>
          <p className="text-gray-600 mt-1">
            Análisis avanzado de retorno de inversión inmobiliaria
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="1y">1 Año</option>
            <option value="3y">3 Años</option>
            <option value="5y">5 Años</option>
            <option value="10y">10 Años</option>
          </select>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Portfolio Summary */}
      {portfolio && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Valor Total</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(portfolio.current_value)}</p>
                <p className="text-xs text-green-600">+{formatPercentage(portfolio.total_roi)} ROI</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Cash Flow Mensual</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(portfolio.monthly_cash_flow)}</p>
                <p className="text-xs text-blue-600">Anual: {formatCurrency(portfolio.annual_cash_flow)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <Target className="w-8 h-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Cap Rate Promedio</p>
                <p className="text-2xl font-bold text-gray-900">{formatPercentage(portfolio.average_cap_rate)}</p>
                <p className="text-xs text-purple-600">Rendimiento neto</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Propiedades</p>
                <p className="text-2xl font-bold text-gray-900">{portfolio.properties_count}</p>
                <p className="text-xs text-orange-600">En cartera</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Resumen
            </button>
            <button
              onClick={() => setActiveTab('properties')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'properties'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Propiedades
            </button>
            <button
              onClick={() => setActiveTab('projections')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'projections'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Proyecciones
            </button>
            <button
              onClick={() => setActiveTab('comparisons')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'comparisons'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Comparaciones
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Rendimiento por Propiedad</h3>
                  <div className="space-y-4">
                    {metrics.map((metric) => (
                      <div key={metric.property_id} className="bg-white rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{metric.property_title}</h4>
                          <span className={`font-bold ${getROIColor(metric.roi_calculations.annual_roi)}`}>
                            {formatPercentage(metric.roi_calculations.annual_roi)}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                          <div>Valor: {formatCurrency(metric.current_value)}</div>
                          <div>Cash Flow: {formatCurrency(metric.roi_calculations.cash_flow_monthly)}/mes</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendencias del Mercado</h3>
                  <div className="space-y-4">
                    {metrics.map((metric) => (
                      <div key={metric.property_id} className="bg-white rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{metric.property_title}</h4>
                          {getTrendIcon(metric.market_data.market_trend)}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                          <div>€/m²: {formatCurrency(metric.market_data.price_per_sqm)}</div>
                          <div>Crecimiento: {formatPercentage(metric.market_data.neighborhood_growth)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertas y Recomendaciones</h3>
                <div className="space-y-3">
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <h4 className="font-medium text-green-900">Excelente Rendimiento</h4>
                    </div>
                    <p className="text-sm text-green-800 mt-1">
                      El Loft Valencia Centro está generando un ROI del 15.2%, muy por encima del promedio del mercado.
                    </p>
                  </div>
                  
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                      <h4 className="font-medium text-yellow-900">Oportunidad de Mejora</h4>
                    </div>
                    <p className="text-sm text-yellow-800 mt-1">
                      La Casa Barcelona Norte podría beneficiarse de una revisión de gastos para mejorar el cash flow.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Properties Tab */}
          {activeTab === 'properties' && (
            <div className="space-y-6">
              {metrics.map((metric) => (
                <div key={metric.property_id} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{metric.property_title}</h3>
                      <p className="text-gray-600">Comprado: {formatCurrency(metric.purchase_price)} • Valor actual: {formatCurrency(metric.current_value)}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${getROIColor(metric.roi_calculations.annual_roi)}`}>
                        {formatPercentage(metric.roi_calculations.annual_roi)}
                      </p>
                      <p className="text-sm text-gray-500">ROI Anual</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Métricas Financieras</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Cash Flow Mensual:</span>
                          <span className="text-sm font-medium">{formatCurrency(metric.roi_calculations.cash_flow_monthly)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Cap Rate:</span>
                          <span className="text-sm font-medium">{formatPercentage(metric.roi_calculations.cap_rate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Cash on Cash:</span>
                          <span className="text-sm font-medium">{formatPercentage(metric.roi_calculations.cash_on_cash)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Retorno Total:</span>
                          <span className="text-sm font-medium">{formatPercentage(metric.roi_calculations.total_return)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Gastos Mensuales</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Hipoteca:</span>
                          <span className="text-sm font-medium">{formatCurrency(metric.expenses.mortgage)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Mantenimiento:</span>
                          <span className="text-sm font-medium">{formatCurrency(metric.expenses.maintenance)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Impuestos:</span>
                          <span className="text-sm font-medium">{formatCurrency(metric.expenses.taxes)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Seguro:</span>
                          <span className="text-sm font-medium">{formatCurrency(metric.expenses.insurance)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Gestión:</span>
                          <span className="text-sm font-medium">{formatCurrency(metric.expenses.management)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Datos del Mercado</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Precio/m²:</span>
                          <span className="text-sm font-medium">{formatCurrency(metric.market_data.price_per_sqm)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Días en mercado:</span>
                          <span className="text-sm font-medium">{metric.market_data.days_on_market}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Crecimiento zona:</span>
                          <span className="text-sm font-medium">{formatPercentage(metric.market_data.neighborhood_growth)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Renta mensual:</span>
                          <span className="text-sm font-medium">{formatCurrency(metric.monthly_rent)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Projections Tab */}
          {activeTab === 'projections' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {metrics.map((metric) => (
                  <div key={metric.property_id} className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{metric.property_title}</h3>
                    
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">Proyección de Valor</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">1 Año:</span>
                            <span className="text-sm font-medium">{formatCurrency(metric.projections.year_1.value)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">3 Años:</span>
                            <span className="text-sm font-medium">{formatCurrency(metric.projections.year_3.value)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">5 Años:</span>
                            <span className="text-sm font-medium">{formatCurrency(metric.projections.year_5.value)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">10 Años:</span>
                            <span className="text-sm font-medium">{formatCurrency(metric.projections.year_10.value)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">Proyección de ROI</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">1 Año:</span>
                            <span className="text-sm font-medium text-green-600">{formatPercentage(metric.projections.year_1.roi)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">3 Años:</span>
                            <span className="text-sm font-medium text-green-600">{formatPercentage(metric.projections.year_3.roi)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">5 Años:</span>
                            <span className="text-sm font-medium text-green-600">{formatPercentage(metric.projections.year_5.roi)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">10 Años:</span>
                            <span className="text-sm font-medium text-green-600">{formatPercentage(metric.projections.year_10.roi)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comparisons Tab */}
          {activeTab === 'comparisons' && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparación de Rendimiento</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Propiedad</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-900">ROI Anual</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-900">Cash Flow</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-900">Cap Rate</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-900">Valor Actual</th>
                      </tr>
                    </thead>
                    <tbody>
                      {metrics.map((metric) => (
                        <tr key={metric.property_id} className="border-b border-gray-100">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium text-gray-900">{metric.property_title}</p>
                              <p className="text-sm text-gray-500">{metric.market_data.price_per_sqm.toLocaleString()} €/m²</p>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className={`font-medium ${getROIColor(metric.roi_calculations.annual_roi)}`}>
                              {formatPercentage(metric.roi_calculations.annual_roi)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="font-medium">{formatCurrency(metric.roi_calculations.cash_flow_monthly)}</span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="font-medium">{formatPercentage(metric.roi_calculations.cap_rate)}</span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="font-medium">{formatCurrency(metric.current_value)}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Mejor Rendimiento</h3>
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-medium text-green-900 mb-2">🏆 Loft Valencia Centro</h4>
                    <p className="text-sm text-green-800">
                      ROI del 15.2% con excelente potencial de crecimiento. 
                      Ideal para inversores que buscan alto rendimiento.
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Oportunidad de Mejora</h3>
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-900 mb-2">📈 Casa Barcelona Norte</h4>
                    <p className="text-sm text-yellow-800">
                      ROI del 10.8% con potencial de mejora en gestión de gastos 
                      y optimización de renta.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
