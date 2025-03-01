"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Definir el tipo correcto para `Property`
interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  image_url: string;
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("📌 BACKEND URL:", process.env.NEXT_PUBLIC_BACKEND_URL);

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/properties`)
      .then((res) => res.json())
      .then((data) => {
        console.log("📥 Propiedades recibidas:", data);
        setProperties(data);
      })
      .catch((error) => {
        console.error("❌ Error al cargar propiedades:", error);
        setError("Error al conectar con la API.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Listado de Propiedades</h1>

      {/* 🔹 Botón para agregar propiedades */}
      <div className="mb-4">
        <Link href="/properties/add" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          ➕ Agregar Propiedad
        </Link>
      </div>

      {/* 🔹 Manejo de errores y carga */}
      {loading && <p className="text-center">Cargando propiedades...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      {/* 🔹 Renderizar la lista de propiedades */}
      {properties.length > 0 ? (
        <ul className="space-y-4">
          {properties.map((property) => (
            <li key={property.id} className="border p-4 rounded shadow">
              <Link href={`/properties/${property.id}`}>
                <span className="text-blue-500 hover:underline text-lg font-semibold">
                  {property.title}
                </span>
              </Link>
              <p className="text-gray-600">{property.description}</p>
              <p className="font-bold">${property.price}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No hay propiedades disponibles.</p>
      )}
    </div>
  );
}
