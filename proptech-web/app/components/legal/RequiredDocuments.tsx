'use client';

import React, { useState } from 'react';
import { Document } from '@/app/lib/legal/processes';

interface Props {
  documents: Document[];
}

export function RequiredDocuments({ documents }: Props) {
  const [checkedDocs, setCheckedDocs] = useState<Set<number>>(new Set());

  const toggleDoc = (index: number) => {
    const newChecked = new Set(checkedDocs);
    if (newChecked.has(index)) {
      newChecked.delete(index);
    } else {
      newChecked.add(index);
    }
    setCheckedDocs(newChecked);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        📑 Documentos Requeridos
      </h3>
      
      <div className="space-y-3">
        {documents.map((doc, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border-2 transition-all ${
              checkedDocs.has(index)
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={checkedDocs.has(index)}
                onChange={() => toggleDoc(index)}
                className="mt-1 h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-800">
                    {doc.nombre}
                  </h4>
                  {doc.obligatorio && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-semibold">
                      Obligatorio
                    </span>
                  )}
                  {!doc.obligatorio && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
                      Opcional
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {doc.descripcion}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-gray-500">
                  <span>📍 {doc.dondeObtener}</span>
                  {doc.costo > 0 && (
                    <span>💰 RD$ {doc.costo.toLocaleString('es-DO')}</span>
                  )}
                  <span>⏱️ Validez: {doc.validez}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Resumen */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">
            Documentos completados:
          </span>
          <span className="font-bold text-gray-800">
            {checkedDocs.size} de {documents.length}
          </span>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(checkedDocs.size / documents.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

