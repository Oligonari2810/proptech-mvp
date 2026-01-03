'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
import { BrokerStats } from './components/BrokerStats'
import { PropertyManagement } from './components/PropertyManagement'
import { LeadsManager } from './components/LeadsManager'
import { AutoResponderManager } from './components/AutoResponderManager'
import { DocumentGenerator } from './components/DocumentGenerator'
import { AIWriter } from './components/AIWriter'
import { AutoTaggingManager } from './components/AutoTaggingManager'
import { SalesPredictor } from './components/SalesPredictor'
import { CompetitiveBenchmarking } from './components/CompetitiveBenchmarking'

interface BrokerDashboardData {
  user: {
    id: string
    name: string
    email: string
    avatar?: string
    phone?: string
    license: string
    agency: string
  }
  stats: {
    totalProperties: number
    activeProperties: number
    totalLeads: number
    convertedLeads: number
    monthlyRevenue: number
    avgResponseTime: number
  }
}

function BrokerDashboard() {
  const session = useSession()
  const { data: sessionData, status } = session
  const [dashboardData, setDashboardData] = useState<BrokerDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'stats' | 'properties' | 'leads' | 'auto-responder' | 'documents' | 'ai-writer' | 'auto-tagging' | 'sales-predictor' | 'benchmarking'>('stats')

  useEffect(() => {
    const fetchBrokerData = async () => {
      try {
        // Simular datos del broker (integrar con API real después)
        setDashboardData({
          user: {
            id: '1',
            name: sessionData?.user?.name || 'Broker Demo',
            email: sessionData?.user?.email || 'broker@habitatpro.com',
            phone: '+34 600 789 123',
            license: 'COAPI-12345',
            agency: 'HabitatPro Real Estate'
          },
          stats: {
            totalProperties: 25,
            activeProperties: 18,
            totalLeads: 156,
            convertedLeads: 23,
            monthlyRevenue: 125000,
            avgResponseTime: 2.5
          }
        })
      } catch (error) {
        console.error('Error fetching broker data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (status === 'authenticated') {
      fetchBrokerData()
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
          <p className="text-gray-600 mb-6">Necesitas iniciar sesión como broker para acceder a este dashboard</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Broker</h1>
              <p className="text-gray-600 mt-2">
                Bienvenido, {dashboardData?.user.name} - {dashboardData?.user.agency}
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-sm text-gray-500">Propiedades Activas</p>
                <p className="text-2xl font-bold text-green-600">{dashboardData?.stats.activeProperties}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Leads Convertidos</p>
                <p className="text-2xl font-bold text-blue-600">{dashboardData?.stats.convertedLeads}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Ingresos Mensuales</p>
                <p className="text-2xl font-bold text-purple-600">
                  {dashboardData?.stats.monthlyRevenue.toLocaleString()}€
                </p>
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
              onClick={() => setActiveTab('stats')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'stats'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Estadísticas
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
              onClick={() => setActiveTab('leads')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'leads'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Gestión de Leads
            </button>
            <button
              onClick={() => setActiveTab('auto-responder')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'auto-responder'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Auto-Responder
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'documents'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Documentos
            </button>
            <button
              onClick={() => setActiveTab('ai-writer')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'ai-writer'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              IA Redactora
            </button>
            <button
              onClick={() => setActiveTab('auto-tagging')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'auto-tagging'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Auto-Tagging
            </button>
            <button
              onClick={() => setActiveTab('sales-predictor')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'sales-predictor'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Predicción Ventas
            </button>
            <button
              onClick={() => setActiveTab('benchmarking')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'benchmarking'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Benchmarking
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'stats' && dashboardData && (
          <BrokerStats user={dashboardData.user} stats={dashboardData.stats} />
        )}
        {activeTab === 'properties' && (
          <PropertyManagement />
        )}
        {activeTab === 'leads' && (
          <LeadsManager />
        )}
        {activeTab === 'auto-responder' && (
          <AutoResponderManager />
        )}
        {activeTab === 'documents' && (
          <DocumentGenerator />
        )}
        {activeTab === 'ai-writer' && (
          <AIWriter />
        )}
        {activeTab === 'auto-tagging' && (
          <AutoTaggingManager />
        )}
        {activeTab === 'sales-predictor' && (
          <SalesPredictor />
        )}
        {activeTab === 'benchmarking' && (
          <CompetitiveBenchmarking />
        )}
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(BrokerDashboard), {
  ssr: false
})
