'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  PieChart,
  Target,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Download,
  Eye,
  Filter,
  Clock,
  DollarSign,
  MapPin,
  Users
} from 'lucide-react'

interface CompetitorData {
  competitor_name: string
  competitor_type: 'direct' | 'indirect' | 'marketplace'
  market_share: number
  properties_listed: number
  avg_price: number
  avg_days_on_market: number
  conversion_rate: number
  pricing_strategy: 'premium' | 'competitive' | 'budget'
  strengths: string[]
  weaknesses: string[]
  market_position: 'leader' | 'challenger' | 'follower' | 'niche'
}

interface MarketBenchmark {
  metric: string
  our_performance: number
  market_average: number
  top_performer: number
  benchmark_score: number
  trend: 'up' | 'down' | 'stable'
  recommendation: string
}

interface CompetitiveAnalysis {
  competitors: CompetitorData[]
  benchmarks: MarketBenchmark[]
  market_insights: {
    total_market_size: number
    growth_rate: number
    key_trends: string[]
    opportunities: string[]
    threats: string[]
  }
  our_position: {
    market_share: number
    ranking: number
    competitive_advantages: string[]
    areas_for_improvement: string[]
  }
}

export function CompetitiveBenchmarking() {
  const [analysis, setAnalysis] = useState<CompetitiveAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'competitors' | 'benchmarks' | 'insights'>('overview')
  const [selectedCompetitor, setSelectedCompetitor] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState<'30d' | '90d' | '1y'>('90d')

  useEffect(() => {
    const fetchCompetitiveData = async () => {
      try {
        // Simular datos de análisis competitivo
        const mockAnalysis: CompetitiveAnalysis = {
          competitors: [
            {
              competitor_name: 'Idealista',
              competitor_type: 'marketplace',
              market_share: 35.2,
              properties_listed: 1250000,
              avg_price: 285000,
              avg_days_on_market: 45,
              conversion_rate: 18.5,
              pricing_strategy: 'competitive',
              strengths: [
                'Mayor volumen de propiedades',
                'Brand recognition alta',
                'Cobertura nacional completa',
                'App móvil avanzada'
              ],
              weaknesses: [
                'Calidad de leads variable',
                'Comisión alta para brokers',
                'Soporte limitado',
                'Filtros básicos'
              ],
              market_position: 'leader'
            },
            {
              competitor_name: 'Fotocasa',
              competitor_type: 'marketplace',
              market_share: 22.8,
              properties_listed: 850000,
              avg_price: 320000,
              avg_days_on_market: 52,
              conversion_rate: 15.2,
              pricing_strategy: 'premium',
              strengths: [
                'Calidad de fotos superior',
                'Interfaz moderna',
                'Herramientas de broker avanzadas',
                'Marketing digital fuerte'
              ],
              weaknesses: [
                'Precios más altos',
                'Menor volumen que Idealista',
                'Cobertura limitada en algunas zonas',
                'Comisión premium'
              ],
              market_position: 'challenger'
            },
            {
              competitor_name: 'Habitaclia',
              competitor_type: 'marketplace',
              market_share: 12.4,
              properties_listed: 450000,
              avg_price: 265000,
              avg_days_on_market: 38,
              conversion_rate: 22.1,
              pricing_strategy: 'budget',
              strengths: [
                'Comisiones más bajas',
                'Conversión alta',
                'Enfoque en calidad de leads',
                'Soporte personalizado'
              ],
              weaknesses: [
                'Menor volumen de tráfico',
                'Brand recognition limitada',
                'Cobertura geográfica reducida',
                'Herramientas básicas'
              ],
              market_position: 'follower'
            },
            {
              competitor_name: 'Inmobiliaria Local Premium',
              competitor_type: 'direct',
              market_share: 8.7,
              properties_listed: 120000,
              avg_price: 450000,
              avg_days_on_market: 28,
              conversion_rate: 28.5,
              pricing_strategy: 'premium',
              strengths: [
                'Servicio personalizado',
                'Propiedades exclusivas',
                'Alta conversión',
                'Relaciones locales fuertes'
              ],
              weaknesses: [
                'Volumen limitado',
                'Cobertura geográfica restringida',
                'Precios altos',
                'Tecnología limitada'
              ],
              market_position: 'niche'
            }
          ],
          benchmarks: [
            {
              metric: 'Tiempo en Mercado',
              our_performance: 35,
              market_average: 46,
              top_performer: 28,
              benchmark_score: 85,
              trend: 'up',
              recommendation: 'Excelente performance. Mantener estrategia actual.'
            },
            {
              metric: 'Tasa de Conversión',
              our_performance: 24.2,
              market_average: 19.1,
              top_performer: 28.5,
              benchmark_score: 78,
              trend: 'up',
              recommendation: 'Por encima del promedio. Enfocar en mejorar calidad de leads.'
            },
            {
              metric: 'Precio Promedio',
              our_performance: 315000,
              market_average: 305000,
              top_performer: 450000,
              benchmark_score: 65,
              trend: 'stable',
              recommendation: 'Precio competitivo. Considerar segmentación por valor.'
            },
            {
              metric: 'Satisfacción Cliente',
              our_performance: 4.6,
              market_average: 4.2,
              top_performer: 4.8,
              benchmark_score: 88,
              trend: 'up',
              recommendation: 'Excelente satisfacción. Usar como diferenciador clave.'
            },
            {
              metric: 'Tecnología/Innovación',
              our_performance: 8.5,
              market_average: 6.8,
              top_performer: 9.2,
              benchmark_score: 82,
              trend: 'up',
              recommendation: 'Liderazgo tecnológico. Acelerar desarrollo de IA.'
            }
          ],
          market_insights: {
            total_market_size: 2500000,
            growth_rate: 8.5,
            key_trends: [
              'Digitalización acelerada post-COVID',
              'Demanda creciente de herramientas IA',
              'Importancia de experiencia móvil',
              'Personalización como diferenciador clave'
            ],
            opportunities: [
              'Mercado de propiedades premium en crecimiento',
              'Demanda insatisfecha de herramientas avanzadas',
              'Oportunidad en segmento de inversión',
              'Expansión a mercados secundarios'
            ],
            threats: [
              'Consolidación del mercado',
              'Entrada de grandes tech companies',
              'Cambios regulatorios',
              'Recesión económica potencial'
            ]
          },
          our_position: {
            market_share: 15.3,
            ranking: 3,
            competitive_advantages: [
              'Tecnología IA avanzada',
              'Alta satisfacción del cliente',
              'Tiempo de venta superior',
              'Herramientas de broker innovadoras'
            ],
            areas_for_improvement: [
              'Aumentar volumen de propiedades',
              'Mejorar reconocimiento de marca',
              'Expandir cobertura geográfica',
              'Desarrollar más herramientas premium'
            ]
          }
        }

        setAnalysis(mockAnalysis)
      } catch (error) {
        console.error('Error fetching competitive data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCompetitiveData()
  }, [timeRange])

  const getBenchmarkColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-blue-600'
    if (score >= 40) return 'text-yellow-600'
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

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'leader': return 'bg-blue-100 text-blue-800'
      case 'challenger': return 'bg-green-100 text-green-800'
      case 'follower': return 'bg-yellow-100 text-yellow-800'
      case 'niche': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStrategyColor = (strategy: string) => {
    switch (strategy) {
      case 'premium': return 'bg-purple-100 text-purple-800'
      case 'competitive': return 'bg-blue-100 text-blue-800'
      case 'budget': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
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

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
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
          <h2 className="text-2xl font-bold text-gray-900">Benchmarking Competitivo</h2>
          <p className="text-gray-600 mt-1">
            Análisis en tiempo real del mercado y competencia
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="30d">30 días</option>
            <option value="90d">90 días</option>
            <option value="1y">1 año</option>
          </select>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Our Position Summary */}
      {analysis && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <Target className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Nuestra Posición</p>
                <p className="text-2xl font-bold text-gray-900">#{analysis.our_position.ranking}</p>
                <p className="text-xs text-blue-600">En el mercado</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <PieChart className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Cuota de Mercado</p>
                <p className="text-2xl font-bold text-gray-900">{formatPercentage(analysis.our_position.market_share)}</p>
                <p className="text-xs text-green-600">+2.1% vs año anterior</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Crecimiento Mercado</p>
                <p className="text-2xl font-bold text-gray-900">{formatPercentage(analysis.market_insights.growth_rate)}</p>
                <p className="text-xs text-purple-600">Anual</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Tamaño Mercado</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(analysis.market_insights.total_market_size)}</p>
                <p className="text-xs text-orange-600">Propiedades</p>
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
              onClick={() => setActiveTab('competitors')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'competitors'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Competidores
            </button>
            <button
              onClick={() => setActiveTab('benchmarks')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'benchmarks'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Benchmarks
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'insights'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Insights
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && analysis && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Nuestras Ventajas Competitivas</h3>
                  <div className="space-y-3">
                    {analysis.our_position.competitive_advantages.map((advantage, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm text-gray-700">{advantage}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Áreas de Mejora</h3>
                  <div className="space-y-3">
                    {analysis.our_position.areas_for_improvement.map((area, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                        <span className="text-sm text-gray-700">{area}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendencias del Mercado</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Tendencias Clave</h4>
                    <ul className="space-y-2">
                      {analysis.market_insights.key_trends.map((trend, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                          <TrendingUp className="w-3 h-3 text-blue-600 mt-1 flex-shrink-0" />
                          <span>{trend}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Oportunidades</h4>
                    <ul className="space-y-2">
                      {analysis.market_insights.opportunities.map((opportunity, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                          <Target className="w-3 h-3 text-green-600 mt-1 flex-shrink-0" />
                          <span>{opportunity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Competitors Tab */}
          {activeTab === 'competitors' && analysis && (
            <div className="space-y-6">
              {analysis.competitors.map((competitor) => (
                <div key={competitor.competitor_name} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{competitor.competitor_name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPositionColor(competitor.market_position)}`}>
                          {competitor.market_position}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStrategyColor(competitor.pricing_strategy)}`}>
                          {competitor.pricing_strategy}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <span className="text-sm text-gray-600">Cuota de Mercado:</span>
                          <span className="ml-2 font-medium">{formatPercentage(competitor.market_share)}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Propiedades:</span>
                          <span className="ml-2 font-medium">{formatNumber(competitor.properties_listed)}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Precio Promedio:</span>
                          <span className="ml-2 font-medium">{formatCurrency(competitor.avg_price)}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Conversión:</span>
                          <span className="ml-2 font-medium">{formatPercentage(competitor.conversion_rate)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Fortalezas</h4>
                      <ul className="space-y-1">
                        {competitor.strengths.map((strength, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                            <CheckCircle className="w-3 h-3 text-green-600 mt-1 flex-shrink-0" />
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Debilidades</h4>
                      <ul className="space-y-1">
                        {competitor.weaknesses.map((weakness, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                            <AlertCircle className="w-3 h-3 text-red-600 mt-1 flex-shrink-0" />
                            <span>{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Benchmarks Tab */}
          {activeTab === 'benchmarks' && analysis && (
            <div className="space-y-6">
              {analysis.benchmarks.map((benchmark, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{benchmark.metric}</h3>
                        <span className={`font-bold ${getBenchmarkColor(benchmark.benchmark_score)}`}>
                          {benchmark.benchmark_score}/100
                        </span>
                        {getTrendIcon(benchmark.trend)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <span className="text-sm text-gray-600">Nuestro Performance:</span>
                          <span className="ml-2 font-medium">
                            {benchmark.metric === 'Precio Promedio' ? formatCurrency(benchmark.our_performance) : 
                             benchmark.metric === 'Satisfacción Cliente' || benchmark.metric === 'Tecnología/Innovación' ? 
                             benchmark.our_performance.toFixed(1) : formatPercentage(benchmark.our_performance)}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Promedio Mercado:</span>
                          <span className="ml-2 font-medium">
                            {benchmark.metric === 'Precio Promedio' ? formatCurrency(benchmark.market_average) : 
                             benchmark.metric === 'Satisfacción Cliente' || benchmark.metric === 'Tecnología/Innovación' ? 
                             benchmark.market_average.toFixed(1) : formatPercentage(benchmark.market_average)}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Top Performer:</span>
                          <span className="ml-2 font-medium">
                            {benchmark.metric === 'Precio Promedio' ? formatCurrency(benchmark.top_performer) : 
                             benchmark.metric === 'Satisfacción Cliente' || benchmark.metric === 'Tecnología/Innovación' ? 
                             benchmark.top_performer.toFixed(1) : formatPercentage(benchmark.top_performer)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Recomendación</h4>
                    <p className="text-sm text-blue-800">{benchmark.recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Insights Tab */}
          {activeTab === 'insights' && analysis && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Oportunidades de Mercado</h3>
                  <div className="space-y-3">
                    {analysis.market_insights.opportunities.map((opportunity, index) => (
                      <div key={index} className="bg-green-50 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <Target className="w-4 h-4 text-green-600" />
                          <h4 className="font-medium text-green-900">Oportunidad #{index + 1}</h4>
                        </div>
                        <p className="text-sm text-green-800 mt-1">{opportunity}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Amenazas del Mercado</h3>
                  <div className="space-y-3">
                    {analysis.market_insights.threats.map((threat, index) => (
                      <div key={index} className="bg-red-50 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <AlertCircle className="w-4 h-4 text-red-600" />
                          <h4 className="font-medium text-red-900">Amenaza #{index + 1}</h4>
                        </div>
                        <p className="text-sm text-red-800 mt-1">{threat}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Estrategia Competitiva Recomendada</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Acciones Inmediatas</h4>
                    <ul className="space-y-2">
                      <li className="text-sm text-gray-600 flex items-start space-x-2">
                        <CheckCircle className="w-3 h-3 text-green-600 mt-1 flex-shrink-0" />
                        <span>Aprovechar ventaja tecnológica para diferenciación</span>
                      </li>
                      <li className="text-sm text-gray-600 flex items-start space-x-2">
                        <CheckCircle className="w-3 h-3 text-green-600 mt-1 flex-shrink-0" />
                        <span>Mejorar reconocimiento de marca con marketing dirigido</span>
                      </li>
                      <li className="text-sm text-gray-600 flex items-start space-x-2">
                        <CheckCircle className="w-3 h-3 text-green-600 mt-1 flex-shrink-0" />
                        <span>Expandir volumen de propiedades en mercados clave</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Estrategia a Largo Plazo</h4>
                    <ul className="space-y-2">
                      <li className="text-sm text-gray-600 flex items-start space-x-2">
                        <Target className="w-3 h-3 text-blue-600 mt-1 flex-shrink-0" />
                        <span>Desarrollar herramientas premium para brokers</span>
                      </li>
                      <li className="text-sm text-gray-600 flex items-start space-x-2">
                        <Target className="w-3 h-3 text-blue-600 mt-1 flex-shrink-0" />
                        <span>Expandir a mercados secundarios con menor competencia</span>
                      </li>
                      <li className="text-sm text-gray-600 flex items-start space-x-2">
                        <Target className="w-3 h-3 text-blue-600 mt-1 flex-shrink-0" />
                        <span>Crear ecosistema completo de servicios inmobiliarios</span>
                      </li>
                    </ul>
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

