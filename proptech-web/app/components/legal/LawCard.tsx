'use client';

import React from 'react';
import Link from 'next/link';
import { Law } from '@/app/lib/legal/laws';

interface Props {
  law: Law;
  compact?: boolean;
}

export function LawCard({ law, compact = false }: Props) {
  const categoryColors: Record<string, string> = {
    fiscal: 'bg-blue-100 text-blue-800 border-blue-200',
    propiedad: 'bg-green-100 text-green-800 border-green-200',
    condominios: 'bg-purple-100 text-purple-800 border-purple-200',
    extranjeros: 'bg-orange-100 text-orange-800 border-orange-200',
    tributacion: 'bg-red-100 text-red-800 border-red-200',
    registro: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    notarial: 'bg-indigo-100 text-indigo-800 border-indigo-200'
  };

  const categoryIcons: Record<string, string> = {
    fiscal: '💰',
    propiedad: '🏠',
    condominios: '🏢',
    extranjeros: '🌎',
    tributacion: '📊',
    registro: '📝',
    notarial: '⚖️'
  };

  const categoryLabel: Record<string, string> = {
    fiscal: 'Fiscal',
    propiedad: 'Propiedad',
    condominios: 'Condominios',
    extranjeros: 'Extranjeros',
    tributacion: 'Tributación',
    registro: 'Registro',
    notarial: 'Notarial'
  };

  return (
    <Link 
      href={`/leyes-inmobiliarias/${law.id}`}
      className="block"
    >
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 p-6 h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{categoryIcons[law.categoria] || '⚖️'}</span>
              <span className={`px-2 py-1 rounded text-xs font-semibold border ${categoryColors[law.categoria]}`}>
                {categoryLabel[law.categoria] || law.categoria}
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              {law.nombre}
            </h3>
            <p className="text-sm text-gray-500">
              {law.numero} • {law.fecha}
            </p>
          </div>
        </div>

        {/* Descripción */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {law.descripcion}
        </p>

        {/* Información adicional */}
        <div className="flex flex-wrap gap-2 mb-4">
          {law.aplicabilidad.map((tipo) => {
            const tipoLabels: Record<string, string> = {
              compra: '📦 Compra',
              venta: '💵 Venta',
              alquiler: '🔑 Alquiler',
              inversion: '💹 Inversión',
              extranjeros: '🌎 Extranjeros'
            };
            return (
              <span 
                key={tipo}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
              >
                {tipoLabels[tipo] || tipo}
              </span>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            {law.articulos.length} artículo{law.articulos.length !== 1 ? 's' : ''}
          </div>
          <div className="text-xs text-gray-500">
            Actualizado: {law.ultimaActualizacion}
          </div>
        </div>
      </div>
    </Link>
  );
}

