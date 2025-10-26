"use client";
import { useState } from 'react';
import ImageOptimizer, { HeroImage, LifestyleImage, ProfessionalImage } from '../components/ui/ImageOptimizer';
import { HABITATPRO_IMAGES } from '../config/images';

export default function DemoAssetsPage() {
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">🎨 Demo de Assets Visuales</h1>
          <p className="text-slate-600">Sistema de gestión de imágenes premium con placeholders inteligentes</p>
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

        {/* Demo de imágenes */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-6">
            {getCategoryInfo(selectedCategory).title} - Vista Previa
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.keys(HABITATPRO_IMAGES[selectedCategory] as Record<string, string>).map(type => {
              if (type === 'fallback') return null;
              
              return (
                <div key={type} className="space-y-4">
                  <h3 className="font-semibold text-lg capitalize">{type}</h3>
                  
                  {selectedCategory === 'hero' && (
                    <div className="h-64">
                      <HeroImage type={type} className="w-full h-full" />
                    </div>
                  )}
                  
                  {selectedCategory === 'lifestyle' && (
                    <div className="h-48">
                      <LifestyleImage type={type} className="w-full h-full" />
                    </div>
                  )}
                  
                  {selectedCategory === 'professionals' && (
                    <div className="h-48 w-48 mx-auto">
                      <ProfessionalImage type={type} className="w-full h-full" />
                    </div>
                  )}
                  
                  {selectedCategory === 'dashboards' && (
                    <div className="h-48">
                      <ImageOptimizer
                        category={selectedCategory}
                        type={type}
                        alt={`Dashboard ${type}`}
                        className="w-full h-full rounded-lg"
                      />
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-600">
                    <p><strong>Ruta:</strong> {HABITATPRO_IMAGES[selectedCategory][type as keyof typeof HABITATPRO_IMAGES[typeof selectedCategory]]}</p>
                    <p><strong>Estado:</strong> {type === 'main' ? 'Placeholder activo' : 'Imagen no encontrada'}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Instrucciones */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">🚀 Cómo Integrar tus Imágenes</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-blue-700 mb-2">1. Genera con Midjourney</h3>
              <ul className="text-sm text-blue-600 space-y-1">
                <li>• Ve a <code className="bg-blue-100 px-1 rounded">/admin/assets</code> para prompts</li>
                <li>• Genera 4 variantes por imagen</li>
                <li>• Elige la más natural y realista</li>
                <li>• Usa upscale para máxima calidad</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-blue-700 mb-2">2. Optimiza y Coloca</h3>
              <ul className="text-sm text-blue-600 space-y-1">
                <li>• Convierte a formato WebP</li>
                <li>• Redimensiona según especificaciones</li>
                <li>• Coloca en el directorio correcto</li>
                <li>• Los placeholders se reemplazarán automáticamente</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
