"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

// Definir el tipo correcto para `Property`
interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  image_url: string;
  bedrooms: number;
  bathrooms: number;
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 🔹 Estado para los filtros avanzados
  const [filters, setFilters] = useState({
    location: "",
    min_price: "",
    max_price: "",
    property_type: "",
    bedrooms: "",
    bathrooms: "",
    min_surface: "",
    max_surface: "",
    min_year_built: "",
    max_year_built: "",
    has_pool: false,
    has_garage: false,
    has_elevator: false,
    has_basement: false,
    is_luxury: false,
    is_bank_owned: false,
    has_virtual_tour: false
  });

  // ✅ Función para obtener propiedades desde la API con los filtros seleccionados
  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);

    // 🔹 Construimos la URL con los filtros seleccionados
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "" && value !== false) {
        queryParams.append(key, value.toString());
      }
    });

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/properties/?${queryParams.toString()}`;

    try {
      console.log("📌 BACKEND URL:", url);
      const response = await fetch(url);
      const data = await response.json();
      console.log("📥 Propiedades recibidas:", data);
      setProperties(data);
    } catch (error) {
      console.error("❌ Error al cargar propiedades:", error);
      setError("Error al conectar con la API.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // ✅ Cargar propiedades al inicio
  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">🏡 Propiedades en Venta</h1>

      {/* 🔹 Filtros avanzados */}
      <div className="bg-gray-100 p-4 rounded-md mb-6">
        <h2 className="text-lg font-semibold mb-2">🔍 Filtros Avanzados</h2>
        <div className="grid grid-cols-3 gap-4">
          <input type="text" name="location" placeholder="Ubicación" value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} className="border p-2 rounded" />
          <input type="number" name="min_price" placeholder="Precio Mínimo" value={filters.min_price} onChange={(e) => setFilters({ ...filters, min_price: e.target.value })} className="border p-2 rounded" />
          <input type="number" name="max_price" placeholder="Precio Máximo" value={filters.max_price} onChange={(e) => setFilters({ ...filters, max_price: e.target.value })} className="border p-2 rounded" />
        </div>
      </div>

      {/* 🔹 Resultados */}
      {loading ? (
        <p>🔄 Cargando propiedades...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <ul className="grid grid-cols-3 gap-4">
          {properties.map((prop) => (
            <li key={prop.id} className="border p-4 rounded shadow">
              <Link href={`/properties/${prop.id}`}>
                <span className="text-blue-500 hover:underline text-lg font-semibold">
                  {prop.title}
                </span>
              </Link>
              <p>📍 {prop.location}</p>
              <p>💰 ${prop.price}</p>
              <p>🛏 {prop.bedrooms} hab. | 🚿 {prop.bathrooms} baños</p>
              <Image src={prop.image_url} alt={prop.title} width={500} height={300} className="w-full h-40 object-cover rounded mt-2" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
