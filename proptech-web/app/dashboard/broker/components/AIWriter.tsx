'use client'

import { useState, useEffect } from 'react'
import { 
  Wand2, 
  FileText, 
  Sparkles,
  Copy,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Save,
  Download,
  Eye
} from 'lucide-react'

interface AIWritingRequest {
  property_type: string
  location: string
  price: number
  bedrooms?: number
  bathrooms?: number
  area?: number
  features: string[]
  amenities: string[]
  style?: 'professional' | 'emotional' | 'casual' | 'luxury'
}

interface AIWritingResponse {
  title: string
  description: string
  tags: string[]
  seo_keywords: string[]
  emotional_appeal: string[]
  confidence_score: number
}

interface WritingTemplate {
  id: string
  name: string
  type: 'description' | 'title' | 'tags' | 'marketing'
  prompt: string
  variables: string[]
  is_active: boolean
}

export function AIWriter() {
  const [request, setRequest] = useState<AIWritingRequest>({
    property_type: 'apartment',
    location: '',
    price: 0,
    bedrooms: 0,
    bathrooms: 0,
    area: 0,
    features: [],
    amenities: [],
    style: 'professional'
  })
  
  const [response, setResponse] = useState<AIWritingResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [templates, setTemplates] = useState<WritingTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [generationHistory, setGenerationHistory] = useState<Array<{request: AIWritingRequest, response: AIWritingResponse}>>([])

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const mockTemplates: WritingTemplate[] = [
          {
            id: '1',
            name: 'Descripción Profesional',
            type: 'description',
            prompt: 'Escribe una descripción profesional y detallada para una propiedad inmobiliaria, destacando las características técnicas y beneficios.',
            variables: ['property_type', 'location', 'price', 'bedrooms', 'bathrooms', 'area', 'features'],
            is_active: true
          },
          {
            id: '2',
            name: 'Título Atractivo',
            type: 'title',
            prompt: 'Crea un título llamativo y SEO-optimizado para una propiedad inmobiliaria que capture la atención.',
            variables: ['property_type', 'location', 'price', 'bedrooms'],
            is_active: true
          },
          {
            id: '3',
            name: 'Descripción Emocional',
            type: 'description',
            prompt: 'Escribe una descripción que conecte emocionalmente con compradores potenciales, creando una imagen de hogar ideal.',
            variables: ['property_type', 'location', 'features', 'amenities'],
            is_active: true
          },
          {
            id: '4',
            name: 'Tags y Keywords',
            type: 'tags',
            prompt: 'Genera tags relevantes y palabras clave SEO para optimizar la visibilidad de la propiedad.',
            variables: ['property_type', 'location', 'features', 'amenities'],
            is_active: true
          }
        ]
        setTemplates(mockTemplates)
      } catch (error) {
        console.error('Error fetching templates:', error)
      }
    }

    fetchTemplates()
  }, [])

  const generateContent = async () => {
    setLoading(true)
    try {
      // Simular llamada a API de IA
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const mockResponse: AIWritingResponse = {
        title: `${request.property_type === 'apartment' ? 'Apartamento' : 'Casa'} moderno en ${request.location}`,
        description: `Descubre este ${request.property_type === 'apartment' ? 'apartamento' : 'casa'} excepcional ubicado en el corazón de ${request.location}. 

Con ${request.bedrooms} dormitorios y ${request.bathrooms} baños, esta propiedad ofrece ${request.area}m² de espacio perfectamente distribuido. 

Características destacadas:
${request.features.map(feature => `• ${feature}`).join('\n')}

Amenidades incluidas:
${request.amenities.map(amenity => `• ${amenity}`).join('\n')}

Una oportunidad única para aquellos que buscan calidad, comodidad y ubicación privilegiada. ¡No dejes pasar esta oportunidad!`,
        tags: [
          request.property_type === 'apartment' ? 'apartamento' : 'casa',
          request.location.toLowerCase(),
          `${request.bedrooms} habitaciones`,
          `${request.area}m²`,
          'moderno',
          'centro',
          'oportunidad'
        ],
        seo_keywords: [
          `${request.property_type} ${request.location}`,
          `comprar ${request.property_type} ${request.location}`,
          `${request.property_type} ${request.bedrooms} habitaciones`,
          `inmueble ${request.location}`,
          'propiedad en venta'
        ],
        emotional_appeal: [
          'Hogar ideal para familias',
          'Inversión con gran potencial',
          'Ubicación privilegiada',
          'Calidad y comodidad garantizadas'
        ],
        confidence_score: 92
      }
      
      setResponse(mockResponse)
      setGenerationHistory(prev => [...prev, { request, response: mockResponse }])
    } catch (error) {
      console.error('Error generating content:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const saveToHistory = () => {
    if (response) {
      setGenerationHistory(prev => [...prev, { request, response }])
    }
  }

  const loadFromHistory = (historyItem: {request: AIWritingRequest, response: AIWritingResponse}) => {
    setRequest(historyItem.request)
    setResponse(historyItem.response)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">IA Redactora</h2>
          <p className="text-gray-600 mt-1">
            Genera descripciones profesionales con inteligencia artificial
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Sparkles className="w-6 h-6 text-purple-600" />
          <span className="text-sm text-gray-600">Powered by AI</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de la Propiedad</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Propiedad</label>
                <select
                  value={request.property_type}
                  onChange={(e) => setRequest({...request, property_type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="apartment">Apartamento</option>
                  <option value="house">Casa</option>
                  <option value="loft">Loft</option>
                  <option value="penthouse">Ático</option>
                  <option value="studio">Estudio</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                <input
                  type="text"
                  value={request.location}
                  onChange={(e) => setRequest({...request, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Madrid Centro"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio (€)</label>
                <input
                  type="number"
                  value={request.price}
                  onChange={(e) => setRequest({...request, price: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="350000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dormitorios</label>
                <input
                  type="number"
                  value={request.bedrooms}
                  onChange={(e) => setRequest({...request, bedrooms: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Baños</label>
                <input
                  type="number"
                  value={request.bathrooms}
                  onChange={(e) => setRequest({...request, bathrooms: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Área (m²)</label>
              <input
                type="number"
                value={request.area}
                onChange={(e) => setRequest({...request, area: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="85"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Características</label>
              <input
                type="text"
                value={request.features.join(', ')}
                onChange={(e) => setRequest({...request, features: e.target.value.split(', ').filter(f => f.trim())})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Balcón, Ascensor, Calefacción central"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amenidades</label>
              <input
                type="text"
                value={request.amenities.join(', ')}
                onChange={(e) => setRequest({...request, amenities: e.target.value.split(', ').filter(a => a.trim())})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Gimnasio, Piscina, Parking"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estilo de Escritura</label>
              <select
                value={request.style}
                onChange={(e) => setRequest({...request, style: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="professional">Profesional</option>
                <option value="emotional">Emocional</option>
                <option value="casual">Casual</option>
                <option value="luxury">Lujo</option>
              </select>
            </div>

            <button
              onClick={generateContent}
              disabled={loading || !request.location || !request.price}
              className="w-full flex items-center justify-center space-x-2 bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Wand2 className="w-4 h-4" />
              )}
              <span>{loading ? 'Generando...' : 'Generar Contenido'}</span>
            </button>
          </div>
        </div>

        {/* Output */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Contenido Generado</h3>
            {response && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Confianza:</span>
                <span className="text-sm font-medium text-green-600">{response.confidence_score}%</span>
              </div>
            )}
          </div>

          {response ? (
            <div className="space-y-4">
              {/* Title */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Título</label>
                  <button
                    onClick={() => copyToClipboard(response.title)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                    title="Copiar"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-900 font-medium">{response.title}</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Descripción</label>
                  <button
                    onClick={() => copyToClipboard(response.description)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                    title="Copiar"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-900 whitespace-pre-line">{response.description}</p>
                </div>
              </div>

              {/* Tags */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Tags</label>
                  <button
                    onClick={() => copyToClipboard(response.tags.join(', '))}
                    className="p-1 text-gray-400 hover:text-gray-600"
                    title="Copiar"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {response.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* SEO Keywords */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Keywords SEO</label>
                  <button
                    onClick={() => copyToClipboard(response.seo_keywords.join(', '))}
                    className="p-1 text-gray-400 hover:text-gray-600"
                    title="Copiar"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {response.seo_keywords.map((keyword, index) => (
                    <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={saveToHistory}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar</span>
                </button>
                <button
                  onClick={generateContent}
                  className="flex items-center space-x-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Regenerar</span>
                </button>
                <div className="flex items-center space-x-2 ml-auto">
                  <button className="p-2 text-green-600 hover:bg-green-50 rounded" title="Me gusta">
                    <ThumbsUp className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded" title="No me gusta">
                    <ThumbsDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Wand2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Genera tu primer contenido</h3>
              <p className="text-gray-600">
                Completa la información de la propiedad y haz clic en "Generar Contenido"
              </p>
            </div>
          )}
        </div>
      </div>

      {/* History */}
      {generationHistory.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Historial de Generaciones</h3>
          <div className="space-y-3">
            {generationHistory.slice(-5).reverse().map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{item.response.title}</p>
                    <p className="text-sm text-gray-600">
                      {item.request.property_type} en {item.request.location} - {item.request.price.toLocaleString()}€
                    </p>
                  </div>
                  <button
                    onClick={() => loadFromHistory(item)}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    Cargar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

