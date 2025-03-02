"use client";
import Link from "next/link";

export default function ServicesPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">📌 Servicios de HábitatProRD</h1>
      
      <div className="grid grid-cols-2 gap-6">
        {/* Buscador avanzado */}
        <div className="p-4 border rounded shadow">
          <h2 className="text-xl font-bold">🔍 Buscador Avanzado</h2>
          <p>Encuentra propiedades con filtros inteligentes y búsqueda predictiva.</p>
          <Link href="/properties" className="text-blue-500 hover:underline">Explorar propiedades</Link>
        </div>

        {/* Comparador de propiedades */}
        <div className="p-4 border rounded shadow">
          <h2 className="text-xl font-bold">📊 Comparador de Propiedades</h2>
          <p>Compara inmuebles según precio, ubicación y características.</p>
          <Link href="/compare" className="text-blue-500 hover:underline">Comparar propiedades</Link>
        </div>

        {/* Tasación automática */}
        <div className="p-4 border rounded shadow">
          <h2 className="text-xl font-bold">🏡 Valoración de Viviendas</h2>
          <p>Calcula el valor de tu propiedad en tiempo real con nuestro algoritmo de tasación.</p>
          <Link href="/valuation" className="text-blue-500 hover:underline">Valorar propiedad</Link>
        </div>

        {/* Publicar anuncio */}
        <div className="p-4 border rounded shadow">
          <h2 className="text-xl font-bold">📢 Publicar un Anuncio</h2>
          <p>Vende o alquila tu propiedad de manera rápida y segura.</p>
          <Link href="/post-property" className="text-blue-500 hover:underline">Publicar propiedad</Link>
        </div>

        {/* Contratos de alquiler */}
        <div className="p-4 border rounded shadow">
          <h2 className="text-xl font-bold">📜 Contratos y Gestión de Alquiler</h2>
          <p>Genera contratos automáticos y gestiona tus alquileres sin complicaciones.</p>
          <Link href="/rental-management" className="text-blue-500 hover:underline">Gestionar alquileres</Link>
        </div>

        {/* Subastas y propiedades de bancos */}
        <div className="p-4 border rounded shadow">
          <h2 className="text-xl font-bold">🏦 Propiedades en Subasta</h2>
          <p>Accede a inmuebles en remate bancario con oportunidades de inversión únicas.</p>
          <Link href="/bank-properties" className="text-blue-500 hover:underline">Ver propiedades de bancos</Link>
        </div>

        {/* Seguros y financiación */}
        <div className="p-4 border rounded shadow">
          <h2 className="text-xl font-bold">💰 Seguros y Financiación</h2>
          <p>Obtén financiación y protege tu inversión con seguros personalizados.</p>
          <Link href="/finance" className="text-blue-500 hover:underline">Más información</Link>
        </div>

        {/* Estudios de mercado */}
        <div className="p-4 border rounded shadow">
          <h2 className="text-xl font-bold">📊 Estudios de Mercado</h2>
          <p>Consulta análisis del mercado inmobiliario y tendencias de inversión.</p>
          <Link href="/market-research" className="text-blue-500 hover:underline">Ver análisis</Link>
        </div>
      </div>
    </div>
  );
}
