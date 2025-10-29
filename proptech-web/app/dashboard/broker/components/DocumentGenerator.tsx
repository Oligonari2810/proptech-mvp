'use client'

import { useState, useEffect } from 'react'
import { 
  FileText, 
  Download, 
  Mail, 
  Plus,
  Edit,
  Trash2,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface DocumentTemplate {
  id: string
  name: string
  type: 'contract' | 'proposal' | 'reservation' | 'invoice' | 'report'
  description: string
  variables: string[]
  is_active: boolean
  created_at: string
  usage_count: number
}

interface GeneratedDocument {
  id: string
  template_id: string
  template_name: string
  client_name: string
  property_title: string
  status: 'draft' | 'sent' | 'signed' | 'expired'
  created_at: string
  expires_at?: string
  download_url?: string
}

export function DocumentGenerator() {
  const [templates, setTemplates] = useState<DocumentTemplate[]>([])
  const [documents, setDocuments] = useState<GeneratedDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'templates' | 'documents' | 'generate'>('templates')
  const [showTemplateForm, setShowTemplateForm] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null)

  useEffect(() => {
    const fetchDocumentData = async () => {
      try {
        // Simular datos de templates
        const mockTemplates: DocumentTemplate[] = [
          {
            id: '1',
            name: 'Contrato de Compraventa',
            type: 'contract',
            description: 'Contrato estándar para la compraventa de inmuebles',
            variables: ['client_name', 'client_dni', 'property_address', 'property_price', 'agent_name', 'agency_name', 'signing_date'],
            is_active: true,
            created_at: '2024-01-15T10:00:00Z',
            usage_count: 23
          },
          {
            id: '2',
            name: 'Propuesta Comercial',
            type: 'proposal',
            description: 'Propuesta detallada con condiciones comerciales',
            variables: ['client_name', 'property_title', 'property_price', 'financing_options', 'agent_name', 'validity_days'],
            is_active: true,
            created_at: '2024-01-16T11:00:00Z',
            usage_count: 45
          },
          {
            id: '3',
            name: 'Reserva de Inmueble',
            type: 'reservation',
            description: 'Documento de reserva con condiciones y plazo',
            variables: ['client_name', 'property_address', 'reservation_amount', 'reservation_period', 'agent_name'],
            is_active: true,
            created_at: '2024-01-17T12:00:00Z',
            usage_count: 12
          },
          {
            id: '4',
            name: 'Informe de Valoración',
            type: 'report',
            description: 'Informe técnico de valoración inmobiliaria',
            variables: ['property_address', 'property_type', 'property_area', 'market_value', 'appraiser_name', 'valuation_date'],
            is_active: true,
            created_at: '2024-01-18T13:00:00Z',
            usage_count: 8
          }
        ]

        // Simular documentos generados
        const mockDocuments: GeneratedDocument[] = [
          {
            id: '1',
            template_id: '1',
            template_name: 'Contrato de Compraventa',
            client_name: 'María García',
            property_title: 'Apartamento en Madrid Centro',
            status: 'sent',
            created_at: '2024-01-20T10:30:00Z',
            expires_at: '2024-01-27T10:30:00Z',
            download_url: '/documents/contract_1.pdf'
          },
          {
            id: '2',
            template_id: '2',
            template_name: 'Propuesta Comercial',
            client_name: 'Carlos López',
            property_title: 'Casa con jardín en las afueras',
            status: 'draft',
            created_at: '2024-01-20T14:15:00Z'
          },
          {
            id: '3',
            template_id: '3',
            template_name: 'Reserva de Inmueble',
            client_name: 'Ana Martínez',
            property_title: 'Loft industrial renovado',
            status: 'signed',
            created_at: '2024-01-19T16:45:00Z',
            download_url: '/documents/reservation_3.pdf'
          },
          {
            id: '4',
            template_id: '4',
            template_name: 'Informe de Valoración',
            client_name: 'David Ruiz',
            property_title: 'Piso en zona residencial',
            status: 'expired',
            created_at: '2024-01-15T09:20:00Z',
            expires_at: '2024-01-22T09:20:00Z'
          }
        ]

        setTemplates(mockTemplates)
        setDocuments(mockDocuments)
      } catch (error) {
        console.error('Error fetching document data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDocumentData()
  }, [])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'contract': return <FileText className="w-5 h-5" />
      case 'proposal': return <Mail className="w-5 h-5" />
      case 'reservation': return <CheckCircle className="w-5 h-5" />
      case 'invoice': return <FileText className="w-5 h-5" />
      case 'report': return <FileText className="w-5 h-5" />
      default: return <FileText className="w-5 h-5" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'contract': return 'bg-blue-100 text-blue-800'
      case 'proposal': return 'bg-green-100 text-green-800'
      case 'reservation': return 'bg-yellow-100 text-yellow-800'
      case 'invoice': return 'bg-purple-100 text-purple-800'
      case 'report': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Edit className="w-4 h-4" />
      case 'sent': return <Mail className="w-4 h-4" />
      case 'signed': return <CheckCircle className="w-4 h-4" />
      case 'expired': return <AlertCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'sent': return 'bg-blue-100 text-blue-800'
      case 'signed': return 'bg-green-100 text-green-800'
      case 'expired': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'Borrador'
      case 'sent': return 'Enviado'
      case 'signed': return 'Firmado'
      case 'expired': return 'Expirado'
      default: return status
    }
  }

  const generateDocument = (templateId: string) => {
    setSelectedTemplate(templates.find(t => t.id === templateId) || null)
    setActiveTab('generate')
  }

  const downloadDocument = (documentId: string) => {
    // Simular descarga
    console.log(`Descargando documento ${documentId}`)
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
          <h2 className="text-2xl font-bold text-gray-900">Generador de Documentos</h2>
          <p className="text-gray-600 mt-1">
            Crea y gestiona documentos profesionales automáticamente
          </p>
        </div>
        <button
          onClick={() => setShowTemplateForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Template</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Templates</p>
              <p className="text-2xl font-bold text-gray-900">{templates.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Download className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Documentos Generados</p>
              <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Firmados</p>
              <p className="text-2xl font-bold text-gray-900">
                {documents.filter(d => d.status === 'signed').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Pendientes</p>
              <p className="text-2xl font-bold text-gray-900">
                {documents.filter(d => d.status === 'sent').length}
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
              onClick={() => setActiveTab('templates')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'templates'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Templates
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
              onClick={() => setActiveTab('generate')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'generate'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Generar
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Templates Tab */}
          {activeTab === 'templates' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {templates.map((template) => (
                <div key={template.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getTypeColor(template.type)}`}>
                        {getTypeIcon(template.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{template.name}</h3>
                        <span className="text-xs text-gray-500 capitalize">{template.type}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => generateDocument(template.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        title="Generar documento"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-gray-600"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                  
                  <div className="space-y-2">
                    <div className="text-xs text-gray-500">
                      <strong>Variables:</strong> {template.variables.join(', ')}
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Usado {template.usage_count} veces</span>
                      <span>Creado: {new Date(template.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              {documents.map((document) => (
                <div key={document.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{document.template_name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(document.status)}`}>
                          {getStatusIcon(document.status)}
                          <span className="ml-1">{getStatusText(document.status)}</span>
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-2">
                        <strong>Cliente:</strong> {document.client_name} | <strong>Propiedad:</strong> {document.property_title}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Creado: {new Date(document.created_at).toLocaleString()}</span>
                        {document.expires_at && (
                          <span>Expira: {new Date(document.expires_at).toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        className="p-2 text-gray-400 hover:text-gray-600"
                        title="Ver documento"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {document.download_url && (
                        <button
                          onClick={() => downloadDocument(document.id)}
                          className="p-2 text-blue-600 hover:text-blue-800"
                          title="Descargar"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        className="p-2 text-red-400 hover:text-red-600"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Generate Tab */}
          {activeTab === 'generate' && (
            <div className="space-y-6">
              {selectedTemplate ? (
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Generar: {selectedTemplate.name}
                    </h3>
                    <p className="text-gray-600">{selectedTemplate.description}</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Completar Variables</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedTemplate.variables.map((variable) => (
                        <div key={variable}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {variable.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder={`Ingresa ${variable.replace('_', ' ')}`}
                          />
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-end space-x-3 mt-6">
                      <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        Cancelar
                      </button>
                      <button className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors">
                        Generar Documento
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Selecciona un Template</h3>
                  <p className="text-gray-600 mb-6">
                    Ve a la pestaña Templates y selecciona un documento para generar
                  </p>
                  <button
                    onClick={() => setActiveTab('templates')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Ver Templates
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

