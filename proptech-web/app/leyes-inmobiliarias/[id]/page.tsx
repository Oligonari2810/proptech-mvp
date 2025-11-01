'use client';

import React from 'react';
import Link from 'next/link';
import { dominicanLaws, Law } from '../../../lib/legal/laws';
import { notFound } from 'next/navigation';

interface Props {
  params: {
    id: string;
  };
}

export default function LawDetailPage({ params }: Props) {
  const law = dominicanLaws.find(l => l.id === params.id);

  if (!law) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Ley no encontrada
          </h1>
          <Link href="/leyes-inmobiliarias" className="text-blue-600 hover:underline">
            Volver a la biblioteca
          </Link>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link 
            href="/leyes-inmobiliarias" 
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            ← Volver a la biblioteca
          </Link>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{categoryIcons[law.categoria] || '⚖️'}</span>
              <div>
                <span className={`px-3 py-1 rounded text-sm font-semibold border ${categoryColors[law.categoria]}`}>
                  {categoryLabel[law.categoria] || law.categoria}
                </span>
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {law.nombre}
          </h1>
          <p className="text-gray-600 mb-4">
            {law.numero} • Promulgada en {law.fecha} • Actualizada: {law.ultimaActualizacion}
          </p>

          <p className="text-gray-700 leading-relaxed">
            {law.descripcion}
          </p>

          {/* Aplicabilidad */}
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="text-sm text-gray-600 font-medium">Aplicable a:</span>
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
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm font-medium"
                >
                  {tipoLabels[tipo] || tipo}
                </span>
              );
            })}
          </div>
        </div>

        {/* Artículos */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Artículos Principales
          </h2>

          <div className="space-y-6">
            {law.articulos.map((articulo, index) => (
              <div 
                key={index}
                className="border-l-4 border-blue-500 pl-6 py-4 bg-blue-50 rounded-r-lg"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-bold text-blue-700">{articulo.numero}</span>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {articulo.titulo}
                  </h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {articulo.contenido}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Enlaces */}
        {law.enlaces && law.enlaces.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Enlaces Oficiales
            </h3>
            <ul className="space-y-2">
              {law.enlaces.map((enlace, index) => (
                <li key={index}>
                  <a 
                    href={enlace}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline text-sm"
                  >
                    {enlace}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Disclaimer Legal */}
        <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
          <div className="flex items-start">
            <span className="text-orange-600 text-2xl mr-3">⚠️</span>
            <div>
              <h3 className="font-semibold text-orange-800 mb-2">
                Aviso Legal
              </h3>
              <p className="text-sm text-orange-700">
                Esta información es de carácter educativo e informativo. No constituye asesoría legal profesional.
                Las leyes pueden haber sido modificadas. Para asesoría específica, consulte con un abogado 
                colegiado especializado en derecho inmobiliario.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

