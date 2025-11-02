'use client'
import { useToast } from '../components/ToastNotification';
import { VoiceSearch } from '../components/VoiceSearch';

// Page debe ser dinámica para evitar prerender
export const dynamic = 'force-dynamic';

import React, { useState } from 'react'
import { LoadingOptimized, PageLoading, SectionLoading } from '../components/LoadingOptimized';
import PropertyForm from '../components/PropertyForm'
import { AddressAutocomplete } from '../components/AddressAutocomplete'

export default function VenderPage() {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('publicacion')
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          
        {/* Voice Search Integration */}
        <div className="mb-4 flex items-center gap-2">
          <VoiceSearch
            onResult={(text) => {
              addToast({
                type: 'success',
                title: 'Voz reconocida',
                message: `Buscando: "${text}"`,
                duration: 2000,
              });
              // Integrar con búsqueda existente
              if (typeof handleSearch === 'function') {
                handleSearch({ query: text });
              }
            }}
            onError={(error) => {
              addToast({
                type: 'error',
                title: 'Error en búsqueda por voz',
                message: error,
                duration: 4000,
              });
            }}
          />
        </div>

<h1 className="text-3xl font-bold text-gray-900">Convierte tu hogar en oportunidades</h1>
          <p className="text-gray-600 mt-2">
            Haz que tu propiedad brille con nuestra IA emocional y obtén el mejor precio de mercado
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {[
                { id: 'valoracion', name: 'Valoración Inteligente', icon: '💰' },
                { id: 'publicacion', name: 'Publicación', icon: '📱' },
                { id: 'seguimiento', name: 'Seguimiento', icon: '📊' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="block text-lg mb-1">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Contenido de Tabs */}
          <div className="p-6">
            {activeTab === 'valoracion' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Valoración Inteligente</h3>
                <p className="text-gray-600">
                  Nuestra IA analiza el mercado en tiempo real para darte el precio óptimo de venta.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dirección de la propiedad</label>
                    <AddressAutocomplete
                      value=""
                      onChange={(address, coords) => {
                        // Actualizar estado local si es necesario
                        console.log('Dirección seleccionada:', address, coords)
                      }}
                      placeholder="Buscar dirección en República Dominicana..."
                      country="do"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de propiedad</label>
                    <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>Seleccionar...</option>
                      <option>Casa</option>
                      <option>Apartamento</option>
                      <option>Ático</option>
                      <option>Dúplex</option>
                      <option>Local</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Metros cuadrados</label>
                    <input 
                      type="number" 
                      placeholder="m²"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Año de construcción</label>
                    <input 
                      type="number" 
                      placeholder="Ej: 2010"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200">
                  Calcular Valoración con IA
                </button>

                {/* Resultado de Valoración */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-blue-800 font-semibold">Valoración Estimada</div>
                      <div className="text-3xl font-bold text-blue-600 mt-1">€325,000 - €355,000</div>
                      <div className="text-blue-600 text-sm mt-2">
                        Basado en 25 propiedades similares en tu zona
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-600 font-semibold">+8.5%</div>
                      <div className="text-green-600 text-sm">Sobre valoración media</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'publicacion' && (
              <div className="space-y-6">
                {/* Mensajes de éxito/error */}
                {successMessage && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex">
                      <div className="text-green-600 text-lg mr-3">✅</div>
                      <div className="text-green-800 text-sm font-semibold">
                        {successMessage}
                      </div>
                    </div>
                  </div>
                )}
                
                {errorMessage && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex">
                      <div className="text-red-600 text-lg mr-3">❌</div>
                      <div className="text-red-800 text-sm font-semibold">
                        {errorMessage}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tip antes del formulario */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="text-yellow-600 text-lg mr-3">💡</div>
                    <div className="text-yellow-800 text-sm">
                      <strong>Consejo de IA:</strong> Las propiedades con descripciones emocionales 
                      (ej: &quot;acogedor&quot;, &quot;familiar&quot;, &quot;lujoso&quot;) reciben un 35% más de contactos.
                    </div>
                  </div>
                </div>

                {/* Formulario real de PropertyForm */}
                <PropertyForm
                  onSuccess={(property) => {
                    setSuccessMessage(`¡Propiedad "${property?.title}" publicada exitosamente!`)
                    setErrorMessage(null)
                    // Scroll a top
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  onError={(error) => {
                    setErrorMessage(error)
                    setSuccessMessage(null)
                  }}
                />
              </div>
            )}

            {activeTab === 'seguimiento' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Seguimiento y Métricas</h3>
                <p className="text-gray-600">
                  Monitoriza el rendimiento de tu publicación en tiempo real.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">156</div>
                    <div className="text-gray-600 text-sm">Visitas</div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">23</div>
                    <div className="text-gray-600 text-sm">Contactos</div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">8</div>
                    <div className="text-gray-600 text-sm">Visitas presenciales</div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">2</div>
                    <div className="text-gray-600 text-sm">Ofertas</div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center">
                    <div className="text-green-600 text-lg mr-3">🎯</div>
                    <div>
                      <div className="font-semibold text-green-800">Rendimiento Excelente</div>
                      <div className="text-green-600 text-sm">
                        Tu propiedad está recibiendo un 45% más de visitas que la media del mercado.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CTA Final */}
        <div className="text-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
            Comenzar a Vender
          </button>
          <p className="text-gray-500 text-sm mt-3">
            Sin compromiso • Sin comisiones ocultas • Asesoramiento profesional
          </p>
        </div>
      </div>
    </div>
  )
}
