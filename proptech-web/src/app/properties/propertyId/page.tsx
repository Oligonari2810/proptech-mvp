"use client"; // 🔥 Necesario para manejar estado y efectos en Next.js

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
}

export default function PropertyDetailPage() {
  const params = useParams();
  const id = params.propertyId; // ✅ Asegurar que obtenemos el parámetro correcto

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("No se encontró el ID de la propiedad.");
      setLoading(false);
      return;
    }

    fetch(`https://proptech-mvp-1.onrender.com/properties/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("No se encontró la propiedad.");
        return res.json();
      })
      .then((data) => {
        setProperty(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error obteniendo la propiedad:", error);
        setError("Error cargando los datos. Inténtalo más tarde.");
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
    </div>
  );
}
