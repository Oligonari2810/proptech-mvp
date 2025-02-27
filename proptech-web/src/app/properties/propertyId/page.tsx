"use client"; // ✅ Necesario porque usamos useEffect y useState

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // ✅ Nueva forma de obtener parámetros en app/

interface Property {
  title: string;
  description: string;
  price: number;
}

const PropertyDetailPage: React.FC = () => {
  const params = useParams(); // ✅ Obtiene el ID de la URL
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetch(`https://proptech-mvp-1.onrender.com/properties/${params.id}`)
        .then((res) => res.json())
        .then((data) => {
          setProperty(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching property:", error);
          setLoading(false);
        });
    }
  }, [params.id]);

  if (loading) return <p>Loading...</p>;
  if (!property) return <p>Property not found</p>;

  return (
    <div>
      <h1>{property.title}</h1>
      <p>{property.description}</p>
      <p>Precio: ${property.price}</p>
    </div>
  );
};

export default PropertyDetailPage;
