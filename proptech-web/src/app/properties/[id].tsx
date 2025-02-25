interface PropertyDetailProps {
  params: {
    id: string;
  };
}

export default function PropertyDetail({ params }: PropertyDetailProps) {
    // Obtener los detalles de la propiedad según el ID
    return <div>Detalles de la propiedad {params.id}</div>;
  }
  