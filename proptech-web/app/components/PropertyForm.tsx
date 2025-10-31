'use client'

import { useState } from 'react'
import { createProperty, type PropertyData } from '../lib/propertyAPI'
import { AddressAutocomplete } from './AddressAutocomplete'

interface PropertyFormProps {
  onSuccess?: (property: any) => void
  onError?: (error: string) => void
}

export default function PropertyForm({ onSuccess, onError }: PropertyFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<PropertyData>>({
    title: '',
    description: '',
    price: 0,
    type: 'casa',
    operation: 'compra',
    location: '',
    bedrooms: 0,
    bathrooms: 0,
    area: 0,
    features: [],
    emotional_tags: [],
  })

  const [images, setImages] = useState<string[]>([])
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | undefined>(undefined)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'bedrooms' || name === 'bathrooms' || name === 'area'
        ? parseFloat(value) || 0
        : value,
    }))
  }

  const handleFeatureToggle = (feature: string) => {
    setFormData((prev) => {
      const currentFeatures = prev.features || []
      const newFeatures = currentFeatures.includes(feature)
        ? currentFeatures.filter((f) => f !== feature)
        : [...currentFeatures, feature]
      return { ...prev, features: newFeatures }
    })
  }

  const handleTagToggle = (tag: string) => {
    setFormData((prev) => {
      const currentTags = prev.emotional_tags || []
      const newTags = currentTags.includes(tag)
        ? currentTags.filter((t) => t !== tag)
        : [...currentTags, tag]
      return { ...prev, emotional_tags: newTags }
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setImages([...images, result])
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const propertyData: PropertyData = {
        title: formData.title || '',
        description: formData.description || '',
        price: formData.price || 0,
        type: formData.type || 'casa',
        operation: formData.operation || 'compra',
        location: formData.location || '',
        latitude: coordinates?.lat,
        longitude: coordinates?.lng,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        area: formData.area,
        features: formData.features,
        emotional_tags: formData.emotional_tags,
        images: images,
      }

      const result = await createProperty(propertyData)

      if (result.success) {
        onSuccess?.(result.property)
        // Reset form
        setFormData({
          title: '',
          description: '',
          price: 0,
          type: 'casa',
          operation: 'compra',
          location: '',
          bedrooms: 0,
          bathrooms: 0,
          area: 0,
          features: [],
          emotional_tags: [],
        })
        setImages([])
      } else {
        onError?.(result.error || 'Error desconocido')
      }
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  const availableFeatures = ['piscina', 'garaje', 'jardín', 'ascensor', 'terraza', 'chimenea', 'aire_acondicionado']
  const availableTags = ['familiar', 'moderno', 'lujoso', 'acogedor', 'exclusivo', 'rústico', 'urbano']

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Información Básica */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título de la propiedad *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: Espectacular ático con vistas al mar"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de propiedad *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="casa">Casa</option>
              <option value="apartamento">Apartamento</option>
              <option value="ático">Ático</option>
              <option value="dúplex">Dúplex</option>
              <option value="estudio">Estudio</option>
              <option value="local">Local</option>
              <option value="terreno">Terreno</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Operación *
            </label>
            <select
              name="operation"
              value={formData.operation}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="compra">Compra</option>
              <option value="alquiler">Alquiler</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Precio (€) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              min="0"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ubicación *
            </label>
            <AddressAutocomplete
              value={formData.location || ''}
              onChange={(address, coords) => {
                setFormData((prev) => ({ ...prev, location: address }))
                if (coords) {
                  setCoordinates(coords)
                }
              }}
              placeholder="Buscar dirección en República Dominicana..."
              required
              country="do"
              className="w-full"
            />
            {coordinates && (
              <p className="mt-1 text-xs text-gray-500">
                📍 Coordenadas: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Detalles de la propiedad */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalles</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dormitorios</label>
            <input
              type="number"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleInputChange}
              min="0"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Baños</label>
            <input
              type="number"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleInputChange}
              min="0"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Superficie (m²)
            </label>
            <input
              type="number"
              name="area"
              value={formData.area}
              onChange={handleInputChange}
              min="0"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Descripción */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Descripción</h3>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={5}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Describe las características más importantes de tu propiedad..."
        />
      </div>

      {/* Características */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Características</h3>
        <div className="flex flex-wrap gap-2">
          {availableFeatures.map((feature) => (
            <button
              key={feature}
              type="button"
              onClick={() => handleFeatureToggle(feature)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                formData.features?.includes(feature)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {feature}
            </button>
          ))}
        </div>
      </div>

      {/* Tags Emocionales (IA) */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags Emocionales</h3>
        <p className="text-sm text-gray-600 mb-3">
          Selecciona tags que ayuden a describir el ambiente de tu propiedad
        </p>
        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleTagToggle(tag)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                formData.emotional_tags?.includes(tag)
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Subir imágenes */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Imágenes</h3>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {images.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-2">
            {images.map((img, idx) => (
              <img key={idx} src={img} alt={`Propiedad ${idx + 1}`} className="rounded-lg" />
            ))}
          </div>
        )}
      </div>

      {/* Botón de envío */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
        >
          {loading ? 'Publicando...' : 'Publicar Propiedad'}
        </button>
      </div>
    </form>
  )
}

