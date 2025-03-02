"use client";

import Link from "next/link";

type ServiceCardProps = {
  title: string;
  description: string;
  link: string;
  linkText: string;
};

export default function ServicesPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">📌 Servicios de HábitatProRD</h1>

      <div className="grid grid-cols-2 gap-6">
        <ServiceCard 
          title="🔍 Buscador Avanzado"
          description="Encuentra propiedades con filtros inteligentes y búsqueda predictiva."
          link="/properties"
          linkText="Explorar propiedades"
        />
        <ServiceCard 
          title="📊 Comparador de Propiedades"
          description="Compara inmuebles según precio, ubicación y características."
          link="/services/property-comparison"
          linkText="Comparar propiedades"
        />
        <ServiceCard 
          title="🏡 Valoración de Viviendas"
          description="Calcula el valor de tu propiedad en tiempo real con nuestro algoritmo de tasación."
          link="/services/property-valuation"
          linkText="Valorar propiedad"
        />
        <ServiceCard 
          title="📢 Publicar un Anuncio"
          description="Vende o alquila tu propiedad de manera rápida y segura."
          link="/services/post-listing"
          linkText="Publicar propiedad"
        />
        <ServiceCard 
          title="📜 Contratos y Gestión de Alquiler"
          description="Genera contratos automáticos y gestiona tus alquileres sin complicaciones."
          link="/services/rental-management"
          linkText="Gestionar alquileres"
        />
        <ServiceCard 
          title="🏦 Propiedades en Subasta"
          description="Accede a inmuebles en remate bancario con oportunidades de inversión únicas."
          link="/services/bank-properties"
          linkText="Ver propiedades de bancos"
        />
        <ServiceCard 
          title="💰 Seguros y Financiación"
          description="Obtén financiación y protege tu inversión con seguros personalizados."
          link="/services/insurance-financing"
          linkText="Más información"
        />
        <ServiceCard 
          title="📈 Estudios de Mercado"
          description="Consulta análisis del mercado inmobiliario y tendencias de inversión."
          link="/services/market-research"
          linkText="Ver análisis"
        />
        <ServiceCard 
          title="🏠 iBuying - Venta Inmediata"
          description="Vende tu propiedad de forma rápida con nuestra plataforma de compra instantánea."
          link="/services/ibuying"
          linkText="Vender ahora"
        />
        <ServiceCard 
          title="🗺️ Búsqueda por Mapa"
          description="Explora propiedades directamente en un mapa interactivo."
          link="/services/map-search"
          linkText="Ver mapa"
        />
      </div>
    </div>
  );
}

function ServiceCard({ title, description, link, linkText }: ServiceCardProps) {
  return (
    <div className="border p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-gray-600">{description}</p>
      <Link href={link} className="text-blue-500 hover:underline block mt-2">
        {linkText}
      </Link>
    </div>
  );
}

