"use client"; // 🔥 Necesario para manejar estado y efectos en Next.js

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";

interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  image_url: string;
}

export default function PropertyDetailPage() {
  const { propertyId } = useParams();
  const id = Array.isArray(propertyId) ? propertyId[0] : propertyId; // ✅ Asegurar que obtenemos un ID válido

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("❌ No se encontró el ID de la propiedad.");
      setLoading(false);
      return;
    }

    console.log("📌 Buscando propiedad con ID:", id); // 🔍 DEBUG: Verificar qué ID estamos obteniendo

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/properties/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("No se encontró la propiedad.");
        return res.json();
      })
      .then((data) => {
        setProperty(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ Error obteniendo la propiedad:", error);
        setError("⚠️ Error cargando los datos. Inténtalo más tarde.");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>🔄 Cargando propiedad...</p>;
  if (error) return <p>❌ {error}</p>;
  if (!property) return <p>⚠️ Propiedad no encontrada.</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">{property.title}</h1>
      <p className="text-lg">{property.description}</p>
      <p className="text-xl font-semibold">💰 Precio: ${property.price}</p>
      <p className="text-gray-600">📍 Ubicación: {property.location}</p>
<Image 
  src={property.image_url} 
  alt={property.title} 
  width={500}  // Ajusta el tamaño según necesites
  height={300} 
  className="w-full max-w-lg mt-4 rounded-lg shadow-md" 
  objectFit="cover" 
/>
    </div>
  );
}
