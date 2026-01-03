'use client'

import { useState, useEffect } from 'react'
import { PropertyCard } from '../../../components/PropertyCard'
import { PropertySkeleton } from '../../../components/PropertySkeleton'
import { EmptyState } from '../../../components/EmptyState'
import { Heart, Trash2, Share2, MessageCircle } from 'lucide-react'
import { useFavorites } from '../../../hooks/useFavorites'

interface FavoriteProperty {
  id: string
  title: string
  price: number
  type: string
  operation: string
  location: string
  bedrooms?: number
  bathrooms?: number
  area?: number
  images?: string[]
  added_at: string
  notes?: string
}

export function ClientFavorites() {
  const [favorites, setFavorites] = useState<FavoriteProperty[]>([])
  const [loading, setLoading] = useState(true)
  const [showNotes, setShowNotes] = useState<{ [key: string]: boolean }>({})
  const { favorites: favoriteIds, toggleFavorite } = useFavorites()

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        // Simular datos de favoritos (integrar con API real después)
        const mockFavorites: FavoriteProperty[] = [
          {
            id: '1',
            title: 'Apartamento moderno en el centro',
            price: 350000,
            type: 'apartment',
            operation: 'sale',
            location: 'Madrid Centro',
            bedrooms: 2,
            bathrooms: 1,
            area: 85,
            images: ['/images/property1.jpg'],
            added_at: '2024-01-15T10:30:00Z',
            notes: 'Muy cerca del metro, perfecto para trabajo'
          },
          {
            id: '2',
            title: 'Casa con jardín en las afueras',
            price: 450000,
            type: 'house',
            operation: 'sale',
            location: 'Madrid Norte',
            bedrooms: 3,
            bathrooms: 2,
            area: 120,
            images: ['/images/property2.jpg'],
            added_at: '2024-01-14T15:45:00Z',
            notes: 'Jardín grande, ideal para niños'
          },
          {
            id: '3',
            title: 'Loft industrial renovado',
            price: 280000,
            type: 'apartment',
            operation: 'sale',
            location: 'Barcelona Poblenou',
            bedrooms: 1,
            bathrooms: 1,
            area: 65,
            images: ['/images/property3.jpg'],
            added_at: '2024-01-13T09:20:00Z'
          }
        ]
        
        setFavorites(mockFavorites)
      } catch (error) {
        console.error('Error fetching favorites:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [])

  const handleRemoveFavorite = async (propertyId: string) => {
    try {
      await toggleFavorite(parseInt(propertyId))
      setFavorites(prev => prev.filter(p => p.id !== propertyId))
    } catch (error) {
      console.error('Error removing favorite:', error)
    }
  }

  const handleShareProperty = (property: FavoriteProperty) => {
    const shareUrl = `${window.location.origin}/propiedad/${property.id}`
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Mira esta propiedad: ${property.title}`,
        url: shareUrl
      })
    } else {
      navigator.clipboard.writeText(shareUrl)
      // Aquí podrías mostrar un toast de confirmación
    }
  }

  const toggleNotes = (propertyId: string) => {
    setShowNotes(prev => ({
      ...prev,
      [propertyId]: !prev[propertyId]
    }))
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Mis Favoritos</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <PropertySkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mis Favoritos</h2>
          <p className="text-gray-600 mt-1">
            Propiedades que has guardado como favoritas
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Heart className="w-5 h-5 text-red-500" />
          <span className="text-lg font-semibold text-gray-900">{favorites.length}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Heart className="w-8 h-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Favoritos</p>
              <p className="text-2xl font-bold text-gray-900">{favorites.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <MessageCircle className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Con Notas</p>
              <p className="text-2xl font-bold text-gray-900">
                {favorites.filter(f => f.notes).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Share2 className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Compartidas</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Favorites List */}
      {favorites.length === 0 ? (
        <EmptyState
          type="properties"
          title="No tienes favoritos"
          description="Guarda propiedades que te gusten para acceder a ellas fácilmente"
          action={{
            label: "Explorar Propiedades",
            onClick: () => window.location.href = "/comprar"
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((property) => (
            <div key={property.id} className="relative group">
              <PropertyCard
                property={{
                  id: property.id,
                  title: property.title,
                  price: property.price,
                  type: property.type,
                  operation: property.operation,
                  location: property.location,
                  bedrooms: property.bedrooms,
                  bathrooms: property.bathrooms,
                  area: property.area,
                  images: property.images
                }}
              />
              
              {/* Action Buttons */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleShareProperty(property)}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                    title="Compartir"
                  >
                    <Share2 className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleRemoveFavorite(property.id)}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                    title="Eliminar de favoritos"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>

              {/* Added Date */}
              <div className="absolute bottom-3 left-3">
                <span className="bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                  Guardado: {new Date(property.added_at).toLocaleDateString()}
                </span>
              </div>

              {/* Notes Section */}
              {property.notes && (
                <div className="mt-3">
                  <button
                    onClick={() => toggleNotes(property.id)}
                    className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Ver notas</span>
                  </button>
                  
                  {showNotes[property.id] && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{property.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
