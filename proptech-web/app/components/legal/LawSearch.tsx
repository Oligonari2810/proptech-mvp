'use client';

import React, { useState } from 'react';
import { Law } from '../../lib/legal/laws';

interface Props {
  laws: Law[];
  onFilterChange: (filtered: Law[]) => void;
}

export function LawSearch({ laws, onFilterChange }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedApplicability, setSelectedApplicability] = useState<string>('all');

  const categories = Array.from(new Set(laws.map(law => law.categoria)));
  const applicabilities = Array.from(
    new Set(laws.flatMap(law => law.aplicabilidad))
  );

  React.useEffect(() => {
    let filtered = [...laws];

    // Filtrar por búsqueda
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(law =>
        law.nombre.toLowerCase().includes(lowerQuery) ||
        law.descripcion.toLowerCase().includes(lowerQuery) ||
        law.numero.toLowerCase().includes(lowerQuery) ||
        law.articulos.some(art =>
          art.titulo.toLowerCase().includes(lowerQuery) ||
          art.contenido.toLowerCase().includes(lowerQuery)
        )
      );
    }

    // Filtrar por categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(law => law.categoria === selectedCategory);
    }

    // Filtrar por aplicabilidad
    if (selectedApplicability !== 'all') {
      filtered = filtered.filter(law =>
        law.aplicabilidad.includes(selectedApplicability as any)
      );
    }

    onFilterChange(filtered);
  }, [searchQuery, selectedCategory, selectedApplicability, laws, onFilterChange]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        🔍 Buscar Leyes
      </h3>

      {/* Búsqueda por texto */}
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar por nombre, número, descripción o artículo..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Filtro por categoría */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoría
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todas las categorías</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por aplicabilidad */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Aplicable a
          </label>
          <select
            value={selectedApplicability}
            onChange={(e) => setSelectedApplicability(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todas las operaciones</option>
            {applicabilities.map(app => (
              <option key={app} value={app}>
                {app.charAt(0).toUpperCase() + app.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Botón limpiar filtros */}
      {(searchQuery || selectedCategory !== 'all' || selectedApplicability !== 'all') && (
        <button
          onClick={() => {
            setSearchQuery('');
            setSelectedCategory('all');
            setSelectedApplicability('all');
          }}
          className="mt-4 text-sm text-blue-600 hover:text-blue-800 underline"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}

