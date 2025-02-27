import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";

interface Property {
  title: string;
  description: string;
  price: number;
}

interface PropertyDetailProps {
  id: string;
}

const PropertyDetailPage: React.FC<PropertyDetailProps> = ({ id }) => {
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

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  if (!params || !params.id) {
    return {
      notFound: true, // Manejo de error si el ID no está definido
    };
  }

  return {
    props: { id: params.id }, // Pasamos solo el ID como string
  };
};

export default PropertyDetailPage;
