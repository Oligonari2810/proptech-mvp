'use client'

import { useState, useEffect } from 'react'
import { 
  MapPin, 
  Users, 
  TrendingUp,
  Filter,
  Download,
  RefreshCw,
  Eye,
  BarChart3,
  PieChart,
  Calendar,
  Target,
  AlertCircle
} from 'lucide-react'

interface LeadHeatmapData {
  location: {
    name: string
    coordinates: [number, number]
    bounds: {
      north: number
      south: number
      east: number
      west: number
    }
  }
  metrics: {
    total_leads: number
    conversion_rate: number
    avg_response_time: number
    lead_quality_score: number
    monthly_trend: number
  }
  demographics: {
    age_groups: { [key: string]: number }
    income_levels: { [key: string]: number }
    property_preferences: { [key: string]: number }
  }
  time_analysis: {
    peak_hours: number[]
    peak_days: string[]
    seasonal_trends: { [key: string]: number }
  }
}

interface HeatmapFilters {
  time_period: '7d' | '30d' | '90d' | '1y'
  lead_source: 'all' | 'website' | 'social' | 'referral' | 'ads'
  property_type: 'all' | 'apartment' | 'house' | 'loft' | 'commercial'
  price_range: { min: number; max: number }
  lead_status: 'all' | 'new' | 'contacted' | 'qualified' | 'converted'
}

export function LeadHeatmapManager() {
  const [heatmapData, setHeatmapData] = useState<LeadHeatmapData[]>([])
  const [filters, setFilters] = useState<HeatmapFilters>({
    time_period: '30d',
    lead_source: 'all',
    property_type: 'all',
    price_range: { min: 0, max: 1000000 },
    lead_status: 'all'
  })
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState<'map' | 'analytics' | 'trends'>('map')
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)

  useEffect(() => {
    const fetchHeatmapData = async () => {
      try {
        // Simular datos del mapa de calor
        const mockHeatmapData: LeadHeatmapData[] = [
          {
            location: {
              name: 'Madrid Centro',
              coordinates: [-3.7038, 40.4168],
              bounds: {
                north: 40.4200,
                south: 40.4100,
                east: -3.7000,
                west: -3.7100
              }
            },
            metrics: {
              total_leads: 156,
              conversion_rate: 23.5,
              avg_response_time: 2.3,
              lead_quality_score: 8.2,
              monthly_trend: 12.3
            },
            demographics: {
              age_groups: {
                '25-35': 45,
                '35-45': 32,
                '45-55': 18,
                '55+': 5
              },
              income_levels: {
                'low': 15,
                'medium': 45,
                'high': 35,
                'very_high': 5
              },
              property_preferences: {
                'apartment': 65,
                'house': 25,
                'loft': 8,
                'commercial': 2
              }
            },
            time_analysis: {
              peak_hours: [10, 14, 18, 20],
              peak_days: ['Monday', 'Wednesday', 'Friday'],
              seasonal_trends: {
                'spring': 28,
                'summer': 35,
                'autumn': 22,
                'winter': 15
              }
            }
          },
          {
            location: {
              name: 'Barcelona Eixample',
              coordinates: [2.1734, 41.3851],
              bounds: {
                north: 41.3900,
                south: 41.3800,
                east: 2.1800,
                west: 2.1700
              }
            },
            metrics: {
              total_leads: 98,
              conversion_rate: 19.8,
              avg_response_time: 3.1,
              lead_quality_score: 7.8,
              monthly_trend: 8.7
            },
            demographics: {
              age_groups: {
                '25-35': 52,
                '35-45': 28,
                '45-55': 15,
                '55+': 5
              },
              income_levels: {
                'low': 12,
                'medium': 38,
                'high': 42,
                'very_high': 8
              },
              property_preferences: {
                'apartment': 72,
                'house': 18,
                'loft': 8,
                'commercial': 2
              }
            },
            time_analysis: {
              peak_hours: [9, 13, 17, 19],
              peak_days: ['Tuesday', 'Thursday', 'Saturday'],
              seasonal_trends: {
                'spring': 25,
                'summer': 40,
                'autumn': 20,
                'winter': 15
              }
            }
          },
          {
            location: {
              name: 'Valencia Centro',
              coordinates: [-0.3763, 39.4699],
              bounds: {
                north: 39.4750,
                south: 39.4650,
                east: -0.3700,
                west: -0.3800
              }
            },
            metrics: {
              total_leads: 67,
              conversion_rate: 26.8,
              avg_response_time: 1.8,
              lead_quality_score: 8.5,
              monthly_trend: 15.2
            },
            demographics: {
              age_groups: {
                '25-35': 38,
                '35-45': 35,
                '45-55': 22,
                '55+': 5
              },
              income_levels: {
                'low': 18,
                'medium': 52,
                'high': 25,
                'very_high': 5
              },
              property_preferences: {
                'apartment': 58,
                'house': 30,
                'loft': 10,
                'commercial': 2
              }
            },
            time_analysis: {
              peak_hours: [11, 15, 18, 21],
              peak_days: ['Monday', 'Wednesday', 'Friday'],
              seasonal_trends: {
                'spring': 30,
                'summer': 25,
                'autumn': 25,
                'winter': 20
              }
            }
          },
          {
            location: {
              name: 'Sevilla Centro',
              coordinates: [-5.9845, 37.3886],
              bounds: {
                north: 37.3950,
                south: 37.3850,
                east: -5.9800,
                west: -5.9900
              }
            },
            metrics: {
              total_leads: 43,
              conversion_rate: 21.2,
              avg_response_time: 2.7,
              lead_quality_score: 7.9,
              monthly_trend: 6.8
            },
            demographics: {
              age_groups: {
                '25-35': 42,
                '35-45': 30,
                '45-55': 20,
                '55+': 8
              },
              income_levels: {
                'low': 20,
                'medium': 48,
                'high': 28,
                'very_high': 4
              },
              property_preferences: {
                'apartment': 62,
                'house': 28,
                'loft': 7,
                'commercial': 3
              }
            },
            time_analysis: {
              peak_hours: [10, 14, 17, 20],
              peak_days: ['Tuesday', 'Thursday', 'Saturday'],
              seasonal_trends: {
                'spring': 35,
                'summer': 30,
                'autumn': 20,
                'winter': 15
              }
            }
          }
        ]

        setHeatmapData(mockHeatmapData)
      } catch (error) {
        console.error('Error fetching heatmap data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHeatmapData()
  }, [filters])

  const getHeatmapIntensity = (leads: number) => {
    if (leads >= 100) return 'bg-red-500'
    if (leads >= 75) return 'bg-orange-500'
    if (leads >= 50) return 'bg-yellow-500'
    if (leads >= 25) return 'bg-green-500'
    return 'bg-blue-500'
  }

  const getConversionColor = (rate: number) => {
    if (rate >= 25) return 'text-green-600'
    if (rate >= 20) return 'text-blue-600'
    if (rate >= 15) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="w-4 h-4 text-green-600" />
    if (trend < 0) return <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />
    return <BarChart3 className="w-4 h-4 text-gray-600" />
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-ES').format(num)
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
          <h2 className="text-2xl font-bold text-gray-900">Mapa de Calor Leads</h2>
          <p className="text-gray-600 mt-1">
            Análisis geospatial de densidad y conversión de leads
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </button>
          <button className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
            <RefreshCw className="w-4 h-4" />
            <span>Actualizar</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filtros:</span>
          </div>
          
          <select
            value={filters.time_period}
            onChange={(e) => setFilters({...filters, time_period: e.target.value as any})}
            className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
            <option value="90d">Últimos 90 días</option>
            <option value="1y">Último año</option>
          </select>
          
          <select
            value={filters.lead_source}
            onChange={(e) => setFilters({...filters, lead_source: e.target.value as any})}
            className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todas las fuentes</option>
            <option value="website">Website</option>
            <option value="social">Redes Sociales</option>
            <option value="referral">Referidos</option>
            <option value="ads">Publicidad</option>
          </select>
          
          <select
            value={filters.property_type}
            onChange={(e) => setFilters({...filters, property_type: e.target.value as any})}
            className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos los tipos</option>
            <option value="apartment">Apartamento</option>
            <option value="house">Casa</option>
            <option value="loft">Loft</option>
            <option value="commercial">Comercial</option>
          </select>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(heatmapData.reduce((sum, data) => sum + data.metrics.total_leads, 0))}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Target className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Conversión Promedio</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPercentage(
                  heatmapData.reduce((sum, data) => sum + data.metrics.conversion_rate, 0) / heatmapData.length
                )}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Tiempo Respuesta</p>
              <p className="text-2xl font-bold text-gray-900">
                {(heatmapData.reduce((sum, data) => sum + data.metrics.avg_response_time, 0) / heatmapData.length).toFixed(1)}h
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <BarChart3 className="w-8 h-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Crecimiento</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPercentage(
                  heatmapData.reduce((sum, data) => sum + data.metrics.monthly_trend, 0) / heatmapData.length
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveView('map')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeView === 'map'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Mapa de Calor
            </button>
            <button
              onClick={() => setActiveView('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeView === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Analytics Detallado
            </button>
            <button
              onClick={() => setActiveView('trends')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeView === 'trends'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Tendencias Temporales
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Map View */}
          {activeView === 'map' && (
            <div className="space-y-6">
              <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Mapa Interactivo</h3>
                  <p className="text-gray-600 mb-4">
                    Visualización geospatial de densidad de leads por ubicación
                  </p>
                  <div className="flex justify-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-red-500 rounded"></div>
                      <span className="text-sm text-gray-600">100+ leads</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-orange-500 rounded"></div>
                      <span className="text-sm text-gray-600">75-99 leads</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                      <span className="text-sm text-gray-600">50-74 leads</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span className="text-sm text-gray-600">25-49 leads</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                      <span className="text-sm text-gray-600">0-24 leads</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {heatmapData.map((data) => (
                  <div key={data.location.name} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{data.location.name}</h3>
                      <div className={`w-3 h-3 rounded-full ${getHeatmapIntensity(data.metrics.total_leads)}`}></div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Leads:</span>
                        <span className="font-medium">{formatNumber(data.metrics.total_leads)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Conversión:</span>
                        <span className={`font-medium ${getConversionColor(data.metrics.conversion_rate)}`}>
                          {formatPercentage(data.metrics.conversion_rate)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tendencia:</span>
                        <div className="flex items-center space-x-1">
                          {getTrendIcon(data.metrics.monthly_trend)}
                          <span className="font-medium">{formatPercentage(data.metrics.monthly_trend)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analytics View */}
          {activeView === 'analytics' && (
            <div className="space-y-6">
              {heatmapData.map((data) => (
                <div key={data.location.name} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">{data.location.name}</h3>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">Calidad:</span>
                      <span className="font-bold text-blue-600">{data.metrics.lead_quality_score}/10</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Métricas Principales</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Total Leads:</span>
                          <span className="text-sm font-medium">{formatNumber(data.metrics.total_leads)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Tasa Conversión:</span>
                          <span className={`text-sm font-medium ${getConversionColor(data.metrics.conversion_rate)}`}>
                            {formatPercentage(data.metrics.conversion_rate)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Tiempo Respuesta:</span>
                          <span className="text-sm font-medium">{data.metrics.avg_response_time}h</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Tendencia Mensual:</span>
                          <div className="flex items-center space-x-1">
                            {getTrendIcon(data.metrics.monthly_trend)}
                            <span className="text-sm font-medium">{formatPercentage(data.metrics.monthly_trend)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Demografía</h4>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-gray-600">Grupos de Edad:</span>
                          <div className="mt-1 space-y-1">
                            {Object.entries(data.demographics.age_groups).map(([age, count]) => (
                              <div key={age} className="flex justify-between text-xs">
                                <span>{age} años:</span>
                                <span>{count}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Preferencias</h4>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-gray-600">Tipos de Propiedad:</span>
                          <div className="mt-1 space-y-1">
                            {Object.entries(data.demographics.property_preferences).map(([type, count]) => (
                              <div key={type} className="flex justify-between text-xs">
                                <span className="capitalize">{type}:</span>
                                <span>{count}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Trends View */}
          {activeView === 'trends' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {heatmapData.map((data) => (
                  <div key={data.location.name} className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{data.location.name}</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Horas Pico</h4>
                        <div className="flex space-x-2">
                          {data.time_analysis.peak_hours.map((hour) => (
                            <span key={hour} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                              {hour}:00
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Días Pico</h4>
                        <div className="flex space-x-2">
                          {data.time_analysis.peak_days.map((day) => (
                            <span key={day} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                              {day}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Tendencias Estacionales</h4>
                        <div className="space-y-1">
                          {Object.entries(data.time_analysis.seasonal_trends).map(([season, percentage]) => (
                            <div key={season} className="flex justify-between text-sm">
                              <span className="capitalize text-gray-600">{season}:</span>
                              <span className="font-medium">{percentage}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Insights y Recomendaciones</h3>
                <div className="space-y-3">
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-5 h-5 text-green-600" />
                      <h4 className="font-medium text-green-900">Oportunidad Detectada</h4>
                    </div>
                    <p className="text-sm text-green-800 mt-1">
                      Valencia Centro muestra la mayor tasa de conversión (26.8%) y el menor tiempo de respuesta (1.8h). 
                      Considera aumentar la inversión en marketing para esta zona.
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      <h4 className="font-medium text-blue-900">Tendencia Positiva</h4>
                    </div>
                    <p className="text-sm text-blue-800 mt-1">
                      Madrid Centro y Valencia Centro muestran crecimiento mensual superior al 10%. 
                      Estas zonas requieren atención prioritaria para capitalizar el momentum.
                    </p>
                  </div>
                  
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Eye className="w-5 h-5 text-yellow-600" />
                      <h4 className="font-medium text-yellow-900">Área de Mejora</h4>
                    </div>
                    <p className="text-sm text-yellow-800 mt-1">
                      Sevilla Centro tiene el menor crecimiento mensual (6.8%). 
                      Revisa la estrategia de captación de leads para esta ubicación.
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
