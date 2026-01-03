'use client'

import { useState, useEffect } from 'react'
import { 
  Brain, 
  TrendingUp, 
  Calendar,
  Target,
  AlertCircle,
  CheckCircle,
  BarChart3,
  PieChart,
  RefreshCw,
  Download,
  Eye,
  Filter,
  Clock
} from 'lucide-react'

interface PropertyPrediction {
  property_id: string
  property_title: string
  current_price: number
  predicted_sale_price: number
  confidence_score: number
  sale_probability: number
  estimated_timeline: {
    min_days: number
    max_days: number
    most_likely_days: number
  }
  market_factors: {
    demand_level: 'high' | 'medium' | 'low'
    competition_level: 'high' | 'medium' | 'low'
    price_positioning: 'above' | 'at' | 'below'
    seasonal_factor: number
  }
  ml_insights: {
    key_factors: string[]
    recommendations: string[]
    risk_factors: string[]
    opportunities: string[]
  }
  historical_comparison: {
    similar_properties_sold: number
    avg_days_on_market: number
    avg_price_reduction: number
    success_rate: number
  }
}

interface MLModel {
  model_version: string
  accuracy_score: number
  last_trained: string
  features_used: string[]
  prediction_horizon: number
}

export function SalesPredictor() {
  const [predictions, setPredictions] = useState<PropertyPrediction[]>([])
  const [model, setModel] = useState<MLModel | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'predictions' | 'model' | 'insights' | 'comparisons'>('predictions')
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null)
  const [timeHorizon, setTimeHorizon] = useState<'30d' | '90d' | '180d' | '365d'>('90d')

  useEffect(() => {
    const fetchPredictionData = async () => {
      try {
        // Simular datos de predicción ML
        const mockPredictions: PropertyPrediction[] = [
          {
            property_id: 'prop_1',
            property_title: 'Apartamento Madrid Centro',
            current_price: 350000,
            predicted_sale_price: 365000,
            confidence_score: 87,
            sale_probability: 78,
            estimated_timeline: {
              min_days: 15,
              max_days: 45,
              most_likely_days: 28
            },
            market_factors: {
              demand_level: 'high',
              competition_level: 'medium',
              price_positioning: 'at',
              seasonal_factor: 1.15
            },
            ml_insights: {
              key_factors: [
                'Ubicación céntrica con alta demanda',
                'Precio competitivo vs mercado',
                'Características modernas atractivas',
                'Temporada alta de compraventa'
              ],
              recommendations: [
                'Mantener precio actual - bien posicionado',
                'Destacar características únicas en marketing',
                'Programar visitas en horarios pico',
                'Considerar staging profesional'
              ],
              risk_factors: [
                'Competencia con propiedades similares',
                'Posible saturación del mercado local'
              ],
              opportunities: [
                'Aumentar precio en 3-5% si hay múltiples ofertas',
                'Acelerar venta con incentivos menores'
              ]
            },
            historical_comparison: {
              similar_properties_sold: 12,
              avg_days_on_market: 32,
              avg_price_reduction: 2.1,
              success_rate: 85
            }
          },
          {
            property_id: 'prop_2',
            property_title: 'Casa Barcelona Norte',
            current_price: 450000,
            predicted_sale_price: 435000,
            confidence_score: 82,
            sale_probability: 65,
            estimated_timeline: {
              min_days: 30,
              max_days: 90,
              most_likely_days: 55
            },
            market_factors: {
              demand_level: 'medium',
              competition_level: 'high',
              price_positioning: 'above',
              seasonal_factor: 0.95
            },
            ml_insights: {
              key_factors: [
                'Precio ligeramente por encima del mercado',
                'Competencia intensa en la zona',
                'Demanda moderada para casas familiares',
                'Temporada baja para este tipo de propiedad'
              ],
              recommendations: [
                'Considerar reducción de precio del 3-5%',
                'Mejorar presentación y fotografía',
                'Destacar características familiares',
                'Aumentar visibilidad en canales digitales'
              ],
              risk_factors: [
                'Precio por encima del mercado local',
                'Temporada desfavorable',
                'Alta competencia'
              ],
              opportunities: [
                'Reducir precio para acelerar venta',
                'Enfocar en familias jóvenes',
                'Destacar proximidad a colegios'
              ]
            },
            historical_comparison: {
              similar_properties_sold: 8,
              avg_days_on_market: 67,
              avg_price_reduction: 4.2,
              success_rate: 72
            }
          },
          {
            property_id: 'prop_3',
            property_title: 'Loft Valencia Centro',
            current_price: 280000,
            predicted_sale_price: 295000,
            confidence_score: 91,
            sale_probability: 85,
            estimated_timeline: {
              min_days: 10,
              max_days: 30,
              most_likely_days: 18
            },
            market_factors: {
              demand_level: 'high',
              competition_level: 'low',
              price_positioning: 'below',
              seasonal_factor: 1.25
            },
            ml_insights: {
              key_factors: [
                'Precio muy competitivo vs mercado',
                'Alta demanda para lofts modernos',
                'Poca competencia directa',
                'Temporada óptima para este tipo'
              ],
              recommendations: [
                'Mantener precio - excelente posicionamiento',
                'Destacar diseño moderno y ubicación',
                'Aprovechar temporada alta',
                'Considerar subir precio si hay interés'
              ],
              risk_factors: [
                'Mercado puede saturarse rápidamente',
                'Cambios en preferencias de compradores'
              ],
              opportunities: [
                'Aumentar precio en 5-8%',
                'Venta rápida con múltiples ofertas',
                'Aprovechar momentum del mercado'
              ]
            },
            historical_comparison: {
              similar_properties_sold: 15,
              avg_days_on_market: 22,
              avg_price_reduction: 0.8,
              success_rate: 92
            }
          }
        ]

        const mockModel: MLModel = {
          model_version: 'v3.2.1',
          accuracy_score: 89.2,
          last_trained: '2024-01-20T10:00:00Z',
          features_used: [
            'price_per_sqm',
            'location_score',
            'property_features',
            'market_trends',
            'seasonal_factors',
            'competition_level',
            'days_on_market',
            'price_history'
          ],
          prediction_horizon: 90
        }

        setPredictions(mockPredictions)
        setModel(mockModel)
      } catch (error) {
        console.error('Error fetching prediction data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPredictionData()
  }, [timeHorizon])

  const getConfidenceColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-blue-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getProbabilityColor = (probability: number) => {
    if (probability >= 80) return 'bg-green-100 text-green-800'
    if (probability >= 60) return 'bg-blue-100 text-blue-800'
    if (probability >= 40) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const getDemandIcon = (level: string) => {
    switch (level) {
      case 'high': return <TrendingUp className="w-4 h-4 text-green-600" />
      case 'medium': return <BarChart3 className="w-4 h-4 text-blue-600" />
      case 'low': return <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />
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

  const formatDays = (days: number) => {
    if (days < 30) return `${days} días`
    if (days < 90) return `${Math.round(days / 30)} meses`
    return `${Math.round(days / 365)} años`
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
          <h2 className="text-2xl font-bold text-gray-900">Predicción de Ventas ML</h2>
          <p className="text-gray-600 mt-1">
            Machine Learning para predecir tiempos de venta y precios óptimos
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">Precisión del Modelo</p>
            <p className="text-lg font-bold text-purple-600">{model?.accuracy_score}%</p>
          </div>
          <select
            value={timeHorizon}
            onChange={(e) => setTimeHorizon(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="30d">30 días</option>
            <option value="90d">90 días</option>
            <option value="180d">180 días</option>
            <option value="365d">1 año</option>
          </select>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Model Stats */}
      {model && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <Brain className="w-8 h-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Modelo ML</p>
                <p className="text-2xl font-bold text-gray-900">{model.model_version}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <Target className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Precisión</p>
                <p className="text-2xl font-bold text-gray-900">{formatPercentage(model.accuracy_score)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Última Entrenamiento</p>
                <p className="text-sm font-bold text-gray-900">
                  {new Date(model.last_trained).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Características</p>
                <p className="text-2xl font-bold text-gray-900">{model.features_used.length}</p>
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
              onClick={() => setActiveTab('predictions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'predictions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Predicciones
            </button>
            <button
              onClick={() => setActiveTab('model')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'model'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Modelo ML
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
          {/* Predictions Tab */}
          {activeTab === 'predictions' && (
            <div className="space-y-6">
              {predictions.map((prediction) => (
                <div key={prediction.property_id} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{prediction.property_title}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getProbabilityColor(prediction.sale_probability)}`}>
                          {formatPercentage(prediction.sale_probability)} probabilidad
                        </span>
                        <span className={`font-bold ${getConfidenceColor(prediction.confidence_score)}`}>
                          {formatPercentage(prediction.confidence_score)} confianza
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <span className="text-sm text-gray-600">Precio Actual:</span>
                          <span className="ml-2 font-medium">{formatCurrency(prediction.current_price)}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Precio Predicho:</span>
                          <span className="ml-2 font-medium text-green-600">{formatCurrency(prediction.predicted_sale_price)}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Tiempo Estimado:</span>
                          <span className="ml-2 font-medium">{formatDays(prediction.estimated_timeline.most_likely_days)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Factores del Mercado</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Demanda:</span>
                          <div className="flex items-center space-x-2">
                            {getDemandIcon(prediction.market_factors.demand_level)}
                            <span className="text-sm font-medium capitalize">{prediction.market_factors.demand_level}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Competencia:</span>
                          <span className="text-sm font-medium capitalize">{prediction.market_factors.competition_level}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Posicionamiento:</span>
                          <span className="text-sm font-medium capitalize">{prediction.market_factors.price_positioning}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Factor Estacional:</span>
                          <span className="text-sm font-medium">{prediction.market_factors.seasonal_factor}x</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Timeline de Venta</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Mínimo:</span>
                          <span className="text-sm font-medium">{formatDays(prediction.estimated_timeline.min_days)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Más Probable:</span>
                          <span className="text-sm font-medium text-blue-600">{formatDays(prediction.estimated_timeline.most_likely_days)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Máximo:</span>
                          <span className="text-sm font-medium">{formatDays(prediction.estimated_timeline.max_days)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Recomendaciones ML</h4>
                    <ul className="space-y-1">
                      {prediction.ml_insights.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm text-blue-800 flex items-start space-x-2">
                          <CheckCircle className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Model Tab */}
          {activeTab === 'model' && model && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Modelo</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Especificaciones</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Versión:</span>
                        <span className="text-sm font-medium">{model.model_version}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Precisión:</span>
                        <span className="text-sm font-medium text-green-600">{formatPercentage(model.accuracy_score)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Horizonte Predicción:</span>
                        <span className="text-sm font-medium">{model.prediction_horizon} días</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Última Entrenamiento:</span>
                        <span className="text-sm font-medium">{new Date(model.last_trained).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Características Utilizadas</h4>
                    <div className="space-y-1">
                      {model.features_used.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Rendimiento del Modelo</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Precisión General</h4>
                    <p className="text-2xl font-bold text-green-600">{formatPercentage(model.accuracy_score)}</p>
                    <p className="text-xs text-gray-500">En predicciones de precio</p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Precisión Timeline</h4>
                    <p className="text-2xl font-bold text-blue-600">84.7%</p>
                    <p className="text-xs text-gray-500">En predicciones de tiempo</p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Precisión Probabilidad</h4>
                    <p className="text-2xl font-bold text-purple-600">91.3%</p>
                    <p className="text-xs text-gray-500">En probabilidad de venta</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Insights Tab */}
          {activeTab === 'insights' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {predictions.map((prediction) => (
                  <div key={prediction.property_id} className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{prediction.property_title}</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Factores Clave</h4>
                        <ul className="space-y-1">
                          {prediction.ml_insights.key_factors.map((factor, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span>{factor}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Oportunidades</h4>
                        <ul className="space-y-1">
                          {prediction.ml_insights.opportunities.map((opportunity, index) => (
                            <li key={index} className="text-sm text-green-600 flex items-start space-x-2">
                              <TrendingUp className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>{opportunity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Factores de Riesgo</h4>
                        <ul className="space-y-1">
                          {prediction.ml_insights.risk_factors.map((risk, index) => (
                            <li key={index} className="text-sm text-red-600 flex items-start space-x-2">
                              <AlertCircle className="w-3 h-3 text-red-600 mt-0.5 flex-shrink-0" />
                              <span>{risk}</span>
                            </li>
                          ))}
                        </ul>
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
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparación Histórica</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Propiedad</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-900">Probabilidad</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-900">Tiempo Estimado</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-900">Propiedades Similares</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-900">Tasa Éxito</th>
                      </tr>
                    </thead>
                    <tbody>
                      {predictions.map((prediction) => (
                        <tr key={prediction.property_id} className="border-b border-gray-100">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium text-gray-900">{prediction.property_title}</p>
                              <p className="text-sm text-gray-500">{formatCurrency(prediction.current_price)}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className={`font-medium ${getProbabilityColor(prediction.sale_probability)}`}>
                              {formatPercentage(prediction.sale_probability)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="font-medium">{formatDays(prediction.estimated_timeline.most_likely_days)}</span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="font-medium">{prediction.historical_comparison.similar_properties_sold}</span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="font-medium">{formatPercentage(prediction.historical_comparison.success_rate)}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Mejor Oportunidad</h3>
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-medium text-green-900 mb-2">🏆 Loft Valencia Centro</h4>
                    <p className="text-sm text-green-800">
                      Probabilidad del 85% con tiempo estimado de solo 18 días. 
                      Precio competitivo y alta demanda.
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Requiere Atención</h3>
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-900 mb-2">⚠️ Casa Barcelona Norte</h4>
                    <p className="text-sm text-yellow-800">
                      Probabilidad del 65% con tiempo estimado de 55 días. 
                      Considerar ajuste de precio.
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

