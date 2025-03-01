"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    console.log("📌 BACKEND URL:", process.env.NEXT_PUBLIC_BACKEND_URL);

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/properties`)
      .then((res) => res.json())
      .then((data) => {
        console.log("📥 Propiedades recibidas:", data);
        setProperties(data);
      })
      .catch((error) => console.error("❌ Error al cargar propiedades:", error));
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

      {/* 🔹 Listado de Propiedades */}
      {properties.length > 0 ? (
        <ul className="space-y-4">
          {properties.map((property: any) => (
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