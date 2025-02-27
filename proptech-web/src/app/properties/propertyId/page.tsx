"use client"; // Esto indica que es un componente cliente

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Property {
  title: string;
  description: string;
  price: number;
}

const PropertyDetailPage: React.FC = () => {
  const params = useParams();
  const id = params.propertyId; // ✅ Asegurar que obtenemos el parámetro correcto

  const [property, setProperty] = useState<Property | null>(null);

  useEffect(() => {
    if (id) {
      fetch(`https://proptech-mvp-1.onrender.com/properties/${id}`)
        .then((res) => res.json())
        .then((data) => setProperty(data))
        .catch((error) => console.error("Error fetching property:", error));
    }
  }, [id]);

  if (!property) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">{property.title}</h1>
      <p className="text-lg">{property.description}</p>
      <p className="text-xl font-semibold">Precio: ${property.price}</p>
    </div>
  );
};

export default PropertyDetailPage;
