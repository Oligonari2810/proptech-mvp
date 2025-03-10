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
  
  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/properties/`;
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
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">🏡 Propiedades en Venta</h1>

      {/* 🔹 Imágenes de propiedades */}
      <div className="grid grid-cols-3 gap-4 my-6">
        <Image 
          src="https://res.cloudinary.com/dvbdg1pex/image/upload/v1741550991/casa_k9z13f.jpg" 
          alt="Casa" 
          width={300} 
          height={200} 
        />
        <Image 
          src="https://res.cloudinary.com/dvbdg1pex/image/upload/v1741552606/apartamento_g9l9r5.webp" 
          alt="Apartamento" 
          width={300} 
          height={200} 
        />
        <Image 
          src="https://res.cloudinary.com/dvbdg1pex/image/upload/v1741550176/apartamento.jpg" 
          alt="Comercial" 
          width={300} 
          height={200} 
        />
      </div>

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
              <Image 
                src={prop.image_url} 
                alt={prop.title} 
                width={500} 
                height={300} 
                className="w-full h-40 object-cover rounded mt-2" 
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}