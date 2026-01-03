'use client'

import { useState } from 'react'
import { StageColumn } from './StageColumn'

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

interface PipelineBoardProps {
  stages: Stage[]
  leads: Lead[]
  onMoveLead: (leadId: string, newStage: string) => void
}

export function PipelineBoard({ stages, leads, onMoveLead }: PipelineBoardProps) {
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null)

  const handleDragStart = (e: React.DragEvent, lead: Lead) => {
    setDraggedLead(lead)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, stageId: string) => {
    e.preventDefault()
    if (draggedLead && draggedLead.stage !== stageId) {
      onMoveLead(draggedLead.id, stageId)
    }
    setDraggedLead(null)
  }

  const getLeadsForStage = (stageId: string) => {
    return leads.filter(lead => lead.stage === stageId)
  }

  const getStageValue = (stageId: string) => {
    const stageLeads = getLeadsForStage(stageId)
    return stageLeads.reduce((sum, lead) => sum + lead.estimated_value, 0)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Pipeline de Ventas</h2>
        <div className="text-sm text-gray-500">
          Arrastra los leads entre etapas para actualizar su estado
        </div>
      </div>

      <div className="flex space-x-4 overflow-x-auto pb-4">
        {stages.map((stage) => (
          <StageColumn
            key={stage.id}
            stage={stage}
            leads={getLeadsForStage(stage.id)}
            totalValue={getStageValue(stage.id)}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
        ))}
      </div>

      {/* Pipeline Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">Total Pipeline</p>
            <p className="text-2xl font-bold text-gray-900">
              {leads.reduce((sum, lead) => sum + lead.estimated_value, 0).toLocaleString()}€
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">Leads Activos</p>
            <p className="text-2xl font-bold text-gray-900">
              {leads.filter(l => !l.stage.includes('closed')).length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">Valor Ganado</p>
            <p className="text-2xl font-bold text-green-600">
              {leads.filter(l => l.stage === 'closed-won').reduce((sum, lead) => sum + lead.estimated_value, 0).toLocaleString()}€
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

