"use client"; // 👈 NECESARIO PARA USAR useEffect y useState

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Property {
  title: string;
  description: string;
  price: number;
}

const PropertyDetailPage: React.FC = () => {
  const params = useParams(); // Obtiene el ID desde la URL
  const [property, setProperty] = useState<Property | null>(null);

  useEffect(() => {
    if (params?.id) {
      fetch(`https://proptech-mvp-1.onrender.com/properties/${params.id}`)
        .then((res) => res.json())
        .then((data) => setProperty(data))
        .catch((error) => console.error("Error fetching property:", error));
    }
  }, [params?.id]);

  if (!property) return <p>Loading...</p>;

  return (
    <div>
      <h1>{property.title}</h1>
      <p>{property.description}</p>
      <p>Precio: ${property.price}</p>
    </div>
  );
};

export default PropertyDetailPage;
