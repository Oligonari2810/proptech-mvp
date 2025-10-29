'use client'

import { useState, useEffect } from 'react'
import { PropertyCard } from '../../../components/PropertyCard'
import { PropertySkeleton } from '../../../components/PropertySkeleton'
import { EmptyState } from '../../../components/EmptyState'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Filter,
  Search,
  Calendar,
  MapPin,
  DollarSign
} from 'lucide-react'

interface BrokerProperty {
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
  status: 'active' | 'pending' | 'sold' | 'rented'
  views: number
  inquiries: number
  created_at: string
  updated_at: string
}

export function PropertyManagement() {
  const [properties, setProperties] = useState<BrokerProperty[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'pending' | 'sold' | 'rented'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchBrokerProperties = async () => {
      try {
        // Simular datos de propiedades del broker
        const mockProperties: BrokerProperty[] = [
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
            status: 'active',
            views: 156,
            inquiries: 12,
            created_at: '2024-01-15T10:30:00Z',
            updated_at: '2024-01-20T14:22:00Z'
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
            status: 'pending',
            views: 89,
            inquiries: 8,
            created_at: '2024-01-14T15:45:00Z',
            updated_at: '2024-01-19T09:15:00Z'
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
            status: 'sold',
            views: 234,
            inquiries: 18,
            created_at: '2024-01-13T09:20:00Z',
            updated_at: '2024-01-18T16:30:00Z'
          },
          {
            id: '4',
            title: 'Piso en zona residencial',
            price: 1800,
            type: 'apartment',
            operation: 'rent',
            location: 'Valencia Centro',
            bedrooms: 2,
            bathrooms: 1,
            area: 75,
            images: ['/images/property4.jpg'],
            status: 'rented',
            views: 98,
            inquiries: 6,
            created_at: '2024-01-12T11:10:00Z',
            updated_at: '2024-01-17T13:45:00Z'
          }
        ]
        
        setProperties(mockProperties)
      } catch (error) {
        console.error('Error fetching broker properties:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBrokerProperties()
  }, [])

  const filteredProperties = properties.filter(property => {
    const matchesFilter = filter === 'all' || property.status === filter
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'sold': return 'bg-blue-100 text-blue-800'
      case 'rented': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activa'
      case 'pending': return 'Pendiente'
      case 'sold': return 'Vendida'
      case 'rented': return 'Alquilada'
      default: return status
    }
  }

  const handleToggleStatus = (propertyId: string, newStatus: string) => {
    setProperties(prev => prev.map(p => 
      p.id === propertyId ? { ...p, status: newStatus as any } : p
    ))
  }

  const handleDeleteProperty = (propertyId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta propiedad?')) {
      setProperties(prev => prev.filter(p => p.id !== propertyId))
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Propiedades</h2>
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
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Propiedades</h2>
          <p className="text-gray-600 mt-1">
            Administra tus propiedades y supervisa su rendimiento
          </p>
        </div>
        <a
          href="/vender"
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Propiedad</span>
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Eye className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Activas</p>
              <p className="text-2xl font-bold text-gray-900">
                {properties.filter(p => p.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Pendientes</p>
              <p className="text-2xl font-bold text-gray-900">
                {properties.filter(p => p.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Vendidas</p>
              <p className="text-2xl font-bold text-gray-900">
                {properties.filter(p => p.status === 'sold').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <MapPin className="w-8 h-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Alquiladas</p>
              <p className="text-2xl font-bold text-gray-900">
                {properties.filter(p => p.status === 'rented').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todas</option>
                <option value="active">Activas</option>
                <option value="pending">Pendientes</option>
                <option value="sold">Vendidas</option>
                <option value="rented">Alquiladas</option>
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar propiedades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
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
              ? "Aún no tienes propiedades registradas. ¡Crea tu primera propiedad!"
              : `No tienes propiedades con estado "${getStatusText(filter)}"`
          }
          action={{
            label: "Crear Propiedad",
            onClick: () => window.location.href = "/vender"
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
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
              
              {/* Status Badge */}
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                  {getStatusText(property.status)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleToggleStatus(property.id, property.status === 'active' ? 'pending' : 'active')}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                    title={property.status === 'active' ? 'Desactivar' : 'Activar'}
                  >
                    {property.status === 'active' ? (
                      <EyeOff className="w-4 h-4 text-gray-600" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDeleteProperty(property.id)}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>

              {/* Performance Stats */}
              <div className="absolute bottom-3 left-3 right-3">
                <div className="bg-black bg-opacity-75 text-white px-3 py-2 rounded-lg">
                  <div className="flex justify-between text-xs">
                    <span>{property.views} vistas</span>
                    <span>{property.inquiries} consultas</span>
                    <span>{new Date(property.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
