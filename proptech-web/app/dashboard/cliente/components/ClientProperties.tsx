'use client'

import { useState, useEffect } from 'react'
import { PropertyCard } from '../../../components/PropertyCard'
import { PropertySkeleton } from '../../../components/PropertySkeleton'
import { EmptyState } from '../../../components/EmptyState'
import { Eye, Calendar, MapPin, Filter } from 'lucide-react'

interface Property {
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
  viewed_at: string
  status: 'viewed' | 'interested' | 'contacted'
}

export function ClientProperties() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'viewed' | 'interested' | 'contacted'>('all')

  useEffect(() => {
    const fetchClientProperties = async () => {
      try {
        // Simular datos de propiedades vistas por el cliente
        const mockProperties: Property[] = [
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
            viewed_at: '2024-01-15T10:30:00Z',
            status: 'viewed'
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
            viewed_at: '2024-01-14T15:45:00Z',
            status: 'interested'
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
            viewed_at: '2024-01-13T09:20:00Z',
            status: 'contacted'
          }
        ]
        
        setProperties(mockProperties)
      } catch (error) {
        console.error('Error fetching client properties:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchClientProperties()
  }, [])

  const filteredProperties = properties.filter(property => 
    filter === 'all' || property.status === filter
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'viewed': return 'bg-blue-100 text-blue-800'
      case 'interested': return 'bg-yellow-100 text-yellow-800'
      case 'contacted': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'viewed': return 'Vista'
      case 'interested': return 'Interesado'
      case 'contacted': return 'Contactado'
      default: return status
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Mis Propiedades</h2>
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
          <h2 className="text-2xl font-bold text-gray-900">Mis Propiedades</h2>
          <p className="text-gray-600 mt-1">
            Propiedades que has visto y tu historial de actividad
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todas</option>
            <option value="viewed">Vistas</option>
            <option value="interested">Interesado</option>
            <option value="contacted">Contactado</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Eye className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Vistas</p>
              <p className="text-2xl font-bold text-gray-900">{properties.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Esta Semana</p>
              <p className="text-2xl font-bold text-gray-900">
                {properties.filter(p => {
                  const weekAgo = new Date()
                  weekAgo.setDate(weekAgo.getDate() - 7)
                  return new Date(p.viewed_at) > weekAgo
                }).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <MapPin className="w-8 h-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Ubicaciones</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(properties.map(p => p.location)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Properties List */}
      {filteredProperties.length === 0 ? (
        <EmptyState
          type="properties"
          title="No hay propiedades"
          description={
            filter === 'all' 
              ? "Aún no has visto ninguna propiedad. ¡Explora nuestro catálogo!"
              : `No tienes propiedades con estado "${getStatusText(filter)}"`
          }
          action={{
            label: "Explorar Propiedades",
            onClick: () => window.location.href = "/comprar"
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <div key={property.id} className="relative">
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
              
              {/* Status Badge */}
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                  {getStatusText(property.status)}
                </span>
              </div>

              {/* Viewed Date */}
              <div className="absolute bottom-3 left-3">
                <span className="bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                  Vista: {new Date(property.viewed_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
