'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { confoturProcedures, confoturContact, ConfoturProcedure } from '../../lib/legal/confotur';

export function ConfoturGuide() {
  const [selectedProcedure, setSelectedProcedure] = useState<ConfoturProcedure | null>(null);

  const categoryLabels: Record<string, string> = {
    aprobacion: 'Aprobación de Proyecto',
    beneficios: 'Beneficios Fiscales',
    extension: 'Extensión de Beneficios',
    modificacion: 'Modificación de Proyecto'
  };

  const categoryIcons: Record<string, string> = {
    aprobacion: '✅',
    beneficios: '💰',
    extension: '🔄',
    modificacion: '📝'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-5xl">🏖️</span>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Guía CONFOTUR
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Consejo Nacional de Fomento del Turismo
            </p>
          </div>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Todo lo que necesitas saber sobre trámites y beneficios para inversiones 
          inmobiliarias turísticas en República Dominicana
        </p>
      </div>

      {/* Información de Contacto */}
      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200 mb-8">
        <h2 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
          📞 Información de Contacto CONFOTUR
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-semibold text-gray-700">Dirección:</span>
            <p className="text-gray-600">{confoturContact.direccion}</p>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Teléfono:</span>
            <p className="text-gray-600">{confoturContact.telefono}</p>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Email:</span>
            <p className="text-gray-600">{confoturContact.email}</p>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Horario:</span>
            <p className="text-gray-600">{confoturContact.horario}</p>
          </div>
          <div className="md:col-span-2">
            <span className="font-semibold text-gray-700">Página Web:</span>
            <a 
              href={confoturContact.paginaWeb}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline ml-2"
            >
              {confoturContact.paginaWeb}
            </a>
          </div>
        </div>
      </div>

      {/* Lista de Trámites */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Trámites Disponibles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {confoturProcedures.map((procedure) => (
            <div
              key={procedure.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 p-6 cursor-pointer"
              onClick={() => setSelectedProcedure(procedure)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{categoryIcons[procedure.categoria] || '📋'}</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
                    {categoryLabels[procedure.categoria] || procedure.categoria}
                  </span>
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {procedure.nombre}
              </h3>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {procedure.descripcion}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
                <span>⏱️ {procedure.tiempoEstimado}</span>
                <span>💰 RD$ {procedure.costoEstimado.toLocaleString('es-DO')}</span>
              </div>

              <button className="mt-4 w-full text-blue-600 hover:text-blue-800 text-sm font-semibold">
                Ver detalles →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal/Detalle de Trámite */}
      {selectedProcedure && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedProcedure.nombre}
              </h2>
              <button
                onClick={() => setSelectedProcedure(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <p className="text-gray-700 mb-6">
              {selectedProcedure.descripcion}
            </p>

            {/* Información General */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded">
                <span className="text-sm text-gray-600">Tiempo Estimado</span>
                <p className="font-semibold">{selectedProcedure.tiempoEstimado}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <span className="text-sm text-gray-600">Costo Estimado</span>
                <p className="font-semibold">RD$ {selectedProcedure.costoEstimado.toLocaleString('es-DO')}</p>
              </div>
            </div>

            {/* Requisitos */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">📋 Requisitos</h3>
              <ul className="space-y-2">
                {selectedProcedure.requisitos.map((req, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Documentos */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">📄 Documentos Necesarios</h3>
              <ul className="space-y-2">
                {selectedProcedure.documentos.map((doc, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span className="text-gray-700">{doc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pasos */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">📍 Pasos del Proceso</h3>
              <div className="space-y-4">
                {selectedProcedure.pasos.map((step) => (
                  <div key={step.numero} className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 rounded-r">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-blue-700">Paso {step.numero}</span>
                      <h4 className="font-semibold text-gray-800">{step.titulo}</h4>
                    </div>
                    <p className="text-gray-700 text-sm mb-2">{step.descripcion}</p>
                    {step.dondeIr && (
                      <p className="text-sm text-gray-600">📍 {step.dondeIr}</p>
                    )}
                    {step.tiempoEstimado && (
                      <p className="text-sm text-gray-600">⏱️ Tiempo: {step.tiempoEstimado}</p>
                    )}
                    {step.costo && (
                      <p className="text-sm text-gray-600">💰 Costo: RD$ {step.costo.toLocaleString('es-DO')}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Beneficios */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">🎁 Beneficios</h3>
              <div className="bg-green-50 border border-green-200 rounded p-4">
                <ul className="space-y-2">
                  {selectedProcedure.beneficios.map((beneficio, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span className="text-gray-700">{beneficio}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Contacto */}
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">📞 Contacto</h3>
              <p className="text-sm text-yellow-700">
                Para más información, contacta directamente a CONFOTUR: {confoturContact.telefono} o {confoturContact.email}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-orange-50 rounded-lg p-6 border border-orange-200 mt-8">
        <div className="flex items-start">
          <span className="text-orange-600 text-2xl mr-3">⚠️</span>
          <div>
            <h3 className="font-semibold text-orange-800 mb-2">
              Aviso Importante
            </h3>
            <p className="text-sm text-orange-700">
              Esta información es de carácter educativo e informativo. Los trámites y requisitos pueden cambiar.
              Para información actualizada y específica sobre tu proyecto, contacta directamente a CONFOTUR 
              o consulta con un abogado especializado en derecho turístico e inmobiliario.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

