'use client'

import { useState, useEffect } from 'react'
import { 
  Sparkles, 
  TrendingUp, 
  MapPin, 
  Star,
  Heart,
  Eye,
  Filter,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Download
} from 'lucide-react'

interface UserProfile {
  id: string
  preferences: {
    price_range: { min: number; max: number }
    property_types: string[]
    locations: string[]
    bedrooms: number[]
    bathrooms: number[]
    amenities: string[]
  }
  behavior_history: {
    viewed_properties: string[]
    favorited_properties: string[]
    searched_locations: string[]
    clicked_features: string[]
  }
  demographics: {
    age_range: string
    income_level: string
    family_status: string
    lifestyle: string
  }
}

interface PropertyRecommendation {
  id: string
  property: {
    id: string
    title: string
    price: number
    type: string
    location: string
    bedrooms: number
    bathrooms: number
    area: number
    images: string[]
    features: string[]
    amenities: string[]
  }
  match_score: number
  match_reasons: string[]
  ai_insights: {
    why_recommended: string
    market_trends: string
    investment_potential: string
    lifestyle_fit: string
  }
  alternatives: {
    similar_properties: string[]
    price_comparisons: any[]
    location_alternatives: string[]
  }
}

interface SmartMatchEngine {
  recommendations: PropertyRecommendation[]
  user_profile: UserProfile
  algorithm_version: string
  last_updated: string
  confidence_score: number
}

export function SmartMatchEngine() {
  const [engine, setEngine] = useState<SmartMatchEngine | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'recommendations' | 'profile' | 'insights' | 'settings'>('recommendations')
  const [selectedRecommendation, setSelectedRecommendation] = useState<PropertyRecommendation | null>(null)
  const [feedback, setFeedback] = useState<{ [key: string]: 'like' | 'dislike' | null }>({})

  useEffect(() => {
    const fetchSmartMatchData = async () => {
      try {
        // Simular datos del SmartMatch Engine
        const mockEngine: SmartMatchEngine = {
          recommendations: [
            {
              id: '1',
              property: {
                id: 'prop_1',
                title: 'Apartamento moderno en Madrid Centro',
                price: 350000,
                type: 'apartment',
                location: 'Madrid Centro',
                bedrooms: 2,
                bathrooms: 1,
                area: 85,
                images: ['/images/property1.jpg'],
                features: ['Balcón', 'Ascensor', 'Calefacción central'],
                amenities: ['Metro cercano', 'Supermercado', 'Parque']
              },
              match_score: 94,
              match_reasons: [
                'Ubicación preferida: Madrid Centro',
                'Precio dentro del rango: €350K',
                'Tipo de propiedad: Apartamento',
                'Características deseadas: Balcón, Ascensor'
              ],
              ai_insights: {
                why_recommended: 'Perfecto match basado en tu historial de búsquedas en Madrid Centro y preferencia por apartamentos modernos con balcón.',
                market_trends: 'Los apartamentos en Madrid Centro han aumentado 8% en valor en los últimos 6 meses.',
                investment_potential: 'ROI estimado del 12% anual basado en tendencias del mercado.',
                lifestyle_fit: 'Ideal para profesionales jóvenes que valoran la conectividad y el estilo de vida urbano.'
              },
              alternatives: {
                similar_properties: ['prop_2', 'prop_3'],
                price_comparisons: [
                  { location: 'Madrid Norte', avg_price: 320000, difference: -8.6 },
                  { location: 'Madrid Sur', avg_price: 280000, difference: -20 }
                ],
                location_alternatives: ['Madrid Norte', 'Madrid Este', 'Chamberí']
              }
            },
            {
              id: '2',
              property: {
                id: 'prop_2',
                title: 'Casa con jardín en las afueras',
                price: 450000,
                type: 'house',
                location: 'Madrid Norte',
                bedrooms: 3,
                bathrooms: 2,
                area: 120,
                images: ['/images/property2.jpg'],
                features: ['Jardín privado', 'Garaje', 'Terraza'],
                amenities: ['Colegio cercano', 'Centro comercial', 'Zona verde']
              },
              match_score: 87,
              match_reasons: [
                'Ubicación alternativa: Madrid Norte',
                'Precio competitivo: €450K',
                'Características familiares: Jardín, Garaje',
                'Amenidades deseadas: Colegio cercano'
              ],
              ai_insights: {
                why_recommended: 'Excelente opción familiar con jardín privado, ideal para tu perfil de familia joven.',
                market_trends: 'Las casas con jardín en Madrid Norte mantienen estabilidad de precios.',
                investment_potential: 'ROI estimado del 9% anual con potencial de crecimiento.',
                lifestyle_fit: 'Perfecto para familias que buscan espacio y tranquilidad sin alejarse del centro.'
              },
              alternatives: {
                similar_properties: ['prop_4', 'prop_5'],
                price_comparisons: [
                  { location: 'Madrid Centro', avg_price: 350000, difference: -22.2 },
                  { location: 'Madrid Sur', avg_price: 380000, difference: -15.6 }
                ],
                location_alternatives: ['Madrid Centro', 'Madrid Este', 'Alcobendas']
              }
            },
            {
              id: '3',
              property: {
                id: 'prop_3',
                title: 'Loft industrial renovado',
                price: 280000,
                type: 'loft',
                location: 'Barcelona Poblenou',
                bedrooms: 1,
                bathrooms: 1,
                area: 65,
                images: ['/images/property3.jpg'],
                features: ['Techos altos', 'Diseño moderno', 'Zona abierta'],
                amenities: ['Metro', 'Playas cercanas', 'Zona tech']
              },
              match_score: 82,
              match_reasons: [
                'Tipo alternativo: Loft',
                'Precio atractivo: €280K',
                'Estilo moderno preferido',
                'Ubicación tech-friendly'
              ],
              ai_insights: {
                why_recommended: 'Opción innovadora que combina estilo moderno con ubicación estratégica en zona tech.',
                market_trends: 'Los lofts en Poblenou han crecido 15% en valor debido a la gentrificación.',
                investment_potential: 'ROI estimado del 18% anual por tendencia de la zona.',
                lifestyle_fit: 'Ideal para profesionales creativos y tech que valoran el diseño y la innovación.'
              },
              alternatives: {
                similar_properties: ['prop_6', 'prop_7'],
                price_comparisons: [
                  { location: 'Barcelona Centro', avg_price: 320000, difference: 14.3 },
                  { location: 'Barcelona Gràcia', avg_price: 300000, difference: 7.1 }
                ],
                location_alternatives: ['Barcelona Centro', 'Gràcia', 'Eixample']
              }
            }
          ],
          user_profile: {
            id: 'user_1',
            preferences: {
              price_range: { min: 250000, max: 500000 },
              property_types: ['apartment', 'house'],
              locations: ['Madrid Centro', 'Madrid Norte'],
              bedrooms: [2, 3],
              bathrooms: [1, 2],
              amenities: ['Metro cercano', 'Supermercado', 'Parque']
            },
            behavior_history: {
              viewed_properties: ['prop_1', 'prop_2', 'prop_3'],
              favorited_properties: ['prop_1'],
              searched_locations: ['Madrid Centro', 'Madrid Norte'],
              clicked_features: ['Balcón', 'Ascensor', 'Jardín']
            },
            demographics: {
              age_range: '25-35',
              income_level: 'medium-high',
              family_status: 'young_family',
              lifestyle: 'urban_professional'
            }
          },
          algorithm_version: 'v2.1.0',
          last_updated: '2024-01-20T15:30:00Z',
          confidence_score: 89
        }

        setEngine(mockEngine)
      } catch (error) {
        console.error('Error fetching SmartMatch data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSmartMatchData()
  }, [])

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800'
    if (score >= 80) return 'bg-blue-100 text-blue-800'
    if (score >= 70) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const getMatchScoreText = (score: number) => {
    if (score >= 90) return 'Excelente Match'
    if (score >= 80) return 'Buen Match'
    if (score >= 70) return 'Match Regular'
    return 'Match Bajo'
  }

  const handleFeedback = (recommendationId: string, type: 'like' | 'dislike') => {
    setFeedback(prev => ({
      ...prev,
      [recommendationId]: prev[recommendationId] === type ? null : type
    }))
  }

  const refreshRecommendations = async () => {
    setLoading(true)
    try {
      // Simular actualización de recomendaciones
      await new Promise(resolve => setTimeout(resolve, 2000))
      // Aquí se haría la llamada real a la API
    } catch (error) {
      console.error('Error refreshing recommendations:', error)
    } finally {
      setLoading(false)
    }
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
          <h2 className="text-2xl font-bold text-gray-900">SmartMatch Engine</h2>
          <p className="text-gray-600 mt-1">
            Recomendaciones personalizadas con inteligencia artificial
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">Confianza IA</p>
            <p className="text-lg font-bold text-purple-600">{engine?.confidence_score}%</p>
          </div>
          <button
            onClick={refreshRecommendations}
            disabled={loading}
            className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Sparkles className="w-8 h-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Recomendaciones</p>
              <p className="text-2xl font-bold text-gray-900">{engine?.recommendations.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Match Promedio</p>
              <p className="text-2xl font-bold text-gray-900">
                {engine ? Math.round(engine.recommendations.reduce((sum, r) => sum + r.match_score, 0) / engine.recommendations.length) : 0}%
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Eye className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Propiedades Vistas</p>
              <p className="text-2xl font-bold text-gray-900">{engine?.user_profile.behavior_history.viewed_properties.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Heart className="w-8 h-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Favoritos</p>
              <p className="text-2xl font-bold text-gray-900">{engine?.user_profile.behavior_history.favorited_properties.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('recommendations')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'recommendations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Recomendaciones
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Mi Perfil IA
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
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Configuración
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Recommendations Tab */}
          {activeTab === 'recommendations' && (
            <div className="space-y-6">
              {engine?.recommendations.map((recommendation) => (
                <div key={recommendation.id} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{recommendation.property.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMatchScoreColor(recommendation.match_score)}`}>
                          {recommendation.match_score}% - {getMatchScoreText(recommendation.match_score)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{recommendation.property.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-gray-900">{recommendation.property.price.toLocaleString()}€</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-600">{recommendation.property.bedrooms} hab • {recommendation.property.bathrooms} baños • {recommendation.property.area}m²</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">¿Por qué te recomendamos esta propiedad?</h4>
                        <ul className="space-y-1">
                          {recommendation.match_reasons.map((reason, index) => (
                            <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                              <Star className="w-3 h-3 text-yellow-500" />
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-4 mb-4">
                        <h4 className="font-medium text-blue-900 mb-2">Insights de IA</h4>
                        <p className="text-sm text-blue-800">{recommendation.ai_insights.why_recommended}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2 ml-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleFeedback(recommendation.id, 'like')}
                          className={`p-2 rounded-full ${
                            feedback[recommendation.id] === 'like' 
                              ? 'bg-green-100 text-green-600' 
                              : 'text-gray-400 hover:text-green-600'
                          }`}
                          title="Me gusta"
                        >
                          <ThumbsUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleFeedback(recommendation.id, 'dislike')}
                          className={`p-2 rounded-full ${
                            feedback[recommendation.id] === 'dislike' 
                              ? 'bg-red-100 text-red-600' 
                              : 'text-gray-400 hover:text-red-600'
                          }`}
                          title="No me gusta"
                        >
                          <ThumbsDown className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded" title="Compartir">
                          <Share2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-green-600 hover:bg-green-50 rounded" title="Ver detalles">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Tendencias del Mercado</h4>
                      <p className="text-sm text-gray-600">{recommendation.ai_insights.market_trends}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Potencial de Inversión</h4>
                      <p className="text-sm text-gray-600">{recommendation.ai_insights.investment_potential}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && engine && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Perfil de Usuario Analizado por IA</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Preferencias Detectadas</h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Rango de Precio:</span>
                        <span className="ml-2 text-sm text-gray-600">
                          {engine.user_profile.preferences.price_range.min.toLocaleString()}€ - {engine.user_profile.preferences.price_range.max.toLocaleString()}€
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Tipos Preferidos:</span>
                        <span className="ml-2 text-sm text-gray-600">
                          {engine.user_profile.preferences.property_types.join(', ')}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Ubicaciones:</span>
                        <span className="ml-2 text-sm text-gray-600">
                          {engine.user_profile.preferences.locations.join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Comportamiento Analizado</h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Propiedades Vistas:</span>
                        <span className="ml-2 text-sm text-gray-600">{engine.user_profile.behavior_history.viewed_properties.length}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Favoritos:</span>
                        <span className="ml-2 text-sm text-gray-600">{engine.user_profile.behavior_history.favorited_properties.length}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Características Populares:</span>
                        <span className="ml-2 text-sm text-gray-600">
                          {engine.user_profile.behavior_history.clicked_features.join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Perfil Demográfico</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Rango de Edad:</span>
                    <span className="ml-2 text-sm text-gray-600">{engine.user_profile.demographics.age_range}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Nivel de Ingresos:</span>
                    <span className="ml-2 text-sm text-gray-600">{engine.user_profile.demographics.income_level}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Estado Familiar:</span>
                    <span className="ml-2 text-sm text-gray-600">{engine.user_profile.demographics.family_status}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Estilo de Vida:</span>
                    <span className="ml-2 text-sm text-gray-600">{engine.user_profile.demographics.lifestyle}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Insights Tab */}
          {activeTab === 'insights' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendencias de Mercado</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Apartamentos Madrid Centro</span>
                      <span className="text-sm font-medium text-green-600">+8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Casas Madrid Norte</span>
                      <span className="text-sm font-medium text-blue-600">+3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Lofts Barcelona</span>
                      <span className="text-sm font-medium text-green-600">+15%</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Oportunidades de Inversión</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">ROI Promedio Apartamentos</span>
                      <span className="text-sm font-medium text-green-600">12%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">ROI Promedio Casas</span>
                      <span className="text-sm font-medium text-blue-600">9%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">ROI Promedio Lofts</span>
                      <span className="text-sm font-medium text-purple-600">18%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recomendaciones Personalizadas</h3>
                <div className="space-y-3">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">💡 Sugerencia de Búsqueda</h4>
                    <p className="text-sm text-blue-800">
                      Basado en tu perfil, te recomendamos explorar apartamentos en Chamberí con balcón. 
                      Esta zona combina tu preferencia por ubicaciones céntricas con características que valoras.
                    </p>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-medium text-green-900 mb-2">📈 Oportunidad de Mercado</h4>
                    <p className="text-sm text-green-800">
                      Los lofts en Barcelona están experimentando un crecimiento del 15%. 
                      Considera esta opción si buscas una inversión con alto potencial de retorno.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración del Algoritmo</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sensibilidad de Precio (0-100)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      defaultValue="80"
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Flexible</span>
                      <span>Estricto</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Peso de Ubicación (0-100)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      defaultValue="90"
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Bajo</span>
                      <span>Alto</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frecuencia de Actualización
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="daily">Diaria</option>
                      <option value="weekly">Semanal</option>
                      <option value="monthly">Mensual</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    Cancelar
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors">
                    Guardar Configuración
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Sistema</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Versión del Algoritmo:</span>
                    <span className="ml-2 text-sm text-gray-600">{engine?.algorithm_version}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Última Actualización:</span>
                    <span className="ml-2 text-sm text-gray-600">
                      {engine ? new Date(engine.last_updated).toLocaleString() : ''}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Nivel de Confianza:</span>
                    <span className="ml-2 text-sm text-gray-600">{engine?.confidence_score}%</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Propiedades Analizadas:</span>
                    <span className="ml-2 text-sm text-gray-600">1,247</span>
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
