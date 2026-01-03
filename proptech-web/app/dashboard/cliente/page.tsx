'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
import { ClientProfile } from './components/ClientProfile'
import { ClientProperties } from './components/ClientProperties'
import { ClientFavorites } from './components/ClientFavorites'
import { SmartMatchEngine } from './components/SmartMatchEngine'
import { ROIDashboard } from './components/ROIDashboard'

interface ClientDashboardData {
  user: {
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
  stats: {
    favoritesCount: number
    viewedProperties: number
    savedSearches: number
    inquiriesSent: number
  }
}

function ClientDashboard() {
  const session = useSession()
  const { data: sessionData, status } = session
  const [dashboardData, setDashboardData] = useState<ClientDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'profile' | 'properties' | 'favorites' | 'smartmatch' | 'roi'>('profile')

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        // Simular datos del cliente (integrar con API real después)
        setDashboardData({
          user: {
            id: '1',
            name: sessionData?.user?.name || 'Usuario Cliente',
            email: sessionData?.user?.email || 'cliente@habitatpro.com',
            phone: '+34 600 123 456',
            preferences: {
              priceRange: { min: 200000, max: 500000 },
              propertyTypes: ['apartment', 'house'],
              locations: ['Madrid', 'Barcelona']
            }
          },
          stats: {
            favoritesCount: 12,
            viewedProperties: 45,
            savedSearches: 3,
            inquiriesSent: 8
          }
        })
      } catch (error) {
        console.error('Error fetching client data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (status === 'authenticated') {
      fetchClientData()
    }
  }, [sessionData, status])

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso Requerido</h1>
          <p className="text-gray-600 mb-6">Necesitas iniciar sesión para acceder a tu dashboard</p>
          <a 
            href="/auth/signin" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Iniciar Sesión
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mi Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Bienvenido, {dashboardData?.user.name}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Propiedades favoritas</p>
                <p className="text-2xl font-bold text-blue-600">{dashboardData?.stats.favoritesCount}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Búsquedas guardadas</p>
                <p className="text-2xl font-bold text-green-600">{dashboardData?.stats.savedSearches}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Mi Perfil
            </button>
            <button
              onClick={() => setActiveTab('properties')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'properties'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Mis Propiedades
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'favorites'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Favoritos
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'profile' && dashboardData && (
          <ClientProfile user={dashboardData.user} stats={dashboardData.stats} />
        )}
        {activeTab === 'properties' && (
          <ClientProperties />
        )}
        {activeTab === 'favorites' && (
          <ClientFavorites />
        )}
        {activeTab === 'smartmatch' && (
          <SmartMatchEngine />
        )}
        {activeTab === 'roi' && (
          <ROIDashboard />
        )}
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(ClientDashboard), {
  ssr: false
})
