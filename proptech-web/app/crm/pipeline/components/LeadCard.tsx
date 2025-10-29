'use client'

import { useState } from 'react'
import { 
  Phone, 
  Mail, 
  Calendar, 
  Star, 
  MessageCircle,
  MoreVertical,
  Edit,
  Trash2,
  Eye
} from 'lucide-react'

interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  propertyId: string
  propertyTitle: string
  stage: string
  priority: 'low' | 'medium' | 'high'
  source: string
  notes?: string
  created_at: string
  last_contact: string
  next_followup?: string
  score: number
  estimated_value: number
}

interface LeadCardProps {
  lead: Lead
  onDragStart: (e: React.DragEvent, lead: Lead) => void
}

export function LeadCard({ lead, onDragStart }: LeadCardProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

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

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M€`
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K€`
    }
    return `${value}€`
  }

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, lead)}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-move hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-sm text-gray-900 truncate">{lead.name}</h4>
          <p className="text-xs text-gray-600 truncate">{lead.email}</p>
        </div>
        <div className="flex items-center space-x-1">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(lead.priority)}`}>
            {getPriorityText(lead.priority)}
          </span>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <MoreVertical className="w-3 h-3 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Property Info */}
      <div className="mb-3">
        <p className="text-xs font-medium text-gray-700 mb-1">Propiedad:</p>
        <p className="text-xs text-gray-600 line-clamp-2">{lead.propertyTitle}</p>
      </div>

      {/* Value and Score */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-bold text-gray-900">{formatValue(lead.estimated_value)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">Score:</span>
          <div className="w-12 bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${getScoreColor(lead.score)}`}
              style={{ width: `${lead.score}%` }}
            ></div>
          </div>
          <span className="text-xs font-medium text-gray-700">{lead.score}</span>
        </div>
      </div>

      {/* Contact Info */}
      <div className="flex items-center space-x-3 mb-3">
        {lead.phone && (
          <div className="flex items-center space-x-1">
            <Phone className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-600">{lead.phone}</span>
          </div>
        )}
        <div className="flex items-center space-x-1">
          <Calendar className="w-3 h-3 text-gray-400" />
          <span className="text-xs text-gray-600">
            {new Date(lead.last_contact).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Notes Preview */}
      {lead.notes && (
        <div className="mb-3">
          <div className="flex items-center space-x-1 mb-1">
            <MessageCircle className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-500">Notas:</span>
          </div>
          <p className="text-xs text-gray-600 line-clamp-2">{lead.notes}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800"
          >
            <Eye className="w-3 h-3" />
            <span>{showDetails ? 'Ocultar' : 'Ver'}</span>
          </button>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-xs text-gray-500 capitalize">{lead.source}</span>
        </div>
      </div>

      {/* Expanded Details */}
      {showDetails && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Creado:</span>
              <span className="text-gray-700">{new Date(lead.created_at).toLocaleString()}</span>
            </div>
            {lead.next_followup && (
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Próximo seguimiento:</span>
                <span className="text-gray-700">{new Date(lead.next_followup).toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">ID Propiedad:</span>
              <span className="text-gray-700">{lead.propertyId}</span>
            </div>
          </div>
        </div>
      )}

      {/* Context Menu */}
      {showMenu && (
        <div className="absolute right-2 top-2 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
          <button className="flex items-center space-x-2 w-full px-3 py-2 text-xs text-gray-700 hover:bg-gray-100">
            <Edit className="w-3 h-3" />
            <span>Editar</span>
          </button>
          <button className="flex items-center space-x-2 w-full px-3 py-2 text-xs text-gray-700 hover:bg-gray-100">
            <Phone className="w-3 h-3" />
            <span>Llamar</span>
          </button>
          <button className="flex items-center space-x-2 w-full px-3 py-2 text-xs text-gray-700 hover:bg-gray-100">
            <Mail className="w-3 h-3" />
            <span>Email</span>
          </button>
          <hr className="my-1" />
          <button className="flex items-center space-x-2 w-full px-3 py-2 text-xs text-red-600 hover:bg-red-50">
            <Trash2 className="w-3 h-3" />
            <span>Eliminar</span>
          </button>
        </div>
      )}
    </div>
  )
}

