"use client";
import { useState } from 'react';
import AssetPlaceholder from '../../components/ui/AssetPlaceholder';
import { HABITATPRO_IMAGES } from '../../config/images';

export default function AssetsPage() {
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof HABITATPRO_IMAGES>('hero');
  
  const categories = Object.keys(HABITATPRO_IMAGES) as (keyof typeof HABITATPRO_IMAGES)[];
  
  const getCategoryInfo = (category: keyof typeof HABITATPRO_IMAGES) => {
    const info = {
      hero: { title: 'Imágenes Hero', description: 'Imágenes principales para landing pages', count: 2 },
      lifestyle: { title: 'Lifestyle', description: 'Imágenes de estilo de vida y hogar', count: 3 },
      professionals: { title: 'Profesionales', description: 'Retratos y equipo profesional', count: 2 },
      dashboards: { title: 'Dashboards', description: 'Interfaces y pantallas de administración', count: 1 }
    };
    return info[category];
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">🎨 Gestión de Assets Visuales</h1>
        <p className="text-slate-600">Genera y gestiona las imágenes premium de HabitatPro con Midjourney</p>
      </div>

      {/* Navegación por categorías */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Categorías de Assets</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map(category => {
            const info = getCategoryInfo(category);
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedCategory === category
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <h3 className="font-semibold">{info.title}</h3>
                <p className="text-sm text-gray-600">{info.description}</p>
                <p className="text-xs text-gray-500 mt-1">{info.count} assets</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Assets de la categoría seleccionada */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-6">
          {getCategoryInfo(selectedCategory).title} - Instrucciones de Generación
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.keys(HABITATPRO_IMAGES[selectedCategory] as Record<string, string>).map(type => {
            if (type === 'fallback') return null;
            return (
              <AssetPlaceholder
                key={type}
                category={selectedCategory}
                type={type}
                className="h-auto"
              />
            );
          })}
        </div>
      </div>

      {/* Instrucciones generales */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
        <h2 className="text-xl font-semibold text-blue-800 mb-4">🚀 Proceso de Integración</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-blue-700 mb-2">1. Generación con Midjourney</h3>
            <ul className="text-sm text-blue-600 space-y-1">
              <li>• Usa los prompts específicos de cada asset</li>
              <li>• Genera 4 variantes por imagen</li>
              <li>• Elige la más natural y realista</li>
              <li>• Usa upscale para máxima calidad</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-blue-700 mb-2">2. Optimización y Carga</h3>
            <ul className="text-sm text-blue-600 space-y-1">
              <li>• Convierte a formato WebP</li>
              <li>• Redimensiona según especificaciones</li>
              <li>• Coloca en el directorio correcto</li>
              <li>• Verifica que se carguen correctamente</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
