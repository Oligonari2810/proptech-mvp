'use client'

import React from 'react'
import Link from 'next/link'
import GlobalSearch from './components/ui/GlobalSearch'
import type { SearchState } from './components/ui/types/search'
import { FeaturedSection } from './components/featured/FeaturedSection'
import { EmotionalSearchChatbot } from './components/ai/EmotionalSearchChatbot'

export default function HomePage() {
  // 🔧 Handler existente: conecta con tu lógica real (router / API / store)
  const handleSearch = (filters: SearchState) => {
    // Ejemplo de integración:
    // router.push(`/comprar?${new URLSearchParams(filters as any)}`)
    // o dispatch a store de búsqueda
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section con imagen principal */}
      <div className="relative h-[85vh] w-full overflow-hidden">
        {/* Imagen de fondo */}
        <div className="absolute inset-0">
          <img
            src="/images/hero/hero_family_livingroom_16x9.jpg"
            alt="Familia sonriendo en salón luminoso - HabitatPro"
            className="w-full h-full object-cover brightness-[0.9]"
          />
        </div>
        
        {/* Overlay con gradiente sutil */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B]/60 via-transparent to-transparent" />
        
        {/* Contenido centrado */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
              Donde las llaves abren más que puertas, <span className="text-[#E5B769]">abren sueños</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto drop-shadow-md">
              La inteligencia artificial que siente lo que necesitas, combinada con el calor humano que mereces en cada paso
            </p>
          
            {/* GlobalSearch integrado */}
            <div className="mb-12">
              <GlobalSearch onSearch={handleSearch} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Propiedades Destacadas */}
      <FeaturedSection title="Propiedades Destacadas" maxItems={6} />

      {/* Sección de navegación */}
      <div className="bg-[#F9F5EC] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1E293B] mb-4">
              Hogares que late, no solo espacios
            </h2>
            <p className="text-lg text-[#A3A08B]">
              Cada propiedad tiene una historia. Nosotros te ayudamos a encontrar la tuya
            </p>
          </div>
          
          {/* Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/comprar" className="group">
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-200 group-hover:border-[#E5B769] group-hover:scale-105">
                <div className="text-4xl mb-4">🏠</div>
                <h3 className="text-xl font-semibold text-[#1E293B] mb-2">Comprar</h3>
                <p className="text-[#A3A08B] text-sm">Tu hogar ideal te está esperando</p>
              </div>
            </Link>
            
            <Link href="/alquilar" className="group">
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-200 group-hover:border-[#E5B769] group-hover:scale-105">
                <div className="text-4xl mb-4">🔑</div>
                <h3 className="text-xl font-semibold text-[#1E293B] mb-2">Alquilar</h3>
                <p className="text-[#A3A08B] text-sm">Llaves para empezar tu historia</p>
              </div>
            </Link>
            
            <Link href="/invertir" className="group">
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-200 group-hover:border-[#E5B769] group-hover:scale-105">
                <div className="text-4xl mb-4">📈</div>
                <h3 className="text-xl font-semibold text-[#1E293B] mb-2">Invertir</h3>
                <p className="text-[#A3A08B] text-sm">Construye tu legado inmobiliario</p>
              </div>
            </Link>
            
            <Link href="/vender" className="group">
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-200 group-hover:border-[#E5B769] group-hover:scale-105">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-semibold text-[#1E293B] mb-2">Vender</h3>
                <p className="text-[#A3A08B] text-sm">Convierte tu propiedad en oportunidades</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            ¿Por qué elegir HabitatPro?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🧠</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">IA que siente tu esencia</h3>
              <p className="text-gray-600">No solo buscamos propiedades, encontramos espacios donde tus risas resonarán por años</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Búsqueda con alma</h3>
              <p className="text-gray-600">Dejamos atrás los filtros fríos para conectar con lo que realmente importa: tu bienestar</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">💖</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Asesoría que abraza</h3>
              <p className="text-gray-600">Tecnología con latido, profesionales que escuchan antes de vender</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Link 
            href="/comprar" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors duration-200"
          >
            Comenzar mi historia
          </Link>
        </div>
      </div>

      {/* Chatbot de IA Emocional */}
      <EmotionalSearchChatbot 
        showSuggestions={true}
        onPropertySelect={(property) => {
          // Redirigir a la página de detalle de la propiedad
          window.location.href = `/properties/${property.id}`;
        }}
      />
    </div>
  )
}
