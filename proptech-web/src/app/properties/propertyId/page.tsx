"use client"; // Esto indica que es un componente cliente

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Property {
  title: string;
  description: string;
  price: number;
}

const PropertyDetailPage: React.FC = () => {
  const { id } = useParams();
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
    <div>
      <h1>{property.title}</h1>
      <p>{property.description}</p>
      <p>Precio: ${property.price}</p>
    </div>
  );
};

export default PropertyDetailPage;
