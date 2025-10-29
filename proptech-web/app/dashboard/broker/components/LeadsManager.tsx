'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  Phone, 
  Mail, 
  Calendar, 
  Filter,
  Search,
  MessageCircle,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'

interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  propertyId: string
  propertyTitle: string
  status: 'new' | 'contacted' | 'interested' | 'qualified' | 'converted' | 'lost'
  priority: 'low' | 'medium' | 'high'
  source: 'website' | 'referral' | 'social' | 'advertisement'
  notes?: string
  created_at: string
  last_contact: string
  next_followup?: string
  score: number
}

export function LeadsManager() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'new' | 'contacted' | 'interested' | 'qualified' | 'converted' | 'lost'>('all')
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        // Simular datos de leads
        const mockLeads: Lead[] = [
          {
            id: '1',
            name: 'María García',
            email: 'maria.garcia@email.com',
            phone: '+34 600 123 456',
            propertyId: '1',
            propertyTitle: 'Apartamento moderno en el centro',
            status: 'new',
            priority: 'high',
            source: 'website',
            notes: 'Interesada en apartamento de 2 habitaciones',
            created_at: '2024-01-20T10:30:00Z',
            last_contact: '2024-01-20T10:30:00Z',
            next_followup: '2024-01-22T10:00:00Z',
            score: 85
          },
          {
            id: '2',
            name: 'Carlos López',
            email: 'carlos.lopez@email.com',
            phone: '+34 600 789 123',
            propertyId: '2',
            propertyTitle: 'Casa con jardín en las afueras',
            status: 'contacted',
            priority: 'medium',
            source: 'referral',
            notes: 'Referido por cliente anterior',
            created_at: '2024-01-19T15:45:00Z',
            last_contact: '2024-01-20T09:15:00Z',
            next_followup: '2024-01-23T14:00:00Z',
            score: 72
          },
          {
            id: '3',
            name: 'Ana Martínez',
            email: 'ana.martinez@email.com',
            phone: '+34 600 456 789',
            propertyId: '3',
            propertyTitle: 'Loft industrial renovado',
            status: 'interested',
            priority: 'high',
            source: 'social',
            notes: 'Muy interesada, quiere visitar esta semana',
            created_at: '2024-01-18T09:20:00Z',
            last_contact: '2024-01-19T16:30:00Z',
            next_followup: '2024-01-21T11:00:00Z',
            score: 92
          },
          {
            id: '4',
            name: 'David Ruiz',
            email: 'david.ruiz@email.com',
            phone: '+34 600 321 654',
            propertyId: '4',
            propertyTitle: 'Piso en zona residencial',
            status: 'qualified',
            priority: 'medium',
            source: 'advertisement',
            notes: 'Cliente cualificado, presupuesto confirmado',
            created_at: '2024-01-17T11:10:00Z',
            last_contact: '2024-01-18T13:45:00Z',
            next_followup: '2024-01-24T16:00:00Z',
            score: 78
          },
          {
            id: '5',
            name: 'Laura Sánchez',
            email: 'laura.sanchez@email.com',
            phone: '+34 600 987 654',
            propertyId: '1',
            propertyTitle: 'Apartamento moderno en el centro',
            status: 'converted',
            priority: 'low',
            source: 'website',
            notes: 'Cliente convertido - venta completada',
            created_at: '2024-01-15T14:22:00Z',
            last_contact: '2024-01-16T10:00:00Z',
            score: 95
          }
        ]
        
        setLeads(mockLeads)
      } catch (error) {
        console.error('Error fetching leads:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeads()
  }, [])

  const filteredLeads = leads.filter(lead => {
    const matchesStatus = filter === 'all' || lead.status === filter
    const matchesPriority = priorityFilter === 'all' || lead.priority === priorityFilter
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesPriority && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800'
      case 'contacted': return 'bg-yellow-100 text-yellow-800'
      case 'interested': return 'bg-orange-100 text-orange-800'
      case 'qualified': return 'bg-purple-100 text-purple-800'
      case 'converted': return 'bg-green-100 text-green-800'
      case 'lost': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new': return 'Nuevo'
      case 'contacted': return 'Contactado'
      case 'interested': return 'Interesado'
      case 'qualified': return 'Cualificado'
      case 'converted': return 'Convertido'
      case 'lost': return 'Perdido'
      default: return status
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta'
      case 'medium': return 'Media'
      case 'low': return 'Baja'
      default: return priority
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <AlertCircle className="w-4 h-4" />
      case 'contacted': return <Phone className="w-4 h-4" />
      case 'interested': return <Star className="w-4 h-4" />
      case 'qualified': return <CheckCircle className="w-4 h-4" />
      case 'converted': return <CheckCircle className="w-4 h-4" />
      case 'lost': return <XCircle className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  const updateLeadStatus = (leadId: string, newStatus: string) => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId 
        ? { ...lead, status: newStatus as any, last_contact: new Date().toISOString() }
        : lead
    ))
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Leads</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
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
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Leads</h2>
          <p className="text-gray-600 mt-1">
            Administra y sigue el progreso de tus leads
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-blue-600" />
          <span className="text-lg font-semibold text-gray-900">{leads.length}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <AlertCircle className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Nuevos</p>
              <p className="text-2xl font-bold text-gray-900">
                {leads.filter(l => l.status === 'new').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Phone className="w-8 h-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Contactados</p>
              <p className="text-2xl font-bold text-gray-900">
                {leads.filter(l => l.status === 'contacted').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Star className="w-8 h-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Interesados</p>
              <p className="text-2xl font-bold text-gray-900">
                {leads.filter(l => l.status === 'interested').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Cualificados</p>
              <p className="text-2xl font-bold text-gray-900">
                {leads.filter(l => l.status === 'qualified').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Convertidos</p>
              <p className="text-2xl font-bold text-gray-900">
                {leads.filter(l => l.status === 'converted').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <XCircle className="w-8 h-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Perdidos</p>
              <p className="text-2xl font-bold text-gray-900">
                {leads.filter(l => l.status === 'lost').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
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
                <option value="all">Todos los Estados</option>
                <option value="new">Nuevos</option>
                <option value="contacted">Contactados</option>
                <option value="interested">Interesados</option>
                <option value="qualified">Cualificados</option>
                <option value="converted">Convertidos</option>
                <option value="lost">Perdidos</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todas las Prioridades</option>
                <option value="high">Alta</option>
                <option value="medium">Media</option>
                <option value="low">Baja</option>
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

      {/* Leads List */}
      {filteredLeads.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay leads</h3>
          <p className="text-gray-500 mb-6">
            {filter === 'all' 
              ? "Aún no tienes leads registrados."
              : `No tienes leads con estado "${getStatusText(filter)}"`
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLeads.map((lead) => (
            <div key={lead.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{lead.name}</h3>
                  <p className="text-sm text-gray-600">{lead.email}</p>
                  {lead.phone && (
                    <p className="text-sm text-gray-600">{lead.phone}</p>
                  )}
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                    {getStatusText(lead.status)}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(lead.priority)}`}>
                    {getPriorityText(lead.priority)}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Propiedad:</p>
                <p className="text-sm text-gray-600">{lead.propertyTitle}</p>
              </div>

              {lead.notes && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">Notas:</p>
                  <p className="text-sm text-gray-600">{lead.notes}</p>
                </div>
              )}

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Score:</span>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        lead.score >= 80 ? 'bg-green-500' : 
                        lead.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${lead.score}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{lead.score}</span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(lead.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  {lead.status !== 'converted' && lead.status !== 'lost' && (
                    <button
                      onClick={() => updateLeadStatus(lead.id, 'contacted')}
                      className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
                    >
                      Contactar
                    </button>
                  )}
                  {lead.status === 'contacted' && (
                    <button
                      onClick={() => updateLeadStatus(lead.id, 'interested')}
                      className="px-3 py-1 text-xs bg-orange-100 text-orange-800 rounded hover:bg-orange-200 transition-colors"
                    >
                      Interesado
                    </button>
                  )}
                  {lead.status === 'interested' && (
                    <button
                      onClick={() => updateLeadStatus(lead.id, 'qualified')}
                      className="px-3 py-1 text-xs bg-purple-100 text-purple-800 rounded hover:bg-purple-200 transition-colors"
                    >
                      Cualificar
                    </button>
                  )}
                </div>
                <button
                  onClick={() => setSelectedLead(lead)}
                  className="px-3 py-1 text-xs bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition-colors"
                >
                  Ver Detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Detalles del Lead</h3>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Información Personal</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Nombre</p>
                      <p className="font-medium">{selectedLead.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{selectedLead.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Teléfono</p>
                      <p className="font-medium">{selectedLead.phone || 'No especificado'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Fuente</p>
                      <p className="font-medium capitalize">{selectedLead.source}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Propiedad de Interés</h4>
                  <p className="text-gray-700">{selectedLead.propertyTitle}</p>
                </div>

                {selectedLead.notes && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Notas</h4>
                    <p className="text-gray-700">{selectedLead.notes}</p>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Historial</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Creado: {new Date(selectedLead.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Último contacto: {new Date(selectedLead.last_contact).toLocaleString()}
                      </span>
                    </div>
                    {selectedLead.next_followup && (
                      <div className="flex items-center space-x-2">
                        <MessageCircle className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          Próximo seguimiento: {new Date(selectedLead.next_followup).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

