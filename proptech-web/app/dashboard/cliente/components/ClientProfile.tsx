'use client'

import { useState } from 'react'
import { Edit3, Phone, Mail, MapPin, Settings, Heart, Eye, Search, MessageCircle } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  phone?: string
  preferences: {
    priceRange: { min: number; max: number }
    propertyTypes: string[]
    locations: string[]
  }
}

interface Stats {
  favoritesCount: number
  viewedProperties: number
  savedSearches: number
  inquiriesSent: number
}

interface ClientProfileProps {
  user: User
  stats: Stats
}

export function ClientProfile({ user, stats }: ClientProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    priceRange: user.preferences.priceRange,
    propertyTypes: user.preferences.propertyTypes,
    locations: user.preferences.locations
  })

  const handleSave = () => {
    // Aquí se integraría con la API para guardar los cambios
    console.log('Guardando perfil:', formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      priceRange: user.preferences.priceRange,
      propertyTypes: user.preferences.propertyTypes,
      locations: user.preferences.locations
    })
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            <span>{isEditing ? 'Cancelar' : 'Editar'}</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-red-50 rounded-lg p-4 text-center">
            <Heart className="w-6 h-6 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-600">{stats.favoritesCount}</p>
            <p className="text-sm text-gray-600">Favoritos</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <Eye className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">{stats.viewedProperties}</p>
            <p className="text-sm text-gray-600">Vistas</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <Search className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{stats.savedSearches}</p>
            <p className="text-sm text-gray-600">Búsquedas</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <MessageCircle className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">{stats.inquiriesSent}</p>
            <p className="text-sm text-gray-600">Consultas</p>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Personal</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{user.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            {isEditing ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{user.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
            {isEditing ? (
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{user.phone || 'No especificado'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rango de Precio</label>
            {isEditing ? (
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={formData.priceRange.min}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    priceRange: { ...formData.priceRange, min: parseInt(e.target.value) }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Mínimo"
                />
                <input
                  type="number"
                  value={formData.priceRange.max}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    priceRange: { ...formData.priceRange, max: parseInt(e.target.value) }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Máximo"
                />
              </div>
            ) : (
              <p className="text-gray-900">
                {user.preferences.priceRange.min.toLocaleString()}€ - {user.preferences.priceRange.max.toLocaleString()}€
              </p>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
            >
              Guardar Cambios
            </button>
          </div>
        )}
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferencias de Búsqueda</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipos de Propiedad</label>
            <div className="flex flex-wrap gap-2">
              {user.preferences.propertyTypes.map((type) => (
                <span
                  key={type}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {type === 'apartment' ? 'Apartamento' : type === 'house' ? 'Casa' : type}
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ubicaciones Preferidas</label>
            <div className="flex flex-wrap gap-2">
              {user.preferences.locations.map((location) => (
                <span
                  key={location}
                  className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  {location}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
