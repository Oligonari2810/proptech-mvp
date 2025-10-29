'use client'

import { useState, useEffect } from 'react'
import { PipelineBoard } from './components/PipelineBoard'
import { LeadHeatmapManager } from './components/LeadHeatmapManager'
import { LeadCard } from './components/LeadCard'
import { StageColumn } from './components/StageColumn'
import { 
  Plus, 
  Filter, 
  Search, 
  BarChart3, 
  TrendingUp,
  Users,
  Target,
  Clock
} from 'lucide-react'

interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  propertyId: string
  propertyTitle: string
  stage: 'lead' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost'
  priority: 'low' | 'medium' | 'high'
  source: 'website' | 'referral' | 'social' | 'advertisement'
  notes?: string
  created_at: string
  last_contact: string
  next_followup?: string
  score: number
  estimated_value: number
}

interface PipelineStats {
  totalLeads: number
  conversionRate: number
  avgDealSize: number
  salesCycle: number
  stageDistribution: { [key: string]: number }
}

export default function CRMPipeline() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [stats, setStats] = useState<PipelineStats | null>(null)

  const stages = [
    { id: 'lead', name: 'Lead', color: 'blue' },
    { id: 'contacted', name: 'Contactado', color: 'yellow' },
    { id: 'qualified', name: 'Cualificado', color: 'orange' },
    { id: 'proposal', name: 'Propuesta', color: 'purple' },
    { id: 'negotiation', name: 'Negociación', color: 'indigo' },
    { id: 'closed-won', name: 'Ganado', color: 'green' },
    { id: 'closed-lost', name: 'Perdido', color: 'red' }
  ]

  useEffect(() => {
    const fetchPipelineData = async () => {
      try {
        // Simular datos del pipeline
        const mockLeads: Lead[] = [
          {
            id: '1',
            name: 'María García',
            email: 'maria.garcia@email.com',
            phone: '+34 600 123 456',
            propertyId: '1',
            propertyTitle: 'Apartamento moderno en el centro',
            stage: 'lead',
            priority: 'high',
            source: 'website',
            notes: 'Interesada en apartamento de 2 habitaciones',
            created_at: '2024-01-20T10:30:00Z',
            last_contact: '2024-01-20T10:30:00Z',
            next_followup: '2024-01-22T10:00:00Z',
            score: 85,
            estimated_value: 350000
          },
          {
            id: '2',
            name: 'Carlos López',
            email: 'carlos.lopez@email.com',
            phone: '+34 600 789 123',
            propertyId: '2',
            propertyTitle: 'Casa con jardín en las afueras',
            stage: 'contacted',
            priority: 'medium',
            source: 'referral',
            notes: 'Referido por cliente anterior',
            created_at: '2024-01-19T15:45:00Z',
            last_contact: '2024-01-20T09:15:00Z',
            next_followup: '2024-01-23T14:00:00Z',
            score: 72,
            estimated_value: 450000
          },
          {
            id: '3',
            name: 'Ana Martínez',
            email: 'ana.martinez@email.com',
            phone: '+34 600 456 789',
            propertyId: '3',
            propertyTitle: 'Loft industrial renovado',
            stage: 'qualified',
            priority: 'high',
            source: 'social',
            notes: 'Muy interesada, quiere visitar esta semana',
            created_at: '2024-01-18T09:20:00Z',
            last_contact: '2024-01-19T16:30:00Z',
            next_followup: '2024-01-21T11:00:00Z',
            score: 92,
            estimated_value: 280000
          },
          {
            id: '4',
            name: 'David Ruiz',
            email: 'david.ruiz@email.com',
            phone: '+34 600 321 654',
            propertyId: '4',
            propertyTitle: 'Piso en zona residencial',
            stage: 'proposal',
            priority: 'medium',
            source: 'advertisement',
            notes: 'Cliente cualificado, presupuesto confirmado',
            created_at: '2024-01-17T11:10:00Z',
            last_contact: '2024-01-18T13:45:00Z',
            next_followup: '2024-01-24T16:00:00Z',
            score: 78,
            estimated_value: 1800
          },
          {
            id: '5',
            name: 'Laura Sánchez',
            email: 'laura.sanchez@email.com',
            phone: '+34 600 987 654',
            propertyId: '1',
            propertyTitle: 'Apartamento moderno en el centro',
            stage: 'negotiation',
            priority: 'high',
            source: 'website',
            notes: 'En negociación de precio final',
            created_at: '2024-01-15T14:22:00Z',
            last_contact: '2024-01-20T10:00:00Z',
            next_followup: '2024-01-22T15:00:00Z',
            score: 88,
            estimated_value: 340000
          },
          {
            id: '6',
            name: 'Pedro González',
            email: 'pedro.gonzalez@email.com',
            phone: '+34 600 555 666',
            propertyId: '2',
            propertyTitle: 'Casa con jardín en las afueras',
            stage: 'closed-won',
            priority: 'low',
            source: 'referral',
            notes: 'Venta completada exitosamente',
            created_at: '2024-01-10T09:00:00Z',
            last_contact: '2024-01-15T16:00:00Z',
            score: 95,
            estimated_value: 450000
          }
        ]

        // Calcular estadísticas
        const totalLeads = mockLeads.length
        const wonLeads = mockLeads.filter(l => l.stage === 'closed-won').length
        const conversionRate = totalLeads > 0 ? (wonLeads / totalLeads) * 100 : 0
        const avgDealSize = wonLeads > 0 
          ? mockLeads.filter(l => l.stage === 'closed-won').reduce((sum, l) => sum + l.estimated_value, 0) / wonLeads
          : 0

        const stageDistribution = stages.reduce((acc, stage) => {
          acc[stage.id] = mockLeads.filter(l => l.stage === stage.id).length
          return acc
        }, {} as { [key: string]: number })

        setLeads(mockLeads)
        setStats({
          totalLeads,
          conversionRate,
          avgDealSize,
          salesCycle: 15, // días promedio
          stageDistribution
        })
      } catch (error) {
        console.error('Error fetching pipeline data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPipelineData()
  }, [])

  const filteredLeads = leads.filter(lead => {
    const matchesPriority = filter === 'all' || lead.priority === filter
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesPriority && matchesSearch
  })

  const moveLead = (leadId: string, newStage: string) => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId 
        ? { ...lead, stage: newStage as any, last_contact: new Date().toISOString() }
        : lead
    ))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
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
              <h1 className="text-3xl font-bold text-gray-900">CRM Pipeline</h1>
              <p className="text-gray-600 mt-2">
                Gestión visual del pipeline de ventas
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Leads</p>
                <p className="text-2xl font-bold text-blue-600">{stats?.totalLeads}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Tasa Conversión</p>
                <p className="text-2xl font-bold text-green-600">{stats?.conversionRate.toFixed(1)}%</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Valor Promedio</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats?.avgDealSize.toLocaleString()}€
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalLeads}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <Target className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Tasa Conversión</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.conversionRate.toFixed(1)}%</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Valor Promedio</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.avgDealSize.toLocaleString()}€
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Ciclo Promedio</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.salesCycle} días</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Todas las Prioridades</option>
                  <option value="high">Alta Prioridad</option>
                  <option value="medium">Media Prioridad</option>
                  <option value="low">Baja Prioridad</option>
                </select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Pipeline Board */}
        <PipelineBoard 
          stages={stages}
          leads={filteredLeads}
          onMoveLead={moveLead}
        />
      </div>
    </div>
  )
}
