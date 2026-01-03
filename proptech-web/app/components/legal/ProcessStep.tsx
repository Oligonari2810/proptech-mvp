'use client';

import React from 'react';
import { ProcessStep as ProcessStepType } from '@/app/lib/legal/processes';

interface Props {
  step: ProcessStepType;
  isActive: boolean;
  isCompleted: boolean;
  onComplete?: () => void;
}

export function ProcessStep({ step, isActive, isCompleted, onComplete }: Props) {
  return (
    <div className={`rounded-lg p-6 border-2 transition-all ${
      isActive 
        ? 'border-blue-500 bg-blue-50 shadow-lg' 
        : isCompleted
        ? 'border-green-500 bg-green-50'
        : 'border-gray-200 bg-white'
    }`}>
      {/* Header del Paso */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
            isCompleted
              ? 'bg-green-500 text-white'
              : isActive
              ? 'bg-blue-500 text-white'
              : 'bg-gray-300 text-gray-600'
          }`}>
            {isCompleted ? '✓' : step.numero}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">
              {step.titulo}
            </h3>
            <p className="text-sm text-gray-600">
              {step.institucion}
            </p>
          </div>
        </div>
        
        {!isCompleted && isActive && (
          <button
            onClick={onComplete}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            Marcar como completado
          </button>
        )}
      </div>

      {/* Descripción */}
      <p className="text-gray-700 mb-4">
        {step.descripcion}
      </p>

      {/* Información Detallada */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {step.dondeIr && (
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <span className="text-sm font-semibold text-gray-600 block mb-1">📍 Dónde ir:</span>
            <p className="text-gray-800">{step.dondeIr}</p>
            {step.direccion && (
              <p className="text-sm text-gray-600 mt-1">{step.direccion}</p>
            )}
          </div>
        )}
        
        {step.telefono && (
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <span className="text-sm font-semibold text-gray-600 block mb-1">📞 Teléfono:</span>
            <a href={`tel:${step.telefono}`} className="text-blue-600 hover:text-blue-800">
              {step.telefono}
            </a>
          </div>
        )}

        {step.horario && (
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <span className="text-sm font-semibold text-gray-600 block mb-1">🕐 Horario:</span>
            <p className="text-gray-800">{step.horario}</p>
          </div>
        )}

        {step.tiempoEstimado && (
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <span className="text-sm font-semibold text-gray-600 block mb-1">⏱️ Tiempo:</span>
            <p className="text-gray-800">{step.tiempoEstimado}</p>
          </div>
        )}

        {step.costoEstimado !== undefined && (
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <span className="text-sm font-semibold text-gray-600 block mb-1">💰 Costo:</span>
            <p className="text-gray-800">
              {step.costoEstimado === 0 
                ? 'Según tarifas de la institución'
                : `RD$ ${step.costoEstimado.toLocaleString('es-DO')}`
              }
            </p>
          </div>
        )}

        {step.plazo && (
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <span className="text-sm font-semibold text-gray-600 block mb-1">📅 Plazo:</span>
            <p className="text-gray-800">{step.plazo}</p>
          </div>
        )}
      </div>

      {/* Documentos Necesarios */}
      {step.documentosNecesarios && step.documentosNecesarios.length > 0 && (
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200 mb-4">
          <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
            📄 Documentos Necesarios
          </h4>
          <ul className="space-y-1">
            {step.documentosNecesarios.map((doc, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-yellow-700">
                <span className="text-yellow-600 mt-1">•</span>
                <span>{doc}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Puntos Importantes */}
      {step.importante && step.importante.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
            ⚠️ Importante
          </h4>
          <ul className="space-y-1">
            {step.importante.map((punto, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-blue-700">
                <span className="text-blue-600 mt-1">•</span>
                <span>{punto}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

