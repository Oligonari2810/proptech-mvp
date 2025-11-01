'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Process, dominicanProcesses } from '../../lib/legal/processes';
import { ProcessStep } from './ProcessStep';
import { RequiredDocuments } from './RequiredDocuments';

export function ProcessWizardRD() {
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const categoryLabels: Record<string, string> = {
    compra: 'Compra',
    venta: 'Venta',
    construccion: 'Construcción',
    registro: 'Registro',
    extranjeros: 'Extranjeros',
    inversion: 'Inversión'
  };

  const categoryIcons: Record<string, string> = {
    compra: '📦',
    venta: '💵',
    construccion: '🏗️',
    registro: '📝',
    extranjeros: '🌎',
    inversion: '💹'
  };

  const handleStepComplete = (stepNumber: number) => {
    const newCompleted = new Set(completedSteps);
    newCompleted.add(stepNumber);
    setCompletedSteps(newCompleted);
    
    // Avanzar al siguiente paso si no está completado
    if (selectedProcess && currentStep < selectedProcess.pasos.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNextStep = () => {
    if (selectedProcess && currentStep < selectedProcess.pasos.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const progressPercentage = selectedProcess 
    ? (completedSteps.size / selectedProcess.pasos.length) * 100 
    : 0;

  if (!selectedProcess) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🧭 Guía de Trámites Inmobiliarios RD
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Asistente paso a paso para realizar trámites inmobiliarios en República Dominicana
          </p>
        </div>

        {/* Lista de Trámites */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dominicanProcesses.map((process) => (
            <div
              key={process.id}
              onClick={() => setSelectedProcess(process)}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 p-6 cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{categoryIcons[process.categoria] || '📋'}</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
                  {categoryLabels[process.categoria] || process.categoria}
                </span>
              </div>

              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {process.nombre}
              </h3>

              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {process.descripcion}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
                <span>⏱️ {process.duracion}</span>
                <span>💰 {process.costoEstimado}</span>
              </div>

              <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                <span>{process.pasos.length} pasos</span>
                <span>•</span>
                <span>{process.documentosRequeridos.length} documentos</span>
              </div>

              <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold text-sm transition-colors">
                Iniciar Guía →
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header con navegación */}
      <div className="mb-6">
        <button
          onClick={() => {
            setSelectedProcess(null);
            setCurrentStep(0);
            setCompletedSteps(new Set());
          }}
          className="text-blue-600 hover:text-blue-800 text-sm font-semibold mb-4 inline-flex items-center gap-1"
        >
          ← Volver a lista de trámites
        </button>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {selectedProcess.nombre}
            </h1>
            <p className="text-gray-600">
              {selectedProcess.descripcion}
            </p>
          </div>
        </div>

        {/* Barra de Progreso */}
        <div className="bg-gray-200 rounded-full h-3 mb-2">
          <div
            className="bg-green-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-sm text-gray-600 mb-6">
          <span>
            Paso {currentStep + 1} de {selectedProcess.pasos.length}
          </span>
          <span>
            {completedSteps.size} de {selectedProcess.pasos.length} completados
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Paso Actual */}
        <div className="lg:col-span-2">
          <ProcessStep
            step={selectedProcess.pasos[currentStep]}
            isActive={true}
            isCompleted={completedSteps.has(currentStep)}
            onComplete={() => handleStepComplete(currentStep)}
          />

          {/* Navegación entre pasos */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={handlePreviousStep}
              disabled={currentStep === 0}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                currentStep === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-600 hover:bg-gray-700 text-white'
              }`}
            >
              ← Anterior
            </button>

            <div className="flex gap-2">
              {selectedProcess.pasos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    completedSteps.has(index)
                      ? 'bg-green-500'
                      : index === currentStep
                      ? 'bg-blue-500'
                      : 'bg-gray-300'
                  }`}
                  aria-label={`Paso ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNextStep}
              disabled={currentStep === selectedProcess.pasos.length - 1}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                currentStep === selectedProcess.pasos.length - 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Siguiente →
            </button>
          </div>
        </div>

        {/* Sidebar: Documentos y Info */}
        <div className="space-y-6">
          {/* Documentos Requeridos */}
          <RequiredDocuments documents={selectedProcess.documentosRequeridos} />

          {/* Estimación de Costos */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              💰 Estimación de Costos
            </h3>
            <div className="space-y-2">
              {selectedProcess.estimacionCostos.map((cost, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-3 py-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-800">{cost.concepto}</span>
                    <span className="text-gray-600">{cost.rango}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{cost.cuando}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Total estimado:</strong> {selectedProcess.costoEstimado}
              </p>
            </div>
          </div>

          {/* FAQ */}
          {selectedProcess.frecuentes && selectedProcess.frecuentes.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                ❓ Preguntas Frecuentes
              </h3>
              <div className="space-y-4">
                {selectedProcess.frecuentes.slice(0, 3).map((faq, index) => (
                  <div key={index}>
                    <h4 className="font-semibold text-gray-800 text-sm mb-1">
                      {faq.pregunta}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {faq.respuesta}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          {selectedProcess.tips && selectedProcess.tips.length > 0 && (
            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
                💡 Tips Útiles
              </h3>
              <ul className="space-y-2">
                {selectedProcess.tips.slice(0, 3).map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-green-700">
                    <span className="text-green-600 mt-1">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

