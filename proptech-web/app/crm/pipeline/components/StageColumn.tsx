'use client'

import { useState } from 'react'
import { LeadCard } from './LeadCard'
import { 
  Users, 
  DollarSign, 
  Plus,
  MoreHorizontal
} from 'lucide-react'

interface Stage {
  id: string
  name: string
  color: string
}

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

interface StageColumnProps {
  stage: Stage
  leads: Lead[]
  totalValue: number
  onDragStart: (e: React.DragEvent, lead: Lead) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent, stageId: string) => void
}

export function StageColumn({ 
  stage, 
  leads, 
  totalValue, 
  onDragStart, 
  onDragOver, 
  onDrop 
}: StageColumnProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200',
      yellow: 'bg-yellow-50 border-yellow-200',
      orange: 'bg-orange-50 border-orange-200',
      purple: 'bg-purple-50 border-purple-200',
      indigo: 'bg-indigo-50 border-indigo-200',
      green: 'bg-green-50 border-green-200',
      red: 'bg-red-50 border-red-200'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  const getHeaderColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      orange: 'bg-orange-100 text-orange-800',
      purple: 'bg-purple-100 text-purple-800',
      indigo: 'bg-indigo-100 text-indigo-800',
      green: 'bg-green-100 text-green-800',
      red: 'bg-red-100 text-red-800'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <div 
      className={`min-w-80 rounded-lg border-2 border-dashed ${getColorClasses(stage.color)}`}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, stage.id)}
    >
      {/* Column Header */}
      <div className={`p-4 rounded-t-lg ${getHeaderColorClasses(stage.color)}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm">{stage.name}</h3>
            <div className="flex items-center space-x-4 mt-1">
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span className="text-xs font-medium">{leads.length}</span>
              </div>
              <div className="flex items-center space-x-1">
                <DollarSign className="w-4 h-4" />
                <span className="text-xs font-medium">
                  {totalValue.toLocaleString()}€
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-white hover:bg-opacity-50 rounded"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Leads List */}
      <div className="p-4 space-y-3 min-h-96">
        {isExpanded ? (
          leads.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">
                <Users className="w-8 h-8 mx-auto" />
              </div>
              <p className="text-sm text-gray-500">No hay leads en esta etapa</p>
              <button className="mt-2 text-xs text-blue-600 hover:text-blue-800">
                <Plus className="w-3 h-3 inline mr-1" />
                Agregar Lead
              </button>
            </div>
          ) : (
            leads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onDragStart={onDragStart}
              />
            ))
          )
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">
              {leads.length} lead{leads.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>

      {/* Column Footer */}
      <div className="px-4 py-2 border-t border-gray-200 bg-white bg-opacity-50">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>Promedio: {leads.length > 0 ? (totalValue / leads.length).toLocaleString() : 0}€</span>
          <span>{leads.length} lead{leads.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>
  )
}

