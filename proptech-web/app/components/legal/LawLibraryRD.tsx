'use client';

import React, { useState } from 'react';
import { dominicanLaws, Law } from '@/app/lib/legal/laws';
import { LawCard } from './LawCard';
import { LawSearch } from './LawSearch';

export function LawLibraryRD() {
  const [filteredLaws, setFilteredLaws] = useState<Law[]>(dominicanLaws);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          📚 Biblioteca de Leyes Inmobiliarias RD
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Consulta todas las leyes y regulaciones aplicables a transacciones 
          inmobiliarias en República Dominicana
        </p>
      </div>

      {/* Búsqueda y Filtros */}
      <LawSearch laws={dominicanLaws} onFilterChange={setFilteredLaws} />

      {/* Estadísticas */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-gray-600">
          Mostrando <strong>{filteredLaws.length}</strong> de <strong>{dominicanLaws.length}</strong> leyes
        </p>
      </div>

      {/* Grid de Leyes */}
      {filteredLaws.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLaws.map((law) => (
            <LawCard key={law.id} law={law} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            No se encontraron leyes
          </h3>
          <p className="text-gray-500">
            Intenta ajustar los filtros de búsqueda
          </p>
        </div>
      )}

      {/* Información Legal */}
      <div className="mt-12 bg-yellow-50 rounded-lg p-6 border border-yellow-200">
        <div className="flex items-start">
          <span className="text-yellow-600 text-2xl mr-3">⚖️</span>
          <div>
            <h3 className="font-semibold text-yellow-800 mb-2">
              Aviso Legal Importante
            </h3>
            <p className="text-sm text-yellow-700">
              Esta información es de carácter educativo e informativo. No constituye asesoría legal profesional.
              Las leyes pueden haber sido modificadas o actualizadas. Para asesoría específica sobre su situación,
              consulte con un abogado colegiado en República Dominicana especializado en derecho inmobiliario.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

