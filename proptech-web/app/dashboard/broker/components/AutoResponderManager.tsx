'use client'

import { useState, useEffect } from 'react'
import { 
  Mail, 
  MessageCircle, 
  Phone, 
  Clock, 
  Settings,
  Plus,
  Edit,
  Trash2,
  Play,
  Pause
} from 'lucide-react'

interface AutoResponderTemplate {
  id: string
  name: string
  type: 'email' | 'whatsapp' | 'sms'
  trigger: 'new_lead' | 'follow_up' | 'reminder' | 'conversion'
  subject?: string
  content: string
  variables: string[]
  is_active: boolean
  created_at: string
}

interface AutoResponderRule {
  id: string
  name: string
  trigger_event: string
  delay_minutes: number
  template_id: string
  conditions: {
    lead_source?: string[]
    property_type?: string[]
    priority?: string[]
  }
  is_active: boolean
}

export function AutoResponderManager() {
  const [templates, setTemplates] = useState<AutoResponderTemplate[]>([])
  const [rules, setRules] = useState<AutoResponderRule[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'templates' | 'rules' | 'analytics'>('templates')
  const [showTemplateForm, setShowTemplateForm] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<AutoResponderTemplate | null>(null)

  useEffect(() => {
    const fetchAutoResponderData = async () => {
      try {
        // Simular datos de templates y reglas
        const mockTemplates: AutoResponderTemplate[] = [
          {
            id: '1',
            name: 'Bienvenida Nuevo Lead',
            type: 'email',
            trigger: 'new_lead',
            subject: '¡Gracias por tu interés en {{property_title}}!',
            content: `Hola {{client_name}},

Gracias por tu interés en la propiedad "{{property_title}}" ubicada en {{property_location}}.

Como tu agente inmobiliario, me pondré en contacto contigo en las próximas 24 horas para:
• Programar una visita personalizada
• Responder todas tus preguntas
• Proporcionarte información adicional

Mientras tanto, puedes explorar más propiedades en nuestro sitio web.

¡Espero conocerte pronto!

{{agent_name}}
{{agent_phone}}`,
            variables: ['client_name', 'property_title', 'property_location', 'agent_name', 'agent_phone'],
            is_active: true,
            created_at: '2024-01-20T10:00:00Z'
          },
          {
            id: '2',
            name: 'Recordatorio WhatsApp',
            type: 'whatsapp',
            trigger: 'reminder',
            content: `Hola {{client_name}} 👋

Te escribo para recordarte sobre la visita programada para mañana a las {{appointment_time}} en {{property_title}}.

¿Confirmas que puedes asistir? Si necesitas cambiar la hora, avísame.

¡Nos vemos pronto! 🏠

{{agent_name}}`,
            variables: ['client_name', 'appointment_time', 'property_title', 'agent_name'],
            is_active: true,
            created_at: '2024-01-20T11:00:00Z'
          },
          {
            id: '3',
            name: 'Seguimiento Post-Visita',
            type: 'email',
            trigger: 'follow_up',
            subject: '¿Qué te pareció {{property_title}}?',
            content: `Hola {{client_name}},

Espero que hayas disfrutado la visita a {{property_title}} ayer.

Me gustaría saber:
• ¿Qué te pareció la propiedad?
• ¿Tienes alguna pregunta adicional?
• ¿Te interesa hacer una oferta?

Estoy aquí para ayudarte en todo el proceso. No dudes en contactarme.

{{agent_name}}
{{agent_email}}`,
            variables: ['client_name', 'property_title', 'agent_name', 'agent_email'],
            is_active: true,
            created_at: '2024-01-20T12:00:00Z'
          }
        ]

        const mockRules: AutoResponderRule[] = [
          {
            id: '1',
            name: 'Respuesta Inmediata Nuevos Leads',
            trigger_event: 'new_lead',
            delay_minutes: 5,
            template_id: '1',
            conditions: {
              lead_source: ['website', 'social'],
              priority: ['high', 'medium']
            },
            is_active: true
          },
          {
            id: '2',
            name: 'Recordatorio WhatsApp Visitas',
            trigger_event: 'appointment_scheduled',
            delay_minutes: 1440, // 24 horas
            template_id: '2',
            conditions: {
              property_type: ['apartment', 'house']
            },
            is_active: true
          },
          {
            id: '3',
            name: 'Seguimiento Post-Visita',
            trigger_event: 'property_viewed',
            delay_minutes: 60,
            template_id: '3',
            conditions: {},
            is_active: true
          }
        ]

        setTemplates(mockTemplates)
        setRules(mockRules)
      } catch (error) {
        console.error('Error fetching auto-responder data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAutoResponderData()
  }, [])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4" />
      case 'whatsapp': return <MessageCircle className="w-4 h-4" />
      case 'sms': return <Phone className="w-4 h-4" />
      default: return <Mail className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'email': return 'bg-blue-100 text-blue-800'
      case 'whatsapp': return 'bg-green-100 text-green-800'
      case 'sms': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const toggleTemplateStatus = (templateId: string) => {
    setTemplates(prev => prev.map(t => 
      t.id === templateId ? { ...t, is_active: !t.is_active } : t
    ))
  }

  const toggleRuleStatus = (ruleId: string) => {
    setRules(prev => prev.map(r => 
      r.id === ruleId ? { ...r, is_active: !r.is_active } : r
    ))
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
          <h2 className="text-2xl font-bold text-gray-900">Auto-Responder</h2>
          <p className="text-gray-600 mt-1">
            Automatiza la comunicación con tus leads
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
            <Mail className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Templates Activos</p>
              <p className="text-2xl font-bold text-gray-900">
                {templates.filter(t => t.is_active).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Play className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Reglas Activas</p>
              <p className="text-2xl font-bold text-gray-900">
                {rules.filter(r => r.is_active).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Enviados Hoy</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Settings className="w-8 h-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Tasa Respuesta</p>
              <p className="text-2xl font-bold text-gray-900">78%</p>
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
              onClick={() => setActiveTab('rules')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'rules'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Reglas Automáticas
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Analytics
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Templates Tab */}
          {activeTab === 'templates' && (
            <div className="space-y-4">
              {templates.map((template) => (
                <div key={template.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{template.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(template.type)}`}>
                          {getTypeIcon(template.type)}
                          <span className="ml-1 capitalize">{template.type}</span>
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {template.trigger.replace('_', ' ')}
                        </span>
                      </div>
                      
                      {template.subject && (
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Asunto:</strong> {template.subject}
                        </p>
                      )}
                      
                      <div className="bg-white rounded p-3 mb-3">
                        <p className="text-sm text-gray-700 whitespace-pre-line">
                          {template.content}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Variables: {template.variables.join(', ')}</span>
                        <span>Creado: {new Date(template.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => setEditingTemplate(template)}
                        className="p-2 text-gray-400 hover:text-gray-600"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleTemplateStatus(template.id)}
                        className={`p-2 ${template.is_active ? 'text-green-600' : 'text-gray-400'}`}
                        title={template.is_active ? 'Desactivar' : 'Activar'}
                      >
                        {template.is_active ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                      </button>
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

          {/* Rules Tab */}
          {activeTab === 'rules' && (
            <div className="space-y-4">
              {rules.map((rule) => (
                <div key={rule.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{rule.name}</h3>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {rule.trigger_event.replace('_', ' ')}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {rule.delay_minutes} min
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-2">
                        <strong>Template:</strong> {templates.find(t => t.id === rule.template_id)?.name}
                      </div>
                      
                      {Object.keys(rule.conditions).length > 0 && (
                        <div className="text-sm text-gray-600">
                          <strong>Condiciones:</strong>
                          <ul className="list-disc list-inside ml-4">
                            {Object.entries(rule.conditions).map(([key, value]) => (
                              <li key={key}>
                                {key}: {Array.isArray(value) ? value.join(', ') : value}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => toggleRuleStatus(rule.id)}
                        className={`p-2 ${rule.is_active ? 'text-green-600' : 'text-gray-400'}`}
                        title={rule.is_active ? 'Desactivar' : 'Activar'}
                      >
                        {rule.is_active ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                      </button>
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

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Envíos por Tipo</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Email</span>
                      <span className="text-sm font-medium">156</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">WhatsApp</span>
                      <span className="text-sm font-medium">89</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">SMS</span>
                      <span className="text-sm font-medium">23</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Tasa de Respuesta</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Email</span>
                      <span className="text-sm font-medium">78%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">WhatsApp</span>
                      <span className="text-sm font-medium">92%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">SMS</span>
                      <span className="text-sm font-medium">65%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Bienvenida enviada a María García</span>
                    <span className="text-gray-500">hace 5 min</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Recordatorio WhatsApp a Carlos López</span>
                    <span className="text-gray-500">hace 1 hora</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Seguimiento post-visita a Ana Martínez</span>
                    <span className="text-gray-500">hace 2 horas</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

