'use client'

import { useState, useEffect } from 'react'
import { 
  Image, 
  Tag, 
  Upload,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Download,
  Eye,
  Trash2,
  Plus
} from 'lucide-react'

interface ImageTag {
  id: string
  image_url: string
  filename: string
  tags: {
    category: 'interior' | 'exterior' | 'amenity' | 'room'
    confidence: number
    description: string
  }[]
  ai_analysis: {
    room_type?: string
    style?: string
    condition?: string
    lighting?: string
    colors?: string[]
  }
  processed_at: string
}

interface TaggingBatch {
  id: string
  name: string
  images_count: number
  processed_count: number
  status: 'pending' | 'processing' | 'completed' | 'error'
  created_at: string
}

export function AutoTaggingManager() {
  const [images, setImages] = useState<ImageTag[]>([])
  const [batches, setBatches] = useState<TaggingBatch[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'images' | 'batches' | 'upload'>('images')

  useEffect(() => {
    const fetchTaggingData = async () => {
      try {
        // Simular datos de imágenes etiquetadas
        const mockImages: ImageTag[] = [
          {
            id: '1',
            image_url: '/images/property1.jpg',
            filename: 'living_room_1.jpg',
            tags: [
              { category: 'interior', confidence: 95, description: 'Sala de estar moderna' },
              { category: 'room', confidence: 92, description: 'Sala de estar' },
              { category: 'interior', confidence: 88, description: 'Decoración contemporánea' }
            ],
            ai_analysis: {
              room_type: 'living_room',
              style: 'modern',
              condition: 'excellent',
              lighting: 'natural',
              colors: ['beige', 'white', 'gray']
            },
            processed_at: '2024-01-20T10:30:00Z'
          },
          {
            id: '2',
            image_url: '/images/property2.jpg',
            filename: 'kitchen_1.jpg',
            tags: [
              { category: 'interior', confidence: 97, description: 'Cocina completamente equipada' },
              { category: 'room', confidence: 94, description: 'Cocina' },
              { category: 'amenity', confidence: 91, description: 'Electrodomésticos modernos' }
            ],
            ai_analysis: {
              room_type: 'kitchen',
              style: 'modern',
              condition: 'excellent',
              lighting: 'artificial',
              colors: ['white', 'gray', 'stainless_steel']
            },
            processed_at: '2024-01-20T10:32:00Z'
          },
          {
            id: '3',
            image_url: '/images/property3.jpg',
            filename: 'exterior_1.jpg',
            tags: [
              { category: 'exterior', confidence: 96, description: 'Fachada moderna' },
              { category: 'exterior', confidence: 89, description: 'Arquitectura contemporánea' },
              { category: 'amenity', confidence: 85, description: 'Balcón privado' }
            ],
            ai_analysis: {
              room_type: 'exterior',
              style: 'modern',
              condition: 'good',
              lighting: 'natural',
              colors: ['white', 'gray', 'glass']
            },
            processed_at: '2024-01-20T10:35:00Z'
          }
        ]

        // Simular lotes de procesamiento
        const mockBatches: TaggingBatch[] = [
          {
            id: '1',
            name: 'Propiedad Madrid Centro',
            images_count: 15,
            processed_count: 15,
            status: 'completed',
            created_at: '2024-01-20T10:00:00Z'
          },
          {
            id: '2',
            name: 'Casa Barcelona Norte',
            images_count: 12,
            processed_count: 8,
            status: 'processing',
            created_at: '2024-01-20T11:00:00Z'
          },
          {
            id: '3',
            name: 'Loft Valencia',
            images_count: 8,
            processed_count: 0,
            status: 'pending',
            created_at: '2024-01-20T12:00:00Z'
          }
        ]

        setImages(mockImages)
        setBatches(mockBatches)
      } catch (error) {
        console.error('Error fetching tagging data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTaggingData()
  }, [])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'interior': return <Image className="w-4 h-4" />
      case 'exterior': return <Image className="w-4 h-4" />
      case 'amenity': return <CheckCircle className="w-4 h-4" />
      case 'room': return <Tag className="w-4 h-4" />
      default: return <Tag className="w-4 h-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'interior': return 'bg-blue-100 text-blue-800'
      case 'exterior': return 'bg-green-100 text-green-800'
      case 'amenity': return 'bg-purple-100 text-purple-800'
      case 'room': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'processing': return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
      case 'pending': return <AlertCircle className="w-4 h-4 text-yellow-600" />
      case 'error': return <AlertCircle className="w-4 h-4 text-red-600" />
      default: return <AlertCircle className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleImageUpload = async (files: FileList) => {
    setUploading(true)
    try {
      // Simular subida de imágenes
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const newBatch: TaggingBatch = {
        id: Date.now().toString(),
        name: `Lote ${batches.length + 1}`,
        images_count: files.length,
        processed_count: 0,
        status: 'pending',
        created_at: new Date().toISOString()
      }
      
      setBatches(prev => [newBatch, ...prev])
    } catch (error) {
      console.error('Error uploading images:', error)
    } finally {
      setUploading(false)
    }
  }

  const reprocessImage = async (imageId: string) => {
    // Simular reprocesamiento
    console.log(`Reprocessing image ${imageId}`)
  }

  const downloadTags = (imageId: string) => {
    const image = images.find(img => img.id === imageId)
    if (image) {
      const tagsData = {
        filename: image.filename,
        tags: image.tags,
        ai_analysis: image.ai_analysis
      }
      
      const blob = new Blob([JSON.stringify(tagsData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${image.filename}_tags.json`
      a.click()
      URL.revokeObjectURL(url)
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
          <h2 className="text-2xl font-bold text-gray-900">Auto-Tagging de Imágenes</h2>
          <p className="text-gray-600 mt-1">
            Etiquetado automático de imágenes con IA
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Tag className="w-6 h-6 text-purple-600" />
          <span className="text-sm text-gray-600">Powered by AI Vision</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Image className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Imágenes Procesadas</p>
              <p className="text-2xl font-bold text-gray-900">{images.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Tag className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Tags Generados</p>
              <p className="text-2xl font-bold text-gray-900">
                {images.reduce((sum, img) => sum + img.tags.length, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Precisión Promedio</p>
              <p className="text-2xl font-bold text-gray-900">92%</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <RefreshCw className="w-8 h-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Lotes Activos</p>
              <p className="text-2xl font-bold text-gray-900">
                {batches.filter(b => b.status === 'processing' || b.status === 'pending').length}
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
              onClick={() => setActiveTab('images')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'images'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Imágenes Etiquetadas
            </button>
            <button
              onClick={() => setActiveTab('batches')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'batches'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Lotes de Procesamiento
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'upload'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Subir Imágenes
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Images Tab */}
          {activeTab === 'images' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => (
                <div key={image.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="mb-3">
                    <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center mb-3">
                      <Image className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="font-medium text-gray-900 truncate">{image.filename}</h3>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Tags Generados</h4>
                      <div className="space-y-1">
                        {image.tags.map((tag, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(tag.category)}`}>
                              {getCategoryIcon(tag.category)}
                              <span className="ml-1">{tag.description}</span>
                            </span>
                            <span className="text-xs text-gray-500">{tag.confidence}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Análisis IA</h4>
                      <div className="text-xs text-gray-600 space-y-1">
                        {image.ai_analysis.room_type && (
                          <div><strong>Tipo:</strong> {image.ai_analysis.room_type}</div>
                        )}
                        {image.ai_analysis.style && (
                          <div><strong>Estilo:</strong> {image.ai_analysis.style}</div>
                        )}
                        {image.ai_analysis.condition && (
                          <div><strong>Estado:</strong> {image.ai_analysis.condition}</div>
                        )}
                        {image.ai_analysis.colors && (
                          <div><strong>Colores:</strong> {image.ai_analysis.colors.join(', ')}</div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => reprocessImage(image.id)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="Reprocesar"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => downloadTags(image.id)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="Descargar tags"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="Ver imagen"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(image.processed_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Batches Tab */}
          {activeTab === 'batches' && (
            <div className="space-y-4">
              {batches.map((batch) => (
                <div key={batch.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{batch.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(batch.status)}`}>
                          {getStatusIcon(batch.status)}
                          <span className="ml-1 capitalize">{batch.status}</span>
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-4">
                          <span>Imágenes: {batch.images_count}</span>
                          <span>Procesadas: {batch.processed_count}</span>
                          <span>Progreso: {Math.round((batch.processed_count / batch.images_count) * 100)}%</span>
                        </div>
                      </div>

                      {batch.status === 'processing' && (
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(batch.processed_count / batch.images_count) * 100}%` }}
                          ></div>
                        </div>
                      )}
                      
                      <div className="text-xs text-gray-500">
                        Creado: {new Date(batch.created_at).toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {batch.status === 'completed' && (
                        <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors">
                          Ver Resultados
                        </button>
                      )}
                      {batch.status === 'error' && (
                        <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors">
                          Reintentar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <div className="space-y-6">
              <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Subir Imágenes para Etiquetado</h3>
                <p className="text-gray-600 mb-6">
                  Arrastra y suelta las imágenes aquí o haz clic para seleccionar archivos
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  {uploading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  <span>{uploading ? 'Subiendo...' : 'Seleccionar Imágenes'}</span>
                </label>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Información sobre el Auto-Tagging</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Soporta formatos: JPG, PNG, WebP</li>
                  <li>• Máximo 50 imágenes por lote</li>
                  <li>• Tiempo de procesamiento: 2-5 minutos</li>
                  <li>• Precisión promedio: 92%</li>
                  <li>• Categorías: Interior, Exterior, Amenidades, Habitaciones</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

